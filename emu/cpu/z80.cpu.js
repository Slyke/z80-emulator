if (!emu) {
  var emu = {};
}

if (!emu.cpuList) {
  emu.cpuList = [];
}

emu.cpuList.push(function() {
  var cpuRet = {
    name: "z80",
    type: "cpu",
    halted: false,
    cbs: {},
    pins: {
      m1: false,
      mreq: false,
      iorq: false,
      rd: false,
      wr: false
    },
    counts: {
      exec: 0,
      cycles: 0,
      tCycles: 0
    },
    registers: {
      pc: 0,
      sp: 0,
      a: 0,
      b: 0,
      c: 0,
      d: 0,
      e: 0,
      f: 0,
      ix: 0,
      iy: 0
    }
  };

  cpuRet.getRegister = function(emuState, cpuRegister) {
    cpuRegister = cpuRegister.toLowerCase();

    switch (cpuRegister) {
      case 'a': {
        return emuState.cpu.registers.a & 0xff;
      }

      case 'f': {
        return emuState.cpu.registers.f & 0xff;
      }

      case 'b': {
        return emuState.cpu.registers.b & 0xff;
      }

      case 'c': {
        return emuState.cpu.registers.c & 0xff;
      }

      case 'd': {
        return emuState.cpu.registers.d & 0xff;
      }

      case 'e': {
        return emuState.cpu.registers.e & 0xff;
      }

      case 'h': {
        return emuState.cpu.registers.h & 0xff;
      }

      case 'l': {
        return emuState.cpu.registers.l & 0xff;
      }

      case 'af': {
        return ((cpuRet.getRegister(emuState, 'a') << 8) | (cpuRet.getRegister(emuState, 'f'))) & 0xffff
      }

      case 'bc': {
        return ((cpuRet.getRegister(emuState, 'b') << 8) | (cpuRet.getRegister(emuState, 'c'))) & 0xffff
      }

      case 'de': {
        return ((cpuRet.getRegister(emuState, 'd') << 8) | (cpuRet.getRegister(emuState, 'e'))) & 0xffff
      }

      case 'hl': {
        return ((cpuRet.getRegister(emuState, 'h') << 8) | (cpuRet.getRegister(emuState, 'l'))) & 0xffff
      }

      case 'ix': {
        return emuState.cpu.registers.ix & 0xffff;
      }

      case 'iy': {
        return emuState.cpu.registers.iy & 0xffff;
      }

      default: {
        throw new Error("[CPU::getRegister()]: Unknown register:", cpuRegister, emuState);
      }
    }
  };

  cpuRet.requestInterrupt = function(emuState, fReg = 'f') {
    emuState.cpu.registers[fReg] |= fFlags.interrupt;
  };

  cpuRet.cancelInterruptRequest = function(emuState, fReg = 'f') {
    emuState.cpu.registers[fReg] &= ~fFlags.interrupt & 0xff;
  };

  cpuRet.handleInterrupt = function(emuState) {
    if (emuState.alu.checkAluFlags(emuState.cpu.registers.f, "I")) {
      // We need to push the current PC to (SP) so we can return after executing the interrupt.
      // emuState.cpu.push(emuState, emuState.cpu.registers.pc); // Handled by arcade machine hardware.

      // cpuRet.setRegister(emuState, 'pc', state.pInterrupt); // Handled by arcade machine hardware.
      if (typeof(emuState.cpu.cbs.handleInterrupt) === "function") {
        emuState.cpu.cbs.handleInterrupt(emuState);
      }
    }
  };

  cpuRet.pcInc = function(emuState, count = 1) {
    cpuRet.setRegister(emuState, 'pc', count);
  }

  cpuRet.setRegister = function(emuState, cpuRegister, value) {
    cpuRegister = cpuRegister.toLowerCase();
    
    if (typeof(value) === 'object') {
      value = ((value[1] << 8) | value[0]) & 0xffff;
    }

    var newValue0xff = (value & 0xff);

    switch (cpuRegister) {
      case 'pc': {
        emuState.cpu.registers.pc = value;
        break;
      }

      case 'sp': {
        emuState.cpu.registers.sp = value;
        break;
      }

      case 'ix': {
        emuState.cpu.registers.ix = value;
        break;
      }

      case 'iy': {
        emuState.cpu.registers.iy = value;
        break;
      }

      case 'a': {
        emuState.cpu.registers.a = newValue0xff;
        break;
      }

      case 'f': {
        emuState.cpu.registers.f = newValue0xff;
        break;
      }

      case 'b': {
        emuState.cpu.registers.b = newValue0xff;
        break;
      }

      case 'c': {
        emuState.cpu.registers.c = newValue0xff;
        break;
      }

      case 'd': {
        emuState.cpu.registers.d = newValue0xff;
        break;
      }

      case 'e': {
        emuState.cpu.registers.e = newValue0xff;
        break;
      }

      case 'af': {
        cpuRet.setRegister(emuState, 'a', ((value & 0xff00) >> 8) & 0xff);
        cpuRet.setRegister(emuState, 'f', newValue0xff);
        break;
      }

      case 'bc': {
        cpuRet.setRegister(emuState, 'b', ((value & 0xff00) >> 8) & 0xff);
        cpuRet.setRegister(emuState, 'c', newValue0xff);
        break;
      }

      case 'de': {
        cpuRet.setRegister(emuState, 'd', ((value & 0xff00) >> 8) & 0xff);
        cpuRet.setRegister(emuState, 'e', newValue0xff);
        break;
      }

      case 'hl': {
        cpuRet.setRegister(emuState, 'h', ((value & 0xff00) >> 8) & 0xff);
        cpuRet.setRegister(emuState, 'l', newValue0xff);
        break;
      }

      default: {
        throw new Error("[CPU::setRegister()]: Unknown register:", cpuRegister, emuState);
      }
    }
  };

  cpuRet.addCycles = function(emuState, amount) {
    emuState.cpu.counts.cycles += amount;
    emuState.cpu.counts.tCycles += amount;
  };

  cpuRet.intst = {
    nop: function(emuState) {
      emuState.cpu.addCycles(emuState, 4);
    },
    setReg: function(emuState, reg, value) {
      emuState.cpu.setRegisters(emuState, reg, value);
    },
    setRegFromReg: function(emuState, reg1, reg2) {
      emuState.cpu.setRegisters(emuState, reg1, emuState.cpu.setRegisters(emuState, reg2));
    },
    setRegFromMem: function(emuState, reg, addr) {
      if (reg.length === 2) {
        emuState.cpu.setRegisters(emuState, reg, emuState.mmu.readWord(emuState, addr));
      } else {
        emuState.cpu.setRegisters(emuState, reg, emuState.mmu.readByte(emuState, addr));
      }
    },
    setMemByte: function(emuState, address, value) {
      emuState.mmu.writeByte(emuState, address, value);
    },
    deIncMemByte: function(emuState, address, value = 1) {
      emuState.mmu.writeByte(emuState, address, emuState.alu.indecrementByte(emuState, emuState.mmu.readByte(emuState, address), value));
    },
    setMemWord: function(emuState, address, value) {
      emuState.mmu.writeWord(emuState, address, value);
    },
    deIncMultiReg: function(emuState, register, value = 1) {
      emuState.cpu.setRegisters(emuState, register, (emuState.cpu.getRegisters(emuState, register) + value));
    },
    deIncReg: function(emuState, register, value = 1) {
      emuState.cpu.setRegisters(emuState, register, emuState.alu.indecrementByte(emuState, emuState.cpu.getRegisters(emuState, register), value));
    },
    rlc: function(emuState) {
      emuState.alu.rlc(emuState);
    },
    rrc: function(emuState) {
      emuState.alu.rrc(emuState);
    },
    rlc9: function(emuState) {
      emuState.alu.rlc9(emuState);
    },
    rrcc: function(emuState) {
      emuState.alu.rrcc(emuState);
    },
    cpl: function(emuState) {
      emuState.alu.cpl(emuState);
    },
    srf: function(emuState, rFlag, aluFlag) {
      emuState.cpu.registers[rFlag] |= emuState.alu.fFlags[aluFlag];
    },
    crf: function(emuState, rFlag, aluFlag) {
      emuState.cpu.registers[rFlag] &= ~emuState.alu.fFlags[aluFlag];
    }
  };

  return cpuRet;
});