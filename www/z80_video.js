var videoDriver = function() {
  var videoDriverRet = {
    name: "Z80 Arcade"
  };
  
  videoDriverRet.renderGameScreen = function(cpuState, updatedMemoryAddressList, screenImage, renderStateChangeCb) {
    if (typeof(renderStateChangeCb) === "function") {
      renderStateChangeCb(true);
    }

    while((memoryIndex = updatedMemoryAddressList.pop()) != null) {
      var normalizedPixelIndex = memoryIndex - 0x2400;
      var x = normalizedPixelIndex >> 5;
      var y = ~(((normalizedPixelIndex & 0x1f) * 8) & 0xff) & 0xff;

      for(var k = 0; k < 8; ++k) {
        videoDriverRet.writeGamePixel(screenImage, x, y, cpuState.memory[memoryIndex], k);
      }
    }

    if (typeof(renderStateChangeCb) === "function") {
      renderStateChangeCb(false);
    }
  }

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
  }

  return videoDriverRet;
}