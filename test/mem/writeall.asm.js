// Inject Into Memory:
runningCPU.memory[0x00] = 0x01;
runningCPU.memory[0x01] = 0x0f;
runningCPU.memory[0x02] = 0x00;
runningCPU.memory[0x03] = 0x3e;
runningCPU.memory[0x04] = 0x66;
runningCPU.memory[0x05] = 0x31;
runningCPU.memory[0x06] = 0x0f;
runningCPU.memory[0x07] = 0x00;
runningCPU.memory[0x08] = 0x02; // JMP2HERE
runningCPU.memory[0x09] = 0x3c;
runningCPU.memory[0x0a] = 0x03;
runningCPU.memory[0x0b] = 0x33;
runningCPU.memory[0x0c] = 0xc3;
runningCPU.memory[0x0d] = 0x08;
runningCPU.memory[0x0e] = 0x00;

// Overwrite Memory
runningCPU.memory = [
  0x01,
  0x0f,
  0x00,
  0x3e,
  0x66,
  0x31,
  0x0f,
  0x00,
  0x02, // JMP2HERE
  0x3c,
  0x03,
  0x33,
  0xc3,
  0x08,
  0x00
];