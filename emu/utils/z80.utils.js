/*
  UTILS - Utils
    This module is the utils module for the Z80 emulator. It's where handy functions that the emulator needs to run go,
    that may not fix into another module exactly.

// */

if (!objEmulatorFactory) {
  var objEmulatorFactory = {};
}

(function(objEmulatorFactory) {
  if (!objEmulatorFactory.utilsList) {
    objEmulatorFactory.utilsList = [];
  }

  objEmulatorFactory.utilsList.push(function() {
    var utilsRet = {
      name: "z80",
      type: "utils"
    };

    utilsRet.splitBytes = function(value) {
      var ret = [];
      ret[1] = ((value & 0xff00) >> 8) & 0xff;
      ret[0] = value & 0xff;

      return ret;
    };

    utilsRet.combineBytes = function(byte1, byte2) {
      var ret = ((byte2 << 8) | byte1) & 0xffff;

      return ret;
    };

    utilsRet.getKeyBoardKeysText = function() {
      return [
        "Z80 Arcade Game Keys:",
        "     A - Left        D - Right",
        "     Spacebar - Shoot",
        "     1 - Player 1    2 - Player 2",
        "     C - Insert Coin",
        "     "
      ];
    };

    utilsRet.getCpuCheckSum = function(emu) {
      return utilsRet.calculateChecksum([
        emu.cpu.registers.pc,
        Math.round(emu.cpu.registers.pc / 2),
        emu.cpu.registers.sp,
        Math.round(emu.cpu.registers.sp / 2),
        emu.cpu.registers.ix,
        emu.cpu.registers.iy,
        emu.cpu.counts.cycles,
        Math.round(emu.cpu.counts.cycles / 2),
        emu.cpu.registers.a,
        emu.cpu.registers.f,
        emu.cpu.registers.b,
        emu.cpu.registers.c,
        emu.cpu.registers.d,
        emu.cpu.registers.e,
        emu.cpu.registers.h,
        emu.cpu.registers.l
      ]);
    };

    utilsRet.calculateChecksum = function(numberList) {
      var output = "";

      if (!numberList || numberList.length === 0) {
        throw { type: "Error", moduleName: utilsRet.type, functionName: "getCpuCheckSum", reason: "No data to checksum. Check if CPU is initialised", args: arguments };
      }

      for (var i = 0; i < numberList.length; i++) {
        output += utilsRet.luhn(numberList[i]).toString();
      }

      output += utilsRet.luhn(output).toString();
      output += utilsRet.luhn(output).toString();

      return parseInt(output).toString(16);
    };

    utilsRet.luhn = function(originalStr) {
      var sum = 0;
      var delta = [0, 1, 2, 3, 4, -4, -3, -2, -1, 0];

      originalStr = originalStr.toString();

      for (var i = 0; i < originalStr.length; i++) {
        sum += parseInt(originalStr.substring(i, i + 1));
      }
    
      for (var i = (originalStr.length - 1); i >= 0; i -= 2) {
        sum += delta[parseInt(originalStr.substring(i, i + 1))];
      }
    
      if (10 - (sum % 10) === 10) {
        return 0;
      }
      return (10 - (sum % 10));
    };

    return utilsRet;
  });

  if (typeof(module) !== 'undefined') { // Node
    module.exports = objEmulatorFactory.utilsList;
  } else if (typeof define === 'function' && define.amd) { // AMD
    define([], function () {
        'use strict';
        return objEmulatorFactory.utilsList;
    });
  }

})(objEmulatorFactory);
