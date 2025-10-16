if (!videoDriver) {
  var videoDriver = [];
}
videoDriver.push(function() {
  var videoDriverRet = {
    name: "Gameboy",
    resolution: [160, 144],
    redrawing: false,
    memoryMapRendering: false,
    videoMemory: []
  };

  const memorySegments = Object.freeze({
    vRamStart: 0x8000,
    vRamEnd: 0x9fff,
    extRamStart: 0xa000,
    extRamEnd: 0xbfff,
    oamStart: 0xfe00,
    deviceStart: 0xff00,
    deviceEnd: 0xff7f
  });

  const gpuLocs = Object.freeze({
    lcdc:       0xff40,
    stat:       0xff41,
    scy:        0xff42,
    scx:        0xff43,
    ly:         0xff44,
    lyc:        0xff45,
    bgp:        0xff47,
    obp0:       0xff48,
    obp1:       0xff49,
    wy:         0xff4a,
    wx:         0xff4b,
    oamStart:   0xfe00,
    oamEnd:     0xff4b,
    vBlankTime: 70224
  });

  const cpuInterrupts = Object.freeze({
    vBlank: 0x40,
    LCDC:   0x48,
    timer:  0x50,
    serial: 0x58,
    HILO:   0x60
  });

  const gpuTileMap = Object.freeze({
    height: 32,
    width: 32,
    start0: 0x9800,
    start1: 0x9c00,
    length: 0x0400
  });

  var gpuMode = 0;
  var gpuClock = 0;
  var gpuScreenVLine = 0;

  var updateLY = function(cpuState, newLine) {
    cpuState.memory[gpuLocs.ly] = newLine & 0xff;
    var stat = cpuState.memory[gpuLocs.stat];

    if (cpuState.memory[gpuLocs.ly] === cpuState.memory[gpuLocs.lyc]) {
      cpuState.memory[gpuLocs.stat] = (stat | (1 << 2));
      if (stat & (1 << 6)) {
        cpuState.requestInterrupt(cpuInterrupts.LCDC);
      }
    } else {
      cpuState.memory[gpuLocs.stat] = (stat & (0xff - (1 << 2)));
    }
  };

  var drawFrame = function(cpuState, screenImage) {
    var lcdc = cpuState.memory[gpuLocs.lcdc];

    var drawEnabled = (lcdc >> 7) & 1;

    if (drawEnabled) {
      updateFrameBuffer(cpuState, screenImage, lcdc);
    }
  };

  var drawPixel = function(screenImage, x, y, c) {
    screenImage[(y * 160) + x] = c;
  }

  var readTileData = function(cpuState, tileIndex, dataStart, tileSize = 0x10) {
    var tileData = new Array().fill(0x00);

    var tileAddressStart = (dataStart + (tileIndex * 0x10));
    for (var i = tileAddressStart; i < tileAddressStart + tileSize; i++) {
        tileData.push(cpuState.memory[i]);
    };

    return tileData;
  };

  var updateFrameBuffer = function(cpuState, screenImage, lcdc) {
    if (!((lcdc >> 5) & 1)) {
      return;
    }

    var tileBuffer = new Array(256 * 256);
    var tileMapStart = ((lcdc >> 5) & 1) ? gpuTileMap.start1 : gpuTileMap.start0;

    var screenDataStart;
    var signedIndex = false;

    if ((lcdc >> 4) & 1) {
      screenDataStart = memorySegments.vRamStart;
    } else {
      screenDataStart = 0x8800;
      signedIndex = true;
    }

    // for (var i = 0; i < gpuTileMap.length; i++) {
    //   var tileIndex = cpuState.memory[(i + mapStart)];
      
    //   if (signedIndex) {
    //     tileIndex = tileIndex & 0x80 ? tileIndex - 0xff : tileIndex;
    //   }

    //   var tileData = this.readTileData(cpuState, tileIndex, screenDataStart);
    //   var xPos = (i % gpuTileMap.width);
    //   var yPos = ((i / gpuTileMap.height) | 0);
    //   // Draw Tile
    // }

    var windowX = cpuState.memory[gpuLocs.wx] - 7;
    var windowY = cpuState.memory[gpuLocs.wy];

    for (var x = Math.max(0, -windowX); x < Math.min(videoDriverRet.resolution[0], videoDriverRet.resolution[0] - windowX); x++) {
      for (var y = Math.max(0, -windowY); y < Math.min(videoDriverRet.resolution[1], videoDriverRet.resolution[1] - windowY); y++) {
        var pixelColor = buffer[(x & 255) + (y & 255) * 256];
        drawPixel(screenImage, (x + windowX), (y + windowY), pixelColor);
      }
    }
  };

  videoDriverRet.renderGameScreen = function(cpuState, memoryAddressList, screenImage, renderStateChangeCb) {
    gpuClock += cpuState.cycles;

    var vBlank = false;

    switch (gpuMode) {
      case 0:
        if (gpuClock >= 204) {
          gpuClock -= 204;
          gpuScreenVLine++;
          updateLY(cpuState, gpuScreenVLine);
        }

        if (gpuScreenVLine == 144) {
          gpuMode = 1;
          vBlank = true;
          cpuState.interruptCheck(cpuState, cpuInterrupts.vBlank);
          drawFrame(cpuState, screenImage);
        } else {
          gpuMode = 2;
        }
        break;

      case 1:
        if (gpuClock >= 456) {
          gpuClock -= 456;
          gpuScreenVLine++;
          if (gpuScreenVLine > 153) {
            gpuScreenVLine = 0;
            gpuMode = 2;
          }
          updateLY(cpuState, gpuScreenVLine);
        }
        break;

      case 2:
        if (gpuClock >= 80) {
          gpuClock -= 80;
          gpuMode = 3;
        }
        break;

      case 3:
        if (gpuClock >= 172) {
          gpuClock -= 172;
          // Draw scanline
          gpuMode = 0;
        }
      break;
    }

    return vBlank;
  };

  videoDriverRet.memoryUpdate = function(cpuState, memoryList, address, value,  fullMemorySync = false) {
    if (videoDriverRet.videoMemory.indexOf(address) === -1) {
      videoDriverRet.videoMemory.push(address);
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

        if ((i * 4) < 0x00ff) { // BIOS
          color = 0x22;
        }

        if ((i * 4) > 0x0100 && (i * 4) < 0x014f) { // Cartridge header
          color = 0x22;
        }

        if ((i * 4) > 0x4000 && (i * 4) < 0x7fff) { // ROM
          color = 0x22;
        }

        if ((i * 4) > 0x0150 && (i * 4) < 0x3fff) { // ROM, bank 0
          color = 0x22;
        }

        if ((i * 4) > 0x4000 && (i * 4) < 0x7fff) { // ROM, other banks
          color = 0x22;
        }

        if ((i * 4) > 0x8000 && (i * 4) < 0x9fff) { // video ram
          color = 0x99;
        }

        if ((i * 4) > 0xa000 && (i * 4) < 0xbfff) { // external ram (save files)
          color = 0x77;
        }

        if ((i * 4) > 0xc000 && (i * 4) < 0xdfff) { // working ram
          color = 0xbb;
        }

        if ((i * 4) > 0xe000 && (i * 4) < 0xfdff) { // working ram (shadow copy)
          color = 0xbb;
        }

        if ((i * 4) > 0xff00 && (i * 4) < 0xff7f) { // memory map for IO
          color = 0x55;
        }

        if ((i * 4) > 0xff80 && (i * 4) < 0xffff) { // zero-page ram
          color = 0x55;
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
