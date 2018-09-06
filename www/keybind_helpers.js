
function keyEvents(event, eventType) {
  if (eventType === "press") {
    if (event.key === 'R') {
      cpuRunning = false;
      var currentMemory = runningCPU.memory.slice(0);
      runningCPU = z80CPU();

      runningCPU.memory = currentMemory;

      setupCPUCallbacks();
    }
    if (event.key === 'Q') {
      runningCPU.memory = new Array(0x10000).fill(0);
      loadedMemoryFilesList = [];
      renderMemoryMap(runningCPU, runningCPU.db.memoryUpdated, true);
    }
    if (event.key === 'l') { // 1
      if (!cpuRunning) {
        cpuExec();
        renderGameScreen(runningCPU, runningCPU.db.videoMemoryUpdated);
        renderMemoryMap(runningCPU, runningCPU.db.memoryUpdated, true);
      }
    }
    if (event.key === 'k') { // 10
      if (!cpuRunning) {
        for (var i = 0; i < 10; i++) { cpuExec(); }
        renderGameScreen(runningCPU, runningCPU.db.videoMemoryUpdated);
        renderMemoryMap(runningCPU, runningCPU.db.memoryUpdated, true);
      }
    }
    if (event.key === 'j') { // 100
      if (!cpuRunning) {
        for (var i = 0; i < 100; i++) { cpuExec(); }
        renderGameScreen(runningCPU, runningCPU.db.videoMemoryUpdated);
        renderMemoryMap(runningCPU, runningCPU.db.memoryUpdated, true);
      }
    }
    if (event.key === 'h') { // 1000
      if (!cpuRunning) {
        for (var i = 0; i < 1000; i++) { cpuExec(); }
        renderGameScreen(runningCPU, runningCPU.db.videoMemoryUpdated);
        renderMemoryMap(runningCPU, runningCPU.db.memoryUpdated, true);
      }
    }
    if (event.key === 'g') { // 10000
      if (!cpuRunning) {
        for (var i = 0; i < 10000; i++) { cpuExec(); }
        renderGameScreen(runningCPU, runningCPU.db.videoMemoryUpdated);
        renderMemoryMap(runningCPU, runningCPU.db.memoryUpdated, true);
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
        renderMemoryMap(runningCPU, runningCPU.db.memoryUpdated, true);
      }
    }
  } else if (eventType === "down") {
    if (cpuCanStart) {
      if (event.key === 'a') {
        runningCPU.hwIntPorts[0x01] |= 0x20;
      }

      if (event.key === 'd') {
        runningCPU.hwIntPorts[0x01] |= 0x40;
      }

      if (event.key === ' ') {
        runningCPU.hwIntPorts[0x01] |= 0x10;;
      }

      if (event.key === '1') {
        runningCPU.hwIntPorts[0x01] |= 0x04;;
      }

      if (event.key === 'c') {
        runningCPU.hwIntPorts[0x01] |= 0x01;;
      }
    }
  } else if (eventType === "up") {
    if (cpuCanStart) {
      if (event.key === 'a') {
        runningCPU.hwIntPorts[0x01] &= 0xff - 0x20;
      }

      if (event.key === 'd') {
        runningCPU.hwIntPorts[0x01] &= 0xff - 0x40;
      }

      if (event.key === ' ') {
        runningCPU.hwIntPorts[0x01] &= 0xff - 0x10;;
      }

      if (event.key === '1') {
        runningCPU.hwIntPorts[0x01] &= 0xff - 0x04;;
      }

      if (event.key === 'c') {
        runningCPU.hwIntPorts[0x01] &= 0xff - 0x01;;
      }
    }
  }
}
