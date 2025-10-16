if (!videoDriver) {
  var videoDriver = [];
}
videoDriver.push(function() {
  var videoDriverRet = {
    name: "SMS",
    resolution: [342, 262],
    redrawing: false,
    memoryMapRendering: false,
    videoMemory: []
  };

  var colorRAM = new Uint8Array(0x20).fill(0xff);
  var videoRAM = new Uint8Array(0x4000).fill(0x00);
  var videoDisplayProcessoryRegisters = new Uint8Array(0x0f).fill(0xff);

  videoDriverRet.renderGameScreen = function(cpuState, memoryAddressList, screenImage, renderStateChangeCb) {
    videoDriverRet.redrawing = true;
    if (typeof(renderStateChangeCb) === "function") {
      renderStateChangeCb(true);
    }

    var a = 0xff;

    while((memoryIndex = memoryAddressList.pop()) != null) {
      var normalizedPixelIndex = memoryIndex - 0x4000;
      var imageIndex = (normalizedPixelIndex & 0x1f) * 3;
      var x = normalizedPixelIndex >> 5;
      var y = ~(((normalizedPixelIndex & 0x1f) * 8) & 0xff) & 0xff;

      screenImage.data[imageIndex] = cpuState.memory[memoryIndex];
      screenImage.data[imageIndex + 1] = cpuState.memory[memoryIndex];
      screenImage.data[imageIndex + 2] = cpuState.memory[memoryIndex];
      screenImage.data[imageIndex + 3] = a;
    }

    videoDriverRet.redrawing = false;
    if (typeof(renderStateChangeCb) === "function") {
      renderStateChangeCb(false);
    }
  };

  videoDriverRet.memoryUpdate = function(cpuState, memoryList, address, value, fullMemorySync = false) {
    if (address >= 0x2400) {
      if (videoDriverRet.videoMemory.indexOf(address) === -1) {
        videoDriverRet.videoMemory.push(address);
      }
    }
  };

  videoDriverRet.renderMemoryMap = function(cpuState, memoryList, memoryMapImageData, renderStateChangeCb, fullRender = false) {

    videoDriverRet.memoryMapRendering = true;
    if (typeof(renderStateChangeCb) === "function") {
      renderStateChangeCb(true);
    }
  
    if (fullRender) {
      for (var i = 0; i < cpuState.memory.length; i++) {
        var color = 0x00;
        var colorRAM = 0x00;
        if ((i * 4) < 0x2000) { // ROM
          color = 0x22;
        }
        if ((i * 4) > 0x2400 && (i * 4) < 0x4000) { // Video
          color = 0x55;
        }
        if ((i * 4) > 0x4000) { // RAM
          colorRAM = 0x55;
        }
        memoryMapImageData.data[(i * 4)] = cpuState.memory[i];
        memoryMapImageData.data[(i * 4) + 1] = cpuState.memory[i] ? (color | colorRAM) : 0;
        memoryMapImageData.data[(i * 4) + 2] = cpuState.memory[i] ? color : 0;
      }
      memoryMapImageData.data[(cpuState.flags.pc * 4) + 1] = 255;
      memoryMapImageData.data[(cpuState.flags.sp * 4) + 2] = 255;
    } else {
      while((memoryIndex = memoryList.pop()) != null) {
        var color = 0x00;
        if ((memoryIndex * 4) < 0x2000) { // ROM
          color = 0x22;
        }
        if ((memoryIndex * 4) > 0x2400) { // Video
          color = 0x55;
        }
        memoryMapImageData.data[memoryIndex * 4] = cpuState.memory[memoryIndex];
        memoryMapImageData.data[(memoryIndex * 4) + 1] = cpuState.memory[memoryIndex] ? color : 0;
        memoryMapImageData.data[(memoryIndex * 4) + 2] = cpuState.memory[memoryIndex] ? color : 0;
        memoryMapImageData.data[(memoryIndex * 4) + 3] = 255;
        memoryMapImageData.data[(cpuState.flags.pc * 4) + 1] = 255;
        memoryMapImageData.data[(cpuState.flags.sp * 4) + 2] = 255;
      }
    }
  
    videoDriverRet.memoryMapRendering = false;
    if (typeof(renderStateChangeCb) === "function") {
      renderStateChangeCb(false);
    }
  }

  return videoDriverRet;
});