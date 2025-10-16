var showFPS = getLocalStorage('showFPS', false) !== "false";
var showMemoryInspector = getLocalStorage('showMemoryInspector', true) !== "false";
var consoleOutWarnings = getLocalStorage('consoleOutWarnings', true) !== "false";
var loadSpaceInvadersByDefault = getLocalStorage('loadSpaceInvadersByDefault', true) !== "false";
var cpuCoreName = getLocalStorage('cpuCore', "Z80");
var cpuCoreOverloadName = getLocalStorage('cpuCoreOverload', "");
var videoDriverName = getLocalStorage('videoDriver', "Z80 Arcade");
var gameScale = getLocalStorage('gameScale', 1.5);
var settingsVersion = getLocalStorage('settingsVersion', "0.201809112326.0");
var fontStyle = "monospace"; // "Megrim";

var romLoaded = 0;
var cpuCanStart = false;
var cpuRunning = false;
var previouslyExecInstructions = [];
var loadedMemoryFilesList = [];
var screenDimensions = [0, 0];
var gameTopLeftCoord = [0.05, 0.05]
var gameScreenRenderData = new Image();
var gameScreenImageData = [];
var anyMemoryUpdated = [];
var memoryMapImageData = [];

var usingVideoDriver;
var usingCPUCore;
var usingCPUCoreOverload;

var frameCount = 0;
var fpsNumber = 0;

var isAnimating = true;
var cpuClock;

var objCanvas;

var runningCPU;
var runningCPUOverride;

var persistantObjects = {
  flags: {},
  debug: {},
  cc: {},
  memoryInspect: {},
  stackPointer: {},
  screenBox: {},
  portInfo: {},
  mm: {},
  gameFiles: {},
  cpuChecksum: {}
};

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

  if (cpuCanStart && cpuRunning && anyMemoryUpdated.length > 1 && !usingVideoDriver.memoryMapRendering) {
    usingVideoDriver.renderMemoryMap(runningCPU, anyMemoryUpdated, memoryMapImageData, null, true);
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

    if (gameScale === 1) { // Dump video array to canvas (no resize, faster, less resource intensive).
      canvasControl.canvasContext.putImageData(gameScreenImageData, relToAbs(gameTopLeftCoord[0], 0), relToAbs(gameTopLeftCoord[1], 1));
    }
    
    if (showMemoryInspector) {
      canvasControl.canvasContext.putImageData(memoryMapImageData, relToAbs(0.75, 0), relToAbs(0.63, 1));
    }
    
    requestAnimationFrame(() => { animateLoop(); });
  }

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

  // Show warning messages if something goes wrong.
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

  // This lets the video renderer, and memory map renderer know when something has changed in memory.
  runningCPU.memoryUpdateCb = function(address, value) {
    if (typeof(usingVideoDriver.memoryUpdate) === "function") {
      usingVideoDriver.memoryUpdate(runningCPU, runningCPU.memory, address, value, false);
    }

    if (anyMemoryUpdated.indexOf(address) === -1) {
      anyMemoryUpdated.push(address);
    }
  };
}

function postCPUReady() {
  if (objCanvas) {
    memoryMapImageData = canvasControl.canvasContext.createImageData(0xff, 0xff);
    for (var i = 0; i < memoryMapImageData.data.length; i++) {
      memoryMapImageData.data[i] = ((i % 4) !== 3 ? 0 : 255);
    }
    usingVideoDriver.renderMemoryMap(runningCPU, anyMemoryUpdated, memoryMapImageData, null, true);
  }
  
  cpuCanStart = true;
}

function runCPU () {
  if (cpuCanStart === true) {
    cpuLoop();
  }
}

