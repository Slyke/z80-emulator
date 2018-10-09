
function keyEvents(event, eventType) {
  if (eventType === "press") {
    if (event.key === 'R') {
      cpuRunning = false;
      var currentMemory = runningCPU.memory.slice(0);
      runningCPU = usingCPUCore();
      if (usingCPUCoreOverload) {
        runningCPUOverride = usingCPUCoreOverload();
        runningCPU.interruptCheck = runningCPUOverride.interruptCheck;
        runningCPU.interruptRequest = runningCPUOverride.interruptRequest;
      }
      
      runningCPU.memory = currentMemory;

      setupCPUCallbacks();
    }
    if (event.key === 'Q') {
      runningCPU.memory = new Array(0x10000).fill(0);
      loadedMemoryFilesList = [];
      usingVideoDriver.renderMemoryMap(runningCPU, anyMemoryUpdated, memoryMapImageData, null, true);
    }
    if (event.key === 'l') { // 1
      if (!cpuRunning) {
        cpuExec();
        usingVideoDriver.renderGameScreen(runningCPU, usingVideoDriver.videoMemory, gameScreenImageData);
        usingVideoDriver.renderMemoryMap(runningCPU, anyMemoryUpdated, memoryMapImageData, null, true);
      }
    }
    if (event.key === 'k') { // 10
      if (!cpuRunning) {
        for (var i = 0; i < 10; i++) { cpuExec(); }
        usingVideoDriver.renderGameScreen(runningCPU, usingVideoDriver.videoMemory, gameScreenImageData);
        usingVideoDriver.renderMemoryMap(runningCPU, anyMemoryUpdated, memoryMapImageData, null, true);
      }
    }
    if (event.key === 'j') { // 100
      if (!cpuRunning) {
        for (var i = 0; i < 100; i++) { cpuExec(); }
        usingVideoDriver.renderGameScreen(runningCPU, usingVideoDriver.videoMemory, gameScreenImageData);
        usingVideoDriver.renderMemoryMap(runningCPU, anyMemoryUpdated, memoryMapImageData, null, true);
      }
    }
    if (event.key === 'h') { // 1000
      if (!cpuRunning) {
        for (var i = 0; i < 1000; i++) { cpuExec(); }
        usingVideoDriver.renderGameScreen(runningCPU, usingVideoDriver.videoMemory, gameScreenImageData);
        usingVideoDriver.renderMemoryMap(runningCPU, anyMemoryUpdated, memoryMapImageData, null, true);
      }
    }
    if (event.key === 'g') { // 10000
      if (!cpuRunning) {
        for (var i = 0; i < 10000; i++) { cpuExec(); }
        usingVideoDriver.renderGameScreen(runningCPU, usingVideoDriver.videoMemory, gameScreenImageData);
        usingVideoDriver.renderMemoryMap(runningCPU, anyMemoryUpdated, memoryMapImageData, null, true);
      }
    }
    if (event.key === 'p') {
      cpuRunning = !cpuRunning;
      runCPU();
    }
    if (event.key === 'm') {
      showMemoryInspector = !showMemoryInspector;
      localStorage.setItem('showMemoryInspector', showMemoryInspector);

      if (showMemoryInspector) {
        usingVideoDriver.renderMemoryMap(runningCPU, anyMemoryUpdated, memoryMapImageData, null, true);
      }
    }
  } else {
  if (runningCPUOverride) {
    runningCPUOverride.getKeyBoardKeysHooks(event, eventType, runningCPU);
  } else {
    runningCPU.getKeyBoardKeysHooks(event, eventType, runningCPU);
  }

  }
}
