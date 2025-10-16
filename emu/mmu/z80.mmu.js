/*
  MMU - Memory Management Unit
    This module is the MMU module for the Z80 emulator. It emulates connecting the address bus on the CPU chip to RAM and ROM.
    The memory itself is contained in this module and is just an array. Callbacks can be used to hook into the memory read and
    write events.

// */

if (!objEmulatorFactory) {
  var objEmulatorFactory = {};
}

(function(objEmulatorFactory) {
  if (!objEmulatorFactory.mmuList) {
    objEmulatorFactory.mmuList = [];
  }

  var callbacks = {
    memoryWarningCbArr: [],
    memoryUpdateCbArr: []
  }

  objEmulatorFactory.mmuList.push(function() {
    var mmuRet = {
      name: "z80",
      type: "mmu",
      cbsr: {},
      registeredCallbackList: {
        memoryWarningCbArr: [],
        memoryUpdateCbArr: [],
        memoryReadCbArr: []
      },
      memory: new Array(0x10000).fill(0),
      cbEvents: Object.freeze({
        read: 'READ',
        outOfBoundsRead: 'OOB_READ',
        outOfBoundsWrite: 'OOB_WRITE',
        write: 'WRITE',
        romWrite: 'ROM_WRITE'
      })
    };

    mmuRet.cbsr.memoryUpdateCb = function(cbFunction) {
      mmuRet.registeredCallbackList.memoryUpdateCbArr.push(cbFunction);
    };

    mmuRet.cbsr.memoryWarningCb = function(cbFunction) {
      mmuRet.registeredCallbackList.memoryWarningCbArr.push(cbFunction);
    };

    mmuRet.cbsr.memoryReadCb = function(cbFunction) {
      mmuRet.registeredCallbackList.memoryReadCbArr.push(cbFunction);
    };

    mmuRet.memorySegments = Object.freeze({
      romStart: 0x0000,
      romLength: 0x2000,
      ramStart: 0x2000,
      ramLength: 0xdfff,
      totalMemory: (0x2000 + 0xdfff)
    });

    mmuRet.writeByte = function(emuState, address, value) {
      emuState.cpu.pins.mreq = true;
      emuState.cpu.pins.wr = true;

      emuState.mmu.registeredCallbackList.memoryUpdateCbArr.forEach(cbFunction => {
        if (typeof(cbFunction) === "function") {
          cbFunction(emuState, address, value, emuState.mmu.cbEvents.write);
        }
      });

      if (address < (emuState.mmu.memorySegments.romLength - emuState.mmu.memorySegments.romStart)) {
        emuState.mmu.registeredCallbackList.memoryWarningCbArr.forEach(cbFunction => {
          if (typeof(cbFunction) === "function") {
            cbFunction(emuState, address, value, emuState.mmu.cbEvents.romWrite);
          }
        });
      }

      if (address > emuState.mmu.memorySegments.totalMemory) {
        emuState.mmu.registeredCallbackList.memoryWarningCbArr.forEach(cbFunction => {
          if (typeof(cbFunction) === "function") {
            cbFunction(emuState, address, value, emuState.mmu.cbEvents.outOfBoundsWrite);
          }
        });
      }

      emuState.mmu.memory[address] = value & 0xff;
      emuState.gpu.memoryMapDiffFrameBuffer.push(value & 0xff);
      emuState.cpu.pins.mreq = false;
      emuState.cpu.pins.wr = false;
    };

    mmuRet.readByte = function(emuState, address) {
      emuState.cpu.pins.mreq = true;
      emuState.cpu.pins.rd = true;

      emuState.mmu.registeredCallbackList.memoryReadCbArr.forEach(cbFunction => {
        if (typeof(cbFunction) === "function") {
          cbFunction(emuState, address, emuState.mmu.cbEvents.read);
        }
      });

      if (address > emuState.mmu.memorySegments.totalMemory || address < 0) {
        emuState.mmu.registeredCallbackList.memoryReadCbArr.forEach(cbFunction => {
          if (typeof(cbFunction) === "function") {
            cbFunction(emuState, address, null, emuState.mmu.cbEvents.outOfBoundsRead);
          }
        });
      }

      emuState.cpu.pins.mreq = false;
      emuState.cpu.pins.rd = false;

      return emuState.mmu.memory[address] & 0xff;
    };

    mmuRet.readWord = function(emuState, address) {
      return ((emuState.mmu.readByte(emuState, (address + 1) & 0xffff) << 8) | emuState.mmu.readByte(emuState, address) & 0xffff);
    };

    mmuRet.writeWord = function(emuState, address, value) {
      emuState.mmu.writeByte(emuState, address, (value & 0xff));
      emuState.mmu.writeByte(emuState, (address + 1) & 0xffff, ((value >> 8) & 0xff));
    };

    return mmuRet;
  });

  if (typeof(module) !== 'undefined') { // Node
    module.exports = objEmulatorFactory.mmuList;
  } else if (typeof define === 'function' && define.amd) { // AMD
    define([], function () {
        'use strict';
        return objEmulatorFactory.mmuList;
    });
  }

})(objEmulatorFactory);
