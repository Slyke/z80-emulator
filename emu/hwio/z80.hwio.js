if (!objEmulatorFactory) {
  var objEmulatorFactory = {};
}

(function(objEmulatorFactory) {
  if (!objEmulatorFactory.hwioList) {
    objEmulatorFactory.hwioList = [];
  }

  objEmulatorFactory.hwioList.push(function() {
    var hwioRet = {
      name: "z80",
      type: "hwio",
      cbs: {
        cInterrupt: undefined,
        readPort: undefined,
        writePort: undefined
      }
    };

    hwioRet.interrupt = Object.freeze({
      interruptsList: [0x10, 0x08],
      interrupt: 0x10,
      interruptClockCycle: 16667
    });

    hwioRet.writePort = function(emuState, address, value, throwError = true) {
      emuState.cpu.pins.wr = true;
      emuState.cpu.pins.iorq = true;

      if (typeof(emuState.hwio.cbs.writePort) === "function") {
        emuState.hwio.cbs.writePort(emuState, address, value);
      } else {
        if (throwError) {
          throw { type: "Error", moduleName: hwioRet.type, functionName: "writePort", reason: "No writePort callback function specified. Add one with: emuState.hwio.cbs.writePort = function(emuState, address, value, throwError){...} ", args: arguments };
        }
      }

      emuState.cpu.pins.wr = false;
      emuState.cpu.pins.iorq = false;
    };

    hwioRet.readPort = function(emuState, address, throwError = true) {
      emuState.cpu.pins.rd = true;
      emuState.cpu.pins.iorq = true;

      var tmpRead = 0x00;

      if (typeof(emuState.hwio.cbs.readPort) === "function") {
        tmpRead = emuState.hwio.cbs.readPort(emuState, address);
      } else {
        if (throwError) {
          throw { type: "Error", moduleName: hwioRet.type, functionName: "readPort", reason: "No readPort callback function specified. Add one with: emuState.hwio.cbs.readPort = function(emuState, address, throwError){...} ", args: arguments };
        }
      }

      emuState.cpu.pins.rd = false;
      emuState.cpu.pins.iorq = false;
      
      return tmpRead;
    };

    hwioRet.interruptCheck = function(emuState) {
      if (emuState.cpu.counts.cycles < hwioRet.interrupt.interruptClockCycle) {
        return false;
      }
  
      emuState.cpu.counts.cycles -= hwioRet.interrupt.interruptClockCycle;
  
      if (hwioRet.interrupt.interrupt === hwioRet.interrupt.interruptsList[0]) {
        hwioRet.interrupt.interrupt = hwioRet.interrupt.interruptsList[1];
      } else {
        hwioRet.interrupt.interrupt = hwioRet.interrupt.interruptsList[0];
      }
  
      if (emuState.alu.checkAluFlags(emuState.cpu.getRegister(emuState, 'f'), "I")) {
        // We need to push the current PC to (SP) so we can return after executing the interrupt.
        emuState.alu.push(emuState, emuState.cpu.getRegister(emuState, 'pc'));
  
        emuState.cpu.setRegister(emuState, 'f', hwioRet.interrupt);
        if (typeof(hwioRet.cbs.cInterrupt) === "function") {
          hwioRet.cbs.cInterrupt(emuState, hwioRet.interrupt);
        }
      }

      return true
    };

    return hwioRet;
  });

  if (typeof(module) !== 'undefined') { // Node
    module.exports = objEmulatorFactory.hwioList;
  } else if (typeof define === 'function' && define.amd) { // AMD
    define([], function () {
        'use strict';
        return objEmulatorFactory.hwioList;
    });
  }

})(objEmulatorFactory);
