var cpu = require('./cpu');

var testReport = [];

var baseDB = {
  executionCount: 1,
  videoMemoryUpdated: [],
  cycleRollover: false
};

var baseOutputState = {
  hwIntPorts: [],
  flags: {
    pc: 1
  },
  db: { ...baseDB },
  pInterrupt: 16,
};

var orderObject = (originalObj) => {
  var newObj = {};
  Object.keys(originalObj).sort().forEach(function(key) {
    newObj[key] = originalObj[key];
  });

  return newObj;
}

var testCPUOP = (testingCPU, inputState, expectedOutputState) => {
  // Input state is modified.
  var originalInputState = JSON.parse(JSON.stringify(inputState));

  var cpuOut = testingCPU.emulate8080OP(inputState, inputState.flags.pc);
  var modifiedState = inputState;
  inputState = originalInputState;

  modifiedState = orderObject(modifiedState);
  modifiedState.flags = orderObject(modifiedState.flags);
  modifiedState.db = orderObject(modifiedState.db);

  expectedOutputState = orderObject(expectedOutputState);
  expectedOutputState.flags = orderObject(expectedOutputState.flags);
  expectedOutputState.db = orderObject(expectedOutputState.db);

  var modifiedString = JSON.stringify(modifiedState);
  var expectedOutputStateString = JSON.stringify(expectedOutputState);

  if (modifiedString !== expectedOutputStateString) {
    var diffCheckModified = modifiedString.split("\n");
    var diffCheckExpected = modifiedString.split("\n");
    var diffResultGot = "";
    var diffResultExpected = "";
    for (var i = 0; i < diffCheckModified.length; i++) {
      if (diffCheckModified[i] !== diffCheckExpected[i]) {
        diffResultGot = diffCheckModified[i];
        diffResultExpected = diffCheckExpected[i];
      }
    }

    return {
      pass: false,
      reason: "CPU output did not match expected input",
      reasonCode: 1,
      inputState: JSON.parse(JSON.stringify(inputState)),
      expectedOutputState: JSON.parse(JSON.stringify(expectedOutputState)),
      actualOutputState: JSON.parse(JSON.stringify(modifiedState)),
      cpuResult: cpuOut,
      firstFaultyLineModified: diffResultGot,
      firstFaultyLineExpected: diffResultExpected
    };
  } else if (cpuOut !== 0) {
    return {
      pass: false,
      reason: "CPU returned a non-zero code",
      reasonCode: 2,
      inputState: JSON.parse(JSON.stringify(originalInputState)),
      expectedOutputState: JSON.parse(JSON.stringify(expectedOutputState)),
      actualOutputState: JSON.parse(JSON.stringify(modifiedState)),
      cpuResult: cpuOut
    };
  }

  return {
    pass: true,
    reason: "Everything matches",
    reasonCode: 0,
    inputState: JSON.parse(JSON.stringify(originalInputState)),
    expectedOutputState: JSON.parse(JSON.stringify(expectedOutputState)),
    actualOutputState: JSON.parse(JSON.stringify(modifiedState)),
    cpuResult: cpuOut
  };
};

var printReport = () => {
  console.log("Test Results: ")
  testReport.forEach(element => {
    if (element.expected === 'pass' && element.got.pass === true) {
      console.log(`    Result: PASS   Wanted: ${element.expected === 'pass'}    Got: ${element.got.pass}   Name: ${element.test}   ${element.description ? 'Desc: ' + element.description : ''}`);
    } else if (element.expected === 'fail' && element.got.pass === false) {
      console.log(`    Result: PASS   Wanted: ${element.expected === 'pass'}   Got: ${element.got.pass}   Name: ${element.test}   ${element.description ? 'Desc: ' + element.description : ''}`);
    } else {
      console.log(`    Result: *** FAIL ***   Wanted: ${element.expected === 'pass'}   Got: ${element.got.pass}   Name: ${element.test}   ${element.description ? 'Desc: ' + element.description : ''}`);
      console.log(" ");
      console.log(JSON.stringify(element, null, 2));
      console.log(" ");
      console.log(" ");
    }
  });
};

var runTestOP = (opCode, pf, give, expect, description) => {
  var baseCPU = cpu();

  var inputState = {...baseCPU, ...give };
  var outputState = { ...expect };

  var testResults = testCPUOP(baseCPU, inputState, outputState);
  testReport.push({
    test: opCode,
    expected: pf,
    got: testResults,
    description
  });
};

runTestOP('0x00', 'pass', {
  flags: { pc: 0 }, memory: [ 0x00, 0x00, 0x00 ]
}, {
  ...baseOutputState,
  memory: [ 0x00, 0x00, 0x00 ], 
  db: {
    ...baseDB,
    totalCPUCycles: 4,
  },
  cycles: 4
});

runTestOP('0x00', 'fail', {
  flags: { pc: 0 }, memory: [ 0x00, 0x00, 0x00 ]
}, {
  ...baseOutputState,
  memory: [ 0x00, 0x00, 0x00 ], 
  db: {
    ...baseDB,
    totalCPUCycles: 5,
  },
  cycles: 5
});

runTestOP('0x01', 'pass', {
  flags: { pc: 0 }, memory: [ 0x01, 0x45, 0x89 ]
}, {
  ...baseOutputState,
  memory: [ 0x01, 0x45, 0x89 ],
  db: {
    ...baseDB,
    totalCPUCycles: 10,
  },
  flags: {
    pc: 3,
    b: 0x89,
    c: 0x45
  },
  cycles: 10
});

runTestOP('0x02', 'pass', {
  flags: { pc: 0 }, memory: [ 0x01, 0x45, 0x89 ]
}, {
  ...baseOutputState,
  memory: [ 0x01, 0x45, 0x89 ],
  db: {
    ...baseDB,
    totalCPUCycles: 10,
  },
  flags: {
    pc: 3,
    b: 0x89,
    c: 0x45
  },
  cycles: 10
});

printReport();