function setupCPU() {
  runningCPU = usingCPUCore();
  if (runningCPUOverride) {
    runningCPUOverride = usingCPUCoreOverload();
    runningCPU.interruptCheck = runningCPUOverride.interruptCheck;
    runningCPU.interruptRequest = runningCPUOverride.interruptRequest;
  }

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
  var disassembleExec;
  if (runningCPUOverride) {
    disassembleExec = runningCPUOverride.disassemble8080OPOverwrte(runningCPU, runningCPU.flags.pc);
    if (!disassembleExec.overwrite) {
      disassembleExec = runningCPU.disassemble8080OP(runningCPU, runningCPU.flags.pc);
    }
  } else {
    disassembleExec = runningCPU.disassemble8080OP(runningCPU, runningCPU.flags.pc);
  }
  
  var ret = -1;
  if (runningCPUOverride) {
    ret = runningCPUOverride.opCodeOverwrite(runningCPU);
    if (ret === 2) { // Passthrough was returned.
      ret = runningCPU.emulate8080OP(runningCPU);
    }
  } else {
    ret = runningCPU.emulate8080OP(runningCPU);
  }

  if (ret > 0) {
    cpuCanStart = false;
    cpuRunning = false;
    console.error("CPU Halted ");
    console.error("Error: Unimplemented instruction.");
    printMemoryTrace(runningCPU);
  } else {
    if (cpuCanStart && cpuRunning && !usingVideoDriver.redrawing) {
      usingVideoDriver.renderGameScreen(runningCPU, usingVideoDriver.videoMemory, gameScreenImageData);
    }
    previouslyExecInstructions.push(disassembleExec);
    if (previouslyExecInstructions.length > 10) {
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
  gameScreenImageData = objContext.createImageData(usingVideoDriver.resolution[0], usingVideoDriver.resolution[1]);
  memoryMapImageData = objContext.createImageData(0xff, 0xff);

  if (cpuCanStart) {
    for (var i = 0; i < memoryMapImageData.data.length; i++) {
      memoryMapImageData.data[i] = ((i % 4) !== 3 ? 0 : 255);
    }
    usingVideoDriver.renderMemoryMap(runningCPU, anyMemoryUpdated, memoryMapImageData, null, true);
  }

  animateLoop();
}

function createHardware() {
  usingVideoDriver = videoDriver.map(function (videoDriver) { return videoDriver(); } ).filter(function(vidDriver) { return vidDriver.name === videoDriverName })[0];
  usingCPUCore = cpuCore.map(function (cpuCoreIndex) { return cpuCoreIndex; } ).filter(function(cpuCoreFilterIndex) { return cpuCoreFilterIndex().name === cpuCoreName })[0];
  usingCPUCoreOverload = cpuCoreOverload.map(function (usingCPUCoreOverloadIndex) { return usingCPUCoreOverloadIndex; } ).filter(function(usingCPUCoreOverloadFilterIndex) { return usingCPUCoreOverloadFilterIndex().name === cpuCoreOverloadName })[0];
}

function init() {

  createHardware();

  if (!usingVideoDriver) {
    console.error("No video driver found! Choose from: ", videoDriver.map(function (videoDriver) { return videoDriver().name; } ));
    console.error("Update the name in your browser's localstorage and refresh");
    return;
  }
  
  if (!usingCPUCore) {
    console.error("No CPU core found! Choose from: ", cpuCore.map(function (cpuCoreIndex) { return cpuCoreIndex().name; } ));
    console.error("Update the name in your browser's localstorage and refresh");
    return;
  }

  runningCPU = usingCPUCore();
  if (usingCPUCoreOverload) {
    runningCPUOverride = usingCPUCoreOverload();
    runningCPU.interruptCheck = runningCPUOverride.interruptCheck;
    runningCPU.interruptRequest = runningCPUOverride.interruptRequest;
  }

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

getCpuCheckSum = function() {
  return calculateChecksum([
    runningCPU.flags.pc,
    Math.round(runningCPU.flags.pc / 2),
    runningCPU.flags.sp,
    Math.round(runningCPU.flags.sp / 2),
    runningCPU.flags.ix,
    runningCPU.flags.iy,
    runningCPU.cycles,
    Math.round(runningCPU.cycles / 2),
    runningCPU.flags.a,
    runningCPU.flags.f,
    runningCPU.flags.b,
    runningCPU.flags.c,
    runningCPU.flags.d,
    runningCPU.flags.e,
    runningCPU.flags.h,
    runningCPU.flags.l
  ]);
};

calculateChecksum = function(numberList) {
  var output = "";

  if (!numberList || numberList.length === 0) {
    return 0
  }

  for (var i = 0; i < numberList.length; i++) {
    output += luhn(numberList[i]).toString();
  }

  output += luhn(output).toString();
  output += luhn(output).toString();

  return parseInt(output).toString(16);
};

luhn = function(originalStr) {
  var sum = 0;
  var delta = [0, 1, 2, 3, 4, -4, -3, -2, -1, 0];

  originalStr = originalStr.toString();

  for (var i = 0; i < originalStr.length; i++) {
    sum += parseInt(originalStr.substring(i, i + 1));
  }

  for (var i = (originalStr.length - 1); i >= 0; i -= 2) {
    sum += delta[parseInt(originalStr.substring(i, i + 1))];
  }

  if (10 - (sum % 10) === 10) {
    return 0;
  }
  return (10 - (sum % 10));
};
