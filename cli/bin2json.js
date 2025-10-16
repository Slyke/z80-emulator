const fs = require('fs');

var convertFiles = [];

var combineFiles = false;
var jsonLarge = false;

var outputFileName = "";
var memoryLength = 0;

function printHelp() {
  console.log("Z80 Binary to JSON: ");
  console.log("    Converts binary files into json files that the emulator can also load.");
  console.log(" ");
  console.log("  -c   Combine files into 1 JSON file.");
  console.log("           Chunks and combines listed files into the same JSON file in the order specified. You can manually adjust the offset in the JSON file for each chunked file. Output file name will be the first file specified.");
  console.log("  -l   Large Mode");
  console.log("           Increases output file size (adds JSON spacing, newlines), but makes it easier to work with.");
  console.log("  -h   Help");
  console.log("           This message.");
}

if (process.argv.length === 2) {
  printHelp();
  process.exit(0);
}

for (var i = 2; i < process.argv.length; i++) {
  if (process.argv[i] === "-c") {
    combineFiles = true;
    continue;
  }
  if (process.argv[i] === "-l") {
    jsonLarge = true;
    continue;
  }
  if (process.argv[i] === "-h" || process.argv[i] === "--help") {
    printHelp();
    process.exit(0);
  }
  if (fs.existsSync(process.argv[i])) {
    convertFiles.push(process.argv[i])
  }
}

var runConvert = function() {

  var jsonOutput = {
    name: "",
    chunks: []
  };

  for (var i = 0; i < convertFiles.length; i++) {
    fileData = fs.readFileSync(convertFiles[i], { encoding: 'binary' });
  
    var memory = [];

    if (jsonLarge) {
      for (var k = 0; k < fileData.length; k++) {
        memory[k] = "0x" + pad(fileData.charCodeAt(k).toString(16), 2);
      }
    } else {
      for (var k = 0; k < fileData.length; k++) {
        memory[k] = "0x" + fileData.charCodeAt(k).toString(16);
      }
    }

    var normalizedFileName = convertFiles[i].replace(/\\/g,"/");
    normalizedFileName = normalizedFileName.substring(normalizedFileName.lastIndexOf('/') + 1);
    
    if (combineFiles) {
      if (jsonOutput.chunks.length > 0) {
        jsonOutput.chunks.push({
          offset: "0x" + memoryLength.toString(16),
          data: memory
        });
        memoryLength += memory.length;
      } else {
        jsonOutput = {
          name: `bin2asm '${normalizedFileName}'`,
          chunks: [{
            offset: "0x" + memoryLength.toString(16),
            data: memory
          }]
        };
        outputFileName = './' + normalizedFileName + '.json';
        memoryLength += memory.length;
      }
    } else {
      jsonOutput = {
        name: `bin2asm '${normalizedFileName}'`,
        chunks: [{
          offset: "0x" + memoryLength.toString(16),
          data: memory
        }]
      };
    }

    if (!combineFiles) {
      outputFileName = './' + normalizedFileName + '.json';
      if (jsonLarge) {
        fs.writeFileSync(outputFileName, JSON.stringify(jsonOutput, null, 2));
      } else {
        fs.writeFileSync(outputFileName, JSON.stringify(jsonOutput));
      }
    }
  }

  if (combineFiles) {
    if (jsonLarge) {
      fs.writeFileSync(outputFileName, JSON.stringify(jsonOutput, null, 2));
    } else {
      fs.writeFileSync(outputFileName, JSON.stringify(jsonOutput));
    }
  }

}

function pad(str, size, withChar = "0") {
  var s = str + "";
  while (s.length < size) s = withChar + s;
  return s;
}

runConvert();