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
      },


      0x40: function(s, p1, p2, idxReg) {
        return {
          opCode: "LD2R",
          z80OPCode: "LD",
          cycleCost: 5,
          cycleConditional: [],
          iReg: "B",
          oReg: "B",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x41: function(s, p1, p2, idxReg) {
        return {
          opCode: "LD2R",
          z80OPCode: "LD",
          cycleCost: 5,
          cycleConditional: [],
          iReg: "C",
          oReg: "B",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x42: function(s, p1, p2, idxReg) {
        return {
          opCode: "LD2R",
          z80OPCode: "LD",
          cycleCost: 5,
          cycleConditional: [],
          iReg: "D",
          oReg: "B",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x43: function(s, p1, p2, idxReg) {
        return {
          opCode: "LD2R",
          z80OPCode: "LD",
          cycleCost: 5,
          cycleConditional: [],
          iReg: "E",
          oReg: "B",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x44: function(s, p1, p2, idxReg) {
        return {
          opCode: "LD2R",
          z80OPCode: "LD",
          cycleCost: 5,
          cycleConditional: [],
          iReg: "H",
          oReg: "B",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x45: function(s, p1, p2, idxReg) {
        return {
          opCode: "LD2R",
          z80OPCode: "LD",
          cycleCost: 5,
          cycleConditional: [],
          iReg: "L",
          oReg: "B",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x46: function(s, p1, p2, idxReg) {
        return {
          opCode: "LD2R",
          z80OPCode: "LD",
          cycleCost: 7,
          cycleConditional: [],
          iReg: idxReg ? idxReg : "HL",
          oReg: "B",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: "$",
          indexRegisters: idxReg
        };
      },
      0x47: function(s, p1, p2, idxReg) {
        return {
          opCode: "LD2R",
          z80OPCode: "LD",
          cycleCost: 5,
          cycleConditional: [],
          iReg: "A",
          oReg: "B",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x48: function(s, p1, p2, idxReg) {
        return {
          opCode: "LD2R",
          z80OPCode: "LD",
          cycleCost: 5,
          cycleConditional: [],
          iReg: "B",
          oReg: "C",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x49: function(s, p1, p2, idxReg) {
        return {
          opCode: "LD2R",
          z80OPCode: "LD",
          cycleCost: 5,
          cycleConditional: [],
          iReg: "C",
          oReg: "C",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x4a: function(s, p1, p2, idxReg) {
        return {
          opCode: "LD2R",
          z80OPCode: "LD",
          cycleCost: 5,
          cycleConditional: [],
          iReg: "D",
          oReg: "C",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x4b: function(s, p1, p2, idxReg) {
        return {
          opCode: "LD2R",
          z80OPCode: "LD",
          cycleCost: 5,
          cycleConditional: [],
          iReg: "E",
          oReg: "C",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x4c: function(s, p1, p2, idxReg) {
        return {
          opCode: "LD2R",
          z80OPCode: "LD",
          cycleCost: 5,
          cycleConditional: [],
          iReg: "H",
          oReg: "C",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x4d: function(s, p1, p2, idxReg) {
        return {
          opCode: "LD2R",
          z80OPCode: "LD",
          cycleCost: 5,
          cycleConditional: [],
          iReg: "L",
          oReg: "C",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x4e: function(s, p1, p2, idxReg) {
        return {
          opCode: "LD2R",
          z80OPCode: "LD",
          cycleCost: 7,
          cycleConditional: [],
          iReg: idxReg ? idxReg : "HL",
          oReg: "C",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: "$",
          indexRegisters: idxReg
        };
      },
      0x4f: function(s, p1, p2, idxReg) {
        return {
          opCode: "LD2R",
          z80OPCode: "LD",
          cycleCost: 5,
          cycleConditional: [],
          iReg: "A",
          oReg: "C",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },


      0x50: function(s, p1, p2, idxReg) {
        return {
          opCode: "LD2R",
          z80OPCode: "LD",
          cycleCost: 5,
          cycleConditional: [],
          iReg: "B",
          oReg: "D",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x51: function(s, p1, p2, idxReg) {
        return {
          opCode: "LD2R",
          z80OPCode: "LD",
          cycleCost: 5,
          cycleConditional: [],
          iReg: "C",
          oReg: "D",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x52: function(s, p1, p2, idxReg) {
        return {
          opCode: "LD2R",
          z80OPCode: "LD",
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
      0x53: function(s, p1, p2, idxReg) {
        return {
          opCode: "LD2R",
          z80OPCode: "LD",
          cycleCost: 5,
          cycleConditional: [],
          iReg: "E",
          oReg: "D",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x54: function(s, p1, p2, idxReg) {
        return {
          opCode: "LD2R",
          z80OPCode: "LD",
          cycleCost: 5,
          cycleConditional: [],
          iReg: "H",
          oReg: "D",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x55: function(s, p1, p2, idxReg) {
        return {
          opCode: "LD2R",
          z80OPCode: "LD",
          cycleCost: 5,
          cycleConditional: [],
          iReg: "L",
          oReg: "D",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x56: function(s, p1, p2, idxReg) {
        return {
          opCode: "LD2R",
          z80OPCode: "LD",
          cycleCost: 7,
          cycleConditional: [],
          iReg: idxReg ? idxReg : "HL",
          oReg: "D",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: "$",
          indexRegisters: idxReg
        };
      },
      0x57: function(s, p1, p2, idxReg) {
        return {
          opCode: "LD2R",
          z80OPCode: "LD",
          cycleCost: 5,
          cycleConditional: [],
          iReg: "A",
          oReg: "D",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x58: function(s, p1, p2, idxReg) {
        return {
          opCode: "LD2R",
          z80OPCode: "LD",
          cycleCost: 5,
          cycleConditional: [],
          iReg: "B",
          oReg: "E",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x59: function(s, p1, p2, idxReg) {
        return {
          opCode: "LD2R",
          z80OPCode: "LD",
          cycleCost: 5,
          cycleConditional: [],
          iReg: "C",
          oReg: "E",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x5a: function(s, p1, p2, idxReg) {
        return {
          opCode: "LD2R",
          z80OPCode: "LD",
          cycleCost: 5,
          cycleConditional: [],
          iReg: "D",
          oReg: "E",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x5b: function(s, p1, p2, idxReg) {
        return {
          opCode: "LD2R",
          z80OPCode: "LD",
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
      0x5c: function(s, p1, p2, idxReg) {
        return {
          opCode: "LD2R",
          z80OPCode: "LD",
          cycleCost: 5,
          cycleConditional: [],
          iReg: "H",
          oReg: "E",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x5d: function(s, p1, p2, idxReg) {
        return {
          opCode: "LD2R",
          z80OPCode: "LD",
          cycleCost: 5,
          cycleConditional: [],
          iReg: "L",
          oReg: "E",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x5e: function(s, p1, p2, idxReg) {
        return {
          opCode: "LD2R",
          z80OPCode: "LD",
          cycleCost: 7,
          cycleConditional: [],
          iReg: idxReg ? idxReg : "HL",
          oReg: "E",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: "$",
          indexRegisters: idxReg
        };
      },
      0x5f: function(s, p1, p2, idxReg) {
        return {
          opCode: "LD2R",
          z80OPCode: "LD",
          cycleCost: 5,
          cycleConditional: [],
          iReg: "A",
          oReg: "E",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },


      0x60: function(s, p1, p2, idxReg) {
        return {
          opCode: "LD2R",
          z80OPCode: "LD",
          cycleCost: 5,
          cycleConditional: [],
          iReg: "B",
          oReg: "H",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x61: function(s, p1, p2, idxReg) {
        return {
          opCode: "LD2R",
          z80OPCode: "LD",
          cycleCost: 5,
          cycleConditional: [],
          iReg: "C",
          oReg: "H",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x62: function(s, p1, p2, idxReg) {
        return {
          opCode: "LD2R",
          z80OPCode: "LD",
          cycleCost: 5,
          cycleConditional: [],
          iReg: "D",
          oReg: "H",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x63: function(s, p1, p2, idxReg) {
        return {
          opCode: "LD2R",
          z80OPCode: "LD",
          cycleCost: 5,
          cycleConditional: [],
          iReg: "E",
          oReg: "H",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x64: function(s, p1, p2, idxReg) {
        return {
          opCode: "LD2R",
          z80OPCode: "LD",
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
      0x65: function(s, p1, p2, idxReg) {
        return {
          opCode: "LD2R",
          z80OPCode: "LD",
          cycleCost: 5,
          cycleConditional: [],
          iReg: "L",
          oReg: "H",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x66: function(s, p1, p2, idxReg) {
        return {
          opCode: "LD2R",
          z80OPCode: "LD",
          cycleCost: 7,
          cycleConditional: [],
          iReg: idxReg ? idxReg : "HL",
          oReg: "H",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: "$",
          indexRegisters: idxReg
        };
      },
      0x67: function(s, p1, p2, idxReg) {
        return {
          opCode: "LD2R",
          z80OPCode: "LD",
          cycleCost: 5,
          cycleConditional: [],
          iReg: "A",
          oReg: "H",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x68: function(s, p1, p2, idxReg) {
        return {
          opCode: "LD2R",
          z80OPCode: "LD",
          cycleCost: 5,
          cycleConditional: [],
          iReg: "B",
          oReg: "L",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x69: function(s, p1, p2, idxReg) {
        return {
          opCode: "LD2R",
          z80OPCode: "LD",
          cycleCost: 5,
          cycleConditional: [],
          iReg: "C",
          oReg: "L",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x6a: function(s, p1, p2, idxReg) {
        return {
          opCode: "LD2R",
          z80OPCode: "LD",
          cycleCost: 5,
          cycleConditional: [],
          iReg: "D",
          oReg: "L",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x6b: function(s, p1, p2, idxReg) {
        return {
          opCode: "LD2R",
          z80OPCode: "LD",
          cycleCost: 5,
          cycleConditional: [],
          iReg: "E",
          oReg: "L",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x6c: function(s, p1, p2, idxReg) {
        return {
          opCode: "LD2R",
          z80OPCode: "LD",
          cycleCost: 5,
          cycleConditional: [],
          iReg: "H",
          oReg: "L",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x6d: function(s, p1, p2, idxReg) {
        return {
          opCode: "LD2R",
          z80OPCode: "LD",
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
      0x6e: function(s, p1, p2, idxReg) {
        return {
          opCode: "LD2R",
          z80OPCode: "LD",
          cycleCost: 7,
          cycleConditional: [],
          iReg: idxReg ? idxReg : "HL",
          oReg: "L",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: "$",
          indexRegisters: idxReg
        };
      },
      0x6f: function(s, p1, p2, idxReg) {
        return {
          opCode: "LD2R",
          z80OPCode: "LD",
          cycleCost: 5,
          cycleConditional: [],
          iReg: "L",
          oReg: "A",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },


      0x70: function(s, p1, p2, idxReg) {
        return {
          opCode: "LD2R",
          z80OPCode: "LD",
          cycleCost: 7,
          cycleConditional: [],
          iReg: "B",
          oReg: idxReg ? idxReg : "HL",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: "#",
          indexRegisters: idxReg
        };
      },
      0x71: function(s, p1, p2, idxReg) {
        return {
          opCode: "LD2R",
          z80OPCode: "LD",
          cycleCost: 7,
          cycleConditional: [],
          iReg: "C",
          oReg: idxReg ? idxReg : "HL",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: "#",
          indexRegisters: idxReg
        };
      },
      0x72: function(s, p1, p2, idxReg) {
        return {
          opCode: "LD2R",
          z80OPCode: "LD",
          cycleCost: 7,
          cycleConditional: [],
          iReg: "D",
          oReg: idxReg ? idxReg : "HL",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: "#",
          indexRegisters: idxReg
        };
      },
      0x73: function(s, p1, p2, idxReg) {
        return {
          opCode: "LD2R",
          z80OPCode: "LD",
          cycleCost: 7,
          cycleConditional: [],
          iReg: "E",
          oReg: idxReg ? idxReg : "HL",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: "#",
          indexRegisters: idxReg
        };
      },
      0x74: function(s, p1, p2, idxReg) {
        return {
          opCode: "LD2R",
          z80OPCode: "LD",
          cycleCost: 7,
          cycleConditional: [],
          iReg: "H",
          oReg: idxReg ? idxReg : "HL",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: "#",
          indexRegisters: idxReg
        };
      },
      0x75: function(s, p1, p2, idxReg) {
        return {
          opCode: "LD2R",
          z80OPCode: "LD",
          cycleCost: 7,
          cycleConditional: [],
          iReg: "L",
          oReg: idxReg ? idxReg : "HL",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: "#",
          indexRegisters: idxReg
        };
      },
      0x76: function(s, p1, p2, idxReg) {
        return {
          opCode: "HLT",
          z80OPCode: "HLT",
          cycleCost: 7,
          cycleConditional: [],
          iReg: undefined,
          oReg: undefined,
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: idxReg
        };
      },
      0x77: function(s, p1, p2, idxReg) {
        return {
          opCode: "LD2R",
          z80OPCode: "LD",
          cycleCost: 7,
          cycleConditional: [],
          iReg: "A",
          oReg: idxReg ? idxReg : "HL",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: "#",
          indexRegisters: idxReg
        };
      },
      0x78: function(s, p1, p2, idxReg) {
        return {
          opCode: "LD2R",
          z80OPCode: "LD",
          cycleCost: 7,
          cycleConditional: [],
          iReg: "B",
          oReg: "A",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x79: function(s, p1, p2, idxReg) {
        return {
          opCode: "LD2R",
          z80OPCode: "LD",
          cycleCost: 7,
          cycleConditional: [],
          iReg: "C",
          oReg: "A",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x7a: function(s, p1, p2, idxReg) {
        return {
          opCode: "LD2R",
          z80OPCode: "LD",
          cycleCost: 7,
          cycleConditional: [],
          iReg: "D",
          oReg: "A",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x7b: function(s, p1, p2, idxReg) {
        return {
          opCode: "LD2R",
          z80OPCode: "LD",
          cycleCost: 7,
          cycleConditional: [],
          iReg: "E",
          oReg: "A",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x7c: function(s, p1, p2, idxReg) {
        return {
          opCode: "LD2R",
          z80OPCode: "LD",
          cycleCost: 7,
          cycleConditional: [],
          iReg: "H",
          oReg: "A",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x7d: function(s, p1, p2, idxReg) {
        return {
          opCode: "LD2R",
          z80OPCode: "LD",
          cycleCost: 7,
          cycleConditional: [],
          iReg: "L",
          oReg: "A",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x7e: function(s, p1, p2, idxReg) {
        return {
          opCode: "LD2R",
          z80OPCode: "LD",
          cycleCost: 7,
          cycleConditional: [],
          iReg: idxReg ? idxReg : "HL",
          oReg: "A",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: "$",
          indexRegisters: idxReg
        };
      },
      0x7f: function(s, p1, p2, idxReg) {
        return {
          opCode: "LD2R",
          z80OPCode: "LD",
          cycleCost: 7,
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


      0x80: function(s, p1, p2, idxReg) {
        return {
          opCode: "INXR",
          z80OPCode: "ADD",
          cycleCost: 4,
          cycleConditional: [],
          iReg: "B",
          oReg: "A",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x81: function(s, p1, p2, idxReg) {
        return {
          opCode: "INXR",
          z80OPCode: "ADD",
          cycleCost: 4,
          cycleConditional: [],
          iReg: "C",
          oReg: "A",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x82: function(s, p1, p2, idxReg) {
        return {
          opCode: "INXR",
          z80OPCode: "ADD",
          cycleCost: 4,
          cycleConditional: [],
          iReg: "D",
          oReg: "A",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x83: function(s, p1, p2, idxReg) {
        return {
          opCode: "INXR",
          z80OPCode: "ADD",
          cycleCost: 4,
          cycleConditional: [],
          iReg: "E",
          oReg: "A",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x84: function(s, p1, p2, idxReg) {
        return {
          opCode: "INXR",
          z80OPCode: "ADD",
          cycleCost: 4,
          cycleConditional: [],
          iReg: "H",
          oReg: "A",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x85: function(s, p1, p2, idxReg) {
        return {
          opCode: "INXR",
          z80OPCode: "ADD",
          cycleCost: 4,
          cycleConditional: [],
          iReg: "L",
          oReg: "A",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x86: function(s, p1, p2, idxReg) {
        return {
          opCode: "INXR",
          z80OPCode: "ADD",
          cycleCost: 7,
          cycleConditional: [],
          iReg:  idxReg ? idxReg : "HL",
          oReg: "A",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: "$",
          indexRegisters: idxReg
        };
      },
      0x87: function(s, p1, p2, idxReg) {
        return {
          opCode: "INXR",
          z80OPCode: "ADD",
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
      0x88: function(s, p1, p2, idxReg) {
        return {
          opCode: "ICXR",
          z80OPCode: "ADD",
          cycleCost: 4,
          cycleConditional: [],
          iReg: "B",
          oReg: "A",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x89: function(s, p1, p2, idxReg) {
        return {
          opCode: "ICXR",
          z80OPCode: "ADD",
          cycleCost: 4,
          cycleConditional: [],
          iReg: "C",
          oReg: "A",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x8a: function(s, p1, p2, idxReg) {
        return {
          opCode: "ICXR",
          z80OPCode: "ADD",
          cycleCost: 4,
          cycleConditional: [],
          iReg: "D",
          oReg: "A",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x8b: function(s, p1, p2, idxReg) {
        return {
          opCode: "ICXR",
          z80OPCode: "ADD",
          cycleCost: 4,
          cycleConditional: [],
          iReg: "E",
          oReg: "A",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x8c: function(s, p1, p2, idxReg) {
        return {
          opCode: "ICXR",
          z80OPCode: "ADD",
          cycleCost: 4,
          cycleConditional: [],
          iReg: "H",
          oReg: "A",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x8d: function(s, p1, p2, idxReg) {
        return {
          opCode: "ICXR",
          z80OPCode: "ADD",
          cycleCost: 4,
          cycleConditional: [],
          iReg: "L",
          oReg: "A",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x8e: function(s, p1, p2, idxReg) {
        return {
          opCode: "ICXR",
          z80OPCode: "ADD",
          cycleCost: 7,
          cycleConditional: [],
          iReg:  idxReg ? idxReg : "HL",
          oReg: "A",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: "$",
          indexRegisters: idxReg
        };
      },
      0x8f: function(s, p1, p2, idxReg) {
        return {
          opCode: "ICXR",
          z80OPCode: "ADD",
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


      0x90: function(s, p1, p2, idxReg) {
        return {
          opCode: "DCXR",
          z80OPCode: "ADD",
          cycleCost: 4,
          cycleConditional: [],
          iReg: "B",
          oReg: "A",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x91: function(s, p1, p2, idxReg) {
        return {
          opCode: "DCXR",
          z80OPCode: "ADD",
          cycleCost: 4,
          cycleConditional: [],
          iReg: "C",
          oReg: "A",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x92: function(s, p1, p2, idxReg) {
        return {
          opCode: "DCXR",
          z80OPCode: "ADD",
          cycleCost: 4,
          cycleConditional: [],
          iReg: "D",
          oReg: "A",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x93: function(s, p1, p2, idxReg) {
        return {
          opCode: "DCXR",
          z80OPCode: "ADD",
          cycleCost: 4,
          cycleConditional: [],
          iReg: "E",
          oReg: "A",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x94: function(s, p1, p2, idxReg) {
        return {
          opCode: "DCXR",
          z80OPCode: "ADD",
          cycleCost: 4,
          cycleConditional: [],
          iReg: "H",
          oReg: "A",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x95: function(s, p1, p2, idxReg) {
        return {
          opCode: "DCXR",
          z80OPCode: "ADD",
          cycleCost: 4,
          cycleConditional: [],
          iReg: "L",
          oReg: "A",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x96: function(s, p1, p2, idxReg) {
        return {
          opCode: "DCXR",
          z80OPCode: "ADD",
          cycleCost: 7,
          cycleConditional: [],
          iReg:  idxReg ? idxReg : "HL",
          oReg: "A",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: "$",
          indexRegisters: idxReg
        };
      },
      0x97: function(s, p1, p2, idxReg) {
        return {
          opCode: "DCXR",
          z80OPCode: "ADD",
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
      0x98: function(s, p1, p2, idxReg) {
        return {
          opCode: "DEXR",
          z80OPCode: "ADD",
          cycleCost: 4,
          cycleConditional: [],
          iReg: "B",
          oReg: "A",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x99: function(s, p1, p2, idxReg) {
        return {
          opCode: "DEXR",
          z80OPCode: "ADD",
          cycleCost: 4,
          cycleConditional: [],
          iReg: "C",
          oReg: "A",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x9a: function(s, p1, p2, idxReg) {
        return {
          opCode: "DEXR",
          z80OPCode: "ADD",
          cycleCost: 4,
          cycleConditional: [],
          iReg: "D",
          oReg: "A",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x9b: function(s, p1, p2, idxReg) {
        return {
          opCode: "DEXR",
          z80OPCode: "ADD",
          cycleCost: 4,
          cycleConditional: [],
          iReg: "E",
          oReg: "A",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x9c: function(s, p1, p2, idxReg) {
        return {
          opCode: "DEXR",
          z80OPCode: "ADD",
          cycleCost: 4,
          cycleConditional: [],
          iReg: "H",
          oReg: "A",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x9d: function(s, p1, p2, idxReg) {
        return {
          opCode: "DEXR",
          z80OPCode: "ADD",
          cycleCost: 4,
          cycleConditional: [],
          iReg: "L",
          oReg: "A",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: undefined,
          indexRegisters: undefined
        };
      },
      0x9e: function(s, p1, p2, idxReg) {
        return {
          opCode: "DEXR",
          z80OPCode: "ADD",
          cycleCost: 7,
          cycleConditional: [],
          iReg:  idxReg ? idxReg : "HL",
          oReg: "A",
          param1: undefined,
          param2: undefined,
          opBytes: 1,
          pointer: "$",
          indexRegisters: idxReg
        };
      },
      0x9f: function(s, p1, p2, idxReg) {
        return {
          opCode: "DEXR",
          z80OPCode: "ADD",
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
