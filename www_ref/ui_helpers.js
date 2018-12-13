
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

function uiPreframeSetup(canvasControl, emu, persistantObjects, showMemoryInspector) {

  var uiFragments = {
    disassemblerBase: [0.5, 0.26],
    loadedRomFilesBase: [0.5, 0.8],
    memoryMapBase: [0.75, 0.61],
    portInfoBase: [0.5, 0.61],
    stackPointerInfoBase: [0.5, 0.18],
    instructionKeysText: [0.05, 0.5],
    cpuChecksumBase: [0.5, 0.94]
  };

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
    "     L - 1 (Step by step)",
    "Shift pressing will go forward interrupt cycles."
  ];

  emu.utils.getKeyBoardKeysText().reverse().forEach(function (text) {
    helpText.unshift(text);
  });

  helpText.forEach(function(helpIndex, i) {
    var objHelpText = {
      "x": relToAbs(uiFragments.instructionKeysText[0], 0),
      "y": ((emu.gpu.resolution[1] * gameScale) + relToAbs(0.02, 1) + relToAbs(gameTopLeftCoord[1], 1)) + (relToAbs(i * 0.02, 1)),
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
    gameScreenRenderData = Uint8ClampedArrayImageToPNG(gameScreenImageData, emu.gpu.resolution);
  }
  persistantObjects.gameScreen = {
    "x": relToAbs(gameTopLeftCoord[0], 0),
    "y": relToAbs(gameTopLeftCoord[1], 1),
    "w": emu.gpu.resolution[0],
    "h": emu.gpu.resolution[1],
    "name":"gameScreen",
    "sw": emu.gpu.resolution[0] * gameScale,
    "sh": emu.gpu.resolution[1] * gameScale,
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
    "w": emu.gpu.resolution[0] * gameScale,
    "h": emu.gpu.resolution[1] * gameScale,
    "shape":"rect",
    "render":function(self) {
      canvasControl.drawRect(self.x, self.y, self.w, self.h, self.renderType, canvasControl.canvasContext, {"strokeStyle": "#FFAAAA", "lineWidth":"3"});
    },
    "visible": true
  };

  // var disObj = runningCPU.disassemble8080OP(runningCPU, emu.cpu.registers.pc);

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
  if (emu.cpu.counts.exec < 99999999) {
    execCount = pad(emu.cpu.counts.exec, 8);
  } else {
    if (emu.cpu.counts.exec < 0xffffffff) {
      execCount = pad(emu.cpu.counts.exec.toString(16), 8);
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
  if (emu.cpu.counts.tCycles < 99999999) {
    cpuCount = pad(emu.cpu.counts.tCycles, 8);
  } else {
    if (emu.cpu.counts.tCycles < 0xffffffff) {
      cpuCount = pad(emu.cpu.counts.tCycles.toString(16), 8);
    } else {
      cpuCount = "OvrFlw"
    }
  }

  persistantObjects.debug.modeClock = {
    "x": relToAbs(0.65, 0),
    "y": relToAbs(0.04, 1),
    "name":"lblCPUDebugModeClock",
    "text":"  Mode Clock: " + pad(emu.cpu.counts.modeClock, 5),
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
    "text":"  CPU Cycle : " + pad(emu.cpu.counts.cycles, 5),
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
    // "text":"  Penren    : " + pad(usingVideoDriver.videoMemory.length, 4),
    "text":"  Penren    : " + pad(-1, 4),
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
    "text":"  CPU Type  : " + emu.cpu.name,
    "shape":"text",
    "render":function(self) {
      canvasControl.drawText(self.x, self.y, self.text, self, null, null, {"fillStyle":"#00FFFF"});
    },
    "visible": true
  };

  persistantObjects.debug.emuType = {
    "x": relToAbs(0.65, 0),
    "y": relToAbs(0.135, 1),
    "name":"lblCPUDebugEmuType",
    "text":"  Emu Type  : " + emu.ctrl.name,
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
    "text":"  DispDriver: " + emu.gpu.name,
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
    "text":"  PC (Address): " + pad(emu.cpu.registers.pc.toString(16), 4),
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
    "text":"  SP (Address): " + pad(emu.cpu.registers.sp.toString(16), 4),
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
    "text":"  IX          : " + pad(emu.cpu.registers.ix.toString(16), 4),
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
    "text":"  IY          : " + pad(emu.cpu.registers.iy.toString(16), 4),
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
    "text":"  A F:         " + pad(emu.cpu.registers.a.toString(16), 2) + " " + pad(emu.cpu.registers.f.toString(16), 2),
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
    "text":"  B C:         " + pad(emu.cpu.registers.b.toString(16), 2) + " " + pad(emu.cpu.registers.c.toString(16), 2),
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
    "text":"  D E:         " + pad(emu.cpu.registers.d.toString(16), 2) + " " + pad(emu.cpu.registers.e.toString(16), 2),
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
    "text":"  H L:         " + pad(emu.cpu.registers.h.toString(16), 2) + " " + pad(emu.cpu.registers.l.toString(16), 2),
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
    "text":"  Carry (0x01):        " + ((emu.cpu.registers.f & 0x01) === 0x01).toString(),
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
    "text":"  Parity (0x04):       " + ((emu.cpu.registers.f & 0x04) === 0x04).toString(),
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
    "text":"  Half Carry (0x10):   " + ((emu.cpu.registers.f & 0x10) === 0x10).toString(),
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
    "text":"  Interupt (0x20):     " + ((emu.cpu.registers.f & 0x20) === 0x20).toString(),
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
    "text":"  Zero (0x40):         " + ((emu.cpu.registers.f & 0x40) === 0x40).toString(),
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
    "text":"  Sign (0x80):         " + ((emu.cpu.registers.f & 0x80) === 0x80).toString(),
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
  canvasControl.canvasObjects.push(persistantObjects.debug.emuType);
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
    "x": relToAbs(uiFragments.stackPointerInfoBase[0], 0),
    "y": relToAbs(uiFragments.stackPointerInfoBase[1], 1),
    "name":"lblCPUSPHelper",
    "text":"Stack Pointer Values (SP+0 to SP+8)",
    "shape":"text",
    "render":function(self) {
      canvasControl.drawText(self.x, self.y, self.text, self, null, null, {"fillStyle":"#99FF00"});
    },
    "visible": true
  };

  persistantObjects.stackPointer.labelA = {
    "x": relToAbs(uiFragments.stackPointerInfoBase[0] - 0.005, 0),
    "y": relToAbs(uiFragments.stackPointerInfoBase[1] + 0.02, 1),
    "name":"lblCPUSPA",
    "text":"  A",
    "shape":"text",
    "render":function(self) {
      canvasControl.drawText(self.x, self.y, self.text, self, null, null, {"fillStyle":"#99FF00"});
    },
    "visible": true
  };

  persistantObjects.stackPointer.labelV = {
    "x": relToAbs(uiFragments.stackPointerInfoBase[0] - 0.005, 0),
    "y": relToAbs(uiFragments.stackPointerInfoBase[1] + 0.04, 1),
    "name":"lblCPUSPV",
    "text":"  V",
    "shape":"text",
    "render":function(self) {
      canvasControl.drawText(self.x, self.y, self.text, self, null, null, {"fillStyle":"#99FF00"});
    },
    "visible": true
  };

  persistantObjects.memoryInspect.label = {
    "x": relToAbs(uiFragments.disassemblerBase[0], 0),
    "y": relToAbs(uiFragments.disassemblerBase[1], 1),
    "name":"lblCPUMEMInspect",
    "text":"Memory Inspector",
    "shape":"text",
    "render":function(self) {
      canvasControl.drawText(self.x, self.y, self.text, self, null, null, {"fillStyle":"#99FF00"});
    },
    "visible": true
  };

  persistantObjects.memoryInspect.helper = {
    "x": relToAbs(uiFragments.disassemblerBase[0], 0),
    "y": relToAbs(uiFragments.disassemblerBase[1] + 0.02, 1),
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

  var memSliceSP = emu.mmu.memory.slice(emu.cpu.registers.sp, emu.cpu.registers.sp + 8);

  for (var k = 0; k < memSliceSP.length; k++) {
    var mem1 = memSliceSP[k];
    var mem2 = memSliceSP[k + 1];

    if (!mem1) {
      mem1 = 0;
    }

    if (!mem2) {
      mem2 = 0;
    }

    var newSPPrint = {
      "x": relToAbs(uiFragments.stackPointerInfoBase[0] + 0.03 + (k  * 0.045), 0),
      "y": relToAbs(uiFragments.stackPointerInfoBase[1] + 0.02),
      "name":"lblCPUMEMSPADDR" + k,
      "text": "" + pad((emu.cpu.registers.sp + k).toString(16), 4) + "-" + pad((emu.cpu.registers.sp + k + 1).toString(16), 4),
      "shape":"text",
      "render":function(self) {
        canvasControl.drawText(self.x, self.y, self.text, self, null, null, {"fillStyle":"#FF9999"});
      },
      "visible": true
    };

    var newSPMemPrint = {
      "x": relToAbs(uiFragments.stackPointerInfoBase[0] + 0.03 + (k * 0.045), 0),
      "y": relToAbs(uiFragments.stackPointerInfoBase[1] + 0.04),
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

  if (objEmu.dis.previouslyExecutedInstructions) {
    objEmu.dis.previouslyExecutedInstructions.forEach(function(pei, index) {
      var textOutput = "     ";
      textOutput += pad(pei.programCounter.toString(16), 4) + "         ";
      textOutput += pad(pei.binCode.toString(16), 2) + "     ";
      textOutput += pad(pei.opCode, 8, " ") + "     ";
      textOutput += (pei.iReg ? pad(pei.iReg, 4, " ") : "    ") + "     ";
      textOutput += (pei.oReg ? pad(pei.oReg, 4, " ") : "    ") + "    ";
      textOutput += pad(pei.param1 ? pad(pei.param1.toString(16), 2) : "", 3, " ") + "    ";
      textOutput += pad(pei.param2 ? pad(pei.param2.toString(16), 2) : "", 3, " ") + "      ";
      textOutput += (pei.pointer ? pad(pei.pointer, 1, " ") : ' ');
      
      var newMemPrint = {
        "x": relToAbs(uiFragments.disassemblerBase[0], 0),
        "y": relToAbs(uiFragments.disassemblerBase[1] + 0.04 + (index * 0.015), 1),
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
  }

  var commandPCOffset = 0;

  for (var i = 0; i < 10; i++) {
    var disObj = emu.dis.disassembleInstruction(emu, emu.mmu.memory.slice((emu.cpu.registers.pc + i + commandPCOffset), (emu.cpu.registers.pc + i + commandPCOffset + 4)));

    if (!disObj) {
      break;
    }

    var textOutput = "     ";
    textOutput += pad((emu.cpu.registers.pc + i + commandPCOffset).toString(16), 4) + "         ";
    textOutput += pad(disObj.binCode.toString(16), 2) + "     ";
    textOutput += pad(disObj.opCode, 8, " ") + "     ";
    textOutput += (disObj.iReg ? pad(disObj.iReg, 4, " ") : "    ") + "     ";
    textOutput += (disObj.oReg ? pad(disObj.oReg, 4, " ") : "    ") + "    ";
    textOutput += pad(disObj.param1 ? pad(disObj.param1.toString(16), 2) : "", 3, " ") + "    ";
    textOutput += pad(disObj.param2 ? pad(disObj.param2.toString(16), 2) : "", 3, " ") + "      ";
    textOutput += (disObj.pointer ? pad(disObj.pointer, 1, " ") : ' ');
    commandPCOffset += (disObj.opBytes - 1);

    var newMemPrint = {
      "x": relToAbs(uiFragments.disassemblerBase[0], 0),
      "y": relToAbs(uiFragments.disassemblerBase[1] + 0.04 + ((i + objEmu.dis.previouslyExecutedInstructions.length) * 0.015), 1),
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
        "x": relToAbs(uiFragments.disassemblerBase[0] + 0.005, 0),
        "y": relToAbs(uiFragments.disassemblerBase[1] + 0.04 + (objEmu.dis.previouslyExecutedInstructions.length * 0.015), 1),
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
    "x": relToAbs(uiFragments.portInfoBase[0], 0),
    "y": relToAbs(uiFragments.portInfoBase[1], 1),
    "name":"lblCPUPILabel",
    "text":"Port Info: ",
    "shape":"text",
    "render":function(self) {
      canvasControl.drawText(self.x, self.y, self.text, self, null, null, {"fillStyle":"#99FF00"});
    },
    "visible": true
  };

  for (var i = 0; i < 7; i++) {
    var newPort = {
      "x": relToAbs(uiFragments.portInfoBase[0], 0),
      "y": relToAbs(uiFragments.portInfoBase[1] + 0.02 + (0.02 * i), 1),
      "name":"lblCPUPIPort" + i,
      "text":"    Port " + i + ":   " + pad(objEmu.ctrl.hwPortData[i] ? objEmu.ctrl.hwPortData[i].toString(2) : "", 8),
      "shape":"text",
      "render":function(self) {
        canvasControl.drawText(self.x, self.y, self.text, self, null, null, {"fillStyle":"#00FFFF"});
      },
      "visible": true
    };

    canvasControl.canvasObjects.push(newPort);
    persistantObjects.portInfo.ports.push(newPort);
  }

  canvasControl.canvasObjects.push(persistantObjects.portInfo.label);
  
  persistantObjects.mm.label = {
    "x": relToAbs(uiFragments.memoryMapBase[0], 0),
    "y": relToAbs(uiFragments.memoryMapBase[1], 1),
    "name":"lblCPUDebugLabel",
    "text":"Memory Map: ",
    "shape":"text",
    "render":function(self) {
      canvasControl.drawText(self.x, self.y, self.text, self, null, null, {"fillStyle":"#99FF00"});
    },
    "visible": true
  };

  persistantObjects.mm.box = {
    "x": relToAbs(uiFragments.memoryMapBase[0], 0),
    "y": relToAbs(uiFragments.memoryMapBase[1] + 0.02, 1),
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
    "x": relToAbs(uiFragments.loadedRomFilesBase[0], 0),
    "y": relToAbs(uiFragments.loadedRomFilesBase[1], 1),
    "name":"lblCPUGameFilesLabel",
    "text":"Loaded ROM Files: " + (loadedMemoryFilesList.length > 0 ? ("(MemOffset: " + pad(emu.mmu.memory.length.toString(16), 4) + ")") : ''),
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
      "x": relToAbs(uiFragments.loadedRomFilesBase[0], 0),
      "y": relToAbs(uiFragments.loadedRomFilesBase[1] + 0.02 + (i * 0.02), 1),
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
    "x": relToAbs(uiFragments.cpuChecksumBase[0], 0),
    "y": relToAbs(uiFragments.cpuChecksumBase[1], 1),
    "name":"lblCPUChecksumLabel",
    "text":"CPU Checksum",
    "shape":"text",
    "render":function(self) {
      canvasControl.drawText(self.x, self.y, self.text, self, null, null, {"fillStyle":"#99FF00"});
    },
    "visible": true
  };

  persistantObjects.cpuChecksum.textValue = {
    "x": relToAbs(uiFragments.cpuChecksumBase[0], 0),
    "y": relToAbs(uiFragments.cpuChecksumBase[1] + 0.02, 1),
    "name":"lblCPUChecksumValue",
    "text": objEmu.utils.getCpuCheckSum(objEmu),
    "shape":"text",
    "render":function(self) {
      canvasControl.drawText(self.x, self.y, self.text, self, null, null, {"fillStyle":"#0066FF"});
    },
    "visible": true
  };

  canvasControl.canvasObjects.push(persistantObjects.cpuChecksum.info);
  canvasControl.canvasObjects.push(persistantObjects.cpuChecksum.textValue);

}
