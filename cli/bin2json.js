const fs = require('fs');

var convertFiles = [];

var combineFiles = false;
var jsonLarge = false;

var outputFileName = "";
var memoryLength = 0;
  
for (var i = 2; i < process.argv.length; i++) {
  if (process.argv[i] === "-c") {
    combineFiles = true;
    continue;
  }
  if (process.argv[i] === "-l") {
    jsonLarge = true;
    continue;
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

    for (var k = 0; k < fileData.length; k++) {
      memory[k] = fileData.charCodeAt(k).toString(16);
    }

    var normalizedFileName = convertFiles[i].replace(/\\/g,"/");
    normalizedFileName = normalizedFileName.substring(normalizedFileName.lastIndexOf('/') + 1);
    
    if (combineFiles) {
      if (jsonOutput.chunks.length > 0) {
        jsonOutput.chunks.push({
          offset: memoryLength.toString(16),
          data: memory
        });
        memoryLength += memory.length;
      } else {
        jsonOutput = {
          name: `bin2asm '${normalizedFileName}'`,
          chunks: [{
            offset: memoryLength.toString(16),
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
          offset: memoryLength.toString(16),
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

runConvert();