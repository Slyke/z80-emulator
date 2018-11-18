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
