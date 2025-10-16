var assert = require('assert');
var cpuFunc = require('../cpu');

var cpu;

describe('Z80 CPU Emulator', () => {
  describe('CPU Functions', () => {
      
    before(() => {
      cpu = cpuFunc();
      return ;
    });

    describe('writeByte', () => {
      describe('Basic', () => {
        cpu = cpuFunc();
        var cpuInputState = Object.freeze({
          ...cpu,
          flags: {
            pc: 0
          },
          memory: [ 0x00, 0x00, 0x00 ]
        });

        var modifiyState = JSON.parse(JSON.stringify(cpuInputState));

        var cpuOut = cpu.writeByte(modifiyState, 0x01, 0x04);

        //Basic tests
        it('should write byte at given address: 0x01', () => {
          assert.equal(modifiyState.memory[0x01], 0x04);
        });
        it('should not write byte at other addresses: 0x00', () => {
          assert.equal(modifiyState.memory[0x00], 0x00);
        });
        it('should not write byte at other addresses: 0x02', () => {
          assert.equal(modifiyState.memory[0x02], 0x00);
        });
      });

      describe('Error', () => {
        cpu = cpuFunc();
        var cpuInputState = Object.freeze({
          ...cpu,
          flags: {
            pc: 0
          },
          memory: [ 0x00, 0x00, 0x00 ],
          warningCb: (event) => {
            warningMsg = [event, 'ye', 'been', 'warned'];
          }
        });

        var modifiyState = JSON.parse(JSON.stringify(cpuInputState));

        modifiyState.warningCb = cpuInputState.warningCb;

        var cpuOut = cpu.writeByte(modifiyState, 0x01, 0x04);

        //Basic tests
        it('should execute warningCb with romWriteCheck event', () => {
          assert.equal(warningMsg[0], 'romWriteCheck');
        });
      });
    });

    describe('readByte', () => {
      describe('Basic', () => {
        cpu = cpuFunc();
        var cpuInputState = Object.freeze({
          ...cpu,
          flags: {
            pc: 0
          },
          memory: [ 0x04, 0x05, 0x06 ]
        });

        var modifiyState = JSON.parse(JSON.stringify(cpuInputState));

        var cpuOut = cpu.readByte(modifiyState, 0x01);

        //Basic tests
        it('should read byte at given address: 0x01', () => {
          assert.equal(cpuOut, 0x05);
        });
      });

      describe('Error', () => {
        cpu = cpuFunc();
        var warningMsg = null;
        var cpuInputState = Object.freeze({
          ...cpu,
          flags: {
            pc: 0
          },
          memory: [ ],
          warningCb: (event) => {
            warningMsg = [event, 'ye', 'been', 'warned'];
          }
        });

        var modifiyState = JSON.parse(JSON.stringify(cpuInputState));

        modifiyState.warningCb = cpuInputState.warningCb;

        var cpuOut = cpu.readByte(modifiyState, 0x01);

        //Basic tests
        it('should execute warningCb with readByte event', () => {
          assert.equal(warningMsg[0], 'readByte');
        });
      });
    });

    describe('splitBytes', () => {
      cpu = cpuFunc();

      var splitBytesOut = cpu.splitBytes(0x1234);

      //Basic tests
      it('should get 0x34 from: 0x1234', () => {
        assert.equal(splitBytesOut[0], 0x34);
      });
      it('should get 0x12 from: 0x1234', () => {
        assert.equal(splitBytesOut[1], 0x12);
      });
    });

    describe('parity', () => {
      describe('Parity 8 (precalculated)', () => {
        cpu = cpuFunc();

        var parityRes0 = cpu.preCalculatedParitySize8(0);
        var parityRes1 = cpu.preCalculatedParitySize8(1);

        //Basic tests
        it('should get true from: 0', () => {
          assert.equal(parityRes0, true);
        });
        it('should get false from: 1', () => {
          assert.equal(parityRes1, false);
        });

      });
      describe('Parity 4', () => {
        cpu = cpuFunc();

        var parityRes0 = cpu.parity(0, 4);
        var parityRes1 = cpu.parity(1, 4);

        //Basic tests
        it('should get true from: 0', () => {
          assert.equal(parityRes0, true);
        });
        it('should get false from: 1', () => {
          assert.equal(parityRes1, false);
        });

      });
    });

    describe('getFlags', () => {
      cpu = cpuFunc();
      var cpuInputState = Object.freeze({
        ...cpu,
        flags: {
          pc: 0,
          a: 0x01,
          b: 0x02,
          c: 0x03,
          d: 0x04,
          e: 0x05,
          f: 0x06,
          h: 0x07,
          l: 0x08
        },
        memory: [ ]
      });

      var modifiyState = JSON.parse(JSON.stringify(cpuInputState));

      var cpuOutAF = cpu.getFlags(modifiyState, "af");
      var cpuOutBC = cpu.getFlags(modifiyState, "bc");
      var cpuOutDE = cpu.getFlags(modifiyState, "de");
      var cpuOutHL = cpu.getFlags(modifiyState, "hl");

      //Basic tests
      it('should return the value in AF (0x0106)', () => {
        assert.equal(cpuOutAF, 0x0106);
      });
      it('should return the value in BC (0x0203)', () => {
        assert.equal(cpuOutBC, 0x0203);
      });
      it('should return the value in DE (0x0405)', () => {
        assert.equal(cpuOutDE, 0x0405);
      });
      it('should return the value in HL (0x0708)', () => {
        assert.equal(cpuOutHL, 0x0708);
      });
    });

    describe('readWord', () => {
      cpu = cpuFunc();
      var cpuInputState = Object.freeze({
        ...cpu,
        flags: {
          pc: 0
        },
        memory: [ 0x04, 0x05, 0x06, 0x07, 0x08 ]
      });

      var modifiyState = JSON.parse(JSON.stringify(cpuInputState));

      var cpuReadWordOut = cpu.readWord(modifiyState, 0x01);

      //Basic tests
      it('should return the value at 0x0001 and 0x0002 (0x0605)', () => {
        assert.equal(cpuReadWordOut, 0x0605);
      });
    });

    describe('writeWord', () => {
      cpu = cpuFunc();
      var cpuInputState = Object.freeze({
        ...cpu,
        flags: {
          pc: 0
        },
        memory: [ 0x04, 0x05, 0x06, 0x07, 0x08 ]
      });

      var modifiyState = JSON.parse(JSON.stringify(cpuInputState));

      var cpuReadWordOut = cpu.writeWord(modifiyState, 0x01, 0x1234);

      //Basic tests
      it('should write the value at 0x0001 and 0x0002 (0x1234)', () => {
        assert.equal(modifiyState.memory[0x01], 0x34);
        assert.equal(modifiyState.memory[0x02], 0x12);
      });
      it('should not write to other addresses around 0x0001 and 0x0002', () => {
        assert.equal(modifiyState.memory[0x00], 0x04);
        assert.equal(modifiyState.memory[0x03], 0x07);
      });
    });

    describe('readHardwarePort', () => {
      describe('Basic', () => {
        cpu = cpuFunc();
        var cpuInputState = Object.freeze({
          ...cpu,
          flags: {
            pc: 0
          },
          memory: [ ],
          hwIntPorts: [
            0b00110011,
            0b10101010
          ]
        });

        var modifiyState = JSON.parse(JSON.stringify(cpuInputState));

        var cpuReadHWOut0 = cpu.readHWPort(modifiyState, 0x00);
        var cpuReadHWOut1 = cpu.readHWPort(modifiyState, 0x01);

        //Basic tests
        it('should read from hardware port 0x00: 0b00110011', () => {
          assert.equal(cpuReadHWOut0, 0b00110011);
        });
        it('should read from hardware port 0x01: 0b10101010', () => {
          assert.equal(cpuReadHWOut1, 0b10101010);
        });
      });

      describe('preread hook inject overrite', () => {
        cpu = cpuFunc();
        var cpuInputState = Object.freeze({
          ...cpu,
          flags: {
            pc: 0
          },
          memory: [ ],
          hwIntPorts: [
            0b00110011,
            0b10101010
          ]
        });

        var modifiyState = JSON.parse(JSON.stringify(cpuInputState));

        modifiyState.hwPortHook = (event, state, portCh) => {
          if (event === "preread") {
            modifiyState.hwIntPorts[portCh] = 0b11110000;
          }
        };

        var cpuReadWordOut = cpu.readHWPort(modifiyState, 0x00);

        //Basic tests
        it('should read from hardware port 0x00: 0b11110000 (from state)', () => {
          assert.equal(modifiyState.hwIntPorts[0x00], 0b11110000);
        });
        it('should read from hardware port 0x00: 0b11110000 (from function return)', () => {
          assert.equal(cpuReadWordOut, 0b11110000);
        });
      });

      describe('postread hook inject overrite', () => {
        cpu = cpuFunc();
        var cpuInputState = Object.freeze({
          ...cpu,
          flags: {
            pc: 0
          },
          memory: [ ],
          hwIntPorts: [
            0b00110011,
            0b10101010
          ]
        });

        var modifiyState = JSON.parse(JSON.stringify(cpuInputState));

        modifiyState.hwPortHook = (event, state, portCh) => {
          if (event === "postread") {
            modifiyState.hwIntPorts[portCh] = 0b11110000;
          }
        };

        var cpuReadWordOut = cpu.readHWPort(modifiyState, 0x00);

        //Basic tests
        it('should read from hardware port 0x00: 0b11110000 (from state)', () => {
          assert.equal(modifiyState.hwIntPorts[0x00], 0b11110000);
        });
        it('should read from hardware port 0x00: 0b00110011 (from function return)', () => {
          assert.equal(cpuReadWordOut, 0b00110011);
        });
      });
    });

    describe('writeHardwarePort', () => {
      describe('Basic', () => {
        cpu = cpuFunc();
        var cpuInputState = Object.freeze({
          ...cpu,
          flags: {
            pc: 0
          },
          memory: [ ],
          hwIntPorts: [
            0b00110011,
            0b10101010
          ]
        });

        var modifiyState = JSON.parse(JSON.stringify(cpuInputState));

        cpu.writeHWPort(modifiyState, 0x00, 0b11001100);
        cpu.writeHWPort(modifiyState, 0x01, 0b00001111);

        //Basic tests
        it('should read from hardware port 0x00: 0b11001100', () => {
          assert.equal(modifiyState.hwIntPorts[0x00], 0b11001100);
        });
        it('should read from hardware port 0x01: 0b00001111', () => {
          assert.equal(modifiyState.hwIntPorts[0x01], 0b00001111);
        });
      });

      describe('prewrite hook inject overrite', () => {
        cpu = cpuFunc();
        var cpuInputState = Object.freeze({
          ...cpu,
          flags: {
            pc: 0
          },
          memory: [ ],
          hwIntPorts: [
            0b00110011,
            0b10101010
          ]
        });

        var modifiyState = JSON.parse(JSON.stringify(cpuInputState));

        modifiyState.hwPortHook = (event, state, portCh) => {
          if (event === "prewrite") {
            modifiyState.hwIntPorts[portCh] = 0b11110000;
          }
        };

        cpu.writeHWPort(modifiyState, 0x00, 0b11001100);

        //Basic tests
        it('should write to the hardware port 0x00: 0b11001100 (from state)', () => {
          assert.equal(modifiyState.hwIntPorts[0x00], 0b11001100);
        });
        it('should write to the hardware port 0x00: 0b00110011 (from initial input)', () => {
          assert.equal(cpuInputState.hwIntPorts[0x00], 0b00110011);
        });
      });

      describe('postwrite hook inject overrite', () => {
        cpu = cpuFunc();
        var cpuInputState = Object.freeze({
          ...cpu,
          flags: {
            pc: 0
          },
          memory: [ ],
          hwIntPorts: [
            0b00110011,
            0b10101010
          ]
        });

        var modifiyState = JSON.parse(JSON.stringify(cpuInputState));

        modifiyState.hwPortHook = (event, state, portCh) => {
          if (event === "postwrite") {
            return 0b11110000;
          }
        };

        cpu.writeHWPort(modifiyState, 0x00, 0b11001100);

        //Basic tests
        it('should write to the hardware port 0x00: 0b11110000 (from state)', () => {
          assert.equal(modifiyState.hwIntPorts[0x00], 0b11110000);
        });
      });
    });

    describe('interruptCheck', () => {
      describe('Less then 16667 cycles', () => {
        cpu = cpuFunc();
        var cpuInputState = Object.freeze({
          ...cpu,
          flags: {
            pc: 0
          },
          memory: [ 0x01, 0x02, 0x03, 0x04, 0x05 ],
          cycles: 500
        });
  
        var modifiyState = JSON.parse(JSON.stringify(cpuInputState));

        var interruptCheckOut = cpu.interruptCheck(modifiyState);

        //Basic tests
        it('should not execute any interrupt code', () => {
          assert.equal(interruptCheckOut, undefined);
        });
      });

      describe('Set previous interrupt to 0x08 (currently 0x10)', () => {
        cpu = cpuFunc();
        var cpuInputState = Object.freeze({
          ...cpu,
          flags: {
            pc: 0
          },
          memory: [ 0x01, 0x02, 0x03, 0x04, 0x05 ],
          cycles: 16668,
          pInterrupt: 0x10
        });
  
        var modifiyState = JSON.parse(JSON.stringify(cpuInputState));

        var interruptCheckOut = cpu.interruptCheck(modifiyState);

        //Basic tests
        it('should set the previous interrupt to 0x08', () => {
          assert.equal(modifiyState.pInterrupt, 0x08);
        });
      });

      describe('Set previous interrupt to 0x10 (currently 0x08)', () => {
        cpu = cpuFunc();
        var cpuInputState = Object.freeze({
          ...cpu,
          flags: {
            pc: 0
          },
          memory: [ 0x01, 0x02, 0x03, 0x04, 0x05 ],
          cycles: 16668,
          pInterrupt: 0x08
        });

        var modifiyState = JSON.parse(JSON.stringify(cpuInputState));

        var interruptCheckOut = cpu.interruptCheck(modifiyState);

        //Basic tests
        it('should set the previous interrupt to 0x10', () => {
          assert.equal(modifiyState.pInterrupt, 0x10);
        });
      });

      describe('Execute interrupt push', () => {
        cpu = cpuFunc();
        var cpuInputState = Object.freeze({
          ...cpu,
          flags: {
            pc: 0x0006,
            sp: 0x0004,
            f: 0x20
          },
          memory: [ 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08 ],
          cycles: 16668,
          pInterrupt: 0x08
        });

        var modifiyState = JSON.parse(JSON.stringify(cpuInputState));

        cpu.interruptCheck(modifiyState);

        //Basic tests
        it('should set the previous interrupt to 0x10', () => {
          assert.equal(modifiyState.pInterrupt, 0x10);
        });
        it('write the current PC (0x0006) location to SP - 2 (0x0002)', () => {
          assert.equal(modifiyState.memory[0x02], 0x06);
          assert.equal(modifiyState.memory[0x03], 0x00);
        });
        it('should set PC to interrupt location (0x10)', () => {
          assert.equal(modifiyState.flags.pc, 0x10);
        });
      });

      describe('Call interrupt callback', () => {
        cpu = cpuFunc();
        var interruptCalled = false;
        var cpuInputState = Object.freeze({
          ...cpu,
          flags: {
            pc: 0x0006,
            sp: 0x0004,
            f: 0x20
          },
          memory: [ 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08 ],
          cycles: 16668,
          pInterrupt: 0x08,
          cInterrupt: (state, pInterrupt) => {
            interruptCalled = true;
          }
        });

        var modifiyState = JSON.parse(JSON.stringify(cpuInputState));

        modifiyState.cInterrupt = cpuInputState.cInterrupt

        cpu.interruptCheck(modifiyState);

        //Basic tests
        it('cInterrupt should have been called', () => {
          assert.equal(interruptCalled, true);
        });
      });
    });

    describe('Stack Control', () => {
      describe('PUSH to Stack', () => {
        cpu = cpuFunc();
        var cpuInputState = Object.freeze({
          ...cpu,
          flags: {
            pc: 0x9876,
            sp: 0x0004
          },
          memory: [ 0x01, 0x02, 0x03, 0x04, 0x05, 0x06 ]
        });

        var modifiyState = JSON.parse(JSON.stringify(cpuInputState));

        var cpuOut = cpu.push(modifiyState, modifiyState.flags.pc);

        //Basic tests
        it('SP should be moved back to 0x02', () => {
          assert.equal(modifiyState.flags.sp, 0x02);
        });
        it('should write PC (0x9876) to stack list', () => {
          assert.equal(modifiyState.memory[0x02], 0x76);
          assert.equal(modifiyState.memory[0x03], 0x98);
        });
      });

      describe('POP from stack', () => {
        cpu = cpuFunc();
        var cpuInputState = Object.freeze({
          ...cpu,
          flags: {
            pc: 0x9876,
            sp: 0x0004
          },
          memory: [ 0x01, 0x02, 0x03, 0x04, 0x05, 0x06 ]
        });

        var modifiyState = JSON.parse(JSON.stringify(cpuInputState));

        var cpuOut = cpu.pop(modifiyState);

        //Basic tests
        it('should move PC to new location', () => {
          assert.equal(cpuOut, 0x0605);
        });
        it('should move SP forward 2', () => {
          assert.equal(modifiyState.flags.sp, 0x0006);
        });
      });

      describe('POP from stack and UPDATE PC', () => {
        cpu = cpuFunc();
        var cpuInputState = Object.freeze({
          ...cpu,
          flags: {
            pc: 0x9876,
            sp: 0x0004
          },
          memory: [ 0x01, 0x02, 0x03, 0x04, 0x05, 0x06 ]
        });

        var modifiyState = JSON.parse(JSON.stringify(cpuInputState));

        var cpuOut = cpu.pop(modifiyState, true);

        //Basic tests
        it('should move PC to new location from inside function', () => {
          assert.equal(modifiyState.flags.pc, 0x0605);
        });
        it('should move SP forward 2', () => {
          assert.equal(modifiyState.flags.sp, 0x0006);
        });
      });
    });

    describe('addSubByte', () => {
      describe('Basic Add', () => {
        cpu = cpuFunc();
        var cpuInputState = Object.freeze({
          ...cpu,
          flags: {
            f: 0
          },
          memory: [ ]
        });

        var modifiyState = JSON.parse(JSON.stringify(cpuInputState));

        var cpuOut = cpu.addSubByte(modifiyState, 0x04, 0x03, 1);

        //Basic tests
        it('should add 0x04 and 0x03 to 0x07', () => {
          assert.equal(cpuOut, 0x07);
        });
        it('should not turn on carry flag (0x01)', () => {
          assert.equal(modifiyState.flags.f & 0x01, 0x00);
        });
        it('should not turn on parity flag (0x04)', () => {
          assert.equal(modifiyState.flags.f & 0x04, 0x00);
        });
        it('should not turn on halfcarry flag (0x10)', () => {
          assert.equal(modifiyState.flags.f & 0x10, 0x00);
        });
        it('should not turn on interrupt flag (0x20)', () => {
          assert.equal(modifiyState.flags.f & 0x20, 0x00);
        });
        it('should not turn on zero flag (0x40)', () => {
          assert.equal(modifiyState.flags.f & 0x40, 0x00);
        });
        it('should not turn on sign flag (0x80)', () => {
          assert.equal(modifiyState.flags.f & 0x80, 0x00);
        });
      });

      describe('Add overflow', () => {
        cpu = cpuFunc();
        var cpuInputState = Object.freeze({
          ...cpu,
          flags: {
            f: 0
          },
          memory: [ ]
        });

        var modifiyState = JSON.parse(JSON.stringify(cpuInputState));

        var cpuOut = cpu.addSubByte(modifiyState, 0xfe, 0x03, 1);

        //Basic tests
        it('should add 0xfe and 0x03 to 0x01', () => {
          assert.equal(cpuOut, 0x01);
        });
        it('should turn on carry flag (0x01)', () => {
          assert.equal(modifiyState.flags.f & 0x01, 0x01);
        });
        it('should not turn on parity flag (0x04)', () => {
          assert.equal(modifiyState.flags.f & 0x04, 0x00);
        });
        it('should turn on halfcarry flag (0x10)', () => {
          assert.equal(modifiyState.flags.f & 0x10, 0x10);
        });
        it('should not turn on interrupt flag (0x20)', () => {
          assert.equal(modifiyState.flags.f & 0x20, 0x00);
        });
        it('should not turn on zero flag (0x40)', () => {
          assert.equal(modifiyState.flags.f & 0x40, 0x00);
        });
        it('should not turn on sign flag (0x80)', () => {
          assert.equal(modifiyState.flags.f & 0x80, 0x00);
        });
      });

      describe('Add Parity flag on', () => {
        cpu = cpuFunc();
        var cpuInputState = Object.freeze({
          ...cpu,
          flags: {
            f: 0
          },
          memory: [ ]
        });

        var modifiyState = JSON.parse(JSON.stringify(cpuInputState));

        var cpuOut = cpu.addSubByte(modifiyState, 0x05, 0x03, 1);

        //Basic tests
        it('should add 0x05 and 0x03 to 0x01', () => {
          assert.equal(cpuOut, 0x08);
        });
        it('should not turn on carry flag (0x01)', () => {
          assert.equal(modifiyState.flags.f & 0x01, 0x00);
        });
        it('should turn on parity flag (0x04)', () => {
          assert.equal(modifiyState.flags.f & 0x04, 0x04);
        });
        it('should not turn on halfcarry flag (0x10)', () => {
          assert.equal(modifiyState.flags.f & 0x10, 0x00);
        });
        it('should not turn on interrupt flag (0x20)', () => {
          assert.equal(modifiyState.flags.f & 0x20, 0x00);
        });
        it('should not turn on zero flag (0x40)', () => {
          assert.equal(modifiyState.flags.f & 0x40, 0x00);
        });
        it('should not turn on sign flag (0x80)', () => {
          assert.equal(modifiyState.flags.f & 0x80, 0x00);
        });
      });

      describe('Add halfcarry flag on', () => {
        cpu = cpuFunc();
        var cpuInputState = Object.freeze({
          ...cpu,
          flags: {
            f: 0
          },
          memory: [ ]
        });

        var modifiyState = JSON.parse(JSON.stringify(cpuInputState));

        var cpuOut = cpu.addSubByte(modifiyState, 0x0f, 0x0f, 1);

        //Basic tests
        it('should add 0x0f and 0x0f to 0x1e', () => {
          assert.equal(cpuOut, 0x1e);
        });
        it('should not turn on carry flag (0x01)', () => {
          assert.equal(modifiyState.flags.f & 0x01, 0x00);
        });
        it('should turn on parity flag (0x04)', () => {
          assert.equal(modifiyState.flags.f & 0x04, 0x04);
        });
        it('should turn on halfcarry flag (0x10)', () => {
          assert.equal(modifiyState.flags.f & 0x10, 0x10);
        });
        it('should not turn on interrupt flag (0x20)', () => {
          assert.equal(modifiyState.flags.f & 0x20, 0x00);
        });
        it('should not turn on zero flag (0x40)', () => {
          assert.equal(modifiyState.flags.f & 0x40, 0x00);
        });
        it('should not turn on sign flag (0x80)', () => {
          assert.equal(modifiyState.flags.f & 0x80, 0x00);
        });
      });

      describe('Add zero flag on', () => {
        cpu = cpuFunc();
        var cpuInputState = Object.freeze({
          ...cpu,
          flags: {
            f: 0
          },
          memory: [ ]
        });

        var modifiyState = JSON.parse(JSON.stringify(cpuInputState));

        var cpuOut = cpu.addSubByte(modifiyState, 0xff, 0x01, 1);

        //Basic tests
        it('should add 0xff and 0x01 to 0x01', () => {
          assert.equal(cpuOut, 0x00);
        });
        it('should turn on carry flag (0x01)', () => {
          assert.equal(modifiyState.flags.f & 0x01, 0x01);
        });
        it('should turn on parity flag (0x04)', () => {
          assert.equal(modifiyState.flags.f & 0x04, 0x04);
        });
        it('should turn on halfcarry flag (0x10)', () => {
          assert.equal(modifiyState.flags.f & 0x10, 0x10);
        });
        it('should not turn on interrupt flag (0x20)', () => {
          assert.equal(modifiyState.flags.f & 0x20, 0x00);
        });
        it('should turn on zero flag (0x40)', () => {
          assert.equal(modifiyState.flags.f & 0x40, 0x40);
        });
        it('should not turn on sign flag (0x80)', () => {
          assert.equal(modifiyState.flags.f & 0x80, 0x00);
        });
      });

      describe('Add sign flag on', () => {
        cpu = cpuFunc();
        var cpuInputState = Object.freeze({
          ...cpu,
          flags: {
            f: 0
          },
          memory: [ ]
        });

        var modifiyState = JSON.parse(JSON.stringify(cpuInputState));

        var cpuOut = cpu.addSubByte(modifiyState, 0x7f, 0x01, 1);

        //Basic tests
        it('should add 0x7f and 0x01 to 0x80', () => {
          assert.equal(cpuOut, 0x80);
        });
        it('should not turn on carry flag (0x01)', () => {
          assert.equal(modifiyState.flags.f & 0x01, 0x00);
        });
        it('should turn on parity flag (0x04)', () => {
          assert.equal(modifiyState.flags.f & 0x04, 0x04);
        });
        it('should turn on halfcarry flag (0x10)', () => {
          assert.equal(modifiyState.flags.f & 0x10, 0x10);
        });
        it('should not turn on interrupt flag (0x20)', () => {
          assert.equal(modifiyState.flags.f & 0x20, 0x00);
        });
        it('should not turn on zero flag (0x40)', () => {
          assert.equal(modifiyState.flags.f & 0x40, 0x00);
        });
        it('should turn on sign flag (0x80)', () => {
          assert.equal(modifiyState.flags.f & 0x80, 0x80);
        });
      });

      describe('Sub basic', () => {
        cpu = cpuFunc();
        var cpuInputState = Object.freeze({
          ...cpu,
          flags: {
            f: 0
          },
          memory: [ ]
        });

        var modifiyState = JSON.parse(JSON.stringify(cpuInputState));

        var cpuOut = cpu.addSubByte(modifiyState, 0x7f, 0x01, -1);

        //Basic tests
        it('should sub 0x7f and 0x01 to 0x7e', () => {
          assert.equal(cpuOut, 0x7e);
        });
        it('should not turn on carry flag (0x01)', () => {
          assert.equal(modifiyState.flags.f & 0x01, 0x00);
        });
        it('should turn on parity flag (0x04)', () => {
          assert.equal(modifiyState.flags.f & 0x04, 0x04);
        });
        it('should not turn on halfcarry flag (0x10)', () => {
          assert.equal(modifiyState.flags.f & 0x10, 0x00);
        });
        it('should not turn on interrupt flag (0x20)', () => {
          assert.equal(modifiyState.flags.f & 0x20, 0x00);
        });
        it('should not turn on zero flag (0x40)', () => {
          assert.equal(modifiyState.flags.f & 0x40, 0x00);
        });
        it('should not turn on sign flag (0x80)', () => {
          assert.equal(modifiyState.flags.f & 0x80, 0x00);
        });
      });

      describe('Sub turn on sign flag', () => {
        cpu = cpuFunc();
        var cpuInputState = Object.freeze({
          ...cpu,
          flags: {
            f: 0
          },
          memory: [ ]
        });

        var modifiyState = JSON.parse(JSON.stringify(cpuInputState));

        var cpuOut = cpu.addSubByte(modifiyState, 0x81, 0x01, -1);

        //Basic tests
        it('should sub 0x80 and 0x01 to 0x80', () => {
          assert.equal(cpuOut, 0x80);
        });
        it('should not turn on carry flag (0x01)', () => {
          assert.equal(modifiyState.flags.f & 0x01, 0x00);
        });
        it('should turn on parity flag (0x04)', () => {
          assert.equal(modifiyState.flags.f & 0x04, 0x04);
        });
        it('should not turn on halfcarry flag (0x10)', () => {
          assert.equal(modifiyState.flags.f & 0x10, 0x00);
        });
        it('should not turn on interrupt flag (0x20)', () => {
          assert.equal(modifiyState.flags.f & 0x20, 0x00);
        });
        it('should not turn on zero flag (0x40)', () => {
          assert.equal(modifiyState.flags.f & 0x40, 0x00);
        });
        it('should turn on sign flag (0x80)', () => {
          assert.equal(modifiyState.flags.f & 0x80, 0x80);
        });
      });

      describe('Sub overflow', () => {
        cpu = cpuFunc();
        var cpuInputState = Object.freeze({
          ...cpu,
          flags: {
            f: 0
          },
          memory: [ ]
        });

        var modifiyState = JSON.parse(JSON.stringify(cpuInputState));

        var cpuOut = cpu.addSubByte(modifiyState, 0x02, 0x04, -1);

        //Basic tests
        it('should sub 0x02 and 0x04 to 0xfe', () => {
          assert.equal(cpuOut, 0xfe);
        });
        it('should turn on carry flag (0x01)', () => {
          assert.equal(modifiyState.flags.f & 0x01, 0x01);
        });
        it('should turn on parity flag (0x04)', () => {
          assert.equal(modifiyState.flags.f & 0x04, 0x04);
        });
        it('should not turn on halfcarry flag (0x10)', () => {
          assert.equal(modifiyState.flags.f & 0x10, 0x10);
        });
        it('should not turn on interrupt flag (0x20)', () => {
          assert.equal(modifiyState.flags.f & 0x20, 0x00);
        });
        it('should not turn on zero flag (0x40)', () => {
          assert.equal(modifiyState.flags.f & 0x40, 0x00);
        });
        it('should turn on sign flag (0x80)', () => {
          assert.equal(modifiyState.flags.f & 0x80, 0x80);
        });
      });
    });
  
    describe('addSubWithCarryByte', () => {
      describe('No carry (0x01)', () => {
        describe('Basic Add', () => {
          cpu = cpuFunc();
          var cpuInputState = Object.freeze({
            ...cpu,
            flags: {
              f: 0
            },
            memory: [ ]
          });
  
          var modifiyState = JSON.parse(JSON.stringify(cpuInputState));
  
          var cpuOut = cpu.addSubWithCarryByte(modifiyState, 0x04, 0x03, 1);
  
          //Basic tests
          it('should add 0x04 and 0x03 to 0x07', () => {
            assert.equal(cpuOut, 0x07);
          });
          it('should not turn on carry flag (0x01)', () => {
            assert.equal(modifiyState.flags.f & 0x01, 0x00);
          });
          it('should not turn on parity flag (0x04)', () => {
            assert.equal(modifiyState.flags.f & 0x04, 0x00);
          });
          it('should not turn on halfcarry flag (0x10)', () => {
            assert.equal(modifiyState.flags.f & 0x10, 0x00);
          });
          it('should not turn on interrupt flag (0x20)', () => {
            assert.equal(modifiyState.flags.f & 0x20, 0x00);
          });
          it('should not turn on zero flag (0x40)', () => {
            assert.equal(modifiyState.flags.f & 0x40, 0x00);
          });
          it('should not turn on sign flag (0x80)', () => {
            assert.equal(modifiyState.flags.f & 0x80, 0x00);
          });
        });

        describe('Add overflow', () => {
          cpu = cpuFunc();
          var cpuInputState = Object.freeze({
            ...cpu,
            flags: {
              f: 0
            },
            memory: [ ]
          });
  
          var modifiyState = JSON.parse(JSON.stringify(cpuInputState));
  
          var cpuOut = cpu.addSubWithCarryByte(modifiyState, 0xfe, 0x03, 1);
  
          //Basic tests
          it('should add 0xfe and 0x03 to 0x01', () => {
            assert.equal(cpuOut, 0x01);
          });
          it('should turn on carry flag (0x01)', () => {
            assert.equal(modifiyState.flags.f & 0x01, 0x01);
          });
          it('should not turn on parity flag (0x04)', () => {
            assert.equal(modifiyState.flags.f & 0x04, 0x00);
          });
          it('should turn on halfcarry flag (0x10)', () => {
            assert.equal(modifiyState.flags.f & 0x10, 0x10);
          });
          it('should not turn on interrupt flag (0x20)', () => {
            assert.equal(modifiyState.flags.f & 0x20, 0x00);
          });
          it('should not turn on zero flag (0x40)', () => {
            assert.equal(modifiyState.flags.f & 0x40, 0x00);
          });
          it('should not turn on sign flag (0x80)', () => {
            assert.equal(modifiyState.flags.f & 0x80, 0x00);
          });
        });

        describe('Add Parity flag on', () => {
          cpu = cpuFunc();
          var cpuInputState = Object.freeze({
            ...cpu,
            flags: {
              f: 0
            },
            memory: [ ]
          });
  
          var modifiyState = JSON.parse(JSON.stringify(cpuInputState));
  
          var cpuOut = cpu.addSubWithCarryByte(modifiyState, 0x05, 0x03, 1);
  
          //Basic tests
          it('should add 0x05 and 0x03 to 0x01', () => {
            assert.equal(cpuOut, 0x08);
          });
          it('should not turn on carry flag (0x01)', () => {
            assert.equal(modifiyState.flags.f & 0x01, 0x00);
          });
          it('should turn on parity flag (0x04)', () => {
            assert.equal(modifiyState.flags.f & 0x04, 0x04);
          });
          it('should not turn on halfcarry flag (0x10)', () => {
            assert.equal(modifiyState.flags.f & 0x10, 0x00);
          });
          it('should not turn on interrupt flag (0x20)', () => {
            assert.equal(modifiyState.flags.f & 0x20, 0x00);
          });
          it('should not turn on zero flag (0x40)', () => {
            assert.equal(modifiyState.flags.f & 0x40, 0x00);
          });
          it('should not turn on sign flag (0x80)', () => {
            assert.equal(modifiyState.flags.f & 0x80, 0x00);
          });
        });

        describe('Add halfcarry flag on', () => {
          cpu = cpuFunc();
          var cpuInputState = Object.freeze({
            ...cpu,
            flags: {
              f: 0
            },
            memory: [ ]
          });
  
          var modifiyState = JSON.parse(JSON.stringify(cpuInputState));
  
          var cpuOut = cpu.addSubWithCarryByte(modifiyState, 0x0f, 0x0f, 1);
  
          //Basic tests
          it('should add 0x0f and 0x0f to 0x1e', () => {
            assert.equal(cpuOut, 0x1e);
          });
          it('should not turn on carry flag (0x01)', () => {
            assert.equal(modifiyState.flags.f & 0x01, 0x00);
          });
          it('should turn on parity flag (0x04)', () => {
            assert.equal(modifiyState.flags.f & 0x04, 0x04);
          });
          it('should turn on halfcarry flag (0x10)', () => {
            assert.equal(modifiyState.flags.f & 0x10, 0x10);
          });
          it('should not turn on interrupt flag (0x20)', () => {
            assert.equal(modifiyState.flags.f & 0x20, 0x00);
          });
          it('should not turn on zero flag (0x40)', () => {
            assert.equal(modifiyState.flags.f & 0x40, 0x00);
          });
          it('should not turn on sign flag (0x80)', () => {
            assert.equal(modifiyState.flags.f & 0x80, 0x00);
          });
        });

        describe('Add zero flag on', () => {
          cpu = cpuFunc();
          var cpuInputState = Object.freeze({
            ...cpu,
            flags: {
              f: 0
            },
            memory: [ ]
          });
  
          var modifiyState = JSON.parse(JSON.stringify(cpuInputState));
  
          var cpuOut = cpu.addSubWithCarryByte(modifiyState, 0xff, 0x01, 1);
  
          //Basic tests
          it('should add 0xff and 0x01 to 0x01', () => {
            assert.equal(cpuOut, 0x00);
          });
          it('should turn on carry flag (0x01)', () => {
            assert.equal(modifiyState.flags.f & 0x01, 0x01);
          });
          it('should turn on parity flag (0x04)', () => {
            assert.equal(modifiyState.flags.f & 0x04, 0x04);
          });
          it('should turn on halfcarry flag (0x10)', () => {
            assert.equal(modifiyState.flags.f & 0x10, 0x10);
          });
          it('should not turn on interrupt flag (0x20)', () => {
            assert.equal(modifiyState.flags.f & 0x20, 0x00);
          });
          it('should turn on zero flag (0x40)', () => {
            assert.equal(modifiyState.flags.f & 0x40, 0x40);
          });
          it('should not turn on sign flag (0x80)', () => {
            assert.equal(modifiyState.flags.f & 0x80, 0x00);
          });
        });

        describe('Add sign flag on', () => {
          cpu = cpuFunc();
          var cpuInputState = Object.freeze({
            ...cpu,
            flags: {
              f: 0
            },
            memory: [ ]
          });
  
          var modifiyState = JSON.parse(JSON.stringify(cpuInputState));
  
          var cpuOut = cpu.addSubWithCarryByte(modifiyState, 0x7f, 0x01, 1);
  
          //Basic tests
          it('should add 0x7f and 0x01 to 0x80', () => {
            assert.equal(cpuOut, 0x80);
          });
          it('should not turn on carry flag (0x01)', () => {
            assert.equal(modifiyState.flags.f & 0x01, 0x00);
          });
          it('should turn on parity flag (0x04)', () => {
            assert.equal(modifiyState.flags.f & 0x04, 0x04);
          });
          it('should turn on halfcarry flag (0x10)', () => {
            assert.equal(modifiyState.flags.f & 0x10, 0x10);
          });
          it('should not turn on interrupt flag (0x20)', () => {
            assert.equal(modifiyState.flags.f & 0x20, 0x00);
          });
          it('should not turn on zero flag (0x40)', () => {
            assert.equal(modifiyState.flags.f & 0x40, 0x00);
          });
          it('should turn on sign flag (0x80)', () => {
            assert.equal(modifiyState.flags.f & 0x80, 0x80);
          });
        });

        describe('Sub basic', () => {
          cpu = cpuFunc();
          var cpuInputState = Object.freeze({
            ...cpu,
            flags: {
              f: 0
            },
            memory: [ ]
          });
  
          var modifiyState = JSON.parse(JSON.stringify(cpuInputState));
  
          var cpuOut = cpu.addSubWithCarryByte(modifiyState, 0x7f, 0x01, -1);
  
          //Basic tests
          it('should sub 0x7f and 0x01 to 0x7e', () => {
            assert.equal(cpuOut, 0x7e);
          });
          it('should not turn on carry flag (0x01)', () => {
            assert.equal(modifiyState.flags.f & 0x01, 0x00);
          });
          it('should turn on parity flag (0x04)', () => {
            assert.equal(modifiyState.flags.f & 0x04, 0x04);
          });
          it('should not turn on halfcarry flag (0x10)', () => {
            assert.equal(modifiyState.flags.f & 0x10, 0x00);
          });
          it('should not turn on interrupt flag (0x20)', () => {
            assert.equal(modifiyState.flags.f & 0x20, 0x00);
          });
          it('should not turn on zero flag (0x40)', () => {
            assert.equal(modifiyState.flags.f & 0x40, 0x00);
          });
          it('should not turn on sign flag (0x80)', () => {
            assert.equal(modifiyState.flags.f & 0x80, 0x00);
          });
        });

        describe('Sub turn on sign flag', () => {
          cpu = cpuFunc();
          var cpuInputState = Object.freeze({
            ...cpu,
            flags: {
              f: 0
            },
            memory: [ ]
          });
  
          var modifiyState = JSON.parse(JSON.stringify(cpuInputState));
  
          var cpuOut = cpu.addSubWithCarryByte(modifiyState, 0x81, 0x01, -1);
  
          //Basic tests
          it('should sub 0x80 and 0x01 to 0x80', () => {
            assert.equal(cpuOut, 0x80);
          });
          it('should not turn on carry flag (0x01)', () => {
            assert.equal(modifiyState.flags.f & 0x01, 0x00);
          });
          it('should turn on parity flag (0x04)', () => {
            assert.equal(modifiyState.flags.f & 0x04, 0x04);
          });
          it('should not turn on halfcarry flag (0x10)', () => {
            assert.equal(modifiyState.flags.f & 0x10, 0x00);
          });
          it('should not turn on interrupt flag (0x20)', () => {
            assert.equal(modifiyState.flags.f & 0x20, 0x00);
          });
          it('should not turn on zero flag (0x40)', () => {
            assert.equal(modifiyState.flags.f & 0x40, 0x00);
          });
          it('should turn on sign flag (0x80)', () => {
            assert.equal(modifiyState.flags.f & 0x80, 0x80);
          });
        });

        describe('Sub overflow', () => {
          cpu = cpuFunc();
          var cpuInputState = Object.freeze({
            ...cpu,
            flags: {
              f: 0
            },
            memory: [ ]
          });
  
          var modifiyState = JSON.parse(JSON.stringify(cpuInputState));
  
          var cpuOut = cpu.addSubWithCarryByte(modifiyState, 0x02, 0x04, -1);
  
          //Basic tests
          it('should sub 0x02 and 0x04 to 0xfe', () => {
            assert.equal(cpuOut, 0xfe);
          });
          it('should turn on carry flag (0x01)', () => {
            assert.equal(modifiyState.flags.f & 0x01, 0x01);
          });
          it('should turn on parity flag (0x04)', () => {
            assert.equal(modifiyState.flags.f & 0x04, 0x04);
          });
          it('should not turn on halfcarry flag (0x10)', () => {
            assert.equal(modifiyState.flags.f & 0x10, 0x10);
          });
          it('should not turn on interrupt flag (0x20)', () => {
            assert.equal(modifiyState.flags.f & 0x20, 0x00);
          });
          it('should not turn on zero flag (0x40)', () => {
            assert.equal(modifiyState.flags.f & 0x40, 0x00);
          });
          it('should turn on sign flag (0x80)', () => {
            assert.equal(modifiyState.flags.f & 0x80, 0x80);
          });
        });
      });

      describe('Carry set (0x01)', () => {
        describe('Basic Add', () => {
          cpu = cpuFunc();
          var cpuInputState = Object.freeze({
            ...cpu,
            flags: {
              f: 0x01
            },
            memory: [ ]
          });
  
          var modifiyState = JSON.parse(JSON.stringify(cpuInputState));
  
          var cpuOut = cpu.addSubWithCarryByte(modifiyState, 0x04, 0x03, 1);
  
          //Basic tests
          it('should add 0x04 and 0x03 to 0x07', () => {
            assert.equal(cpuOut, 0x08);
          });
          it('should not turn on carry flag (0x01)', () => {
            assert.equal(modifiyState.flags.f & 0x01, 0x00);
          });
          it('should turn on parity flag (0x04)', () => {
            assert.equal(modifiyState.flags.f & 0x04, 0x04);
          });
          it('should not turn on halfcarry flag (0x10)', () => {
            assert.equal(modifiyState.flags.f & 0x10, 0x00);
          });
          it('should not turn on interrupt flag (0x20)', () => {
            assert.equal(modifiyState.flags.f & 0x20, 0x00);
          });
          it('should not turn on zero flag (0x40)', () => {
            assert.equal(modifiyState.flags.f & 0x40, 0x00);
          });
          it('should not turn on sign flag (0x80)', () => {
            assert.equal(modifiyState.flags.f & 0x80, 0x00);
          });
        });

        describe('Add overflow', () => {
          cpu = cpuFunc();
          var cpuInputState = Object.freeze({
            ...cpu,
            flags: {
              f: 0x01
            },
            memory: [ ]
          });
  
          var modifiyState = JSON.parse(JSON.stringify(cpuInputState));
  
          var cpuOut = cpu.addSubWithCarryByte(modifiyState, 0xfe, 0x02, 1);
  
          //Basic tests
          it('should add 0xfe and 0x02 to 0x01', () => {
            assert.equal(cpuOut, 0x01);
          });
          it('should turn on carry flag (0x01)', () => {
            assert.equal(modifiyState.flags.f & 0x01, 0x01);
          });
          it('should not turn on parity flag (0x04)', () => {
            assert.equal(modifiyState.flags.f & 0x04, 0x00);
          });
          it('should turn on halfcarry flag (0x10)', () => {
            assert.equal(modifiyState.flags.f & 0x10, 0x10);
          });
          it('should not turn on interrupt flag (0x20)', () => {
            assert.equal(modifiyState.flags.f & 0x20, 0x00);
          });
          it('should not turn on zero flag (0x40)', () => {
            assert.equal(modifiyState.flags.f & 0x40, 0x00);
          });
          it('should not turn on sign flag (0x80)', () => {
            assert.equal(modifiyState.flags.f & 0x80, 0x00);
          });
        });

        describe('Add Parity flag on', () => {
          cpu = cpuFunc();
          var cpuInputState = Object.freeze({
            ...cpu,
            flags: {
              f: 0x01
            },
            memory: [ ]
          });
  
          var modifiyState = JSON.parse(JSON.stringify(cpuInputState));
  
          var cpuOut = cpu.addSubWithCarryByte(modifiyState, 0x05, 0x02, 1);
  
          //Basic tests
          it('should add 0x05 and 0x02 to 0x01', () => {
            assert.equal(cpuOut, 0x08);
          });
          it('should not turn on carry flag (0x01)', () => {
            assert.equal(modifiyState.flags.f & 0x01, 0x00);
          });
          it('should turn on parity flag (0x04)', () => {
            assert.equal(modifiyState.flags.f & 0x04, 0x04);
          });
          it('should not turn on halfcarry flag (0x10)', () => {
            assert.equal(modifiyState.flags.f & 0x10, 0x00);
          });
          it('should not turn on interrupt flag (0x20)', () => {
            assert.equal(modifiyState.flags.f & 0x20, 0x00);
          });
          it('should not turn on zero flag (0x40)', () => {
            assert.equal(modifiyState.flags.f & 0x40, 0x00);
          });
          it('should not turn on sign flag (0x80)', () => {
            assert.equal(modifiyState.flags.f & 0x80, 0x00);
          });
        });

        describe('Add halfcarry flag on', () => {
          cpu = cpuFunc();
          var cpuInputState = Object.freeze({
            ...cpu,
            flags: {
              f: 0x01
            },
            memory: [ ]
          });
  
          var modifiyState = JSON.parse(JSON.stringify(cpuInputState));
  
          var cpuOut = cpu.addSubWithCarryByte(modifiyState, 0x0f, 0x0e, 1);
  
          //Basic tests
          it('should add 0x0f and 0x0e to 0x1e', () => {
            assert.equal(cpuOut, 0x1e);
          });
          it('should not turn on carry flag (0x01)', () => {
            assert.equal(modifiyState.flags.f & 0x01, 0x00);
          });
          it('should turn on parity flag (0x04)', () => {
            assert.equal(modifiyState.flags.f & 0x04, 0x04);
          });
          it('should turn on halfcarry flag (0x10)', () => {
            assert.equal(modifiyState.flags.f & 0x10, 0x10);
          });
          it('should not turn on interrupt flag (0x20)', () => {
            assert.equal(modifiyState.flags.f & 0x20, 0x00);
          });
          it('should not turn on zero flag (0x40)', () => {
            assert.equal(modifiyState.flags.f & 0x40, 0x00);
          });
          it('should not turn on sign flag (0x80)', () => {
            assert.equal(modifiyState.flags.f & 0x80, 0x00);
          });
        });

        describe('Add zero flag on', () => {
          cpu = cpuFunc();
          var cpuInputState = Object.freeze({
            ...cpu,
            flags: {
              f: 0x01
            },
            memory: [ ]
          });
  
          var modifiyState = JSON.parse(JSON.stringify(cpuInputState));
  
          var cpuOut = cpu.addSubWithCarryByte(modifiyState, 0xfe, 0x01, 1);
  
          //Basic tests
          it('should add 0xff and 0xfe to 0x01', () => {
            assert.equal(cpuOut, 0x00);
          });
          it('should turn on carry flag (0x01)', () => {
            assert.equal(modifiyState.flags.f & 0x01, 0x01);
          });
          it('should turn on parity flag (0x04)', () => {
            assert.equal(modifiyState.flags.f & 0x04, 0x04);
          });
          it('should turn on halfcarry flag (0x10)', () => {
            assert.equal(modifiyState.flags.f & 0x10, 0x10);
          });
          it('should not turn on interrupt flag (0x20)', () => {
            assert.equal(modifiyState.flags.f & 0x20, 0x00);
          });
          it('should not turn on zero flag (0x40)', () => {
            assert.equal(modifiyState.flags.f & 0x40, 0x40);
          });
          it('should not turn on sign flag (0x80)', () => {
            assert.equal(modifiyState.flags.f & 0x80, 0x00);
          });
        });

        describe('Add sign flag on', () => {
          cpu = cpuFunc();
          var cpuInputState = Object.freeze({
            ...cpu,
            flags: {
              f: 0x01
            },
            memory: [ ]
          });
  
          var modifiyState = JSON.parse(JSON.stringify(cpuInputState));
  
          var cpuOut = cpu.addSubWithCarryByte(modifiyState, 0x7f, 0x01, 1);
  
          //Basic tests
          it('should add 0x7f and 0x01 to 0x81', () => {
            assert.equal(cpuOut, 0x81);
          });
          it('should not turn on carry flag (0x01)', () => {
            assert.equal(modifiyState.flags.f & 0x01, 0x00);
          });
          it('should not turn on parity flag (0x00)', () => {
            assert.equal(modifiyState.flags.f & 0x04, 0x00);
          });
          it('should turn on halfcarry flag (0x10)', () => {
            assert.equal(modifiyState.flags.f & 0x10, 0x10);
          });
          it('should not turn on interrupt flag (0x20)', () => {
            assert.equal(modifiyState.flags.f & 0x20, 0x00);
          });
          it('should not turn on zero flag (0x40)', () => {
            assert.equal(modifiyState.flags.f & 0x40, 0x00);
          });
          it('should turn on sign flag (0x80)', () => {
            assert.equal(modifiyState.flags.f & 0x80, 0x80);
          });
        });

        describe('Sub basic', () => {
          cpu = cpuFunc();
          var cpuInputState = Object.freeze({
            ...cpu,
            flags: {
              f: 0x01
            },
            memory: [ ]
          });
  
          var modifiyState = JSON.parse(JSON.stringify(cpuInputState));
  
          var cpuOut = cpu.addSubWithCarryByte(modifiyState, 0x7f, 0x01, -1);
  
          //Basic tests
          it('should sub 0x7f and 0x01 to 0x7f', () => {
            assert.equal(cpuOut, 0x7f);
          });
          it('should not turn on carry flag (0x01)', () => {
            assert.equal(modifiyState.flags.f & 0x01, 0x00);
          });
          it('should turn on parity flag (0x04)', () => {
            assert.equal(modifiyState.flags.f & 0x04, 0x00);
          });
          it('should not turn on halfcarry flag (0x10)', () => {
            assert.equal(modifiyState.flags.f & 0x10, 0x00);
          });
          it('should not turn on interrupt flag (0x20)', () => {
            assert.equal(modifiyState.flags.f & 0x20, 0x00);
          });
          it('should not turn on zero flag (0x40)', () => {
            assert.equal(modifiyState.flags.f & 0x40, 0x00);
          });
          it('should not turn on sign flag (0x80)', () => {
            assert.equal(modifiyState.flags.f & 0x80, 0x00);
          });
        });

        describe('Sub turn on sign flag', () => {
          cpu = cpuFunc();
          var cpuInputState = Object.freeze({
            ...cpu,
            flags: {
              f: 0x01
            },
            memory: [ ]
          });
  
          var modifiyState = JSON.parse(JSON.stringify(cpuInputState));
  
          var cpuOut = cpu.addSubWithCarryByte(modifiyState, 0x81, 0x01, -1);
  
          //Basic tests
          it('should sub 0x80 and 0x01 to 0x81', () => {
            assert.equal(cpuOut, 0x81);
          });
          it('should not turn on carry flag (0x01)', () => {
            assert.equal(modifiyState.flags.f & 0x01, 0x00);
          });
          it('should not turn on parity flag (0x00)', () => {
            assert.equal(modifiyState.flags.f & 0x04, 0x00);
          });
          it('should not turn on halfcarry flag (0x10)', () => {
            assert.equal(modifiyState.flags.f & 0x10, 0x00);
          });
          it('should not turn on interrupt flag (0x20)', () => {
            assert.equal(modifiyState.flags.f & 0x20, 0x00);
          });
          it('should not turn on zero flag (0x40)', () => {
            assert.equal(modifiyState.flags.f & 0x40, 0x00);
          });
          it('should turn on sign flag (0x80)', () => {
            assert.equal(modifiyState.flags.f & 0x80, 0x80);
          });
        });

        describe('Sub overflow', () => {
          cpu = cpuFunc();
          var cpuInputState = Object.freeze({
            ...cpu,
            flags: {
              f: 0x01
            },
            memory: [ ]
          });
  
          var modifiyState = JSON.parse(JSON.stringify(cpuInputState));
  
          var cpuOut = cpu.addSubWithCarryByte(modifiyState, 0x02, 0x04, -1);
  
          //Basic tests
          it('should sub 0x02 and 0x04 to 0xff', () => {
            assert.equal(cpuOut, 0xff);
          });
          it('should turn on carry flag (0x01)', () => {
            assert.equal(modifiyState.flags.f & 0x01, 0x01);
          });
          it('should not turn on parity flag (0x04)', () => {
            assert.equal(modifiyState.flags.f & 0x04, 0x00);
          });
          it('should not turn on halfcarry flag (0x10)', () => {
            assert.equal(modifiyState.flags.f & 0x10, 0x10);
          });
          it('should not turn on interrupt flag (0x20)', () => {
            assert.equal(modifiyState.flags.f & 0x20, 0x00);
          });
          it('should not turn on zero flag (0x40)', () => {
            assert.equal(modifiyState.flags.f & 0x40, 0x00);
          });
          it('should turn on sign flag (0x80)', () => {
            assert.equal(modifiyState.flags.f & 0x80, 0x80);
          });
        });
      });
    });
  
    describe('operandByte', () => {
      describe('Logical AND', () => {
        describe('Basic', () => {
          cpu = cpuFunc();
          var cpuInputState = Object.freeze({
            ...cpu,
            flags: {
              f: 0x00
            },
            memory: [ ]
          });

          var modifiyState = JSON.parse(JSON.stringify(cpuInputState));

          var cpuOut = cpu.operandByte(modifiyState, 0b01000010, 0b01000001, "&");

          //Basic tests
          it('should AND 0b01000010 and 0b01000001 to 0b01000000', () => {
            assert.equal(cpuOut, 0b01000000);
          });
          it('should not turn on carry flag (0x01)', () => {
            assert.equal(modifiyState.flags.f & 0x01, 0x00);
          });
          it('should turn on parity flag (0x04)', () => {
            assert.equal(modifiyState.flags.f & 0x04, 0x04);
          });
          it('should turn on halfcarry flag (0x10)', () => {
            assert.equal(modifiyState.flags.f & 0x10, 0x10);
          });
          it('should not turn on interrupt flag (0x20)', () => {
            assert.equal(modifiyState.flags.f & 0x20, 0x00);
          });
          it('should not turn on zero flag (0x40)', () => {
            assert.equal(modifiyState.flags.f & 0x40, 0x00);
          });
          it('should not turn on sign flag (0x80)', () => {
            assert.equal(modifiyState.flags.f & 0x80, 0x00);
          });
        });

        describe('Turn on sign flag', () => {
          cpu = cpuFunc();
          var cpuInputState = Object.freeze({
            ...cpu,
            flags: {
              f: 0x00
            },
            memory: [ ]
          });

          var modifiyState = JSON.parse(JSON.stringify(cpuInputState));

          var cpuOut = cpu.operandByte(modifiyState, 0b11111111, 0b11111111, "&");

          //Basic tests
          it('should AND 0b11111110 and 0b11111111 to 0b11111111', () => {
            assert.equal(cpuOut, 0b11111111);
          });
          it('should not turn on carry flag (0x01)', () => {
            assert.equal(modifiyState.flags.f & 0x01, 0x00);
          });
          it('should not turn on parity flag (0x04)', () => {
            assert.equal(modifiyState.flags.f & 0x04, 0x00);
          });
          it('should not turn on halfcarry flag (0x10)', () => {
            assert.equal(modifiyState.flags.f & 0x10, 0x00);
          });
          it('should not turn on interrupt flag (0x20)', () => {
            assert.equal(modifiyState.flags.f & 0x20, 0x00);
          });
          it('should not turn on zero flag (0x40)', () => {
            assert.equal(modifiyState.flags.f & 0x40, 0x00);
          });
          it('should turn on sign flag (0x80)', () => {
            assert.equal(modifiyState.flags.f & 0x80, 0x80);
          });
        });

        describe('Turn on zero flag', () => {
          cpu = cpuFunc();
          var cpuInputState = Object.freeze({
            ...cpu,
            flags: {
              f: 0x00
            },
            memory: [ ]
          });

          var modifiyState = JSON.parse(JSON.stringify(cpuInputState));

          var cpuOut = cpu.operandByte(modifiyState, 0b01010101, 0b10101010, "&");

          //Basic tests
          it('should AND 0b11111110 and 0b01010101 to 0b10101010', () => {
            assert.equal(cpuOut, 0b00000000);
          });
          it('should not turn on carry flag (0x01)', () => {
            assert.equal(modifiyState.flags.f & 0x01, 0x00);
          });
          it('should turn on parity flag (0x04)', () => {
            assert.equal(modifiyState.flags.f & 0x04, 0x04);
          });
          it('should not turn on halfcarry flag (0x10)', () => {
            assert.equal(modifiyState.flags.f & 0x10, 0x00);
          });
          it('should not turn on interrupt flag (0x20)', () => {
            assert.equal(modifiyState.flags.f & 0x20, 0x00);
          });
          it('should turn on zero flag (0x40)', () => {
            assert.equal(modifiyState.flags.f & 0x40, 0x40);
          });
          it('should not turn on sign flag (0x80)', () => {
            assert.equal(modifiyState.flags.f & 0x80, 0x00);
          });
        });
      });

      describe('Logical OR', () => {
        describe('Basic', () => {
          cpu = cpuFunc();
          var cpuInputState = Object.freeze({
            ...cpu,
            flags: {
              f: 0x00
            },
            memory: [ ]
          });

          var modifiyState = JSON.parse(JSON.stringify(cpuInputState));

          var cpuOut = cpu.operandByte(modifiyState, 0b01000010, 0b01000001, "|");

          //Basic tests
          it('should AND 0b01000010 and 0b01000001 to 0b01000011', () => {
            assert.equal(cpuOut, 0b01000011);
          });
          it('should not turn on carry flag (0x01)', () => {
            assert.equal(modifiyState.flags.f & 0x01, 0x00);
          });
          it('should not turn on parity flag (0x04)', () => {
            assert.equal(modifiyState.flags.f & 0x04, 0x00);
          });
          it('should not turn on halfcarry flag (0x10)', () => {
            assert.equal(modifiyState.flags.f & 0x10, 0x00);
          });
          it('should not turn on interrupt flag (0x20)', () => {
            assert.equal(modifiyState.flags.f & 0x20, 0x00);
          });
          it('should not turn on zero flag (0x40)', () => {
            assert.equal(modifiyState.flags.f & 0x40, 0x00);
          });
          it('should not turn on sign flag (0x80)', () => {
            assert.equal(modifiyState.flags.f & 0x80, 0x00);
          });
        });

        describe('Turn on sign flag', () => {
          cpu = cpuFunc();
          var cpuInputState = Object.freeze({
            ...cpu,
            flags: {
              f: 0x00
            },
            memory: [ ]
          });

          var modifiyState = JSON.parse(JSON.stringify(cpuInputState));

          var cpuOut = cpu.operandByte(modifiyState, 0b11111111, 0b11111111, "|");

          //Basic tests
          it('should AND 0b11111110 and 0b11111111 to 0b11111111', () => {
            assert.equal(cpuOut, 0b11111111);
          });
          it('should not turn on carry flag (0x01)', () => {
            assert.equal(modifiyState.flags.f & 0x01, 0x00);
          });
          it('should not turn on parity flag (0x04)', () => {
            assert.equal(modifiyState.flags.f & 0x04, 0x00);
          });
          it('should not turn on halfcarry flag (0x10)', () => {
            assert.equal(modifiyState.flags.f & 0x10, 0x00);
          });
          it('should not turn on interrupt flag (0x20)', () => {
            assert.equal(modifiyState.flags.f & 0x20, 0x00);
          });
          it('should not turn on zero flag (0x40)', () => {
            assert.equal(modifiyState.flags.f & 0x40, 0x00);
          });
          it('should turn on sign flag (0x80)', () => {
            assert.equal(modifiyState.flags.f & 0x80, 0x80);
          });
        });

        describe('Turn on zero flag', () => {
          cpu = cpuFunc();
          var cpuInputState = Object.freeze({
            ...cpu,
            flags: {
              f: 0x00
            },
            memory: [ ]
          });

          var modifiyState = JSON.parse(JSON.stringify(cpuInputState));

          var cpuOut = cpu.operandByte(modifiyState, 0b00000000, 0b00000000, "|");

          //Basic tests
          it('should AND 0b00000000 and 0b00000000 to 0b00000000', () => {
            assert.equal(cpuOut, 0b00000000);
          });
          it('should not turn on carry flag (0x01)', () => {
            assert.equal(modifiyState.flags.f & 0x01, 0x00);
          });
          it('should turn on parity flag (0x04)', () => {
            assert.equal(modifiyState.flags.f & 0x04, 0x04);
          });
          it('should not turn on halfcarry flag (0x10)', () => {
            assert.equal(modifiyState.flags.f & 0x10, 0x00);
          });
          it('should not turn on interrupt flag (0x20)', () => {
            assert.equal(modifiyState.flags.f & 0x20, 0x00);
          });
          it('should turn on zero flag (0x40)', () => {
            assert.equal(modifiyState.flags.f & 0x40, 0x40);
          });
          it('should not turn on sign flag (0x80)', () => {
            assert.equal(modifiyState.flags.f & 0x80, 0x00);
          });
        });
      });

      describe('Logical XOR', () => {
        describe('Basic', () => {
          cpu = cpuFunc();
          var cpuInputState = Object.freeze({
            ...cpu,
            flags: {
              f: 0x00
            },
            memory: [ ]
          });

          var modifiyState = JSON.parse(JSON.stringify(cpuInputState));

          var cpuOut = cpu.operandByte(modifiyState, 0b11001100, 0b01100110, "^");

          //Basic tests
          it('should AND 0b11001100 and 0b01100110 to 0b01000011', () => {
            assert.equal(cpuOut, 0b10101010);
          });
          it('should not turn on carry flag (0x01)', () => {
            assert.equal(modifiyState.flags.f & 0x01, 0x00);
          });
          it('should turn on parity flag (0x04)', () => {
            assert.equal(modifiyState.flags.f & 0x04, 0x04);
          });
          it('should not turn on halfcarry flag (0x10)', () => {
            assert.equal(modifiyState.flags.f & 0x10, 0x00);
          });
          it('should not turn on interrupt flag (0x20)', () => {
            assert.equal(modifiyState.flags.f & 0x20, 0x00);
          });
          it('should not turn on zero flag (0x40)', () => {
            assert.equal(modifiyState.flags.f & 0x40, 0x00);
          });
          it('should turn on sign flag (0x80)', () => {
            assert.equal(modifiyState.flags.f & 0x80, 0x80);
          });
        });

        describe('Turn on zero flag', () => {
          cpu = cpuFunc();
          var cpuInputState = Object.freeze({
            ...cpu,
            flags: {
              f: 0x00
            },
            memory: [ ]
          });

          var modifiyState = JSON.parse(JSON.stringify(cpuInputState));

          var cpuOut = cpu.operandByte(modifiyState, 0b00000000, 0b00000000, "^");

          //Basic tests
          it('should AND 0b00000000 and 0b00000000 to 0b00000000', () => {
            assert.equal(cpuOut, 0b00000000);
          });
          it('should not turn on carry flag (0x01)', () => {
            assert.equal(modifiyState.flags.f & 0x01, 0x00);
          });
          it('should turn on parity flag (0x04)', () => {
            assert.equal(modifiyState.flags.f & 0x04, 0x04);
          });
          it('should not turn on halfcarry flag (0x10)', () => {
            assert.equal(modifiyState.flags.f & 0x10, 0x00);
          });
          it('should not turn on interrupt flag (0x20)', () => {
            assert.equal(modifiyState.flags.f & 0x20, 0x00);
          });
          it('should turn on zero flag (0x40)', () => {
            assert.equal(modifiyState.flags.f & 0x40, 0x40);
          });
          it('should not turn on sign flag (0x80)', () => {
            assert.equal(modifiyState.flags.f & 0x80, 0x00);
          });
        });
      });
    });

    describe('indecrementByte', () => {
      describe('Add', () => {
        describe('Basic', () => {
          cpu = cpuFunc();
          var cpuInputState = Object.freeze({
            ...cpu,
            flags: {
              f: 0x00
            },
            memory: [ ]
          });

          var modifiyState = JSON.parse(JSON.stringify(cpuInputState));

          var cpuOut = cpu.indecrementByte(modifiyState, 0x03, 1);

          //Basic tests
          it('should increment 0x03 to 0x04', () => {
            assert.equal(cpuOut, 0x04);
          });
          it('should not turn on carry flag (0x01)', () => {
            assert.equal(modifiyState.flags.f & 0x01, 0x00);
          });
          it('should turn on parity flag (0x04)', () => {
            assert.equal(modifiyState.flags.f & 0x04, 0x04);
          });
          it('should not turn on halfcarry flag (0x10)', () => {
            assert.equal(modifiyState.flags.f & 0x10, 0x00);
          });
          it('should not turn on interrupt flag (0x20)', () => {
            assert.equal(modifiyState.flags.f & 0x20, 0x00);
          });
          it('should not turn on zero flag (0x40)', () => {
            assert.equal(modifiyState.flags.f & 0x40, 0x00);
          });
          it('should not turn on sign flag (0x80)', () => {
            assert.equal(modifiyState.flags.f & 0x80, 0x00);
          });
        });

        describe('Turn on the zero flag', () => {
          cpu = cpuFunc();
          var cpuInputState = Object.freeze({
            ...cpu,
            flags: {
              f: 0x00
            },
            memory: [ ]
          });

          var modifiyState = JSON.parse(JSON.stringify(cpuInputState));

          var cpuOut = cpu.indecrementByte(modifiyState, 0xff, 1);

          //Basic tests
          it('should increment 0xff to 0x00', () => {
            assert.equal(cpuOut, 0x00);
          });
          it('should not turn on carry flag (0x01)', () => {
            assert.equal(modifiyState.flags.f & 0x01, 0x00);
          });
          it('should turn on parity flag (0x04)', () => {
            assert.equal(modifiyState.flags.f & 0x04, 0x04);
          });
          it('should turn on halfcarry flag (0x10)', () => {
            assert.equal(modifiyState.flags.f & 0x10, 0x10);
          });
          it('should not turn on interrupt flag (0x20)', () => {
            assert.equal(modifiyState.flags.f & 0x20, 0x00);
          });
          it('should turn on zero flag (0x40)', () => {
            assert.equal(modifiyState.flags.f & 0x40, 0x40);
          });
          it('should not turn on sign flag (0x80)', () => {
            assert.equal(modifiyState.flags.f & 0x80, 0x00);
          });
        });

        describe('Turn on the zero flag', () => {
          cpu = cpuFunc();
          var cpuInputState = Object.freeze({
            ...cpu,
            flags: {
              f: 0x00
            },
            memory: [ ]
          });

          var modifiyState = JSON.parse(JSON.stringify(cpuInputState));

          var cpuOut = cpu.indecrementByte(modifiyState, 0xee, 1);

          //Basic tests
          it('should increment 0xee to 0xef', () => {
            assert.equal(cpuOut, 0xef);
          });
          it('should not turn on carry flag (0x01)', () => {
            assert.equal(modifiyState.flags.f & 0x01, 0x00);
          });
          it('should not turn on parity flag (0x04)', () => {
            assert.equal(modifiyState.flags.f & 0x04, 0x00);
          });
          it('should not turn on halfcarry flag (0x10)', () => {
            assert.equal(modifiyState.flags.f & 0x10, 0x00);
          });
          it('should not turn on interrupt flag (0x20)', () => {
            assert.equal(modifiyState.flags.f & 0x20, 0x00);
          });
          it('should not turn on zero flag (0x40)', () => {
            assert.equal(modifiyState.flags.f & 0x40, 0x00);
          });
          it('should not turn on sign flag (0x80)', () => {
            assert.equal(modifiyState.flags.f & 0x80, 0x80);
          });
        });
      });

      describe('Subtract', () => {
        describe('Basic', () => {
          cpu = cpuFunc();
          var cpuInputState = Object.freeze({
            ...cpu,
            flags: {
              f: 0x00
            },
            memory: [ ]
          });

          var modifiyState = JSON.parse(JSON.stringify(cpuInputState));

          var cpuOut = cpu.indecrementByte(modifiyState, 0x03, -1);

          //Basic tests
          it('should increment 0x03 to 0x02', () => {
            assert.equal(cpuOut, 0x02);
          });
          it('should not turn on carry flag (0x01)', () => {
            assert.equal(modifiyState.flags.f & 0x01, 0x00);
          });
          it('should turn on parity flag (0x04)', () => {
            assert.equal(modifiyState.flags.f & 0x04, 0x04);
          });
          it('should not turn on halfcarry flag (0x10)', () => {
            assert.equal(modifiyState.flags.f & 0x10, 0x00);
          });
          it('should not turn on interrupt flag (0x20)', () => {
            assert.equal(modifiyState.flags.f & 0x20, 0x00);
          });
          it('should not turn on zero flag (0x40)', () => {
            assert.equal(modifiyState.flags.f & 0x40, 0x00);
          });
          it('should not turn on sign flag (0x80)', () => {
            assert.equal(modifiyState.flags.f & 0x80, 0x00);
          });
        });

        describe('Turn on the zero flag', () => {
          cpu = cpuFunc();
          var cpuInputState = Object.freeze({
            ...cpu,
            flags: {
              f: 0x00
            },
            memory: [ ]
          });

          var modifiyState = JSON.parse(JSON.stringify(cpuInputState));

          var cpuOut = cpu.indecrementByte(modifiyState, 0x01, -1);

          //Basic tests
          it('should increment 0x01 to 0x00', () => {
            assert.equal(cpuOut, 0x00);
          });
          it('should not turn on carry flag (0x01)', () => {
            assert.equal(modifiyState.flags.f & 0x01, 0x00);
          });
          it('should turn on parity flag (0x04)', () => {
            assert.equal(modifiyState.flags.f & 0x04, 0x04);
          });
          it('should not turn on halfcarry flag (0x10)', () => {
            assert.equal(modifiyState.flags.f & 0x10, 0x00);
          });
          it('should not turn on interrupt flag (0x20)', () => {
            assert.equal(modifiyState.flags.f & 0x20, 0x00);
          });
          it('should turn on zero flag (0x40)', () => {
            assert.equal(modifiyState.flags.f & 0x40, 0x40);
          });
          it('should not turn on sign flag (0x80)', () => {
            assert.equal(modifiyState.flags.f & 0x80, 0x00);
          });
        });

        describe('Turn on the zero flag', () => {
          cpu = cpuFunc();
          var cpuInputState = Object.freeze({
            ...cpu,
            flags: {
              f: 0x00
            },
            memory: [ ]
          });

          var modifiyState = JSON.parse(JSON.stringify(cpuInputState));

          var cpuOut = cpu.indecrementByte(modifiyState, 0xef, -1);

          //Basic tests
          it('should increment 0xef to 0xee', () => {
            assert.equal(cpuOut, 0xee);
          });
          it('should not turn on carry flag (0x01)', () => {
            assert.equal(modifiyState.flags.f & 0x01, 0x00);
          });
          it('should turn on parity flag (0x04)', () => {
            assert.equal(modifiyState.flags.f & 0x04, 0x04);
          });
          it('should not turn on halfcarry flag (0x10)', () => {
            assert.equal(modifiyState.flags.f & 0x10, 0x00);
          });
          it('should not turn on interrupt flag (0x20)', () => {
            assert.equal(modifiyState.flags.f & 0x20, 0x00);
          });
          it('should not turn on zero flag (0x40)', () => {
            assert.equal(modifiyState.flags.f & 0x40, 0x00);
          });
          it('should not turn on sign flag (0x80)', () => {
            assert.equal(modifiyState.flags.f & 0x80, 0x80);
          });
        });
      });
    });

  });
});
