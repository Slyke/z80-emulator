/*
  DIS - Disassembler
    This module is the disassembler for the Z80 instruction set. It's not needed for the emulator, but it makes debugging
    and seeing what's going on much easier. It can also be used to decompile byte code into assembly language.

// */

if (!objEmulatorFactory) {
  var objEmulatorFactory = {};
}

(function(objEmulatorFactory) {
  if (!objEmulatorFactory.disList) {
    objEmulatorFactory.disList = [];
  }

  objEmulatorFactory.disList.push(function() {
    var disRet = {
      name: "z80",
      type: "dis",
      previouslyExecutedInstructions: []
    };

    var defaultNOP = function() {
      return {
        opCode: "NOP",
        z80OPCode: "NOP",
        cycleCost: 4,
        cycleConditional: [],
        oReg: undefined,
        iReg: undefined,
        param1: undefined,
        param2: undefined,
        opBytes: 1,
        pointer: undefined,
        indexRegisters: undefined
      };
    };

    disRet.disassembleInstruction = function(s, opCodes = null) {
      var ret;
      if (opCodes) {
        var opExec = s.dis.disOp[opCodes[0]];
        if (!opExec) {
          throw { type: "Error", moduleName: disRet.type, functionName: "disassembleInstruction", reason: "OP Code not known", args: arguments, emulatorState: s };
        }
        ret = opExec(s, [opCodes[1], opCodes[2], opCodes[3]]);
        ret.binCode = opCodes[0];
      } else {
        var opExec = s.dis.disOp[s.cpu.getRegister(s, 'pc')]
        if (!opExec) {
          throw { type: "Error", moduleName: disRet.type, functionName: "disassembleInstruction", reason: "OP Code not known", args: arguments, emulatorState: s };
        }
        ret = opExec(s, [
          (s.cpu.getRegister(s, 'pc') + 1),
          (s.cpu.getRegister(s, 'pc') + 2),
          (s.cpu.getRegister(s, 'pc') + 3)
        ]);
        ret.binCode = s.cpu.getRegister(s, 'pc');
      }

      ret.programCounter = (s.cpu && s.cpu.getRegister(s, 'pc') ? s.cpu.getRegister(s, 'pc') : 0);

      return ret;
    };

    disRet.disOp = {
      0x00: function(s, opParams, idxReg) {
        return defaultNOP();
      },
      0x01: function(s, opParams, idxReg) {
        return {
          opCode: "LD2R",
          z80OPCode: "LD",
          cycleCost: 10,
          cycleConditional: [],
          cycleCondition: undefined,
          oReg: "BC",
          iReg: undefined,
          param1: opParams[0].toString(16),
          param2: opParams[1].toString(16),
          opBytes: 3,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x02: function(s, opParams, idxReg) {
        return {
          opCode: "LD2M",
          z80OPCode: "LD",
          cycleCost: 7,
          cycleConditional: [],
          cycleCondition: undefined,
          oReg: "BC",
          iReg: "A",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: "#",
          indexRegisters: undefined
        };
      },
      0x03: function(s, opParams, idxReg) {
        return {
          opCode: "INCR",
          z80OPCode: "INC",
          cycleCost: 6,
          cycleConditional: [],
          cycleCondition: undefined,
          oReg: "BC",
          iReg: "BC",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x04: function(s, opParams, idxReg) {
        return {
          opCode: "INCR",
          z80OPCode: "INC",
          cycleCost: 5,
          cycleConditional: [],
          cycleCondition: undefined,
          oReg: "B",
          iReg: "B",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x05: function(s, opParams, idxReg) {
        return {
          opCode: "DCRR",
          z80OPCode: "DEC",
          cycleCost: 5,
          cycleConditional: [],
          cycleCondition: undefined,
          oReg: "B",
          iReg: "B",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x06: function(s, opParams, idxReg) {
        return {
          opCode: "LD2R",
          z80OPCode: "LD",
          cycleCost: 7,
          cycleConditional: [],
          cycleCondition: undefined,
          oReg: "B",
          iReg: undefined,
          param1: opParams[0].toString(16),
          param2: undefined,
          opBytes: 2,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x07: function(s, opParams, idxReg) {
        return {
          opCode: "RLCA",
          z80OPCode: "RLCA",
          cycleCost: 4,
          cycleConditional: [],
          cycleCondition: undefined,
          oReg: "A",
          iReg: "A",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x08: function(s, opParams, idxReg) {
        return defaultNOP();
      },
      0x09: function(s, opParams, idxReg) {
        return {
          opCode: "INXR",
          z80OPCode: "ADD",
          cycleCost: 11,
          cycleConditional: [],
          cycleCondition: undefined,
          oReg: idxReg ? idxReg : "HL",
          iReg: "BC",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: idxReg
        };
      },
      0x0a: function(s, opParams, idxReg) {
        return {
          opCode: "LD2R",
          z80OPCode: "LD",
          cycleCost: 7,
          cycleConditional: [],
          cycleCondition: undefined,
          oReg: "A",
          iReg: "BC",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: "&",
          indexRegisters: undefined
        };
      },
      0x0b: function(s, opParams, idxReg) {
        return {
          opCode: "DCRR",
          z80OPCode: "DEC",
          cycleCost: 6,
          cycleConditional: [],
          cycleCondition: undefined,
          oReg: "BC",
          iReg: "BC",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x0c: function(s, opParams, idxReg) {
        return {
          opCode: "INCR",
          z80OPCode: "INC",
          cycleCost: 5,
          cycleConditional: [],
          cycleCondition: undefined,
          oReg: "C",
          iReg: "C",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x0d: function(s, opParams, idxReg) {
        return {
          opCode: "DCRR",
          z80OPCode: "DEC",
          cycleCost: 5,
          cycleConditional: [],
          cycleCondition: undefined,
          oReg: "C",
          iReg: "C",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x0e: function(s, opParams, idxReg) {
        return {
          opCode: "LD2R",
          z80OPCode: "LD",
          cycleCost: 7,
          cycleConditional: [],
          cycleCondition: undefined,
          oReg: "C",
          iReg: undefined,
          param1: opParams[0].toString(16),
          param2: undefined,
          opBytes: 2,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x0f: function(s, opParams, idxReg) {
        return {
          opCode: "RRCA",
          z80OPCode: "RRCA",
          cycleCost: 4,
          cycleConditional: [],
          cycleCondition: undefined,
          oReg: "A",
          iReg: "A",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },


      0x10: function(s, opParams, idxReg) {
        return defaultNOP();
      },
      0x11: function(s, opParams, idxReg) {
        return {
          opCode: "LD2R",
          z80OPCode: "LD",
          cycleCost: 10,
          cycleConditional: [],
          cycleCondition: undefined,
          oReg: "DE",
          iReg: undefined,
          param1: opParams[0].toString(16),
          param2: opParams[1].toString(16),
          opBytes: 3,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x12: function(s, opParams, idxReg) {
        return {
          opCode: "LD2M",
          z80OPCode: "LD",
          cycleCost: 7,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: "A",
          oReg: "DE",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: "#",
          indexRegisters: undefined
        };
      },
      0x13: function(s, opParams, idxReg) {
        return {
          opCode: "INCR",
          z80OPCode: "INC",
          cycleCost: 6,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: "DE",
          oReg: "DE",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x14: function(s, opParams, idxReg) {
        return {
          opCode: "INCR",
          z80OPCode: "INC",
          cycleCost: 5,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: "D",
          oReg: "D",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x15: function(s, opParams, idxReg) {
        return {
          opCode: "DCRR",
          z80OPCode: "DEC",
          cycleCost: 5,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: "D",
          oReg: undefined,
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x16: function(s, opParams, idxReg) {
        return {
          opCode: "LD2R",
          z80OPCode: "LD",
          cycleCost: 7,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: undefined,
          oReg: "D",
          param1: opParams[0].toString(16),
          param2: undefined,
          opBytes: 2,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x17: function(s, opParams, idxReg) {
        return {
          opCode: "RLC9",
          z80OPCode: "RLA",
          cycleCost: 4,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: "A",
          oReg: "A",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x18: function(s, opParams, idxReg) {
        return defaultNOP();
      },
      0x19: function(s, opParams, idxReg) {
        return {
          opCode: "INXR",
          z80OPCode: "ADD",
          cycleCost: 11,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: "DE",
          oReg: idxReg ? idxReg : "HL",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: idxReg
        };
      },
      0x1a: function(s, opParams, idxReg) {
        return {
          opCode: "LD2R",
          z80OPCode: "LD",
          cycleCost: 7,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: "DE",
          oReg: "A",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: "&",
          indexRegisters: undefined
        };
      },
      0x1b: function(s, opParams, idxReg) {
        return {
          opCode: "DCRR",
          z80OPCode: "DEC",
          cycleCost: 6,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: "DE",
          oReg: "DE",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x1c: function(s, opParams, idxReg) {
        return {
          opCode: "INCR",
          z80OPCode: "INC",
          cycleCost: 5,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: "E",
          oReg: "E",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x1d: function(s, opParams, idxReg) {
        return {
          opCode: "DCRR",
          z80OPCode: "DEC",
          cycleCost: 5,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: "E",
          oReg: "E",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x1e: function(s, opParams, idxReg) {
        return {
          opCode: "LD2R",
          z80OPCode: "LD",
          cycleCost: 7,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: undefined,
          oReg: "E",
          param1: opParams[0].toString(16),
          param2: undefined,
          opBytes: 2,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x1f: function(s, opParams, idxReg) {
        return {
          opCode: "RRC",
          z80OPCode: "RRA",
          cycleCost: 4,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: "A",
          oReg: "A",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },


      0x20: function(s, opParams, idxReg) {
        return defaultNOP();
      },
      0x21: function(s, opParams, idxReg) {
        return {
          opCode: "LD2R",
          z80OPCode: "LD",
          cycleCost: 10,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: undefined,
          oReg: idxReg ? idxReg : "HL",
          param1: opParams[0].toString(16),
          param2: opParams[1].toString(16),
          opBytes: 3,
          pointer: undefined,
          indexRegisters: idxReg
        };
      },
      0x22: function(s, opParams, idxReg) {
        return {
          opCode: "LD2M",
          z80OPCode: "LD",
          cycleCost: 16,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: idxReg ? idxReg : "HL",
          oReg: undefined,
          param1: opParams[0].toString(16),
          param2: opParams[1].toString(16),
          opBytes: 3,
          pointer: undefined,
          indexRegisters: idxReg
        };
      },
      0x23: function(s, opParams, idxReg) {
        return {
          opCode: "INCR",
          z80OPCode: "INC",
          cycleCost: 6,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: idxReg ? idxReg : "HL",
          oReg: idxReg ? idxReg : "HL",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: idxReg
        };
      },
      0x24: function(s, opParams, idxReg) {
        return {
          opCode: "INCR",
          z80OPCode: "INC",
          cycleCost: 5,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: "H",
          oReg: "H",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x25: function(s, opParams, idxReg) {
        return {
          opCode: "DCRR",
          z80OPCode: "DEC",
          cycleCost: 5,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: "H",
          oReg: "H",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x26: function(s, opParams, idxReg) {
        return {
          opCode: "LD2R",
          z80OPCode: "LD",
          cycleCost: 7,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: "H",
          oReg: "H",
          param1: opParams[0].toString(16),
          param2: undefined,
          opBytes: 2,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x27: function(s, opParams, idxReg) {
        return defaultNOP();
      },
      0x28: function(s, opParams, idxReg) {
        return defaultNOP();
      },
      0x29: function(s, opParams, idxReg) {
        return {
          opCode: "INXR",
          z80OPCode: "ADD",
          cycleCost: 11,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: idxReg ? idxReg : "HL",
          oReg: idxReg ? idxReg : "HL",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: idxReg
        };
      },
      0x2a: function(s, opParams, idxReg) {
        return {
          opCode: "LD2R",
          z80OPCode: "LD",
          cycleCost: 16,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: undefined,
          oReg: idxReg ? idxReg : "HL",
          param1: opParams[0].toString(16),
          param2: opParams[1].toString(16),
          opBytes: 3,
          pointer: "&",
          indexRegisters: idxReg
        };
      },
      0x2b: function(s, opParams, idxReg) {
        return {
          opCode: "DCRR",
          z80OPCode: "DEC",
          cycleCost: 6,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: idxReg ? idxReg : "HL",
          oReg: idxReg ? idxReg : "HL",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: idxReg
        };
      },
      0x2c: function(s, opParams, idxReg) {
        return {
          opCode: "INCR",
          z80OPCode: "INC",
          cycleCost: 5,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: "L",
          oReg: "L",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x2d: function(s, opParams, idxReg) {
        return {
          opCode: "DCRR",
          z80OPCode: "DEC",
          cycleCost: 5,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: "L",
          oReg: "L",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x2e: function(s, opParams, idxReg) {
        return {
          opCode: "LD2R",
          z80OPCode: "LD",
          cycleCost: 7,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: "L",
          oReg: "L",
          param1: opParams[0].toString(16),
          param2: undefined,
          opBytes: 2,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x2f: function(s, opParams, idxReg) {
        return {
          opCode: "CPL",
          z80OPCode: "CPL",
          cycleCost: 4,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: undefined,
          oReg: "A",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },


      0x30: function(s, opParams, idxReg) {
        return defaultNOP();
      },
      0x31: function(s, opParams, idxReg) {
        return {
          opCode: "LD2R",
          z80OPCode: "LD",
          cycleCost: 10,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: undefined,
          oReg: "SP",
          param1: opParams[0].toString(16),
          param2: opParams[1].toString(16),
          opBytes: 3,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x32: function(s, opParams, idxReg) {
        return {
          opCode: "LD2M",
          z80OPCode: "LD",
          cycleCost: 13,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: "A",
          oReg: undefined,
          param1: opParams[0].toString(16),
          param2: opParams[1].toString(16),
          opBytes: 3,
          pointer: "#",
          indexRegisters: undefined
        };
      },
      0x33: function(s, opParams, idxReg) {
        return {
          opCode: "INCR",
          z80OPCode: "INC",
          cycleCost: 6,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: "SP",
          oReg: "SP",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x34: function(s, opParams, idxReg) {
        return {
          opCode: "INCM",
          z80OPCode: "INC",
          cycleCost: 10,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: idxReg ? idxReg : "HL",
          oReg: idxReg ? idxReg : "HL",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: "#",
          indexRegisters: idxReg
        };
      },
      0x35: function(s, opParams, idxReg) {
        return {
          opCode: "DCRM",
          z80OPCode: "DEC",
          cycleCost: 10,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: idxReg ? idxReg : "HL",
          oReg: idxReg ? idxReg : "HL",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: "#",
          indexRegisters: idxReg
        };
      },
      0x36: function(s, opParams, idxReg) {
        return {
          opCode: "LD2M",
          z80OPCode: "LD",
          cycleCost: 10,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: undefined,
          oReg: idxReg ? idxReg : "HL",
          param1: opParams[0].toString(16),
          param2: undefined,
          opBytes: 2,
          pointer: "#",
          indexRegisters: idxReg
        };
      },
      0x37: function(s, opParams, idxReg) {
        return {
          opCode: "SCF",
          z80OPCode: "SCF",
          cycleCost: 4,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: undefined,
          oReg: undefined,
          param1: opParams[0].toString(16),
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x38: function(s, opParams, idxReg) {
        return defaultNOP();
      },
      0x39: function(s, opParams, idxReg) {
        return {
          opCode: "INXR",
          z80OPCode: "ADD",
          cycleCost: 11,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: "SP",
          oReg: idxReg ? idxReg : "HL",
          param1: opParams[0].toString(16),
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x3a: function(s, opParams, idxReg) {
        return {
          opCode: "LD2R",
          z80OPCode: "LD",
          cycleCost: 13,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: undefined,
          oReg: "A",
          param1: opParams[0].toString(16),
          param2: opParams[1].toString(16),
          opBytes: 3,
          pointer: "$",
          indexRegisters: undefined
        };
      },
      0x3b: function(s, opParams, idxReg) {
        return {
          opCode: "DCRR",
          z80OPCode: "DEC",
          cycleCost: 6,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: "A",
          oReg: "SP",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x3c: function(s, opParams, idxReg) {
        return {
          opCode: "INCR",
          z80OPCode: "INC",
          cycleCost: 5,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: "A",
          oReg: "A",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x3d: function(s, opParams, idxReg) {
        return {
          opCode: "DCRR",
          z80OPCode: "DEC",
          cycleCost: 5,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: "A",
          oReg: "A",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x3e: function(s, opParams, idxReg) {
        return {
          opCode: "LD2R",
          z80OPCode: "LD",
          cycleCost: 7,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: "A",
          oReg: "A",
          param1: opParams[0].toString(16),
          param2: undefined,
          opBytes: 2,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x3f: function(s, opParams, idxReg) {
        return {
          opCode: "CCF",
          z80OPCode: "CCF",
          cycleCost: 4,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: undefined,
          oReg: undefined,
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },


      0x40: function(s, opParams, idxReg) {
        return {
          opCode: "LD2R",
          z80OPCode: "LD",
          cycleCost: 5,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: "B",
          oReg: "B",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x41: function(s, opParams, idxReg) {
        return {
          opCode: "LD2R",
          z80OPCode: "LD",
          cycleCost: 5,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: "C",
          oReg: "B",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x42: function(s, opParams, idxReg) {
        return {
          opCode: "LD2R",
          z80OPCode: "LD",
          cycleCost: 5,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: "D",
          oReg: "B",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x43: function(s, opParams, idxReg) {
        return {
          opCode: "LD2R",
          z80OPCode: "LD",
          cycleCost: 5,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: "E",
          oReg: "B",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x44: function(s, opParams, idxReg) {
        return {
          opCode: "LD2R",
          z80OPCode: "LD",
          cycleCost: 5,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: "H",
          oReg: "B",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x45: function(s, opParams, idxReg) {
        return {
          opCode: "LD2R",
          z80OPCode: "LD",
          cycleCost: 5,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: "L",
          oReg: "B",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x46: function(s, opParams, idxReg) {
        return {
          opCode: "LD2R",
          z80OPCode: "LD",
          cycleCost: 7,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: idxReg ? idxReg : "HL",
          oReg: "B",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: "$",
          indexRegisters: idxReg
        };
      },
      0x47: function(s, opParams, idxReg) {
        return {
          opCode: "LD2R",
          z80OPCode: "LD",
          cycleCost: 5,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: "A",
          oReg: "B",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x48: function(s, opParams, idxReg) {
        return {
          opCode: "LD2R",
          z80OPCode: "LD",
          cycleCost: 5,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: "B",
          oReg: "C",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x49: function(s, opParams, idxReg) {
        return {
          opCode: "LD2R",
          z80OPCode: "LD",
          cycleCost: 5,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: "C",
          oReg: "C",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x4a: function(s, opParams, idxReg) {
        return {
          opCode: "LD2R",
          z80OPCode: "LD",
          cycleCost: 5,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: "D",
          oReg: "C",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x4b: function(s, opParams, idxReg) {
        return {
          opCode: "LD2R",
          z80OPCode: "LD",
          cycleCost: 5,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: "E",
          oReg: "C",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x4c: function(s, opParams, idxReg) {
        return {
          opCode: "LD2R",
          z80OPCode: "LD",
          cycleCost: 5,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: "H",
          oReg: "C",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x4d: function(s, opParams, idxReg) {
        return {
          opCode: "LD2R",
          z80OPCode: "LD",
          cycleCost: 5,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: "L",
          oReg: "C",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x4e: function(s, opParams, idxReg) {
        return {
          opCode: "LD2R",
          z80OPCode: "LD",
          cycleCost: 7,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: idxReg ? idxReg : "HL",
          oReg: "C",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: "$",
          indexRegisters: idxReg
        };
      },
      0x4f: function(s, opParams, idxReg) {
        return {
          opCode: "LD2R",
          z80OPCode: "LD",
          cycleCost: 5,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: "A",
          oReg: "C",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },


      0x50: function(s, opParams, idxReg) {
        return {
          opCode: "LD2R",
          z80OPCode: "LD",
          cycleCost: 5,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: "B",
          oReg: "D",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x51: function(s, opParams, idxReg) {
        return {
          opCode: "LD2R",
          z80OPCode: "LD",
          cycleCost: 5,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: "C",
          oReg: "D",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x52: function(s, opParams, idxReg) {
        return {
          opCode: "LD2R",
          z80OPCode: "LD",
          cycleCost: 5,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: "D",
          oReg: "D",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x53: function(s, opParams, idxReg) {
        return {
          opCode: "LD2R",
          z80OPCode: "LD",
          cycleCost: 5,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: "E",
          oReg: "D",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x54: function(s, opParams, idxReg) {
        return {
          opCode: "LD2R",
          z80OPCode: "LD",
          cycleCost: 5,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: "H",
          oReg: "D",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x55: function(s, opParams, idxReg) {
        return {
          opCode: "LD2R",
          z80OPCode: "LD",
          cycleCost: 5,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: "L",
          oReg: "D",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x56: function(s, opParams, idxReg) {
        return {
          opCode: "LD2R",
          z80OPCode: "LD",
          cycleCost: 7,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: idxReg ? idxReg : "HL",
          oReg: "D",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: "$",
          indexRegisters: idxReg
        };
      },
      0x57: function(s, opParams, idxReg) {
        return {
          opCode: "LD2R",
          z80OPCode: "LD",
          cycleCost: 5,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: "A",
          oReg: "D",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x58: function(s, opParams, idxReg) {
        return {
          opCode: "LD2R",
          z80OPCode: "LD",
          cycleCost: 5,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: "B",
          oReg: "E",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x59: function(s, opParams, idxReg) {
        return {
          opCode: "LD2R",
          z80OPCode: "LD",
          cycleCost: 5,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: "C",
          oReg: "E",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x5a: function(s, opParams, idxReg) {
        return {
          opCode: "LD2R",
          z80OPCode: "LD",
          cycleCost: 5,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: "D",
          oReg: "E",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x5b: function(s, opParams, idxReg) {
        return {
          opCode: "LD2R",
          z80OPCode: "LD",
          cycleCost: 5,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: "E",
          oReg: "E",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x5c: function(s, opParams, idxReg) {
        return {
          opCode: "LD2R",
          z80OPCode: "LD",
          cycleCost: 5,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: "H",
          oReg: "E",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x5d: function(s, opParams, idxReg) {
        return {
          opCode: "LD2R",
          z80OPCode: "LD",
          cycleCost: 5,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: "L",
          oReg: "E",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x5e: function(s, opParams, idxReg) {
        return {
          opCode: "LD2R",
          z80OPCode: "LD",
          cycleCost: 7,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: idxReg ? idxReg : "HL",
          oReg: "E",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: "$",
          indexRegisters: idxReg
        };
      },
      0x5f: function(s, opParams, idxReg) {
        return {
          opCode: "LD2R",
          z80OPCode: "LD",
          cycleCost: 5,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: "A",
          oReg: "E",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },


      0x60: function(s, opParams, idxReg) {
        return {
          opCode: "LD2R",
          z80OPCode: "LD",
          cycleCost: 5,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: "B",
          oReg: "H",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x61: function(s, opParams, idxReg) {
        return {
          opCode: "LD2R",
          z80OPCode: "LD",
          cycleCost: 5,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: "C",
          oReg: "H",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x62: function(s, opParams, idxReg) {
        return {
          opCode: "LD2R",
          z80OPCode: "LD",
          cycleCost: 5,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: "D",
          oReg: "H",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x63: function(s, opParams, idxReg) {
        return {
          opCode: "LD2R",
          z80OPCode: "LD",
          cycleCost: 5,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: "E",
          oReg: "H",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x64: function(s, opParams, idxReg) {
        return {
          opCode: "LD2R",
          z80OPCode: "LD",
          cycleCost: 5,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: "H",
          oReg: "H",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x65: function(s, opParams, idxReg) {
        return {
          opCode: "LD2R",
          z80OPCode: "LD",
          cycleCost: 5,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: "L",
          oReg: "H",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x66: function(s, opParams, idxReg) {
        return {
          opCode: "LD2R",
          z80OPCode: "LD",
          cycleCost: 7,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: idxReg ? idxReg : "HL",
          oReg: "H",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: "$",
          indexRegisters: idxReg
        };
      },
      0x67: function(s, opParams, idxReg) {
        return {
          opCode: "LD2R",
          z80OPCode: "LD",
          cycleCost: 5,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: "A",
          oReg: "H",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x68: function(s, opParams, idxReg) {
        return {
          opCode: "LD2R",
          z80OPCode: "LD",
          cycleCost: 5,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: "B",
          oReg: "L",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x69: function(s, opParams, idxReg) {
        return {
          opCode: "LD2R",
          z80OPCode: "LD",
          cycleCost: 5,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: "C",
          oReg: "L",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x6a: function(s, opParams, idxReg) {
        return {
          opCode: "LD2R",
          z80OPCode: "LD",
          cycleCost: 5,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: "D",
          oReg: "L",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x6b: function(s, opParams, idxReg) {
        return {
          opCode: "LD2R",
          z80OPCode: "LD",
          cycleCost: 5,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: "E",
          oReg: "L",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x6c: function(s, opParams, idxReg) {
        return {
          opCode: "LD2R",
          z80OPCode: "LD",
          cycleCost: 5,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: "H",
          oReg: "L",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x6d: function(s, opParams, idxReg) {
        return {
          opCode: "LD2R",
          z80OPCode: "LD",
          cycleCost: 5,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: "L",
          oReg: "L",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x6e: function(s, opParams, idxReg) {
        return {
          opCode: "LD2R",
          z80OPCode: "LD",
          cycleCost: 7,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: idxReg ? idxReg : "HL",
          oReg: "L",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: "$",
          indexRegisters: idxReg
        };
      },
      0x6f: function(s, opParams, idxReg) {
        return {
          opCode: "LD2R",
          z80OPCode: "LD",
          cycleCost: 5,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: "L",
          oReg: "A",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },


      0x70: function(s, opParams, idxReg) {
        return {
          opCode: "LD2R",
          z80OPCode: "LD",
          cycleCost: 7,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: "B",
          oReg: idxReg ? idxReg : "HL",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: "#",
          indexRegisters: idxReg
        };
      },
      0x71: function(s, opParams, idxReg) {
        return {
          opCode: "LD2R",
          z80OPCode: "LD",
          cycleCost: 7,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: "C",
          oReg: idxReg ? idxReg : "HL",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: "#",
          indexRegisters: idxReg
        };
      },
      0x72: function(s, opParams, idxReg) {
        return {
          opCode: "LD2R",
          z80OPCode: "LD",
          cycleCost: 7,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: "D",
          oReg: idxReg ? idxReg : "HL",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: "#",
          indexRegisters: idxReg
        };
      },
      0x73: function(s, opParams, idxReg) {
        return {
          opCode: "LD2R",
          z80OPCode: "LD",
          cycleCost: 7,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: "E",
          oReg: idxReg ? idxReg : "HL",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: "#",
          indexRegisters: idxReg
        };
      },
      0x74: function(s, opParams, idxReg) {
        return {
          opCode: "LD2R",
          z80OPCode: "LD",
          cycleCost: 7,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: "H",
          oReg: idxReg ? idxReg : "HL",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: "#",
          indexRegisters: idxReg
        };
      },
      0x75: function(s, opParams, idxReg) {
        return {
          opCode: "LD2R",
          z80OPCode: "LD",
          cycleCost: 7,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: "L",
          oReg: idxReg ? idxReg : "HL",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: "#",
          indexRegisters: idxReg
        };
      },
      0x76: function(s, opParams, idxReg) {
        return {
          opCode: "HLT",
          z80OPCode: "HLT",
          cycleCost: 7,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: undefined,
          oReg: undefined,
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: idxReg
        };
      },
      0x77: function(s, opParams, idxReg) {
        return {
          opCode: "LD2M",
          z80OPCode: "LD",
          cycleCost: 7,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: "A",
          oReg: idxReg ? idxReg : "HL",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: "#",
          indexRegisters: idxReg
        };
      },
      0x78: function(s, opParams, idxReg) {
        return {
          opCode: "LD2R",
          z80OPCode: "LD",
          cycleCost: 5,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: "B",
          oReg: "A",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x79: function(s, opParams, idxReg) {
        return {
          opCode: "LD2R",
          z80OPCode: "LD",
          cycleCost: 5,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: "C",
          oReg: "A",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x7a: function(s, opParams, idxReg) {
        return {
          opCode: "LD2R",
          z80OPCode: "LD",
          cycleCost: 5,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: "D",
          oReg: "A",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x7b: function(s, opParams, idxReg) {
        return {
          opCode: "LD2R",
          z80OPCode: "LD",
          cycleCost: 5,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: "E",
          oReg: "A",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x7c: function(s, opParams, idxReg) {
        return {
          opCode: "LD2R",
          z80OPCode: "LD",
          cycleCost: 5,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: "H",
          oReg: "A",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x7d: function(s, opParams, idxReg) {
        return {
          opCode: "LD2R",
          z80OPCode: "LD",
          cycleCost: 5,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: "L",
          oReg: "A",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x7e: function(s, opParams, idxReg) {
        return {
          opCode: "LD2R",
          z80OPCode: "LD",
          cycleCost: 7,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: idxReg ? idxReg : "HL",
          oReg: "A",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: "$",
          indexRegisters: idxReg
        };
      },
      0x7f: function(s, opParams, idxReg) {
        return {
          opCode: "LD2R",
          z80OPCode: "LD",
          cycleCost: 5,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: "A",
          oReg: "A",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },


      0x80: function(s, opParams, idxReg) {
        return {
          opCode: "INXR",
          z80OPCode: "ADD",
          cycleCost: 4,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: "B",
          oReg: "A",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x81: function(s, opParams, idxReg) {
        return {
          opCode: "INXR",
          z80OPCode: "ADD",
          cycleCost: 4,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: "C",
          oReg: "A",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x82: function(s, opParams, idxReg) {
        return {
          opCode: "INXR",
          z80OPCode: "ADD",
          cycleCost: 4,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: "D",
          oReg: "A",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x83: function(s, opParams, idxReg) {
        return {
          opCode: "INXR",
          z80OPCode: "ADD",
          cycleCost: 4,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: "E",
          oReg: "A",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x84: function(s, opParams, idxReg) {
        return {
          opCode: "INXR",
          z80OPCode: "ADD",
          cycleCost: 4,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: "H",
          oReg: "A",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x85: function(s, opParams, idxReg) {
        return {
          opCode: "INXR",
          z80OPCode: "ADD",
          cycleCost: 4,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: "L",
          oReg: "A",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x86: function(s, opParams, idxReg) {
        return {
          opCode: "INXR",
          z80OPCode: "ADD",
          cycleCost: 7,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg:  idxReg ? idxReg : "HL",
          oReg: "A",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: "$",
          indexRegisters: idxReg
        };
      },
      0x87: function(s, opParams, idxReg) {
        return {
          opCode: "INXR",
          z80OPCode: "ADD",
          cycleCost: 4,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: "A",
          oReg: "A",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x88: function(s, opParams, idxReg) {
        return {
          opCode: "ICXR",
          z80OPCode: "ADD",
          cycleCost: 4,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: "B",
          oReg: "A",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x89: function(s, opParams, idxReg) {
        return {
          opCode: "ICXR",
          z80OPCode: "ADD",
          cycleCost: 4,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: "C",
          oReg: "A",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x8a: function(s, opParams, idxReg) {
        return {
          opCode: "ICXR",
          z80OPCode: "ADD",
          cycleCost: 4,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: "D",
          oReg: "A",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x8b: function(s, opParams, idxReg) {
        return {
          opCode: "ICXR",
          z80OPCode: "ADD",
          cycleCost: 4,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: "E",
          oReg: "A",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x8c: function(s, opParams, idxReg) {
        return {
          opCode: "ICXR",
          z80OPCode: "ADD",
          cycleCost: 4,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: "H",
          oReg: "A",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x8d: function(s, opParams, idxReg) {
        return {
          opCode: "ICXR",
          z80OPCode: "ADD",
          cycleCost: 4,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: "L",
          oReg: "A",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x8e: function(s, opParams, idxReg) {
        return {
          opCode: "ICXR",
          z80OPCode: "ADD",
          cycleCost: 7,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg:  idxReg ? idxReg : "HL",
          oReg: "A",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: "$",
          indexRegisters: idxReg
        };
      },
      0x8f: function(s, opParams, idxReg) {
        return {
          opCode: "ICXR",
          z80OPCode: "ADD",
          cycleCost: 4,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: "A",
          oReg: "A",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },


      0x90: function(s, opParams, idxReg) {
        return {
          opCode: "DCXR",
          z80OPCode: "SUB",
          cycleCost: 4,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: "B",
          oReg: "A",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x91: function(s, opParams, idxReg) {
        return {
          opCode: "DCXR",
          z80OPCode: "SUB",
          cycleCost: 4,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: "C",
          oReg: "A",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x92: function(s, opParams, idxReg) {
        return {
          opCode: "DCXR",
          z80OPCode: "SUB",
          cycleCost: 4,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: "D",
          oReg: "A",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x93: function(s, opParams, idxReg) {
        return {
          opCode: "DCXR",
          z80OPCode: "SUB",
          cycleCost: 4,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: "E",
          oReg: "A",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x94: function(s, opParams, idxReg) {
        return {
          opCode: "DCXR",
          z80OPCode: "SUB",
          cycleCost: 4,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: "H",
          oReg: "A",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x95: function(s, opParams, idxReg) {
        return {
          opCode: "DCXR",
          z80OPCode: "SUB",
          cycleCost: 4,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: "L",
          oReg: "A",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x96: function(s, opParams, idxReg) {
        return {
          opCode: "DCXR",
          z80OPCode: "SUB",
          cycleCost: 7,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg:  idxReg ? idxReg : "HL",
          oReg: "A",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: "$",
          indexRegisters: idxReg
        };
      },
      0x97: function(s, opParams, idxReg) {
        return {
          opCode: "DCXR",
          z80OPCode: "SUB",
          cycleCost: 4,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: "A",
          oReg: "A",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x98: function(s, opParams, idxReg) {
        return {
          opCode: "DEXR",
          z80OPCode: "SBC",
          cycleCost: 4,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: "B",
          oReg: "A",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x99: function(s, opParams, idxReg) {
        return {
          opCode: "DEXR",
          z80OPCode: "SBC",
          cycleCost: 4,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: "C",
          oReg: "A",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x9a: function(s, opParams, idxReg) {
        return {
          opCode: "DEXR",
          z80OPCode: "SBC",
          cycleCost: 4,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: "D",
          oReg: "A",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x9b: function(s, opParams, idxReg) {
        return {
          opCode: "DEXR",
          z80OPCode: "SBC",
          cycleCost: 4,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: "E",
          oReg: "A",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x9c: function(s, opParams, idxReg) {
        return {
          opCode: "DEXR",
          z80OPCode: "SBC",
          cycleCost: 4,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: "H",
          oReg: "A",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x9d: function(s, opParams, idxReg) {
        return {
          opCode: "DEXR",
          z80OPCode: "SBC",
          cycleCost: 4,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: "L",
          oReg: "A",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x9e: function(s, opParams, idxReg) {
        return {
          opCode: "DEXR",
          z80OPCode: "SBC",
          cycleCost: 7,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg:  idxReg ? idxReg : "HL",
          oReg: "A",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: "$",
          indexRegisters: idxReg
        };
      },
      0x9f: function(s, opParams, idxReg) {
        return {
          opCode: "DEXR",
          z80OPCode: "SBC",
          cycleCost: 4,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: "A",
          oReg: "A",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },


      0xa0: function(s, opParams, idxReg) {
        return {
          opCode: "ANDR",
          z80OPCode: "AND",
          cycleCost: 4,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: "B",
          oReg: "A",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0xa1: function(s, opParams, idxReg) {
        return {
          opCode: "ANDR",
          z80OPCode: "AND",
          cycleCost: 4,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: "C",
          oReg: "A",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0xa2: function(s, opParams, idxReg) {
        return {
          opCode: "ANDR",
          z80OPCode: "AND",
          cycleCost: 4,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: "D",
          oReg: "A",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0xa3: function(s, opParams, idxReg) {
        return {
          opCode: "ANDR",
          z80OPCode: "AND",
          cycleCost: 4,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: "E",
          oReg: "A",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0xa4: function(s, opParams, idxReg) {
        return {
          opCode: "ANDR",
          z80OPCode: "AND",
          cycleCost: 4,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: "H",
          oReg: "A",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0xa5: function(s, opParams, idxReg) {
        return {
          opCode: "ANDR",
          z80OPCode: "AND",
          cycleCost: 4,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: "L",
          oReg: "A",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0xa6: function(s, opParams, idxReg) {
        return {
          opCode: "ANDR",
          z80OPCode: "AND",
          cycleCost: 7,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg:  idxReg ? idxReg : "HL",
          oReg: "A",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: "$",
          indexRegisters: idxReg
        };
      },
      0xa7: function(s, opParams, idxReg) {
        return {
          opCode: "ANDR",
          z80OPCode: "AND",
          cycleCost: 4,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: "A",
          oReg: "A",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0xa8: function(s, opParams, idxReg) {
        return {
          opCode: "XORR",
          z80OPCode: "XOR",
          cycleCost: 4,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: "B",
          oReg: "A",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0xa9: function(s, opParams, idxReg) {
        return {
          opCode: "XORR",
          z80OPCode: "XOR",
          cycleCost: 4,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: "C",
          oReg: "A",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0xaa: function(s, opParams, idxReg) {
        return {
          opCode: "XORR",
          z80OPCode: "XOR",
          cycleCost: 4,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: "D",
          oReg: "A",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0xab: function(s, opParams, idxReg) {
        return {
          opCode: "XORR",
          z80OPCode: "XOR",
          cycleCost: 4,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: "E",
          oReg: "A",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0xac: function(s, opParams, idxReg) {
        return {
          opCode: "XORR",
          z80OPCode: "XOR",
          cycleCost: 4,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: "H",
          oReg: "A",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0xad: function(s, opParams, idxReg) {
        return {
          opCode: "XORR",
          z80OPCode: "XOR",
          cycleCost: 4,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: "L",
          oReg: "A",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0xae: function(s, opParams, idxReg) {
        return {
          opCode: "XORR",
          z80OPCode: "XOR",
          cycleCost: 7,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg:  idxReg ? idxReg : "HL",
          oReg: "A",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: "$",
          indexRegisters: idxReg
        };
      },
      0xaf: function(s, opParams, idxReg) {
        return {
          opCode: "XORR",
          z80OPCode: "XOR",
          cycleCost: 4,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: "A",
          oReg: "A",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },


      0xb0: function(s, opParams, idxReg) {
        return {
          opCode: "ORR",
          z80OPCode: "OR",
          cycleCost: 4,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: "B",
          oReg: "A",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0xb1: function(s, opParams, idxReg) {
        return {
          opCode: "ORR",
          z80OPCode: "OR",
          cycleCost: 4,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: "C",
          oReg: "A",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0xb2: function(s, opParams, idxReg) {
        return {
          opCode: "ORR",
          z80OPCode: "OR",
          cycleCost: 4,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: "D",
          oReg: "A",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0xb3: function(s, opParams, idxReg) {
        return {
          opCode: "ORR",
          z80OPCode: "OR",
          cycleCost: 4,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: "E",
          oReg: "A",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0xb4: function(s, opParams, idxReg) {
        return {
          opCode: "ORR",
          z80OPCode: "OR",
          cycleCost: 4,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: "H",
          oReg: "A",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0xb5: function(s, opParams, idxReg) {
        return {
          opCode: "ORR",
          z80OPCode: "OR",
          cycleCost: 4,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: "L",
          oReg: "A",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0xb6: function(s, opParams, idxReg) {
        return {
          opCode: "ORR",
          z80OPCode: "OR",
          cycleCost: 7,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg:  idxReg ? idxReg : "HL",
          oReg: "A",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: "$",
          indexRegisters: idxReg
        };
      },
      0xb7: function(s, opParams, idxReg) {
        return {
          opCode: "ORR",
          z80OPCode: "OR",
          cycleCost: 4,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: "A",
          oReg: "A",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0xb8: function(s, opParams, idxReg) {
        return {
          opCode: "SUBX",
          z80OPCode: "CP",
          cycleCost: 4,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: "B",
          oReg: "A",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0xb9: function(s, opParams, idxReg) {
        return {
          opCode: "SUBX",
          z80OPCode: "CP",
          cycleCost: 4,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: "C",
          oReg: "A",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0xba: function(s, opParams, idxReg) {
        return {
          opCode: "SUBX",
          z80OPCode: "CP",
          cycleCost: 4,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: "D",
          oReg: "A",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0xbb: function(s, opParams, idxReg) {
        return {
          opCode: "SUBX",
          z80OPCode: "CP",
          cycleCost: 4,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: "E",
          oReg: "A",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0xbc: function(s, opParams, idxReg) {
        return {
          opCode: "SUBX",
          z80OPCode: "CP",
          cycleCost: 4,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: "H",
          oReg: "A",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0xbd: function(s, opParams, idxReg) {
        return {
          opCode: "SUBX",
          z80OPCode: "CP",
          cycleCost: 4,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: "L",
          oReg: "A",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0xbe: function(s, opParams, idxReg) {
        return {
          opCode: "SUBX",
          z80OPCode: "CP",
          cycleCost: 7,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg:  idxReg ? idxReg : "HL",
          oReg: "A",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: "$",
          indexRegisters: idxReg
        };
      },
      0xbf: function(s, opParams, idxReg) {
        return {
          opCode: "SUBX",
          z80OPCode: "CP",
          cycleCost: 4,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: "A",
          oReg: "A",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },


      0xc0: function(s, opParams, idxReg) {
        return {
          opCode: "RETNZ",
          z80OPCode: "RET NZ",
          cycleCost: s.alu.checkAluFlags(s.cpu.getRegister(s, 'f'), 'NZ') ? 11 : 5,
          cycleConditional: [5, 11],
          cycleCondition: 'NZ',
          iReg: undefined,
          oReg: undefined,
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0xc1: function(s, opParams, idxReg) {
        return {
          opCode: "POPR",
          z80OPCode: "POP",
          cycleCost: 10,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: "SP",
          oReg: "BC",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: "$",
          indexRegisters: undefined
        };
      },
      0xc2: function(s, opParams, idxReg) {
        return {
          opCode: "JMPNZ",
          z80OPCode: "JP NZ",
          cycleCost: s.alu.checkAluFlags(s.cpu.getRegister(s, 'f'), 'NZ') ? 15 : 10,
          cycleConditional: [10, 15],
          cycleCondition: "NZ",
          iReg: undefined,
          oReg: undefined,
          param1: opParams[0].toString(16),
          param2: opParams[1].toString(16),
          opBytes: 3,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0xc3: function(s, opParams, idxReg) {
        return {
          opCode: "JMP",
          z80OPCode: "JP",
          cycleCost: 10,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: undefined,
          oReg: undefined,
          param1: opParams[0].toString(16),
          param2: opParams[1].toString(16),
          opBytes: 3,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0xc4: function(s, opParams, idxReg) {
        return {
          opCode: "CALLNZ",
          z80OPCode: "CALL NZ",
          cycleCost: s.alu.checkAluFlags(s.cpu.getRegister(s, 'f'), 'NZ') ? 18 : 11,
          cycleConditional: [11, 18],
          cycleCondition: 'NZ',
          iReg: undefined,
          oReg: "SP",
          param1: opParams[0].toString(16),
          param2: opParams[1].toString(16),
          opBytes: 3,
          pointer: "$",
          indexRegisters: undefined
        };
      },
      0xc5: function(s, opParams, idxReg) {
        return {
          opCode: "PUSH",
          z80OPCode: "PUSH",
          cycleCost: 11,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: "BC",
          oReg: "SP",
          param1: undefined,
          param2: undefined,
          opBytes: 3,
          pointer: "#",
          indexRegisters: undefined
        };
      },
      0xc6: function(s, opParams, idxReg) {
        return {
          opCode: "INXR",
          z80OPCode: "ADD",
          cycleCost: 7,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: undefined,
          oReg: undefined,
          param1: opParams[0].toString(16),
          param2: undefined,
          opBytes: 2,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0xc7: function(s, opParams, idxReg) {
        return {
          opCode: "RST0",
          z80OPCode: "RST 00",
          cycleCost: 11,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: undefined,
          oReg: "SP",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0xc8: function(s, opParams, idxReg) {
        return {
          opCode: "RETZ",
          z80OPCode: "RET Z",
          cycleCost: s.alu.checkAluFlags(s.cpu.getRegister(s, 'f'), 'Z') ? 11 : 5,
          cycleConditional: [5, 11],
          cycleCondition: 'Z',
          iReg: "SP",
          oReg: undefined,
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: "$",
          indexRegisters: undefined
        };
      },
      0xc9: function(s, opParams, idxReg) {
        return {
          opCode: "RET",
          z80OPCode: "RET",
          cycleCost: 10,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: "SP",
          oReg: undefined,
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: "$",
          indexRegisters: undefined
        };
      },
      0xca: function(s, opParams, idxReg) {
        return {
          opCode: "JMPZ",
          z80OPCode: "JP Z",
          cycleCost: s.alu.checkAluFlags(s.cpu.getRegister(s, 'f'), 'Z') ? 15 : 10,
          cycleConditional: [10, 15],
          cycleCondition: 'Z',
          iReg: "SP",
          oReg: undefined,
          param1: opParams[0].toString(16),
          param2: opParams[1].toString(16),
          opBytes: 3,
          pointer: "$",
          indexRegisters: undefined
        };
      },
      0xcb: function(s, opParams, idxReg) {
        return defaultNOP();
      },
      0xcc: function(s, opParams, idxReg) {
        return {
          opCode: "CALLZ",
          z80OPCode: "CALL Z",
          cycleCost: s.alu.checkAluFlags(s.cpu.getRegister(s, 'f'), 'Z') ? 18 : 11,
          cycleConditional: [11, 18],
          cycleCondition: 'Z',
          iReg: undefined,
          oReg: "SP",
          param1: opParams[0].toString(16),
          param2: opParams[1].toString(16),
          opBytes: 3,
          pointer: "#",
          indexRegisters: undefined
        };
      },
      0xcd: function(s, opParams, idxReg) {
        return {
          opCode: "CALL",
          z80OPCode: "CALL",
          cycleCost: 17,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: undefined,
          oReg: "SP",
          param1: opParams[0].toString(16),
          param2: opParams[1].toString(16),
          opBytes: 3,
          pointer: "#",
          indexRegisters: undefined
        };
      },
      0xce: function(s, opParams, idxReg) {
        return {
          opCode: "ICXR",
          z80OPCode: "ADC",
          cycleCost: 7,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: "A",
          oReg: "A",
          param1: opParams[0].toString(16),
          param2: undefined,
          opBytes: 2,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0xcf: function(s, opParams, idxReg) {
        return {
          opCode: "RST18",
          z80OPCode: "RST 18",
          cycleCost: 11,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: undefined,
          oReg: "SP",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },


      0xd0: function(s, opParams, idxReg) {
        return {
          opCode: "RETNC",
          z80OPCode: "RET NC",
          cycleCost: s.alu.checkAluFlags(s.cpu.getRegister(s, 'f'), 'NC') ? 11 : 5,
          cycleConditional: [5, 11],
          cycleCondition: 'NC',
          iReg: undefined,
          oReg: "SP",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0xd1: function(s, opParams, idxReg) {
        return {
          opCode: "POPR",
          z80OPCode: "POP",
          cycleCost: 10,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: "SP",
          oReg: "DE",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: "$",
          indexRegisters: undefined
        };
      },
      0xd2: function(s, opParams, idxReg) {
        return {
          opCode: "JMPNC",
          z80OPCode: "JP NC",
          cycleCost: s.alu.checkAluFlags(s.cpu.getRegister(s, 'f'), 'NC') ? 15 : 10,
          cycleConditional: [10, 15],
          cycleCondition: "NC",
          iReg: undefined,
          oReg: undefined,
          param1: opParams[0].toString(16),
          param2: opParams[1].toString(16),
          opBytes: 3,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0xd3: function(s, opParams, idxReg) {
        return {
          opCode: "HWOUT",
          z80OPCode: "OUT",
          cycleCost: 10,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: "A",
          oReg: undefined,
          param1: opParams[0].toString(16),
          param2: undefined,
          opBytes: 2,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0xd4: function(s, opParams, idxReg) {
        return {
          opCode: "CALLNC",
          z80OPCode: "CALL NC",
          cycleCost: s.alu.checkAluFlags(s.cpu.getRegister(s, 'f'), 'NC') ? 18 : 11,
          cycleConditional: [11, 18],
          cycleCondition: 'NC',
          iReg: undefined,
          oReg: "SP",
          param1: opParams[0].toString(16),
          param2: opParams[1].toString(16),
          opBytes: 3,
          pointer: "$",
          indexRegisters: undefined
        };
      },
      0xd5: function(s, opParams, idxReg) {
        return {
          opCode: "PUSH",
          z80OPCode: "PUSH",
          cycleCost: 11,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: "DE",
          oReg: "SP",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: "#",
          indexRegisters: undefined
        };
      },
      0xd6: function(s, opParams, idxReg) {
        return {
          opCode: "DCXR",
          z80OPCode: "SUB",
          cycleCost: 7,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: undefined,
          oReg: undefined,
          param1: opParams[0].toString(16),
          param2: undefined,
          opBytes: 2,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0xd7: function(s, opParams, idxReg) {
        return {
          opCode: "RST10",
          z80OPCode: "RST 10",
          cycleCost: 11,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: undefined,
          oReg: "SP",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0xd8: function(s, opParams, idxReg) {
        return {
          opCode: "RETC",
          z80OPCode: "RET",
          cycleCost: s.alu.checkAluFlags(s.cpu.getRegister(s, 'f'), 'C') ? 11 : 5,
          cycleConditional: [5, 11],
          cycleCondition: 'C',
          iReg: "SP",
          oReg: undefined,
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0xd9: function(s, opParams, idxReg) {
        return defaultNOP();
      },
      0xda: function(s, opParams, idxReg) {
        return {
          opCode: "JMPC",
          z80OPCode: "JP",
          cycleCost: s.alu.checkAluFlags(s.cpu.getRegister(s, 'f'), 'C') ? 15 : 10,
          cycleConditional: [15, 10],
          cycleCondition: 'C',
          iReg: undefined,
          oReg: undefined,
          param1: opParams[0].toString(16),
          param2: opParams[1].toString(16),
          opBytes: 3,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0xdb: function(s, opParams, idxReg) {
        return {
          opCode: "HWIN",
          z80OPCode: "EXX",
          cycleCost: 10,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: undefined,
          oReg: "A",
          param1: opParams[0].toString(16),
          param2: undefined,
          opBytes: 2,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0xdc: function(s, opParams, idxReg) {
        return {
          opCode: "CALLC",
          z80OPCode: "CALL",
          cycleCost: s.alu.checkAluFlags(s.cpu.getRegister(s, 'f'), 'C') ? 18 : 10,
          cycleConditional: [10, 18],
          cycleCondition: "C",
          iReg: undefined,
          oReg: "SP",
          param1: opParams[0].toString(16),
          param2: opParams[1].toString(16),
          opBytes: 3,
          pointer: "#",
          indexRegisters: undefined
        };
      },
      0xdd: function(s, opParams, idxReg) {
        var ret = disRet.disOp[opParams[0]](s, opParams[1], opParams[2], 'IX');
        ret.opBytes += 1;
        return ret;
      },
      0xde: function(s, opParams, idxReg) {
        return {
          opCode: "DEXR",
          z80OPCode: "SBC",
          cycleCost: 7,
          cycleConditional: undefined,
          cycleCondition: undefined,
          iReg: "A",
          oReg: "A",
          param1: opParams[0].toString(16),
          param2: undefined,
          opBytes: 2,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0xdf: function(s, opParams, idxReg) {
        return {
          opCode: "RST18",
          z80OPCode: "RST 18",
          cycleCost: 11,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: undefined,
          oReg: "SP",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },


      0xe0: function(s, opParams, idxReg) {
        return {
          opCode: "RETNP",
          z80OPCode: "RET",
          cycleCost: s.alu.checkAluFlags(s.cpu.getRegister(s, 'f'), 'NP') ? 11 : 5,
          cycleConditional: [5, 11],
          cycleCondition: 'NP',
          iReg: undefined,
          oReg: undefined,
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0xe1: function(s, opParams, idxReg) {
        return {
          opCode: "POPR",
          z80OPCode: "POP",
          cycleCost: 10,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: "SP",
          oReg: idxReg ? idxReg : "HL",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: "$",
          indexRegisters: idxReg
        };
      },
      0xe2: function(s, opParams, idxReg) {
        return {
          opCode: "JMPNP",
          z80OPCode: "JP PO",
          cycleCost: s.alu.checkAluFlags(s.cpu.getRegister(s, 'f'), 'NP') ? 15 : 10,
          cycleConditional: [10, 15],
          cycleCondition: 'NP',
          iReg: undefined,
          oReg: undefined,
          param1: opParams[0].toString(16),
          param2: opParams[1].toString(16),
          opBytes: 3,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0xe3: function(s, opParams, idxReg) {
        return {
          opCode: "XCHM",
          z80OPCode: "EX",
          cycleCost: 4,
          cycleConditional: [10, 15],
          cycleCondition: 'NP',
          iReg: "SP",
          oReg: idxReg ? idxReg : "HL",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: "$",
          indexRegisters: idxReg
        };
      },
      0xe4: function(s, opParams, idxReg) {
        return {
          opCode: "CALLNP",
          z80OPCode: "CALL",
          cycleCost: s.alu.checkAluFlags(s.cpu.getRegister(s, 'f'), 'NP') ? 18 : 11,
          cycleConditional: [11, 18],
          cycleCondition: 'NP',
          iReg: undefined,
          oReg: undefined,
          param1: opParams[0].toString(16),
          param2: opParams[1].toString(16),
          opBytes: 3,
          pointer: "$",
          indexRegisters: undefined
        };
      },
      0xe5: function(s, opParams, idxReg) {
        return {
          opCode: "PUSH",
          z80OPCode: "PUSH",
          cycleCost: 11,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: idxReg ? idxReg : "HL",
          oReg: "SP",
          param1: undefined,
          param2: undefined,
          opBytes: 3,
          pointer: "#",
          indexRegisters: idxReg
        };
      },
      0xe6: function(s, opParams, idxReg) {
        return {
          opCode: "ANDR",
          z80OPCode: "AND",
          cycleCost: 7,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: "A",
          oReg: "A",
          param1: opParams[0].toString(16),
          param2: undefined,
          opBytes: 2,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0xe7: function(s, opParams, idxReg) {
        return {
          opCode: "RST20",
          z80OPCode: "RST 20",
          cycleCost: 11,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: undefined,
          oReg: "SP",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0xe8: function(s, opParams, idxReg) {
        return {
          opCode: "RETP",
          z80OPCode: "RET",
          cycleCost: s.alu.checkAluFlags(s.cpu.getRegister(s, 'f'), 'P') ? 11 : 5,
          cycleConditional: [5, 11],
          cycleCondition: "P",
          iReg: undefined,
          oReg: undefined,
          param1: opParams[0].toString(16),
          param2: opParams[1].toString(16),
          opBytes: 3,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0xe9: function(s, opParams, idxReg) {
        return {
          opCode: "JMP",
          z80OPCode: "JP",
          cycleCost: 4,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: idxReg ? idxReg : "HL",
          oReg: undefined,
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: idxReg
        };
      },
      0xea: function(s, opParams, idxReg) {
        return {
          opCode: "JMPP",
          z80OPCode: "JP",
          cycleCost: s.alu.checkAluFlags(s.cpu.getRegister(s, 'f'), 'P') ? 15 : 10,
          cycleConditional: [10, 15],
          cycleCondition: "P",
          iReg: undefined,
          oReg: undefined,
          param1: opParams[0].toString(16),
          param2: opParams[1].toString(16),
          opBytes: 3,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0xeb: function(s, opParams, idxReg) {
        return {
          opCode: "XCHR",
          z80OPCode: "EX",
          cycleCost: 4,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: "DE",
          oReg: idxReg ? idxReg : "HL",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: idxReg
        };
      },
      0xec: function(s, opParams, idxReg) {
        return {
          opCode: "CALLP",
          z80OPCode: "CALL",
          cycleCost: s.alu.checkAluFlags(s.cpu.getRegister(s, 'f'), 'P') ? 18 : 10,
          cycleConditional: [10, 18],
          cycleCondition: "S",
          iReg: undefined,
          oReg: "SP",
          param1: opParams[0].toString(16),
          param2: opParams[1].toString(16),
          opBytes: 3,
          pointer: "#",
          indexRegisters: undefined
        };
      },
      0xed: function(s, opParams, idxReg) {
        return defaultNOP();
      },
      0xee: function(s, opParams, idxReg) {
        return {
          opCode: "XORR",
          z80OPCode: "XOR",
          cycleCost: 7,
          cycleConditional: undefined,
          cycleCondition: undefined,
          iReg: "A",
          oReg: "A",
          param1: opParams[0].toString(16),
          param2: undefined,
          opBytes: 2,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0xef: function(s, opParams, idxReg) {
        return {
          opCode: "RST28",
          z80OPCode: "RST 28",
          cycleCost: 11,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: undefined,
          oReg: "SP",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },


      0xf0: function(s, opParams, idxReg) {
        return {
          opCode: "RETNS",
          z80OPCode: "RET",
          cycleCost: s.alu.checkAluFlags(s.cpu.getRegister(s, 'f'), 'NS') ? 11 : 5,
          cycleConditional: [5, 11],
          cycleCondition: 'NS',
          iReg: undefined,
          oReg: undefined,
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0xf1: function(s, opParams, idxReg) {
        return {
          opCode: "POPR",
          z80OPCode: "POP",
          cycleCost: 10,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: "SP",
          oReg: "AF",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: "$",
          indexRegisters: undefined
        };
      },
      0xf2: function(s, opParams, idxReg) {
        return {
          opCode: "JMPNP",
          z80OPCode: "JP PO",
          cycleCost: s.alu.checkAluFlags(s.cpu.getRegister(s, 'f'), 'NS') ? 15 : 10,
          cycleConditional: [10, 15],
          cycleCondition: 'NS',
          iReg: undefined,
          oReg: undefined,
          param1: opParams[0].toString(16),
          param2: opParams[1].toString(16),
          opBytes: 3,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0xf3: function(s, opParams, idxReg) {
        return {
          opCode: "DIF",
          z80OPCode: "DI",
          cycleCost: 4,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: undefined,
          oReg: undefined,
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0xf4: function(s, opParams, idxReg) {
        return {
          opCode: "CALLS",
          z80OPCode: "CALL",
          cycleCost: s.alu.checkAluFlags(s.cpu.getRegister(s, 'f'), 'S') ? 18 : 11,
          cycleConditional: [11, 18],
          cycleCondition: 'S',
          iReg: undefined,
          oReg: undefined,
          param1: opParams[0].toString(16),
          param2: opParams[1].toString(16),
          opBytes: 3,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0xf5: function(s, opParams, idxReg) {
        return {
          opCode: "PUSH",
          z80OPCode: "PUSH",
          cycleCost: 11,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: "AF",
          oReg: "SP",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: "#",
          indexRegisters: undefined
        };
      },
      0xf6: function(s, opParams, idxReg) {
        return {
          opCode: "ORR",
          z80OPCode: "OR",
          cycleCost: 7,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: "A",
          oReg: "A",
          param1: opParams[0].toString(16),
          param2: undefined,
          opBytes: 2,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0xf7: function(s, opParams, idxReg) {
        return {
          opCode: "RST30",
          z80OPCode: "RST 30",
          cycleCost: 11,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: undefined,
          oReg: "SP",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0xf8: function(s, opParams, idxReg) {
        return {
          opCode: "RETS",
          z80OPCode: "RET",
          cycleCost: s.alu.checkAluFlags(s.cpu.getRegister(s, 'f'), 'S') ? 11 : 5,
          cycleConditional: [5, 11],
          cycleCondition: "S",
          iReg: undefined,
          oReg: undefined,
          param1: opParams[0].toString(16),
          param2: opParams[1].toString(16),
          opBytes: 3,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0xf9: function(s, opParams, idxReg) {
        return {
          opCode: "LD2R",
          z80OPCode: "LD",
          cycleCost: 6,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: idxReg ? idxReg : "HL",
          oReg: "SP",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: idxReg
        };
      },
      0xfa: function(s, opParams, idxReg) {
        return {
          opCode: "JMPS",
          z80OPCode: "JS",
          cycleCost: s.alu.checkAluFlags(s.cpu.getRegister(s, 'f'), 'S') ? 15 : 10,
          cycleConditional: [10, 15],
          cycleCondition: "S",
          iReg: undefined,
          oReg: undefined,
          param1: opParams[0].toString(16),
          param2: opParams[1].toString(16),
          opBytes: 3,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0xfb: function(s, opParams, idxReg) {
        return {
          opCode: "SIF",
          z80OPCode: "EI",
          cycleCost: 4,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: undefined,
          oReg: undefined,
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0xfc: function(s, opParams, idxReg) {
        return {
          opCode: "CALLS",
          z80OPCode: "CALL",
          cycleCost: s.alu.checkAluFlags(s.cpu.getRegister(s, 'f'), 'S') ? 18 : 11,
          cycleConditional: [11, 18],
          cycleCondition: "",
          iReg: undefined,
          oReg: undefined,
          param1: opParams[0].toString(16),
          param2: opParams[1].toString(16),
          opBytes: 3,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0xfd: function(s, opParams, idxReg) {
        var ret = disRet.disOp[opParams[0]](s, opParams[1], opParams[2], 'IY');
        ret.opBytes += 1;
        return ret;
      },
      0xfe: function(s, opParams, idxReg) {
        return {
          opCode: "DCXR",
          z80OPCode: "CP",
          cycleCost: 7,
          cycleConditional: undefined,
          cycleCondition: undefined,
          iReg: "A",
          oReg: undefined,
          param1: opParams[0].toString(16),
          param2: undefined,
          opBytes: 2,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0xff: function(s, opParams, idxReg) {
        return {
          opCode: "RST38",
          z80OPCode: "RST 38",
          cycleCost: 11,
          cycleConditional: [],
          cycleCondition: undefined,
          iReg: undefined,
          oReg: "SP",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      }
    }

    return disRet;
  });

  if (typeof(module) !== 'undefined') { // Node
    module.exports = objEmulatorFactory.disList;
  } else if (typeof define === 'function' && define.amd) { // AMD
    define([], function () {
        'use strict';
        return objEmulatorFactory.disList;
    });
  }

})(objEmulatorFactory);
