const fs = require('fs');
var cpu = require('../cpu');

var decompileFiles = [];

for (var i = 2; i < process.argv.length; i++) {
  if (fs.existsSync(process.argv[i])) {
    decompileFiles.push(process.argv[i])
  }
}

var runDecompile = function() {

  var decompilingCPU = cpu();

  for (var i = 0; i < decompileFiles.length; i++) {
    fileData = fs.readFileSync(decompileFiles[i], { encoding: 'binary' });
  
    var memory = [];
  
    for (var k = 0; k < fileData.length; k++) {

      memory[k] = fileData.charCodeAt(k);
    }
  
    var fileHeadingHelper = "; Address  |   OP Code   |   Mnem    | IREG  | OREG |   P1  |  P2   | PTR | opBytes | Cycles | CondCycle \n";
    var outputFileName = './' + decompileFiles[i] + '.asm';
    var commandPCOffset = 0;

    decompilingCPU.memory = memory;
  
    fs.writeFileSync(outputFileName, fileHeadingHelper);

    for (var k = 0; k < memory.length; k++) {
      decompilingCPU.flags.pc = (k + commandPCOffset);

      if (decompilingCPU.memory[(k + commandPCOffset)]) {
        var disObj = decompilingCPU.disassemble8080OP(decompilingCPU, (k + commandPCOffset));
      } else {
        continue;
      }
  
      var lineOutput = "";
      lineOutput += `   ${pad(disObj.programCounter.toString(16), 4)}        `;
      lineOutput += `(${pad(disObj.opCodeHex.toString(16), 2)})     `; // Change to disObj.z80OPCode for original Z80 instruction set.
      lineOutput += `${pad(disObj.opCode, 10, " ")}      `;
      lineOutput += `${pad(disObj.ireg, 3, " ")}    `;
      lineOutput += `${pad(disObj.oreg, 3, " ")}     `;
      lineOutput += `${pad(pad(disObj.para1.toString(16), 2), 3, " ")}    `;
      lineOutput += `${pad(pad(disObj.para2.toString(16), 2), 3, " ")}      `;
      lineOutput += `${pad(disObj.ptr, 1, " ")}      `;
      lineOutput += `${pad(disObj.opBytes, 1, " ")}         `;
      lineOutput += `${pad(pad(disObj.cycles, 2), 1, " ")}       `;
      lineOutput += `${pad(disObj.cycleConditional, 1, " ")}`;
      lineOutput += "\n";

      fs.appendFileSync(outputFileName, lineOutput);
  
      commandPCOffset += (disObj.opBytes - 1);
    }
    
  
  }
}

function pad(str, size, withChar = "0") {
  var s = str + "";
  while (s.length < size) s = withChar + s;
  return s;
}

runDecompile();