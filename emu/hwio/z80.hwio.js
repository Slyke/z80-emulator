if (!emu) {
  var emu = {};
}

if (!emu.hwioList) {
  emu.hwioList = [];
}

emu.hwioList.push(function() {
  var hwioRet = {
    name: "z80",
    type: "hwio",
    cbs: {}
  };

  hwioRet.writePort = function(emuState, address, value) {
    emuState.cpu.pins.wr = true;
    emuState.cpu.pins.iorq = true;

    if (typeof(emuState.mmu.cbs.readPort) === "function") {
      emuState.mmu.cbs.writePort(emuState, address, value);
    }

    emuState.cpu.pins.wr = false;
    emuState.cpu.pins.iorq = false;
  };

  hwioRet.readPort = function(emuState, address) {
    emuState.cpu.pins.rd = true;
    emuState.cpu.pins.iorq = true;

    var tmpRead = 0x00;

    if (typeof(emuState.mmu.cbs.readPort) === "function") {
      tmpRead = emuState.mmu.cbs.readPort(emuState, address);
    }

    emuState.cpu.pins.rd = false;
    emuState.cpu.pins.iorq = false;
    
    return tmpRead;
  };

  return hwioRet;
});
