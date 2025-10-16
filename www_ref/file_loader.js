
function fileDropHandler(event) {
  event.preventDefault();
  event.stopPropagation();
  if (event.dataTransfer.files.length > 1) {
    console.error("Error: Uploaded too many files at the same time. Only upload one at a time, to ensure the order is correct.");
    return;
  }

  var uploadedFile = event.dataTransfer.files[0];

  var fileExt = uploadedFile.name.substring(uploadedFile.name.lastIndexOf('.') + 1);

  if (fileExt === "bin") {
    var reader = new FileReader();

    reader.onload = function (event) {
      if (loadedMemoryFilesList.length === 0) {
        setupCpu();
        objEmu.mmu.memory = new Array();
      }

      memoryOffset = objEmu.mmu.memory.length;
      var byteArray = new Uint8Array(event.target.result);
      for (var i = 0; i < byteArray.byteLength; i++) {
        objEmu.mmu.writeByte(objEmu, (i + memoryOffset),  byteArray[i]);
      }
      loadedMemoryFilesList.push(uploadedFile.name);
    };

    reader.onerror = function (err) {
      console.log("[MAIN::fileDropHandler]: Error loading binary data from file: ", err)
    };

    reader.readAsArrayBuffer(uploadedFile);
  } else if (fileExt === "json") {
    var reader = new FileReader();

    reader.onload = function (event) {
      if (loadedMemoryFilesList.length === 0) {
        setupCpu();
        objEmu.mmu.memory = new Array();
      }

      memoryOffset = objEmu.mmu.memory.length;
      var jsonGame = JSON.parse(event.target.result);
      var jsonData = jsonGame.chunks;
      jsonData.forEach(function(chunkData) {
        for (var i = 0; i < chunkData.data.length; i++) {
          objEmu.mmu.writeByte(objEmu, (i + memoryOffset),  parseInt(chunkData.data[i]));
        }
      });

      loadedMemoryFilesList.push(uploadedFile.name);

    };

    reader.onerror = function (err) {
      console.error("[MAIN::fileDropHandler]: Error loading json data from file: ", err)
    };

    reader.readAsText(uploadedFile);
  } else {
    console.error("[MAIN::fileDropHandler]: Error, ", fileExt, "is not a valid file type. Only *.bin and *.json are valid.");
  }

  usingVideoDriver.renderMemoryMap(runningCPU, anyMemoryUpdated, memoryMapImageData, null, true);
}

function injectJSONDataIntoMemory(emu, filename, memoryOffset = 0, cb) {

  var xhr = new XMLHttpRequest();
  xhr.open('GET', filename, true);

  xhr.onload = function(e) {
    if (this.status === 200) {
      var fileData = this.response;
      var memoryChunks = fileData.chunks;
      memoryChunks.forEach((chunkArray) => {
        var chunkMemoryOffset = parseInt(chunkArray.offset);
        
        var memoryData = chunkArray.data;

        for (var i = 0; i < memoryData.length; i++) {
          emu.mmu.writeByte(emu, (i + memoryOffset + chunkMemoryOffset),  parseInt(memoryData[i]));
        }
      });
      cb();
    }
  };
   
  xhr.send();
}

function injectBinaryDataIntoMemory(emu, filename, memoryOffset = 0, cb) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', filename, true);
  xhr.responseType = 'arraybuffer';

  xhr.onload = function(e) {
    if (this.status === 200) {
      var byteArray = new Uint8Array(this.response);
      for (var i = 0; i < byteArray.byteLength; i++) {
        emu.mmu.writeByte(emu, (i + memoryOffset), byteArray[i]);
      }
      cb();
    }
  };
   
  xhr.send();
}

function loadSpaceInvadersGame() {
  objEmu.ctrl.resetSystem(objEmulatorFactory, true, true, false, true);
  
  injectBinaryDataIntoMemory(objEmu, "../rom/invaders/invaders1.h.bin", 0, () => {
    loadedMemoryFilesList.push("invaders1.h.bin");
    romLoaded++;
    if (romLoaded === 4) {
      objEmu.ctrl.resetSystem(objEmulatorFactory, false, true, true, false);
      objEmu.gpu.initialise(objEmu, objContext.createImageData(objEmu.gpu.resolution[0], objEmu.gpu.resolution[1]));
    }
  });
  injectBinaryDataIntoMemory(objEmu, "../rom/invaders/invaders2.g.bin", 0x800, () => {
    loadedMemoryFilesList.push("invaders2.g.bin");
    romLoaded++;
    if (romLoaded === 4) {
      objEmu.ctrl.resetSystem(objEmulatorFactory, false, true, true, false);
      objEmu.gpu.initialise(objEmu, objContext.createImageData(objEmu.gpu.resolution[0], objEmu.gpu.resolution[1]));
    }
  });
  injectBinaryDataIntoMemory(objEmu, "../rom/invaders/invaders3.f.bin", 0x1000, () => {
    loadedMemoryFilesList.push("invaders3.f.bin");
    romLoaded++;
    if (romLoaded === 4) {
      objEmu.ctrl.resetSystem(objEmulatorFactory, false, true, true, false);
      objEmu.gpu.initialise(objEmu, objContext.createImageData(objEmu.gpu.resolution[0], objEmu.gpu.resolution[1]));
    }
  });
  injectBinaryDataIntoMemory(objEmu, "../rom/invaders/invaders4.e.bin", 0x1800, () => {
    loadedMemoryFilesList.push("invaders4.e.bin");
    romLoaded++;
    if (romLoaded === 4) {
      objEmu.ctrl.resetSystem(objEmulatorFactory, false, true, true, false);
      objEmu.gpu.initialise(objEmu, objContext.createImageData(objEmu.gpu.resolution[0], objEmu.gpu.resolution[1]));
    }
  });
}
