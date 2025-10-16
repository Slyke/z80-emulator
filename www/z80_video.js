if (!videoDriver) {
  var videoDriver = [];
}
videoDriver.push(function() {
  var videoDriverRet = {
    name: "Z80 Arcade",
    resolution: [224, 256],
    redrawing: false,
    memoryMapRendering: false,
    videoMemory: []
  };

  videoDriverRet.renderGameScreen = function(cpuState, memoryAddressList, screenImage, renderStateChangeCb) {
    videoDriverRet.redrawing = true;
    if (typeof(renderStateChangeCb) === "function") {
      renderStateChangeCb(true);
    }

    while((memoryIndex = memoryAddressList.pop()) != null) {
      var normalizedPixelIndex = memoryIndex - 0x2400;
      var x = normalizedPixelIndex >> 5;
      var y = ~(((normalizedPixelIndex & 0x1f) * 8) & 0xff) & 0xff;

      for(var k = 0; k < 8; ++k) {
        videoDriverRet.writeGamePixel(screenImage, x, y, cpuState.memory[memoryIndex], k);
      }
    }

    videoDriverRet.redrawing = false;
    if (typeof(renderStateChangeCb) === "function") {
      renderStateChangeCb(false);
    }
  };

  videoDriverRet.writeGamePixel = function(screenImage, x, y, v, c) {
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