if (!objEmulatorFactory) {
  var objEmulatorFactory = {};
}

(function(objEmulatorFactory) {
  if (!objEmulatorFactory.gpuList) {
    objEmulatorFactory.gpuList = [];
  }

  objEmulatorFactory.gpuList.push(function() {
    var gpuRet = {
      name: "z80",
      type: "gpu",
      resolution: [224, 256],
      memoryMapDiffFrameBuffer: []
    };

    gpuRet.renderMemoryMap = function(emu, memoryMapImageData) {
      while((memoryMapDiffFrameBufferPixel = gpuRet.memoryMapDiffFrameBuffer.pop()) != null) {
        var color = 0x00;
        if ((memoryMapDiffFrameBufferPixel * 4) < 0x2000) { // ROM
          color = 0x22;
        }
        if ((memoryMapDiffFrameBufferPixel * 4) > 0x2400) { // Video
          color = 0x55;
        }
        memoryMapImageData.data[memoryMapDiffFrameBufferPixel * 4] = emu.mmu.memory[memoryMapDiffFrameBufferPixel];
        memoryMapImageData.data[(memoryMapDiffFrameBufferPixel * 4) + 1] = emu.mmu.memory[memoryMapDiffFrameBufferPixel] ? color : 0;
        memoryMapImageData.data[(memoryMapDiffFrameBufferPixel * 4) + 2] = emu.mmu.memory[memoryMapDiffFrameBufferPixel] ? color : 0;
        memoryMapImageData.data[(memoryMapDiffFrameBufferPixel * 4) + 3] = 255;
        memoryMapImageData.data[(emu.cpu.registers.pc * 4) + 1] = 255;
        memoryMapImageData.data[(emu.cpu.registers.sp * 4) + 2] = 255;
      }
    };

    return gpuRet;
  });

  if (typeof(module) !== 'undefined') { // Node
    module.exports = objEmulatorFactory.gpuList;
  } else if (typeof define === 'function' && define.amd) { // AMD
    define([], function () {
        'use strict';
        return objEmulatorFactory.gpuList;
    });
  }

})(objEmulatorFactory);
