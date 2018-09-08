const fs = require('fs');
var cpu = require('../cpu');

var rtoCombineFiles = false;
var rtoQuiet = false;

var decompileFiles = [];

const fileHeadingHelper = '; Address  |   OP Code   |   Mnem    | IREG  | OREG |   P1  |  P2   | PTR | opBytes | Cycles | CondCycle  | \n';

for (var i = 2; i < process.argv.length; i++) {
  if (process.argv[i] === "-c") {
    rtoCombineFiles = true;
    continue;
  }
  if (process.argv[i] === "-q") {
    rtoQuiet = true;
    continue;
  }
  if (fs.existsSync(process.argv[i])) {
    decompileFiles.push(process.argv[i])
  }
}

function loadBinaryToMemory(fileList, combineFiles) {

  var memoryOffset = 0;
  var memory = [];

  var ret = [];

  fileList.forEach((fileIndex) => {
    if (!rtoQuiet) {
      console.log(`Reading File: ${fileIndex}`);
    }

    fileData = fs.readFileSync(fileIndex, { encoding: 'binary' });

    if (!rtoQuiet) {
      console.log(`Memory Size: ${"0x" + fileIndex.length.toString(16)} (${fileIndex.length})`);
      console.log(`Memory Injection Offset: ${"0x" + memoryOffset.toString(16)} (${memoryOffset})`);
      console.log(" ");
    }

    for (var k = 0; k < fileData.length; k++) {
      memory[k + memoryOffset] = fileData.charCodeAt(k);
    }

    if (combineFiles) {
      memoryOffset = memory.length;
    } else {
      ret.push({ name: fileIndex, data: memory })
    }
  });

  if (combineFiles) {
    ret.push({ name: fileList[0], data: memory });
  }

  return ret;
}

function normaliseName(fullFileName) {
  var normalizedFileName = fullFileName.replace(/\\/g,"/");
  normalizedFileName = normalizedFileName.substring(normalizedFileName.lastIndexOf('/') + 1);
  var outputFileName = normalizedFileName + '.asm';

  return outputFileName;
}

function getDecompiledString(state, pc) {

  var disObj = state.disassemble8080OP(state, pc, memoryOffset = 0);

  if (disObj.error) {
    return { error: `Warning: Error at: ${"0x" + pad(pc.toString(16), 4)}    Further disassembled instructions beyond here maybe incorrect!   Memory Offset: ${"0x" + memoryOffset}    Disassembler: ${JSON.stringify(disObj)}   Memory at this location: ${state.memory[pc] ? "0x" + state.memory[pc].toString(16) : state.memory[pc]}  Memory around this location (${(pc - 8).toString(16)}-${(pc + 8).toString(16)}):  ${state.memory.slice(pc - 8, pc + 8).map(index => index != null ? index.toString(16) : '0x00')}`}
  }

  var lineOutput = "";
  lineOutput += `   ${pad((parseInt("0x" + disObj.programCounter) + memoryOffset).toString(16), 4)}        `;
  lineOutput += `(${pad(disObj.opCodeHex.toString(16), 2)})     `; // Change to disObj.z80OPCode for original Z80 instruction set.
  lineOutput += `${pad(disObj.opCode, 10, " ")}      `;
  lineOutput += `${pad(disObj.ireg, 3, " ")}    `;
  lineOutput += `${pad(disObj.oreg, 3, " ")}     `;
  lineOutput += `${pad(disObj.para1 ? pad(disObj.para1.toString(16), 2) : '', 3, " ")}    `;
  lineOutput += `${pad(disObj.para2 ? pad(disObj.para2.toString(16), 2) : '', 3, " ")}      `;
  lineOutput += `${pad(disObj.ptr, 1, " ")}      `;
  lineOutput += `${pad(disObj.opBytes, 1, " ")}         `;
  lineOutput += `${pad(pad(disObj.cycles, 2), 1, " ")}       `;
  lineOutput += `${pad(disObj.cycleConditional, 1, " ")}`;
  lineOutput += "\n";

  return { disassemblyLine: lineOutput, objDisassemble: disObj };

}

function decompileBinary(fileList, combineFiles) {

  var decompilingCPU = cpu();
  var memoryFileList = loadBinaryToMemory(fileList, combineFiles);

  memoryFileList.forEach((fileDataIndex) => {

    decompilingCPU.memory = fileDataIndex.data;

    var commandPCOffset = 0;

    var outputFileName = combineFiles ? normaliseName(fileList[0]) : normaliseName(fileDataIndex.name)
    if (!rtoQuiet) {
      console.log(`Started Writing File: ${outputFileName}`);
      console.log(`Memory Size: ${"0x" + decompilingCPU.memory.length.toString(16)} (${decompilingCPU.memory.length})`);
    }

    fs.writeFileSync(outputFileName, fileHeadingHelper);

    for (var k = 0; k < decompilingCPU.memory.length; k++) {
      var disassemblerRet = getDecompiledString(decompilingCPU, (k + commandPCOffset));
      
      if (disassemblerRet.disassemblyLine) {
        fs.appendFileSync(outputFileName, disassemblerRet.disassemblyLine);
        commandPCOffset += (disassemblerRet.objDisassemble.opBytes - 1);
      } else {
        // If it errors because it's reading beyond memory, then break instead.
        if ((k + commandPCOffset + 3) > decompilingCPU.memory.length) {
          break;
        }
        console.log(disassemblerRet.error);
        commandPCOffset++; //Stop infinite loops
      }
    }
    if (!rtoQuiet) {
      console.log(`Completed Writing File: ${outputFileName}`);
    }

  });
}

function pad(str, size, withChar = "0") {
  var s = str + "";
  while (s.length < size) s = withChar + s;
  return s;
}

decompileBinary(decompileFiles, rtoCombineFiles);





