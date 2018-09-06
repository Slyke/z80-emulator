var showFPS = getLocalStorage('showFPS', false) !== "false";
var showMemoryInspector = getLocalStorage('showMemoryInspector', true) !== "false";
var consoleOutWarnings = getLocalStorage('consoleOutWarnings', true) !== "false";
var loadSpaceInvadersByDefault = getLocalStorage('loadSpaceInvadersByDefault', true) !== "false";
var fontStyle = "monospace"; // "Megrim";

var romLoaded = 0;
var cpuCanStart = false;
var cpuRunning = false;
var previouslyExecInstructions = [];
var loadedMemoryFilesList = [];

var screenDimensions = [0, 0];
var gameDimensions = [224, 256];
var gameTopLeftCoord = [0.05, 0.05]
var gameScale = getLocalStorage('gameScale', 1.5);
var gameScreenRenderData = new Image();
var gameScreenImageData = [];
var memoryMapImageData = [];
var screenRedrawing = false;
var screenRedrawingMemMap = false;

var frameCount = 0;
var fpsNumber = 0;

var isAnimating = true;
var cpuClock;

var objCanvas;

var runningCPU = z80CPU();

var persistantObjects = {
  flags: {},
  debug: {},
  cc: {},
  memoryInspect: {},
  stackPointer: {},
  screenBox: {},
  portInfo: {},
  mm: {},
  gameFiles: {}
};

function fileDropHandler(event) {
  event.preventDefault();
  event.stopPropagation();
  if (event.dataTransfer.files.length > 1) {
    console.error("Error: Uploaded too many files at the same time. Only upload one at a time, to ensure the order is correct.");
    return;
  }

  var uploadedFile = event.dataTransfer.files[0];

  var fileExt = uploadedFile.name.substring(uploadedFile.name.lastIndexOf('.') + 1);

  if (fileExt === "bin") {
    var reader = new FileReader();

    reader.onload = function (event) {
      cpuRunning = false;

      if (loadedMemoryFilesList.length === 0) {
        runningCPU = z80CPU();
        runningCPU.memory = new Array();
        setupCPUCallbacks();
      }

      memoryOffset = runningCPU.memory.length;
      var byteArray = new Uint8Array(event.target.result);
      for (var i = 0; i < byteArray.byteLength; i++) {
        runningCPU.memory[i + memoryOffset] = byteArray[i];
      }
      loadedMemoryFilesList.push(uploadedFile.name);

      renderMemoryMap(runningCPU, runningCPU.db.memoryUpdated, true);
    };

    reader.onerror = function (err) {
      console.log("Error loading binary data from file: ", err)
    };

    reader.readAsArrayBuffer(uploadedFile);
  } else if (fileExt === "json") {
    var reader = new FileReader();

    reader.onload = function (event) {
      cpuRunning = false;

      if (loadedMemoryFilesList.length === 0) {
        runningCPU = z80CPU();
        runningCPU.memory = new Array();
        setupCPUCallbacks();
      }

      memoryOffset = runningCPU.memory.length;
      var jsonGame = JSON.parse(event.target.result);
      var jsonData = jsonGame.data;
      for (var i = 0; i < jsonData.length; i++) {
        runningCPU.memory[i + memoryOffset] = parseInt("0x" + jsonData[i]);
      }
      loadedMemoryFilesList.push(uploadedFile.name);

      renderMemoryMap(runningCPU, runningCPU.db.memoryUpdated, true);
    };

    reader.onerror = function (err) {
      console.log("Error loading json data from file: ", err)
    };

    reader.readAsText(uploadedFile);
  } else {
    console.error("Error, ", fileExt, "is not a valid file type. Only *.bin and *.json are valid.");
  }

  renderMemoryMap(runningCPU, runningCPU.db.memoryUpdated, true);
}

function getLocalStorage(key, defaultValue) {
  if (localStorage.getItem(key) === null) {
    localStorage.setItem(key, defaultValue)
  }

  return localStorage.getItem(key);
}

function setupEventHandlers(objCanvas, objCanvasController) {
  objCanvas.addEventListener('click', function(e) {
    objCanvasController.mouseEventHandler(e, "Click");
  });
  window.addEventListener("keydown", function(e){
    keyEvents(e, "down");
  });
  window.addEventListener("keyup", function(e){
    keyEvents(e, "up");
  });
  window.addEventListener("keypress", function(e){
    keyEvents(e, "press");
  });
}

