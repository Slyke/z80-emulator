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
      memoryMapDiffFrameBuffer: [],
      videoArrayDiffFrameBuffer: [],
      videoRawData: null
    };

    gpuRet.initialise = function(emu, initialVideo) {
      emu.gpu.videoRawData = initialVideo;
    };

    gpuRet.getVideoDisplay = function(emu) {
      return emu.gpu.videoRawData;
    }

    gpuRet.renderVideo = function(emu, renderStateChangeCb) {
      if (typeof(renderStateChangeCb) === "function") {
        renderStateChangeCb(true);
      }
  
      while((memoryIndex = emu.gpu.videoArrayDiffFrameBuffer.pop()) != null) {
        var normalizedPixelIndex = memoryIndex - 0x2400;
        var x = normalizedPixelIndex >> 5;
        var y = ~(((normalizedPixelIndex & 0x1f) * 8) & 0xff) & 0xff;
  
        for(var k = 0; k < 8; ++k) {
          emu.gpu.writeGamePixel(emu.gpu.videoRawData, x, y, emu.mmu.memory[memoryIndex], k);
        }
      }

      if (typeof(renderStateChangeCb) === "function") {
        renderStateChangeCb(false);
      }
    };

    gpuRet.writeGamePixel = function(screenImage, x, y, v, c) {
      y = y - c;
  
      var bt = (v >> c) & 1;
      var r = 0;
      var g = 0;
      var b = 0;
      var a = 0xff;
  
      if (bt) {
        if ((y >= 0xb8 && y <= 0xee && x >= 0 && x <= 0xdf) || (y >= 0xf0 && y <= 0xf7 && x >= 0xf && x <= 0x85)) {
          g = 0xff;
        } else if (y >= (0xf7 - 0xd7) && y >= (0xf7 - 0xb8) && x >= 0 && x <= 0xe9) {
          g = 0xff;
          b = 0xff;
          r = 0xff;
        } else {
          r = 0xff;
        }
      }
      var imageIndex = (x * 4) + (y * (4 * 0xe0));
  
      screenImage.data[imageIndex] = r;
      screenImage.data[imageIndex + 1] = g;
      screenImage.data[imageIndex + 2] = b;
      screenImage.data[imageIndex + 3] = a;
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
