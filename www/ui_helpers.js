
function Uint8ClampedArrayImageToPNG(arrayImage, gameDimensions) {
  var resizeCanvas = document.createElement("canvas");
  resizeCanvas.height = gameDimensions[1];
  resizeCanvas.width = gameDimensions[0];
  var resizeContext = resizeCanvas.getContext("2d");

  resizeContext.putImageData(arrayImage, 0, 0);
  var dataURL = resizeCanvas;
  // document.removeChild(resizeCanvas);

  return dataURL;
}

function uiPreframeSetup(canvasControl, runningCPU, persistantObjects, cpuCanStart, showMemoryInspector) {

  if (!cpuCanStart) {
    return 0;
  }

  var helpText = [
    "Emulator Keys:",
    "     P - Pause/Resume Emulator (Press this to start)",
    "     M - Show/Hide memory disassembly",
    "     Shift + R - Reset CPU State (All Memory Intract)",
    "     Shift + Q - Wipe memory (all = 0x00)",
    "     ",
    "Skip Ahead X instructions:",
    "     G - 10, 000     H - 1, 000",
    "     J - 100         K - 10 ",
    "     L - 1 (Step by step)"
  ];

  if (runningCPUOverride) {
    runningCPUOverride.getKeyBoardKeysText().reverse().forEach(function (text) {
      helpText.unshift(text);
    });
  } else {
    runningCPU.getKeyBoardKeysText().reverse().forEach(function (text) {
      helpText.unshift(text);
    });
  }

  helpText.forEach(function(helpIndex, i) {
    var objHelpText = {
      "x": relToAbs(0.05, 0),
      "y": ((usingVideoDriver.resolution[1] * gameScale) + relToAbs(0.02, 1) + relToAbs(gameTopLeftCoord[1], 1)) + (relToAbs(i * 0.02, 1)),
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

  if (gameScale !== 1) {
    gameScreenRenderData = Uint8ClampedArrayImageToPNG(gameScreenImageData, usingVideoDriver.resolution);
  }
  persistantObjects.gameScreen = {
    "x": relToAbs(gameTopLeftCoord[0], 0),
    "y": relToAbs(gameTopLeftCoord[1], 1),
    "w": usingVideoDriver.resolution[0],
    "h": usingVideoDriver.resolution[1],
    "name":"gameScreen",
    "sw": usingVideoDriver.resolution[0] * gameScale,
    "sh": usingVideoDriver.resolution[1] * gameScale,
    "src": {objImage: gameScreenRenderData},
    "shape":"image",
    "render":function(self) {
      canvasControl.drawImage(self.src, self.x, self.y, self.sw, self.sh, null, null, self.w, self.h, canvasControl.canvasContext);
    },
    "visible":true
  };

  persistantObjects.screenBox = {
    "x": relToAbs(gameTopLeftCoord[0], 0),
    "y": relToAbs(gameTopLeftCoord[1], 1),
    "w": usingVideoDriver.resolution[0] * gameScale,
    "h": usingVideoDriver.resolution[1] * gameScale,
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
    "y": relToAbs(0.025, 1),
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

  persistantObjects.debug.modeClock = {
    "x": relToAbs(0.65, 0),
    "y": relToAbs(0.04, 1),
    "name":"lblCPUDebugModeClock",
    "text":"  Mode Clock: " + pad(runningCPU.modeClock, 5),
    "shape":"text",
    "render":function(self) {
      canvasControl.drawText(self.x, self.y, self.text, self, null, null, {"fillStyle":"#00FFFF"});
    },
    "visible": true
  };

  persistantObjects.debug.totalCycles = {
    "x": relToAbs(0.65, 0),
    "y": relToAbs(0.06, 1),
    "name":"lblCPUDebugCyclesTotal",
    "text":"  CPU Cycles: " + cpuCount + " Total",
    "shape":"text",
    "render":function(self) {
      canvasControl.drawText(self.x, self.y, self.text, self, null, null, {"fillStyle":"#00FFFF"});
    },
    "visible": true
  };

  persistantObjects.debug.cycles = {
    "x": relToAbs(0.65, 0),
    "y": relToAbs(0.075, 1),
    "name":"lblCPUDebugCycles",
    "text":"  CPU Cycle : " + pad(runningCPU.cycles, 5),
    "shape":"text",
    "render":function(self) {
      canvasControl.drawText(self.x, self.y, self.text, self, null, null, {"fillStyle":"#00FFFF"});
    },
    "visible": true
  };

  persistantObjects.debug.pendingScreenUpdates = {
    "x": relToAbs(0.65, 0),
    "y": relToAbs(0.095, 1),
    "name":"lblCPUDebugCycles",
    "text":"  Penren    : " + pad(usingVideoDriver.videoMemory.length, 4),
    "shape":"text",
    "render":function(self) {
      canvasControl.drawText(self.x, self.y, self.text, self, null, null, {"fillStyle":"#00FFFF"});
    },
    "visible": true
  };

  persistantObjects.debug.cpuType = {
    "x": relToAbs(0.65, 0),
    "y": relToAbs(0.115, 1),
    "name":"lblCPUDebugCpuType",
    "text":"  CPU Type  : " + runningCPU.name,
    "shape":"text",
    "render":function(self) {
      canvasControl.drawText(self.x, self.y, self.text, self, null, null, {"fillStyle":"#00FFFF"});
    },
    "visible": true
  };

  persistantObjects.debug.cpuOverloadType = {
    "x": relToAbs(0.65, 0),
    "y": relToAbs(0.135, 1),
    "name":"lblCPUDebugCpuType",
    "text":"  CPU OVRLD : " + (runningCPUOverride ? runningCPUOverride.name : ''),
    "shape":"text",
    "render":function(self) {
      canvasControl.drawText(self.x, self.y, self.text, self, null, null, {"fillStyle":"#00FFFF"});
    },
    "visible": true
  };

  persistantObjects.debug.displayDriver = {
    "x": relToAbs(0.65, 0),
    "y": relToAbs(0.155, 1),
    "name":"lblCPUDebugDisplayDriverMode",
    "text":"  DispDriver: " + usingVideoDriver.name,
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
    "y": relToAbs(0.025, 1),
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
    "y": relToAbs(0.04, 1),
    "name":"lblCPUFlagSP",
    "text":"  SP (Address): " + pad(runningCPU.flags.sp.toString(16), 4),
    "shape":"text",
    "render":function(self) {
      canvasControl.drawText(self.x, self.y, self.text, self, null, null, {"fillStyle":"#00FFFF"});
    },
    "visible": true
  };

  persistantObjects.flags.ix = {
    "x": relToAbs(0.5, 0),
    "y": relToAbs(0.06, 1),
    "name":"lblCPUFlagIX",
    "text":"  IX          : " + pad(runningCPU.flags.ix.toString(16), 4),
    "shape":"text",
    "render":function(self) {
      canvasControl.drawText(self.x, self.y, self.text, self, null, null, {"fillStyle":"#00FFFF"});
    },
    "visible": true
  };

  persistantObjects.flags.iy = {
    "x": relToAbs(0.5, 0),
    "y": relToAbs(0.075, 1),
    "name":"lblCPUFlagIY",
    "text":"  IY          : " + pad(runningCPU.flags.iy.toString(16), 4),
    "shape":"text",
    "render":function(self) {
      canvasControl.drawText(self.x, self.y, self.text, self, null, null, {"fillStyle":"#00FFFF"});
    },
    "visible": true
  };

  persistantObjects.flags.af = {
    "x": relToAbs(0.5, 0),
    "y": relToAbs(0.095, 1),
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
    "y": relToAbs(0.115, 1),
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
    "y": relToAbs(0.135, 1),
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
    "y": relToAbs(0.155, 1),
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

  if (gameScale !== 1) {
    canvasControl.canvasObjects.push(persistantObjects.gameScreen);
  }

  canvasControl.canvasObjects.push(persistantObjects.debug.label);
  canvasControl.canvasObjects.push(persistantObjects.debug.execCount);
  canvasControl.canvasObjects.push(persistantObjects.debug.modeClock);
  canvasControl.canvasObjects.push(persistantObjects.debug.totalCycles);
  canvasControl.canvasObjects.push(persistantObjects.debug.cycles);
  canvasControl.canvasObjects.push(persistantObjects.debug.pendingScreenUpdates);
  canvasControl.canvasObjects.push(persistantObjects.debug.cpuType);
  canvasControl.canvasObjects.push(persistantObjects.debug.cpuOverloadType);
  canvasControl.canvasObjects.push(persistantObjects.debug.displayDriver);

  canvasControl.canvasObjects.push(persistantObjects.flags.label);
  canvasControl.canvasObjects.push(persistantObjects.flags.pc);
  canvasControl.canvasObjects.push(persistantObjects.flags.sp);
  canvasControl.canvasObjects.push(persistantObjects.flags.ix);
  canvasControl.canvasObjects.push(persistantObjects.flags.iy);
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
    "y": relToAbs(0.26, 1),
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
    "y": relToAbs(0.28, 1),
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
      "y": relToAbs(0.30 + (index * 0.015), 1),
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
      "y": relToAbs(0.30 + ((i + previouslyExecInstructions.length) * 0.015), 1),
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
        "y": relToAbs(0.30 + (previouslyExecInstructions.length * 0.015), 1),
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

  
  persistantObjects.portInfo.label = {
    "x": relToAbs(0.50, 0),
    "y": relToAbs(0.61, 1),
    "name":"lblCPUPILabel",
    "text":"Port Info: ",
    "shape":"text",
    "render":function(self) {
      canvasControl.drawText(self.x, self.y, self.text, self, null, null, {"fillStyle":"#99FF00"});
    },
    "visible": true
  };

  persistantObjects.portInfo.port0 = {
    "x": relToAbs(0.50, 0),
    "y": relToAbs(0.63, 1),
    "name":"lblCPUPIPort0",
    "text":"    Port 0:   " + pad(runningCPU.hwIntPorts[0x00] ? runningCPU.hwIntPorts[0x00].toString(2) : "", 8),
    "shape":"text",
    "render":function(self) {
      canvasControl.drawText(self.x, self.y, self.text, self, null, null, {"fillStyle":"#00FFFF"});
    },
    "visible": true
  };

  persistantObjects.portInfo.port1 = {
    "x": relToAbs(0.50, 0),
    "y": relToAbs(0.65, 1),
    "name":"lblCPUPIPort1",
    "text":"    Port 1:   " + pad(runningCPU.hwIntPorts[0x01] ? runningCPU.hwIntPorts[0x01].toString(2) : "", 8),
    "shape":"text",
    "render":function(self) {
      canvasControl.drawText(self.x, self.y, self.text, self, null, null, {"fillStyle":"#00FFFF"});
    },
    "visible": true
  };

  persistantObjects.portInfo.port2 = {
    "x": relToAbs(0.50, 0),
    "y": relToAbs(0.67, 1),
    "name":"lblCPUPIPort2",
    "text":"    Port 2:   " + pad(runningCPU.hwIntPorts[0x02] ? runningCPU.hwIntPorts[0x02].toString(2) : "", 8),
    "shape":"text",
    "render":function(self) {
      canvasControl.drawText(self.x, self.y, self.text, self, null, null, {"fillStyle":"#00FFFF"});
    },
    "visible": true
  };

  persistantObjects.portInfo.port3 = {
    "x": relToAbs(0.50, 0),
    "y": relToAbs(0.69, 1),
    "name":"lblCPUPIPort3",
    "text":"    Port 3:   " + pad(runningCPU.hwIntPorts[0x03] ? runningCPU.hwIntPorts[0x03].toString(2) : "", 8),
    "shape":"text",
    "render":function(self) {
      canvasControl.drawText(self.x, self.y, self.text, self, null, null, {"fillStyle":"#00FFFF"});
    },
    "visible": true
  };

  persistantObjects.portInfo.port4 = {
    "x": relToAbs(0.50, 0),
    "y": relToAbs(0.71, 1),
    "name":"lblCPUPIPort4",
    "text":"    Port 4:   " + pad(runningCPU.hwIntPorts[0x04] ? runningCPU.hwIntPorts[0x04].toString(2) : "", 8),
    "shape":"text",
    "render":function(self) {
      canvasControl.drawText(self.x, self.y, self.text, self, null, null, {"fillStyle":"#00FFFF"});
    },
    "visible": true
  };

  persistantObjects.portInfo.port5 = {
    "x": relToAbs(0.50, 0),
    "y": relToAbs(0.73, 1),
    "name":"lblCPUPIPort5",
    "text":"    Port 5:   " + pad(runningCPU.hwIntPorts[0x05] ? runningCPU.hwIntPorts[0x05].toString(2) : "", 8),
    "shape":"text",
    "render":function(self) {
      canvasControl.drawText(self.x, self.y, self.text, self, null, null, {"fillStyle":"#00FFFF"});
    },
    "visible": true
  };

  persistantObjects.portInfo.port6 = {
    "x": relToAbs(0.50, 0),
    "y": relToAbs(0.75, 1),
    "name":"lblCPUPIPort6",
    "text":"    Port 6:   " + pad(runningCPU.hwIntPorts[0x06] ? runningCPU.hwIntPorts[0x06].toString(2) : "", 8),
    "shape":"text",
    "render":function(self) {
      canvasControl.drawText(self.x, self.y, self.text, self, null, null, {"fillStyle":"#00FFFF"});
    },
    "visible": true
  };

  canvasControl.canvasObjects.push(persistantObjects.portInfo.label);
  canvasControl.canvasObjects.push(persistantObjects.portInfo.port0);
  canvasControl.canvasObjects.push(persistantObjects.portInfo.port1);
  canvasControl.canvasObjects.push(persistantObjects.portInfo.port2);
  canvasControl.canvasObjects.push(persistantObjects.portInfo.port3);
  canvasControl.canvasObjects.push(persistantObjects.portInfo.port4);
  canvasControl.canvasObjects.push(persistantObjects.portInfo.port5);
  canvasControl.canvasObjects.push(persistantObjects.portInfo.port6);

  persistantObjects.mm.label = {
    "x": relToAbs(0.75, 0),
    "y": relToAbs(0.61, 1),
    "name":"lblCPUDebugLabel",
    "text":"Memory Map: ",
    "shape":"text",
    "render":function(self) {
      canvasControl.drawText(self.x, self.y, self.text, self, null, null, {"fillStyle":"#99FF00"});
    },
    "visible": true
  };

  persistantObjects.mm.box = {
    "x": relToAbs(0.75, 0),
    "y": relToAbs(0.63, 1),
    "w": 256,
    "h": 256,
    "shape":"rect",
    "render":function(self) {
      canvasControl.drawRect(self.x, self.y, self.w, self.h, self.renderType, canvasControl.canvasContext, {"strokeStyle": "#FFAAAA", "lineWidth":"3"});
    },
    "visible": true
  };

  canvasControl.canvasObjects.push(persistantObjects.mm.box);
  canvasControl.canvasObjects.push(persistantObjects.mm.label);

  persistantObjects.gameFiles.label = {
    "x": relToAbs(0.50, 0),
    "y": relToAbs(0.80, 1),
    "name":"lblCPUGameFilesLabel",
    "text":"Loaded ROM Files: " + (loadedMemoryFilesList.length > 0 ? ("(MemOffset: " + pad(runningCPU.memory.length.toString(16), 4) + ")") : ''),
    "shape":"text",
    "render":function(self) {
      canvasControl.drawText(self.x, self.y, self.text, self, null, null, {"fillStyle":"#99FF00"});
    },
    "visible": true
  };

  canvasControl.canvasObjects.push(persistantObjects.gameFiles.label);

  persistantObjects.gameFiles.helpText1 = {
    "x": relToAbs(0.50, 0),
    "y": relToAbs(0.82, 1),
    "name":"lblCPUGameFilesLabel",
    "text":"  Drag and drop '*.bin' or '*.json'",
    "shape":"text",
    "render":function(self) {
      canvasControl.drawText(self.x, self.y, self.text, self, null, null, {"fillStyle":"#00FFFF"});
    },
    "visible": true
  };

  persistantObjects.gameFiles.helpText2 = {
    "x": relToAbs(0.50, 0),
    "y": relToAbs(0.84, 1),
    "name":"lblCPUGameFilesLabel",
    "text":"  files here to load them into memory.",
    "shape":"text",
    "render":function(self) {
      canvasControl.drawText(self.x, self.y, self.text, self, null, null, {"fillStyle":"#00FFFF"});
    },
    "visible": true
  };
  
  persistantObjects.gameFiles.helpText3 = {
    "x": relToAbs(0.50, 0),
    "y": relToAbs(0.86, 1),
    "name":"lblCPUGameFilesLabel",
    "text":"  Use bin2json to convert.",
    "shape":"text",
    "render":function(self) {
      canvasControl.drawText(self.x, self.y, self.text, self, null, null, {"fillStyle":"#00FFFF"});
    },
    "visible": true
  };

  persistantObjects.gameFiles.helpText4 = {
    "x": relToAbs(0.50, 0),
    "y": relToAbs(0.90, 1),
    "name":"lblCPUGameFilesLabel",
    "text":"See the readme with the source code",
    "shape":"text",
    "render":function(self) {
      canvasControl.drawText(self.x, self.y, self.text, self, null, null, {"fillStyle":"#00FFFF"});
    },
    "visible": true
  };
  
  persistantObjects.gameFiles.helpText5 = {
    "x": relToAbs(0.50, 0),
    "y": relToAbs(0.92, 1),
    "name":"lblCPUGameFilesLabel",
    "text":"for more help",
    "shape":"text",
    "render":function(self) {
      canvasControl.drawText(self.x, self.y, self.text, self, null, null, {"fillStyle":"#00FFFF"});
    },
    "visible": true
  };
  
  if (loadedMemoryFilesList.length === 0) {
    canvasControl.canvasObjects.push(persistantObjects.gameFiles.helpText1);
    canvasControl.canvasObjects.push(persistantObjects.gameFiles.helpText2);
    canvasControl.canvasObjects.push(persistantObjects.gameFiles.helpText3);
    canvasControl.canvasObjects.push(persistantObjects.gameFiles.helpText4);
    canvasControl.canvasObjects.push(persistantObjects.gameFiles.helpText5);
  }

  for (var i = 0; i < loadedMemoryFilesList.length; i++) {
    var newFile = {
      "x": relToAbs(0.50, 0),
      "y": relToAbs(0.82 + (i * 0.02), 1),
      "name":"lblCPUGameFilesLoaded" + i,
      "text": "    " + loadedMemoryFilesList[i],
      "shape":"text",
      "render":function(self) {
        canvasControl.drawText(self.x, self.y, self.text, self, null, null, {"fillStyle":"#00FFFF"});
      },
      "visible": true
    };

    canvasControl.canvasObjects.push(newFile);
  }

  persistantObjects.cpuChecksum.info = {
    "x": relToAbs(0.5, 0),
    "y": relToAbs(0.94, 1),
    "name":"lblCPUChecksumLabel",
    "text":"CPU Checksum",
    "shape":"text",
    "render":function(self) {
      canvasControl.drawText(self.x, self.y, self.text, self, null, null, {"fillStyle":"#99FF00"});
    },
    "visible": true
  };

  persistantObjects.cpuChecksum.textValue = {
    "x": relToAbs(0.5, 0),
    "y": relToAbs(0.96, 1),
    "name":"lblCPUChecksumValue",
    "text": getCpuCheckSum(),
    "shape":"text",
    "render":function(self) {
      canvasControl.drawText(self.x, self.y, self.text, self, null, null, {"fillStyle":"#0066FF"});
    },
    "visible": true
  };

  canvasControl.canvasObjects.push(persistantObjects.cpuChecksum.info);
  canvasControl.canvasObjects.push(persistantObjects.cpuChecksum.textValue);

}
