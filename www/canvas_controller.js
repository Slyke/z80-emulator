var showFPS = false;
var showMemoryInspector = false;
var fontStyle = "monospace"; // "Megrim";

var romLoaded = 0;
var cpuCanStart = false;
var cpuRunning = false;
var previouslyExecInstructions = [];

var screenDimensions = [0, 0];
var gameDimensions = [224, 256];
var gameTopLeftCoord = [0.05, 0.05]
var gameScale = 1;
var gameScreenImageData = [];
var screenRedrawing = false;

var frameCount = 0;
var fpsNumber = 0;

var isAnimating = true;
var cpuClock;

var runningCPU = z80CPU();

var persistantObjects = {
  flags: {},
  debug: {},
  cc: {},
  memoryInspect: {},
  stackPointer: {},
  screenBox: {},
  portInfo: {}
};

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

function keyEvents(event, eventType) {
  if (eventType === "press") {
    if (event.keyCode === 32) { // 32 is spacebar

    }
    if (event.key === 'l') { // 1
      if (!cpuRunning) {
        cpuExec();
        renderGameScreen(runningCPU, runningCPU.db.videoMemoryUpdated);
      }
    }
    if (event.key === 'k') { // 10
      if (!cpuRunning) {
        for (var i = 0; i < 10; i++) { cpuExec(); }
        renderGameScreen(runningCPU, runningCPU.db.videoMemoryUpdated);
      }
    }
    if (event.key === 'j') { // 100
      if (!cpuRunning) {
        for (var i = 0; i < 100; i++) { cpuExec(); }
        renderGameScreen(runningCPU, runningCPU.db.videoMemoryUpdated);
      }
    }
    if (event.key === 'h') { // 1000
      if (!cpuRunning) {
        for (var i = 0; i < 1000; i++) { cpuExec(); }
        renderGameScreen(runningCPU, runningCPU.db.videoMemoryUpdated);
      }
    }
    if (event.key === 'g') { // 10000
      if (!cpuRunning) {
        for (var i = 0; i < 10000; i++) { cpuExec(); }
        renderGameScreen(runningCPU, runningCPU.db.videoMemoryUpdated);
      }
    }
    if (event.key === 'p') {
      cpuRunning = !cpuRunning;
      runCPU();
    }
    if (event.key === 'm') {
      showMemoryInspector = !showMemoryInspector;
    }
  }
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

    canvasControl.canvasContext.putImageData(gameScreenImageData, relToAbs(gameTopLeftCoord[0], 0), relToAbs(gameTopLeftCoord[1], 1));
    requestAnimationFrame(() => { animateLoop(); });
  }

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

function setupCPU() {
  runningCPU = z80CPU();

  runningCPU.hwIntPorts[0x01] = 0b00000001;
  runningCPU.hwIntPorts[0x02] = 0b00000000;
  runningCPU.hwIntPorts[0x03] = 0b00000000; // Looks like it communicates to something external with port 3 and 4. Maybe a sound card?
  runningCPU.hwIntPorts[0x04] = 0b00000000; 

  runningCPU.memory = new Array(0x10000).fill(0);

  injectBinaryDataIntoMemory(runningCPU.memory, "../rom/invaders/invaders.h", 0, () => {
    romLoaded++;
    if (romLoaded === 4) {
      cpuCanStart = true;
    }
  });

  injectBinaryDataIntoMemory(runningCPU.memory, "../rom/invaders/invaders.g", 0x800, () => {
    romLoaded++;
    if (romLoaded === 4) {
      cpuCanStart = true;
    }
  });
  injectBinaryDataIntoMemory(runningCPU.memory, "../rom/invaders/invaders.f", 0x1000, () => {
    romLoaded++;
    if (romLoaded === 4) {
      cpuCanStart = true;
    }
  });

  injectBinaryDataIntoMemory(runningCPU.memory, "../rom/invaders/invaders.e", 0x1800, () => {
    romLoaded++;
    if (romLoaded === 4) {
      cpuCanStart = true;
    }
  });

  // Looks like the game is communicating with some external hardware. This function mocks that hardware. Game crashes without it.
  runningCPU.hwPortHook = function(event, state, portCh, value) {
    if (event === 'postwrite' && portCh === 0x04) {
      state.hwIntPorts[0x03] = value;
      // console.log("Port 3 written   PC: ", state.flags.pc.toString(16), "  Value: ", value);
    }
  }
}

function runCPU () {
  if (cpuCanStart === true) {
    cpuLoop();
  }
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
    if (previouslyExecInstructions.length > 10) {
      previouslyExecInstructions.shift();
    }
  }
}

function setupCanvas() {
  lastAnimationTime = new Date().getTime();
  objCanvas = document.getElementById("canvasDraw");
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
