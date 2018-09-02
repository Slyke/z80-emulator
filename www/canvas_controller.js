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
  screenBox: {}
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
      cpuRunning = !cpuRunning;
      runCPU();
    }
    if (event.key === 'l') { // 1
      if (!cpuRunning) {
        cpuExec();
        renderGameScreen(runningCPU, runningCPU.db.videoMemoryUpdated);
      }
    }
    if (event.key === 'k') { // 10
      if (!cpuRunning) {
        for (var i = 0; i < 9; i++) { cpuExec(); }
        renderGameScreen(runningCPU, runningCPU.db.videoMemoryUpdated);
      }
    }
    if (event.key === 'j') { // 100
      if (!cpuRunning) {
        for (var i = 0; i < 99; i++) { cpuExec(); }
        renderGameScreen(runningCPU, runningCPU.db.videoMemoryUpdated);
      }
    }
    if (event.key === 'h') { // 1000
      if (!cpuRunning) {
        for (var i = 0; i < 999; i++) { cpuExec(); }
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

  uiPreframeSetup();

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

function uiPreframeSetup() {

  if (!cpuCanStart) {
    return 0;
  }

  var helpText = [
    "Keys:",
    "     P - Pause/Resume",
    "     M - Show/Hide memory disassembly",
    "     ",
    "Skip Ahead X instructions:",
    "                         H - 1000     J - 100    K - 10    L - 1 (Step by step)"
  ];

  helpText.forEach(function(helpIndex, i) {
    var objHelpText = {
      "x": relToAbs(0.4, 0),
      "y": relToAbs(0.8 + (i * 0.02), 1),
      "name":"lblHelpText" + i,
      "text": helpIndex,
      "shape":"text",
      "render":function(self) {
        canvasControl.drawText(self.x, self.y, self.text, self, null, null, {"fillStyle":"#99FF00"});
      },
      "visible": true
    };

    canvasControl.canvasObjects.push(objHelpText);
  });

  persistantObjects.screenBox = {
    "x": relToAbs(gameTopLeftCoord[0], 0),
    "y": relToAbs(gameTopLeftCoord[1], 1),
    "w": gameDimensions[0] * gameScale,
    "h": gameDimensions[1] * gameScale,
    "shape":"rect",
    "render":function(self) {
      canvasControl.drawRect(self.x, self.y, self.w, self.h, self.renderType, canvasControl.canvasContext, {"strokeStyle": "#FFAAAA", "lineWidth":"3"});
    },
    "visible": true
  };

  var disObj = runningCPU.disassemble8080OP(runningCPU, runningCPU.flags.pc);

  persistantObjects.debug.label = {
    "x": relToAbs(0.65, 0),
    "y": relToAbs(0.01, 1),
    "name":"lblCPUDebugLabel",
    "text":"Debug: ",
    "shape":"text",
    "render":function(self) {
      canvasControl.drawText(self.x, self.y, self.text, self, null, null, {"fillStyle":"#99FF00"});
    },
    "visible": true
  };

  var execCount = "";
  if (runningCPU.db.executionCount < 99999999) {
    execCount = pad(runningCPU.db.executionCount, 8);
  } else {
    if (runningCPU.db.executionCount < 0xffffffff) {
      execCount = pad(runningCPU.db.executionCount.toString(16), 8);
    } else {
      execCount = "OvrFlw"
    }
  }

  persistantObjects.debug.execCount = {
    "x": relToAbs(0.65, 0),
    "y": relToAbs(0.03, 1),
    "name":"lblCPUDebugExecCount",
    "text":"  Exec Count: " + execCount,
    "shape":"text",

    "render":function(self) {
      canvasControl.drawText(self.x, self.y, self.text, self, null, null, {"fillStyle":"#00FFFF"});
    },
    "visible": true
  };

  var cpuCount = "";
  if (runningCPU.db.totalCPUCycles < 99999999) {
    cpuCount = pad(runningCPU.db.totalCPUCycles, 8);
  } else {
    if (runningCPU.db.totalCPUCycles < 0xffffffff) {
      cpuCount = pad(runningCPU.db.totalCPUCycles.toString(16), 8);
    } else {
      cpuCount = "OvrFlw"
    }
  }

  persistantObjects.debug.totalCycles = {
    "x": relToAbs(0.65, 0),
    "y": relToAbs(0.05, 1),
    "name":"lblCPUDebugCycles",
    "text":"  CPU Cycles: " + cpuCount + " Total",
    "shape":"text",
    "render":function(self) {
      canvasControl.drawText(self.x, self.y, self.text, self, null, null, {"fillStyle":"#00FFFF"});
    },
    "visible": true
  };

  persistantObjects.debug.cycles = {
    "x": relToAbs(0.65, 0),
    "y": relToAbs(0.07, 1),
    "name":"lblCPUDebugCycles",
    "text":"  CPU Cycle:  " + pad(runningCPU.cycles, 5),
    "shape":"text",
    "render":function(self) {
      canvasControl.drawText(self.x, self.y, self.text, self, null, null, {"fillStyle":"#00FFFF"});
    },
    "visible": true
  };

  persistantObjects.debug.pendingScreenUpdates = {
    "x": relToAbs(0.65, 0),
    "y": relToAbs(0.09, 1),
    "name":"lblCPUDebugCycles",
    "text":"  Penren: " + pad(runningCPU.db.videoMemoryUpdated.length, 4),
    "shape":"text",
    "render":function(self) {
      canvasControl.drawText(self.x, self.y, self.text, self, null, null, {"fillStyle":"#00FFFF"});
    },
    "visible": true
  };

  persistantObjects.flags.label = {
    "x": relToAbs(0.5, 0),
    "y": relToAbs(0.01, 1),
    "name":"lblCPUFlagLabel",
    "text":"CPU Flags: ",
    "shape":"text",
    "render":function(self) {
      canvasControl.drawText(self.x, self.y, self.text, self, null, null, {"fillStyle":"#99FF00"});
    },
    "visible": true
  };

  persistantObjects.flags.pc = {
    "x": relToAbs(0.5, 0),
    "y": relToAbs(0.03, 1),
    "name":"lblCPUFlagPC",
    "text":"  PC (Address): " + pad(runningCPU.flags.pc.toString(16), 4),
    "shape":"text",
    "render":function(self) {
      canvasControl.drawText(self.x, self.y, self.text, self, null, null, {"fillStyle":"#00FFFF"});
    },
    "visible": true
  };

  persistantObjects.flags.sp = {
    "x": relToAbs(0.5, 0),
    "y": relToAbs(0.05, 1),
    "name":"lblCPUFlagSP",
    "text":"  SP (Address): " + pad(runningCPU.flags.sp.toString(16), 4),
    "shape":"text",
    "render":function(self) {
      canvasControl.drawText(self.x, self.y, self.text, self, null, null, {"fillStyle":"#00FFFF"});
    },
    "visible": true
  };

  persistantObjects.flags.af = {
    "x": relToAbs(0.5, 0),
    "y": relToAbs(0.07, 1),
    "name":"lblCPUFlagA",
    "text":"  A F:         " + pad(runningCPU.flags.a.toString(16), 2) + " " + pad(runningCPU.flags.f.toString(16), 2),
    "shape":"text",
    "render":function(self) {
      canvasControl.drawText(self.x, self.y, self.text, self, null, null, {"fillStyle":"#00FFFF"});
    },
    "visible": true
  };

  persistantObjects.flags.bc = {
    "x": relToAbs(0.5, 0),
    "y": relToAbs(0.09, 1),
    "name":"lblCPUFlagB",
    "text":"  B C:         " + pad(runningCPU.flags.b.toString(16), 2) + " " + pad(runningCPU.flags.c.toString(16), 2),
    "shape":"text",
    "render":function(self) {
      canvasControl.drawText(self.x, self.y, self.text, self, null, null, {"fillStyle":"#00FFFF"});
    },
    "visible": true
  };

  persistantObjects.flags.de = {
    "x": relToAbs(0.5, 0),
    "y": relToAbs(0.11, 1),
    "name":"lblCPUFlagD",
    "text":"  D E:         " + pad(runningCPU.flags.d.toString(16), 2) + " " + pad(runningCPU.flags.e.toString(16), 2),
    "shape":"text",
    "render":function(self) {
      canvasControl.drawText(self.x, self.y, self.text, self, null, null, {"fillStyle":"#00FFFF"});
    },
    "visible": true
  };

  persistantObjects.flags.hl = {
    "x": relToAbs(0.5, 0),
    "y": relToAbs(0.13, 1),
    "name":"lblCPUFlagH",
    "text":"  H L:         " + pad(runningCPU.flags.h.toString(16), 2) + " " + pad(runningCPU.flags.l.toString(16), 2),
    "shape":"text",
    "render":function(self) {
      canvasControl.drawText(self.x, self.y, self.text, self, null, null, {"fillStyle":"#00FFFF"});
    },
    "visible": true
  };

  persistantObjects.cc.label = {
    "x": relToAbs(0.82, 0),
    "y": relToAbs(0.01, 1),
    "name":"lblCPUCCLabel",
    "text":"F Register Flags: ",
    "shape":"text",
    "render":function(self) {
      canvasControl.drawText(self.x, self.y, self.text, self, null, null, {"fillStyle":"#99FF00"});
    },
    "visible": true
  };

  persistantObjects.cc.c = {
    "x": relToAbs(0.82, 0),
    "y": relToAbs(0.03, 1),
    "name":"lblCPUCCC",
    "text":"  Carry (0x01):        " + ((runningCPU.flags.f & 0x01) === 0x01).toString(),
    "shape":"text",
    "render":function(self) {
      canvasControl.drawText(self.x, self.y, self.text, self, null, null, {"fillStyle":"#00FFFF"});
    },
    "visible": true
  };

  persistantObjects.cc.p = {
    "x": relToAbs(0.82, 0),
    "y": relToAbs(0.05, 1),
    "name":"lblCPUCCHC",
    "text":"  Parity (0x04):       " + ((runningCPU.flags.f & 0x04) === 0x04).toString(),
    "shape":"text",
    "render":function(self) {
      canvasControl.drawText(self.x, self.y, self.text, self, null, null, {"fillStyle":"#00FFFF"});
    },
    "visible": true
  };

  persistantObjects.cc.hc = {
    "x": relToAbs(0.82, 0),
    "y": relToAbs(0.07, 1),
    "name":"lblCPUCCHC",
    "text":"  Half Carry (0x10):   " + ((runningCPU.flags.f & 0x10) === 0x10).toString(),
    "shape":"text",
    "render":function(self) {
      canvasControl.drawText(self.x, self.y, self.text, self, null, null, {"fillStyle":"#00FFFF"});
    },
    "visible": true
  };

  persistantObjects.cc.interrupt = {
    "x": relToAbs(0.82, 0),
    "y": relToAbs(0.09, 1),
    "name":"lblCPUCCInt",
    "text":"  Interupt (0x20):     " + ((runningCPU.flags.f & 0x20) === 0x20).toString(),
    "shape":"text",
    "render":function(self) {
      canvasControl.drawText(self.x, self.y, self.text, self, null, null, {"fillStyle":"#00FFFF"});
    },
    "visible": true
  };

  persistantObjects.cc.zero = {
    "x": relToAbs(0.82, 0),
    "y": relToAbs(0.11, 1),
    "name":"lblCPUCCZero",
    "text":"  Zero (0x40):         " + ((runningCPU.flags.f & 0x40) === 0x40).toString(),
    "shape":"text",
    "render":function(self) {
      canvasControl.drawText(self.x, self.y, self.text, self, null, null, {"fillStyle":"#00FFFF"});
    },
    "visible": true
  };

  persistantObjects.cc.sign = {
    "x": relToAbs(0.82, 0),
    "y": relToAbs(0.13, 1),
    "name":"lblCPUCCZero",
    "text":"  Sign (0x80):         " + ((runningCPU.flags.f & 0x80) === 0x80).toString(),
    "shape":"text",
    "render":function(self) {
      canvasControl.drawText(self.x, self.y, self.text, self, null, null, {"fillStyle":"#00FFFF"});
    },
    "visible": true
  };

  canvasControl.canvasObjects.push(persistantObjects.screenBox);

  canvasControl.canvasObjects.push(persistantObjects.debug.label);
  canvasControl.canvasObjects.push(persistantObjects.debug.execCount);
  canvasControl.canvasObjects.push(persistantObjects.debug.totalCycles);
  canvasControl.canvasObjects.push(persistantObjects.debug.cycles);
  canvasControl.canvasObjects.push(persistantObjects.debug.pendingScreenUpdates);

  canvasControl.canvasObjects.push(persistantObjects.flags.label);
  canvasControl.canvasObjects.push(persistantObjects.flags.pc);
  canvasControl.canvasObjects.push(persistantObjects.flags.sp);
  canvasControl.canvasObjects.push(persistantObjects.flags.af);
  canvasControl.canvasObjects.push(persistantObjects.flags.bc);
  canvasControl.canvasObjects.push(persistantObjects.flags.de);
  canvasControl.canvasObjects.push(persistantObjects.flags.hl);

  canvasControl.canvasObjects.push(persistantObjects.cc.label);
  canvasControl.canvasObjects.push(persistantObjects.cc.c);
  canvasControl.canvasObjects.push(persistantObjects.cc.p);
  canvasControl.canvasObjects.push(persistantObjects.cc.hc);
  canvasControl.canvasObjects.push(persistantObjects.cc.interrupt);
  canvasControl.canvasObjects.push(persistantObjects.cc.zero);
  canvasControl.canvasObjects.push(persistantObjects.cc.sign);

  if (!showMemoryInspector) {
    return;
  }

  persistantObjects.stackPointer.label = {
    "x": relToAbs(0.5, 0),
    "y": relToAbs(0.18, 1),
    "name":"lblCPUSPHelper",
    "text":"Stack Pointer Values (SP+0 to SP+8)",
    "shape":"text",
    "render":function(self) {
      canvasControl.drawText(self.x, self.y, self.text, self, null, null, {"fillStyle":"#99FF00"});
    },
    "visible": true
  };

  persistantObjects.stackPointer.labelA = {
    "x": relToAbs(0.495, 0),
    "y": relToAbs(0.20, 1),
    "name":"lblCPUSPA",
    "text":"  A",
    "shape":"text",
    "render":function(self) {
      canvasControl.drawText(self.x, self.y, self.text, self, null, null, {"fillStyle":"#99FF00"});
    },
    "visible": true
  };

  persistantObjects.stackPointer.labelV = {
    "x": relToAbs(0.495, 0),
    "y": relToAbs(0.22, 1),
    "name":"lblCPUSPV",
    "text":"  V",
    "shape":"text",
    "render":function(self) {
      canvasControl.drawText(self.x, self.y, self.text, self, null, null, {"fillStyle":"#99FF00"});
    },
    "visible": true
  };

  persistantObjects.memoryInspect.label = {
    "x": relToAbs(0.5, 0),
    "y": relToAbs(0.25, 1),
    "name":"lblCPUMEMInspect",
    "text":"Memory Inspector",
    "shape":"text",
    "render":function(self) {
      canvasControl.drawText(self.x, self.y, self.text, self, null, null, {"fillStyle":"#99FF00"});
    },
    "visible": true
  };

  persistantObjects.memoryInspect.helper = {
    "x": relToAbs(0.5, 0),
    "y": relToAbs(0.27, 1),
    "name":"lblCPUMEMHelper",
    "text":"Address    |   OP Code   |   Mnem    | IREG  | OREG |   P1  |  P2   | PTR ",
    "shape":"text",
    "render":function(self) {
      canvasControl.drawText(self.x, self.y, self.text, self, null, null, {"fillStyle":"#FF9900"});
    },
    "visible": true
  };

  canvasControl.canvasObjects.push(persistantObjects.stackPointer.label);
  canvasControl.canvasObjects.push(persistantObjects.stackPointer.labelA);
  canvasControl.canvasObjects.push(persistantObjects.stackPointer.labelV);

  canvasControl.canvasObjects.push(persistantObjects.memoryInspect.label);
  canvasControl.canvasObjects.push(persistantObjects.memoryInspect.helper);

  var memSliceSP = runningCPU.memory.slice(runningCPU.flags.sp, runningCPU.flags.sp + 8);

  for (var k = 0; k < memSliceSP.length; k++) {

    if (runningCPU.flags.sp + k >= 0x2400) { // This is video memory. We don't want to display garbage.
      break;
    } 

    var mem1 = memSliceSP[k];
    var mem2 = memSliceSP[k + 1];

    if (!mem1) {
      mem1 = 0;
    }

    if (!mem2) {
      mem2 = 0;
    }

    var newSPPrint = {
      "x": relToAbs(0.53 + (k  * 0.045), 0),
      "y": relToAbs(0.20),
      "name":"lblCPUMEMSPADDR" + k,
      "text": "" + pad((runningCPU.flags.sp + k).toString(16), 4) + "-" + pad((runningCPU.flags.sp + k + 1).toString(16), 4),
      "shape":"text",
      "render":function(self) {
        canvasControl.drawText(self.x, self.y, self.text, self, null, null, {"fillStyle":"#FF9999"});
      },
      "visible": true
    };

    var newSPMemPrint = {
      "x": relToAbs(0.53 + (k * 0.045), 0),
      "y": relToAbs(0.22),
      "name":"lblCPUMEMSPADDR" + k,
      "text": "0x" + pad(mem1.toString(16), 2) + " 0x" + pad(mem2.toString(16), 2),
      "shape":"text",
      "render":function(self) {
        canvasControl.drawText(self.x, self.y, self.text, self, null, null, {"fillStyle":"#FF9999"});
      },
      "visible": true
    };

    k++;

    canvasControl.canvasObjects.push(newSPPrint);
    canvasControl.canvasObjects.push(newSPMemPrint);
  }

  previouslyExecInstructions.forEach(function(pei, index) {
    var textOutput = "     ";
    textOutput += pad(pei.programCounter.toString(16), 4) + "         ";
    textOutput += pad(pei.opCodeHex.toString(16), 2) + "      ";
    textOutput += pad(pei.opCode, 8, " ") + "    ";
    textOutput += pad(pei.ireg, 4, " ") + "    ";
    textOutput += pad(pei.oreg, 4, " ") + "     ";
    textOutput += pad(pei.para1 ? pad(pei.para1.toString(16), 2) : "", 3, " ") + "    ";
    textOutput += pad(pei.para2 ? pad(pei.para2.toString(16), 2) : "", 3, " ") + "      ";
    textOutput += pad(pei.ptr, 1, " ");
    
    var newMemPrint = {
      "x": relToAbs(0.5, 0),
      "y": relToAbs(0.30 + (index * 0.02), 1),
      "name":"lblCPUMEMPrevPrint" + index,
      "text": textOutput,
      "shape":"text",
      "render":function(self) {
        canvasControl.drawText(self.x, self.y, self.text, self, null, null, {"fillStyle":"#FF9999"});
      },
      "visible": true
    };

    canvasControl.canvasObjects.push(newMemPrint);
  });

  var commandPCOffset = 0;

  for (var i = 0; i < 10; i++) {
    var disObj = runningCPU.disassemble8080OP(runningCPU, (runningCPU.flags.pc + i + commandPCOffset));
    var textOutput = "     ";
    textOutput += pad(disObj.programCounter.toString(16), 4) + "         ";
    textOutput += pad(disObj.opCodeHex.toString(16), 2) + "      ";
    textOutput += pad(disObj.opCode, 8, " ") + "    ";
    textOutput += pad(disObj.ireg, 4, " ") + "    ";
    textOutput += pad(disObj.oreg, 4, " ") + "     ";
    textOutput += pad(disObj.para1 ? pad(disObj.para1.toString(16), 2) : "", 3, " ") + "    ";
    textOutput += pad(disObj.para2 ? pad(disObj.para2.toString(16), 2) : "", 3, " ") + "      ";
    textOutput += pad(disObj.ptr, 1, " ");
    commandPCOffset += (disObj.opBytes - 1);

    var newMemPrint = {
      "x": relToAbs(0.5, 0),
      "y": relToAbs(0.30 + ((i + previouslyExecInstructions.length) * 0.02), 1),
      "name":"lblCPUMEMPrint" + i,
      "text": textOutput,
      "shape":"text",
      "render":function(self) {
        canvasControl.drawText(self.x, self.y, self.text, self, null, null, {"fillStyle":"#0099FF"});
      },
      "visible": true
    };

    if (i === 0) {
      var currentPos = {
        "x": relToAbs(0.505, 0),
        "y": relToAbs(0.30 + (previouslyExecInstructions.length * 0.02), 1),
        "name":"lblCPUMEMPointer",
        "text": "==>",
        "shape":"text",
        "render":function(self) {
          canvasControl.drawText(self.x, self.y, self.text, self, null, null, {"fillStyle":"#FF0000"});
        },
        "visible": true
      };
      canvasControl.canvasObjects.push(currentPos);
    }

    canvasControl.canvasObjects.push(newMemPrint);
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

  runningCPU.cc = {
    z: 1,
    s: 1,
    p: 1,
    cy: 1,
    ac: 0,
    pad: 1
  };

  runningCPU.memory = new Array(0x10000);

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

    while (!runningCPU.db.cycleRollover) {
      cpuExec();
    }

    runningCPU.db.cycleRollover = false;
    // for (var i = 0; i < 10; i++) { cpuExec(); }
  }, 10);

}

function cpuExec() {
  var disassembleExec = runningCPU.disassemble8080OP(runningCPU, runningCPU.flags.pc);
  var ret = runningCPU.emulate8080OP(runningCPU);

  if (ret > 0) {
    cpuCanStart = false;
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
