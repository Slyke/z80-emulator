/*
  DEC - Decoder
    This module is the decoder for the Z80 CPU. Its job is to figure out how many bits each command takes, and which circuit
    each command should activate. In the emulator, the command's timing is done here to simulate a crystal clock.

// */

if (!objEmulatorFactory) {
  var objEmulatorFactory = {};
}

(function(objEmulatorFactory) {
  if (!objEmulatorFactory.decList) {
    objEmulatorFactory.decList = [];
  }

  objEmulatorFactory.decList.push(function() {
    var decRet = {
      name: "z80",
      type: "decoder"
    };

    decRet.decode = {
      0x00: function(s) {
        s.cpu.intst.nop(s);
        return decRet.decoderParams[arguments.name];
      },

      0x01: function(s, params) {
        s.cpu.intst.setReg(s, 'bc', s.utils.combineBytes(params[0], params[1]));
        s.cpu.addCycles(s, 10);
        return decRet.decoderParams[arguments.name];
      },

      0x02: function(s) {
        s.cpu.intst.setMemByte(s, s.cpu.getRegister(s, 'bc'), s.cpu.getRegister(s, 'a'));
        s.cpu.addCycles(s, 7);
        return decRet.decoderParams[arguments.name];
      },

      0x03: function(s) {
        s.cpu.intst.deIncMultiReg(s, 'bc');
        s.cpu.addCycles(s, 6);
        return decRet.decoderParams[arguments.name];
      },

      0x04: function(s) {
        s.cpu.intst.deIncReg(s, 'b');
        s.cpu.addCycles(s, 5);
        return decRet.decoderParams[arguments.name];
      },

      0x05: function(s) {
        s.cpu.intst.deIncReg(s, 'b', -1);
        s.cpu.addCycles(s, 5);
        return decRet.decoderParams[arguments.name];
      },

      0x06: function(s, params) {
        s.cpu.intst.setReg(s, 'b', params[0]);
        s.cpu.addCycles(s, 7);
        return decRet.decoderParams[arguments.name];
      },

      0x07: function(s) {
        s.cpu.intst.rlc(s);
        s.cpu.addCycles(s, 4);
        return decRet.decoderParams[arguments.name];
      },

      0x08: function(s) {
        s.cpu.intst.nop(s);
        return decRet.decoderParams[arguments.name];
      },

      0x09: function(s, idxReg = 'hl') {
        s.cpu.intst.deIncMultiReg(s, idxReg, s.cpu.getRegister(s, 'bc'));
        s.cpu.addCycles(s, 11);
        return decRet.decoderParams[arguments.name];
      },

      0x0a: function(s) {
        s.cpu.intst.setRegFromMem(s, 'a', s.cpu.getRegister(s, 'bc'));
        s.cpu.addCycles(s, 7);
        return decRet.decoderParams[arguments.name];
      },

      0x0b: function(s) {
        s.cpu.intst.deIncMultiReg(s, 'bc', -1);
        s.cpu.addCycles(s, 6);
        return decRet.decoderParams[arguments.name];
      },

      0x0c: function(s) {
        s.cpu.intst.deIncReg(s, 'c', 1);
        s.cpu.addCycles(s, 5);
        return decRet.decoderParams[arguments.name];
      },

      0x0d: function(s) {
        s.cpu.intst.deIncReg(s, 'c', -1);
        s.cpu.addCycles(s, 5);
        return decRet.decoderParams[arguments.name];
      },

      0x0e: function(s, params) {
        s.cpu.intst.setReg(s, 'c', params[0]);
        s.cpu.addCycles(s, 7);
        return decRet.decoderParams[arguments.name];
      },

      0x0f: function(s) {
        s.cpu.intst.rrc(s);
        s.cpu.addCycles(s, 4);
        return decRet.decoderParams[arguments.name];
      },

      0x10: function(s) {
        s.cpu.intst.nop(s);
        return decRet.decoderParams[arguments.name];
      },

      0x11: function(s, params) {
        s.cpu.intst.setReg(s, 'de', s.utils.combineBytes(params[0], params[1]));
        s.cpu.addCycles(s, 10);
        return decRet.decoderParams[arguments.name];
      },

      0x12: function(s) {
        s.cpu.intst.setMemByte(s, s.cpu.getRegister(s, 'de'), s.cpu.getRegister(s, 'a'));
        s.cpu.addCycles(s, 7);
        return decRet.decoderParams[arguments.name];
      },

      0x13: function(s) {
        s.cpu.intst.deIncMultiReg(s, 'de');
        s.cpu.addCycles(s, 6);
        return decRet.decoderParams[arguments.name];
      },

      0x14: function(s) {
        s.cpu.intst.deIncReg(s, 'd');
        s.cpu.addCycles(s, 5);
        return decRet.decoderParams[arguments.name];
      },

      0x15: function(s) {
        s.cpu.intst.deIncReg(s, 'd', -1);
        s.cpu.addCycles(s, 5);
        return decRet.decoderParams[arguments.name];
      },

      0x16: function(s, params) {
        s.cpu.intst.setReg(s, 'd', params[0]);
        s.cpu.addCycles(s, 7);
        return decRet.decoderParams[arguments.name];
      },

      0x17: function(s) {
        s.cpu.intst.rlc9(s);
        s.cpu.addCycles(s, 4);
        return decRet.decoderParams[arguments.name];
      },

      0x18: function(s) {
        s.cpu.intst.nop(s);
        return decRet.decoderParams[arguments.name];
      },

      0x19: function(s, idxReg = 'hl') {
        s.cpu.intst.deIncMultiReg(s, idxReg, s.cpu.getRegister(s, 'de'));
        s.cpu.addCycles(s, 11);
        return decRet.decoderParams[arguments.name];
      },

      0x1a: function(s) {
        s.cpu.intst.setRegFromMem(s, 'a', s.cpu.getRegister(s, 'de'));
        s.cpu.addCycles(s, 7);
        return decRet.decoderParams[arguments.name];
      },

      0x1b: function(s) {
        s.cpu.intst.deIncMultiReg(s, 'de', -1);
        s.cpu.addCycles(s, 6);
        return decRet.decoderParams[arguments.name];
      },

      0x1c: function(s) {
        s.cpu.intst.deIncReg(s, 'e', 1);
        s.cpu.addCycles(s, 5);
        return decRet.decoderParams[arguments.name];
      },

      0x1d: function(s) {
        s.cpu.intst.deIncReg(s, 'e', -1);
        s.cpu.addCycles(s, 5);
        return decRet.decoderParams[arguments.name];
      },

      0x1e: function(s, params) {
        s.cpu.intst.setReg(s, 'e', params[0]);
        s.cpu.addCycles(s, 7);
        return decRet.decoderParams[arguments.name];
      },

      0x1f: function(s) {
        s.cpu.intst.rrcc(s);
        s.cpu.addCycles(s, 4);
        return decRet.decoderParams[arguments.name];
      },

      0x20: function(s) {
        s.cpu.intst.nop(s);
        return decRet.decoderParams[arguments.name];
      },

      0x21: function(s, params, idxReg) {
        if (idxReg) {
          s.cpu.intst.setReg(s, idxReg, s.utils.combineBytes(params[0], params[1]));
        } else {
          s.cpu.intst.setReg(s, 'hl', s.utils.combineBytes(params[0], params[1]));
        }
        s.cpu.addCycles(s, 10);
        return decRet.decoderParams[arguments.name];
      },

      0x22: function(s, params, idxReg) {
        if (idxReg) {
          s.cpu.intst.setMemWord(s, s.utils.combineBytes(params[0], params[1]), s.cpu.getRegister(s, idxReg));
        } else {
          s.cpu.intst.setMemWord(s, s.utils.combineBytes(params[0], params[1]), s.cpu.getRegister(s, 'hl'));
        }
        s.cpu.addCycles(s, 16);
        return decRet.decoderParams[arguments.name];
      },

      0x23: function(s, idxReg) {
        if (idxReg) {
          s.cpu.intst.deIncMultiReg(s, idxReg);
        } else {
          s.cpu.intst.deIncMultiReg(s, 'hl');
        }
        s.cpu.addCycles(s, 6);
        return decRet.decoderParams[arguments.name];
      },

      0x24: function(s) {
        s.cpu.intst.deIncReg(s, 'h');
        s.cpu.addCycles(s, 5);
        return decRet.decoderParams[arguments.name];
      },

      0x25: function(s) {
        s.cpu.intst.deIncReg(s, 'h', -1);
        s.cpu.addCycles(s, 5);
        return decRet.decoderParams[arguments.name];
      },

      0x26: function(s, params) {
        s.cpu.intst.setReg(s, 'h', params[0]);
        s.cpu.addCycles(s, 7);
        return decRet.decoderParams[arguments.name];
      },

      0x27: function(s) {
        s.cpu.intst.nop(s);
        return decRet.decoderParams[arguments.name];
      },

      0x28: function(s) {
        s.cpu.intst.nop(s);
        return decRet.decoderParams[arguments.name];
      },

      0x29: function(s, idxReg = 'hl') {
        s.cpu.intst.deIncMultiReg(s, idxReg, s.cpu.getRegister(s, idxReg));
        s.cpu.addCycles(s, 11);
        return decRet.decoderParams[arguments.name];
      },

      0x2a: function(s, params, idxReg = 'hl') {
        s.cpu.intst.setRegFromMem(s, idxReg, s.utils.combineBytes(params[0], params[1]));
        s.cpu.addCycles(s, 16);
        return decRet.decoderParams[arguments.name];
      },

      0x2b: function(s, idxReg = 'hl') {
        s.cpu.intst.deIncMultiReg(s, idxReg, -1);
        s.cpu.addCycles(s, 6);
        return decRet.decoderParams[arguments.name];
      },

      0x2c: function(s) {
        s.cpu.intst.deIncReg(s, 'l');
        s.cpu.addCycles(s, 5);
        return decRet.decoderParams[arguments.name];
      },

      0x2d: function(s) {
        s.cpu.intst.deIncReg(s, 'l', -1);
        s.cpu.addCycles(s, 7);
        return decRet.decoderParams[arguments.name];
      },

      0x2e: function(s, params) {
        s.cpu.intst.setReg(s, 'l', params[0]);
        s.cpu.addCycles(s, 7);
        return decRet.decoderParams[arguments.name];
      },

      0x2f: function(s) {
        s.cpu.intst.cpl(s);
        s.cpu.addCycles(s, 4);
        return decRet.decoderParams[arguments.name];
      },

      0x30: function(s) {
        s.cpu.intst.nop(s);
        return decRet.decoderParams[arguments.name];
      },

      0x31: function(s, params) {
        s.cpu.intst.setReg(s, 'sp', s.utils.combineBytes(params[0], params[1]));
        s.cpu.addCycles(s, 10);
        return decRet.decoderParams[arguments.name];
      },

      0x32: function(s, params) {
        s.cpu.intst.setMemByte(s, s.utils.combineBytes(params[0], params[1]), s.cpu.getRegister(s, 'a'));
        s.cpu.addCycles(s, 13);
        return decRet.decoderParams[arguments.name];
      },

      0x33: function(s) {
        s.cpu.intst.deIncMultiReg(s, 'sp');
        s.cpu.addCycles(s, 6);
        return decRet.decoderParams[arguments.name];
      },

      0x34: function(s, idxReg = 'hl') {
        s.cpu.intst.deIncMemByte(s, s.cpu.getRegister(s, idxReg));
        s.cpu.addCycles(s, 10);
        return decRet.decoderParams[arguments.name];
      },

      0x35: function(s, idxReg = 'hl') {
        s.cpu.intst.deIncMemByte(s, s.cpu.getRegister(s, idxReg), -1);
        s.cpu.addCycles(s, 10);
        return decRet.decoderParams[arguments.name];
      },

      0x36: function(s, params, idxReg = 'hl') {
        s.cpu.intst.setMemByte(s, s.cpu.getRegister(s, idxReg), params[0]);
        s.cpu.addCycles(s, 10);
        return decRet.decoderParams[arguments.name];
      },

      0x37: function(s) {
        s.cpu.intst.srf(s, 'f', 'carry');
        s.cpu.addCycles(s, 4);
        return decRet.decoderParams[arguments.name];
      },

      0x38: function(s) {
        s.cpu.intst.nop(s);
        return decRet.decoderParams[arguments.name];
      },

      0x39: function(s, idxReg = 'hl') {
        s.cpu.intst.deIncMultiReg(s, idxReg, s.cpu.getRegister(s, 'sp'));
        s.cpu.addCycles(s, 11);
        return decRet.decoderParams[arguments.name];
      },

      0x3a: function(s, params) {
        s.cpu.intst.setRegFromMem(s, 'a', s.utils.combineBytes(params[0], params[1]));
        s.cpu.addCycles(s, 13);
        return decRet.decoderParams[arguments.name];
      },

      0x3b: function(s) {
        s.cpu.intst.deIncMultiReg(s, 'sp', -1);
        s.cpu.addCycles(s, 6);
        return decRet.decoderParams[arguments.name];
      },

      0x3c: function(s) {
        s.cpu.intst.deIncReg(s, 'a');
        s.cpu.addCycles(s, 5);
        return decRet.decoderParams[arguments.name];
      },

      0x3d: function(s, params) {
        s.cpu.intst.deIncReg(s, 'a', -1);
        s.cpu.addCycles(s, 5);
        return decRet.decoderParams[arguments.name];
      },

      0x3e: function(s, params) {
        s.cpu.intst.setReg(s, 'a', params[0]);
        s.cpu.addCycles(s, 7);
        return decRet.decoderParams[arguments.name];
      },

      0x3f: function(s) {
        s.cpu.intst.crf(s, 'f', 'carry');
        s.cpu.addCycles(s, 4);
        return decRet.decoderParams[arguments.name];
      },

      0x40: function(s) {
        s.cpu.intst.setRegFromReg(s, 'b', 'b');
        s.cpu.addCycles(s, 5);
        return decRet.decoderParams[arguments.name];
      },

      0x41: function(s) {
        s.cpu.intst.setRegFromReg(s, 'b', 'c');
        s.cpu.addCycles(s, 5);
        return decRet.decoderParams[arguments.name];
      },

      0x42: function(s) {
        s.cpu.intst.setRegFromReg(s, 'b', 'd');
        s.cpu.addCycles(s, 5);
        return decRet.decoderParams[arguments.name];
      },

      0x43: function(s) {
        s.cpu.intst.setRegFromReg(s, 'b', 'e');
        s.cpu.addCycles(s, 5);
        return decRet.decoderParams[arguments.name];
      },

      0x44: function(s) {
        s.cpu.intst.setRegFromReg(s, 'b', 'h');
        s.cpu.addCycles(s, 5);
        return decRet.decoderParams[arguments.name];
      },

      0x45: function(s) {
        s.cpu.intst.setRegFromReg(s, 'b', 'l');
        s.cpu.addCycles(s, 5);
        return decRet.decoderParams[arguments.name];
      },

      0x46: function(s, idxReg = 'hl') {
        s.cpu.intst.setRegFromMem(s, 'b', s.cpu.getRegister(s, idxReg));
        s.cpu.addCycles(s, 7);
        return decRet.decoderParams[arguments.name];
      },

      0x47: function(s) {
        s.cpu.intst.setRegFromReg(s, 'b', 'a');
        s.cpu.addCycles(s, 5);
        return decRet.decoderParams[arguments.name];
      },

      0x48: function(s) {
        s.cpu.intst.setRegFromReg(s, 'c', 'b');
        s.cpu.addCycles(s, 5);
        return decRet.decoderParams[arguments.name];
      },

      0x49: function(s) {
        s.cpu.intst.setRegFromReg(s, 'c', 'c');
        s.cpu.addCycles(s, 5);
        return decRet.decoderParams[arguments.name];
      },

      0x4a: function(s) {
        s.cpu.intst.setRegFromReg(s, 'c', 'd');
        s.cpu.addCycles(s, 5);
        return decRet.decoderParams[arguments.name];
      },

      0x4b: function(s) {
        s.cpu.intst.setRegFromReg(s, 'c', 'e');
        s.cpu.addCycles(s, 5);
        return decRet.decoderParams[arguments.name];
      },

      0x4c: function(s) {
        s.cpu.intst.setRegFromReg(s, 'c', 'h');
        s.cpu.addCycles(s, 5);
        return decRet.decoderParams[arguments.name];
      },

      0x4d: function(s) {
        s.cpu.intst.setRegFromReg(s, 'c', 'l');
        s.cpu.addCycles(s, 5);
        return decRet.decoderParams[arguments.name];
      },

      0x4e: function(s, idxReg = 'hl') {
        s.cpu.intst.setRegFromMem(s, 'c', s.cpu.getRegister(s, idxReg));
        s.cpu.addCycles(s, 7);
        return decRet.decoderParams[arguments.name];
      },

      0x4f: function(s) {
        s.cpu.intst.setRegFromReg(s, 'c', 'a');
        s.cpu.addCycles(s, 5);
        return decRet.decoderParams[arguments.name];
      },

      0x50: function(s) {
        s.cpu.intst.setRegFromReg(s, 'd', 'b');
        s.cpu.addCycles(s, 5);
        return decRet.decoderParams[arguments.name];
      },

      0x51: function(s) {
        s.cpu.intst.setRegFromReg(s, 'd', 'c');
        s.cpu.addCycles(s, 5);
        return decRet.decoderParams[arguments.name];
      },

      0x52: function(s) {
        s.cpu.intst.setRegFromReg(s, 'd', 'd');
        s.cpu.addCycles(s, 5);
        return decRet.decoderParams[arguments.name];
      },

      0x53: function(s) {
        s.cpu.intst.setRegFromReg(s, 'd', 'e');
        s.cpu.addCycles(s, 5);
        return decRet.decoderParams[arguments.name];
      },

      0x54: function(s) {
        s.cpu.intst.setRegFromReg(s, 'd', 'h');
        s.cpu.addCycles(s, 5);
        return decRet.decoderParams[arguments.name];
      },

      0x55: function(s) {
        s.cpu.intst.setRegFromReg(s, 'd', 'l');
        s.cpu.addCycles(s, 5);
        return decRet.decoderParams[arguments.name];
      },

      0x56: function(s, idxReg = 'hl') {
        s.cpu.intst.setRegFromMem(s, 'd', s.cpu.getRegister(s, idxReg));
        s.cpu.addCycles(s, 7);
        return decRet.decoderParams[arguments.name];
      },

      0x57: function(s) {
        s.cpu.intst.setRegFromReg(s, 'd', 'a');
        s.cpu.addCycles(s, 5);
        return decRet.decoderParams[arguments.name];
      },

      0x58: function(s) {
        s.cpu.intst.setRegFromReg(s, 'e', 'b');
        s.cpu.addCycles(s, 5);
        return decRet.decoderParams[arguments.name];
      },

      0x59: function(s) {
        s.cpu.intst.setRegFromReg(s, 'e', 'c');
        s.cpu.addCycles(s, 5);
        return decRet.decoderParams[arguments.name];
      },

      0x5a: function(s) {
        s.cpu.intst.setRegFromReg(s, 'e', 'd');
        s.cpu.addCycles(s, 5);
        return decRet.decoderParams[arguments.name];
      },

      0x5b: function(s) {
        s.cpu.intst.setRegFromReg(s, 'e', 'e');
        s.cpu.addCycles(s, 5);
        return decRet.decoderParams[arguments.name];
      },

      0x5c: function(s) {
        s.cpu.intst.setRegFromReg(s, 'e', 'h');
        s.cpu.addCycles(s, 5);
        return decRet.decoderParams[arguments.name];
      },

      0x5d: function(s) {
        s.cpu.intst.setRegFromReg(s, 'e', 'l');
        s.cpu.addCycles(s, 5);
        return decRet.decoderParams[arguments.name];
      },

      0x5e: function(s, idxReg = 'hl') {
        s.cpu.intst.setRegFromMem(s, 'e', s.cpu.getRegister(s, idxReg));
        s.cpu.addCycles(s, 7);
        return decRet.decoderParams[arguments.name];
      },

      0x5f: function(s) {
        s.cpu.intst.setRegFromReg(s, 'e', 'a');
        s.cpu.addCycles(s, 5);
        return decRet.decoderParams[arguments.name];
      },

      0x60: function(s) {
        s.cpu.intst.setRegFromReg(s, 'h', 'b');
        s.cpu.addCycles(s, 5);
        return decRet.decoderParams[arguments.name];
      },

      0x61: function(s) {
        s.cpu.intst.setRegFromReg(s, 'h', 'c');
        s.cpu.addCycles(s, 5);
        return decRet.decoderParams[arguments.name];
      },

      0x62: function(s) {
        s.cpu.intst.setRegFromReg(s, 'h', 'd');
        s.cpu.addCycles(s, 5);
        return decRet.decoderParams[arguments.name];
      },

      0x63: function(s) {
        s.cpu.intst.setRegFromReg(s, 'h', 'e');
        s.cpu.addCycles(s, 5);
        return decRet.decoderParams[arguments.name];
      },

      0x64: function(s) {
        s.cpu.intst.setRegFromReg(s, 'h', 'h');
        s.cpu.addCycles(s, 5);
        return decRet.decoderParams[arguments.name];
      },

      0x65: function(s) {
        s.cpu.intst.setRegFromReg(s, 'h', 'l');
        s.cpu.addCycles(s, 5);
        return decRet.decoderParams[arguments.name];
      },

      0x66: function(s, idxReg = 'hl') {
        s.cpu.intst.setRegFromMem(s, 'h', s.cpu.getRegister(s, idxReg));
        s.cpu.addCycles(s, 7);
        return decRet.decoderParams[arguments.name];
      },

      0x67: function(s) {
        s.cpu.intst.setRegFromReg(s, 'h', 'a');
        s.cpu.addCycles(s, 5);
        return decRet.decoderParams[arguments.name];
      },

      0x68: function(s) {
        s.cpu.intst.setRegFromReg(s, 'l', 'b');
        s.cpu.addCycles(s, 5);
        return decRet.decoderParams[arguments.name];
      },

      0x69: function(s) {
        s.cpu.intst.setRegFromReg(s, 'l', 'c');
        s.cpu.addCycles(s, 5);
        return decRet.decoderParams[arguments.name];
      },

      0x6a: function(s) {
        s.cpu.intst.setRegFromReg(s, 'l', 'd');
        s.cpu.addCycles(s, 5);
        return decRet.decoderParams[arguments.name];
      },

      0x6b: function(s) {
        s.cpu.intst.setRegFromReg(s, 'l', 'e');
        s.cpu.addCycles(s, 5);
        return decRet.decoderParams[arguments.name];
      },

      0x6c: function(s) {
        s.cpu.intst.setRegFromReg(s, 'l', 'h');
        s.cpu.addCycles(s, 5);
        return decRet.decoderParams[arguments.name];
      },

      0x6d: function(s) {
        s.cpu.intst.setRegFromReg(s, 'l', 'l');
        s.cpu.addCycles(s, 5);
        return decRet.decoderParams[arguments.name];
      },

      0x6e: function(s, idxReg = 'hl') {
        s.cpu.intst.setRegFromMem(s, 'e', s.cpu.getRegister(s, idxReg));
        s.cpu.addCycles(s, 7);
        return decRet.decoderParams[arguments.name];
      },

      0x6f: function(s) {
        s.cpu.intst.setRegFromReg(s, 'l', 'a');
        s.cpu.addCycles(s, 5);
        return decRet.decoderParams[arguments.name];
      },

      0x70: function(s, idxReg = 'hl') {
        s.cpu.intst.setMemByte(s, s.cpu.getRegister(s, idxReg), s.cpu.getRegister(s, 'b'));
        s.cpu.addCycles(s, 7);
        return decRet.decoderParams[arguments.name];
      },

      0x71: function(s, idxReg = 'hl') {
        s.cpu.intst.setMemByte(s, s.cpu.getRegister(s, idxReg), s.cpu.getRegister(s, 'c'));
        s.cpu.addCycles(s, 7);
        return decRet.decoderParams[arguments.name];
      },

      0x72: function(s, idxReg = 'hl') {
        s.cpu.intst.setMemByte(s, s.cpu.getRegister(s, idxReg), s.cpu.getRegister(s, 'd'));
        s.cpu.addCycles(s, 7);
        return decRet.decoderParams[arguments.name];
      },

      0x73: function(s, idxReg = 'hl') {
        s.cpu.intst.setMemByte(s, s.cpu.getRegister(s, idxReg), s.cpu.getRegister(s, 'e'));
        s.cpu.addCycles(s, 7);
        return decRet.decoderParams[arguments.name];
      },

      0x74: function(s, idxReg = 'hl') {
        s.cpu.intst.setMemByte(s, s.cpu.getRegister(s, idxReg), s.cpu.getRegister(s, 'h'));
        s.cpu.addCycles(s, 7);
        return decRet.decoderParams[arguments.name];
      },

      0x75: function(s, idxReg = 'hl') {
        s.cpu.intst.setMemByte(s, s.cpu.getRegister(s, idxReg), s.cpu.getRegister(s, 'l'));
        s.cpu.addCycles(s, 7);
        return decRet.decoderParams[arguments.name];
      },

      0x76: function(s) {
        // STOP
        s.cpu.pins.hlt = true;
      },

      0x77: function(s, idxReg = 'hl') {
        s.cpu.intst.setMemByte(s, s.cpu.getRegister(s, idxReg), s.cpu.getRegister(s, 'a'));
        s.cpu.addCycles(s, 7);
        return decRet.decoderParams[arguments.name];
      },

      0x78: function(s) {
        s.cpu.intst.setRegFromReg(s, 'a', 'b');
        s.cpu.addCycles(s, 5);
        return decRet.decoderParams[arguments.name];
      },

      0x79: function(s) {
        s.cpu.intst.setRegFromReg(s, 'a', 'c');
        s.cpu.addCycles(s, 5);
        return decRet.decoderParams[arguments.name];
      },

      0x7a: function(s) {
        s.cpu.intst.setRegFromReg(s, 'a', 'd');
        s.cpu.addCycles(s, 5);
        return decRet.decoderParams[arguments.name];
      },

      0x7b: function(s) {
        s.cpu.intst.setRegFromReg(s, 'a', 'e');
        s.cpu.addCycles(s, 5);
        return decRet.decoderParams[arguments.name];
      },

      0x7c: function(s) {
        s.cpu.intst.setRegFromReg(s, 'a', 'h');
        s.cpu.addCycles(s, 5);
        return decRet.decoderParams[arguments.name];
      },

      0x7d: function(s) {
        s.cpu.intst.setRegFromReg(s, 'a', 'l');
        s.cpu.addCycles(s, 5);
        return decRet.decoderParams[arguments.name];
      },

      0x7e: function(s, idxReg = 'hl') {
        s.cpu.intst.setRegFromMem(s, 'a', s.cpu.getRegister(s, idxReg));
        s.cpu.addCycles(s, 7);
        return decRet.decoderParams[arguments.name];
      },

      0x7f: function(s) {
        s.cpu.intst.setRegFromReg(s, 'a', 'a');
        s.cpu.addCycles(s, 5);
        return decRet.decoderParams[arguments.name];
      },

      0x80: function(s) {
        s.cpu.intst.deIncRegFromReg(s, 'a', 'b');
        s.cpu.addCycles(s, 4);
        return decRet.decoderParams[arguments.name];
      },

      0x81: function(s) {
        s.cpu.intst.deIncRegFromReg(s, 'a', 'c');
        s.cpu.addCycles(s, 4);
        return decRet.decoderParams[arguments.name];
      },

      0x82: function(s) {
        s.cpu.intst.deIncRegFromReg(s, 'a', 'd');
        s.cpu.addCycles(s, 4);
        return decRet.decoderParams[arguments.name];
      },

      0x83: function(s) {
        s.cpu.intst.deIncRegFromReg(s, 'a', 'e');
        s.cpu.addCycles(s, 4);
        return decRet.decoderParams[arguments.name];
      },

      0x84: function(s) {
        s.cpu.intst.deIncRegFromReg(s, 'a', 'h');
        s.cpu.addCycles(s, 4);
        return decRet.decoderParams[arguments.name];
      },

      0x85: function(s) {
        s.cpu.intst.deIncRegFromReg(s, 'a', 'l');
        s.cpu.addCycles(s, 4);
        return decRet.decoderParams[arguments.name];
      },

      0x86: function(s, idxReg = 'hl') {
        s.cpu.intst.deIncRegFromMem(s, 'a', s.cpu.getRegister(s, idxReg));
        s.cpu.addCycles(s, 7);
        return decRet.decoderParams[arguments.name];
      },

      0x87: function(s) {
        s.cpu.intst.deIncRegFromReg(s, 'a', 'a');
        s.cpu.addCycles(s, 4);
        return decRet.decoderParams[arguments.name];
      },

      0x88: function(s) {
        s.cpu.intst.deIncRegFromRegWithCarry(s, 'a', 'b');
        s.cpu.addCycles(s, 4);
        return decRet.decoderParams[arguments.name];
      },

      0x89: function(s) {
        s.cpu.intst.deIncRegFromRegWithCarry(s, 'a', 'c');
        s.cpu.addCycles(s, 4);
        return decRet.decoderParams[arguments.name];
      },

      0x8a: function(s) {
        s.cpu.intst.deIncRegFromRegWithCarry(s, 'a', 'd');
        s.cpu.addCycles(s, 4);
        return decRet.decoderParams[arguments.name];
      },

      0x8b: function(s) {
        s.cpu.intst.deIncRegFromRegWithCarry(s, 'a', 'e');
        s.cpu.addCycles(s, 4);
        return decRet.decoderParams[arguments.name];
      },

      0x8c: function(s) {
        s.cpu.intst.deIncRegFromRegWithCarry(s, 'a', 'h');
        s.cpu.addCycles(s, 4);
        return decRet.decoderParams[arguments.name];
      },

      0x8d: function(s) {
        s.cpu.intst.deIncRegFromRegWithCarry(s, 'a', 'l');
        s.cpu.addCycles(s, 4);
        return decRet.decoderParams[arguments.name];
      },

      0x8e: function(s, idxReg = 'hl') {
        s.cpu.intst.deIncRegFromMemWithCarry(s, 'a', s.cpu.getRegister(s, idxReg));
        s.cpu.addCycles(s, 7);
        return decRet.decoderParams[arguments.name];
      },

      0x8f: function(s) {
        s.cpu.intst.deIncRegFromRegWithCarry(s, 'a', 'a');
        s.cpu.addCycles(s, 4);
        return decRet.decoderParams[arguments.name];
      },

      0x90: function(s) {
        s.cpu.intst.deIncRegFromReg(s, 'a', 'b', -1);
        s.cpu.addCycles(s, 4);
        return decRet.decoderParams[arguments.name];
      },

      0x91: function(s) {
        s.cpu.intst.deIncRegFromReg(s, 'a', 'c', -1);
        s.cpu.addCycles(s, 4);
        return decRet.decoderParams[arguments.name];
      },

      0x92: function(s) {
        s.cpu.intst.deIncRegFromReg(s, 'a', 'd', -1);
        s.cpu.addCycles(s, 4);
        return decRet.decoderParams[arguments.name];
      },

      0x93: function(s) {
        s.cpu.intst.deIncRegFromReg(s, 'a', 'e', -1);
        s.cpu.addCycles(s, 4);
        return decRet.decoderParams[arguments.name];
      },

      0x94: function(s) {
        s.cpu.intst.deIncRegFromReg(s, 'a', 'h', -1);
        s.cpu.addCycles(s, 4);
        return decRet.decoderParams[arguments.name];
      },

      0x95: function(s) {
        s.cpu.intst.deIncRegFromReg(s, 'a', 'l', -1);
        s.cpu.addCycles(s, 4);
        return decRet.decoderParams[arguments.name];
      },

      0x96: function(s, idxReg = 'hl') {
        s.cpu.intst.deIncRegFromMem(s, 'a', s.cpu.getRegister(s, idxReg), -1);
        s.cpu.addCycles(s, 5);
        return decRet.decoderParams[arguments.name];
      },

      0x97: function(s) {
        s.cpu.intst.deIncRegFromReg(s, 'a', 'a', -1);
        s.cpu.addCycles(s, 4);
        return decRet.decoderParams[arguments.name];
      },

      0x98: function(s) {
        s.cpu.intst.deIncRegFromRegWithCarry(s, 'a', 'b', -1);
        s.cpu.addCycles(s, 4);
        return decRet.decoderParams[arguments.name];
      },

      0x99: function(s) {
        s.cpu.intst.deIncRegFromRegWithCarry(s, 'a', 'c', -1);
        s.cpu.addCycles(s, 4);
        return decRet.decoderParams[arguments.name];
      },

      0x9a: function(s) {
        s.cpu.intst.deIncRegFromRegWithCarry(s, 'a', 'd', -1);
        s.cpu.addCycles(s, 4);
        return decRet.decoderParams[arguments.name];
      },

      0x9b: function(s) {
        s.cpu.intst.deIncRegFromRegWithCarry(s, 'a', 'e', -1);
        s.cpu.addCycles(s, 4);
        return decRet.decoderParams[arguments.name];
      },

      0x9c: function(s) {
        s.cpu.intst.deIncRegFromRegWithCarry(s, 'a', 'h', -1);
        s.cpu.addCycles(s, 4);
        return decRet.decoderParams[arguments.name];
      },

      0x9d: function(s) {
        s.cpu.intst.deIncRegFromRegWithCarry(s, 'a', 'l', -1);
        s.cpu.addCycles(s, 4);
        return decRet.decoderParams[arguments.name];
      },

      0x9e: function(s, idxReg = 'hl') {
        s.cpu.intst.deIncRegFromMemWithCarry(s, 'a', s.cpu.getRegister(s, idxReg), -1);
        s.cpu.addCycles(s, 5);
        return decRet.decoderParams[arguments.name];
      },

      0x9f: function(s) {
        s.cpu.intst.deIncRegFromRegWithCarry(s, 'a', 'l', -1);
        s.cpu.addCycles(s, 4);
        return decRet.decoderParams[arguments.name];
      },

      0xa0: function(s) {
        s.cpu.intst.operandRegWithReg(s, 'a', 'b', '&');
        s.cpu.addCycles(s, 4);
        return decRet.decoderParams[arguments.name];
      },

      0xa1: function(s) {
        s.cpu.intst.operandRegWithReg(s, 'a', 'c', '&');
        s.cpu.addCycles(s, 4);
        return decRet.decoderParams[arguments.name];
      },

      0xa2: function(s) {
        s.cpu.intst.operandRegWithReg(s, 'a', 'd', '&');
        s.cpu.addCycles(s, 4);
        return decRet.decoderParams[arguments.name];
      },

      0xa3: function(s) {
        s.cpu.intst.operandRegWithReg(s, 'a', 'e', '&');
        s.cpu.addCycles(s, 4);
        return decRet.decoderParams[arguments.name];
      },

      0xa4: function(s) {
        s.cpu.intst.operandRegWithReg(s, 'a', 'h', '&');
        s.cpu.addCycles(s, 4);
        return decRet.decoderParams[arguments.name];
      },

      0xa5: function(s) {
        s.cpu.intst.operandRegWithReg(s, 'a', 'l', '&');
        s.cpu.addCycles(s, 4);
        return decRet.decoderParams[arguments.name];
      },

      0xa6: function(s, idxReg = 'hl') {
        s.cpu.intst.operandRegWithAddress(s, 'a', s.cpu.getRegister(s, idxReg), '&');
        s.cpu.addCycles(s, 7);
        return decRet.decoderParams[arguments.name];
      },

      0xa7: function(s) {
        s.cpu.intst.operandRegWithReg(s, 'a', 'a', '&');
        s.cpu.addCycles(s, 4);
        return decRet.decoderParams[arguments.name];
      },

      0xa8: function(s) {
        s.cpu.intst.operandRegWithReg(s, 'a', 'b', '^');
        s.cpu.addCycles(s, 4);
        return decRet.decoderParams[arguments.name];
      },

      0xa9: function(s) {
        s.cpu.intst.operandRegWithReg(s, 'a', 'c', '^');
        s.cpu.addCycles(s, 4);
        return decRet.decoderParams[arguments.name];
      },

      0xaa: function(s) {
        s.cpu.intst.operandRegWithReg(s, 'a', 'd', '^');
        s.cpu.addCycles(s, 4);
        return decRet.decoderParams[arguments.name];
      },

      0xab: function(s) {
        s.cpu.intst.operandRegWithReg(s, 'a', 'e', '^');
        s.cpu.addCycles(s, 4);
        return decRet.decoderParams[arguments.name];
      },

      0xac: function(s) {
        s.cpu.intst.operandRegWithReg(s, 'a', 'h', '^');
        s.cpu.addCycles(s, 4);
        return decRet.decoderParams[arguments.name];
      },

      0xad: function(s) {
        s.cpu.intst.operandRegWithReg(s, 'a', 'l', '^');
        s.cpu.addCycles(s, 4);
        return decRet.decoderParams[arguments.name];
      },

      0xae: function(s, idxReg = 'hl') {
        s.cpu.intst.operandRegWithAddress(s, 'a', s.cpu.getRegister(s, idxReg), '^');
        s.cpu.addCycles(s, 7);
        return decRet.decoderParams[arguments.name];
      },

      0xaf: function(s) {
        s.cpu.intst.operandRegWithReg(s, 'a', 'a', '^');
        s.cpu.addCycles(s, 4);
        return decRet.decoderParams[arguments.name];
      },

      0xb0: function(s) {
        s.cpu.intst.operandRegWithReg(s, 'a', 'b', '|');
        s.cpu.addCycles(s, 4);
        return decRet.decoderParams[arguments.name];
      },

      0xb1: function(s) {
        s.cpu.intst.operandRegWithReg(s, 'a', 'c', '|');
        s.cpu.addCycles(s, 4);
        return decRet.decoderParams[arguments.name];
      },

      0xb2: function(s) {
        s.cpu.intst.operandRegWithReg(s, 'a', 'd', '|');
        s.cpu.addCycles(s, 4);
        return decRet.decoderParams[arguments.name];
      },

      0xb3: function(s) {
        s.cpu.intst.operandRegWithReg(s, 'a', 'e', '|');
        s.cpu.addCycles(s, 4);
        return decRet.decoderParams[arguments.name];
      },

      0xb4: function(s) {
        s.cpu.intst.operandRegWithReg(s, 'a', 'h', '|');
        s.cpu.addCycles(s, 4);
        return decRet.decoderParams[arguments.name];
      },

      0xb5: function(s) {
        s.cpu.intst.operandRegWithReg(s, 'a', 'l', '|');
        s.cpu.addCycles(s, 4);
        return decRet.decoderParams[arguments.name];
      },

      0xb6: function(s, idxReg = 'hl') {
        s.cpu.intst.operandRegWithAddress(s, 'a', s.cpu.getRegister(s, idxReg), '|');
        s.cpu.addCycles(s, 7);
        return decRet.decoderParams[arguments.name];
      },

      0xb7: function(s) {
        s.cpu.intst.operandRegWithReg(s, 'a', 'a', '|');
        s.cpu.addCycles(s, 4);
        return decRet.decoderParams[arguments.name];
      },

      0xb8: function(s) {
        s.cpu.intst.deIncFromReg(s, 'a', 'b', -1);
        s.cpu.addCycles(s, 4);
        return decRet.decoderParams[arguments.name];
      },

      0xb9: function(s) {
        s.cpu.intst.deIncFromReg(s, 'a', 'c', -1);
        s.cpu.addCycles(s, 4);
        return decRet.decoderParams[arguments.name];
      },

      0xba: function(s) {
        s.cpu.intst.deIncFromReg(s, 'a', 'd', -1);
        s.cpu.addCycles(s, 4);
        return decRet.decoderParams[arguments.name];
      },

      0xbb: function(s) {
        s.cpu.intst.deIncFromReg(s, 'a', 'e', -1);
        s.cpu.addCycles(s, 4);
        return decRet.decoderParams[arguments.name];
      },

      0xbc: function(s) {
        s.cpu.intst.deIncFromReg(s, 'a', 'h', -1);
        s.cpu.addCycles(s, 4);
        return decRet.decoderParams[arguments.name];
      },

      0xbd: function(s) {
        s.cpu.intst.deIncFromReg(s, 'a', 'l', -1);
        s.cpu.addCycles(s, 4);
        return decRet.decoderParams[arguments.name];
      },

      0xbe: function(s, idxReg = 'hl') {
        s.cpu.intst.deIncFromRegAndMem(s, 'a', s.cpu.getRegister(s, idxReg), -1);
        s.cpu.addCycles(s, 7);
        return decRet.decoderParams[arguments.name];
      },

      0xbf: function(s) {
        s.cpu.intst.deIncFromReg(s, 'a', 'a', -1);
        s.cpu.addCycles(s, 4);
        return decRet.decoderParams[arguments.name];
      },

      0xc0: function(s) {
        var pcPop = s.cpu.intst.pop(s, 'NZ', true);
        s.cpu.addCycles(s, pcPop ? 11 : 5);
        return decRet.decoderParams[arguments.name];
      },

      0xc1: function(s) {
        s.cpu.setRegister(s, 'bc', s.cpu.intst.pop(s));
        s.cpu.addCycles(s, 10);
        return decRet.decoderParams[arguments.name];
      },

      0xc2: function(s, params) {
        var pcJump = s.cpu.intst.jump(s, s.utils.combineBytes(params[0], params[1]), 'NZ');
        s.cpu.addCycles(s, pcJump ? 15 : 10);
        return decRet.decoderParams[arguments.name];
      },

      0xc3: function(s, params) {
        s.cpu.setRegister(s, 'pc', s.cpu.intst.jump(s, s.utils.combineBytes(params[0], params[1])));
        s.cpu.addCycles(s, 10);
        return decRet.decoderParams[arguments.name];
      },

      0xc4: function(s, params) {
        var pcCall = s.cpu.intst.call(s, s.utils.combineBytes(params[0], params[1]), 'NZ');
        s.cpu.addCycles(s, pcCall ? 18 : 11);
        return decRet.decoderParams[arguments.name];
      },

      0xc5: function(s) {
        s.cpu.intst.push(s, s.cpu.getRegister(s, 'bc'));
        s.cpu.addCycles(s, 11);
        return decRet.decoderParams[arguments.name];
      },
      
      0xc6: function(s, params) {
        s.cpu.intst.deIncFromRegAndParam(s, 'a', params[0]);
        s.cpu.addCycles(s, 7);
        return decRet.decoderParams[arguments.name];
      },
      
      0xc7: function(s) {
        s.cpu.intst.reset(s, 0);
        s.cpu.addCycles(s, 11);
        return decRet.decoderParams[arguments.name];
      },

      0xc8: function(s) {
        var pcPop = s.cpu.intst.pop(s, 'Z', true);
        s.cpu.addCycles(s, pcPop ? 11 : 5);
        return decRet.decoderParams[arguments.name];
      },

      0xc9: function(s) {
        var pcPop = s.cpu.intst.pop(s);
        s.cpu.setRegister(s, 'pc', pcPop);
        s.cpu.addCycles(s, 10);
        return decRet.decoderParams[arguments.name];
      },

      0xca: function(s, params) {
        var pcJump = s.cpu.intst.jump(s, s.utils.combineBytes(params[0], params[1]), 'Z');
        s.cpu.addCycles(s, pcJump ? 15 : 10);
        return decRet.decoderParams[arguments.name];
      },

      0xcb: function(s) {
        s.cpu.intst.nop(s);
        return decRet.decoderParams[arguments.name];
      },

      0xcc: function(s, params) {
        var pcCall = s.cpu.intst.call(s, s.utils.combineBytes(params[0], params[1]), 'Z');
        s.cpu.addCycles(s, pcCall ? 18 : 11);
        return decRet.decoderParams[arguments.name];
      },

      0xcd: function(s, params) {
        s.cpu.intst.call(s);
        s.cpu.setRegister(s, 'pc', s.utils.combineBytes(params[0], params[1]));
        s.cpu.addCycles(s, 17);
        return decRet.decoderParams[arguments.name];
      },

      0xce: function(s, params) {
        s.cpu.intst.deIncFromRegAndParamWithCarry(s, 'a', params[0]);
        s.cpu.addCycles(s, 4);
        return decRet.decoderParams[arguments.name];
      },
      
      0xcf: function(s) {
        s.cpu.intst.reset(s, 0x08 * 8);
        s.cpu.addCycles(s, 11);
        return decRet.decoderParams[arguments.name];
      },

      0xd0: function(s) {
        var pcPop = s.cpu.intst.pop(s, 'NC', true);
        s.cpu.addCycles(s, pcPop ? 11 : 5);
        return decRet.decoderParams[arguments.name];
      },

      0xd1: function(s) {
        s.cpu.setRegister(s, 'de', s.cpu.intst.pop(s));
        s.cpu.addCycles(s, 10);
        return decRet.decoderParams[arguments.name];
      },

      0xd2: function(s, params) {
        var pcJump = s.cpu.intst.jump(s, s.utils.combineBytes(params[0], params[1]), 'NC');
        s.cpu.addCycles(s, pcJump ? 15 : 10);
        return decRet.decoderParams[arguments.name];
      },

      0xd3: function(s, params) {
        s.hwio.writePort(s, params[0], s.cpu.getRegister(s, 'a'));
        s.cpu.addCycles(s, 10);
        return decRet.decoderParams[arguments.name];
      },

      0xd4: function(s, params) {
        var pcCall = s.cpu.intst.call(s, s.utils.combineBytes(params[0], params[1]), 'NC');
        s.cpu.addCycles(s, pcCall ? 18 : 11);
        return decRet.decoderParams[arguments.name];
      },

      0xd5: function(s) {
        s.cpu.intst.push(s, s.cpu.getRegister(s, 'de'));
        s.cpu.addCycles(s, 11);
        return decRet.decoderParams[arguments.name];
      },

      0xd6: function(s, params) {
        s.cpu.intst.deIncFromRegAndParamWithCarry(s, 'a', params[0], -1);
        s.cpu.addCycles(s, 7);
        return decRet.decoderParams[arguments.name];
      },
      
      0xd7: function(s) {
        s.cpu.intst.reset(s, 0x10 * 8);
        s.cpu.addCycles(s, 11);
        return decRet.decoderParams[arguments.name];
      },

      0xd8: function(s) {
        var pcPop = s.cpu.intst.pop(s, 'C', true);
        s.cpu.addCycles(s, pcPop ? 11 : 5);
        return decRet.decoderParams[arguments.name];
      },

      0xd9: function(s) {
        s.cpu.intst.nop(s);
        return decRet.decoderParams[arguments.name];
      },

      0xda: function(s, params) {
        var pcJump = s.cpu.intst.jump(s, s.utils.combineBytes(params[0], params[1]), 'C');
        s.cpu.addCycles(s, pcJump ? 15 : 10);
        return decRet.decoderParams[arguments.name];
      },

      0xdb: function(s, params) {
      s.cpu.setRegister(s, 'a', s.hwio.readPort(s, params[0]));
      s.cpu.addCycles(s, 10);
      return decRet.decoderParams[arguments.name];
      },

      0xdc: function(s, params) {
        var pcCall = s.cpu.intst.call(s, 'C');
        s.cpu.setRegister(s, 'pc', s.utils.combineBytes(params[0], params[1]));
        s.cpu.addCycles(s, pcCall ? 18 : 10);
        return decRet.decoderParams[arguments.name];
      },

      0xdd: function(s, op, params) {
        // NEXTOP IX
        if (decRet.decoderParams[op] === 1) {
          return decRet.decode[op](s, 'IX');
        } else if (decRet.decoderParams[op] === 2) {
          return decRet.decode[op](s, params, 'IX');
        } else if (decRet.decoderParams[op] === 3) {
          return decRet.decode[op](s, params, 'IX');
        }
        throw { type: "Error", moduleName: decRet.type, functionName: "0xdd", reason: "Unknown parameter for index register IX", args: arguments, emulatorState: s };
      },

      0xde: function(s, params) {
        s.cpu.intst.deIncFromRegAndParamWithCarry(s, 'a', params[0], -1);
        s.cpu.addCycles(s, 7);
        return decRet.decoderParams[arguments.name];
      },
      
      0xdf: function(s) {
        s.cpu.intst.reset(s, 0x18 * 8);
        s.cpu.addCycles(s, 11);
        return decRet.decoderParams[arguments.name];
      },

      0xe0: function(s) {
        var pcPop = s.cpu.intst.pop(s, 'NP');
        s.cpu.setRegister(s, 'pc', pcPop);
        s.cpu.addCycles(s, pcPop ? 11 : 5);
        return decRet.decoderParams[arguments.name];
      },

      0xe1: function(s, idxReg = 'hl') {
        s.cpu.setRegister(s, idxReg, s.cpu.intst.pop(s));
        s.cpu.addCycles(s, 10);
        return decRet.decoderParams[arguments.name];
      },

      0xe2: function(s, params) {
        var pcJump = s.cpu.intst.jump(s, s.utils.combineBytes(params[0], params[1]), 'NP');
        s.cpu.addCycles(s, pcJump ? 15 : 10);
        return decRet.decoderParams[arguments.name];
      },

      0xe3: function(s, idxReg = 'hl') {
        s.cpu.intst.xchm(s, idxReg);
        s.cpu.addCycles(s, 4);
        return decRet.decoderParams[arguments.name];
      },

      0xe4: function(s, params) {
        var pcCall = s.cpu.intst.call(s, s.utils.combineBytes(params[0], params[1]), 'NP');
        s.cpu.addCycles(s, pcCall ? 18 : 11);
        return decRet.decoderParams[arguments.name];
      },

      0xe5: function(s, idxReg = 'hl') {
        s.cpu.intst.push(s, s.cpu.getRegister(s, idxReg));
        s.cpu.addCycles(s, 11);
        return decRet.decoderParams[arguments.name];
      },

      0xe6: function(s, params) {
        s.cpu.intst.operandRegWithParam(s, 'a', params[0], '&');
        s.cpu.addCycles(s, 7);
        return decRet.decoderParams[arguments.name];
      },
      
      0xe7: function(s) {
        s.cpu.intst.reset(s, 0x20 * 8);
        s.cpu.addCycles(s, 11);
        return decRet.decoderParams[arguments.name];
      },

      0xe8: function(s) {
        var pcPop = s.cpu.intst.pop(s, 'P', true);
        s.cpu.addCycles(s, pcPop ? 11 : 5);
        return decRet.decoderParams[arguments.name];
      },

      0xe9: function(s, idxReg = 'hl') {
        var pcJump = s.cpu.intst.jump(s, s.cpu.getRegister(s, idxReg));
        s.cpu.addCycles(s, 4);
        return decRet.decoderParams[arguments.name];
      },

      0xea: function(s, params) {
        var pcJump = s.cpu.intst.jump(s, s.utils.combineBytes(params[0], params[1]), 'P');
        s.cpu.addCycles(s, pcJump ? 15 : 10);
        return decRet.decoderParams[arguments.name];
      },

      0xeb: function(s, idxReg = 'hl') {
        var tmp = s.cpu.getRegister(s, idxReg);
        s.cpu.setRegister(s, idxReg, s.cpu.getRegister(s, 'de'));
        s.cpu.setRegister(s, 'de', tmp);
        s.cpu.addCycles(s, 4);
        return decRet.decoderParams[arguments.name];
      },

      0xec: function(s) {
        var pcCall = s.cpu.intst.call(s, 'P');
        s.cpu.setRegister(s, 'pc', s.utils.combineBytes(params[0], params[1]));
        s.cpu.addCycles(s, pcCall ? 18 : 10);
        return decRet.decoderParams[arguments.name];
      },

      0xed: function(s) {
        s.cpu.intst.nop(s);
        return decRet.decoderParams[arguments.name];
      },

      0xee: function(s, params) {
        s.cpu.intst.operandRegWithParam(s, 'a', params[0], '^');
        s.cpu.addCycles(s, 7);
        return decRet.decoderParams[arguments.name];
      },

      0xef: function(s) {
        s.cpu.intst.reset(s, 0x28 * 8);
        s.cpu.addCycles(s, 11);
        return decRet.decoderParams[arguments.name];
      },

      0xf0: function(s) {
        var pcPop = s.cpu.intst.pop(s, 'NS');
        s.cpu.setRegister(s, 'pc', pcPop);
        s.cpu.addCycles(s, pcPop ? 11 : 5);
        return decRet.decoderParams[arguments.name];
      },

      0xf1: function(s) {
        s.cpu.setRegister(s, 'af', s.cpu.intst.pop(s));
        s.cpu.addCycles(s, 10);
        return decRet.decoderParams[arguments.name];
      },

      0xf2: function(s, params) {
        var pcJump = s.cpu.intst.jump(s, s.utils.combineBytes(params[0], params[1]), 'NS');
        s.cpu.addCycles(s, pcJump ? 15 : 10);
        return decRet.decoderParams[arguments.name];
      },

      0xf3: function(s) {
        s.cpu.intst.intrpt(s, 0);
        s.cpu.addCycles(s, 4);
        return decRet.decoderParams[arguments.name];
      },

      0xf4: function(s, params) {
        var pcCall = s.cpu.intst.call(s, 'S');
        s.cpu.setRegister(s, 'pc', s.utils.combineBytes(params[0], params[1]));
        s.cpu.addCycles(s, pcCall ? 18 : 11);
        return decRet.decoderParams[arguments.name];
      },

      0xf5: function(s) {
        s.cpu.intst.push(s, s.cpu.getRegister(s, 'af'));
        s.cpu.addCycles(s, 11);
        return decRet.decoderParams[arguments.name];
      },

      0xf6: function(s, params) {
        s.cpu.intst.operandRegWithParam(s, 'a', params[0], '|');
        s.cpu.addCycles(s, 7);
        return decRet.decoderParams[arguments.name];
      },

      0xf7: function(s) {
        s.cpu.intst.reset(s, 0x30 * 8);
        s.cpu.addCycles(s, 11);
        return decRet.decoderParams[arguments.name];
      },

      0xf8: function(s) {
        var pcPop = s.cpu.intst.pop(s, 'S', true);
        s.cpu.addCycles(s, pcPop ? 11 : 5);
        return decRet.decoderParams[arguments.name];
      },

      0xf9: function(s, idxReg = 'hl') {
        s.cpu.setRegister(s, 'sp', s.cpu.getRegister(s, idxReg));
        s.cpu.addCycles(s, 6);
        return decRet.decoderParams[arguments.name];
      },

      0xfa: function(s, params) {
        var pcJump = s.cpu.intst.jump(s, s.utils.combineBytes(params[0], params[1]), 'S');
        s.cpu.addCycles(s, pcJump ? 15 : 10);
        return decRet.decoderParams[arguments.name];
      },

      0xfb: function(s) {
        s.cpu.intst.intrpt(s, 1);
        s.cpu.addCycles(s, 4);
        return decRet.decoderParams[arguments.name];
      },

      0xfc: function(s) {
        var pcCall = s.cpu.intst.call(s, 'S');
        s.cpu.setRegister(s, 'pc', s.utils.combineBytes(params[0], params[1]));
        s.cpu.addCycles(s, pcCall ? 18 : 10);
        return decRet.decoderParams[arguments.name];
      },

      0xfd: function(s, op, params) {
        // NEXTOP IY
        if (decRet.decoderParams[op] === 1) {
          return decRet.decode[op](s, 'IY');
        } else if (decRet.decoderParams[op] === 2) {
          return decRet.decode[op](s, params, 'IY');
        } else if (decRet.decoderParams[op] === 3) {
          return decRet.decode[op](s, params, 'IY');
        }
        throw { type: "Error", moduleName: decRet.type, functionName: "0xdd", reason: "Unknown parameter for index register IY", args: arguments, emulatorState: s };
      },

      0xfe: function(s, params) {
        s.cpu.intst.deIncFromRegAndParamNoOutput(s, 'a', params[0], -1);
        s.cpu.addCycles(s, 7);
        return decRet.decoderParams[arguments.name];
      },

      0xff: function(s) {
        s.cpu.intst.reset(s, 0x38 * 8);
        s.cpu.addCycles(s, 11);
        return decRet.decoderParams[arguments.name];
      }
    };

    decRet.decoderParams = {
      0x0a: 1,
      0x0b: 1,
      0x0c: 1,
      0x0d: 1,
      0x0e: 2,
      0x0f: 1,
      0x00: 1,
      0x01: 3,
      0x1a: 1,
      0x1b: 1,
      0x1c: 1,
      0x1d: 1,
      0x1e: 2,
      0x1f: 1,
      0x02: 1,
      0x2c: 1,
      0x2d: 1,
      0x2e: 2,
      0x2f: 1,
      0x03: 1,
      0x3a: 3,
      0x3b: 1,
      0x3c: 1,
      0x3d: 1,
      0x3e: 2,
      0x3f: 1,
      0x04: 1,
      0x4a: 1,
      0x4b: 1,
      0x4c: 1,
      0x4d: 1,
      0x4f: 1,
      0x05: 1,
      0x5a: 1,
      0x5b: 1,
      0x5c: 1,
      0x5d: 1,
      0x5f: 1,
      0x06: 2,
      0x6a: 1,
      0x6b: 1,
      0x6c: 1,
      0x6d: 1,
      0x6f: 1,
      0x07: 1,
      0x7a: 1,
      0x7b: 1,
      0x7c: 1,
      0x7d: 1,
      0x7f: 1,
      0x08: 1,
      0x8a: 1,
      0x8b: 1,
      0x8c: 1,
      0x8d: 1,
      0x8f: 1,
      0x9a: 1,
      0x9b: 1,
      0x9c: 1,
      0x9d: 1,
      0x9e: 1,
      0x9f: 1,
      0x10: 1,
      0x11: 3,
      0x12: 1,
      0x13: 1,
      0x14: 1,
      0x15: 1,
      0x16: 2,
      0x17: 1,
      0x18: 1,
      0x20: 1,
      0x21: 3,
      0x22: 3,
      0x23: 1,
      0x24: 1,
      0x25: 1,
      0x26: 2,
      0x27: 1,
      0x28: 1,
      0x30: 1,
      0x31: 3,
      0x32: 3,
      0x33: 1,
      0x37: 1,
      0x38: 1,
      0x40: 1,
      0x41: 1,
      0x42: 1,
      0x43: 1,
      0x44: 1,
      0x45: 1,
      0x47: 1,
      0x48: 1,
      0x49: 1,
      0x50: 1,
      0x51: 1,
      0x52: 1,
      0x53: 1,
      0x54: 1,
      0x55: 1,
      0x57: 1,
      0x58: 1,
      0x59: 1,
      0x60: 1,
      0x61: 1,
      0x62: 1,
      0x63: 1,
      0x64: 1,
      0x65: 1,
      0x67: 1,
      0x68: 1,
      0x69: 1,
      0x78: 1,
      0x79: 1,
      0x80: 1,
      0x81: 1,
      0x82: 1,
      0x83: 1,
      0x84: 1,
      0x85: 1,
      0x87: 1,
      0x88: 1,
      0x89: 1,
      0x90: 1,
      0x91: 1,
      0x92: 1,
      0x93: 1,
      0x94: 1,
      0x95: 1,
      0x97: 1,
      0x98: 1,
      0x99: 1,
      0xa0: 1,
      0xa1: 1,
      0xa2: 1,
      0xa3: 1,
      0xa4: 1,
      0xa5: 1,
      0xa7: 1,
      0xa8: 1,
      0xa9: 1,
      0xaa: 1,
      0xab: 1,
      0xac: 1,
      0xad: 1,
      0xaf: 1,
      0xb0: 1,
      0xb1: 1,
      0xb2: 1,
      0xb3: 1,
      0xb4: 1,
      0xb5: 1,
      0xb7: 1,
      0xb8: 1,
      0xb9: 1,
      0xba: 1,
      0xbb: 1,
      0xbc: 1,
      0xbd: 1,
      0xbf: 1,
      0xc0: 1,
      0xc1: 1,
      0xc2: 3,
      0xc3: 3,
      0xc4: 3,
      0xc5: 1,
      0xc6: 2,
      0xc7: 1,
      0xc8: 1,
      0xc9: 1,
      0xca: 3,
      0xcb: 1,
      0xcc: 3,
      0xcd: 3,
      0xce: 2,
      0xcf: 1,
      0xd0: 1,
      0xd1: 1,
      0xd2: 3,
      0xd3: 2,
      0xd4: 3,
      0xd5: 1,
      0xd6: 2,
      0xd7: 1,
      0xd8: 1,
      0xd9: 1,
      0xda: 3,
      0xdb: 2,
      0xdc: 3,
      0xdd: 0, // Special IX
      0xde: 2,
      0xdf: 1,
      0xe0: 1,
      0xe2: 3,
      0xe4: 3,
      0xe6: 2,
      0xe7: 1,
      0xe8: 1,
      0xea: 3,
      0xec: 1,
      0xed: 1,
      0xee: 2,
      0xef: 1,
      0xf0: 1,
      0xf1: 1,
      0xf2: 3,
      0xf3: 1,
      0xf4: 3,
      0xf5: 1,
      0xf6: 2,
      0xf7: 1,
      0xf8: 1,
      0xfa: 3,
      0xfb: 1,
      0xfc: 1,
      0xfd: 0, // Special IY
      0xfe: 2,
      0xff: 1,
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

  if (typeof(module) !== 'undefined') { // Node
    module.exports = objEmulatorFactory.decList;
  } else if (typeof define === 'function' && define.amd) { // AMD
    define([], function () {
        'use strict';
        return objEmulatorFactory.decList;
    });
  }

})(objEmulatorFactory);
