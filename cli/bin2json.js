const fs = require('fs');

var convertFiles = [];

for (var i = 2; i < process.argv.length; i++) {
  if (fs.existsSync(process.argv[i])) {
    convertFiles.push(process.argv[i])
  }
}

var runConvert = function() {

  for (var i = 0; i < convertFiles.length; i++) {
    fileData = fs.readFileSync(convertFiles[i], { encoding: 'binary' });
  
    var memory = [];
  
    for (var k = 0; k < fileData.length; k++) {
      memory[k] = fileData.charCodeAt(k).toString(16);
    }

    var normalizedFileName = convertFiles[i].replace(/\\/g,"/");
    normalizedFileName = normalizedFileName.substring(normalizedFileName.lastIndexOf('/') + 1);
  
    var jsonOutput = {
      name: `bin2asm '${normalizedFileName}'`,
      chunk: false,
      data: memory
    };

    var outputFileName = './' + normalizedFileName + '.json';

    // fs.writeFileSync(outputFileName, JSON.stringify(jsonOutput, null, 2));
    fs.writeFileSync(outputFileName, JSON.stringify(jsonOutput));
    
  }
}

runConvert();