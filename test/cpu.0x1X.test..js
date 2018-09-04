var assert = require('assert');
var cpuFunc = require('../cpu');

var cpu;

describe('Z80 CPU Emulator', () => {
  describe('0x1X Set', () => {
      
    before(() => {
      cpu = cpuFunc();
      return ;
    });

    describe('0x10 - NOP', () => {
      cpu = cpuFunc();
      var cpuInputState = Object.freeze({
        ...cpu,
        flags: {
          pc: 0
        },
        memory: [ 0x10, 0x00, 0x00 ]
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

      // Disassembler specific checks
      it(`Disassembler has not set oreg`, () => {
        assert.equal(disassembleOut.oreg, "");
      });
      it(`Disassembler has not set ireg`, () => {
        assert.equal(disassembleOut.ireg, "");
      });
      it(`Disassembler should not have ptr set`, () => {
        assert.equal(disassembleOut.ptr, "");
      });
      it(`Disassembler should not have conditional cycle checked`, () => {
        assert.equal(disassembleOut.cycleConditional, false);
      });
      it(`Disassembler should not have p1 and p2 set`, () => {
        assert.equal(disassembleOut.para1, "");
        assert.equal(disassembleOut.para2, "");
      });
    });

  });
});
