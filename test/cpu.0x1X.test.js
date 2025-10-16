var assert = require('assert');
var cpuFunc = require('../cpu');

var cpu;

describe('Z80 CPU Emulator', () => {
	describe('0x1X Set', () => {

		before(() => {
			cpu = cpuFunc();
			return;
		});

		describe('0x10 - NOP', () => {
			cpu = cpuFunc();
			var cpuInputState = Object.freeze({
				...cpu,
				flags: {
					pc: 0
				},
				memory: [0x10, 0x00, 0x00]
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

		describe('0x11 - LD2R', () => {
			cpu = cpuFunc();
			var cpuInputState = Object.freeze({
				...cpu,
				flags: {
					pc: 0,
					d: 0x01,
					e: 0x02
				},
				memory: [0x11, 0x04, 0x05]
			});

			var modifiyState = JSON.parse(JSON.stringify(cpuInputState));

			var disassembleOut = cpu.disassemble8080OP(cpuInputState, cpuInputState.flags.pc);
			var cpuOut = cpu.emulate8080OP(modifiyState, cpuInputState.flags.pc);
			var cycleDifference = (modifiyState.cycles - (cpuInputState.cycles ? cpuInputState.cycles : 0));

			var shouldCycles = 10;         // *** Cycles
			var shouldPC = 3;             // *** PC Count
			var shouldOPCode = 'LD2R';     // *** OP Code

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
			it(`Register 'D' should equal 0x04`, () => {
				assert.equal(modifiyState.flags.d, 0x05);
			});
			it(`Register 'E' should equal 0x05`, () => {
				assert.equal(modifiyState.flags.e, 0x04);
			});

			// Disassembler specific checks
			it(`Disassembler has set oreg`, () => {
				assert.equal(disassembleOut.oreg, "DE");
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
			it(`Disassembler should have p1 and p2 set`, () => {
				assert.equal(disassembleOut.para1, 0x04);
				assert.equal(disassembleOut.para2, 0x05);
			});
		});

		describe('0x12 - LD2M', () => {
			cpu = cpuFunc();
			var cpuInputState = Object.freeze({
				...cpu,
				flags: {
					pc: 0,
					a: 0x09,
					d: 0x00,
					e: 0x01
				},
				memory: [0x12, 0x04, 0x05]
			});

			var modifiyState = JSON.parse(JSON.stringify(cpuInputState));

			var disassembleOut = cpu.disassemble8080OP(cpuInputState, cpuInputState.flags.pc);
			var cpuOut = cpu.emulate8080OP(modifiyState, cpuInputState.flags.pc);
			var cycleDifference = (modifiyState.cycles - (cpuInputState.cycles ? cpuInputState.cycles : 0));

			var shouldCycles = 7;         // *** Cycles
			var shouldPC = 1;             // *** PC Count
			var shouldOPCode = 'LD2M';     // *** OP Code

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
			it(`Register 'D' should equal 0x00`, () => {
				assert.equal(modifiyState.flags.d, 0x00);
			});
			it(`Register 'E' should equal 0x01`, () => {
				assert.equal(modifiyState.flags.e, 0x01);
			});
			it(`Register 'A' should equal 0x09`, () => {
				assert.equal(modifiyState.flags.a, 0x09);
			});
			it(`Memory at 0x0001 should be 0x09`, () => {
				assert.equal(modifiyState.memory[0x0001], 0x09);
			});

			// Disassembler specific checks
			it(`Disassembler has set oreg`, () => {
				assert.equal(disassembleOut.oreg, "DE");
			});
			it(`Disassembler has set ireg set to A`, () => {
				assert.equal(disassembleOut.ireg, "A");
			});
			it(`Disassembler should have ptr set to '#'`, () => {
				assert.equal(disassembleOut.ptr, "#");
			});
			it(`Disassembler should not have conditional cycle checked`, () => {
				assert.equal(disassembleOut.cycleConditional, false);
			});
			it(`Disassembler should not have p1 and p2 set`, () => {
				assert.equal(disassembleOut.para1, "");
				assert.equal(disassembleOut.para2, "");
			});
		});

		describe('0x13 - INCR', () => {
			describe('Basic', () => {
				cpu = cpuFunc();
				var cpuInputState = Object.freeze({
					...cpu,
					flags: {
						pc: 0,
						d: 0x04,
						e: 0x07
					},
					memory: [0x13]
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
				it(`Register 'D' should equal 0x04`, () => {
					assert.equal(modifiyState.flags.d, 0x04);
				});
				it(`Register 'E' should equal 0x08`, () => {
					assert.equal(modifiyState.flags.e, 0x08);
				});

				// Disassembler specific checks
				it(`Disassembler has oreg set to DE`, () => {
					assert.equal(disassembleOut.oreg, "DE");
				});
				it(`Disassembler has set ireg to 'DE'`, () => {
					assert.equal(disassembleOut.ireg, "DE");
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

			describe('Full Overflow Loop (D=0xff->0x00, E=0xff->0x00)', () => {
				cpu = cpuFunc();
				var cpuInputState = Object.freeze({
					...cpu,
					flags: {
						pc: 0,
						d: 0xff,
						e: 0xff
					},
					memory: [0x13]
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
				it(`Register 'D' should equal 0x00`, () => {
					assert.equal(modifiyState.flags.d, 0x00);
				});
				it(`Register 'E' should equal 0x00`, () => {
					assert.equal(modifiyState.flags.e, 0x00);
				});

				// Disassembler specific checks
				it(`Disassembler has oreg set to DE`, () => {
					assert.equal(disassembleOut.oreg, "DE");
				});
				it(`Disassembler has set ireg to 'DE'`, () => {
					assert.equal(disassembleOut.ireg, "DE");
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

			describe('Simple Overflow Loop (D=0x05->0x06, E=0xff->0x00)', () => {
				cpu = cpuFunc();
				var cpuInputState = Object.freeze({
					...cpu,
					flags: {
						pc: 0,
						d: 0x05,
						e: 0xff
					},
					memory: [0x13]
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
				it(`Register 'D' should equal 0x06`, () => {
					assert.equal(modifiyState.flags.d, 0x06);
				});
				it(`Register 'E' should equal 0x00`, () => {
					assert.equal(modifiyState.flags.e, 0x00);
				});

				// Disassembler specific checks
				it(`Disassembler has oreg set to DE`, () => {
					assert.equal(disassembleOut.oreg, "DE");
				});
				it(`Disassembler has set ireg to 'DE'`, () => {
					assert.equal(disassembleOut.ireg, "DE");
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

		describe('0x15 - INCR', () => {
			describe('Basic', () => {
				cpu = cpuFunc();
				var cpuInputState = Object.freeze({
					...cpu,
					flags: {
						pc: 0,
						d: 0x04,
						e: 0x07
					},
					memory: [ 0x14 ]
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
				it(`Register 'D' should equal 0x05`, () => {
					assert.equal(modifiyState.flags.d, 0x05);
				});
				it(`Register 'E' should equal 0x07`, () => {
					assert.equal(modifiyState.flags.e, 0x07);
				});

				// Disassembler specific checks
				it(`Disassembler has oreg set to D`, () => {
					assert.equal(disassembleOut.oreg, "D");
				});
				it(`Disassembler has set ireg to 'D'`, () => {
					assert.equal(disassembleOut.ireg, "D");
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

			describe('Full Overflow Loop (D=0xff->0x00, E=0x07->0x07)', () => {
				cpu = cpuFunc();
				var cpuInputState = Object.freeze({
					...cpu,
					flags: {
						pc: 0,
						d: 0xff,
						e: 0x07
					},
					memory: [ 0x14 ]
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
				it(`Register 'D' should equal 0x00`, () => {
					assert.equal(modifiyState.flags.d, 0x00);
				});
				it(`Register 'E' should equal 0x07`, () => {
					assert.equal(modifiyState.flags.e, 0x07);
				});

				// Disassembler specific checks
				it(`Disassembler has oreg set to D`, () => {
					assert.equal(disassembleOut.oreg, "D");
				});
				it(`Disassembler has ireg to 'D'`, () => {
					assert.equal(disassembleOut.ireg, "D");
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

		describe('0x16 - LD2R', () => {
			cpu = cpuFunc();
			var cpuInputState = Object.freeze({
				...cpu,
				flags: {
					pc: 0,
					e: 0x22
				},
				memory: [ 0x16, 0x45, 0x89 ]
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
			it(`Register 'D' should equal 0x45`, () => {
				assert.equal(modifiyState.flags.d, 0x45);
			});
			it(`Register 'E' should equal 0x22 (Unchanged)`, () => {
				assert.equal(modifiyState.flags.e, 0x22);
			});

			// Disassembler specific checks
			it(`Disassembler has oreg set to D`, () => {
				assert.equal(disassembleOut.oreg, "D");
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
			it(`Disassembler should have p1 and not p2 set`, () => {
				assert.equal(disassembleOut.para1, (0x45).toString(16));
				assert.equal(disassembleOut.para2, "");
			});
		});

    describe('0x17 - RLC9', () => {
      describe('Basic', () => {
        cpu = cpuFunc();
        var cpuInputState = Object.freeze({
          ...cpu,
          flags: {
            pc: 0,
            a: 0b000001100,
            f: 0x00
          },
          memory: [ 0x17 ]
        });

        var modifiyState = JSON.parse(JSON.stringify(cpuInputState));

        var disassembleOut = cpu.disassemble8080OP(cpuInputState, cpuInputState.flags.pc);
        var cpuOut = cpu.emulate8080OP(modifiyState, cpuInputState.flags.pc);
        var cycleDifference = (modifiyState.cycles - (cpuInputState.cycles ? cpuInputState.cycles : 0));

        var shouldCycles = 4;         // *** Cycles
        var shouldPC = 1;             // *** PC Count
        var shouldOPCode = 'RLC9';    // *** OP Code

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
        it(`Register 'A' should equal 0b11000000000`, () => {
          assert.equal(modifiyState.flags.a, 0b11000000000);
        });
        it(`Register 'F' should equal 0x00 (Unchanged)`, () => {
          assert.equal(modifiyState.flags.f, 0x00);
        });

        // Disassembler specific checks
        it(`Disassembler has oreg set to A`, () => {
          assert.equal(disassembleOut.oreg, "A");
        });
        it(`Disassembler has set ireg to A`, () => {
          assert.equal(disassembleOut.ireg, "A");
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

      describe('Turn Carry (0x01) On', () => {
        cpu = cpuFunc();
        var cpuInputState = Object.freeze({
          ...cpu,
          flags: {
            pc: 0,
            a: 0b11001100,
            f: 0x00
          },
          memory: [ 0x17 ]
        });

        var modifiyState = JSON.parse(JSON.stringify(cpuInputState));

        var disassembleOut = cpu.disassemble8080OP(cpuInputState, cpuInputState.flags.pc);
        var cpuOut = cpu.emulate8080OP(modifiyState, cpuInputState.flags.pc);
        var cycleDifference = (modifiyState.cycles - (cpuInputState.cycles ? cpuInputState.cycles : 0));

        var shouldCycles = 4;         // *** Cycles
        var shouldPC = 1;             // *** PC Count
        var shouldOPCode = 'RLC9';    // *** OP Code

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
        it(`Register 'A' should equal 0b10011000000000`, () => {
          assert.equal(modifiyState.flags.a, 0b10011000000000);
        });
        it(`Register 'F' should equal 0x00 (Set To On)`, () => {
          assert.equal(modifiyState.flags.f, 0x01);
        });

        // Disassembler specific checks
        it(`Disassembler has oreg set to A`, () => {
          assert.equal(disassembleOut.oreg, "A");
        });
        it(`Disassembler has set ireg to A`, () => {
          assert.equal(disassembleOut.ireg, "A");
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

      describe('Carry (0x01) Stays On', () => {
        cpu = cpuFunc();
        var cpuInputState = Object.freeze({
          ...cpu,
          flags: {
            pc: 0,
            a: 0b11001100,
            f: 0x01
          },
          memory: [ 0x17 ]
        });

        var modifiyState = JSON.parse(JSON.stringify(cpuInputState));

        var disassembleOut = cpu.disassemble8080OP(cpuInputState, cpuInputState.flags.pc);
        var cpuOut = cpu.emulate8080OP(modifiyState, cpuInputState.flags.pc);
        var cycleDifference = (modifiyState.cycles - (cpuInputState.cycles ? cpuInputState.cycles : 0));

        var shouldCycles = 4;         // *** Cycles
        var shouldPC = 1;             // *** PC Count
        var shouldOPCode = 'RLC9';    // *** OP Code

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
        it(`Register 'A' should equal 0b10011000000001`, () => {
          assert.equal(modifiyState.flags.a, 0b10011000000001);
        });
        it(`Register 'F' should equal 0x01 (keep On)`, () => {
          assert.equal(modifiyState.flags.f, 0x01);
        });

        // Disassembler specific checks
        it(`Disassembler has oreg set to A`, () => {
          assert.equal(disassembleOut.oreg, "A");
        });
        it(`Disassembler has set ireg to A`, () => {
          assert.equal(disassembleOut.ireg, "A");
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

      describe('Turn Carry (0x01) Off', () => {
        cpu = cpuFunc();
        var cpuInputState = Object.freeze({
          ...cpu,
          flags: {
            pc: 0,
            a: 0b000001100,
            f: 0x01
          },
          memory: [ 0x17 ]
        });

        var modifiyState = JSON.parse(JSON.stringify(cpuInputState));

        var disassembleOut = cpu.disassemble8080OP(cpuInputState, cpuInputState.flags.pc);
        var cpuOut = cpu.emulate8080OP(modifiyState, cpuInputState.flags.pc);
        var cycleDifference = (modifiyState.cycles - (cpuInputState.cycles ? cpuInputState.cycles : 0));

        var shouldCycles = 4;         // *** Cycles
        var shouldPC = 1;             // *** PC Count
        var shouldOPCode = 'RLC9';    // *** OP Code

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
        it(`Register 'A' should equal 0b11000000001`, () => {
          assert.equal(modifiyState.flags.a, 0b11000000001);
        });
        it(`Register 'F' should equal 0x00 (Set To Off)`, () => {
          assert.equal(modifiyState.flags.f, 0x00);
        });

        // Disassembler specific checks
        it(`Disassembler has oreg set to A`, () => {
          assert.equal(disassembleOut.oreg, "A");
        });
        it(`Disassembler has set ireg to A`, () => {
          assert.equal(disassembleOut.ireg, "A");
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
});
