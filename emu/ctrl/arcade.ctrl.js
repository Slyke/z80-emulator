if (!emu) {
  var emu = {};
}

if (!emu.ctrlList) {
  emu.ctrlList = [];
}

emu.ctrlList.push(function() {
  var ctrlRet = {
    name: "arcade",
    type: "ctrl",
    alu: {},
    cpu: {},
    dec: {},
    hwio: {},
    mmu: {},
    utils: {},
    gpu: {}
  };

  ctrlRet.getSys = function(systemList, systemName) {
    for (var i = 0; i < systemList.length; i++) {
      if (systemName === systemList[i].name) {
        return systemList[i];
      }
    }
  };

  ctrlRet.setup = function(systemsList) {
    ctrlRet.alu = ctrlRet.getSys(systemsList.aluList, 'z80');
    ctrlRet.cpu = ctrlRet.getSys(systemsList.cpuList, 'z80');
    ctrlRet.dec = ctrlRet.getSys(systemsList.decList, 'z80');
    ctrlRet.hwio = ctrlRet.getSys(systemsList.hwioList, 'z80');
    ctrlRet.mmu = ctrlRet.getSys(systemsList.mmuList, 'z80');
    ctrlRet.utils = ctrlRet.getSys(systemsList.utilsList, 'z80');
    // ctrlRet.gpu = ctrlRet.getSys(systemsList.gpuList, 'z80');
  };

  return ctrlRet;
});
