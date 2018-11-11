if (!emu) {
  var emu = {};
}

if (!emu.aluList) {
  emu.aluList = [];
}

emu.aluList.push(function() {
  var aluRet = {
    name: "z80",
    type: "alu"
  };

  aluRet.fFlags = Object.freeze({
    carry: 0x01,
    parity: 0x04,
    halfcarry: 0x10,
    interrupt: 0x20,
    zero: 0x40,
    sign: 0x80,
  });

  aluRet.checkAluFlags = function(currentRegF, condition, aluFlags = aluRet.fFlags) {
    condition = condition.toUpperCase();

    switch (condition) {
      case 'C': {
        return (currentRegF & aluFlags.carry);
      }

      case 'P': {
        return (currentRegF & aluFlags.parity);
      }

      case 'H': {
        return (currentRegF & aluFlags.halfcarry);
      }

      case 'I': {
        return (currentRegF & aluFlags.interrupt);
      }

      case 'Z': {
        return (currentRegF & aluFlags.zero);
      }

      case 'S': {
        return (currentRegF & aluFlags.sign);
      }

      case 'NC': {
        return !(currentRegF & aluFlags.carry);
      }

      case 'NP': {
        return !(currentRegF & aluFlags.parity);
      }

      case 'NH': {
        return !(currentRegF & aluFlags.halfcarry);
      }

      case 'NI': {
        return !(currentRegF & aluFlags.interrupt);
      }

      case 'NZ': {
        return !(currentRegF & aluFlags.zero);
      }

      case 'NS': {
        return !(currentRegF & aluFlags.sign);
      }

      default:
        throw new Error("[ALU::checkAluFlags()]: Unknown flag condition:", condition);
    }
  };

  aluRet.call = function(emuState, location, pcReg = 'pc') {
    var newLocation = location;
    if (typeof(newLocation) === 'object') {
      newLocation = ((location[1] << 8) | location[0]) & 0xffff;
    }

    emuState.cpu.pcInc(emuState, 2);
    cpu.push(emuState, emuState.cpu.registers[pcReg]);

    emuState.cpu.registers[pcReg] = newLocation & 0xffff;
  };

  aluRet.jump = function(emuState, location, pcReg = 'pc') {
    var newLocation = location;
    if (typeof(newLocation) === 'object') {
      newLocation = ((location[1] << 8) | location[0]) & 0xffff;
    }
    emuState.cpu.registers[pcReg] = newLocation & 0xffff;
    return emuState.cpu.registers[pcReg];
  };

  aluRet.push = function(emuState, value, spReg = 'sp') {
    emuState.cpu.registers[spReg] -= 2;
    emuState.cpu.registers[spReg] &= 0xffff;
    emuState.mmu.writeWord(emuState, emuState.cpu.registers[spReg], value);
    return emuState.cpu.registers[spReg];
  };

  aluRet.pop = function(emuState, jumpPc = false, spReg = 'sp', pcReg = 'pc') {
    var ret = emuState.mmu.readWord(state, emuState.cpu.registers[spReg]);
    emuState.cpu.pcInc(emuState, 2);

    if (jumpPc) {
      emuState.cpu.registers[pcReg] = ret;
    }

    return ret;
  };
  
  aluRet.reset = function(emuState, location, pcReg = 'pc') {
    aluRet.push(emuState, emuState.cpu.registers[pcReg]);
    emuState.cpu.registers[pcReg] = location;
  };

  aluRet.preCalculatedParitySize8 = function(value) {
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

  aluRet.parity = function(x, size) {
    var p = 0;
    x = (x & ((1 << size) - 1));
    for (var i = 0; i < size; i++) {
      if (x & 0x1) p++;
      x = x >> 1;
    }
    return (0 == (p & 0x1));
  };
  
  aluRet.addSubWithCarryByte = function(emuState, lhv, rhv, addSub = 1, fReg = 'f') {

    var byteRes;

    if (emuState.cpu.getRegister(emuState, fReg) & aluRet.fFlags.carry) {
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

    emuState.cpu.setRegister(emuState, fReg, aluRet.mod2ParityAluCheck(byteRes, emuState.cpu.getRegister(emuState, fReg), aluRet.fFlags));
    emuState.cpu.setRegister(emuState, fReg, aluRet.signedValueAluCheck(byteRes, emuState.cpu.getRegister(emuState, fReg), aluRet.fFlags));
    emuState.cpu.setRegister(emuState, fReg, aluRet.zeroValueAluCheck(byteRes, emuState.cpu.getRegister(emuState, fReg), aluRet.fFlags));
    emuState.cpu.setRegister(emuState, fReg, aluRet.halfCarryValueAluCheck(lhv, rhv, byteRes, emuState.cpu.getRegister(emuState, fReg), aluRet.fFlags));
    emuState.cpu.setRegister(emuState, fReg, aluRet.fullCarryValueAluCheck(byteRes, emuState.cpu.getRegister(emuState, fReg), aluRet.fFlags));

    return (byteRes & 0xff);
  };

  aluRet.operandByte = function(emuState, lhv, rhv, operand, fReg = 'f') {
    var operandRes

    if (operand === "&") {
      operandRes = lhv & rhv;
    } else if (operand === "|") {
      operandRes = lhv | rhv;
    } else if (operand === "^") {
      operandRes = lhv ^ rhv;
    } else {
      throw new Error("[ALU::operandByte()]: Unknown operand:", operand, emuState);
    }

    emuState.cpu.setRegister(emuState, fReg, aluRet.mod2ParityAluCheck(operandRes, emuState.cpu.getRegister(emuState, fReg), aluRet.fFlags));
    emuState.cpu.setRegister(emuState, fReg, aluRet.signedValueAluCheck(operandRes, emuState.cpu.getRegister(emuState, fReg), aluRet.fFlags));
    emuState.cpu.setRegister(emuState, fReg, aluRet.zeroValueAluCheck(operandRes, emuState.cpu.getRegister(emuState, fReg), aluRet.fFlags));

    if (operand === "&") {
      if (((lhv & 8) >> 3) | ((rhv & 8) >> 3)) {
        emuState.cpu.setRegister(emuState, fReg, (emuState.cpu.getRegister(emuState, fReg) & ~aluRet.fFlags.halfcarry & 0xff));
        // emuState.cpu.registers[fReg] &= ~aluRet.fFlags.halfcarry & 0xff;
      } else {
        emuState.cpu.setRegister(emuState, fReg, (emuState.cpu.getRegister(emuState, fReg) | aluRet.fFlags.halfcarry & 0xff));
        // emuState.cpu.registers[fReg] |= aluRet.fFlags.halfcarry;
      }
    }

    emuState.cpu.setRegister(emuState, fReg, (emuState.cpu.getRegister(emuState, fReg) & ~aluRet.fFlags.carry & 0xff));
    // emuState.cpu.registers[fReg] &= ~aluRet.fFlags.carry & 0xff;

    if (operand === "^" || operand === "|") {
      emuState.cpu.setRegister(emuState, fReg, (emuState.cpu.getRegister(emuState, fReg) & ~aluRet.fFlags.halfcarry & 0xff));
      // emuState.cpu.registers[fReg] &= ~aluRet.fFlags.halfcarry & 0xff;
    }

    return res;
  };

  aluRet.addSubByte = function(emuState, lhv, rhv, addSub = 1, fReg = 'f') {
    var byteRes;

    if (addSub === 1) {
      byteRes = lhv + rhv;
    } else {
      byteRes = lhv - rhv;
    }

    emuState.cpu.setRegister(emuState, fReg, aluRet.mod2ParityAluCheck(byteRes, emuState.cpu.getRegister(emuState, fReg), aluRet.fFlags));
    emuState.cpu.setRegister(emuState, fReg, aluRet.signedValueAluCheck(byteRes, emuState.cpu.getRegister(emuState, fReg), aluRet.fFlags));
    emuState.cpu.setRegister(emuState, fReg, aluRet.zeroValueAluCheck(byteRes, emuState.cpu.getRegister(emuState, fReg), aluRet.fFlags));
    emuState.cpu.setRegister(emuState, fReg, aluRet.halfCarryValueAluCheck(lhv, rhv, byteRes, emuState.cpu.getRegister(emuState, fReg), aluRet.fFlags);
    emuState.cpu.setRegister(emuState, fReg, aluRet.fullCarryValueAluCheck(byteRes, emuState.cpu.getRegister(emuState, fReg), aluRet.fFlags));

    return (byteRes & 0xff);
  };

  aluRet.indecrementByte = function(emuState, value, upDown = 1, fReg = 'f') {
    var valueChange = value;

    if (upDown === 1) {
      valueChange++;
    } else {
      valueChange--;
    }

    emuState.cpu.setRegister(emuState, fReg, aluRet.mod2ParityAluCheck(value, emuState.cpu.getRegister(emuState, fReg), aluRet.fFlags));
    emuState.cpu.setRegister(emuState, fReg, aluRet.signedValueAluCheck(value, emuState.cpu.getRegister(emuState, fReg), aluRet.fFlags));
    emuState.cpu.setRegister(emuState, fReg, aluRet.zeroValueAluCheck(value, emuState.cpu.getRegister(emuState, fReg), aluRet.fFlags));
    emuState.cpu.setRegister(emuState, fReg, aluRet.halfCarryValueAluCheck(value, 1, valueChange, emuState.cpu.getRegister(emuState, fReg), aluRet.fFlags));

    return (valueChange & 0xff);
  };

  aluRet.mod2ParityAluCheck = function(value, fFlag, aluFlags, flagCheck = 'parity') {
    var pz = (value & 0xff);
    if (pz % 2) {
      fFlag &= ~aluFlags[flagCheck] & 0xff;
    } else {
      fFlag |= aluFlags[flagCheck];
    }

    return fFlag;
  };

  aluRet.signedValueAluCheck = function (value, fFlag, aluFlags, flagCheck = 'sign') {
    if (value & 0x80) {
      fFlag |= aluFlags[flagCheck];
    } else {
      fFlag &= ~aluFlags[flagCheck] & 0xff;
    }

    return fFlag;
  };

  aluRet.zeroValueAluCheck = function (value, fFlag, aluFlags, flagCheck = 'zero') {
    var pz = (value & 0xff);
    if (pz) {
      fFlag &= ~aluFlags[flagCheck] & 0xff;
    } else {
      fFlag |= aluFlags[flagCheck];
    }

    return fFlag;
  };

  aluRet.halfCarryValueAluCheck = function (lhv, lhv, newValue, fFlag, aluFlags, flagCheck = 'halfcarry') {
    if (((rhv ^ newValue) ^ lhv) & 0x10) {
      fFlag |= aluFlags[flagCheck];
    } else {
      fFlag &= ~aluFlags[flagCheck] & 0xff;
    }

    return fFlag;
  };

  aluRet.fullCarryValueAluCheck = function (value, fFlag, aluFlags, flagCheck = 'carry') {
    if (value >= 0x100 || value < 0) {
      fFlag |= aluFlags[flagCheck];
    } else {
      fFlag &= ~aluFlags[flagCheck] & 0xff;
    }

    return fFlag;
  };

  aluRet.rlc = function(emuState, aFlag = 'a', fFlag = 'f', aluFlags = aluRet.fFlags, flagCheck = 'carry') {
    var res = emuState.cpu.getRegister(emuState, aFlag) >> 7;

    if (res) {
      emuState.cpu.setRegister(emuState, fFlag, emuState.cpu.getRegister(emuState, fFlag) | aluFlags[flagCheck]);
    } else {
      emuState.cpu.setRegister(emuState, fFlag, (emuState.cpu.getRegister(emuState, fFlag) & ~aluFlags[flagCheck] & 0xff));
    }

    emuState.cpu.setRegister(emuState, aFlag, (((emuState.cpu.getRegister(emuState, aFlag) << 1) & 0xff) | res));
  };

  aluRet.rlc9 = function(emuState, aFlag = 'a', fFlag = 'f', aluFlags = aluRet.fFlags, flagCheck = 'carry') {
    var res = emuState.alu.checkAluFlags(emuState, 'C') ? 1 : 0;

    if (emuState.cpu.getRegister(emuState, aFlag) & 0x80) {
      emuState.cpu.setRegister(emuState, fFlag, emuState.cpu.getRegister(emuState, fFlag) | aluFlags[flagCheck]);
    } else {
      emuState.cpu.setRegister(emuState, fFlag, (emuState.cpu.getRegister(emuState, fFlag) & ~aluFlags[flagCheck] & 0xff));
    }

    emuState.cpu.setRegister(emuState, aFlag, (((emuState.cpu.getRegister(emuState, aFlag) & 0x7f) << 7) | res));
  };

  aluRet.rrc = function(emuState, aFlag = 'a', fFlag = 'f', aluFlags = aluRet.fFlags, flagCheck = 'carry') {
    var res = emuState.cpu.getRegister(emuState, aFlag) << 7;

    if (res) {
      emuState.cpu.setRegister(emuState, fFlag, emuState.cpu.getRegister(emuState, fFlag) | aluFlags[flagCheck]);
    } else {
      emuState.cpu.setRegister(emuState, fFlag, (emuState.cpu.getRegister(emuState, fFlag) & ~aluFlags[flagCheck] & 0xff));
    }

    emuState.cpu.setRegister(emuState, aFlag, (((emuState.cpu.getRegister(emuState, aFlag) >> 1) & 0xfe) | res));
  };

  aluRet.rrcc = function(emuState, aFlag = 'a', fFlag = 'f', aluFlags = aluRet.fFlags, flagCheck = 'carry') {
    var res = emuState.alu.checkAluFlags(emuState, 'C') ? 0x80 : 0;

    if (emuState.cpu.getRegister(emuState, aFlag) & 0x01) {
      emuState.cpu.setRegister(emuState, fFlag, emuState.cpu.getRegister(emuState, fFlag) | aluFlags[flagCheck]);
    } else {
      emuState.cpu.setRegister(emuState, fFlag, (emuState.cpu.getRegister(emuState, fFlag) & ~aluFlags[flagCheck] & 0xff));
    }

    emuState.cpu.setRegister(emuState, aFlag, (((emuState.cpu.getRegister(emuState, aFlag) >> 1) & 0xfe) | res));
  };

  aluRet.cpl = function(emuState, aFlag = 'a') {
    emuState.cpu.setRegister(emuState, aFlag, emuState.cpu.getRegister(emuState, aFlag) ^ 0xff);
  };

  return aluRet;
});