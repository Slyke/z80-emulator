
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
      cpuRunning = false;

      if (loadedMemoryFilesList.length === 0) {
        runningCPU = usingCPUCore();
        if (usingCPUCoreOverload) {
          runningCPUOverride = usingCPUCoreOverload();
          runningCPU.interruptCheck = runningCPUOverride.interruptCheck;
          runningCPU.interruptRequest = runningCPUOverride.interruptRequest;
        }
        runningCPU.memory = new Array();
        setupCPUCallbacks();
      }

      memoryOffset = runningCPU.memory.length;
      var byteArray = new Uint8Array(event.target.result);
      for (var i = 0; i < byteArray.byteLength; i++) {
        runningCPU.memory[i + memoryOffset] = byteArray[i];
      }
      loadedMemoryFilesList.push(uploadedFile.name);

      usingVideoDriver.renderMemoryMap(runningCPU, anyMemoryUpdated, memoryMapImageData, null, true);
    };

    reader.onerror = function (err) {
      console.log("Error loading binary data from file: ", err)
    };

    reader.readAsArrayBuffer(uploadedFile);
  } else if (fileExt === "json") {
    var reader = new FileReader();

    reader.onload = function (event) {
      cpuRunning = false;

      if (loadedMemoryFilesList.length === 0) {
        runningCPU = usingCPUCore();
        if (usingCPUCoreOverload) {
          runningCPUOverride = usingCPUCoreOverload();
          runningCPU.interruptCheck = runningCPUOverride.interruptCheck;
          runningCPU.interruptRequest = runningCPUOverride.interruptRequest;
        }
        runningCPU.memory = new Array();
        setupCPUCallbacks();
      }

      memoryOffset = runningCPU.memory.length;
      var jsonGame = JSON.parse(event.target.result);
      var jsonData = jsonGame.chunks;
      jsonData.forEach(function(chunkData) {
        for (var i = 0; i < chunkData.data.length; i++) {
          runningCPU.memory[i + memoryOffset + parseInt(chunkData.offset)] = parseInt(chunkData.data[i]);
        }
      });

      loadedMemoryFilesList.push(uploadedFile.name);

      usingVideoDriver.renderMemoryMap(runningCPU, anyMemoryUpdated, memoryMapImageData, null, true);
    };

    reader.onerror = function (err) {
      console.log("Error loading json data from file: ", err)
    };

    reader.readAsText(uploadedFile);
  } else {
    console.error("Error, ", fileExt, "is not a valid file type. Only *.bin and *.json are valid.");
  }

  usingVideoDriver.renderMemoryMap(runningCPU, anyMemoryUpdated, memoryMapImageData, null, true);
}

function injectJSONDataIntoMemory(memory, filename, memoryOffset = 0, cb) {

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
          memory[i + memoryOffset + chunkMemoryOffset] = parseInt(memoryData[i]);
        }
      });
      cb();
    }
  };
   
  xhr.send();
}

function injectBinaryDataIntoMemory(memory, filename, memoryOffset = 0, cb) {

  var xhr = new XMLHttpRequest();
  xhr.open('GET', filename, true);
  xhr.responseType = 'arraybuffer';

  xhr.onload = function(e) {
    if (this.status === 200) {
      var byteArray = new Uint8Array(this.response);
      for (var i = 0; i < byteArray.byteLength; i++) {
        memory[i + memoryOffset] = byteArray[i];
      }
      cb();
    }
  };
   
  xhr.send();
}

function loadSpaceInvadersGame() {

  injectBinaryDataIntoMemory(runningCPU.memory, "../rom/invaders/invaders1.h.bin", 0, () => {
    loadedMemoryFilesList.push("invaders1.h.bin");
    romLoaded++;
    if (romLoaded === 4) {
      postCPUReady();
    }
  });
  injectBinaryDataIntoMemory(runningCPU.memory, "../rom/invaders/invaders2.g.bin", 0x800, () => {
    loadedMemoryFilesList.push("invaders2.g.bin");
    romLoaded++;
    if (romLoaded === 4) {
      postCPUReady();
    }
  });
  injectBinaryDataIntoMemory(runningCPU.memory, "../rom/invaders/invaders3.f.bin", 0x1000, () => {
    loadedMemoryFilesList.push("invaders3.f.bin");
    romLoaded++;
    if (romLoaded === 4) {
      postCPUReady();
    }
  });
  injectBinaryDataIntoMemory(runningCPU.memory, "../rom/invaders/invaders4.e.bin", 0x1800, () => {
    loadedMemoryFilesList.push("invaders4.e.bin");
    romLoaded++;
    if (romLoaded === 4) {
      postCPUReady();
    }
  });
}
