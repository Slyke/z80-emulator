if (!emu) {
  var emu = {};
}

if (!emu.aluList) {
  emu.utilsList = [];
}

emu.utilsList.push(function() {
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

  return utilsRet;
});