function animateLoop() {
  var currentTime = new Date().getTime();
  var timeDiff = ((currentTime - lastAnimationTime) / 1000);
  frameCount++
  if (frameCount > 5) {
    frameCount = 0;
    fpsNumber = Math.round((1 / timeDiff), 1);
  }

  canvasControl.canvasObjects = [];

  uiPreframeSetup(canvasControl, runningCPU, persistantObjects, cpuCanStart, showMemoryInspector);

  if (cpuCanStart && cpuRunning && runningCPU.db.videoMemoryUpdated.length > 1 && !screenRedrawing) {
    renderGameScreen(runningCPU, runningCPU.db.videoMemoryUpdated);
  }

  if (cpuCanStart && cpuRunning && runningCPU.db.memoryUpdated.length > 1 && !screenRedrawingMemMap) {
    renderMemoryMap(runningCPU, runningCPU.db.memoryUpdated, true);
  }
  
  if (showFPS) {
    var lblFPS = {
      "x": 0,
      "y": 0,
      "name":"lblFPS",
      "text":"FPS: " + fpsNumber,
      "shape":"text",
      "gameProperties": {
        "class":"text"
      },
      "render":function(self) {
        canvasControl.drawText(self.x, self.y, self.text, self, null, null, {"fillStyle":"#99FF00"});
      },
      "visible":true
    };
    canvasControl.canvasObjects.push(lblFPS);
  }

  if (isAnimating) {
    this.lastAnimationTime = currentTime;

    canvasControl.refreshScreen(false);

    if (gameScale === 1) { // Dump video array to canvas (no resize).
      canvasControl.canvasContext.putImageData(gameScreenImageData, relToAbs(gameTopLeftCoord[0], 0), relToAbs(gameTopLeftCoord[1], 1));
    }
    
    
    if (showMemoryInspector) {
      canvasControl.canvasContext.putImageData(memoryMapImageData, relToAbs(0.75, 0), relToAbs(0.63, 1));
    }
    
    requestAnimationFrame(() => { animateLoop(); });
  }

}

function renderMemoryMap(cpuState, memoryList, fullRender = false) {
  screenRedrawingMemMap = true;

  if (fullRender) {
    for (var i = 0; i < cpuState.memory.length; i++) {
      var color = 0x00;
      var colorRAM = 0x00;
      if ((i * 4) < 0x2000) { // ROM
        color = 0x22;
      }
      if ((i * 4) > 0x2400 && (i * 4) < 0x4000) { // Video
        color = 0x55;
      }
      if ((i * 4) > 0x4000) { // RAM
        colorRAM = 0x55;
      }
      memoryMapImageData.data[(i * 4)] = cpuState.memory[i];
      memoryMapImageData.data[(i * 4) + 1] = cpuState.memory[i] ? (color | colorRAM) : 0;
      memoryMapImageData.data[(i * 4) + 2] = cpuState.memory[i] ? color : 0;
    }
    memoryMapImageData.data[(cpuState.flags.pc * 4) + 1] = 255;
    memoryMapImageData.data[(cpuState.flags.sp * 4) + 2] = 255;
  } else {
    while((memoryIndex = memoryList.pop()) != null) {
      var color = 0x00;
      if ((memoryIndex * 4) < 0x2000) { // ROM
        color = 0x22;
      }
      if ((memoryIndex * 4) > 0x2400) { // Video
        color = 0x55;
      }
      memoryMapImageData.data[memoryIndex * 4] = cpuState.memory[memoryIndex];
      memoryMapImageData.data[(memoryIndex * 4) + 1] = cpuState.memory[memoryIndex] ? color : 0;
      memoryMapImageData.data[(memoryIndex * 4) + 2] = cpuState.memory[memoryIndex] ? color : 0;
      memoryMapImageData.data[(memoryIndex * 4) + 3] = 255;
      memoryMapImageData.data[(cpuState.flags.pc * 4) + 1] = 255;
      memoryMapImageData.data[(cpuState.flags.sp * 4) + 2] = 255;
    }
  }

  screenRedrawingMemMap = false;
}

function renderGameScreen(cpuState, memoryList) {
  screenRedrawing = true;

  while((memoryIndex = memoryList.pop()) != null) {
    var normalizedPixelIndex = memoryIndex - 0x2400;
    var x = normalizedPixelIndex >> 5;
    var y = ~(((normalizedPixelIndex & 0x1f) * 8) & 0xff) & 0xff;

    for(var k = 0; k < 8; ++k) {
      writeGamePixel(x, y, cpuState.memory[memoryIndex], k);
    }
  }

  screenRedrawing = false;
}

