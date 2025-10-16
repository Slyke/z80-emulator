/*
  CTRL - Controller
    This module is the controller for the Z80 emulator. Its job is to setup the environment and virtual hardware.

// */

if (!objEmulatorFactory) {
  var objEmulatorFactory = {};
}

(function(objEmulatorFactory) {
  if (!objEmulatorFactory.ctrlList) {
    objEmulatorFactory.ctrlList = [];
  }

  objEmulatorFactory.ctrlList.push(function() {
    var ctrlRet = {
      name: "Z80_Arcade",
      type: "ctrl",
      systemType: "z80",
      alu: {},    // Arithmetic Logic Unit
      ctrl: {},   // Controller
      cpu: {},    // Central Processing Unit
      dec: {},    // Instruction Decoder
      hwio: {},   // Hardware Input/Output
      mmu: {},    // Memory Management Unit
      utils: {},  // Util functions
      gpu: {},    // Graphical Processing Unit
      dis: {},    // Byte Code Disassembler
      hwPortData: {},
      maxInstructionHistory: 10,
      emulationRunning: false,
      gameTimerClock: null
    };

    ctrlRet.ctrl = ctrlRet;

    ctrlRet.start = function(emu, runType = 'i', timer = 1) {
      emu.ctrl.emulationRunning = true;
      var lastInstructionFinished = true;
      emu.ctrl.gameTimerClock = setInterval(function() {
        if (lastInstructionFinished) {
          lastInstructionFinished = false;
          lastInstructionFinished = emu.ctrl.runCycle(emu, runType);
        } else {
          emu.ctrl.pause(emu);
          throw {
            type: "Error",
            moduleName: ctrlRet.type,
            functionName: "(clocktick) start",
            reason: "CPU started next instruction before finishing current. Slow down clock timer.",
            runType: runType,
            clockIntervalTime: timer,
            args: arguments,
            emulatorState: emu
          };
        }
      }, timer);
    };

    ctrlRet.pause = function(emu) {
      clearInterval(ctrlRet.gameTimerClock);
      emu.ctrl.emulationRunning = false;
    };

    ctrlRet.runCycle = function(emu, runType = 'i') {
      if (emu.ctrl.emulationRunning === true) {
        if (runType === 'i') {
          emu.ctrl.cpuRunUntilInterruptCheck(emu);
        } else if(runType === 'e') {
          emu.ctrl.cpuEval(emu);
        } else {
          emu.ctrl.pause(emu);
          throw {
            type: "Error",
            moduleName: ctrlRet.type,
            functionName: "runCycle",
            reason: "Unknown runType for CPU cycle. Run type is either 'i' for interrupt or 'e' for eval",
            runType: runType,
            args: arguments,
            emulatorState: emu
          };
        }
        return true;
      }

      return false;
    };

    ctrlRet.getSys = function(systemList, systemName) {
      for (var i = 0; i < systemList.length; i++) {
        if (systemName === systemList[i]().name) {
          return systemList[i];
        }
      }
    };

    ctrlRet.setup = function(systemsList) {
      ctrlRet.alu = ctrlRet.getSys(systemsList.aluList, ctrlRet.systemType)();
      ctrlRet.ctrl = ctrlRet;
      ctrlRet.cpu = ctrlRet.getSys(systemsList.cpuList, ctrlRet.systemType)();
      ctrlRet.dec = ctrlRet.getSys(systemsList.decList, ctrlRet.systemType)();
      ctrlRet.hwio = ctrlRet.getSys(systemsList.hwioList, ctrlRet.systemType)();
      ctrlRet.mmu = ctrlRet.getSys(systemsList.mmuList, ctrlRet.systemType)();
      ctrlRet.utils = ctrlRet.getSys(systemsList.utilsList, ctrlRet.systemType)();
      ctrlRet.gpu = ctrlRet.getSys(systemsList.gpuList, ctrlRet.systemType)();
      ctrlRet.dis = ctrlRet.getSys(systemsList.disList, ctrlRet.systemType)();

      ctrlRet.setupCheck(ctrlRet, 'alu', ctrlRet.systemType);
      ctrlRet.setupCheck(ctrlRet, 'ctrl', ctrlRet.systemType);
      ctrlRet.setupCheck(ctrlRet, 'cpu', ctrlRet.systemType);
      ctrlRet.setupCheck(ctrlRet, 'hwio', ctrlRet.systemType);
      ctrlRet.setupCheck(ctrlRet, 'mmu', ctrlRet.systemType);
      ctrlRet.setupCheck(ctrlRet, 'utils', ctrlRet.systemType);
      ctrlRet.setupCheck(ctrlRet, 'gpu', ctrlRet.systemType);
      ctrlRet.setupCheck(ctrlRet, 'dis', ctrlRet.systemType);
    };

    ctrlRet.resetSubsystem = function(subsystem, subsystemList) {
      ctrlRet[subsystem] = ctrlRet.getSys(subsystemList, ctrlRet.systemType)();

      ctrlRet.setupCheck(ctrlRet, subsystem, ctrlRet.systemType);
    };

    ctrlRet.resetSystem = function(systemsList, memory = false, cpu = false, hwio = false, gpu = false) {
      ctrlRet.resetSubsystem('alu', systemsList.aluList);
      ctrlRet.resetSubsystem('utils', systemsList.utilsList);
      ctrlRet.resetSubsystem('dis', systemsList.disList);

      if (memory) {
        ctrlRet.resetSubsystem('mmu', systemsList.mmuList);
      }
      
      if (cpu) {
        ctrlRet.resetSubsystem('cpu', systemsList.cpuList);
      }
      
      if (gpu) {
        ctrlRet.resetSubsystem('gpu', systemsList.gpuList);
      }

      if (hwio) {
        ctrlRet.resetSubsystem('hwio', systemsList.hwioList);
        ctrlRet.ctrl.setupExternalVirtualHardware(ctrlRet);
      }
    };

    ctrlRet.setupCheck = function(emuController, systemType) {
      if (!emuController[systemType.toLowerCase()]) {
        throw { type: "Error", moduleName: ctrlRet.type, functionName: "setupCheck", reason: "Could not find subsystem", args: arguments };
      }
    };

    ctrlRet.setupExternalVirtualHardware = function(emu) {
      // Video processor.
      emu.mmu.cbsr.memoryUpdateCb(function(emuState, address, value, event) {
        if (event === emu.mmu.cbEvents.write) {
          if (address >= 0x2400) {
            if (emuState.gpu.videoArrayDiffFrameBuffer.indexOf(address) === -1) {
              emuState.gpu.videoArrayDiffFrameBuffer.push(address);
            }
          }
        }
      });

      emu.hwio.cbsr.currentInterruptCb(function(emu, interrupt) {
        if (emu.gpu.videoArrayDiffFrameBuffer.length > 1) {
          emu.gpu.renderVideo(emu, emu.gpu.videoRawData);
        }
      });

      // Looks like the game is communicating with some external hardware. This function mocks that hardware. Game crashes without it.
      emu.hwio.cbsr.readPortCb(function(emu, portCh) {
        if (portCh === 0x03) {
          return emu.ctrl.hwPortData[0x04] | 0;
        } else if (portCh === 0x02) {
          return 0;
        }

        return ctrlRet.hwPortData[portCh];
      });

      emu.hwio.cbsr.writePortCb(function(emu, portCh, value) {
        emu.ctrl.hwPortData[portCh] = value;
      });
    }

    ctrlRet.cpuRunUntilInterruptCheck = function(emu) {
      while (!ctrlRet.cpuEval(emu)) {
        // Do nothing
      }

      return;
    }

    ctrlRet.cpuEval = function(emu) {

      var prePC = emu.cpu.registers.pc;

      // Not all OPCodes will have 3 bytes. The trailing bytes are ignored if unsed.
      var currentInstruction = [emu.mmu.memory[prePC], emu.mmu.memory[prePC + 1], emu.mmu.memory[prePC + 2]];
      var preCycleChange = emu.cpu.counts.cycles;

      if (emu.cpu.pins.hlt) {
        currentInstruction = [0x00, 0x00, 0x00, 0x00]; // Single NOP
      }

      var opCost = emu.dec.decoderParams[currentInstruction[0]];
      var disObj;

      if (opCost < 0 || opCost === undefined) {
        throw {
          type: "Error",
          moduleName: ctrlRet.type,
          functionName: "cpuEval",
          reason: "CPU failed to decode OP Code Parameters",
          args: arguments,
          emulatorState: emu,
          opCodes: currentInstruction
        };
      }

      if (emu.dis) {
        disObj = emu.dis.disassembleInstruction(emu, emu.mmu.memory.slice((emu.cpu.registers.pc), (emu.cpu.registers.pc + 4)));

        if (disObj) {
          emu.dis.previouslyExecutedInstructions.push(disObj);
        }

        if (emu.dis.previouslyExecutedInstructions.length > ctrlRet.maxInstructionHistory) {
          emu.dis.previouslyExecutedInstructions.shift();
        }
      }

      emu.cpu.pcInc(emu, emu.dec.decoderParams[currentInstruction[0]]);

      var execRet = emu.dec.decode[currentInstruction[0]](
        emu,
        emu.dec.decoderParams[currentInstruction[0]] > 1 ? [
          emu.dec.decoderParams[currentInstruction[0]] > 1 ? currentInstruction[1] : undefined,
          emu.dec.decoderParams[currentInstruction[0]] > 2 ? currentInstruction[2] : undefined
        ] : undefined
      );

      if (opCost === 0) { // For special IX and IY registers
        emu.cpu.pcInc(emu, execRet + 1);
      }

      emu.cpu.counts.modeClock = ((emu.cpu.counts.modeClock + 1) & 0xffff);
      emu.cpu.counts.exec++;

      if (execRet < 1) {
        throw {
          type: "Error",
          moduleName: ctrlRet.type,
          functionName: "cpuEval",
          reason: "CPU failed to decode OP Code",
          args: arguments,
          emulatorState: emu,
          opCodes: currentInstruction
        };
      }

      if (prePC === emu.cpu.registers.pc) {
        throw {
          type: "Error",
          moduleName: ctrlRet.type,
          functionName: "cpuEval",
          reason: "CPU failed to increase PC",
          args: arguments,
          emulatorState: emu,
          opCodes: currentInstruction
        };
      }

      if (preCycleChange === emu.cpu.counts.cycles) {
        throw {
          type: "Error",
          moduleName: ctrlRet.type,
          functionName: "cpuEval",
          reason: "CPU failed to increase clock count",
          args: arguments,
          emulatorState: emu,
          opCodes: currentInstruction
        };
      }

      if (disObj) {
        if (disObj.cycleCost !== (emu.cpu.counts.cycles - preCycleChange)) {
          throw {
            type: "Error",
            moduleName: ctrlRet.type,
            functionName: "cpuEval",
            reason: "CPU Cycle change did not match Disessembler Cycle change.",
            disassemblerCycleChange: disObj.cycleCost,
            cpuCycleChange: (emu.cpu.counts.cycles - preCycleChange),
            args: arguments,
            emulatorState: emu,
            opCodes: currentInstruction
          };
        }
      }

      return emu.hwio.interruptCheck(emu);
    };

    return ctrlRet;
  });

  if (typeof(module) !== 'undefined') { // Node
    module.exports = objEmulatorFactory.utilsList;
  } else if (typeof define === 'function' && define.amd) { // AMD
    define([], function () {
        'use strict';
        return objEmulatorFactory.utilsList;
    });
  }

})(objEmulatorFactory);
