var gameBoyCPU = function() {
  // Since many of the OP codes between the Z80 and GameBoy are the same, I'm just going to overwrite the different OP codes in here.
  var cpu = {
    name: "Gameboy"
  };

  const fFlags = Object.freeze({
    carry: 0x01,
    parity: 0x04,
    halfcarry: 0x10,
    interrupt: 0x20,
    zero: 0x40,
    sign: 0x80,
  });

  cpu.opCodeOverwrite = function(state) {
    var opCode = [state.memory[state.flags.pc], state.memory[state.flags.pc + 1], state.memory[state.flags.pc + 2]];
    var currentPC = state.flags.pc;

    var preCycleChange = state.cycles;

    state.flags.pc++ & 0xffff;
    
    switch (opCode[0]) {

      case 0x08:      							                                // LD (word),SP
        cpu.unimplementedInstruction(state);
        state.cycles += 4;
        break;

      case 0x10:      							                                // STOP
        cpu.unimplementedInstruction(state);
        state.cycles += 4;
        break;

      case 0x22:      							                                // LD (HLI),A
        var hl = cpu.getFlags(state, "hl");
        state.flags.a = cpu.writeByte(state, hl, state.flags.a);
        hl++ & 0xffff;

        var ret = cpu.splitBytes(hl);
        state.flags.h = ret[1];
        state.flags.l = ret[0];
        state.cycles += 7;
        state.flags.pc++ & 0xffff;
        break;

      case 0x2a:      							                                // LD A,(HLI)
        var hl = cpu.getFlags(state, "hl");
        state.flags.a = cpu.readByte(state, hl);
        hl++ & 0xffff;
        
        var ret = cpu.splitBytes(hl);
        state.flags.h = ret[1];
        state.flags.l = ret[0];
        state.cycles += 7;
        state.flags.pc++ & 0xffff;
        break;

      case 0x32:      							                                // LD (HLD),A
        cpu.unimplementedInstruction(state);
        state.cycles += 4;
        break;

      case 0x3a:      							                                // LD A,(HLD)
        cpu.unimplementedInstruction(state);
        state.cycles += 4;
        break;

      case 0xd3: state.cycles += 4; break;

      case 0xd9:      							                                // RETI
        cpu.unimplementedInstruction(state);
        state.cycles += 4;
        break;

      case 0xdb: state.cycles += 4; break;                          // NOP
      case 0xdd: state.cycles += 4; break;                          // NOP

      case 0xe0:      							                                // LD (byte),A
        cpu.writeByte(state, ((opCode[1] | (0xff << 8)) & 0xffff), state.flags.a);
        state.cycles += 7;
        state.flags.pc++ & 0xffff;
        break;

      case 0xe2:      							                                // LD (C),A
        cpu.writeByte(state, ((state.flags.c | (0xff << 8)) & 0xffff), state.flags.a);
        state.cycles += 4;
        break;

      case 0xe3: state.cycles += 4; break;                          // NOP
      case 0xe4: state.cycles += 4; break;                          // NOP

      case 0xe8:      							                                // ADD SP,offset
        cpu.unimplementedInstruction(state);
        state.cycles += 4;
        break;

      case 0xea:      							                                // LD (word),A
        cpu.writeByte(state, ((opCode[1] | (opCode[2] << 8)) & 0xffff), state.flags.a);
        state.cycles += 4;
        state.flags.pc += 2;
        state.flags.pc &= 0xffff;
        break;

      case 0xeb: state.cycles += 4; break;                          // NOP
      case 0xec: state.cycles += 4; break;                          // NOP

      case 0xf0:      							                                // LD A,(byte)
        state.flags.a = cpu.readByte(state, ((opCode[1] | (0xff << 8)) & 0xffff));
        state.cycles += 7;
        state.flags.pc++ & 0xffff;
        break;

      case 0xf2: state.cycles += 4; break;                          // NOP
      case 0xf4: state.cycles += 4; break;                          // NOP

      case 0xf8:      							                                // LD HL SP,byte
        cpu.unimplementedInstruction(state);
        state.cycles += 4;
        break;

      case 0xfa:      							                                // LD A,(word)
        state.flags.a = cpu.readByte(state, ((opCode[1] | (opCode[2] << 8)) & 0xffff));
        state.cycles += 7;
        state.flags.pc += 2;
        state.flags.pc &= 0xffff;
        break;

      case 0xfc: state.cycles += 4; break;                          // NOP
      case 0xfd: state.cycles += 4; break;                          // NOP

      default:                                                  // Passthrough
        state.flags.pc-- & 0xffff;
        return 2;
    }

    state.db.executionCount++;

    if (currentPC === state.flags.pc) {
      return 1;
    }

    state.db.totalCPUCycles += (state.cycles - preCycleChange);

    cpu.interruptCheck(state);

    return 0;
  };

  cpu.interruptCheck = function(state) {
    if (state.cycles < 16667) {
      return;
    }

    state.db.cycleRollover = true;
    state.cycles -= 16667;

    if (state.pInterrupt === 0x10) {
      state.pInterrupt = 0x08;
    } else {
      state.pInterrupt = 0x10;
    }

    if (state.flags.f & fFlags.interrupt) {
      // We need to push the current PC to (SP) so we can return after executing the interrupt.
      cpu.push(state, state.flags.pc);

      state.flags.pc = state.pInterrupt;
      if (typeof(state.cInterrupt) === "function") {
        state.cInterrupt(state, state.pInterrupt);
      }
    }
  }

  cpu.push = function(state, value) {
    state.flags.sp -= 2;
    state.flags.sp &= 0xffff;
    cpu.writeWord(state, state.flags.sp, value);
  }

  cpu.pop = function(state, update = false) {
    var ret = cpu.readWord(state, state.flags.sp);
    state.flags.sp += 2;
    state.flags.sp &= 0xffff;
    if (update) {
      state.flags.pc = ret;
    }

    return ret;
  }

  cpu.readHWPort = function(state, portCh) {
    if (typeof(state.hwPortHook) === 'function') {
      state.hwPortHook('preread', state, portCh);
    }

    var portState = state.hwIntPorts[portCh & 0xff] & 0xff;

    if (typeof(state.hwPortHook) === 'function') {
      var hookResponse = state.hwPortHook('postread', state, portCh);
      portState = (hookResponse != null ? hookResponse : portState);
    }

    return portState;
  }

  cpu.writeHWPort = function(state, portCh, value) {
    if (typeof(state.hwPortHook) === 'function') {
      state.hwPortHook('prewrite', state, portCh, value);
    }

    portState = value & 0xff;

    if (typeof(state.hwPortHook) === 'function') {
      var hookResponse = state.hwPortHook('postwrite', state, portCh, value);
      portState = (hookResponse != null ? hookResponse : portState);
    }

    state.hwIntPorts[portCh & 0xff] = portState;
  };

  cpu.unimplementedInstruction = function(cpuState) {
    if (typeof(cpuState.warningCb) === 'function') { cpuState.warningCb('unimplementedInstruction', cpuState, ["Unimplmented instruction.", "Debug info: ", cpuState.disassemble8080OP(cpuState, cpuState.flags.pc - 1)]); }
    // The emulate function returns 1 if the instruction is unimplemented upon execution.
    // We need to rollback the PC so the state can be correctly handled by the function calling emulate8080OP().
    cpuState.flags.pc--;
  };

  cpu.romWriteCheck = function(state, writeAddr) {
    if (writeAddr < 0x2000 || writeAddr > 0xffff) {
      if (typeof(state.warningCb) === 'function') { state.warningCb('romWriteCheck', state, [
        "This emulator allows writing to ROM, but if you are receiving this message it means that the CPU is writing to the ROM. This will in most cases break the process and lead to unknown states. Please check your ASM.",
        "Warning: Writing to ROM: ",
        cpu.disassemble8080OP(state, state.flags.pc - 1)
      ]); }
    }
  };

  cpu.splitBytes = function(value) {
    var ret = [];
    ret[1] = ((value & 0xff00) >> 8) & 0xff;
    ret[0] = value & 0xff;

    return ret;
  };

  cpu.readByte = function(state, address) {
    var res = state.memory[address];

    if (res < 0x00 || res > 0xff || res === "" || res == null) {
      if (typeof(state.warningCb) === 'function') { state.warningCb('readByte', state, [
        "Warning: Value is outside of valid range: '" + res + "' This is probably a bug.",
        "A valid range will be returned if one can be recovered.",
        "Debug info: ",
        cpu.disassemble8080OP(state, state.flags.pc - 1),
        "Value info: Typeof: " + typeof(res) + "   < 0x00: " + res < 0x00 + "   > 0xff: " + res > 0xff + "   Empty string: " + res == "" + "   null: " + res == null
      ]); }
    }

    return state.memory[address] & 0xff;
  };

  cpu.readWord = function(state, address) {
    return (cpu.readByte(state, (address + 1) & 0xffff) << 8) | cpu.readByte(state, address);
  };

  cpu.writeByte = function(state, address, value) {
    cpu.romWriteCheck(state, address);

    if (typeof(state.memoryUpdateCb) === "function") {
      state.memoryUpdateCb(address, value);
    }

    if (address >= 0xffff) {
      if (typeof(state.warningCb) === 'function') { state.warningCb('writeByte', state, [
        "You are writing into out of bounds memory. The emulator will allow this, but it generally indicates something is wrong.",
        "Debug info: ",
        cpu.disassemble8080OP(state, state.flags.pc - 1)
      ]); }
    }

    state.memory[address] = value & 0xff;
  };

  cpu.writeWord = function(state, address, value) {
    cpu.writeByte(state, address, (value & 0xff));
    cpu.writeByte(state, (address + 1) & 0xffff, ((value >> 8) & 0xff));
  };

  cpu.addSubByte = function(state, lhv, rhv, addSub = 1) {
    var byteRes;

    if (addSub === 1) {
      byteRes = lhv + rhv;
    } else {
      byteRes = lhv - rhv;
    }

    var res = (byteRes & 0xff);
    if (res % 2) {
      state.flags.f &= ~fFlags.parity & 0xff;
    } else {
      state.flags.f |= fFlags.parity;
    }

    if (byteRes & 0x80) {
      state.flags.f |= fFlags.sign;
    } else {
      state.flags.f &= ~fFlags.sign & 0xFF;
    }

    if (res) {
      state.flags.f &= ~fFlags.zero & 0xff;
    } else {
      state.flags.f |= fFlags.zero;
    }

    if (((rhv ^ byteRes) ^ lhv) & 0x10) {
      state.flags.f |= fFlags.halfcarry;
    } else {
      state.flags.f &= ~fFlags.halfcarry & 0xff;
    }

    if (byteRes >= 0x100 || byteRes < 0) {
      state.flags.f |= fFlags.carry;
    } else {
      state.flags.f &= ~fFlags.carry & 0xff;
    }

    return res;
  };

  cpu.addSubWithCarryByte = function(state, lhv, rhv, addSub = 1) {

    var byteRes;

    if (state.flags.f & fFlags.carry) {
      if (addSub === 1) {
        rhv++;
      } else {
        rhv--;
      }
    }

    if (addSub === 1) {
      byteRes = lhv + rhv;
    } else {
      byteRes = lhv - rhv;
    }

    var res = (byteRes & 0xff);
    if (res % 2) {
      state.flags.f &= ~fFlags.parity & 0xff;
    } else {
      state.flags.f |= fFlags.parity;
    }

    if (byteRes & 0x80) {
      state.flags.f |= fFlags.sign;
    } else {
      state.flags.f &= ~fFlags.sign & 0xff;
    }

    if (res) {
      state.flags.f &= ~fFlags.zero & 0xff;
    } else {
      state.flags.f |= fFlags.zero;
    }

    if (((rhv ^ byteRes) ^ lhv) & 0x10) {
      state.flags.f |= fFlags.halfcarry;
    } else {
      state.flags.f &= ~fFlags.halfcarry & 0xff;
    }

    if (byteRes >= 0x100 || byteRes < 0) {
      state.flags.f |= fFlags.carry;
    } else {
      state.flags.f &= ~fFlags.carry & 0xff;
    }

    return res;
  };

  cpu.operandByte = function(state, lhv, rhv, operand) {
    var operandRes

    if (operand === "&") {
      operandRes = lhv & rhv;
    } else if (operand === "|") {
      operandRes = lhv | rhv;
    } else if (operand === "^") {
      operandRes = lhv ^ rhv;
    } else {
      return ;
    }

    var res = operandRes & 0xff;

    if (res % 2) {
      state.flags.f &= ~fFlags.parity & 0xff;
    } else {
      state.flags.f |= fFlags.parity;
    }

    if (operandRes & 0x80) {
      state.flags.f |= fFlags.sign;
    } else {
      state.flags.f &= ~fFlags.sign & 0xff;
    }

    if (res) {
      state.flags.f &= ~fFlags.zero & 0xff;
    } else {
      state.flags.f |= fFlags.zero;
    }

    if (operand === "&") {
      if (((lhv & 8) >> 3) | ((rhv & 8) >> 3)) {
        state.flags.f &= ~fFlags.halfcarry & 0xff;
      } else {
        state.flags.f |= fFlags.halfcarry;
      }
    }

    state.flags.f &= ~fFlags.carry & 0xff;

    if (operand === "^" || operand === "|") {
      state.flags.f &= ~fFlags.halfcarry & 0xff;
    }

    return res;

  };

  cpu.indecrementByte = function(state, value, upDown = 1) {
    var valueChange = value;

    if (upDown === 1) {
      valueChange++;
    } else {
      valueChange--;
    }

    var pz = (valueChange & 0xff);
    if (pz % 2) {
      state.flags.f &= ~fFlags.parity & 0xff;
    } else {
      state.flags.f |= fFlags.parity;
    }

    if (valueChange & 0x80) {
      state.flags.f |= fFlags.sign;
    } else {
      state.flags.f &= ~fFlags.sign & 0xff;
    }

    if (pz) {
      state.flags.f &= ~fFlags.zero & 0xff;
    } else {
      state.flags.f |= fFlags.zero;
    }

    if (((1 ^ valueChange) ^ value) & 0x10) {
      state.flags.f |= fFlags.halfcarry;
    } else {
      state.flags.f &= ~fFlags.halfcarry & 0xff;
    }

    return pz;
  };

  cpu.getFlags = function(state, flagCombo) {
    if (flagCombo === "af") {
      return ((state.flags.a << 8) | state.flags.f) & 0xffff;
    } else if (flagCombo === "bc") {
      return ((state.flags.b << 8) | state.flags.c) & 0xffff;
    } else if (flagCombo === "de") {
      return ((state.flags.d << 8) | state.flags.e) & 0xffff;
    } else if (flagCombo === "hl") {
      return ((state.flags.h << 8) | state.flags.l) & 0xffff;
    } else if (flagCombo === "ix") {
      return state.flags.ix & 0xffff;
    } else if (flagCombo === "iy") {
      return state.flags.iy & 0xffff;
    }

    if (typeof(state.warningCb) === 'function') { state.warningCb('getFlags', state, ["Invalid flag combo selected: ", flagCombo, " at: ", cpu.disassemble8080OP(state, state.flags.pc - 1)]); }
    return ;
  };

  cpu.parity = function(x, size) {
    var p = 0;
    x = (x & ((1 << size) - 1));
    for (var i = 0; i < size; i++) {
      if (x & 0x1) p++;
      x = x >> 1;
    }
    return (0 == (p & 0x1));
  };

  cpu.preCalculatedParitySize8 = function(value) {
    // Technically cpu.parity(x, 8) will produce this. I extracted the values so it doesn't have to each time.
    var parityBits = [
      1, 0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1, 0, 0, 1,
      0, 1, 1, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 1, 1, 0,
      0, 1, 1, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 1, 1, 0,
      1, 0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1, 0, 0, 1,
      0, 1, 1, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 1, 1, 0,
      1, 0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1, 0, 0, 1,
      1, 0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1, 0, 0, 1,
      0, 1, 1, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 1, 1, 0,
      0, 1, 1, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 1, 1, 0,
      1, 0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1, 0, 0, 1,
      1, 0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1, 0, 0, 1,
      0, 1, 1, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 1, 1, 0,
      1, 0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1, 0, 0, 1,
      0, 1, 1, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 1, 1, 0,
      0, 1, 1, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 1, 1, 0,
      1, 0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1, 0, 0, 1
    ];
    return parityBits[value];
  };

  return cpu;
}

if (typeof(module) !== 'undefined') {
  module.exports = z80CPU;
} else if (typeof define === 'function' && define.amd) {
  define([], function () {
      'use strict';
      return z80CPU;
  });
}
