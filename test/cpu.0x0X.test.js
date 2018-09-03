var assert = require('assert');
var cpuFunc = require('../cpu');

var cpu;

describe('Z80 CPU Emulator', () => {
  describe('0x0X Set', () => {
      
    before(() => {
      cpu = cpuFunc();
      return ;
    });

    describe('0x00 - NOP', () => {
      cpu = cpuFunc();
      var cpuInputState = Object.freeze({
        ...cpu,
        flags: {
          pc: 0
        },
        memory: [ 0x00, 0x00, 0x00 ]
      });

      var modifiyState = JSON.parse(JSON.stringify(cpuInputState));

      var disassembleOut = cpu.disassemble8080OP(cpuInputState, cpuInputState.flags.pc);
      var cpuOut = cpu.emulate8080OP(modifiyState, cpuInputState.flags.pc);
      var cycleDifference = (modifiyState.cycles - (cpuInputState.cycles ? cpuInputState.cycles : 0));

      var shouldCycles = 4;         // *** Cycles
      var shouldPC = 1;             // *** PC Count
      var shouldOPCode = 'NOP';     // *** OP Code

      //Basic tests
      it('should have matching cycle count between the disassembler and emulator', () => {
        assert.equal(cycleDifference, disassembleOut.cycles);
      });
      it(`should have matching cycle count of:  ${shouldCycles}`, () => {
        assert.equal(cycleDifference, shouldCycles);
      });
      it('should return 0 (valid OP code)', () => {
        assert.equal(cpuOut, 0);
      });
      it('PC should increase by disassembler amount', () => {
        assert.equal((modifiyState.flags.pc - cpuInputState.flags.pc), disassembleOut.opBytes);
      });
      it(`PC should increase by:  ${shouldPC}`, () => {
        assert.equal((modifiyState.flags.pc - cpuInputState.flags.pc), shouldPC);
      });
      it(`Disassembler should return correct OP code: '${shouldOPCode}'`, () => {
        assert.equal(disassembleOut.opCode, shouldOPCode);
      });
    });

    describe('0x01 - LD2R', () => {
      cpu = cpuFunc();
      var cpuInputState = Object.freeze({
        ...cpu,
        flags: {
          pc: 0
        },
        memory: [ 0x01, 0x45, 0x89 ]
      });

      var modifiyState = JSON.parse(JSON.stringify(cpuInputState));

      var disassembleOut = cpu.disassemble8080OP(cpuInputState, cpuInputState.flags.pc);
      var cpuOut = cpu.emulate8080OP(modifiyState, cpuInputState.flags.pc);
      var cycleDifference = (modifiyState.cycles - (cpuInputState.cycles ? cpuInputState.cycles : 0));

      var shouldCycles = 10;         // *** Cycles
      var shouldPC = 3;             // *** PC Count
      var shouldOPCode = 'LD2R';    // *** OP Code

      //Basic tests
      it('should have matching cycle count between the disassembler and emulator', () => {
        assert.equal(cycleDifference, disassembleOut.cycles);
      });
      it(`should have matching cycle count of:  ${shouldCycles}`, () => {
        assert.equal(cycleDifference, shouldCycles);
      });
      it('should return 0 (valid OP code)', () => {
        assert.equal(cpuOut, 0);
      });
      it('PC should increase by disassembler amount', () => {
        assert.equal((modifiyState.flags.pc - cpuInputState.flags.pc), disassembleOut.opBytes);
      });
      it(`PC should increase by:  ${shouldPC}`, () => {
        assert.equal((modifiyState.flags.pc - cpuInputState.flags.pc), shouldPC);
      });
      it(`Disassembler should return correct OP code: '${shouldOPCode}'`, () => {
        assert.equal(disassembleOut.opCode, shouldOPCode);
      });

      // OP Code specific tests
      it(`Register 'B' should equal 0x89`, () => {
        assert.equal(modifiyState.flags.b, 0x89);
      });
      it(`Register 'C' should equal 0x45`, () => {
        assert.equal(modifiyState.flags.c, 0x45);
      });
    });

    describe('0x02 - LD2M', () => {
      cpu = cpuFunc();
      var cpuInputState = Object.freeze({
        ...cpu,
        flags: {
          pc: 0,
          a: 0x44,
          b: 0x00,
          c: 0x03
        },
        memory: [ 0x02, 0xff, 0xfe, 0xfd, 0xfc ]
      });

      var modifiyState = JSON.parse(JSON.stringify(cpuInputState));
      console.log(111, cpuInputState.flags.pc)
      var disassembleOut = cpu.disassemble8080OP(cpuInputState, cpuInputState.flags.pc);
      var cpuOut = cpu.emulate8080OP(modifiyState, cpuInputState.flags.pc);
      var cycleDifference = (modifiyState.cycles - (cpuInputState.cycles ? cpuInputState.cycles : 0));

      var shouldCycles = 7;         // *** Cycles
      var shouldPC = 1;             // *** PC Count
      var shouldOPCode = 'LD2M';    // *** OP Code

      //Basic tests
      it('should have matching cycle count between the disassembler and emulator', () => {
        assert.equal(cycleDifference, disassembleOut.cycles);
      });
      it(`should have matching cycle count of:  ${shouldCycles}`, () => {
        assert.equal(cycleDifference, shouldCycles);
      });
      it('should return 0 (valid OP code)', () => {
        assert.equal(cpuOut, 0);
      });
      it('PC should increase by disassembler amount', () => {
        assert.equal((modifiyState.flags.pc - cpuInputState.flags.pc), disassembleOut.opBytes);
      });
      it(`PC should increase by:  ${shouldPC}`, () => {
        assert.equal((modifiyState.flags.pc - cpuInputState.flags.pc), shouldPC);
      });
      it(`Disassembler should return correct OP code: '${shouldOPCode}'`, () => {
        assert.equal(disassembleOut.opCode, shouldOPCode);
      });

      // OP Code specific tests
      it(`Memory 0x003 should equal 0x44`, () => {
        assert.equal(modifiyState.memory[0x03], 0x44);
      });
      it(`Memory 0x002 should equal 0xfe`, () => {
        assert.equal(modifiyState.memory[0x02], 0xfe);
      });
      it(`Memory 0x004 should equal 0xfc`, () => {
        assert.equal(modifiyState.memory[0x04], 0xfc);
      });
    });

    describe('0x03 - INCR', () => {
      describe('Basic', () => {
        cpu = cpuFunc();
        var cpuInputState = Object.freeze({
          ...cpu,
          flags: {
            pc: 0,
            b: 0x04,
            c: 0x07
          },
          memory: [ 0x03 ]
        });

        var modifiyState = JSON.parse(JSON.stringify(cpuInputState));

        var disassembleOut = cpu.disassemble8080OP(cpuInputState, cpuInputState.flags.pc);
        var cpuOut = cpu.emulate8080OP(modifiyState, cpuInputState.flags.pc);
        var cycleDifference = (modifiyState.cycles - (cpuInputState.cycles ? cpuInputState.cycles : 0));

        var shouldCycles = 6;         // *** Cycles
        var shouldPC = 1;             // *** PC Count
        var shouldOPCode = 'INCR';    // *** OP Code

        //Basic tests
        it('should have matching cycle count between the disassembler and emulator', () => {
          assert.equal(cycleDifference, disassembleOut.cycles);
        });
        it(`should have matching cycle count of:  ${shouldCycles}`, () => {
          assert.equal(cycleDifference, shouldCycles);
        });
        it('should return 0 (valid OP code)', () => {
          assert.equal(cpuOut, 0);
        });
        it('PC should increase by disassembler amount', () => {
          assert.equal((modifiyState.flags.pc - cpuInputState.flags.pc), disassembleOut.opBytes);
        });
        it(`PC should increase by:  ${shouldPC}`, () => {
          assert.equal((modifiyState.flags.pc - cpuInputState.flags.pc), shouldPC);
        });
        it(`Disassembler should return correct OP code: '${shouldOPCode}'`, () => {
          assert.equal(disassembleOut.opCode, shouldOPCode);
        });

        // OP Code specific tests
        it(`Register 'B' should equal 0x04`, () => {
          assert.equal(modifiyState.flags.b, 0x04);
        });
        it(`Register 'C' should equal 0x08`, () => {
          assert.equal(modifiyState.flags.c, 0x08);
        });
      });

      describe('Full Overflow Loop (B=0xff->0x00, C=0xff->0x00)', () => {
        cpu = cpuFunc();
        var cpuInputState = Object.freeze({
          ...cpu,
          flags: {
            pc: 0,
            b: 0xff,
            c: 0xff
          },
          memory: [ 0x03 ]
        });

        var modifiyState = JSON.parse(JSON.stringify(cpuInputState));

        var disassembleOut = cpu.disassemble8080OP(cpuInputState, cpuInputState.flags.pc);
        var cpuOut = cpu.emulate8080OP(modifiyState, cpuInputState.flags.pc);
        var cycleDifference = (modifiyState.cycles - (cpuInputState.cycles ? cpuInputState.cycles : 0));

        var shouldCycles = 6;         // *** Cycles
        var shouldPC = 1;             // *** PC Count
        var shouldOPCode = 'INCR';    // *** OP Code

        //Basic tests
        it('should have matching cycle count between the disassembler and emulator', () => {
          assert.equal(cycleDifference, disassembleOut.cycles);
        });
        it(`should have matching cycle count of:  ${shouldCycles}`, () => {
          assert.equal(cycleDifference, shouldCycles);
        });
        it('should return 0 (valid OP code)', () => {
          assert.equal(cpuOut, 0);
        });
        it('PC should increase by disassembler amount', () => {
          assert.equal((modifiyState.flags.pc - cpuInputState.flags.pc), disassembleOut.opBytes);
        });
        it(`PC should increase by:  ${shouldPC}`, () => {
          assert.equal((modifiyState.flags.pc - cpuInputState.flags.pc), shouldPC);
        });
        it(`Disassembler should return correct OP code: '${shouldOPCode}'`, () => {
          assert.equal(disassembleOut.opCode, shouldOPCode);
        });

        // OP Code specific tests
        it(`Register 'B' should equal 0x00`, () => {
          assert.equal(modifiyState.flags.b, 0x00);
        });
        it(`Register 'C' should equal 0x00`, () => {
          assert.equal(modifiyState.flags.c, 0x00);
        });
      });

      describe('Simple Overflow Loop (B=0x05->0x06, C=0xff->0x00)', () => {
        cpu = cpuFunc();
        var cpuInputState = Object.freeze({
          ...cpu,
          flags: {
            pc: 0,
            b: 0x05,
            c: 0xff
          },
          memory: [ 0x03 ]
        });

        var modifiyState = JSON.parse(JSON.stringify(cpuInputState));

        var disassembleOut = cpu.disassemble8080OP(cpuInputState, cpuInputState.flags.pc);
        var cpuOut = cpu.emulate8080OP(modifiyState, cpuInputState.flags.pc);
        var cycleDifference = (modifiyState.cycles - (cpuInputState.cycles ? cpuInputState.cycles : 0));

        var shouldCycles = 6;         // *** Cycles
        var shouldPC = 1;             // *** PC Count
        var shouldOPCode = 'INCR';    // *** OP Code

        //Basic tests
        it('should have matching cycle count between the disassembler and emulator', () => {
          assert.equal(cycleDifference, disassembleOut.cycles);
        });
        it(`should have matching cycle count of:  ${shouldCycles}`, () => {
          assert.equal(cycleDifference, shouldCycles);
        });
        it('should return 0 (valid OP code)', () => {
          assert.equal(cpuOut, 0);
        });
        it('PC should increase by disassembler amount', () => {
          assert.equal((modifiyState.flags.pc - cpuInputState.flags.pc), disassembleOut.opBytes);
        });
        it(`PC should increase by:  ${shouldPC}`, () => {
          assert.equal((modifiyState.flags.pc - cpuInputState.flags.pc), shouldPC);
        });
        it(`Disassembler should return correct OP code: '${shouldOPCode}'`, () => {
          assert.equal(disassembleOut.opCode, shouldOPCode);
        });

        // OP Code specific tests
        it(`Register 'B' should equal 0x06`, () => {
          assert.equal(modifiyState.flags.b, 0x06);
        });
        it(`Register 'C' should equal 0x00`, () => {
          assert.equal(modifiyState.flags.c, 0x00);
        });
      });
    });

    describe('0x04 - INCR', () => {
      describe('Basic', () => {
        cpu = cpuFunc();
        var cpuInputState = Object.freeze({
          ...cpu,
          flags: {
            pc: 0,
            b: 0x04,
            c: 0x07
          },
          memory: [ 0x04 ]
        });

        var modifiyState = JSON.parse(JSON.stringify(cpuInputState));

        var disassembleOut = cpu.disassemble8080OP(cpuInputState, cpuInputState.flags.pc);
        var cpuOut = cpu.emulate8080OP(modifiyState, cpuInputState.flags.pc);
        var cycleDifference = (modifiyState.cycles - (cpuInputState.cycles ? cpuInputState.cycles : 0));

        var shouldCycles = 5;         // *** Cycles
        var shouldPC = 1;             // *** PC Count
        var shouldOPCode = 'INCR';    // *** OP Code

        //Basic tests
        it('should have matching cycle count between the disassembler and emulator', () => {
          assert.equal(cycleDifference, disassembleOut.cycles);
        });
        it(`should have matching cycle count of:  ${shouldCycles}`, () => {
          assert.equal(cycleDifference, shouldCycles);
        });
        it('should return 0 (valid OP code)', () => {
          assert.equal(cpuOut, 0);
        });
        it('PC should increase by disassembler amount', () => {
          assert.equal((modifiyState.flags.pc - cpuInputState.flags.pc), disassembleOut.opBytes);
        });
        it(`PC should increase by:  ${shouldPC}`, () => {
          assert.equal((modifiyState.flags.pc - cpuInputState.flags.pc), shouldPC);
        });
        it(`Disassembler should return correct OP code: '${shouldOPCode}'`, () => {
          assert.equal(disassembleOut.opCode, shouldOPCode);
        });

        // OP Code specific tests
        it(`Register 'B' should equal 0x05`, () => {
          assert.equal(modifiyState.flags.b, 0x05);
        });
        it(`Register 'C' should equal 0x07`, () => {
          assert.equal(modifiyState.flags.c, 0x07);
        });
      });

      describe('Full Overflow Loop (B=0xff->0x00, C=0x07->0x07)', () => {
        cpu = cpuFunc();
        var cpuInputState = Object.freeze({
          ...cpu,
          flags: {
            pc: 0,
            b: 0xff,
            c: 0x07
          },
          memory: [ 0x04 ]
        });

        var modifiyState = JSON.parse(JSON.stringify(cpuInputState));

        var disassembleOut = cpu.disassemble8080OP(cpuInputState, cpuInputState.flags.pc);
        var cpuOut = cpu.emulate8080OP(modifiyState, cpuInputState.flags.pc);
        var cycleDifference = (modifiyState.cycles - (cpuInputState.cycles ? cpuInputState.cycles : 0));

        var shouldCycles = 5;         // *** Cycles
        var shouldPC = 1;             // *** PC Count
        var shouldOPCode = 'INCR';    // *** OP Code

        //Basic tests
        it('should have matching cycle count between the disassembler and emulator', () => {
          assert.equal(cycleDifference, disassembleOut.cycles);
        });
        it(`should have matching cycle count of:  ${shouldCycles}`, () => {
          assert.equal(cycleDifference, shouldCycles);
        });
        it('should return 0 (valid OP code)', () => {
          assert.equal(cpuOut, 0);
        });
        it('PC should increase by disassembler amount', () => {
          assert.equal((modifiyState.flags.pc - cpuInputState.flags.pc), disassembleOut.opBytes);
        });
        it(`PC should increase by:  ${shouldPC}`, () => {
          assert.equal((modifiyState.flags.pc - cpuInputState.flags.pc), shouldPC);
        });
        it(`Disassembler should return correct OP code: '${shouldOPCode}'`, () => {
          assert.equal(disassembleOut.opCode, shouldOPCode);
        });

        // OP Code specific tests
        it(`Register 'B' should equal 0x00`, () => {
          assert.equal(modifiyState.flags.b, 0x00);
        });
        it(`Register 'C' should equal 0x07`, () => {
          assert.equal(modifiyState.flags.c, 0x07);
        });
      });
    });

    describe('0x05 - DCRR', () => {
      describe('Basic', () => {
        cpu = cpuFunc();
        var cpuInputState = Object.freeze({
          ...cpu,
          flags: {
            pc: 0,
            b: 0x04,
            c: 0x07
          },
          memory: [ 0x05 ]
        });

        var modifiyState = JSON.parse(JSON.stringify(cpuInputState));

        var disassembleOut = cpu.disassemble8080OP(cpuInputState, cpuInputState.flags.pc);
        var cpuOut = cpu.emulate8080OP(modifiyState, cpuInputState.flags.pc);
        var cycleDifference = (modifiyState.cycles - (cpuInputState.cycles ? cpuInputState.cycles : 0));

        var shouldCycles = 5;         // *** Cycles
        var shouldPC = 1;             // *** PC Count
        var shouldOPCode = 'DCRR';    // *** OP Code

        //Basic tests
        it('should have matching cycle count between the disassembler and emulator', () => {
          assert.equal(cycleDifference, disassembleOut.cycles);
        });
        it(`should have matching cycle count of:  ${shouldCycles}`, () => {
          assert.equal(cycleDifference, shouldCycles);
        });
        it('should return 0 (valid OP code)', () => {
          assert.equal(cpuOut, 0);
        });
        it('PC should increase by disassembler amount', () => {
          assert.equal((modifiyState.flags.pc - cpuInputState.flags.pc), disassembleOut.opBytes);
        });
        it(`PC should increase by:  ${shouldPC}`, () => {
          assert.equal((modifiyState.flags.pc - cpuInputState.flags.pc), shouldPC);
        });
        it(`Disassembler should return correct OP code: '${shouldOPCode}'`, () => {
          assert.equal(disassembleOut.opCode, shouldOPCode);
        });

        // OP Code specific tests
        it(`Register 'B' should equal 0x03`, () => {
          assert.equal(modifiyState.flags.b, 0x03);
        });
        it(`Register 'C' should equal 0x07`, () => {
          assert.equal(modifiyState.flags.c, 0x07);
        });
      });

      describe('Full Overflow Loop (B=0x00->0xff, C=0x07->0x07)', () => {
        cpu = cpuFunc();
        var cpuInputState = Object.freeze({
          ...cpu,
          flags: {
            pc: 0,
            b: 0x00,
            c: 0x07
          },
          memory: [ 0x05 ]
        });

        var modifiyState = JSON.parse(JSON.stringify(cpuInputState));

        var disassembleOut = cpu.disassemble8080OP(cpuInputState, cpuInputState.flags.pc);
        var cpuOut = cpu.emulate8080OP(modifiyState, cpuInputState.flags.pc);
        var cycleDifference = (modifiyState.cycles - (cpuInputState.cycles ? cpuInputState.cycles : 0));

        var shouldCycles = 5;         // *** Cycles
        var shouldPC = 1;             // *** PC Count
        var shouldOPCode = 'DCRR';    // *** OP Code

        //Basic tests
        it('should have matching cycle count between the disassembler and emulator', () => {
          assert.equal(cycleDifference, disassembleOut.cycles);
        });
        it(`should have matching cycle count of:  ${shouldCycles}`, () => {
          assert.equal(cycleDifference, shouldCycles);
        });
        it('should return 0 (valid OP code)', () => {
          assert.equal(cpuOut, 0);
        });
        it('PC should increase by disassembler amount', () => {
          assert.equal((modifiyState.flags.pc - cpuInputState.flags.pc), disassembleOut.opBytes);
        });
        it(`PC should increase by:  ${shouldPC}`, () => {
          assert.equal((modifiyState.flags.pc - cpuInputState.flags.pc), shouldPC);
        });
        it(`Disassembler should return correct OP code: '${shouldOPCode}'`, () => {
          assert.equal(disassembleOut.opCode, shouldOPCode);
        });

        // OP Code specific tests
        it(`Register 'B' should equal 0xff`, () => {
          assert.equal(modifiyState.flags.b, 0xff);
        });
        it(`Register 'C' should equal 0x07`, () => {
          assert.equal(modifiyState.flags.c, 0x07);
        });
      });
    });

    describe('0x06 - LD2R', () => {
      cpu = cpuFunc();
      var cpuInputState = Object.freeze({
        ...cpu,
        flags: {
          pc: 0,
          c: 0x22
        },
        memory: [ 0x06, 0x45, 0x89 ]
      });

      var modifiyState = JSON.parse(JSON.stringify(cpuInputState));

      var disassembleOut = cpu.disassemble8080OP(cpuInputState, cpuInputState.flags.pc);
      var cpuOut = cpu.emulate8080OP(modifiyState, cpuInputState.flags.pc);
      var cycleDifference = (modifiyState.cycles - (cpuInputState.cycles ? cpuInputState.cycles : 0));

      var shouldCycles = 7;         // *** Cycles
      var shouldPC = 2;             // *** PC Count
      var shouldOPCode = 'LD2R';    // *** OP Code

      //Basic tests
      it('should have matching cycle count between the disassembler and emulator', () => {
        assert.equal(cycleDifference, disassembleOut.cycles);
      });
      it(`should have matching cycle count of:  ${shouldCycles}`, () => {
        assert.equal(cycleDifference, shouldCycles);
      });
      it('should return 0 (valid OP code)', () => {
        assert.equal(cpuOut, 0);
      });
      it('PC should increase by disassembler amount', () => {
        assert.equal((modifiyState.flags.pc - cpuInputState.flags.pc), disassembleOut.opBytes);
      });
      it(`PC should increase by:  ${shouldPC}`, () => {
        assert.equal((modifiyState.flags.pc - cpuInputState.flags.pc), shouldPC);
      });
      it(`Disassembler should return correct OP code: '${shouldOPCode}'`, () => {
        assert.equal(disassembleOut.opCode, shouldOPCode);
      });

      // OP Code specific tests
      it(`Register 'B' should equal 0x45`, () => {
        assert.equal(modifiyState.flags.b, 0x45);
      });
      it(`Register 'C' should equal 0x22 (Unchanged)`, () => {
        assert.equal(modifiyState.flags.c, 0x22);
      });
    });

    describe('0x07 - RLCA', () => {
      describe('Basic', () => {
        cpu = cpuFunc();
        var cpuInputState = Object.freeze({
          ...cpu,
          flags: {
            pc: 0,
            a: 0b01100101,
            f: 0x00
          },
          memory: [ 0x07 ]
        });

        var modifiyState = JSON.parse(JSON.stringify(cpuInputState));

        var disassembleOut = cpu.disassemble8080OP(cpuInputState, cpuInputState.flags.pc);
        var cpuOut = cpu.emulate8080OP(modifiyState, cpuInputState.flags.pc);
        var cycleDifference = (modifiyState.cycles - (cpuInputState.cycles ? cpuInputState.cycles : 0));

        var shouldCycles = 4;         // *** Cycles
        var shouldPC = 1;             // *** PC Count
        var shouldOPCode = 'RLCA';    // *** OP Code

        //Basic tests
        it('should have matching cycle count between the disassembler and emulator', () => {
          assert.equal(cycleDifference, disassembleOut.cycles);
        });
        it(`should have matching cycle count of:  ${shouldCycles}`, () => {
          assert.equal(cycleDifference, shouldCycles);
        });
        it('should return 0 (valid OP code)', () => {
          assert.equal(cpuOut, 0);
        });
        it('PC should increase by disassembler amount', () => {
          assert.equal((modifiyState.flags.pc - cpuInputState.flags.pc), disassembleOut.opBytes);
        });
        it(`PC should increase by:  ${shouldPC}`, () => {
          assert.equal((modifiyState.flags.pc - cpuInputState.flags.pc), shouldPC);
        });
        it(`Disassembler should return correct OP code: '${shouldOPCode}'`, () => {
          assert.equal(disassembleOut.opCode, shouldOPCode);
        });

        // OP Code specific tests
        it(`Register 'A' should equal 0b11001010`, () => {
          assert.equal(modifiyState.flags.a, 0b11001010);
        });
        it(`Register 'F' should equal 0x00 (Unchanged)`, () => {
          assert.equal(modifiyState.flags.f, 0x00);
        });
      });

      describe('Turn Carry (0x01) On', () => {
        cpu = cpuFunc();
        var cpuInputState = Object.freeze({
          ...cpu,
          flags: {
            pc: 0,
            a: 0b11100101,
            f: 0x00
          },
          memory: [ 0x07 ]
        });

        var modifiyState = JSON.parse(JSON.stringify(cpuInputState));

        var disassembleOut = cpu.disassemble8080OP(cpuInputState, cpuInputState.flags.pc);
        var cpuOut = cpu.emulate8080OP(modifiyState, cpuInputState.flags.pc);
        var cycleDifference = (modifiyState.cycles - (cpuInputState.cycles ? cpuInputState.cycles : 0));

        var shouldCycles = 4;         // *** Cycles
        var shouldPC = 1;             // *** PC Count
        var shouldOPCode = 'RLCA';    // *** OP Code

        //Basic tests
        it('should have matching cycle count between the disassembler and emulator', () => {
          assert.equal(cycleDifference, disassembleOut.cycles);
        });
        it(`should have matching cycle count of:  ${shouldCycles}`, () => {
          assert.equal(cycleDifference, shouldCycles);
        });
        it('should return 0 (valid OP code)', () => {
          assert.equal(cpuOut, 0);
        });
        it('PC should increase by disassembler amount', () => {
          assert.equal((modifiyState.flags.pc - cpuInputState.flags.pc), disassembleOut.opBytes);
        });
        it(`PC should increase by:  ${shouldPC}`, () => {
          assert.equal((modifiyState.flags.pc - cpuInputState.flags.pc), shouldPC);
        });
        it(`Disassembler should return correct OP code: '${shouldOPCode}'`, () => {
          assert.equal(disassembleOut.opCode, shouldOPCode);
        });

        // OP Code specific tests
        it(`Register 'A' should equal 0b11001011`, () => {
          assert.equal(modifiyState.flags.a, 0b11001011);
        });
        it(`Register 'F' should equal 0x00 (Set To On)`, () => {
          assert.equal(modifiyState.flags.f, 0x01);
        });
      });

      describe('Carry (0x01) Stays On', () => {
        cpu = cpuFunc();
        var cpuInputState = Object.freeze({
          ...cpu,
          flags: {
            pc: 0,
            a: 0b11100101,
            f: 0x01
          },
          memory: [ 0x07 ]
        });

        var modifiyState = JSON.parse(JSON.stringify(cpuInputState));

        var disassembleOut = cpu.disassemble8080OP(cpuInputState, cpuInputState.flags.pc);
        var cpuOut = cpu.emulate8080OP(modifiyState, cpuInputState.flags.pc);
        var cycleDifference = (modifiyState.cycles - (cpuInputState.cycles ? cpuInputState.cycles : 0));

        var shouldCycles = 4;         // *** Cycles
        var shouldPC = 1;             // *** PC Count
        var shouldOPCode = 'RLCA';    // *** OP Code

        //Basic tests
        it('should have matching cycle count between the disassembler and emulator', () => {
          assert.equal(cycleDifference, disassembleOut.cycles);
        });
        it(`should have matching cycle count of:  ${shouldCycles}`, () => {
          assert.equal(cycleDifference, shouldCycles);
        });
        it('should return 0 (valid OP code)', () => {
          assert.equal(cpuOut, 0);
        });
        it('PC should increase by disassembler amount', () => {
          assert.equal((modifiyState.flags.pc - cpuInputState.flags.pc), disassembleOut.opBytes);
        });
        it(`PC should increase by:  ${shouldPC}`, () => {
          assert.equal((modifiyState.flags.pc - cpuInputState.flags.pc), shouldPC);
        });
        it(`Disassembler should return correct OP code: '${shouldOPCode}'`, () => {
          assert.equal(disassembleOut.opCode, shouldOPCode);
        });

        // OP Code specific tests
        it(`Register 'A' should equal 0b11001011`, () => {
          assert.equal(modifiyState.flags.a, 0b11001011);
        });
        it(`Register 'F' should equal 0x01 (keep On)`, () => {
          assert.equal(modifiyState.flags.f, 0x01);
        });
      });

      describe('Turn Carry (0x01) Off', () => {
        cpu = cpuFunc();
        var cpuInputState = Object.freeze({
          ...cpu,
          flags: {
            pc: 0,
            a: 0b01100101,
            f: 0x01
          },
          memory: [ 0x07 ]
        });

        var modifiyState = JSON.parse(JSON.stringify(cpuInputState));

        var disassembleOut = cpu.disassemble8080OP(cpuInputState, cpuInputState.flags.pc);
        var cpuOut = cpu.emulate8080OP(modifiyState, cpuInputState.flags.pc);
        var cycleDifference = (modifiyState.cycles - (cpuInputState.cycles ? cpuInputState.cycles : 0));

        var shouldCycles = 4;         // *** Cycles
        var shouldPC = 1;             // *** PC Count
        var shouldOPCode = 'RLCA';    // *** OP Code

        //Basic tests
        it('should have matching cycle count between the disassembler and emulator', () => {
          assert.equal(cycleDifference, disassembleOut.cycles);
        });
        it(`should have matching cycle count of:  ${shouldCycles}`, () => {
          assert.equal(cycleDifference, shouldCycles);
        });
        it('should return 0 (valid OP code)', () => {
          assert.equal(cpuOut, 0);
        });
        it('PC should increase by disassembler amount', () => {
          assert.equal((modifiyState.flags.pc - cpuInputState.flags.pc), disassembleOut.opBytes);
        });
        it(`PC should increase by:  ${shouldPC}`, () => {
          assert.equal((modifiyState.flags.pc - cpuInputState.flags.pc), shouldPC);
        });
        it(`Disassembler should return correct OP code: '${shouldOPCode}'`, () => {
          assert.equal(disassembleOut.opCode, shouldOPCode);
        });

        // OP Code specific tests
        it(`Register 'A' should equal 0b11001010`, () => {
          assert.equal(modifiyState.flags.a, 0b11001010);
        });
        it(`Register 'F' should equal 0x00 (Set To Off)`, () => {
          assert.equal(modifiyState.flags.f, 0x00);
        });
      });
    });

    describe('0x08 - NOP', () => {
      cpu = cpuFunc();
      var cpuInputState = Object.freeze({
        ...cpu,
        flags: {
          pc: 0
        },
        memory: [ 0x08, 0x00, 0x00 ]
      });

      var modifiyState = JSON.parse(JSON.stringify(cpuInputState));

      var disassembleOut = cpu.disassemble8080OP(cpuInputState, cpuInputState.flags.pc);
      var cpuOut = cpu.emulate8080OP(modifiyState, cpuInputState.flags.pc);
      var cycleDifference = (modifiyState.cycles - (cpuInputState.cycles ? cpuInputState.cycles : 0));

      var shouldCycles = 4;         // *** Cycles
      var shouldPC = 1;             // *** PC Count
      var shouldOPCode = 'NOP';     // *** OP Code

      //Basic tests
      it('should have matching cycle count between the disassembler and emulator', () => {
        assert.equal(cycleDifference, disassembleOut.cycles);
      });
      it(`should have matching cycle count of:  ${shouldCycles}`, () => {
        assert.equal(cycleDifference, shouldCycles);
      });
      it('should return 0 (valid OP code)', () => {
        assert.equal(cpuOut, 0);
      });
      it('PC should increase by disassembler amount', () => {
        assert.equal((modifiyState.flags.pc - cpuInputState.flags.pc), disassembleOut.opBytes);
      });
      it(`PC should increase by:  ${shouldPC}`, () => {
        assert.equal((modifiyState.flags.pc - cpuInputState.flags.pc), shouldPC);
      });
      it(`Disassembler should return correct OP code: '${shouldOPCode}'`, () => {
        assert.equal(disassembleOut.opCode, shouldOPCode);
      });
    });

    describe('0x05 - DCRR', () => {
      describe('Basic', () => {
        cpu = cpuFunc();
        var cpuInputState = Object.freeze({
          ...cpu,
          flags: {
            pc: 0,
            b: 0x04,
            c: 0x07
          },
          memory: [ 0x05 ]
        });

        var modifiyState = JSON.parse(JSON.stringify(cpuInputState));

        var disassembleOut = cpu.disassemble8080OP(cpuInputState, cpuInputState.flags.pc);
        var cpuOut = cpu.emulate8080OP(modifiyState, cpuInputState.flags.pc);
        var cycleDifference = (modifiyState.cycles - (cpuInputState.cycles ? cpuInputState.cycles : 0));

        var shouldCycles = 5;         // *** Cycles
        var shouldPC = 1;             // *** PC Count
        var shouldOPCode = 'DCRR';    // *** OP Code

        //Basic tests
        it('should have matching cycle count between the disassembler and emulator', () => {
          assert.equal(cycleDifference, disassembleOut.cycles);
        });
        it(`should have matching cycle count of:  ${shouldCycles}`, () => {
          assert.equal(cycleDifference, shouldCycles);
        });
        it('should return 0 (valid OP code)', () => {
          assert.equal(cpuOut, 0);
        });
        it('PC should increase by disassembler amount', () => {
          assert.equal((modifiyState.flags.pc - cpuInputState.flags.pc), disassembleOut.opBytes);
        });
        it(`PC should increase by:  ${shouldPC}`, () => {
          assert.equal((modifiyState.flags.pc - cpuInputState.flags.pc), shouldPC);
        });
        it(`Disassembler should return correct OP code: '${shouldOPCode}'`, () => {
          assert.equal(disassembleOut.opCode, shouldOPCode);
        });

        // OP Code specific tests
        it(`Register 'B' should equal 0x03`, () => {
          assert.equal(modifiyState.flags.b, 0x03);
        });
        it(`Register 'C' should equal 0x07`, () => {
          assert.equal(modifiyState.flags.c, 0x07);
        });
      });

      describe('Full Overflow Loop (B=0x00->0xff, C=0x07->0x07)', () => {
        cpu = cpuFunc();
        var cpuInputState = Object.freeze({
          ...cpu,
          flags: {
            pc: 0,
            b: 0x00,
            c: 0x07
          },
          memory: [ 0x05 ]
        });

        var modifiyState = JSON.parse(JSON.stringify(cpuInputState));

        var disassembleOut = cpu.disassemble8080OP(cpuInputState, cpuInputState.flags.pc);
        var cpuOut = cpu.emulate8080OP(modifiyState, cpuInputState.flags.pc);
        var cycleDifference = (modifiyState.cycles - (cpuInputState.cycles ? cpuInputState.cycles : 0));

        var shouldCycles = 5;         // *** Cycles
        var shouldPC = 1;             // *** PC Count
        var shouldOPCode = 'DCRR';    // *** OP Code

        //Basic tests
        it('should have matching cycle count between the disassembler and emulator', () => {
          assert.equal(cycleDifference, disassembleOut.cycles);
        });
        it(`should have matching cycle count of:  ${shouldCycles}`, () => {
          assert.equal(cycleDifference, shouldCycles);
        });
        it('should return 0 (valid OP code)', () => {
          assert.equal(cpuOut, 0);
        });
        it('PC should increase by disassembler amount', () => {
          assert.equal((modifiyState.flags.pc - cpuInputState.flags.pc), disassembleOut.opBytes);
        });
        it(`PC should increase by:  ${shouldPC}`, () => {
          assert.equal((modifiyState.flags.pc - cpuInputState.flags.pc), shouldPC);
        });
        it(`Disassembler should return correct OP code: '${shouldOPCode}'`, () => {
          assert.equal(disassembleOut.opCode, shouldOPCode);
        });

        // OP Code specific tests
        it(`Register 'B' should equal 0xff`, () => {
          assert.equal(modifiyState.flags.b, 0xff);
        });
        it(`Register 'C' should equal 0x07`, () => {
          assert.equal(modifiyState.flags.c, 0x07);
        });
      });
    });

    describe('0x09 - INXR', () => {
      describe('Basic', () => {
        cpu = cpuFunc();
        var cpuInputState = Object.freeze({
          ...cpu,
          flags: {
            pc: 0,
            b: 0x01,
            c: 0x02,
            h: 0x03,
            l: 0x04
          },
          memory: [ 0x09, 0x00, 0x00 ]
        });

        var modifiyState = JSON.parse(JSON.stringify(cpuInputState));

        var disassembleOut = cpu.disassemble8080OP(cpuInputState, cpuInputState.flags.pc);
        var cpuOut = cpu.emulate8080OP(modifiyState, cpuInputState.flags.pc);
        var cycleDifference = (modifiyState.cycles - (cpuInputState.cycles ? cpuInputState.cycles : 0));

        var shouldCycles = 11;        // *** Cycles
        var shouldPC = 1;             // *** PC Count
        var shouldOPCode = 'INXR';    // *** OP Code

        //Basic tests
        it('should have matching cycle count between the disassembler and emulator', () => {
          assert.equal(cycleDifference, disassembleOut.cycles);
        });
        it(`should have matching cycle count of:  ${shouldCycles}`, () => {
          assert.equal(cycleDifference, shouldCycles);
        });
        it('should return 0 (valid OP code)', () => {
          assert.equal(cpuOut, 0);
        });
        it('PC should increase by disassembler amount', () => {
          assert.equal((modifiyState.flags.pc - cpuInputState.flags.pc), disassembleOut.opBytes);
        });
        it(`PC should increase by:  ${shouldPC}`, () => {
          assert.equal((modifiyState.flags.pc - cpuInputState.flags.pc), shouldPC);
        });
        it(`Disassembler should return correct OP code: '${shouldOPCode}'`, () => {
          assert.equal(disassembleOut.opCode, shouldOPCode);
        });

        // OP Code specific tests
        it(`Register 'H' should equal 0x06`, () => {
          assert.equal(modifiyState.flags.h, 0x04);
        });
        it(`Register 'L' should equal 0x06`, () => {
          assert.equal(modifiyState.flags.l, 0x06);
        });
      });

      describe('Full Overflow Loop (HL=0xfffe->0x)', () => {
        cpu = cpuFunc();
        var cpuInputState = Object.freeze({
          ...cpu,
          flags: {
            pc: 0,
            b: 0x12,
            c: 0x34,
            h: 0xff,
            l: 0xfe
          },
          memory: [ 0x09, 0x00, 0x00 ]
        });

        var modifiyState = JSON.parse(JSON.stringify(cpuInputState));

        var disassembleOut = cpu.disassemble8080OP(cpuInputState, cpuInputState.flags.pc);
        var cpuOut = cpu.emulate8080OP(modifiyState, cpuInputState.flags.pc);
        var cycleDifference = (modifiyState.cycles - (cpuInputState.cycles ? cpuInputState.cycles : 0));

        var shouldCycles = 11;        // *** Cycles
        var shouldPC = 1;             // *** PC Count
        var shouldOPCode = 'INXR';    // *** OP Code

        //Basic tests
        it('should have matching cycle count between the disassembler and emulator', () => {
          assert.equal(cycleDifference, disassembleOut.cycles);
        });
        it(`should have matching cycle count of:  ${shouldCycles}`, () => {
          assert.equal(cycleDifference, shouldCycles);
        });
        it('should return 0 (valid OP code)', () => {
          assert.equal(cpuOut, 0);
        });
        it('PC should increase by disassembler amount', () => {
          assert.equal((modifiyState.flags.pc - cpuInputState.flags.pc), disassembleOut.opBytes);
        });
        it(`PC should increase by:  ${shouldPC}`, () => {
          assert.equal((modifiyState.flags.pc - cpuInputState.flags.pc), shouldPC);
        });
        it(`Disassembler should return correct OP code: '${shouldOPCode}'`, () => {
          assert.equal(disassembleOut.opCode, shouldOPCode);
        });

        // OP Code specific tests
        it(`Register 'H' should equal 0x32`, () => {
          assert.equal(modifiyState.flags.h, 0x12);
        });
        it(`Register 'L' should equal 0x32`, () => {
          assert.equal(modifiyState.flags.l, 0x32);
        });
      });
    });

    describe('0x0a - LD2R', () => {
      cpu = cpuFunc();
      var cpuInputState = Object.freeze({
        ...cpu,
        flags: {
          pc: 0,
          a: 0x02,
          b: 0x00,
          c: 0x03
        },
        memory: [ 0x0a, 0xff, 0xfe, 0xfd, 0xfc ]
      });

      var modifiyState = JSON.parse(JSON.stringify(cpuInputState));

      var disassembleOut = cpu.disassemble8080OP(cpuInputState, cpuInputState.flags.pc);
      var cpuOut = cpu.emulate8080OP(modifiyState, cpuInputState.flags.pc);
      var cycleDifference = (modifiyState.cycles - (cpuInputState.cycles ? cpuInputState.cycles : 0));

      var shouldCycles = 7;         // *** Cycles
      var shouldPC = 1;             // *** PC Count
      var shouldOPCode = 'LD2R';    // *** OP Code

      //Basic tests
      it('should have matching cycle count between the disassembler and emulator', () => {
        assert.equal(cycleDifference, disassembleOut.cycles);
      });
      it(`should have matching cycle count of:  ${shouldCycles}`, () => {
        assert.equal(cycleDifference, shouldCycles);
      });
      it('should return 0 (valid OP code)', () => {
        assert.equal(cpuOut, 0);
      });
      it('PC should increase by disassembler amount', () => {
        assert.equal((modifiyState.flags.pc - cpuInputState.flags.pc), disassembleOut.opBytes);
      });
      it(`PC should increase by:  ${shouldPC}`, () => {
        assert.equal((modifiyState.flags.pc - cpuInputState.flags.pc), shouldPC);
      });
      it(`Disassembler should return correct OP code: '${shouldOPCode}'`, () => {
        assert.equal(disassembleOut.opCode, shouldOPCode);
      });

      // OP Code specific tests
      it(`Register 'A' should equal 0xfd`, () => {
        assert.equal(modifiyState.flags.a, 0xfd);
      });
    });

  });
});
