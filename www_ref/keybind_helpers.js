
function keyEvents(event, eventType) {
  if (eventType === "press") {
    if (event.key === 'R') {
      cpuRunning = false;
      setupCPUCallbacks();
    }

    if (event.key === 'Q') {
      objEmu.mmu.memory = new Array(0x10000).fill(0);
      loadedMemoryFilesList = [];
      usingVideoDriver.renderMemoryMap(runningCPU, anyMemoryUpdated, memoryMapImageData, null, true);
    }

    if (event.key === 'l') { // 1
      if (!cpuRunning) {
        objEmu.ctrl.cpuEval(objEmu);
        objEmu.gpu.renderMemoryMap(objEmu, memoryMapImageData, true);
      }
    }
    if (event.key === 'L') { // 1 interrupt
      if (!cpuRunning) {
        objEmu.ctrl.cpuRunUntilInterruptCheck(objEmu);
        objEmu.gpu.renderMemoryMap(objEmu, memoryMapImageData, true);
      }
    }

    if (event.key === 'k') { // 10
      if (!cpuRunning) {
        for (var i = 0; i < 10; i++) { objEmu.ctrl.cpuEval(objEmu); }
        objEmu.gpu.renderMemoryMap(objEmu, memoryMapImageData, true);
      }
    }
    if (event.key === 'K') { // 10 interrupt
      if (!cpuRunning) {
        for (var i = 0; i < 10; i++) { objEmu.ctrl.cpuRunUntilInterruptCheck(objEmu); }
        objEmu.gpu.renderMemoryMap(objEmu, memoryMapImageData, true);
      }
    }

    if (event.key === 'j') { // 100
      if (!cpuRunning) {
        for (var i = 0; i < 100; i++) { objEmu.ctrl.cpuEval(objEmu); }
        objEmu.gpu.renderMemoryMap(objEmu, memoryMapImageData, true);
      }
    }
    if (event.key === 'J') { // 100 interrupt
      if (!cpuRunning) {
        for (var i = 0; i < 100; i++) { objEmu.ctrl.cpuRunUntilInterruptCheck(objEmu); }
        objEmu.gpu.renderMemoryMap(objEmu, memoryMapImageData, true);
      }
    }

    if (event.key === 'h') { // 1000
      if (!cpuRunning) {
        for (var i = 0; i < 1000; i++) { objEmu.ctrl.cpuEval(objEmu); }
        objEmu.gpu.renderMemoryMap(objEmu, memoryMapImageData, true);
      }
    }
    if (event.key === 'H') { // 1000 interrupt
      if (!cpuRunning) {
        for (var i = 0; i < 1000; i++) { objEmu.ctrl.cpuRunUntilInterruptCheck(objEmu); }
        objEmu.gpu.renderMemoryMap(objEmu, memoryMapImageData, true);
      }
    }

    if (event.key === 'g') { // 10000
      if (!cpuRunning) {
        for (var i = 0; i < 10000; i++) { objEmu.ctrl.cpuEval(objEmu); }
        objEmu.gpu.renderMemoryMap(objEmu, memoryMapImageData, true);
      }
    }
    if (event.key === 'G') { // 10000 interrupt
      if (!cpuRunning) {
        for (var i = 0; i < 10000; i++) { objEmu.ctrl.cpuRunUntilInterruptCheck(objEmu); }
        objEmu.gpu.renderMemoryMap(objEmu, memoryMapImageData, true);
      }
    }

    if (event.key === 'p') {
      objEmu.ctrl.emulationRunning = !objEmu.ctrl.emulationRunning;
      if (objEmu.ctrl.emulationRunning) {
        objEmu.ctrl.start(objEmu);
      } else {
        objEmu.ctrl.pause(objEmu);
      }
    }
    if (event.key === 'm') {
      showMemoryInspector = !showMemoryInspector;
      localStorage.setItem('showMemoryInspector', showMemoryInspector);

      if (showMemoryInspector) {
        usingVideoDriver.renderMemoryMap(runningCPU, anyMemoryUpdated, memoryMapImageData, null, true);
      }
    }
  } else {
    objEmu.hwio.getKeyBoardKeysHooks(objEmu, event, eventType);
  }
}
