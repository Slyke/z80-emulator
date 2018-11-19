// Settings
var showFPS = getLocalStorage('showFPS', false) !== "false";
var showMemoryInspector = getLocalStorage('showMemoryInspector', true) !== "false";
var consoleOutWarnings = getLocalStorage('consoleOutWarnings', true) !== "false";
var loadSpaceInvadersByDefault = getLocalStorage('loadSpaceInvadersByDefault', true) !== "false";
var emuCoreName = getLocalStorage('emulatorCore', "Z80_Arcade");
var gameScale = getLocalStorage('gameScale', 1.5);
var settingsVersion = getLocalStorage('settingsVersion', "0.201809112326.0");
var fontStyle = "monospace"; // "Megrim";

// Video transcoder and vars
var gameScreenRenderData = new Image();
var screenDimensions = [0, 0];
var gameTopLeftCoord = [0.05, 0.05];
var memoryMapImageData = [];
var gameScreenImageData = [];

// JS and DOM
var objCanvas;

// Global vars
var objEmulatorFactory;
var emuCtrlList = [];
var objEmu;
var loadedMemoryFilesList = [];
var romLoaded = 0;
var cpuRunning = false;
var previouslyExecInstructions = [];

var usingVideoDriver;
var usingCPUCore;
var usingCPUCoreOverload;

var frameCount = 0;
var fpsNumber = 0;

var isAnimating = true;
var cpuClock;

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
  gameFiles: {}
};

function getLocalStorage(key, defaultValue) {
  if (localStorage.getItem(key) === null) {
    localStorage.setItem(key, defaultValue)
  }

  return localStorage.getItem(key);
}

function setupEventHandlers(objCanvas, objCanvasController) {
  objCanvas.addEventListener('drop', fileDropHandler, false);
  objCanvas.addEventListener('dragenter', function(event) {event.preventDefault();event.preventDefault();}, false);
  objCanvas.addEventListener('dragover', function(event) {event.preventDefault();event.preventDefault();}, false);
  objCanvas.addEventListener('dragleave', function(event) {event.preventDefault();event.preventDefault();}, false);

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

  uiPreframeSetup(canvasControl, objEmu, persistantObjects, showMemoryInspector);

  if (cpuRunning && objEmu.gpu.memoryMapDiffFrameBuffer.length > 1) {
    objEmu.gpu.renderMemoryMap(objEmu, memoryMapImageData);
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
  gameScreenImageData = objContext.createImageData(objEmu.gpu.resolution[0], objEmu.gpu.resolution[1]);
  memoryMapImageData = objContext.createImageData(0xff, 0xff);

  for (var i = 0; i < memoryMapImageData.data.length; i++) {
    memoryMapImageData.data[i] = ((i % 4) !== 3 ? 0 : 255);
  }

  objEmu.gpu.renderMemoryMap(objEmu, memoryMapImageData);

  animateLoop();
}

function createHardwareEmulation(controllerName) {
  for (var i = 0; i < objEmulatorFactory.ctrlList.length; i++) {
    var tmpEmuCtrl = objEmulatorFactory.ctrlList[i]();
    emuCtrlList.push(tmpEmuCtrl.name);
    if (controllerName === tmpEmuCtrl.name) {
      var selectedEmu = tmpEmuCtrl;
      return selectedEmu;
    }
  }

  return undefined;
}

function initialiseHardwareEmulation(emu) {
  objEmu.ctrl.setup(objEmulatorFactory);
}

function init() {
  setupCpu();
  setupCanvas();

  if (loadSpaceInvadersByDefault) {
    loadSpaceInvadersGame();
  }
};

function setupCpu() {
  objEmu = createHardwareEmulation(emuCoreName);
  
  if (!objEmu) {
    console.error("[MAIN::init()] Error: Emulator controller not found: ", emuCoreName);
    console.error("[MAIN::init()] List of avaiable emulator controllers: ", emuCtrlList);
    return;
  }

  initialiseHardwareEmulation(objEmu);
}

function relToAbs(relCoord, dimension) {
  return (relCoord * (dimension === 0 ? objCanvas.width : objCanvas.height));
}

function printMemorySlice(cpuState, pc, lower, upper) {
  lower = ((pc - lower) < 0) ? 0 : lower;

  var memorySlice = cpuState.memory.slice(pc - lower, pc + upper);
  var memoryOutput = memorySlice.map((index) => { return pad(index.toString(16), 2); });
  return memoryOutput;
};

function pad(str, size, withChar = "0") {
  var s = str + "";
  while (s.length < size) s = withChar + s;
  return s;
}
