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
      return arguments.callee.length - 1;
    },

    0x35: function(s, idxReg = 'hl') {
      s.cpu.intst.deIncMemByte(s, s.cpu.getRegister(s, idxReg), -1);
      s.cpu.addCycles(s, 10);
      return arguments.callee.length - 1;
    },

    0x36: function(s, p1, idxReg = 'hl') {
      s.cpu.intst.setMemByte(s, s.cpu.getRegister(s, idxReg), p1);
      s.cpu.addCycles(s, 10);
      return arguments.callee.length - 1;
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
      return arguments.callee.length - 1;
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
      return arguments.callee.length - 1;
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
      return arguments.callee.length - 1;
    },

    0x4f: function(s) {
      s.cpu.intst.setRegFromReg(s, 'c', 'a');
      s.cpu.addCycles(s, 5);
      return arguments.callee.length;
    },

    0x50: function(s) {
      s.cpu.intst.setRegFromReg(s, 'd', 'b');
      s.cpu.addCycles(s, 5);
      return arguments.callee.length;
    },

    0x51: function(s) {
      s.cpu.intst.setRegFromReg(s, 'd', 'c');
      s.cpu.addCycles(s, 5);
      return arguments.callee.length;
    },

    0x52: function(s) {
      s.cpu.intst.setRegFromReg(s, 'd', 'd');
      s.cpu.addCycles(s, 5);
      return arguments.callee.length;
    },

    0x53: function(s) {
      s.cpu.intst.setRegFromReg(s, 'd', 'e');
      s.cpu.addCycles(s, 5);
      return arguments.callee.length;
    },

    0x54: function(s) {
      s.cpu.intst.setRegFromReg(s, 'd', 'h');
      s.cpu.addCycles(s, 5);
      return arguments.callee.length;
    },

    0x55: function(s) {
      s.cpu.intst.setRegFromReg(s, 'd', 'l');
      s.cpu.addCycles(s, 5);
      return arguments.callee.length;
    },

    0x56: function(s, idxReg = 'hl') {
      s.cpu.intst.setRegFromMem(s, 'd', s.cpu.getRegister(s, idxReg));
      s.cpu.addCycles(s, 7);
      return arguments.callee.length - 1;
    },

    0x57: function(s) {
      s.cpu.intst.setRegFromReg(s, 'd', 'a');
      s.cpu.addCycles(s, 5);
      return arguments.callee.length;
    },

    0x58: function(s) {
      s.cpu.intst.setRegFromReg(s, 'e', 'b');
      s.cpu.addCycles(s, 5);
      return arguments.callee.length;
    },

    0x59: function(s) {
      s.cpu.intst.setRegFromReg(s, 'e', 'c');
      s.cpu.addCycles(s, 5);
      return arguments.callee.length;
    },

    0x5a: function(s) {
      s.cpu.intst.setRegFromReg(s, 'e', 'd');
      s.cpu.addCycles(s, 5);
      return arguments.callee.length;
    },

    0x5b: function(s) {
      s.cpu.intst.setRegFromReg(s, 'e', 'e');
      s.cpu.addCycles(s, 5);
      return arguments.callee.length;
    },

    0x5c: function(s) {
      s.cpu.intst.setRegFromReg(s, 'e', 'h');
      s.cpu.addCycles(s, 5);
      return arguments.callee.length;
    },

    0x5d: function(s) {
      s.cpu.intst.setRegFromReg(s, 'e', 'l');
      s.cpu.addCycles(s, 5);
      return arguments.callee.length;
    },

    0x5e: function(s, idxReg = 'hl') {
      s.cpu.intst.setRegFromMem(s, 'e', s.cpu.getRegister(s, idxReg));
      s.cpu.addCycles(s, 7);
      return arguments.callee.length - 1;
    },

    0x5f: function(s) {
      s.cpu.intst.setRegFromReg(s, 'e', 'a');
      s.cpu.addCycles(s, 5);
      return arguments.callee.length;
    },

    0x60: function(s) {
      s.cpu.intst.setRegFromReg(s, 'h', 'b');
      s.cpu.addCycles(s, 5);
      return arguments.callee.length;
    },

    0x61: function(s) {
      s.cpu.intst.setRegFromReg(s, 'h', 'c');
      s.cpu.addCycles(s, 5);
      return arguments.callee.length;
    },

    0x62: function(s) {
      s.cpu.intst.setRegFromReg(s, 'h', 'd');
      s.cpu.addCycles(s, 5);
      return arguments.callee.length;
    },

    0x63: function(s) {
      s.cpu.intst.setRegFromReg(s, 'h', 'e');
      s.cpu.addCycles(s, 5);
      return arguments.callee.length;
    },

    0x64: function(s) {
      s.cpu.intst.setRegFromReg(s, 'h', 'h');
      s.cpu.addCycles(s, 5);
      return arguments.callee.length;
    },

    0x65: function(s) {
      s.cpu.intst.setRegFromReg(s, 'h', 'l');
      s.cpu.addCycles(s, 5);
      return arguments.callee.length;
    },

    0x66: function(s, idxReg = 'hl') {
      s.cpu.intst.setRegFromMem(s, 'h', s.cpu.getRegister(s, idxReg));
      s.cpu.addCycles(s, 7);
      return arguments.callee.length - 1;
    },

    0x67: function(s) {
      s.cpu.intst.setRegFromReg(s, 'h', 'a');
      s.cpu.addCycles(s, 5);
      return arguments.callee.length;
    },

    0x68: function(s) {
      s.cpu.intst.setRegFromReg(s, 'l', 'b');
      s.cpu.addCycles(s, 5);
      return arguments.callee.length;
    },

    0x69: function(s) {
      s.cpu.intst.setRegFromReg(s, 'l', 'c');
      s.cpu.addCycles(s, 5);
      return arguments.callee.length;
    },

    0x6a: function(s) {
      s.cpu.intst.setRegFromReg(s, 'l', 'd');
      s.cpu.addCycles(s, 5);
      return arguments.callee.length;
    },

    0x6b: function(s) {
      s.cpu.intst.setRegFromReg(s, 'l', 'e');
      s.cpu.addCycles(s, 5);
      return arguments.callee.length;
    },

    0x6c: function(s) {
      s.cpu.intst.setRegFromReg(s, 'l', 'h');
      s.cpu.addCycles(s, 5);
      return arguments.callee.length;
    },

    0x6d: function(s) {
      s.cpu.intst.setRegFromReg(s, 'l', 'l');
      s.cpu.addCycles(s, 5);
      return arguments.callee.length;
    },

    0x6e: function(s, idxReg = 'hl') {
      s.cpu.intst.setRegFromMem(s, 'e', s.cpu.getRegister(s, idxReg));
      s.cpu.addCycles(s, 7);
      return arguments.callee.length - 1;
    },

    0x6f: function(s) {
      s.cpu.intst.setRegFromReg(s, 'l', 'a');
      s.cpu.addCycles(s, 5);
      return arguments.callee.length;
    },

    0x70: function(s, idxReg = 'hl') {
      s.cpu.intst.setMemByte(s, idxReg, s.cpu.getRegister(s, 'b'));
      s.cpu.addCycles(s, 7);
      return arguments.callee.length - 1;
    },

    0x71: function(s, idxReg = 'hl') {
      s.cpu.intst.setMemByte(s, idxReg, s.cpu.getRegister(s, 'c'));
      s.cpu.addCycles(s, 7);
      return arguments.callee.length - 1;
    },

    0x72: function(s, idxReg = 'hl') {
      s.cpu.intst.setMemByte(s, idxReg, s.cpu.getRegister(s, 'd'));
      s.cpu.addCycles(s, 7);
      return arguments.callee.length - 1;
    },

    0x73: function(s, idxReg = 'hl') {
      s.cpu.intst.setMemByte(s, idxReg, s.cpu.getRegister(s, 'e'));
      s.cpu.addCycles(s, 7);
      return arguments.callee.length - 1;
    },

    0x74: function(s, idxReg = 'hl') {
      s.cpu.intst.setMemByte(s, idxReg, s.cpu.getRegister(s, 'h'));
      s.cpu.addCycles(s, 7);
      return arguments.callee.length - 1;
    },

    0x75: function(s, idxReg = 'hl') {
      s.cpu.intst.setMemByte(s, idxReg, s.cpu.getRegister(s, 'l'));
      s.cpu.addCycles(s, 7);
      return arguments.callee.length - 1;
    },

    0x76: function(s) {
      // STOP
      s.cpu.pins.hlt = true;
    },

    0x77: function(s, idxReg = 'hl') {
      s.cpu.intst.setMemByte(s, idxReg, s.cpu.getRegister(s, 'a'));
      s.cpu.addCycles(s, 7);
      return arguments.callee.length - 1;
    },

    0x78: function(s) {
      s.cpu.intst.setRegFromReg(s, 'a', 'b');
      s.cpu.addCycles(s, 5);
      return arguments.callee.length;
    },

    0x79: function(s) {
      s.cpu.intst.setRegFromReg(s, 'a', 'c');
      s.cpu.addCycles(s, 5);
      return arguments.callee.length;
    },

    0x7a: function(s) {
      s.cpu.intst.setRegFromReg(s, 'a', 'd');
      s.cpu.addCycles(s, 5);
      return arguments.callee.length;
    },

    0x7b: function(s) {
      s.cpu.intst.setRegFromReg(s, 'a', 'e');
      s.cpu.addCycles(s, 5);
      return arguments.callee.length;
    },

    0x7c: function(s) {
      s.cpu.intst.setRegFromReg(s, 'a', 'h');
      s.cpu.addCycles(s, 5);
      return arguments.callee.length;
    },

    0x7d: function(s) {
      s.cpu.intst.setRegFromReg(s, 'a', 'l');
      s.cpu.addCycles(s, 5);
      return arguments.callee.length;
    },

    0x7e: function(s, idxReg = 'hl') {
      s.cpu.intst.setRegFromMem(s, 'a', s.cpu.getRegister(s, idxReg));
      s.cpu.addCycles(s, 7);
      return arguments.callee.length - 1;
    },

    0x7f: function(s) {
      s.cpu.intst.setRegFromReg(s, 'a', 'a');
      s.cpu.addCycles(s, 5);
      return arguments.callee.length;
    },

    0x80: function(s) {
      s.cpu.intst.deIncRegFromReg(s, 'a', 'b');
      s.cpu.addCycles(s, 4);
      return arguments.callee.length;
    },

    0x81: function(s) {
      s.cpu.intst.deIncRegFromReg(s, 'a', 'c');
      s.cpu.addCycles(s, 4);
      return arguments.callee.length;
    },

    0x82: function(s) {
      s.cpu.intst.deIncRegFromReg(s, 'a', 'd');
      s.cpu.addCycles(s, 4);
      return arguments.callee.length;
    },

    0x83: function(s) {
      s.cpu.intst.deIncRegFromReg(s, 'a', 'e');
      s.cpu.addCycles(s, 4);
      return arguments.callee.length;
    },

    0x84: function(s) {
      s.cpu.intst.deIncRegFromReg(s, 'a', 'h');
      s.cpu.addCycles(s, 4);
      return arguments.callee.length;
    },

    0x85: function(s) {
      s.cpu.intst.deIncRegFromReg(s, 'a', 'l');
      s.cpu.addCycles(s, 4);
      return arguments.callee.length;
    },

    0x86: function(s, idxReg = 'hl') {
      s.cpu.intst.deIncRegFromMem(s, 'a', s.cpu.getRegister(s, idxReg));
      s.cpu.addCycles(s, 5);
      return arguments.callee.length - 1;
    },

    0x87: function(s) {
      s.cpu.intst.deIncRegFromReg(s, 'a', 'a');
      s.cpu.addCycles(s, 4);
      return arguments.callee.length;
    },

    0x88: function(s) {
      s.cpu.intst.deIncRegFromRegWithCarry(s, 'a', 'b');
      s.cpu.addCycles(s, 4);
      return arguments.callee.length;
    },

    0x89: function(s) {
      s.cpu.intst.deIncRegFromRegWithCarry(s, 'a', 'c');
      s.cpu.addCycles(s, 4);
      return arguments.callee.length;
    },

    0x8a: function(s) {
      s.cpu.intst.deIncRegFromRegWithCarry(s, 'a', 'd');
      s.cpu.addCycles(s, 4);
      return arguments.callee.length;
    },

    0x8b: function(s) {
      s.cpu.intst.deIncRegFromRegWithCarry(s, 'a', 'e');
      s.cpu.addCycles(s, 4);
      return arguments.callee.length;
    },

    0x8c: function(s) {
      s.cpu.intst.deIncRegFromRegWithCarry(s, 'a', 'h');
      s.cpu.addCycles(s, 4);
      return arguments.callee.length;
    },

    0x8d: function(s) {
      s.cpu.intst.deIncRegFromRegWithCarry(s, 'a', 'l');
      s.cpu.addCycles(s, 4);
      return arguments.callee.length;
    },

    0x8e: function(s, idxReg = 'hl') {
      s.cpu.intst.deIncRegFromMemWithCarry(s, 'a', s.cpu.getRegister(s, idxReg));
      s.cpu.addCycles(s, 5);
      return arguments.callee.length - 1;
    },

    0x8f: function(s) {
      s.cpu.intst.deIncRegFromRegWithCarry(s, 'a', 'a');
      s.cpu.addCycles(s, 4);
      return arguments.callee.length;
    },

    0x90: function(s) {
      s.cpu.intst.deIncRegFromReg(s, 'a', 'b', -1);
      s.cpu.addCycles(s, 4);
      return arguments.callee.length;
    },

    0x91: function(s) {
      s.cpu.intst.deIncRegFromReg(s, 'a', 'c', -1);
      s.cpu.addCycles(s, 4);
      return arguments.callee.length;
    },

    0x92: function(s) {
      s.cpu.intst.deIncRegFromReg(s, 'a', 'd', -1);
      s.cpu.addCycles(s, 4);
      return arguments.callee.length;
    },

    0x93: function(s) {
      s.cpu.intst.deIncRegFromReg(s, 'a', 'e', -1);
      s.cpu.addCycles(s, 4);
      return arguments.callee.length;
    },

    0x94: function(s) {
      s.cpu.intst.deIncRegFromReg(s, 'a', 'h', -1);
      s.cpu.addCycles(s, 4);
      return arguments.callee.length;
    },

    0x95: function(s) {
      s.cpu.intst.deIncRegFromReg(s, 'a', 'l', -1);
      s.cpu.addCycles(s, 4);
      return arguments.callee.length;
    },

    0x96: function(s, idxReg = 'hl') {
      s.cpu.intst.deIncRegFromMem(s, 'a', s.cpu.getRegister(s, idxReg), -1);
      s.cpu.addCycles(s, 5);
      return arguments.callee.length - 1;
    },

    0x97: function(s) {
      s.cpu.intst.deIncRegFromReg(s, 'a', 'a', -1);
      s.cpu.addCycles(s, 4);
      return arguments.callee.length;
    },

    0x98: function(s) {
      s.cpu.intst.deIncRegFromRegWithCarry(s, 'a', 'b', -1);
      s.cpu.addCycles(s, 4);
      return arguments.callee.length;
    },

    0x99: function(s) {
      s.cpu.intst.deIncRegFromRegWithCarry(s, 'a', 'c', -1);
      s.cpu.addCycles(s, 4);
      return arguments.callee.length;
    },

    0x9a: function(s) {
      s.cpu.intst.deIncRegFromRegWithCarry(s, 'a', 'd', -1);
      s.cpu.addCycles(s, 4);
      return arguments.callee.length;
    },

    0x9b: function(s) {
      s.cpu.intst.deIncRegFromRegWithCarry(s, 'a', 'e', -1);
      s.cpu.addCycles(s, 4);
      return arguments.callee.length;
    },

    0x9c: function(s) {
      s.cpu.intst.deIncRegFromRegWithCarry(s, 'a', 'h', -1);
      s.cpu.addCycles(s, 4);
      return arguments.callee.length;
    },

    0x9d: function(s) {
      s.cpu.intst.deIncRegFromRegWithCarry(s, 'a', 'l', -1);
      s.cpu.addCycles(s, 4);
      return arguments.callee.length;
    },

    0x8e: function(s, idxReg = 'hl') {
      s.cpu.intst.deIncRegFromMemWithCarry(s, 'a', s.cpu.getRegister(s, idxReg), -1);
      s.cpu.addCycles(s, 5);
      return arguments.callee.length - 1;
    },

    0x9f: function(s) {
      s.cpu.intst.deIncRegFromRegWithCarry(s, 'a', 'l', -1);
      s.cpu.addCycles(s, 4);
      return arguments.callee.length;
    },

    0xa0: function(s) {
      s.cpu.intst.operandRegWithReg(s, 'a', 'b', '&');
      s.cpu.addCycles(s, 4);
      return arguments.callee.length;
    },

    0xa1: function(s) {
      s.cpu.intst.operandRegWithReg(s, 'a', 'c', '&');
      s.cpu.addCycles(s, 4);
      return arguments.callee.length;
    },

    0xa2: function(s) {
      s.cpu.intst.operandRegWithReg(s, 'a', 'd', '&');
      s.cpu.addCycles(s, 4);
      return arguments.callee.length;
    },

    0xa3: function(s) {
      s.cpu.intst.operandRegWithReg(s, 'a', 'e', '&');
      s.cpu.addCycles(s, 4);
      return arguments.callee.length;
    },

    0xa4: function(s) {
      s.cpu.intst.operandRegWithReg(s, 'a', 'h', '&');
      s.cpu.addCycles(s, 4);
      return arguments.callee.length;
    },

    0xa5: function(s) {
      s.cpu.intst.operandRegWithReg(s, 'a', 'l', '&');
      s.cpu.addCycles(s, 4);
      return arguments.callee.length;
    },

    0xa6: function(s, idxReg = 'hl') {
      s.cpu.intst.operandRegWithAddress(s, 'a', s.cpu.getRegister(s, idxReg), '&');
      s.cpu.addCycles(s, 7);
      return arguments.callee.length - 1;
    },

    0xa7: function(s) {
      s.cpu.intst.operandRegWithReg(s, 'a', 'a', '&');
      s.cpu.addCycles(s, 4);
      return arguments.callee.length;
    },

    0xa8: function(s) {
      s.cpu.intst.operandRegWithReg(s, 'a', 'b', '^');
      s.cpu.addCycles(s, 4);
      return arguments.callee.length;
    },

    0xa9: function(s) {
      s.cpu.intst.operandRegWithReg(s, 'a', 'c', '^');
      s.cpu.addCycles(s, 4);
      return arguments.callee.length;
    },

    0xaa: function(s) {
      s.cpu.intst.operandRegWithReg(s, 'a', 'd', '^');
      s.cpu.addCycles(s, 4);
      return arguments.callee.length;
    },

    0xab: function(s) {
      s.cpu.intst.operandRegWithReg(s, 'a', 'e', '^');
      s.cpu.addCycles(s, 4);
      return arguments.callee.length;
    },

    0xac: function(s) {
      s.cpu.intst.operandRegWithReg(s, 'a', 'h', '^');
      s.cpu.addCycles(s, 4);
      return arguments.callee.length;
    },

    0xad: function(s) {
      s.cpu.intst.operandRegWithReg(s, 'a', 'l', '^');
      s.cpu.addCycles(s, 4);
      return arguments.callee.length;
    },

    0xae: function(s, idxReg = 'hl') {
      s.cpu.intst.operandRegWithAddress(s, 'a', s.cpu.getRegister(s, idxReg), '^');
      s.cpu.addCycles(s, 7);
      return arguments.callee.length - 1;
    },

    0xaf: function(s) {
      s.cpu.intst.operandRegWithReg(s, 'a', 'a', '^');
      s.cpu.addCycles(s, 4);
      return arguments.callee.length;
    },

    0xb0: function(s) {
      s.cpu.intst.operandRegWithReg(s, 'a', 'b', '|');
      s.cpu.addCycles(s, 4);
      return arguments.callee.length;
    },

    0xb1: function(s) {
      s.cpu.intst.operandRegWithReg(s, 'a', 'c', '|');
      s.cpu.addCycles(s, 4);
      return arguments.callee.length;
    },

    0xb2: function(s) {
      s.cpu.intst.operandRegWithReg(s, 'a', 'd', '|');
      s.cpu.addCycles(s, 4);
      return arguments.callee.length;
    },

    0xb3: function(s) {
      s.cpu.intst.operandRegWithReg(s, 'a', 'e', '|');
      s.cpu.addCycles(s, 4);
      return arguments.callee.length;
    },

    0xb4: function(s) {
      s.cpu.intst.operandRegWithReg(s, 'a', 'h', '|');
      s.cpu.addCycles(s, 4);
      return arguments.callee.length;
    },

    0xb5: function(s) {
      s.cpu.intst.operandRegWithReg(s, 'a', 'l', '|');
      s.cpu.addCycles(s, 4);
      return arguments.callee.length;
    },

    0xb6: function(s, idxReg = 'hl') {
      s.cpu.intst.operandRegWithAddress(s, 'a', s.cpu.getRegister(s, idxReg), '|');
      s.cpu.addCycles(s, 7);
      return arguments.callee.length - 1;
    },

    0xb7: function(s) {
      s.cpu.intst.operandRegWithReg(s, 'a', 'a', '|');
      s.cpu.addCycles(s, 4);
      return arguments.callee.length;
    },

    0xb8: function(s) {
      s.cpu.intst.deIncFromReg(s, 'a', 'b', -1);
      s.cpu.addCycles(s, 4);
      return arguments.callee.length;
    },

    0xb9: function(s) {
      s.cpu.intst.deIncFromReg(s, 'a', 'c', -1);
      s.cpu.addCycles(s, 4);
      return arguments.callee.length;
    },

    0xba: function(s) {
      s.cpu.intst.deIncFromReg(s, 'a', 'd', -1);
      s.cpu.addCycles(s, 4);
      return arguments.callee.length;
    },

    0xbb: function(s) {
      s.cpu.intst.deIncFromReg(s, 'a', 'e', -1);
      s.cpu.addCycles(s, 4);
      return arguments.callee.length;
    },

    0xbc: function(s) {
      s.cpu.intst.deIncFromReg(s, 'a', 'h', -1);
      s.cpu.addCycles(s, 4);
      return arguments.callee.length;
    },

    0xbd: function(s) {
      s.cpu.intst.deIncFromReg(s, 'a', 'l', -1);
      s.cpu.addCycles(s, 4);
      return arguments.callee.length;
    },

    0xbe: function(s, idxReg = 'hl') {
      s.cpu.intst.deIncFromRegAndMem(s, 'a', s.cpu.getRegister(s, idxReg), -1);
      s.cpu.addCycles(s, 4);
      return arguments.callee.length - 1;
    },

    0xbf: function(s) {
      s.cpu.intst.deIncFromReg(s, 'a', 'a', -1);
      s.cpu.addCycles(s, 4);
      return arguments.callee.length;
    },

    0xc0: function(s) {
      var pcPop = s.cpu.intst.pop(s, 'NZ');
      s.cpu.setRegister(s, 'pc', pcPop);
      s.cpu.addCycles(s, pcPop ? 5 : 11);
      return arguments.callee.length;
    },

    0xc1: function(s) {
      s.cpu.setRegister(s, 'bc', s.cpu.intst.pop(s));
      s.cpu.addCycles(s, 10);
      return arguments.callee.length;
    },

    0xc2: function(s, p1, p2) {
      var pcJump = s.cpu.intst.jump(s, s.utils.combineBytes(p1, p2), 'NZ');
      s.cpu.setRegister(s, 'pc', pcJump);
      s.cpu.addCycles(s, pcJump ? 10 : 15);
      return arguments.callee.length;
    },

    0xc3: function(s, p1, p2) {
      s.cpu.setRegister(s, 'pc', s.cpu.intst.jump(s, s.utils.combineBytes(p1, p2)));
      s.cpu.addCycles(s, 10);
      return arguments.callee.length;
    },

    0xc4: function(s, p1, p2) {
      var pcPush = s.cpu.intst.push(s, s.utils.combineBytes(p1, p2), 'NZ');
      s.cpu.addCycles(s, pcPush ? 18 : 11);
      return arguments.callee.length;
    },

    0xc5: function(s) {
      s.cpu.intst.push(s, s.cpu.getRegister(s, 'bc'));
      s.cpu.addCycles(s, 11);
      return arguments.callee.length;
    },
    
    0xc6: function(s, p1) {
      s.cpu.intst.deIncFromRegAndParam(s, 'a', p1);
      s.cpu.addCycles(s, 7);
      return arguments.callee.length;
    },
    
    0xc7: function(s) {
      s.cpu.intst.reset(s, 0);
      s.cpu.addCycles(s, 11);
      return arguments.callee.length;
    },

    0xc8: function(s) {
      var pcPop = s.cpu.intst.pop(s, 'Z');
      s.cpu.setRegister(s, 'pc', pcPop);
      s.cpu.addCycles(s, pcPop ? 11 : 5);
      return arguments.callee.length;
    },

    0xc9: function(s) {
      var pcPop = s.cpu.intst.pop(s);
      s.cpu.setRegister(s, 'pc', pcPop);
      s.cpu.addCycles(s, 10);
      return arguments.callee.length;
    },

    0xca: function(s, p1, p2) {
      var pcJump = s.cpu.intst.jump(s, s.utils.combineBytes(p1, p2), 'Z');
      s.cpu.setRegister(s, 'pc', pcJump);
      s.cpu.addCycles(s, pcJump ? 10 : 15);
      return arguments.callee.length;
    },

    0xcb: function(s) {
      s.cpu.intst.nop(s);
      return arguments.callee.length;
    },

    0xcc: function(s, p1, p2) {
      var pcCall = s.cpu.intst.call(s, 'Z');
      s.cpu.setRegister(s, 'pc', s.utils.combineBytes(p1, p2));
      s.cpu.addCycles(s, pcCall ? 18 : 11);
      return arguments.callee.length;
    },

    0xcd: function(s, p1, p2) {
      s.cpu.intst.call(s);
      s.cpu.setRegister(s, 'pc', s.utils.combineBytes(p1, p2));
      return arguments.callee.length;
    },

    0xce: function(s, p1) {
      s.cpu.intst.deIncFromRegAndParamWithCarry(s, 'a', p1);
      s.cpu.addCycles(s, 4);
      return arguments.callee.length;
    },
    
    0xcf: function(s) {
      s.cpu.intst.reset(s, 0x08 * 8);
      s.cpu.addCycles(s, 11);
      return arguments.callee.length;
    },

    0xd0: function(s) {
      var pcPop = s.cpu.intst.pop(s, 'NC');
      s.cpu.setRegister(s, 'pc', pcPop);
      s.cpu.addCycles(s, pcPop ? 5 : 11);
      return arguments.callee.length;
    },

    0xd1: function(s) {
      s.cpu.setRegister(s, 'de', s.cpu.intst.pop(s));
      s.cpu.addCycles(s, 10);
      return arguments.callee.length;
    },

    0xd2: function(s, p1, p2) {
      var pcJump = s.cpu.intst.jump(s, s.utils.combineBytes(p1, p2), 'NC');
      s.cpu.setRegister(s, 'pc', pcJump);
      s.cpu.addCycles(s, pcJump ? 10 : 15);
      return arguments.callee.length;
    },

    0xd3: function(s, p1) {
      s.cpu.hwio.writePort(s, p1, s.cpu.getRegister(s, 'a');
      s.cpu.addCycles(s, 10);
      return arguments.callee.length;
    },

    0xd4: function(s, p1, p2) {
      var pcCall = s.cpu.intst.call(s, 'NZ');
      s.cpu.setRegister(s, 'pc', s.utils.combineBytes(p1, p2));
      s.cpu.addCycles(s, pcCall ? 18 : 11);
      return arguments.callee.length;
    },

    0xd5: function(s) {
      s.cpu.intst.push(s, s.cpu.getRegister(s, 'de'));
      s.cpu.addCycles(s, 11);
      return arguments.callee.length;
    },

    0xd6: function(s, p1) {
      s.cpu.intst.deIncFromRegAndParamWithCarry(s, 'a', p1, -1);
      s.cpu.addCycles(s, 7);
      return arguments.callee.length;
    },
    
    0xd7: function(s) {
      s.cpu.intst.reset(s, 0x10 * 8);
      s.cpu.addCycles(s, 11);
      return arguments.callee.length;
    },

    0xd8: function(s) {
      var pcPop = s.cpu.intst.pop(s, 'C');
      s.cpu.setRegister(s, 'pc', pcPop);
      s.cpu.addCycles(s, pcPop ? 11 : 5);
      return arguments.callee.length;
    },

    0xd9: function(s) {
      s.cpu.intst.nop(s);
      return arguments.callee.length;
    },

    0xda: function(s, p1, p2) {
      var pcJump = s.cpu.intst.jump(s, s.utils.combineBytes(p1, p2), 'C');
      s.cpu.setRegister(s, 'pc', pcJump);
      s.cpu.addCycles(s, pcJump ? 10 : 15);
      return arguments.callee.length;
    },

    0xdb: function(s, p1) {
    s.cpu.setRegister(s, 'a', s.cpu.hwio.readPort(s, p1));
    s.cpu.addCycles(s, 10);
    return arguments.callee.length;
    },

    0xdc: function(s, p1, p2) {
      var pcCall = s.cpu.intst.call(s, 'C');
      s.cpu.setRegister(s, 'pc', s.utils.combineBytes(p1, p2));
      s.cpu.addCycles(s, pcCall ? 18 : 10);
      return arguments.callee.length;
    },

    0xdd: function(s, op, p1, p2) {
      // NEXTOP IX
      if (decRet.indexRegOpParams[op] === 1) {
        return decRet.decode[op](s, 'IX');
      } else if (decRet.indexRegOpParams[op] === 2) {
        return decRet.decode[op](s, p1, 'IX');
      } else if (decRet.indexRegOpParams[op] === 3) {
        return decRet.decode[op](s, p1, p2, 'IX');
      }
      throw new Error("[DECODER::0xdd()]: Unknown parameter for index register IX:", op, emuState);
    },

    0xde: function(s, p1) {
      s.cpu.intst.deIncFromRegAndParamWithCarry(s, 'a', p1, -1);
      s.cpu.addCycles(s, 4);
      return arguments.callee.length;
    },
    
    0xdf: function(s) {
      s.cpu.intst.reset(s, 0x18 * 8);
      s.cpu.addCycles(s, 11);
      return arguments.callee.length;
    },

    0xe0: function(s) {
      var pcPop = s.cpu.intst.pop(s, 'NP');
      s.cpu.setRegister(s, 'pc', pcPop);
      s.cpu.addCycles(s, pcPop ? 5 : 11);
      return arguments.callee.length;
    },

    0xe1: function(s, idxReg = 'hl') {
      s.cpu.setRegister(s, idxReg, s.cpu.intst.pop(s));
      s.cpu.addCycles(s, 10);
      return arguments.callee.length - 1;
    },

    0xe2: function(s, p1, p2) {
      var pcJump = s.cpu.intst.jump(s, s.utils.combineBytes(p1, p2), 'NP');
      s.cpu.setRegister(s, 'pc', pcJump);
      s.cpu.addCycles(s, pcJump ? 10 : 15);
      return arguments.callee.length;
    },

    0xe3: function(s, idxReg = 'hl') {
      s.cpu.intst.xchm(s, idxReg);
      return arguments.callee.length - 1;
    },

    0xe4: function(s, p1, p2) {
      var pcCall = s.cpu.intst.call(s, 'NP');
      s.cpu.setRegister(s, 'pc', s.utils.combineBytes(p1, p2));
      s.cpu.addCycles(s, pcCall ? 18 : 11);
      return arguments.callee.length;
    },

    0xe5: function(s, idxReg = 'hl') {
      s.cpu.intst.push(s, s.cpu.getRegister(s, idxReg));
      s.cpu.addCycles(s, 11);
      return arguments.callee.length - 1;
    },

    0xe6: function(s, p1) {
      s.cpu.intst.operandRegWithParam(s, 'a', p1, '&');
      s.cpu.addCycles(s, 7);
      return arguments.callee.length;
    },
    
    0xe7: function(s) {
      s.cpu.intst.reset(s, 0x20 * 8);
      s.cpu.addCycles(s, 11);
      return arguments.callee.length;
    },

    0xe8: function(s) {
      var pcPop = s.cpu.intst.pop(s, 'P');
      s.cpu.setRegister(s, 'pc', pcPop);
      s.cpu.addCycles(s, pcPop ? 11 : 5);
      return arguments.callee.length;
    },

    0xe9: function(s, idxReg = 'hl') {
      var pcJump = s.cpu.intst.jump(s, s.cpu.getRegister(s, idxReg));
      s.cpu.setRegister(s, 'pc', pcJump);
      s.cpu.addCycles(s, 4);
      return arguments.callee.length - 1;
    },

    0xea: function(s, p1, p2) {
      var pcJump = s.cpu.intst.jump(s, s.utils.combineBytes(p1, p2), 'P');
      s.cpu.setRegister(s, 'pc', pcJump);
      s.cpu.addCycles(s, pcJump ? 10 : 15);
      return arguments.callee.length;
    },

    0xeb: function(s, idxReg = 'hl') {
      var tmp = s.cpu.getRegister(s, idxReg);
      s.cpu.setRegister(s, idxReg, s.cpu.getRegister(s, 'de'));
      s.cpu.setRegister(s, 'de', tmp);
      s.cpu.addCycles(s, 4);
      return arguments.callee.length - 1;
    },

    0xec: function(s) {
      var pcCall = s.cpu.intst.call(s, 'P');
      s.cpu.setRegister(s, 'pc', s.utils.combineBytes(p1, p2));
      s.cpu.addCycles(s, pcCall ? 18 : 10);
      return arguments.callee.length;
    },

    0xed: function(s) {
      s.cpu.intst.nop(s);
      return arguments.callee.length;
    },

    0xee: function(s, p1) {
      s.cpu.intst.operandRegWithParam(s, 'a', p1, '^');
      s.cpu.addCycles(s, 7);
      return arguments.callee.length;
    },

    0xef: function(s) {
      s.cpu.intst.reset(s, 0x28 * 8);
      s.cpu.addCycles(s, 11);
      return arguments.callee.length;
    },

    0xf0: function(s) {
      var pcPop = s.cpu.intst.pop(s, 'NS');
      s.cpu.setRegister(s, 'pc', pcPop);
      s.cpu.addCycles(s, pcPop ? 5 : 11);
      return arguments.callee.length;
    },

    0xf1: function(s) {
      s.cpu.setRegister(s, 'af', s.cpu.intst.pop(s));
      s.cpu.addCycles(s, 10);
      return arguments.callee.length;
    },

    0xf2: function(s, p1, p2) {
      var pcJump = s.cpu.intst.jump(s, s.utils.combineBytes(p1, p2), 'NS');
      s.cpu.setRegister(s, 'pc', pcJump);
      s.cpu.addCycles(s, pcJump ? 10 : 15);
      return arguments.callee.length;
    },

    0xf3: function(s) {
      s.cpu.intst.intrpt(s, 0);
      s.cpu.addCycles(s, 4);
      return arguments.callee.length;
    },

    0xf4: function(s, p1, p2) {
      var pcCall = s.cpu.intst.call(s, 'S');
      s.cpu.setRegister(s, 'pc', s.utils.combineBytes(p1, p2));
      s.cpu.addCycles(s, pcCall ? 18 : 11);
      return arguments.callee.length;
    },

    0xf5: function(s) {
      s.cpu.intst.push(s, s.cpu.getRegister(s, 'af'));
      s.cpu.addCycles(s, 11);
      return arguments.callee.length;
    },

    0xf6: function(s, p1) {
      s.cpu.intst.operandRegWithParam(s, 'a', p1, '|');
      s.cpu.addCycles(s, 7);
      return arguments.callee.length;
    },

    0xf7: function(s) {
      s.cpu.intst.reset(s, 0x30 * 8);
      s.cpu.addCycles(s, 11);
      return arguments.callee.length;
    },

    0xf8: function(s) {
      var pcPop = s.cpu.intst.pop(s, 'S');
      s.cpu.setRegister(s, 'pc', pcPop);
      s.cpu.addCycles(s, pcPop ? 11 : 5);
      return arguments.callee.length;
    },

    0xf9: function(s, idxReg = 'hl') {
      s.cpu.setRegister(s, 'sp', s.cpu.getRegister(s, idxReg));
      s.cpu.addCycles(s, 6);
      return arguments.callee.length - 1;
    },

    0xfa: function(s, p1, p2) {
      var pcJump = s.cpu.intst.jump(s, s.cpu.getRegister(s, s.utils.combineBytes(p1, p2), 'S'));
      s.cpu.setRegister(s, 'pc', pcJump);
      s.cpu.addCycles(s, pcJump ? 15 : 10);
      return arguments.callee.length;
    },

    0xfb: function(s) {
      s.cpu.intst.intrpt(s, 1);
      s.cpu.addCycles(s, 4);
      return arguments.callee.length;
    },

    0xfc: function(s) {
      var pcCall = s.cpu.intst.call(s, 'S');
      s.cpu.setRegister(s, 'pc', s.utils.combineBytes(p1, p2));
      s.cpu.addCycles(s, pcCall ? 18 : 10);
      return arguments.callee.length;
    },

    0xfd: function(s, op, p1, p2) {
      // NEXTOP IY
      if (decRet.indexRegOpParams[op] === 1) {
        return decRet.decode[op](s, 'IY');
      } else if (decRet.indexRegOpParams[op] === 2) {
        return decRet.decode[op](s, p1, 'IY');
      } else if (decRet.indexRegOpParams[op] === 3) {
        return decRet.decode[op](s, p1, p2, 'IY');
      }
      throw new Error("[DECODER::0xfd()]: Unknown parameter for index register IY:", op, emuState);
    },

    0xfe: function(s, p1) {
      s.cpu.intst.deIncFromRegAndMem(s, 'a', p1, -1);
      s.cpu.addCycles(s, 7);
      return arguments.callee.length;
    },

    0xff: function(s) {
      s.cpu.intst.reset(s, 0x38 * 8);
      s.cpu.addCycles(s, 11);
      return arguments.callee.length;
    }
    
  };

  decRet.indexRegOpParams = {
    0x09: 1,
    0x19: 1,
    0x21: 3,
    0x22: 3,
    0x23: 1,
    0x29: 1,
    0x2a: 3,
    0x2b: 1,
    0x34: 1,
    0x35: 1,
    0x36: 2,
    0x39: 1,
    0x46: 1,
    0x4e: 1,
    0x56: 1,
    0x5e: 1,
    0x66: 1,
    0x6e: 1,
    0x70: 1,
    0x71: 1,
    0x72: 1,
    0x73: 1,
    0x74: 1,
    0x75: 1,
    0x77: 1,
    0x7e: 1,
    0x86: 1,
    0x8e: 1,
    0x96: 1,
    0x8e: 1,
    0xa6: 1,
    0xae: 1,
    0xb6: 1,
    0xbe: 1,
    0xe1: 1,
    0xe3: 1,
    0xe5: 1,
    0xe9: 1,
    0xeb: 1,
    0xf9: 1
  };

  return decRet;
});
