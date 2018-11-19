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
      type: "dis"
    };

    var defaultNOP = Object.freeze({
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
    });

    disRet.disOp = {
      0x00: function(s, p1, p2, idxReg) {
        return defaultNOP;
      },
      0x01: function(s, p1, p2, idxReg) {
        return {
          opCode: "LD2R",
          z80OPCode: "LD",
          cycleCost: 10,
          cycleConditional: [],
          oReg: "BC",
          iReg: undefined,
          param1: p1.toString(16),
          param2: p2.toString(16),
          opBytes: 3,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x02: function(s, p1, p2, idxReg) {
        return {
          opCode: "LD2M",
          z80OPCode: "LD",
          cycleCost: 7,
          cycleConditional: [],
          oReg: "BC",
          iReg: "A",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: "#",
          indexRegisters: undefined
        };
      },
      0x03: function(s, p1, p2, idxReg) {
        return {
          opCode: "INCR",
          z80OPCode: "INC",
          cycleCost: 6,
          cycleConditional: [],
          oReg: "BC",
          iReg: "BC",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x04: function(s, p1, p2, idxReg) {
        return {
          opCode: "INCR",
          z80OPCode: "INC",
          cycleCost: 5,
          cycleConditional: [],
          oReg: "B",
          iReg: "B",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x05: function(s, p1, p2, idxReg) {
        return {
          opCode: "DCRR",
          z80OPCode: "DEC",
          cycleCost: 5,
          cycleConditional: [],
          oReg: "B",
          iReg: "B",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x06: function(s, p1, p2, idxReg) {
        return {
          opCode: "LD2R",
          z80OPCode: "LD",
          cycleCost: 7,
          cycleConditional: [],
          oReg: "B",
          iReg: undefined,
          param1: p1.toString(16),
          param2: undefined,
          opBytes: 2,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x07: function(s, p1, p2, idxReg) {
        return {
          opCode: "RLCA",
          z80OPCode: "RLCA",
          cycleCost: 4,
          cycleConditional: [],
          oReg: "A",
          iReg: "A",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x08: function(s, p1, p2, idxReg) {
        return defaultNOP;
      },
      0x09: function(s, p1, p2, idxReg) {
        return {
          opCode: "INXR",
          z80OPCode: "ADD",
          cycleCost: 11,
          cycleConditional: [],
          oReg: idxReg ? idxReg : "HL",
          iReg: "BC",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: idxReg
        };
      },
      0x0a: function(s, p1, p2, idxReg) {
        return {
          opCode: "LD2R",
          z80OPCode: "LD",
          cycleCost: 7,
          cycleConditional: [],
          oReg: "A",
          iReg: "BC",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: "&",
          indexRegisters: undefined
        };
      },
      0x0b: function(s, p1, p2, idxReg) {
        return {
          opCode: "DCRR",
          z80OPCode: "DEC",
          cycleCost: 6,
          cycleConditional: [],
          oReg: "BC",
          iReg: "BC",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x0c: function(s, p1, p2, idxReg) {
        return {
          opCode: "INCR",
          z80OPCode: "INC",
          cycleCost: 5,
          cycleConditional: [],
          oReg: "C",
          iReg: "C",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x0d: function(s, p1, p2, idxReg) {
        return {
          opCode: "DCRR",
          z80OPCode: "DEC",
          cycleCost: 5,
          cycleConditional: [],
          oReg: "C",
          iReg: "C",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x0e: function(s, p1, p2, idxReg) {
        return {
          opCode: "LD2R",
          z80OPCode: "LD",
          cycleCost: 7,
          cycleConditional: [],
          oReg: "C",
          iReg: undefined,
          param1: p1.toString(16),
          param2: undefined,
          opBytes: 2,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x0f: function(s, p1, p2, idxReg) {
        return {
          opCode: "RRCA",
          z80OPCode: "RRCA",
          cycleCost: 4,
          cycleConditional: [],
          oReg: "A",
          iReg: "A",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },


      0x10: function(s, p1, p2, idxReg) {
        return defaultNOP;
      },
      0x11: function(s, p1, p2, idxReg) {
        return {
          opCode: "LD2R",
          z80OPCode: "LD",
          cycleCost: 10,
          cycleConditional: [],
          oReg: "DE",
          iReg: "A",
          param1: p1.toString(16),
          param2: p2.toString(16),
          opBytes: 3,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x12: function(s, p1, p2, idxReg) {
        return {
          opCode: "LD2M",
          z80OPCode: "LD",
          cycleCost: 7,
          cycleConditional: [],
          iReg: "A",
          oReg: "DE",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: "#",
          indexRegisters: undefined
        };
      },
      0x13: function(s, p1, p2, idxReg) {
        return {
          opCode: "INCR",
          z80OPCode: "INC",
          cycleCost: 6,
          cycleConditional: [],
          iReg: "DE",
          oReg: "DE",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x14: function(s, p1, p2, idxReg) {
        return {
          opCode: "INCR",
          z80OPCode: "INC",
          cycleCost: 5,
          cycleConditional: [],
          iReg: "D",
          oReg: "D",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x15: function(s, p1, p2, idxReg) {
        return {
          opCode: "DCRR",
          z80OPCode: "DEC",
          cycleCost: 5,
          cycleConditional: [],
          iReg: "D",
          oReg: undefined,
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x16: function(s, p1, p2, idxReg) {
        return {
          opCode: "LD2R",
          z80OPCode: "LD",
          cycleCost: 7,
          cycleConditional: [],
          iReg: undefined,
          oReg: "D",
          param1: p1.toString(16),
          param2: undefined,
          opBytes: 2,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x17: function(s, p1, p2, idxReg) {
        return {
          opCode: "RLC9",
          z80OPCode: "RLA",
          cycleCost: 4,
          cycleConditional: [],
          iReg: "A",
          oReg: "A",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x18: function(s, p1, p2, idxReg) {
        return defaultNOP;
      },
      0x19: function(s, p1, p2, idxReg) {
        return {
          opCode: "INXR",
          z80OPCode: "ADD",
          cycleCost: 11,
          cycleConditional: [],
          iReg: "DE",
          oReg: idxReg ? idxReg : "HL",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: idxReg
        };
      },
      0x1a: function(s, p1, p2, idxReg) {
        return {
          opCode: "LD2R",
          z80OPCode: "LD",
          cycleCost: 7,
          cycleConditional: [],
          iReg: "DE",
          oReg: "A",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: "&",
          indexRegisters: undefined
        };
      },
      0x1b: function(s, p1, p2, idxReg) {
        return {
          opCode: "DCRR",
          z80OPCode: "DEC",
          cycleCost: 6,
          cycleConditional: [],
          iReg: "DE",
          oReg: "DE",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x1c: function(s, p1, p2, idxReg) {
        return {
          opCode: "INCR",
          z80OPCode: "INC",
          cycleCost: 5,
          cycleConditional: [],
          iReg: "E",
          oReg: "E",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x1d: function(s, p1, p2, idxReg) {
        return {
          opCode: "DCRR",
          z80OPCode: "DEC",
          cycleCost: 5,
          cycleConditional: [],
          iReg: "E",
          oReg: "E",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x1e: function(s, p1, p2, idxReg) {
        return {
          opCode: "LD2R",
          z80OPCode: "LD",
          cycleCost: 7,
          cycleConditional: [],
          iReg: undefined,
          oReg: "E",
          param1: p1.toString(16),
          param2: undefined,
          opBytes: 2,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x1e: function(s, p1, p2, idxReg) {
        return {
          opCode: "RRC",
          z80OPCode: "RRA",
          cycleCost: 4,
          cycleConditional: [],
          iReg: "A",
          oReg: "A",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },


      0x20: function(s, p1, p2, idxReg) {
        return defaultNOP;
      },
      0x21: function(s, p1, p2, idxReg) {
        return {
          opCode: "LD2R",
          z80OPCode: "LD",
          cycleCost: 10,
          cycleConditional: [],
          iReg: undefined,
          oReg: idxReg ? idxReg : "HL",
          param1: p1.toString(16),
          param2: p2.toString(16),
          opBytes: 3,
          pointer: undefined,
          indexRegisters: idxReg
        };
      },
      0x22: function(s, p1, p2, idxReg) {
        return {
          opCode: "LD2M",
          z80OPCode: "LD",
          cycleCost: 16,
          cycleConditional: [],
          iReg: idxReg ? idxReg : "HL",
          oReg: undefined,
          param1: p1.toString(16),
          param2: p2.toString(16),
          opBytes: 3,
          pointer: undefined,
          indexRegisters: idxReg
        };
      },
      0x23: function(s, p1, p2, idxReg) {
        return {
          opCode: "INCR",
          z80OPCode: "INC",
          cycleCost: 6,
          cycleConditional: [],
          iReg: idxReg ? idxReg : "HL",
          oReg: idxReg ? idxReg : "HL",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: idxReg
        };
      },
      0x24: function(s, p1, p2, idxReg) {
        return {
          opCode: "INCR",
          z80OPCode: "INC",
          cycleCost: 5,
          cycleConditional: [],
          iReg: "H",
          oReg: "H",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x25: function(s, p1, p2, idxReg) {
        return {
          opCode: "DCRR",
          z80OPCode: "DEC",
          cycleCost: 5,
          cycleConditional: [],
          iReg: "H",
          oReg: "H",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x26: function(s, p1, p2, idxReg) {
        return {
          opCode: "LD2R",
          z80OPCode: "LD",
          cycleCost: 7,
          cycleConditional: [],
          iReg: "H",
          oReg: "H",
          param1: p1.toString(16),
          param2: undefined,
          opBytes: 2,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x27: function(s, p1, p2, idxReg) {
        return defaultNOP;
      },
      0x28: function(s, p1, p2, idxReg) {
        return defaultNOP;
      },
      0x29: function(s, p1, p2, idxReg) {
        return {
          opCode: "INXR",
          z80OPCode: "ADD",
          cycleCost: 11,
          cycleConditional: [],
          iReg: idxReg ? idxReg : "HL",
          oReg: idxReg ? idxReg : "HL",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: idxReg
        };
      },
      0x2a: function(s, p1, p2, idxReg) {
        return {
          opCode: "LD2R",
          z80OPCode: "LD",
          cycleCost: 11,
          cycleConditional: [],
          iReg: undefined,
          oReg: idxReg ? idxReg : "HL",
          param1: p1.toString(16),
          param2: p2.toString(16),
          opBytes: 3,
          pointer: "&",
          indexRegisters: idxReg
        };
      },
      0x2b: function(s, p1, p2, idxReg) {
        return {
          opCode: "DCRR",
          z80OPCode: "DEC",
          cycleCost: 6,
          cycleConditional: [],
          iReg: idxReg ? idxReg : "HL",
          oReg: idxReg ? idxReg : "HL",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: idxReg
        };
      },
      0x2c: function(s, p1, p2, idxReg) {
        return {
          opCode: "INCR",
          z80OPCode: "INC",
          cycleCost: 5,
          cycleConditional: [],
          iReg: "L",
          oReg: "L",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x2d: function(s, p1, p2, idxReg) {
        return {
          opCode: "DCRR",
          z80OPCode: "DEC",
          cycleCost: 5,
          cycleConditional: [],
          iReg: "L",
          oReg: "L",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x2e: function(s, p1, p2, idxReg) {
        return {
          opCode: "LD2R",
          z80OPCode: "LD",
          cycleCost: 7,
          cycleConditional: [],
          iReg: "L",
          oReg: "L",
          param1: p1.toString(16),
          param2: undefined,
          opBytes: 2,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x2f: function(s, p1, p2, idxReg) {
        return {
          opCode: "CPL",
          z80OPCode: "CPL",
          cycleCost: 4,
          cycleConditional: [],
          iReg: undefined,
          oReg: "A",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },


      0x30: function(s, p1, p2, idxReg) {
        return defaultNOP;
      },
      0x31: function(s, p1, p2, idxReg) {
        return {
          opCode: "LD2R",
          z80OPCode: "LD",
          cycleCost: 10,
          cycleConditional: [],
          iReg: undefined,
          oReg: "SP",
          param1: p1.toString(16),
          param2: p2.toString(16),
          opBytes: 3,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x32: function(s, p1, p2, idxReg) {
        return {
          opCode: "LD2M",
          z80OPCode: "LD",
          cycleCost: 13,
          cycleConditional: [],
          iReg: "A",
          oReg: undefined,
          param1: p1.toString(16),
          param2: p2.toString(16),
          opBytes: 3,
          pointer: "#",
          indexRegisters: undefined
        };
      },
      0x33: function(s, p1, p2, idxReg) {
        return {
          opCode: "INCR",
          z80OPCode: "INC",
          cycleCost: 6,
          cycleConditional: [],
          iReg: "SP",
          oReg: "SP",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x34: function(s, p1, p2, idxReg) {
        return {
          opCode: "INCM",
          z80OPCode: "INC",
          cycleCost: 10,
          cycleConditional: [],
          iReg: idxReg ? idxReg : "HL",
          oReg: idxReg ? idxReg : "HL",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: "#",
          indexRegisters: idxReg
        };
      },
      0x35: function(s, p1, p2, idxReg) {
        return {
          opCode: "DCRM",
          z80OPCode: "DEC",
          cycleCost: 10,
          cycleConditional: [],
          iReg: idxReg ? idxReg : "HL",
          oReg: idxReg ? idxReg : "HL",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: "#",
          indexRegisters: idxReg
        };
      },
      0x36: function(s, p1, p2, idxReg) {
        return {
          opCode: "LD2M",
          z80OPCode: "LD",
          cycleCost: 10,
          cycleConditional: [],
          iReg: undefined,
          oReg: idxReg ? idxReg : "HL",
          param1: p1.toString(16),
          param2: undefined,
          opBytes: 2,
          pointer: "#",
          indexRegisters: idxReg
        };
      },
      0x37: function(s, p1, p2, idxReg) {
        return {
          opCode: "SCF",
          z80OPCode: "SCF",
          cycleCost: 4,
          cycleConditional: [],
          iReg: undefined,
          oReg: undefined,
          param1: p1.toString(16),
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x38: function(s, p1, p2, idxReg) {
        return defaultNOP;
      },
      0x39: function(s, p1, p2, idxReg) {
        return {
          opCode: "INXR",
          z80OPCode: "ADD",
          cycleCost: 11,
          cycleConditional: [],
          iReg: "SP",
          oReg: idxReg ? idxReg : "HL",
          param1: p1.toString(16),
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x3a: function(s, p1, p2, idxReg) {
        return {
          opCode: "LD2R",
          z80OPCode: "LD",
          cycleCost: 13,
          cycleConditional: [],
          iReg: undefined,
          oReg: "A",
          param1: p1.toString(16),
          param2: p2.toString(16),
          opBytes: 3,
          pointer: "$",
          indexRegisters: undefined
        };
      },
      0x3b: function(s, p1, p2, idxReg) {
        return {
          opCode: "DCRR",
          z80OPCode: "DEC",
          cycleCost: 6,
          cycleConditional: [],
          iReg: "A",
          oReg: "SP",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x3c: function(s, p1, p2, idxReg) {
        return {
          opCode: "INCR",
          z80OPCode: "INC",
          cycleCost: 6,
          cycleConditional: [],
          iReg: "A",
          oReg: "A",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x3d: function(s, p1, p2, idxReg) {
        return {
          opCode: "DCRR",
          z80OPCode: "DEC",
          cycleCost: 5,
          cycleConditional: [],
          iReg: "A",
          oReg: "A",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x3e: function(s, p1, p2, idxReg) {
        return {
          opCode: "LD2R",
          z80OPCode: "LD",
          cycleCost: 7,
          cycleConditional: [],
          iReg: "A",
          oReg: "A",
          param1: p1.toString(16),
          param2: undefined,
          opBytes: 2,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x3f: function(s, p1, p2, idxReg) {
        return {
          opCode: "CCF",
          z80OPCode: "CCF",
          cycleCost: 4,
          cycleConditional: [],
          iReg: undefined,
          oReg: undefined,
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
