if (!objEmulatorFactory) {
  var objEmulatorFactory = {};
}

(function(objEmulatorFactory) {
  if (!objEmulatorFactory.mmuList) {
    objEmulatorFactory.mmuList = [];
  }

  objEmulatorFactory.mmuList.push(function() {
    var mmuRet = {
      name: "z80",
      type: "mmu",
      cbs: {
        memoryWarningCb: undefined,
        memoryUpdateCb: undefined
      },
      memory: new Array(0x10000).fill(0)
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
      if (typeof(emuState.mmu.cbs.memoryUpdateCb) === "function") {
        emuState.mmu.cbs.memoryUpdateCb(emuState, address, value);
      }

      if (address < (emuState.mmu.memorySegments.romLength - emuState.mmu.memorySegments.romStart)) {
        if (typeof(emuState.mmu.cbs.memoryWarningCb) === "function") {
          emuState.mmu.cbs.memoryWarningCb(emuState, address, value, 'ROM_WRITE');
        }
      }

      if (address > emuState.mmu.memorySegments.totalMemory) {
        if (typeof(emuState.mmu.cbs.memoryWarningCb) === "function") {
          emuState.mmu.cbs.memoryWarningCb(emuState, address, value, 'OOB_WRITE');
        }
      }
      emuState.mmu.memory[address] = value & 0xff;
      emuState.gpu.memoryMapDiffFrameBuffer.push(value & 0xff);
      emuState.cpu.pins.mreq = false;
      emuState.cpu.pins.wr = false;
    };

    mmuRet.readByte = function(emuState, address) {
      emuState.cpu.pins.mreq = true;
      emuState.cpu.pins.rd = true;
      
      if (typeof(emuState.mmu.cbs.memoryUpdateCb) === "function") {
        emuState.mmu.cbs.memoryReadCb(emuState, address);
      }

      if (address > emuState.mmu.memorySegments.totalMemory || address < 0) {
        if (typeof(emuState.mmu.cbs.memoryWarningCb) === "function") {
          emuState.mmu.cbs.memoryWarningCb(emuState, address, value, 'OOB_READ');
        }
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