function writeGamePixel(x, y, v, c) {
  y = y - c;

  var bt = (v >> c) & 1;
  var r = 0;
  var g = 0;
  var b = 0;
  var a = 0xff;

  if (bt) {
    if ((y >= 0xb8 && y <= 0xee && x >= 0 && x <= 0xdf) || (y >= 0xf0 && y <= 0xf7 && x >= 0xf && x <= 0x85)) {
      g = 0xff;
    } else if (y >= (0xf7 - 0xd7) && y >= (0xf7 - 0xb8) && x >= 0 && x <= 0xe9) {
      g = 0xff;
      b = 0xff;
      r = 0xff;
    } else {
      r = 0xff;
    }
  }
  var imageIndex = (x * 4) + (y * (4 * 0xe0));

  gameScreenImageData.data[imageIndex] = r;
  gameScreenImageData.data[imageIndex + 1] = g;
  gameScreenImageData.data[imageIndex + 2] = b;
  gameScreenImageData.data[imageIndex + 3] = a;
}

function injectJSONDataIntoMemory(memory, filename, memoryOffset = 0, cb) {

  var xhr = new XMLHttpRequest();
  xhr.open('GET', filename, true);

  xhr.onload = function(e) {
    if (this.status === 200) {
      var memoryData = this.response.data;
      for (var i = 0; i < byteArray.length; i++) {
        memory[i + memoryOffset] = memoryData[i];
      }
      cb();
    }
  };
   
  xhr.send();
}

function injectBinaryDataIntoMemory(memory, filename, memoryOffset = 0, cb) {

  var xhr = new XMLHttpRequest();
  xhr.open('GET', filename, true);
  xhr.responseType = 'arraybuffer';

  xhr.onload = function(e) {
    if (this.status === 200) {
      var byteArray = new Uint8Array(this.response);
      for (var i = 0; i < byteArray.byteLength; i++) {
        memory[i + memoryOffset] = byteArray[i];
      }
      cb();
    }
  };
   
  xhr.send();
}

function printMemoryTrace(cpuState) {
  console.warn(" ");
  console.log("Last instruction executed: ");
  console.log(cpuState.disassemble8080OP(cpuState, cpuState.flags.pc))
  console.log("CPU Registers: ");
  console.log(cpuState);
  console.log(" ");
  console.log("Debug Helpers: ");
  console.log(cpuState.db);
  console.log(" ");
  console.log("Memory around this address: (-6, +6)");
  var memoryOutput = printMemorySlice(cpuState, cpuState.flags.pc, 6, 6);
  console.log(memoryOutput);
  console.log(" ");
}

function printMemorySlice(cpuState, pc, lower, upper) {
  lower = ((pc - lower) < 0) ? 0 : lower;

  var memorySlice = cpuState.memory.slice(pc - lower, pc + upper);
  var memoryOutput = memorySlice.map((index) => { return pad(index.toString(16), 2); });
  return memoryOutput;
};

function loadSpaceInvadersGame() {

  injectBinaryDataIntoMemory(runningCPU.memory, "../rom/invaders/invaders1.h.bin", 0, () => {
    loadedMemoryFilesList.push("invaders1.h.bin");
    romLoaded++;
    if (romLoaded === 4) {
      postCPUReady();
    }
  });

  injectBinaryDataIntoMemory(runningCPU.memory, "../rom/invaders/invaders2.g.bin", 0x800, () => {
    loadedMemoryFilesList.push("invaders2.g.bin");
    romLoaded++;
    if (romLoaded === 4) {
      postCPUReady();
    }
  });
  injectBinaryDataIntoMemory(runningCPU.memory, "../rom/invaders/invaders3.f.bin", 0x1000, () => {
    loadedMemoryFilesList.push("invaders3.f.bin");
    romLoaded++;
    if (romLoaded === 4) {
      postCPUReady();
    }
  });

  injectBinaryDataIntoMemory(runningCPU.memory, "../rom/invaders/invaders4.e.bin", 0x1800, () => {
    loadedMemoryFilesList.push("invaders4.e.bin");
    romLoaded++;
    if (romLoaded === 4) {
      postCPUReady();
    }
  });
}

function setupCPUCallbacks() {

  // Looks like the game is communicating with some external hardware. This function mocks that hardware. Game crashes without it.
  runningCPU.hwPortHook = function(event, state, portCh, value) {
    if (event === 'postwrite' && portCh === 0x04) {
      state.hwIntPorts[0x03] = value;
      // console.log("Port 3 written   PC: ", state.flags.pc.toString(16), "  Value: ", value);
    } else if (event === 'preread' && portCh === 0x02) {
      state.hwIntPorts[0x02] = 0;
      // console.log("Port 2 written   PC: ", state.flags.pc.toString(16), "  Value: ", value);
    }
  };

  runningCPU.warningCb = function(event, state, msgWarning) {
    if (consoleOutWarnings) {
      console.warn("Warning message asserted from event: ", event);
      msgWarning.forEach(function(messageItem) {
        console.log('    ', messageItem);
      });
      console.warn('State: ', state);
      console.log("-------------------------------");
    }
  };
}

