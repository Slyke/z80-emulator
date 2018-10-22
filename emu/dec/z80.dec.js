if (!emu) {
  var emu = {};
}

if (!emu.aluList) {
  emu.decList = [];
}

emu.decList.push(function() {
  var decRet = {
    name: "z80",
    type: "decoder"
  };

  decRet.decode = {
    0x00: function(s) {
      s.cpu.intst.nop(s);
      return arguments.callee.length;
    },

    0x01: function(s, p1, p2) {
      s.cpu.intst.setReg(s, 'c', p1);
      s.cpu.intst.setReg(s, 'b', p2);
      s.cpu.addCycles(s, 10);
      return arguments.callee.length;
    },

    0x02: function(s) {
      s.cpu.intst.setMemByte(s, s.cpu.getRegister(s, 'bc'), s.cpu.getRegister(s, 'a'));
      s.cpu.addCycles(s, 7);
      return arguments.callee.length;
    },

    0x03: function(s) {
      s.cpu.intst.deIncMultiReg(s, 'bc');
      s.cpu.addCycles(s, 6);
      return arguments.callee.length;
    },

    0x04: function(s) {
      s.cpu.intst.deIncReg(s, 'b');
      s.cpu.addCycles(s, 5);
      return arguments.callee.length;
    },

    0x05: function(s) {
      s.cpu.intst.deIncReg(s, 'b', -1);
      s.cpu.addCycles(s, 5);
      return arguments.callee.length;
    },

    0x06: function(s, p1) {
      s.cpu.intst.setReg(s, 'b', p1);
      s.cpu.addCycles(s, 6);
      return arguments.callee.length;
    },

    0x07: function(s) {
      s.cpu.intst.rlc(s);
      s.cpu.addCycles(s, 4);
      return arguments.callee.length;
    },

    0x08: function(s) {
      s.cpu.intst.nop(s);
      return arguments.callee.length;
    },

    0x09: function(s, idxReg = 'hl') {
      s.cpu.intst.deIncMultiReg(s, idxReg, s.cpu.getRegister(s, 'bc'));
      s.cpu.addCycles(s, 11);
      return arguments.callee.length - 1;
    },

    0x0a: function(s) {
      s.cpu.intst.setRegFromMem(s, 'a', s.cpu.getRegister(s, 'bc'));
      s.cpu.addCycles(s, 7);
      return arguments.callee.length;
    },

    0x0b: function(s) {
      s.cpu.intst.deIncMultiReg(s, 'bc', -1);
      s.cpu.addCycles(s, 6);
      return arguments.callee.length;
    },

    0x0c: function(s) {
      s.cpu.intst.deIncReg(s, 'c', 1);
      s.cpu.addCycles(s, 5);
      return arguments.callee.length;
    },

    0x0d: function(s) {
      s.cpu.intst.deIncReg(s, 'c', -1);
      s.cpu.addCycles(s, 5);
      return arguments.callee.length;
    },

    0x0e: function(s, p1) {
      s.cpu.intst.setReg(s, 'b', p1);
      s.cpu.addCycles(s, 7);
      return arguments.callee.length;
    },

    0x0f: function(s) {
      s.cpu.intst.rrc(s);
      s.cpu.addCycles(s, 4);
      return arguments.callee.length;
    },

    0x10: function(s) {
      s.cpu.intst.nop(s);
      return arguments.callee.length;
    },

    0x11: function(s, p1, p2) {
      s.cpu.intst.setReg(s, 'd', p1);
      s.cpu.intst.setReg(s, 'e', p2);
      s.cpu.addCycles(s, 10);
      return arguments.callee.length;
    },

    0x12: function(s) {
      s.cpu.intst.setMemByte(s, s.cpu.getRegister(s, 'de'), s.cpu.getRegister(s, 'a'));
      s.cpu.addCycles(s, 7);
      return arguments.callee.length;
    },

    0x13: function(s) {
      s.cpu.intst.deIncMultiReg(s, 'de');
      s.cpu.addCycles(s, 6);
      return arguments.callee.length;
    },

    0x14: function(s) {
      s.cpu.intst.deIncReg(s, 'd');
      s.cpu.addCycles(s, 5);
      return arguments.callee.length;
    },

    0x15: function(s) {
      s.cpu.intst.deIncReg(s, 'd', -1);
      s.cpu.addCycles(s, 5);
      return arguments.callee.length;
    },

    0x16: function(s, p1) {
      s.cpu.intst.setReg(s, 'd', p1);
      s.cpu.addCycles(s, 6);
      return arguments.callee.length;
    },

    0x17: function(s) {
      s.cpu.intst.rlc9(s);
      s.cpu.addCycles(s, 4);
      return arguments.callee.length;
    },

    0x18: function(s) {
      s.cpu.intst.nop(s);
      return arguments.callee.length;
    },

    0x19: function(s, idxReg = 'hl') {
      s.cpu.intst.deIncMultiReg(s, idxReg, s.cpu.getRegister(s, 'de'));
      s.cpu.addCycles(s, 11);
      return arguments.callee.length - 1;
    },

    0x1a: function(s) {
      s.cpu.intst.setRegFromMem(s, 'a', s.cpu.getRegister(s, 'de'));
      s.cpu.addCycles(s, 7);
      return arguments.callee.length;
    },

    0x1b: function(s) {
      s.cpu.intst.deIncMultiReg(s, 'de', -1);
      s.cpu.addCycles(s, 6);
      return arguments.callee.length;
    },

    0x1c: function(s) {
      s.cpu.intst.deIncReg(s, 'e', 1);
      s.cpu.addCycles(s, 5);
      return arguments.callee.length;
    },

    0x1d: function(s) {
      s.cpu.intst.deIncReg(s, 'e', -1);
      s.cpu.addCycles(s, 5);
      return arguments.callee.length;
    },

    0x1e: function(s, p1) {
      s.cpu.intst.setReg(s, 'e', p1);
      s.cpu.addCycles(s, 7);
      return arguments.callee.length;
    },

    0x1f: function(s) {
      s.cpu.intst.rrcc(s);
      s.cpu.addCycles(s, 4);
      return arguments.callee.length;
    },

    0x20: function(s) {
      s.cpu.intst.nop(s);
      return arguments.callee.length;
    },

    0x21: function(s, p1, p2, idxReg) {
      if (idxReg) {
        s.cpu.intst.setReg(s, idxReg, s.utils.combineBytes(p1, p2));
      } else {
        s.cpu.intst.setReg(s, 'h', p1);
        s.cpu.intst.setReg(s, 'l', p2);
      }
      s.cpu.addCycles(s, 10);
      return arguments.callee.length - 1;
    },

    0x22: function(s, p1, p2, idxReg) {
      if (idxReg) {
        s.cpu.intst.setMemWord(s, s.utils.combineBytes(p1, p2), s.cpu.getRegister(s, idxReg));
      } else {
        s.cpu.intst.setMemWord(s, s.utils.combineBytes(p1, p2), s.cpu.getRegister(s, 'hl'));
      }
      s.cpu.addCycles(s, 16);
      return arguments.callee.length - 1;
    },

    0x23: function(s, idxReg) {
      if (idxReg) {
        s.cpu.intst.deIncMultiReg(s, idxReg);
      } else {
        s.cpu.intst.deIncMultiReg(s, 'hl');
      }
      s.cpu.addCycles(s, 6);
      return arguments.callee.length - 1;
    },

    0x24: function(s) {
      s.cpu.intst.deIncReg(s, 'h');
      s.cpu.addCycles(s, 6);
      return arguments.callee.length;
    },

    0x25: function(s) {
      s.cpu.intst.deIncReg(s, 'h', -1);
      s.cpu.addCycles(s, 6);
      return arguments.callee.length;
    },

    0x26: function(s, p1) {
      s.cpu.intst.setReg(s, 'h', p1);
      s.cpu.addCycles(s, 7);
      return arguments.callee.length;
    },

    0x27: function(s) {
      s.cpu.intst.nop(s);
      return arguments.callee.length;
    },

    0x28: function(s) {
      s.cpu.intst.nop(s);
      return arguments.callee.length;
    },

    0x29: function(s, idxReg = 'hl') {
      s.cpu.intst.deIncMultiReg(s, idxReg, s.cpu.getRegister(s, idxReg));
      return arguments.callee.length - 1;
    },

    0x29: function(s, idxReg = 'hl') {
      s.cpu.intst.deIncMultiReg(s, idxReg, s.cpu.getRegister(s, idxReg));
      s.cpu.addCycles(s, 11);
      return arguments.callee.length - 1;
    },

    0x2a: function(s, p1, p2, idxReg = 'hl') {
      s.cpu.intst.setRegFromMem(s, idxReg, s.utils.combineBytes(p1, p2));
      s.cpu.addCycles(s, 16);
      return arguments.callee.length - 1;
    },

    0x2b: function(s, idxReg = 'hl') {
      s.cpu.intst.deIncMultiReg(s, idxReg, -1);
      s.cpu.addCycles(s, 6);
      return arguments.callee.length - 1;
    },

    0x2c: function(s) {
      s.cpu.intst.deIncReg(s, 'l');
      s.cpu.addCycles(s, 5);
      return arguments.callee.length;
    },

    0x2d: function(s) {
      s.cpu.intst.deIncReg(s, 'l', -1);
      s.cpu.addCycles(s, 7);
      return arguments.callee.length;
    },

    0x2e: function(s, p1) {
      s.cpu.intst.setReg(s, 'l', p1);
      s.cpu.addCycles(s, 7);
      return arguments.callee.length;
    },

    0x2f: function(s) {
      s.cpu.intst.cpl(s);
      s.cpu.addCycles(s, 4);
      return arguments.callee.length;
    },

    0x30: function(s) {
      s.cpu.intst.nop(s);
      return arguments.callee.length;
    },

    0x31: function(s, p1, p2) {
      s.cpu.intst.setReg(s, 'sp', s.utils.combineBytes(p1, p2));
      return arguments.callee.length;
    },

    0x32: function(s, p1, p2) {
      s.cpu.intst.setMemByte(s, s.utils.combineBytes(p1, p2), s.cpu.getRegister(s, 'a'));
      s.cpu.addCycles(s, 10);
      return arguments.callee.length;
    },

    0x33: function(s) {
      s.cpu.intst.deIncMultiReg(s, 'sp');
      s.cpu.addCycles(s, 6);
      return arguments.callee.length;
    },

    0x34: function(s, idxReg = 'hl') {
      s.cpu.intst.deIncMemByte(s, s.cpu.getRegister(s, idxReg));
      s.cpu.addCycles(s, 10);
      return arguments.callee.length;
    },

    0x35: function(s, idxReg = 'hl') {
      s.cpu.intst.deIncMemByte(s, s.cpu.getRegister(s, idxReg), -1);
      s.cpu.addCycles(s, 10);
      return arguments.callee.length;
    },

    0x36: function(s, p1, idxReg = 'hl') {
      s.cpu.intst.setMemByte(s, s.cpu.getRegister(s, idxReg), p1);
      s.cpu.addCycles(s, 10);
      return arguments.callee.length;
    },

    0x37: function(s) {
      s.cpu.intst.srf(s, 'f', 'carry');
      s.cpu.addCycles(s, 4);
      return arguments.callee.length;
    },

    0x38: function(s) {
      s.cpu.intst.nop(s);
      return arguments.callee.length;
    },

    0x39: function(s, idxReg = 'hl') {
      s.cpu.intst.deIncMultiReg(s, idxReg, s.cpu.getRegister(s, 'sp'));
      s.cpu.addCycles(s, 11);
      return arguments.callee.length;
    },

    0x3a: function(s, p1, p2) {
      s.cpu.intst.setRegFromMem(s, 'a', s.utils.combineBytes(p1, p2));
      s.cpu.addCycles(s, 11);
      return arguments.callee.length;
    },

    0x3b: function(s) {
      s.cpu.intst.deIncMultiReg(s, 'sp', -1);
      s.cpu.addCycles(s, 6);
      return arguments.callee.length;
    },

    0x3c: function(s) {
      s.cpu.intst.deIncReg(s, 'a');
      s.cpu.addCycles(s, 5);
      return arguments.callee.length;
    },

    0x3d: function(s, p1) {
      s.cpu.intst.deIncReg(s, 'a', -1);
      s.cpu.addCycles(s, 5);
      return arguments.callee.length;
    },

    0x3e: function(s, p1) {
      s.cpu.intst.setReg(s, 'a', p1);
      s.cpu.addCycles(s, 6);
      return arguments.callee.length;
    },

    0x3f: function(s) {
      s.cpu.intst.crf(s, 'f', 'carry');
      s.cpu.addCycles(s, 4);
      return arguments.callee.length;
    },

    0x40: function(s) {
      s.cpu.intst.setRegFromReg(s, 'b', 'b');
      s.cpu.addCycles(s, 5);
      return arguments.callee.length;
    },

    0x41: function(s) {
      s.cpu.intst.setRegFromReg(s, 'b', 'c');
      s.cpu.addCycles(s, 5);
      return arguments.callee.length;
    },

    0x42: function(s) {
      s.cpu.intst.setRegFromReg(s, 'b', 'd');
      s.cpu.addCycles(s, 5);
      return arguments.callee.length;
    },

    0x43: function(s) {
      s.cpu.intst.setRegFromReg(s, 'b', 'e');
      s.cpu.addCycles(s, 5);
      return arguments.callee.length;
    },

    0x44: function(s) {
      s.cpu.intst.setRegFromReg(s, 'b', 'h');
      s.cpu.addCycles(s, 5);
      return arguments.callee.length;
    },

    0x45: function(s) {
      s.cpu.intst.setRegFromReg(s, 'b', 'l');
      s.cpu.addCycles(s, 5);
      return arguments.callee.length;
    },

    0x46: function(s, idxReg = 'hl') {
      s.cpu.intst.setRegFromMem(s, 'b', s.cpu.getRegister(s, idxReg));
      s.cpu.addCycles(s, 7);
      return arguments.callee.length;
    },

    0x47: function(s) {
      s.cpu.intst.setRegFromReg(s, 'b', 'a');
      s.cpu.addCycles(s, 5);
      return arguments.callee.length;
    },

    0x48: function(s) {
      s.cpu.intst.setRegFromReg(s, 'c', 'b');
      s.cpu.addCycles(s, 5);
      return arguments.callee.length;
    },

    0x49: function(s) {
      s.cpu.intst.setRegFromReg(s, 'c', 'c');
      s.cpu.addCycles(s, 5);
      return arguments.callee.length;
    },

    0x4a: function(s) {
      s.cpu.intst.setRegFromReg(s, 'c', 'd');
      s.cpu.addCycles(s, 5);
      return arguments.callee.length;
    },

    0x4b: function(s) {
      s.cpu.intst.setRegFromReg(s, 'c', 'e');
      s.cpu.addCycles(s, 5);
      return arguments.callee.length;
    },

    0x4c: function(s) {
      s.cpu.intst.setRegFromReg(s, 'c', 'h');
      s.cpu.addCycles(s, 5);
      return arguments.callee.length;
    },

    0x4d: function(s) {
      s.cpu.intst.setRegFromReg(s, 'c', 'l');
      s.cpu.addCycles(s, 5);
      return arguments.callee.length;
    },

    0x4e: function(s, idxReg = 'hl') {
      s.cpu.intst.setRegFromMem(s, 'c', s.cpu.getRegister(s, idxReg));
      s.cpu.addCycles(s, 7);
      return arguments.callee.length;
    }























  };

  return decRet;
});
