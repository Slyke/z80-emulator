/*
  GPU - Graphical Processing Unit
    This module is the GPU for the Z80 emulator. This specific module is for the arcade machines. It is not the same
    GPU that home computers, such as the Sinclair used. This GPU maps memory in RAM directly to screen pixels.

// */


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

    gpuRet.renderMemoryMap = function(emu, memoryMapImageData, fullRender = false) {
      var memoryMapColors = {
        default: [0x00, 0x00, 0x00],
        rom: [0x22, 0x22, 0x00],
        video: [0x00, 0x55, 0x55]
      }

      if (fullRender) {
        var memoryIndex = 0;
        while((memoryMapDiffFrameBufferPixel = memoryIndex) != null && memoryIndex < emu.mmu.memorySegments.totalMemory) {
          memoryIndex++;
          var color = memoryMapColors.default;

          if ((memoryMapDiffFrameBufferPixel * 4) < 0x2000) {
            color = memoryMapColors.rom;
          }

          if ((memoryMapDiffFrameBufferPixel * 4) > 0x2400) {
            color = memoryMapColors.video;
          }

          memoryMapImageData.data[memoryMapDiffFrameBufferPixel * 4] = emu.mmu.memory[memoryMapDiffFrameBufferPixel] | color[0];
          memoryMapImageData.data[(memoryMapDiffFrameBufferPixel * 4) + 1] = emu.mmu.memory[memoryMapDiffFrameBufferPixel] ? color[1] : 0;
          memoryMapImageData.data[(memoryMapDiffFrameBufferPixel * 4) + 2] = emu.mmu.memory[memoryMapDiffFrameBufferPixel] ? color[2] : 0;
          memoryMapImageData.data[(memoryMapDiffFrameBufferPixel * 4) + 3] = 255;
          memoryMapImageData.data[(emu.cpu.registers.pc * 4) + 1] = 255;
          memoryMapImageData.data[(emu.cpu.registers.sp * 4) + 2] = 255;
        }

        return;
      }

      while((memoryMapDiffFrameBufferPixel = gpuRet.memoryMapDiffFrameBuffer.pop()) != null) {
        var color = memoryMapColors.default;

        if ((memoryMapDiffFrameBufferPixel * 4) < 0x2000) {
          color = memoryMapColors.rom;
        }

        if ((memoryMapDiffFrameBufferPixel * 4) > 0x2400) {
          color = memoryMapColors.video;
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