function postCPUReady() {
  if (objCanvas) {
    memoryMapImageData = canvasControl.canvasContext.createImageData(0xff, 0xff);
    for (var i = 0; i < memoryMapImageData.data.length; i++) {
      memoryMapImageData.data[i] = ((i % 4) !== 3 ? 0 : 255);
    }
    renderMemoryMap(runningCPU, runningCPU.db.memoryUpdated, true);
  }
  
  cpuCanStart = true;
}

function runCPU () {
  if (cpuCanStart === true) {
    cpuLoop();
  }
}

function setupCPU() {
  runningCPU = z80CPU();

  runningCPU.hwIntPorts[0x01] = 0b00000000;
  runningCPU.hwIntPorts[0x02] = 0b00000000;
  runningCPU.hwIntPorts[0x03] = 0b00000000; // Looks like it communicates to something external with port 3 and 4. Maybe a sound card?
  runningCPU.hwIntPorts[0x04] = 0b00000000; 

  runningCPU.memory = new Array(0x10000).fill(0);

  if (loadSpaceInvadersByDefault) {
    loadSpaceInvadersGame();
  } else {
    cpuCanStart = true;
    postCPUReady();
  }
  
  setupCPUCallbacks();

}

async function cpuLoop() {

  if (!cpuRunning) { return; }

  cpuClock = setInterval(function() {
    if (cpuClock && (!cpuCanStart || !cpuRunning)) {
      clearInterval(cpuClock);
      cpuClock = undefined;
      return;
    }

    while (!runningCPU.db.cycleRollover && cpuRunning) {
      cpuExec();
    }

    runningCPU.db.cycleRollover = false;
  }, 10);

}

function cpuExec() {
  var disassembleExec = runningCPU.disassemble8080OP(runningCPU, runningCPU.flags.pc);
  var ret = runningCPU.emulate8080OP(runningCPU);

  if (ret > 0) {
    cpuCanStart = false;
    cpuRunning = false;
    console.error("CPU Halted ");
    console.error("Error: Unimplemented instruction.");
    printMemoryTrace(runningCPU);
  } else {
    previouslyExecInstructions.push(disassembleExec);
    if (previouslyExecInstructions.length > 8) {
      previouslyExecInstructions.shift();
    }
  }
}

function setupCanvas() {
  lastAnimationTime = new Date().getTime();
  objCanvas = document.getElementById("canvasDraw");

  objCanvas.addEventListener('drop', fileDropHandler, false);
  objCanvas.addEventListener('dragenter', function(event) {event.preventDefault();event.preventDefault();}, false);
  objCanvas.addEventListener('dragover', function(event) {event.preventDefault();event.preventDefault();}, false);
  objCanvas.addEventListener('dragleave', function(event) {event.preventDefault();event.preventDefault();}, false);

  objCanvas.imageSmoothingEnabled = true;
  canvasControl = new CanvasControl();
  // This is the canvas resolution, NOT the size.
  objCanvas.width = 1080;
  objCanvas.height = 720;
  objContext = canvasControl.setupCanvas(objCanvas, null, {backgroundColor: "#000000"});
  objContext.font = "12px " + fontStyle;
  setupEventHandlers(objCanvas, canvasControl);
  screenDimensions = [objCanvas.width, objCanvas.height];
  gameScreenImageData = objContext.createImageData(gameDimensions[0], gameDimensions[1]);
  memoryMapImageData = objContext.createImageData(0xff, 0xff);

  if (cpuCanStart) {
    for (var i = 0; i < memoryMapImageData.data.length; i++) {
      memoryMapImageData.data[i] = ((i % 4) !== 3 ? 0 : 255);
    }
    renderMemoryMap(runningCPU, runningCPU.db.memoryUpdated, true);
  }

  animateLoop();
}

function init() {
  setupCPU();
  setupCanvas();
};

function relToAbs(relCoord, dimension) {
  return (relCoord * (dimension === 0 ? objCanvas.width : objCanvas.height));
}

function pad(str, size, withChar = "0") {
  var s = str + "";
  while (s.length < size) s = withChar + s;
  return s;
}
