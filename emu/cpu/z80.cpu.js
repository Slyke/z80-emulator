/*
  CPU - Central Processing Unit.
    This module is the CPU for the Z80 processor. The CPU does all the orchestration between the different components.

// */

if (!objEmulatorFactory) {
  var objEmulatorFactory = {};
}

(function(objEmulatorFactory) {
  if (!objEmulatorFactory.cpuList) {
    objEmulatorFactory.cpuList = [];
  }

  objEmulatorFactory.cpuList.push(function() {
    var cpuRet = {
      name: "z80",
      type: "cpu",
      pins: {
        m1: false,
        mreq: false,
        iorq: false,
        rd: false,
        wr: false,
        hlt: false
      },
      counts: {
        exec: 0,
        cycles: 0,
        tCycles: 0,
        modeClock: 0
      },
      registers: {
        pc: 0,
        sp: 0,
        a: 0,
        b: 0,
        c: 0,
        d: 0,
        e: 0,
        h: 0,
        l: 0,
        f: 0,
        ix: 0,
        iy: 0
      }
    };

    cpuRet.getRegister = function(emuState, cpuRegister, endian = 0x01) {
      cpuRegister = cpuRegister.toLowerCase();

      switch (cpuRegister) {
        case 'pc': {
          return emuState.cpu.registers.pc & 0xffff;
        }

        case 'sp': {
          return emuState.cpu.registers.sp & 0xffff;
        }

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
          if (endian === 0x01) {
            return ((cpuRet.getRegister(emuState, 'a') << 8) | (cpuRet.getRegister(emuState, 'f'))) & 0xffff
          }
          return ((cpuRet.getRegister(emuState, 'f') << 8) | (cpuRet.getRegister(emuState, 'a'))) & 0xffff
        }

        case 'bc': {
          if (endian === 0x01) {
            return ((cpuRet.getRegister(emuState, 'b') << 8) | (cpuRet.getRegister(emuState, 'c'))) & 0xffff
          }
          return ((cpuRet.getRegister(emuState, 'c') << 8) | (cpuRet.getRegister(emuState, 'b'))) & 0xffff
        }

        case 'de': {
          if (endian === 0x01) {
            return ((cpuRet.getRegister(emuState, 'd') << 8) | (cpuRet.getRegister(emuState, 'e'))) & 0xffff
          }
          return ((cpuRet.getRegister(emuState, 'e') << 8) | (cpuRet.getRegister(emuState, 'd'))) & 0xffff
        }

        case 'hl': {
          if (endian === 0x01) {
            return ((cpuRet.getRegister(emuState, 'h') << 8) | (cpuRet.getRegister(emuState, 'l'))) & 0xffff
          }
          return ((cpuRet.getRegister(emuState, 'l') << 8) | (cpuRet.getRegister(emuState, 'h'))) & 0xffff
        }

        case 'ix': {
          return emuState.cpu.registers.ix & 0xffff;
        }

        case 'iy': {
          return emuState.cpu.registers.iy & 0xffff;
        }

        default: {
          throw { type: "Error", moduleName: cpuRet.type, functionName: "getRegister", reason: "Unknown register", args: arguments, emulatorState: emuState };
        }
      }
    };

    cpuRet.requestInterrupt = function(emuState, fReg = 'f') {
      emuState.cpu.registers[fReg] |= fFlags.interrupt;
    };

    cpuRet.cancelInterruptRequest = function(emuState, fReg = 'f') {
      emuState.cpu.registers[fReg] &= ~fFlags.interrupt & 0xff;
    };

    cpuRet.pcInc = function(emuState, count = 1) {
      cpuRet.setRegister(emuState, 'pc', cpuRet.getRegister(emuState, 'pc') + count);
    }

    cpuRet.setRegister = function(emuState, cpuRegister, value, endian = 0x02) {
      cpuRegister = cpuRegister.toLowerCase();
      
      if (typeof(value) === 'object') {
        value = ((value[1] << 8) | value[0]) & 0xffff;
      }

      var newValue0xff = (value & 0xff);
      var newValue0xXXff;
      var newValue0xffXX;

      if (endian === 0x01) { // 0x01 = Big endian
        newValue0xXXff = (value & 0xff);
        newValue0xffXX = (((value & 0xff00) >> 8) & 0xff);
      } else {
        newValue0xXXff = (((value & 0xff00) >> 8) & 0xff);
        newValue0xffXX = (value & 0xff);
      }

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

        case 'h': {
          emuState.cpu.registers.h = newValue0xff;
          break;
        }

        case 'l': {
          emuState.cpu.registers.l = newValue0xff;
          break;
        }

        case 'af': {
          cpuRet.setRegister(emuState, 'f', newValue0xffXX);
          cpuRet.setRegister(emuState, 'a', newValue0xXXff);
          break;
        }

        case 'bc': {
          cpuRet.setRegister(emuState, 'c', newValue0xffXX);
          cpuRet.setRegister(emuState, 'b', newValue0xXXff);
          break;
        }

        case 'de': {
          cpuRet.setRegister(emuState, 'e', newValue0xffXX);
          cpuRet.setRegister(emuState, 'd', newValue0xXXff);
          break;
        }

        case 'hl': {
          cpuRet.setRegister(emuState, 'l', newValue0xffXX);
          cpuRet.setRegister(emuState, 'h', newValue0xXXff);
          break;
        }

        default: {
          throw { type: "Error", moduleName: cpuRet.type, functionName: "setRegister", reason: "Unknown register", args: arguments, emulatorState: emuState };
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
        emuState.cpu.setRegister(emuState, reg, value);
      },
      setRegFromReg: function(emuState, reg1, reg2) {
        emuState.cpu.setRegister(emuState, reg1, emuState.cpu.getRegister(emuState, reg2));
      },
      setRegFromMem: function(emuState, reg, addr) {
        if (reg.length === 2) {
          emuState.cpu.setRegister(emuState, reg, emuState.mmu.readWord(emuState, addr));
        } else {
          emuState.cpu.setRegister(emuState, reg, emuState.mmu.readByte(emuState, addr));
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
        emuState.cpu.setRegister(emuState, register, (emuState.cpu.getRegister(emuState, register) + value));
      },
      deIncReg: function(emuState, register, value = 1) {
        emuState.cpu.setRegister(emuState, register, emuState.alu.indecrementByte(emuState, emuState.cpu.getRegister(emuState, register), value));
      },
      deIncRegFromReg: function(emuState, reg1, reg2, value = 1) {
        emuState.cpu.setRegister(emuState, reg1, emuState.alu.addSubByte(emuState, emuState.cpu.getRegister(emuState, reg1), emuState.cpu.getRegister(emuState, reg2), value));
      },
      deIncFromReg: function(emuState, reg1, reg2, value = 1) {
        emuState.alu.addSubByte(emuState, emuState.cpu.getRegister(emuState, reg1), emuState.cpu.getRegister(emuState, reg2), value);
      },
      deIncFromRegAndMem: function(emuState, reg1, address, value = 1) {
        emuState.cpu.setRegister(emuState, reg1, emuState.alu.addSubByte(emuState, emuState.cpu.getRegister(emuState, reg1), emuState.mmu.readByte(emuState, address), value));
      },
      deIncFromRegAndParamWithCarry: function(emuState, reg1, value = 1) {
        emuState.cpu.setRegister(emuState, reg1, emuState.alu.addSubWithCarryByte(emuState, emuState.cpu.getRegister(emuState, reg1), value, value));
      },
      deIncFromRegAndParam: function(emuState, reg1, value = 1, upDown = 1) {
        emuState.cpu.setRegister(emuState, reg1, emuState.alu.addSubByte(emuState, emuState.cpu.getRegister(emuState, reg1), value, upDown));
      },
      deIncFromRegAndParamNoOutput: function(emuState, reg1, value = 1, upDown = 1) {
        emuState.alu.addSubByte(emuState, emuState.cpu.getRegister(emuState, reg1), value, upDown);
      },
      deIncRegFromRegWithCarry: function(emuState, reg1, reg2, value = 1) {
        emuState.cpu.setRegister(emuState, reg1, emuState.alu.addSubWithCarryByte(emuState, emuState.cpu.getRegister(emuState, reg1), emuState.cpu.getRegister(emuState, reg2), value));
      },
      deIncRegFromMem: function(emuState, reg1, address, value = 1) {
        emuState.cpu.setRegister(emuState, reg1, emuState.alu.addSubByte(emuState, emuState.cpu.getRegister(emuState, reg1), emuState.mmu.readByte(emuState, address), value));
      },
      deIncRegFromParam: function(emuState, reg1, p1, value = 1) {
        emuState.cpu.setRegister(emuState, reg1, emuState.alu.addSubByte(emuState, emuState.cpu.getRegister(emuState, reg1), p1), value);
      },
      deIncRegFromMemWithCarry: function(emuState, reg1, address, value = 1) {
        emuState.cpu.setRegister(emuState, reg1, emuState.alu.addSubWithCarryByte(emuState, emuState.cpu.getRegister(emuState, reg1), emuState.mmu.readByte(emuState, address)));
      },
      operandRegWithReg: function(emuState, reg1, reg2, op) {
        emuState.cpu.setRegister(emuState, reg1, emuState.alu.operandByte(emuState, emuState.cpu.getRegister(emuState, reg1), emuState.cpu.getRegister(emuState, reg2), op));
      },
      operandRegWithAddress: function(emuState, reg1, address, op) {
        emuState.cpu.setRegister(emuState, reg1, emuState.alu.operandByte(emuState, emuState.cpu.getRegister(emuState, reg1), emuState.mmu.readByte(emuState, address), op));
      },
      operandRegWithParam: function(emuState, reg1, p1, op) {
        emuState.cpu.setRegister(emuState, reg1, emuState.alu.operandByte(emuState, emuState.cpu.getRegister(emuState, reg1), p1, op));
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
      reset: function(emuState, address) {
        emuState.alu.reset(emuState, address);
      },
      cpl: function(emuState) {
        emuState.alu.cpl(emuState);
      },
      srf: function(emuState, rFlag, aluFlag) {
        emuState.cpu.registers[rFlag] |= emuState.alu.fFlags[aluFlag];
      },
      crf: function(emuState, rFlag, aluFlag) {
        emuState.cpu.registers[rFlag] &= ~emuState.alu.fFlags[aluFlag];
      },
      intrpt: function(emuState, state) {
        if (state === 0) {
          emuState.cpu.setRegister(emuState, 'f', (emuState.cpu.getRegister(emuState, 'f') & ~emuState.alu.fFlags.interrupt));
        } else {
          emuState.cpu.setRegister(emuState, 'f', (emuState.cpu.getRegister(emuState, 'f') | emuState.alu.fFlags.interrupt));
        }
      },
      xchm: function(emuState, reg1) {
        var tmp  = emuState.cpu.getRegister(emuState, reg1);
        emuState.cpu.setRegister(emuState, reg1, emuState.mmu.readWord(emuState, emuState.cpu.getRegister(emuState, 'sp')));
        emuState.mmu.writeWord(emuState, emuState.cpu.getRegister(emuState, 'sp'), tmp);
      },
      pop: function(emuState, condition, jpUpdate = false) {
        if (condition) {
          if (emuState.alu.checkAluFlags(emuState.cpu.getRegister(emuState, 'f'), condition)) {
            return emuState.alu.pop(emuState, jpUpdate);
          }
          return false;
        } else {
          return emuState.alu.pop(emuState, jpUpdate);
        }
      },
      jump: function(emuState, location, condition) {
        if (condition) {
          if (emuState.alu.checkAluFlags(emuState.cpu.getRegister(emuState, 'f'), condition)) {
            return emuState.alu.jump(emuState, location);
          }
          return false;
        } else {
          return emuState.alu.jump(emuState, location);
        }
      },
      push: function(emuState, value, condition) {
        if (condition) {
          if (emuState.alu.checkAluFlags(emuState.cpu.getRegister(emuState, 'f'), condition)) {
            return emuState.alu.push(emuState, value);
          }
          return false;
        } else {
          return emuState.alu.push(emuState, value);
        }
      },
      call: function(emuState, location, condition) {
        if (condition) {
          if (emuState.alu.checkAluFlags(emuState.cpu.getRegister(emuState, 'f'), condition)) {
            return emuState.alu.call(emuState, location);
          }
          return false;
        } else {
          return emuState.alu.call(emuState, location);
        }
      }




    };

    return cpuRet;
  });

if (typeof(module) !== 'undefined') { // Node
  module.exports = objEmulatorFactory.cpuList;
} else if (typeof define === 'function' && define.amd) { // AMD
  define([], function () {
      'use strict';
      return objEmulatorFactory.cpuList;
  });
}

})(objEmulatorFactory);
