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
      dis: {}     // Byte Code Disassembler
    };

    ctrlRet.ctrl = ctrlRet;

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

    ctrlRet.resetSystem = function(systemsList, memory = false, cpu = false, hwio = false) {
      ctrlRet.resetSubsystem('alu', systemsList.aluList);
      ctrlRet.resetSubsystem('utils', systemsList.utilsList);
      ctrlRet.resetSubsystem('gpu', systemsList.gpuList);
      ctrlRet.resetSubsystem('dis', systemsList.disList);

      if (memory) {
        ctrlRet.resetSubsystem('mmu', systemsList.mmuList);
      }
      
      if (cpu) {
        ctrlRet.resetSubsystem('cpu', systemsList.cpuList);
      }
      
      if (hwio) {
        ctrlRet.resetSubsystem('hwio', systemsList.hwioList);
      }
    };

    ctrlRet.setupCheck = function(emuController, systemType) {
      if (!emuController[systemType.toLowerCase()]) {
        throw { type: "Error", moduleName: ctrlRet.type, functionName: "setupCheck", reason: "Could not find subsystem", args: arguments };
      }
    };

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
        currentInstruction = 0x00; // NOP
      }

      var opCost = emu.dec.decoderParams[currentInstruction[0]];

      if (opCost < 0 || opCost === undefined) {
        throw {
          type: "Error",
          moduleName: ctrlRet.type,
          functionName: "cpuEval",
          reason: "CPU failed to decode OP Code Parameters",
          args: arguments,
          emulatorState: emuState,
          opCodes: currentInstruction
        };
      }

      emu.cpu.pcInc(emu, emu.dec.decoderParams[currentInstruction[0]]);

      var execRet = emu.dec.decode[currentInstruction[0]](
        emu,
        emu.dec.decoderParams[currentInstruction[0]] > 1 ? currentInstruction[1] : undefined,
        emu.dec.decoderParams[currentInstruction[0]] > 2 ? currentInstruction[2] : undefined
        );

      if (opCost === 0) { // For special IX and IY registers
        emu.cpu.pcInc(emu, execRet + 1);
      }

      emu.cpu.counts.tCycles += (emu.cpu.counts.cycles - preCycleChange);
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
