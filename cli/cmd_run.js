
const readline = require('readline');
var fs = require('fs');

var cpu = require('../cpu');

readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);

var runningCPU = cpu();

const STEPPER = true;
const DISASSEMBLER_OUTPUT = true;

function pad(str, size, withChar = "0") {
  var s = str + "";
  while (s.length < size) s = withChar + s;
  return s;
}

function printMemorySlice(cpuState, pc, lower, upper) {
  lower = ((pc - lower) < 0) ? 0 : lower;

  var memorySlice = cpuState.memory.slice(pc - lower, pc + upper);
  var memoryOutput = memorySlice.map((index) => { return pad(index.toString(16), 2); });
  return memoryOutput;
};

function printDisassemblerOutputHelperGrid() {
  console.log("Execution Count: | Address    |   OP Code   |   Mnem    | IREG  | OREG |   P1  |  P2   | PTR ");
}

function printMemoryTrace(cpuState) {
  console.log(" ");
  console.log("Last instruction executed: ");
  printDisassemblerOutputHelperGrid();
  console.log(getDisassembedInstruction(runningCPU));
  console.log("CPU Registers: ");
  var flagsOut = Object.keys(cpuState.flags).reduce((p, c) => { return { ...p, [c]: (cpuState.flags[c] & 0xff).toString(16) }; }, {});
  console.log(JSON.stringify(flagsOut, null, 2));
  console.log(" ");
  console.log("Conditional Codes: ");
  console.log(JSON.stringify(cpuState.cc, null, 2));
  console.log(" ");
  console.log("Debug Helpers: ");
  console.log(JSON.stringify(cpuState.db, null, 2));
  console.log(" ");
  console.log("Memory around this address: (-6, +6)");
  var memoryOutput = printMemorySlice(cpuState, cpuState.flags.pc, 6, 6);
  console.log(memoryOutput);
  console.log(" ");
}

function getDisassembedInstruction(runningCPU) {
  var disObj = runningCPU.disassemble8080OP(runningCPU, runningCPU.flags.pc);

  var output = "";
  output += `E#: ${pad(disObj.execCount, 8)}        `;
  output += `PC: ${pad(disObj.programCounter.toString(16), 4)}        `;
  output += `(${pad(disObj.opCodeHex.toString(16), 2)})    ${pad(disObj.opCode, 8, " ")}      `;
  output += `${pad(disObj.ireg, 3, " ")}    `;
  output += `${pad(disObj.oreg, 3, " ")}      `;
  output += `${pad(pad(disObj.para1.toString(16), 2), 3, " ")}    `;
  output += `${pad(pad(disObj.para2.toString(16), 2), 3, " ")}      `;
  output += `${pad(disObj.ptr, 1, " ")}`;

  return output;
}

function injectBinaryDataIntoMemory(memory, filename, memoryOffset = 0) {
  fileData = fs.readFileSync(filename, { encoding: 'binary' });

  for (var i = 0; i < fileData.length; i++) {
    memory[i + memoryOffset] = fileData.charCodeAt(i);
  }
}

function cpuCycle(disassembleShow = false) {

  if (disassembleShow) {
    console.log(getDisassembedInstruction(runningCPU));
  }
  
  var ret = runningCPU.emulate8080OP(runningCPU);

  if (ret > 0) {
    console.log(" ");
    console.log("-----------------------------------------");
    console.log("CPU Halted ");
    console.log("Error: Unimplemented instruction.");
    printMemoryTrace(runningCPU);
    process.exit(1);
  }
}

function init() {

  runningCPU.memory = new Array(0x10000).fill(0);

  injectBinaryDataIntoMemory(runningCPU.memory, "./rom/invaders/invaders.h");
  injectBinaryDataIntoMemory(runningCPU.memory, "./rom/invaders/invaders.g", 0x800);
  injectBinaryDataIntoMemory(runningCPU.memory, "./rom/invaders/invaders.f", 0x1000);
  injectBinaryDataIntoMemory(runningCPU.memory, "./rom/invaders/invaders.e", 0x1800);
  
  process.on('SIGINT', function() {
    console.log("Caught interrupt signal");

    runningCPU.printMemoryTrace(runningCPU);
    process.exit();
  });

  if (STEPPER) {
    console.log("Press space to step emulation.");
    console.log("Press 'd' for CPU state.");
    console.log("CTRL+C to exit.");

    if (DISASSEMBLER_OUTPUT) {
      printDisassemblerOutputHelperGrid();
    }
  
    process.stdin.on('keypress', (str, key) => {
      if (str === 'd') {
        printMemoryTrace(runningCPU);
      } else if (str === ' ') {
        cpuCycle(DISASSEMBLER_OUTPUT);
      } else if (key.ctrl && key.name === 'c') {
          process.exit();
      } else {
        console.log("Unknown Input: ", str, key);
      }
    });
  } else {
    if (DISASSEMBLER_OUTPUT) {
      printDisassemblerOutputHelperGrid();
    }
    setInterval(() => { cpuCycle(DISASSEMBLER_OUTPUT); }, 2000);
  }
}

init();

