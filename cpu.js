if (!cpuCore) {
  var cpuCore = [];
}

cpuCore.push(function() {
  var cpu = {
    name: "Z80"
  };
  /*
  Read this to keep some semblance of sanity.

  Warning: This is my own intreptation and understanding of the instructions provided by the Z80 processor. A lot of this was discovered by trial and error.
  I tried to keep this code a balance between not repeating myself and in the process creating 18 layers of functions. Pls forgive me and my protension.
  I have modified the assembly OP codes to be easier to understand by those not familiar with the Z80 processor's instruction set for the disassembler.
  In the mnemonics list below, I've added a reference to the original instruction mnemonic.

  Disassembler Instructions:
  Terms:
    PC      - Program Counter. This is a special register used by the CPU. This is the command that's currently being executed.
              It always increases by at least 1, and no more than 3 after each instruction, some instructions can increase it by 2 or 3.
    OREG    - Output to registers. Usually used to determine a memory location, but not always.
    IREG    - Input from registers. Usually used to load a value from to write somewhere.
    P1      - Parameter 1. This will be PC + 1 in memory.
    P2      - Parameter 2. This will be PC + 2 in memory.
    PTR     - Pointer value. If this is set it will look up using the value stored in that memory location, and use it. Basically a pointer.
              # - Output values are the location
              & - Input values are the location
              ! - Unknown (Used for UKNOP)

    Note: The special flag F will never be specified in IREG or OREG.

    Mnemonics:
      UKNOP: Unknown Operation
        I don't know what this does, so I couldn't write any code to deal with it. An error should be thrown. If one isn't by some chance, crazy things gonna happen.

      NOP: No Operation
        This spins the CPU +4 cycles. Usually used to let hardware settle, or to wait.

      LD2M: Load to memory location
        Uses OREG (or P1 and P2) to get a memory location, and writes either P1 or IREG into it.
        Note that if there is 2 parameters, and 1 OREG, the pointer flag maybe set.

      LD2R: Load to register
        Uses both registers in OREG to get a memory location; or, values in P1 and/or P2, and writes that value to one or 2 registers.
        If a memory location is provided, only one register will be written to.
        If 1 parameter is provided, only 1 register is written to. If 2 parameters are provided, 2 registers are written to.
        Note that if there is 2 parameters, and 1 OREG, the pointer flag maybe set.

      INCR: Increment register(s) by 1
        Increments a register, or 2 registers (the pair register) by 1. Register(s) effected are described in OREG and IREG.

      DCRR: Decrement register(s) by 1
        Decrements a register, or 2 registers (the pair register) by 1. Register(s) effected are described in OREG and IREG.

      INXR: Increment register(s) by X
        This loads a value from either P1 and/or P2; or from IREG, then adds and stores it into OREG.
        Technically any registers in OREG should also be added into IREG, since they need to be passed into the ALU with IREG, but were left out for brevity's sake.
        If two parameters are used, there will be 2 OREGs
        If 2 IREGs are used, there will be 2 OREGs

      ICXR: Increment carry register(s) by X
        This loads a value from either P1 and/or P2; or from IREG, then adds the carry flag from the F register and stores it into OREG.
        Technically any registers in OREG should also be added into IREG, since they need to be passed into the ALU with IREG, but were left out for brevity's sake.
        If two parameters are used, there will be 2 OREGs
        If 2 IREGs are used, there will be 2 OREGs

      DEXR: Decrement carry register(s) by X
        The first parameter is added to the carry flag in the F register before this operation is performed.
        This loads a value from either P1 and/or P2; or from IREG, then substracts and stores it into OREG.
        Technically any registers in OREG should also be added into IREG, since they need to be passed into the ALU with IREG, but were left out for brevity's sake.
        If two parameters are used, there will be 2 OREGs
        If 2 IREGs are used, there will be 2 OREGs

      DCXR: Increment register(s) by X
        This loads a value from either P1 and/or P2; or from IREG, then subtracts and stores it into OREG.
        Technically any registers in OREG should also be added into IREG, since they need to be passed into the ALU with IREG, but were left out for brevity's sake.
        If two parameters are used, there will be 2 OREGs
        If 2 IREGs are used, there will be 2 OREGs

      SUBX: Decrement register(s) by X
        This loads a value from either P1 and/or P2; or from IREG, then subtracts it. It does not store the result.
        This does modify the F register.

      INCM: Increment memory by 1
        Increments the value in a memory location by 1.
        If IREG has 2 registers present, then that is the memory location.
        Otherwise it will be a pointer of P1 and P2

      DCRM: Decrement memory by 1
        Decrements the value in a memory location by 1.
        If IREG has 2 registers present, then that is the memory location.
        Otherwise it will be a pointer of P1 and P2

      RLC: 8-bit Rotational Left Carry
        Rotates the bits loaded from P1, or IREG, and stores them in OREG. The most left bit is moved into the carry flag and to bit 0.

      RRC: 8-bit Rotational Right Carry
        Rotates the bits loaded from P1, or IREG, and stores them in OREG. The most right bit is moved into the carry flag and to bit 7.

      RRC9: 9-bit Rotational Right Carry
        Performs a 9-bit right rotation to the bits loaded from P1, or IREG, and stores them in OREG. The carry is copied into bit 7, then the bit leaving on the right is copied into the carry.

      RLC9: 9-bit Rotational Left Carry
        Performs a 9-bit left rotation to the bits loaded from P1, or IREG, and stores them in OREG. The carry is copied into bit 7, then the bit leaving on the left is copied into the carry.

      CPL: Invert All Bits
        Inverts all bits from IREG and stores them in OREG

      SCF: Set Carry Flag
        Sets the carry flag bit (On).

      CCF: Inverts the carry flag
        Flips the carry flag in the F register

      SIF: Sets the interrupt bit
        Sets the interrupt flag bit (On).

      DIF: Disable the interrupt bit
        Turns off the interrupt flag bit (Off).

      HALT: Halts
        Omea wa mou shindeiru

      ANDR: Bitwise AND
        Performs a bitwise AND operation on IREG registers, and stores the result into OREG

      ORR: Bitwise OR
        Performs a bitwise OR operation on IREG registers, and stores the result into OREG

      XORR: Bitwise XOR
        Performs a bitwise XOR operation on IREG registers, and stores the result into OREG

      RETNZ: Return Non-Zero
        If the F register is set, and the zero flag is set, then do nothing (moves PC forward 2).
        If the F register is set, and the zero flag is NOT set, then get the value from SP and put it into PC. This in effect pops the stack.

      RETC: Return Carry
        If the F register is set, and the carry flag is set, then get the value from SP and put it into PC. This in effect pops the stack.
        If the F register is set, and the carry flag is NOT set, then do nothing (moves PC forward 2).

      RETS: Return Sign
        If the F register is set, and the sign flag is set, then get the value from SP and put it into PC. This in effect pops the stack.
        If the F register is set, and the sign flag is NOT set, then do nothing (moves PC forward 2).

      RETP: Return Parity
        If the F register is set, and the parity flag is set, then get the value from SP and put it into PC. This in effect pops the stack.
        If the F register is set, and the parity flag is NOT set, then do nothing (moves PC forward 2).

      RETNP: Return Non-Parity
        If the F register is set, and the parity flag is set, then do nothing (moves PC forward 2).
        If the F register is set, and the parity flag is NOT set, then get the value from SP and put it into PC. This in effect pops the stack.

      RETP: Return Parity
        If the F register is set, and the parity flag is set, then get the value from SP and put it into PC. This in effect pops the stack.
        If the F register is set, and the parity flag is NOT set, then do nothing (moves PC forward 2).

      RET: Return
        Gets the SP from memory and sets PC with it.

      RETZ: Return Zero
        If the F register is set, and the zero flag is set, get the value in memory pointed to by SP, and put it into PC.
        If the F register is set, and the zero flag is NOT set, then do nothing (moves PC forward 2).

      RETNS: Return Non-Sign
        If the F register is set, and the sign flag is set, get the value in memory pointed to by SP, and put it into PC.
        If the F register is set, and the sign flag is NOT set, then do nothing (moves PC forward 2).

      POPR: Pop stack to register pair
        This gets the value stored in SP and stores it into both the IREGs. It also moves SP forward 2.

      CALL: Push onto the stack with a pointer
        If the F register is set, and the zero flag is set, then do nothing (moves PC forward 2).
        If the F register is set, and the zero flag is NOT set, then move SP back 2, temporarily store P1 and P2, write SP into P1 and P2 and jump to the original P1 and P2 values.

      CALLZ: Push onto the stack with a pointer if zero
        If the F register is set, and the zero flag is set, then move SP back 2 and store PC into it, then jump to P1 and P2 values.
        If the F register is set, and the zero flag is NOT set, then do nothing (moves PC forward 2).

      CALLP: Push onto the stack with a pointer if parity
        If the F register is set, and the parity flag is set, then move SP back 2 and store PC into it, then jump to P1 and P2 values.
        If the F register is set, and the parity flag is NOT set, then do nothing (moves PC forward 2).

      CALLC: Push onto the stack with a pointer if carry
        If the F register is set, and the carry flag is set, then move SP back 2, temporarily store P1 and P2, write SP into P1 and P2 and jump to the original P1 and P2 values.
        If the F register is set, and the carry flag is NOT set, then do nothing (moves PC forward 2).

      CALLNC: Push onto the stack with a pointer if non-carry
        If the F register is set, and the carry flag is set, then do nothing (moves PC forward 2).
        If the F register is set, and the carry flag is NOT set, then move SP back 2, temporarily store P1 and P2, write SP into P1 and P2 and jump to the original P1 and P2 values.

      CALLNP: Push onto the stack with a pointer if non-parity
        If the F register is set, and the parity flag is set, then do nothing (moves PC forward 2).
        If the F register is set, and the parity flag is NOT set, then move SP back 2, temporarily store P1 and P2, write SP into P1 and P2 and jump to the original P1 and P2 values.

      CALLS: Push onto the stack with a pointer if sign
        If the F register is set, and the sign flag is set, then move SP back 2, temporarily store P1 and P2, write SP into P1 and P2 and jump to the original P1 and P2 values.
        If the F register is set, and the sign flag is NOT set, then do nothing (moves PC forward 2).

      CALLS: Push onto the stack with a pointer if not sign
        If the F register is set, and the sign flag is set, then do nothing (moves PC forward 2).
        If the F register is set, and the sign flag is NOT set, then move SP back 2, temporarily store P1 and P2, write SP into P1 and P2 and jump to the original P1 and P2 values.

      PUSH: Push onto the stack
        Move both IREGs, or P1 and P2 into SP and move SP back 2.

      PUSHNZ: Push onto the stack if non-zero
        If the F register is set, and the zero flag is set, then do nothing (moves PC forward 2).
        If the F register is set, and the zero flag is NOT set, then move both IREGs into SP and move SP back 2.

      JMPNZ: Jump if non-zero
        If the F register is set, and the zero flag is set, then set PC to P1 and P2
        If the F register is set, and the zero flag is NOT set, then move PC forward 2, and do a NOP.

      JMPNC: Jump if non-carry
        If the F register is set, and the carry flag is set, then move PC forward 2, and do a NOP.
        If the F register is set, and the zero flag is NOT set, then set PC to P1 and P2.

      JMP: Jump to an address
        Sets PC to P1 and P2, or both IREGs

      JMPC: Jump if carry
        If the F register is set, and the carry flag is set, then set PC to P1 and P2
        If the F register is set, and the carry flag is NOT set, then move PC forward 2, and do a NOP.

      JMPP: Jump if parity
        If the F register is set, and the parity flag is set, then set PC to P1 and P2
        If the F register is set, and the parity flag is NOT set, then move PC forward 2, and do a NOP.

      JMPZ: Jump if zero
        If the F register is set, and the zero flag is set, then set PC to P1 and P2
        If the F register is set, and the zero flag is NOT set, then move PC forward 2, and do a NOP.

      JMPS: Jump if sign
        If the F register is set, and the sign flag is set, then set PC to P1 and P2
        If the F register is set, and the sign flag is NOT set, then move PC forward 2, and do a NOP.

      JMPNS: Jump if Non-sign
        If the F register is set, and the sign flag is set, then move PC forward 2, and do a NOP.
        If the F register is set, and the sign flag is NOT set, then set PC to P1 and P2

      XCHM: Swap register value with memory
        This swaps the value in a register with the value in a memory location. This can work with bytes and words.

      XCHR: Swap register values with each other
        This swaps the values stored in 2 registers. This can work with register pairs.

      HWIN: Hardware Input
        Read data from the hardware. It can be accessed with cpu.hwIntPorts[0 - 255]

      HWOUT: Hardware Input
        Write data to the hardware. It can be accessed with cpu.hwIntPorts[0 - 255]

      NEXTOP: Next OP Register
        The next operation will be performed on either the IX or IY special register, instead of on the HL register.

      RST [number]: Reset/Move
        This looks like it resets the machine, or is used to jump to specific points in memory.
        It stores PC into SP, and moves SP back 2, before setting PC to the predetermined locations listed below.
        The [number] is where it's moving PC to after execution. These numbers are discrete.
          RST 00 means PC = 0
          RST 08 means PC = 64 (0x08 * 8)
          RST 10 means PC = 128 (0x10 * 8)
          RST 18 means PC = 192 (0x18 * 8)
          RST 20 means PC = 256 (0x20 * 8)
          RST 28 means PC = 320 (0x28 * 8)
          RST 30 means PC = 384 (0x30 * 8)
          RST 38 means PC = 448 (0x30 * 8)

  // */

  var cpuFlags = Object.freeze({
    a: 0,       // Results from the ALU usually end up here. 2 bytes, grouped with F.
    b: 0,       // General register, 2 bytes, grouped with C
    c: 0,       // General register, 2 bytes, grouped with B
    d: 0,       // General register, 2 bytes, grouped with E
    e: 0,       // General register, 2 bytes, grouped with D
    f: 0,       // F is a special flag. Mainly used for overflows and parity. 2 bytes, grouped with A
    h: 0,       // General register, 2 bytes, grouped with L. These are generally used as a buffer, or for calculations.
    l: 0,       // General register, 2 bytes, grouped with H. These are generally used as a buffer, or for calculations.
    ix: 0,       // Index Register
    iy: 0,       // Index Register
    sp: 0,      // Stack pointer, 4 bytes
    pc: 0,      // Program counter (Current executing address), 4 bytes
    enabled: 1  // Chip enabled
  });

  const fFlags = Object.freeze({
    carry: 0x01,
    parity: 0x04,
    halfcarry: 0x10,
    interrupt: 0x20,
    zero: 0x40,
    sign: 0x80,
  });

  var debugFlags = Object.freeze({
    executionCount: 0,
    totalCPUCycles: 0,
    cycleRollover: false,
    nextOpIReg: ""           // Let the emulator know the next instruction is for IX or IY and not HL.
  });

  cpu.hwIntPorts = [];

  cpu.flags = JSON.parse(JSON.stringify(cpuFlags));
  cpu.db = JSON.parse(JSON.stringify(debugFlags));
  cpu.cycles = 0;
  cpu.lastOpCycle = 0;
  cpu.modeClock = 0;
  cpu.pInterrupt = 0x10;
  cpu.memory = [];
  cpu.warningCb;
  cpu.memoryUpdateCb;
  cpu.isHalted = false;

  cpu.disassemble8080OP = function(state, pc) {
    var memory = state.memory;

    // Not all OPCodes will have 3 bytes. The trailing bytes are ignored if unsed.
    var opCode = [memory[pc], memory[pc + 1], memory[pc + 2]];

    var output = {
      execCount: 0,
      programCounter: 0,
      opCode: "",
      z80OPCode: "", // I added this so the Z80 op codes could be referenced.
      opCodeHex: 0,
      ireg: "", // Input registers
      oreg: "", // Output registers (usually determing a memory location)
      para1: "",
      para2: "",
      ptr: "",
      opBytes: 0,
      cycles: 0,
      cycleConditional: false,
      error: true,
      indexRegUsed: false
    };

    output.execCount = state.db.executionCount;
    output.programCounter = pc.toString(16);
    if (opCode[0] == null && pc < state.memory.length) {
      if (typeof(state.warningCb) === 'function') { state.warningCb('disassemble8080OP', state, ["Warning: No instruction passed: ", opCode, 'State: ', state, "PC", pc ]); }
      return output;
    } else if (pc >= state.memory.length) {
      output.opCode = "--";
      return output;
    }

    if ((opCode[1] == null && pc + 1 < state.memory.length) || (opCode[2] == null && pc + 2 < state.memory.length) ) {
      if (typeof(state.warningCb) === 'function') { state.warningCb('disassemble8080OP', state, ["Warning: OP Code undefined.", opCode, 'State: ', state, "PC", pc ]); }
      return output;
    }

    output.opCodeHex = opCode[0].toString(16);

    output.opBytes = 1;

    switch (opCode[0]) {
      case 0x00: output.opCode = "NOP"; output.z80OPCode = "NOP"; output.cycles = 4; break;
      case 0x01: output.opCode = "LD2R"; output.z80OPCode = "LD"; output.cycles = 10; output.oreg = "BC"; output.para1 = opCode[1].toString(16); output.para2 = opCode[2].toString(16); output.opBytes = 3; break;
      case 0x02: output.opCode = "LD2M"; output.z80OPCode = "LD"; output.cycles = 7; output.ptr = "#"; output.oreg = "BC"; output.ireg = "A"; break;
      case 0x03: output.opCode = "INCR"; output.z80OPCode = "INC"; output.cycles = 6; output.ireg = "BC"; output.oreg = "BC"; break;
      case 0x04: output.opCode = "INCR"; output.z80OPCode = "INC"; output.cycles = 5; output.ireg = "B"; output.oreg = "B"; break;
      case 0x05: output.opCode = "DCRR"; output.z80OPCode = "LD"; output.cycles = 5; output.oreg = "B"; output.ireg = "B"; break;
      case 0x06: output.opCode = "LD2R"; output.z80OPCode = "LD"; output.cycles = 7; output.oreg = "B"; output.para1 = opCode[1].toString(16); output.opBytes = 2; break;
      case 0x07: output.opCode = "RLCA"; output.z80OPCode = "RCLA"; output.cycles = 4; output.oreg = "A"; output.ireg = "A"; break;
      case 0x08: output.opCode = "NOP"; output.z80OPCode = "NOP"; output.cycles = 4; break;
      case 0x09: output.opCode = "INXR"; output.z80OPCode = "ADD"; output.cycles = 11; output.ireg = "BC"; output.oreg = "HL"; break;
      case 0x0a: output.opCode = "LD2R"; output.z80OPCode = "LD"; output.cycles = 7; output.ptr = "&"; output.oreg = "A"; output.ireg = "BC"; break;
      case 0x0b: output.opCode = "DCRR"; output.z80OPCode = "DEC"; output.cycles = 6; output.ireg = "BC"; output.ireg = "BC"; break;
      case 0x0c: output.opCode = "INCR"; output.z80OPCode = "INC"; output.cycles = 5; output.ireg = "C"; output.oreg = "C"; break;
      case 0x0d: output.opCode = "DCRR"; output.z80OPCode = "DEC"; output.cycles = 5; output.ireg = "C"; output.oreg = "C"; break;
      case 0x0e: output.opCode = "LD2R"; output.z80OPCode = "LD"; output.cycles = 7; output.oreg = "C"; output.para1 = opCode[1].toString(16); output.opBytes = 2; break;
      case 0x0f: output.opCode = "RRCA"; output.z80OPCode = "RRCA"; output.cycles = 4; output.oreg = "A"; output.ireg = "A"; break;

      case 0x10: output.opCode = "NOP"; output.z80OPCode = "NOP"; output.cycles = 4; break;
      case 0x11: output.opCode = "LD2R"; output.z80OPCode = "LD"; output.cycles = 10; output.oreg = "DE"; output.para1 = opCode[1].toString(16); output.para2 = opCode[2].toString(16); output.opBytes = 3; break;
      case 0x12: output.opCode = "LD2M"; output.z80OPCode = "LD"; output.cycles = 7; output.ptr = "#"; output.oreg = "DE"; output.ireg = "A"; break;
      case 0x13: output.opCode = "INCR"; output.z80OPCode = "INC"; output.cycles = 6; output.oreg = "DE"; output.ireg = "DE"; break;
      case 0x14: output.opCode = "INCR"; output.z80OPCode = "INC"; output.cycles = 5; output.oreg = "D"; output.ireg = "D"; break;
      case 0x15: output.opCode = "DCRR"; output.z80OPCode = "DEC"; output.cycles = 5; output.ireg = "D"; break;
      case 0x16: output.opCode = "LD2R"; output.z80OPCode = "LD"; output.cycles = 7; output.oreg = "D"; output.para1 = opCode[1].toString(16); output.opBytes = 2; break;
      case 0x17: output.opCode = "RLC9"; output.z80OPCode = "RLA"; output.cycles = 4; output.oreg = "A"; output.ireg = "A"; break;
      case 0x18: output.opCode = "NOP"; output.z80OPCode = "NOP"; output.cycles = 4; break;
      case 0x19: output.opCode = "INXR"; output.z80OPCode = "ADD"; output.cycles = 11; output.oreg = "HL"; output.ireg = "DE"; break;
      case 0x1a: output.opCode = "LD2R"; output.z80OPCode = "LD"; output.cycles = 7; output.ptr = "&"; output.ireg = "DE"; output.oreg = "A"; break;
      case 0x1b: output.opCode = "DCRR"; output.z80OPCode = "DEC"; output.cycles = 6; output.oreg = "DE"; output.ireg = "DE"; break;
      case 0x1c: output.opCode = "INCR"; output.z80OPCode = "INC"; output.cycles = 5; output.ireg = "E"; output.oreg = "E"; break;
      case 0x1d: output.opCode = "DCRR"; output.z80OPCode = "DEC"; output.cycles = 5; output.ireg = "E"; output.oreg = "E"; break;
      case 0x1e: output.opCode = "UNKOP"; output.z80OPCode = "LD"; output.cycles = 7; output.ptr = "!"; output.para1 = opCode[1].toString(16); output.para2 = opCode[1].toString(16); output.opBytes = 2; break;
      case 0x1f: output.opCode = "RRC"; output.z80OPCode = "RRA"; output.cycles = 4; output.oreg = "A"; output.ireg = "A"; break;

      case 0x20: output.opCode = "NOP"; output.z80OPCode = "NOP"; output.cycles = 4; break;
      case 0x21: output.opCode = "LD2R"; output.z80OPCode = "LD"; output.cycles = 10; output.oreg = "HL"; output.para1 = opCode[1].toString(16); output.para2 = opCode[2].toString(16); output.opBytes = 3; break;
      case 0x22: output.opCode = "LD2M"; output.z80OPCode = "LD"; output.cycles = 16; output.ireg = "HL"; output.para1 = opCode[1].toString(16); output.para2 = opCode[2].toString(16); output.opBytes = 3; break;
      case 0x23: output.opCode = "INCR"; output.z80OPCode = "INC"; output.cycles = 6; output.oreg = "HL"; output.ireg = "HL"; break;
      case 0x24: output.opCode = "INCR"; output.z80OPCode = "INC"; output.cycles = 5; output.ireg = "H"; output.oreg = "H"; break;
      case 0x25: output.opCode = "DCRR"; output.z80OPCode = "DEC"; output.cycles = 5; output.ireg = "H"; output.oreg = "H"; break;
      case 0x26: output.opCode = "LD2R"; output.z80OPCode = "LD"; output.cycles = 7; output.oreg = "H"; output.para1 = opCode[1].toString(16); output.opBytes = 2; break;
      case 0x27: output.opCode = "NOP"; output.z80OPCode = "DAA"; output.cycles = 7; output.ptr = "!"; output.para1 = opCode[1].toString(16); output.para2 = opCode[1].toString(16); output.opBytes = 2; break;
      case 0x28: output.opCode = "NOP"; output.z80OPCode = "NOP"; output.cycles = 4; break;
      case 0x29: output.opCode = "INXR"; output.z80OPCode = "ADD"; output.cycles = 11; output.oreg = "HL"; output.ireg = "HL"; break;
      case 0x2a: output.opCode = "LD2R"; output.z80OPCode = "LD"; output.cycles = 16; output.ptr = "&"; output.oreg = "HL"; output.para1 = opCode[1].toString(16); output.para2 = opCode[2].toString(16); output.opBytes = 3; break;
      case 0x2b: output.opCode = "DCRR"; output.z80OPCode = "DEC"; output.cycles = 6; output.ireg = "HL"; output.oreg = "HL"; break;
      case 0x2c: output.opCode = "INCR"; output.z80OPCode = "INC"; output.cycles = 5; output.ireg = "L"; output.oreg = "L"; break;
      case 0x2d: output.opCode = "DCRR"; output.z80OPCode = "DEC"; output.cycles = 5; output.ireg = "L"; output.oreg = "L"; break;
      case 0x2e: output.opCode = "LD2R"; output.z80OPCode = "LD"; output.cycles = 7; output.oreg = "L"; output.para1 = opCode[1].toString(16); output.opBytes = 2; break;
      case 0x2f: output.opCode = "CPL"; output.z80OPCode = "CPL"; output.cycles = 4; output.oreg = "A"; break;

      case 0x30: output.opCode = "NOP"; output.z80OPCode = "NOP"; output.cycles = 4; break;
      case 0x31: output.opCode = "LD2R"; output.z80OPCode = "LD"; output.cycles = 10; output.oreg = "SP"; output.para1 = opCode[1].toString(16); output.para2 = opCode[2].toString(16); output.opBytes = 3; break;
      case 0x32: output.opCode = "LD2M"; output.z80OPCode = "INC"; output.cycles = 13; output.ptr = "#"; output.ireg = "A"; output.para1 = opCode[1].toString(16); output.para2 = opCode[2].toString(16); output.opBytes = 3; break;
      case 0x33: output.opCode = "INCR"; output.z80OPCode = "INC"; output.cycles = 6; output.oreg = "SP"; output.ireg = "SP"; break;
      case 0x34: output.opCode = "INCM"; output.z80OPCode = "INC"; output.cycles = 10; output.ptr = "#"; output.oreg = "HL"; output.ireg = "HL"; break;
      case 0x35: output.opCode = "DCRM"; output.z80OPCode = "DEC"; output.cycles = 10; output.ptr = "#"; output.oreg = "HL"; output.ireg = "HL"; break;
      case 0x36: output.opCode = "LD2M"; output.z80OPCode = "LD"; output.cycles = 10; output.ptr = "#"; output.oreg = "HL"; output.para1 = opCode[1].toString(16); output.opBytes = 2; break;
      case 0x37: output.opCode = "SCF"; output.z80OPCode = "SCF"; output.cycles = 4; break;
      case 0x38: output.opCode = "NOP"; output.z80OPCode = "NOP"; output.cycles = 4; break;
      case 0x39: output.opCode = "INXR"; output.z80OPCode = "ADD"; output.oreg = "HL"; output.ireg = "SP"; output.cycles = 11; break;
      case 0x3a: output.opCode = "LD2R"; output.z80OPCode = "LD"; output.cycles = 13; output.ptr = "$"; output.oreg = "A"; output.para1 = opCode[1].toString(16); output.para2 = opCode[2].toString(16); output.opBytes = 3; break;
      case 0x3b: output.opCode = "DCRR"; output.z80OPCode = "DEC"; output.cycles = 6; output.ireg = "SP"; output.oreg = "SP"; break;
      case 0x3c: output.opCode = "INCR"; output.z80OPCode = "INC"; output.cycles = 6; output.ireg = "A"; output.oreg = "A"; break;
      case 0x3d: output.opCode = "DCRR"; output.z80OPCode = "DEC"; output.cycles = 5; output.ireg = "A"; output.oreg = "A"; break;
      case 0x3e: output.opCode = "LD2R"; output.z80OPCode = "LD"; output.cycles = 7; output.oreg = "A"; output.para1 = opCode[1].toString(16); output.opBytes = 2; break;
      case 0x3f: output.opCode = "CCF"; output.z80OPCode = "CCF"; output.cycles = 4; break;

      case 0x40: output.opCode = "LD2R"; output.z80OPCode = "LD"; output.cycles = 5; output.oreg = "B"; output.ireg = "B"; break;
      case 0x41: output.opCode = "LD2R"; output.z80OPCode = "LD"; output.cycles = 5; output.oreg = "B"; output.ireg = "C"; break;
      case 0x42: output.opCode = "LD2R"; output.z80OPCode = "LD"; output.cycles = 5; output.oreg = "B"; output.ireg = "D"; break;
      case 0x43: output.opCode = "LD2R"; output.z80OPCode = "LD"; output.cycles = 5; output.oreg = "B"; output.ireg = "E"; break;
      case 0x44: output.opCode = "LD2R"; output.z80OPCode = "LD"; output.cycles = 5; output.oreg = "B"; output.ireg = "H"; break;
      case 0x45: output.opCode = "LD2R"; output.z80OPCode = "LD"; output.cycles = 5; output.oreg = "B"; output.ireg = "L"; break;
      case 0x46: output.opCode = "LD2R"; output.z80OPCode = "LD"; output.cycles = 7; output.ptr = "$"; output.oreg = "B"; output.ireg = "HL"; break;
      case 0x47: output.opCode = "LD2R"; output.z80OPCode = "LD"; output.cycles = 5; output.oreg = "B"; output.ireg = "A"; break;
      case 0x48: output.opCode = "LD2R"; output.z80OPCode = "LD"; output.cycles = 5; output.oreg = "C"; output.ireg = "B"; break;
      case 0x49: output.opCode = "LD2R"; output.z80OPCode = "LD"; output.cycles = 5; output.oreg = "C"; output.ireg = "C"; break;
      case 0x4a: output.opCode = "LD2R"; output.z80OPCode = "LD"; output.cycles = 5; output.oreg = "C"; output.ireg = "D"; break;
      case 0x4b: output.opCode = "LD2R"; output.z80OPCode = "LD"; output.cycles = 5; output.oreg = "C"; output.ireg = "E"; break;
      case 0x4c: output.opCode = "LD2R"; output.z80OPCode = "LD"; output.cycles = 5; output.oreg = "C"; output.ireg = "H"; break;
      case 0x4d: output.opCode = "LD2R"; output.z80OPCode = "LD"; output.cycles = 5; output.oreg = "C"; output.ireg = "L"; break;
      case 0x4e: output.opCode = "LD2R"; output.z80OPCode = "LD"; output.cycles = 7; output.ptr = "$"; output.oreg = "C"; output.ireg = "HL"; break;
      case 0x4f: output.opCode = "LD2R"; output.z80OPCode = "LD"; output.cycles = 5; output.oreg = "C"; output.ireg = "A"; break;

      case 0x50: output.opCode = "LD2R"; output.z80OPCode = "LD"; output.cycles = 5; output.oreg = "D"; output.ireg = "B"; break;
      case 0x51: output.opCode = "LD2R"; output.z80OPCode = "LD"; output.cycles = 5; output.oreg = "D"; output.ireg = "C"; break;
      case 0x52: output.opCode = "LD2R"; output.z80OPCode = "LD"; output.cycles = 5; output.oreg = "D"; output.ireg = "D"; break;
      case 0x53: output.opCode = "LD2R"; output.z80OPCode = "LD"; output.cycles = 5; output.oreg = "D"; output.ireg = "E"; break;
      case 0x54: output.opCode = "LD2R"; output.z80OPCode = "LD"; output.cycles = 5; output.oreg = "D"; output.ireg = "H"; break;
      case 0x55: output.opCode = "LD2R"; output.z80OPCode = "LD"; output.cycles = 5; output.oreg = "D"; output.ireg = "L"; break;
      case 0x56: output.opCode = "LD2R"; output.z80OPCode = "LD"; output.cycles = 7; output.ptr = "$"; output.oreg = "D"; output.ireg = "HL"; break;
      case 0x57: output.opCode = "LD2R"; output.z80OPCode = "LD"; output.cycles = 5; output.oreg = "D"; output.ireg = "A"; break;
      case 0x58: output.opCode = "LD2R"; output.z80OPCode = "LD"; output.cycles = 5; output.oreg = "E"; output.ireg = "B"; break;
      case 0x59: output.opCode = "LD2R"; output.z80OPCode = "LD"; output.cycles = 5; output.oreg = "E"; output.ireg = "C"; break;
      case 0x5a: output.opCode = "LD2R"; output.z80OPCode = "LD"; output.cycles = 5; output.oreg = "E"; output.ireg = "D"; break;
      case 0x5b: output.opCode = "LD2R"; output.z80OPCode = "LD"; output.cycles = 5; output.oreg = "E"; output.ireg = "E"; break;
      case 0x5c: output.opCode = "LD2R"; output.z80OPCode = "LD"; output.cycles = 5; output.oreg = "E"; output.ireg = "H"; break;
      case 0x5d: output.opCode = "LD2R"; output.z80OPCode = "LD"; output.cycles = 5; output.oreg = "E"; output.ireg = "L"; break;
      case 0x5e: output.opCode = "LD2R"; output.z80OPCode = "LD"; output.cycles = 7; output.ptr = "$"; output.oreg = "E"; output.ireg = "HL"; break;
      case 0x5f: output.opCode = "LD2R"; output.z80OPCode = "LD"; output.cycles = 5; output.oreg = "E"; output.ireg = "A"; break;

      case 0x60: output.opCode = "LD2R"; output.z80OPCode = "LD"; output.cycles = 5; output.oreg = "H"; output.ireg = "B"; break;
      case 0x61: output.opCode = "LD2R"; output.z80OPCode = "LD"; output.cycles = 5; output.oreg = "H"; output.ireg = "C"; break;
      case 0x62: output.opCode = "LD2R"; output.z80OPCode = "LD"; output.cycles = 5; output.oreg = "H"; output.ireg = "D"; break;
      case 0x63: output.opCode = "LD2R"; output.z80OPCode = "LD"; output.cycles = 5; output.oreg = "H"; output.ireg = "E"; break;
      case 0x64: output.opCode = "LD2R"; output.z80OPCode = "LD"; output.cycles = 5; output.oreg = "H"; output.ireg = "H"; break;
      case 0x65: output.opCode = "LD2R"; output.z80OPCode = "LD"; output.cycles = 5; output.oreg = "H"; output.ireg = "L"; break;
      case 0x66: output.opCode = "LD2R"; output.z80OPCode = "LD"; output.cycles = 7; output.ptr = "$"; output.oreg = "H"; output.ireg = "HL"; break;
      case 0x67: output.opCode = "LD2R"; output.z80OPCode = "LD"; output.cycles = 5; output.oreg = "H"; output.ireg = "A"; break;
      case 0x68: output.opCode = "LD2R"; output.z80OPCode = "LD"; output.cycles = 5; output.oreg = "L"; output.ireg = "B"; break;
      case 0x69: output.opCode = "LD2R"; output.z80OPCode = "LD"; output.cycles = 5; output.oreg = "L"; output.ireg = "C"; break;
      case 0x6a: output.opCode = "LD2R"; output.z80OPCode = "LD"; output.cycles = 5; output.oreg = "L"; output.ireg = "D"; break;
      case 0x6b: output.opCode = "LD2R"; output.z80OPCode = "LD"; output.cycles = 5; output.oreg = "L"; output.ireg = "E"; break;
      case 0x6c: output.opCode = "LD2R"; output.z80OPCode = "LD"; output.cycles = 5; output.oreg = "L"; output.ireg = "H"; break;
      case 0x6d: output.opCode = "LD2R"; output.z80OPCode = "LD"; output.cycles = 5; output.oreg = "L"; output.ireg = "L"; break;
      case 0x6e: output.opCode = "LD2R"; output.z80OPCode = "LD"; output.cycles = 7; output.ptr = "$"; output.oreg = "L"; output.ireg = "HL"; break;
      case 0x6f: output.opCode = "LD2R"; output.z80OPCode = "LD"; output.cycles = 5; output.oreg = "L"; output.ireg = "A"; break;

      case 0x70: output.opCode = "LD2M"; output.z80OPCode = "LD"; output.cycles = 7; output.ptr = "#"; output.oreg = "HL"; output.ireg = "B"; break;
      case 0x71: output.opCode = "LD2M"; output.z80OPCode = "LD"; output.cycles = 7; output.ptr = "#"; output.oreg = "HL"; output.ireg = "C"; break;
      case 0x72: output.opCode = "LD2M"; output.z80OPCode = "LD"; output.cycles = 7; output.ptr = "#"; output.oreg = "HL"; output.ireg = "D"; break;
      case 0x73: output.opCode = "LD2M"; output.z80OPCode = "LD"; output.cycles = 7; output.ptr = "#"; output.oreg = "HL"; output.ireg = "E"; break;
      case 0x74: output.opCode = "LD2M"; output.z80OPCode = "LD"; output.cycles = 7; output.ptr = "#"; output.oreg = "HL"; output.ireg = "H"; break;
      case 0x75: output.opCode = "LD2M"; output.z80OPCode = "LD"; output.cycles = 7; output.ptr = "#"; output.oreg = "HL"; output.ireg = "L"; break;
      case 0x76: output.opCode = "HLT"; output.z80OPCode = "LD"; output.cycles = 7; break;
      case 0x77: output.opCode = "LD2M"; output.z80OPCode = "LD"; output.cycles = 7; output.ptr = "#"; output.oreg = "HL"; output.ireg = "A"; break;
      case 0x78: output.opCode = "LD2R"; output.z80OPCode = "LD"; output.cycles = 5; output.oreg = "A"; output.ireg = "B"; break;
      case 0x79: output.opCode = "LD2R"; output.z80OPCode = "LD"; output.cycles = 5; output.oreg = "A"; output.ireg = "C"; break;
      case 0x7a: output.opCode = "LD2R"; output.z80OPCode = "LD"; output.cycles = 5; output.oreg = "A"; output.ireg = "D"; break;
      case 0x7b: output.opCode = "LD2R"; output.z80OPCode = "LD"; output.cycles = 5; output.oreg = "A"; output.ireg = "E"; break;
      case 0x7c: output.opCode = "LD2R"; output.z80OPCode = "LD"; output.cycles = 5; output.oreg = "A"; output.ireg = "H"; break;
      case 0x7d: output.opCode = "LD2R"; output.z80OPCode = "LD"; output.cycles = 5; output.oreg = "A"; output.ireg = "L"; break;
      case 0x7e: output.opCode = "LD2R"; output.z80OPCode = "LD"; output.cycles = 7; output.ptr = "$"; output.oreg = "A"; output.ireg = "HL"; break;
      case 0x7f: output.opCode = "LD2R"; output.z80OPCode = "LD"; output.cycles = 5; output.oreg = "A"; output.ireg = "A"; break;

      case 0x80: output.opCode = "INXR"; output.z80OPCode = "ADD"; output.cycles = 4; output.oreg = "A"; output.ireg = "B"; break;
      case 0x81: output.opCode = "INXR"; output.z80OPCode = "ADD"; output.cycles = 4; output.oreg = "A"; output.ireg = "C"; break;
      case 0x82: output.opCode = "INXR"; output.z80OPCode = "ADD"; output.cycles = 4; output.oreg = "A"; output.ireg = "D"; break;
      case 0x83: output.opCode = "INXR"; output.z80OPCode = "ADD"; output.cycles = 4; output.oreg = "A"; output.ireg = "E"; break;
      case 0x84: output.opCode = "INXR"; output.z80OPCode = "ADD"; output.cycles = 4; output.oreg = "A"; output.ireg = "H"; break;
      case 0x85: output.opCode = "INXR"; output.z80OPCode = "ADD"; output.cycles = 4; output.oreg = "A"; output.ireg = "L"; break;
      case 0x86: output.opCode = "INXR"; output.z80OPCode = "ADD"; output.cycles = 7; output.ptr = "$"; output.oreg = "A"; output.ireg = "HL"; break;
      case 0x87: output.opCode = "INXR"; output.z80OPCode = "ADD"; output.cycles = 4; output.oreg = "A"; output.ireg = "A"; break;
      case 0x88: output.opCode = "ICXR"; output.z80OPCode = "ADD"; output.cycles = 4; output.oreg = "A"; output.ireg = "B"; break;
      case 0x89: output.opCode = "ICXR"; output.z80OPCode = "ADD"; output.cycles = 4; output.oreg = "A"; output.ireg = "C"; break;
      case 0x8a: output.opCode = "ICXR"; output.z80OPCode = "ADD"; output.cycles = 4; output.oreg = "A"; output.ireg = "D"; break;
      case 0x8b: output.opCode = "ICXR"; output.z80OPCode = "ADD"; output.cycles = 4; output.oreg = "A"; output.ireg = "E"; break;
      case 0x8c: output.opCode = "ICXR"; output.z80OPCode = "ADD"; output.cycles = 4; output.oreg = "A"; output.ireg = "H"; break;
      case 0x8d: output.opCode = "ICXR"; output.z80OPCode = "ADD"; output.cycles = 4; output.oreg = "A"; output.ireg = "L"; break;
      case 0x8e: output.opCode = "ICXR"; output.z80OPCode = "ADD"; output.cycles = 7; output.ptr = "$"; output.oreg = "A"; output.ireg = "HL"; break;
      case 0x8f: output.opCode = "ICXR"; output.z80OPCode = "ADD"; output.cycles = 4; output.oreg = "A"; output.ireg = "A"; break;

      case 0x90: output.opCode = "DCXR"; output.z80OPCode = "SUB"; output.cycles = 4; output.oreg = "A"; output.ireg = "B"; break;
      case 0x91: output.opCode = "DCXR"; output.z80OPCode = "SUB"; output.cycles = 4; output.oreg = "A"; output.ireg = "C"; break;
      case 0x92: output.opCode = "DCXR"; output.z80OPCode = "SUB"; output.cycles = 4; output.oreg = "A"; output.ireg = "D"; break;
      case 0x93: output.opCode = "DCXR"; output.z80OPCode = "SUB"; output.cycles = 4; output.oreg = "A"; output.ireg = "E"; break;
      case 0x94: output.opCode = "DCXR"; output.z80OPCode = "SUB"; output.cycles = 4; output.oreg = "A"; output.ireg = "H"; break;
      case 0x95: output.opCode = "DCXR"; output.z80OPCode = "SUB"; output.cycles = 4; output.oreg = "A"; output.ireg = "L"; break;
      case 0x96: output.opCode = "DCXR"; output.z80OPCode = "SUB"; output.cycles = 7; output.ptr = "$"; output.oreg = "A"; output.ireg = "HL"; break;
      case 0x97: output.opCode = "DCXR"; output.z80OPCode = "SUB"; output.cycles = 4; output.oreg = "A"; output.ireg = "A"; break;
      case 0x98: output.opCode = "DEXR"; output.z80OPCode = "SBC"; output.cycles = 4; output.oreg = "A"; output.ireg = "B"; break;
      case 0x99: output.opCode = "DEXR"; output.z80OPCode = "SBC"; output.cycles = 4; output.oreg = "A"; output.ireg = "C"; break;
      case 0x9a: output.opCode = "DEXR"; output.z80OPCode = "SBC"; output.cycles = 4; output.oreg = "A"; output.ireg = "D"; break;
      case 0x9b: output.opCode = "DEXR"; output.z80OPCode = "SBC"; output.cycles = 4; output.oreg = "A"; output.ireg = "E"; break;
      case 0x9c: output.opCode = "DEXR"; output.z80OPCode = "SBC"; output.cycles = 4; output.oreg = "A"; output.ireg = "H"; break;
      case 0x9d: output.opCode = "DEXR"; output.z80OPCode = "SBC"; output.cycles = 4; output.oreg = "A"; output.ireg = "L"; break;
      case 0x9e: output.opCode = "DEXR"; output.z80OPCode = "SBC"; output.cycles = 7; output.ptr = "$"; output.oreg = "A"; output.ireg = "HL"; break;
      case 0x9f: output.opCode = "DEXR"; output.z80OPCode = "SBC"; output.cycles = 4; output.oreg = "A"; output.ireg = "A"; break;

      case 0xa0: output.opCode = "ANDR"; output.z80OPCode = "AND"; output.cycles = 4; output.oreg = "A"; output.ireg = "B"; break;
      case 0xa1: output.opCode = "ANDR"; output.z80OPCode = "AND"; output.cycles = 4; output.oreg = "A"; output.ireg = "C"; break;
      case 0xa2: output.opCode = "ANDR"; output.z80OPCode = "AND"; output.cycles = 4; output.oreg = "A"; output.ireg = "D"; break;
      case 0xa3: output.opCode = "ANDR"; output.z80OPCode = "AND"; output.cycles = 4; output.oreg = "A"; output.ireg = "E"; break;
      case 0xa4: output.opCode = "ANDR"; output.z80OPCode = "AND"; output.cycles = 4; output.oreg = "A"; output.ireg = "H"; break;
      case 0xa5: output.opCode = "ANDR"; output.z80OPCode = "AND"; output.cycles = 4; output.oreg = "A"; output.ireg = "L"; break;
      case 0xa6: output.opCode = "ANDR"; output.z80OPCode = "AND"; output.cycles = 7; output.ptr = "$"; output.oreg = "A"; output.ireg = "HL"; break;
      case 0xa7: output.opCode = "ANDR"; output.z80OPCode = "AND"; output.cycles = 4; output.oreg = "A"; output.ireg = "A"; break;
      case 0xa8: output.opCode = "XORR"; output.z80OPCode = "XOR"; output.cycles = 4; output.oreg = "A"; output.ireg = "B"; break;
      case 0xa9: output.opCode = "XORR"; output.z80OPCode = "XOR"; output.cycles = 4; output.oreg = "A"; output.ireg = "C"; break;
      case 0xaa: output.opCode = "XORR"; output.z80OPCode = "XOR"; output.cycles = 4; output.oreg = "A"; output.ireg = "D"; break;
      case 0xab: output.opCode = "XORR"; output.z80OPCode = "XOR"; output.cycles = 4; output.oreg = "A"; output.ireg = "E"; break;
      case 0xac: output.opCode = "XORR"; output.z80OPCode = "XOR"; output.cycles = 4; output.oreg = "A"; output.ireg = "H"; break;
      case 0xad: output.opCode = "XORR"; output.z80OPCode = "XOR"; output.cycles = 4; output.oreg = "A"; output.ireg = "L"; break;
      case 0xae: output.opCode = "XORR"; output.z80OPCode = "XOR"; output.cycles = 7; output.ptr = "$"; output.oreg = "A"; output.ireg = "HL"; break;
      case 0xaf: output.opCode = "XORR"; output.z80OPCode = "XOR"; output.cycles = 4; output.oreg = "A"; output.ireg = "A"; break;

      case 0xb0: output.opCode = "ORR"; output.z80OPCode = "OR"; output.cycles = 4; output.oreg = "A"; output.ireg = "B"; break;
      case 0xb1: output.opCode = "ORR"; output.z80OPCode = "OR"; output.cycles = 4; output.oreg = "A"; output.ireg = "C"; break;
      case 0xb2: output.opCode = "ORR"; output.z80OPCode = "OR"; output.cycles = 4; output.oreg = "A"; output.ireg = "D"; break;
      case 0xb3: output.opCode = "ORR"; output.z80OPCode = "OR"; output.cycles = 4; output.oreg = "A"; output.ireg = "E"; break;
      case 0xb4: output.opCode = "ORR"; output.z80OPCode = "OR"; output.cycles = 4; output.oreg = "A"; output.ireg = "H"; break;
      case 0xb5: output.opCode = "ORR"; output.z80OPCode = "OR"; output.cycles = 4; output.oreg = "A"; output.ireg = "L"; break;
      case 0xb6: output.opCode = "ORR"; output.z80OPCode = "OR"; output.cycles = 7; output.ptr = "$"; output.oreg = "A"; output.ireg = "HL"; break;
      case 0xb7: output.opCode = "ORR"; output.z80OPCode = "OR"; output.cycles = 4; output.oreg = "A"; output.ireg = "A"; break;
      case 0xb8: output.opCode = "SUBX"; output.z80OPCode = "CP"; output.cycles = 4; output.oreg = "A"; output.ireg = "B"; break;
      case 0xb9: output.opCode = "SUBX"; output.z80OPCode = "CP"; output.cycles = 4; output.oreg = "A"; output.ireg = "C"; break;
      case 0xba: output.opCode = "SUBX"; output.z80OPCode = "CP"; output.cycles = 4; output.oreg = "A"; output.ireg = "D"; break;
      case 0xbb: output.opCode = "SUBX"; output.z80OPCode = "CP"; output.cycles = 4; output.oreg = "A"; output.ireg = "E"; break;
      case 0xbc: output.opCode = "SUBX"; output.z80OPCode = "CP"; output.cycles = 4; output.oreg = "A"; output.ireg = "H"; break;
      case 0xbd: output.opCode = "SUBX"; output.z80OPCode = "CP"; output.cycles = 4; output.oreg = "A"; output.ireg = "L"; break;
      case 0xbe: output.opCode = "SUBX"; output.z80OPCode = "CP"; output.cycles = 7; output.ptr = "$"; output.oreg = "A"; output.ireg = "HL"; break;
      case 0xbf: output.opCode = "SUBX"; output.z80OPCode = "CP"; output.cycles = 4; output.oreg = "A"; output.ireg = "A"; break;

      case 0xc0: output.opCode = "RETNZ"; output.z80OPCode = "RET NZ"; (state.flags.f & fFlags.zero) ? output.cycles = 4 : output.cycles = 11; output.cycleConditional = true; break;
      case 0xc1: output.opCode = "POPR"; output.z80OPCode = "POP"; output.cycles = 10; output.oreg = "BC"; output.ireg = "SP"; output.ptr = "$"; break;
      case 0xc2: output.opCode = "JMPNZ"; output.z80OPCode = "JP NZ"; output.cycles = 15; (state.flags.f & fFlags.zero) ? output.cycles = 10 : output.cycles = 15; output.cycleConditional = true; output.para1 = opCode[1].toString(16); output.para2 = opCode[2].toString(16); output.opBytes = 3; break;
      case 0xc3: output.opCode = "JMP"; output.z80OPCode = "JP"; output.cycles = 10; output.para1 = opCode[1].toString(16); output.para2 = opCode[2].toString(16); output.opBytes = 3; break;
      case 0xc4: output.opCode = "PUSHNZ"; output.z80OPCode = "CALL NZ"; (state.flags.f & fFlags.zero) ? output.cycles = 11 : output.cycles = 18; output.cycleConditional = true; output.ireg = "BC"; output.ptr = "$"; output.oreg = "SP"; output.para1 = opCode[1].toString(16); output.para2 = opCode[2].toString(16); output.opBytes = 3; break;
      case 0xc5: output.opCode = "PUSH"; output.z80OPCode = "PUSH"; output.cycles = 11; output.ireg = "BC"; output.oreg = "SP"; output.ptr = "#"; break;
      case 0xc6: output.opCode = "INXR"; output.z80OPCode = "ADD"; output.cycles = 7; output.oreg = "A"; output.para1 = opCode[1].toString(16); output.opBytes = 2; break;
      case 0xc7: output.opCode = "RST0"; output.z80OPCode = "RST 00"; output.cycles = 11; output.oreg = "SP"; break;
      case 0xc8: output.opCode = "RETZ"; output.z80OPCode = "RET Z"; (state.flags.f & fFlags.zero) ? output.cycles = 11 : output.cycles = 5; output.ptr = "$"; output.ireg = "SP"; output.cycleConditional = true; break;
      case 0xc9: output.opCode = "RET"; output.z80OPCode = "RET"; output.cycles = 10; output.ireg = "SP"; output.ptr = "$"; break;
      case 0xca: output.opCode = "JMPZ"; output.z80OPCode = "JP Z"; (state.flags.f & fFlags.zero) ? output.cycles = 15 : output.cycles = 10; output.cycleConditional = true; output.para1 = opCode[1].toString(16); output.para2 = opCode[2].toString(16); output.opBytes = 3; break;
      case 0xcb: output.opCode = "NOP"; output.z80OPCode = "NOP"; output.cycles = 4; break;
      case 0xcc: output.opCode = "CALLZ"; output.z80OPCode = "CALL Z"; (state.flags.f & fFlags.zero) ? output.cycles = 18 : output.cycles = 11; output.cycleConditional = true; output.ptr = "#"; output.oreg = "SP"; output.para1 = opCode[1].toString(16); output.para2 = opCode[2].toString(16); output.opBytes = 3; break;
      case 0xcd: output.opCode = "CALL"; output.z80OPCode = "CALL"; output.cycles = 17; output.para1 = opCode[1].toString(16); output.ptr = "#"; output.oreg = "SP"; output.para2 = opCode[2].toString(16); output.opBytes = 3; break;
      case 0xce: output.opCode = "ICXR"; output.z80OPCode = "ADC"; output.cycles = 7; output.ireg = "A"; output.oreg = "A"; output.para1 = opCode[1].toString(16); output.opBytes = 2; break;
      case 0xcf: output.opCode = "RST1"; output.z80OPCode = "RST08"; output.cycles = 11; output.oreg = "SP"; break;

      case 0xd0: output.opCode = "RETNC"; output.z80OPCode = "RET NC"; (state.flags.f & fFlags.carry) ? output.cycles = 5 : output.cycles = 11; output.cycleConditional = true; break;
      case 0xd1: output.opCode = "POPR"; output.z80OPCode = "POP"; output.cycles = 10; output.oreg = "DE"; output.ireg = "SP"; output.ptr = "$"; break;
      case 0xd2: output.opCode = "JMPNP"; output.z80OPCode = "JP NC"; (state.flags.f & fFlags.carry) ? output.cycles = 10 : output.cycles = 15; output.cycleConditional = true; output.para1 = opCode[1].toString(16); output.para2 = opCode[2].toString(16); output.opBytes = 3; break;
      case 0xd3: output.opCode = "HWOUT"; output.z80OPCode = "OUT"; output.cycles = 10; output.para1 = opCode[1].toString(16); output.opBytes = 2; break;
      case 0xd4: output.opCode = "CALLNC"; output.z80OPCode = "CALL NC"; (state.flags.f & fFlags.carry) ? output.cycles = 11 : output.cycles = 18; output.cycleConditional = true; output.oreg = "SP"; output.ptr = "$"; output.para1 = opCode[1].toString(16); output.para2 = opCode[2].toString(16); output.opBytes = 3; break;
      case 0xd5: output.opCode = "PUSH"; output.z80OPCode = "PUSH"; output.ireg = "DE"; output.oreg = "SP"; output.ptr = "#"; break;
      case 0xd6: output.opCode = "DCXR"; output.z80OPCode = "SUB"; output.oreg = "A"; output.ireg = "A"; output.para1 = opCode[1].toString(16); output.opBytes = 2; break;
      case 0xd7: output.opCode = "RST10"; output.z80OPCode = "RST 10"; output.cycles = 11; output.oreg = "SP"; break;
      case 0xd8: output.opCode = "RETC"; output.z80OPCode = "RET"; (state.flags.f & fFlags.carry) ? output.cycles = 11 : output.cycles = 5; output.cycleConditional = true; output.ireg = "SP"; break;
      case 0xd9: output.opCode = "NOP"; output.z80OPCode = "NOP"; output.cycles = 4; break;
      case 0xda: output.opCode = "JMPC"; output.z80OPCode = "JP"; (state.flags.f & fFlags.carry) ? output.cycles = 15 : output.cycles = 10; output.cycleConditional = true; output.para1 = opCode[1].toString(16); output.para2 = opCode[2].toString(16); output.opBytes = 3; break;
      case 0xdb: output.opCode = "HWIN"; output.z80OPCode = "EXX"; output.cycles = 10; output.para1 = opCode[1].toString(16); output.opBytes = 2; break;
      case 0xdc: output.opCode = "CALLC"; output.z80OPCode = "CP"; (state.flags.f & fFlags.carry) ? output.cycles = 18 : output.cycles = 10; output.cycleConditional = true; output.oreg = "SP"; output.ptr = "#"; output.para1 = opCode[1].toString(16); output.para2 = opCode[2].toString(16); output.opBytes = 3; break; // TODO: Update cycle count with F flag condition
      case 0xdd: output = state.disassemble8080OP(state, pc + 1); output.opBytes += 1; output.indexRegUsed = "IX"; output.z80OPCode = "**"; output.cycles += 10; break;
      case 0xde: output.opCode = "DEXR"; output.z80OPCode = "SBC"; output.cycles = 7; output.para1 = opCode[1].toString(16); output.oreg = "A"; output.ireg = "A"; output.para1 = opCode[1].toString(16); output.opBytes = 2; break;
      case 0xdf: output.opCode = "RST18"; output.z80OPCode = "RST 18"; output.cycles = 11; output.oreg = "SP"; break;

      case 0xe0: output.opCode = "RETNP"; output.z80OPCode = "RET"; (state.flags.f & fFlags.parity) ? output.cycles = 5 : output.cycles = 11; output.cycleConditional = true; break;
      case 0xe1: output.opCode = "POPR"; output.z80OPCode = "POP"; output.cycles = 10; output.oreg = "HL"; output.ireg = "SP"; output.ptr = "$"; break;
      case 0xe2: output.opCode = "JMPNP"; output.z80OPCode = "JP PO"; (state.flags.f & fFlags.parity) ? output.cycles = 10 : output.cycles = 15; output.cycleConditional = true;  output.para1 = opCode[1].toString(16); output.para2 = opCode[2].toString(16); output.opBytes = 3; break;
      case 0xe3: output.opCode = "XCHM"; output.z80OPCode = "EX"; output.ptr = "$"; output.ireg = "SP"; output.oreg = "HL"; output.cycles = 4; break;
      case 0xe4: output.opCode = "UKNOP"; output.z80OPCode = "CALL"; output.ptr = "!"; output.cycles = 18; output.para1 = opCode[1].toString(16); output.para2 = opCode[2].toString(16); output.opBytes = 3; break; // TODO: Update cycle count with F flag condition
      case 0xe5: output.opCode = "PUSH"; output.z80OPCode = "PUSH"; output.cycles = 11; output.ireg = "HL"; output.oreg = "SP"; output.ptr = "#"; break;
      case 0xe6: output.opCode = "ANDR"; output.z80OPCode = "AND"; output.cycles = 11; output.ireg = "A"; output.oreg = "A"; output.para1 = opCode[1].toString(16); output.opBytes = 2; break;
      case 0xe7: output.opCode = "RST20"; output.z80OPCode = "RST 20"; output.cycles = 11; output.oreg = "SP"; break;
      case 0xe8: output.opCode = "RETP"; output.z80OPCode = "RET"; (state.flags.f & fFlags.parity) ? output.cycles = 11 : output.cycles = 5; output.cycleConditional = true; output.para1 = opCode[1].toString(16); output.para2 = opCode[2].toString(16); break;
      case 0xe9: output.opCode = "JMP"; output.z80OPCode = "JP"; output.ireg = "HL"; output.cycles = 4; output.para1 = opCode[1].toString(16); output.para2 = opCode[2].toString(16); break;
      case 0xea: output.opCode = "JMPP"; output.z80OPCode = "JP"; (state.flags.f & fFlags.parity) ? output.cycles = 15 : output.cycles = 10; output.cycleConditional = true; output.para1 = opCode[1].toString(16); output.para2 = opCode[2].toString(16); output.opBytes = 3; break;
      case 0xeb: output.opCode = "XCHR"; output.z80OPCode = "EX"; output.cycles = 4; output.ireg = "DE"; output.oreg = "HL"; break;
      case 0xec: output.opCode = "UKNOP"; output.z80OPCode = "CALL"; output.ptr = "!"; output.cycles = 18; output.para1 = opCode[1].toString(16); output.para2 = opCode[2].toString(16); output.opBytes = 3; break; // TODO: Update cycle count with F flag condition
      case 0xed: output.opCode = "NOP"; output.z80OPCode = "UKNOP"; output.ptr = "!"; output.cycles = 4; output.opBytes = 3; break; // Not sure if this is correct
      case 0xee: output.opCode = "XORR"; output.z80OPCode = "XOR"; output.cycles = 7; output.para1 = opCode[1].toString(16); output.ireg = "A"; output.oreg = "A"; output.opBytes = 2; break;
      case 0xef: output.opCode = "RST28"; output.z80OPCode = "RST 28"; output.cycles = 11; output.oreg = "SP"; break;

      case 0xf0: output.opCode = "UKNOP"; output.z80OPCode = "RET"; output.ptr = "!"; output.cycles = 11; break; // TODO: Update cycle count with F flag condition
      case 0xf1: output.opCode = "POPR"; output.z80OPCode = "POP"; output.cycles = 10; output.oreg = "AF"; output.ireg = "SP"; output.ptr = "$"; break;
      case 0xf2: output.opCode = "JMPNS"; output.z80OPCode = "JP"; (state.flags.f & fFlags.sign) ? output.cycles = 10 : output.cycles = 15; output.cycleConditional = true; output.para1 = opCode[1].toString(16); output.para2 = opCode[2].toString(16); output.opBytes = 3; break; // TODO: Update cycle count with F flag condition
      case 0xf3: output.opCode = "DIF"; output.z80OPCode = "DI"; output.cycles = 4; break;
      case 0xf4: output.opCode = "CALLS"; output.z80OPCode = "CALL"; (state.flags.f & fFlags.sign) ? output.cycles = 18 : output.cycles = 11; output.cycleConditional = true; output.para1 = opCode[1].toString(16); output.para2 = opCode[2].toString(16); output.opBytes = 3; break;
      case 0xf5: output.opCode = "PUSH"; output.z80OPCode = "PUSH"; output.cycles = 11; output.ireg = "AF"; output.oreg = "SP"; output.ptr = "#"; break;
      case 0xf6: output.opCode = "ORR"; output.z80OPCode = "OR"; output.cycles = 7; output.oreg = "A"; output.ireg = "A"; output.para1 = opCode[1].toString(16); output.opBytes = 2; break;
      case 0xf7: output.opCode = "RST30"; output.z80OPCode = "RST 30"; output.cycles = 11; output.oreg = "SP"; break;
      case 0xf8: output.opCode = "RETS"; output.z80OPCode = "RET"; (state.flags.f & fFlags.sign) ? output.cycles = 11 : output.cycles = 5; output.cycleConditional = true; break;
      case 0xf9: output.opCode = "LD2R"; output.z80OPCode = "LD"; output.oreg = "SP"; output.ireg = "HL";  output.cycles = 6; break;
      case 0xfa: output.opCode = "JMPS"; output.z80OPCode = "JP"; (state.flags.f & fFlags.sign) ? output.cycles = 15 : output.cycles = 10; output.cycleConditional = true; output.para1 = opCode[1].toString(16); output.para2 = opCode[2].toString(16); output.opBytes = 3; break;
      case 0xfb: output.opCode = "SIF"; output.z80OPCode = "EI"; output.cycles = 4; break;
      case 0xfc: output.opCode = "CALLS"; output.z80OPCode = "CALL"; (state.flags.f & fFlags.sign) ? output.cycles = 18 : output.cycles = 11; output.cycleConditional = true; output.para1 = opCode[1].toString(16); output.para2 = opCode[2].toString(16); output.opBytes = 3; break;
      case 0xfd: output = state.disassemble8080OP(state, pc + 1); output.opBytes += 1; output.indexRegUsed = "IY"; output.z80OPCode = "**"; output.cycles += 10; break;
      case 0xfe: output.opCode = "DCXR"; output.z80OPCode = "CP"; output.cycles = 7; output.ireg = "A"; output.para1 = opCode[1].toString(16); output.opBytes = 2; break;
      case 0xff: output.opCode = "RST38"; output.z80OPCode = "RST 38"; output.cycles = 7; output.oreg = "SP"; break;
    }

    if (output.indexRegUsed) {
      output.ireg = output.ireg === "HL" ? output.indexRegUsed : output.ireg;
      output.oreg = output.oreg === "HL" ? output.indexRegUsed : output.oreg;
    }

    output.error = false;

    return output;
  }

  cpu.emulate8080OP = function(state) {

    // Not all OPCodes will have 3 bytes. The trailing bytes are ignored if unsed.
    var opCode = [state.memory[state.flags.pc], state.memory[state.flags.pc + 1], state.memory[state.flags.pc + 2]];

    var currentPC = state.flags.pc;

    var preCycleChange = state.cycles;

    state.flags.pc = (state.flags.pc + 1) & 0xffff;

    switch (opCode[0]) {
      case 0x00: state.cycles += 4; break;	                          // NOP
      case 0x01: 							                                        // LD2R	BC, word
        state.flags.c = opCode[1] & 0xff;
        state.flags.b = opCode[2] & 0xff;
        state.flags.pc += 2;
        state.flags.pc &= 0xffff;
        state.cycles += 10;
        break;

      case 0x02:                                                      // LD2M (BC),A
        var bc = cpu.getFlags(state, "bc");
        cpu.writeByte(state, bc, state.flags.a);
        state.cycles += 7;
        break;

      case 0x03:                                                      // INCR    BC
        var bc = cpu.getFlags(state, "bc");
        bc++ & 0xffff;
        state.flags.b = (bc & 0xff00) >> 8;
        state.flags.c = bc & 0xff;
        state.cycles += 6;
        break;

      case 0x04: 							                                       // INCR    B
        state.flags.b = cpu.indecrementByte(state, state.flags.b, 1);
        state.cycles += 5;
        break;

      case 0x05: 							                                        // DCRR    B
        state.flags.b = cpu.indecrementByte(state, state.flags.b, -1);
        state.cycles += 5;
        break;

		  case 0x06: 							                                        // LD2R B,byte
        state.flags.b = opCode[1] & 0xff;
        state.flags.pc = (state.flags.pc + 1) & 0xffff;
        state.cycles += 7;
        break;

      case 0x07:                                                      // RLC A
        var res = state.flags.a >> 7;
        if (res) {
          state.flags.f |= fFlags.carry;
        } else {
          state.flags.f &= ~fFlags.carry & 0xff;
        }

        state.flags.a = (((state.flags.a << 1) & 0xff) | res);

        state.cycles += 4;
        break;

      case 0x08: state.cycles += 4; break;                    // NOP

      case 0x09: 							                                      // INXR HL, BC
        var reg;
        if ((state.db.nextOpIReg === "IX") || (state.db.nextOpIReg === "IY")) {
          reg = cpu.getFlags(state, state.db.nextOpIReg.toLowerCase());
        } else {
          reg = cpu.getFlags(state, "hl");
        }
        var bc = cpu.getFlags(state, "bc");
        var res = reg + bc;

        if (state.db.nextOpIReg === "IX" || state.db.nextOpIReg === "IY") {
          state.flags[state.db.nextOpIReg.toLowerCase()] = res & 0xffff;
        } else {
          state.flags.h = (res & 0xff00) >> 8;
          state.flags.l = res & 0xff;
        }
        state.cycles += 11;
        break;

      case 0x0a:                                                    // LD2R   A,(BC)
        state.flags.a = state.memory[cpu.getFlags(state, "bc")];
        state.cycles += 7;
        break;

      case 0x0b:                                                    // DCRR   BC
        var bc = cpu.getFlags(state, "bc");
        bc-- & 0xffff;
        var ret = cpu.splitBytes(bc);
        state.flags.b = ret[1];
        state.flags.c = ret[0];
        state.cycles += 6;
        break;

      case 0x0c:                                                    // INCR    C
        state.flags.c = cpu.indecrementByte(state, state.flags.c, 1);
        state.cycles += 5;
        break;

      case 0x0d: 							                                      // DCRR    C
        state.flags.c = cpu.indecrementByte(state, state.flags.c, -1);
        state.cycles += 5;
        break;

      case 0x0e: 							                                      // LD2R C,byte
        state.flags.c = opCode[1] & 0xff;
        state.flags.pc = (state.flags.pc + 1) & 0xffff;
        state.cycles += 7;
        break;

      case 0x0f: 							                                      // RRCA
        var hi = (state.flags.a & 1) << 7;
        if (hi) {
          state.flags.f |= fFlags.carry;
        } else {
          state.flags.f &= ~fFlags.carry & 0xff;
        }
        state.flags.a = (state.flags.a & 0xfe) >> 1 | hi;
        state.cycles += 4;
        break;

      case 0x10: state.cycles += 4; break;

      case 0x11: 							                                      // LD2R	DE,word
        state.flags.e = opCode[1] & 0xff;
        state.flags.d = opCode[2] & 0xff;
        state.flags.pc += 2;
        state.flags.pc &= 0xffff;
        state.cycles += 10;
        break;

      case 0x12:                                                    // LD2M   (DE),A
        var de = cpu.getFlags(state, "de");
        cpu.writeByte(state, de, state.flags.a);
        state.cycles += 7;
        break;

      case 0x13: 							                                      // INCR    DE
        var de = cpu.getFlags(state, "de");
        de++ & 0xffff;
        state.flags.d = (de & 0xff00) >> 8;
        state.flags.e = de & 0xff;
        state.cycles += 6;
        break;

      case 0x14:                                                    // INCR    D
        state.flags.d = cpu.indecrementByte(state, state.flags.d, 1);
        state.cycles += 5;
        break;

      case 0x15:                                                    // DCRR    D
        state.flags.d = cpu.indecrementByte(state, state.flags.d, -1);
        state.cycles += 5;
        break;

      case 0x16:                                                    // LD2R	D,byte
        state.flags.d = opCode[1] & 0xff;
        state.flags.pc = (state.flags.pc + 1) & 0xffff;
        state.cycles += 7;
        break;

      case 0x17:                                                    // RLC9 A
        var carry = (state.flags.f & fFlags.carry) ? 1 : 0;
        if(state.flags.a & 0x80) {
          state.flags.f |= fFlags.carry;
        } else {
          state.flags.f &= ~fFlags.carry & 0xff;
        }

        state.flags.a = ((state.flags.a & 0x7f) << 7) | carry;
        state.cycles += 4;
        break;

      case 0x18: state.cycles += 4; break;                    // NOP

      case 0x19: 							                                      // INXR HL, DE
        var reg;
        if ((state.db.nextOpIReg === "IX") || (state.db.nextOpIReg === "IY")) {
          reg = cpu.getFlags(state, state.db.nextOpIReg.toLowerCase());
        } else {
          reg = cpu.getFlags(state, "hl");
        }

        var de = cpu.getFlags(state, "de");
        var res = reg + de;

        if (state.db.nextOpIReg === "IX" || state.db.nextOpIReg === "IY") {
          state.flags[state.db.nextOpIReg.toLowerCase()] = res & 0xffff;
        } else {
          state.flags.h = (res & 0xff00) >> 8;
          state.flags.l = res & 0xff;
        }

        state.cycles += 11;
        break;

      case 0x1a: 							                                      // LD2R   A,(DE)
        state.flags.a = state.memory[cpu.getFlags(state, "de")];
        state.cycles += 7;
        break;

      case 0x1b:                                                    // DCRR   DE
        var de = cpu.getFlags(state, "de");
        de-- & 0xFFFF;
        var ret = cpu.splitBytes(de);
        state.flags.e = ret[0];
        state.flags.d = ret[1];
        state.cycles += 6;
        break;

      case 0x1c:                                                    // INCR    E
        state.flags.e = cpu.indecrementByte(state, state.flags.e, 1);
        state.cycles += 5;
        break;

      case 0x1d: 							                                      // DCRR    E
        state.flags.e = cpu.indecrementByte(state, state.flags.e, -1);
        state.cycles += 7;
        break;

      case 0x1e: 							                                      // LD2R
        state.flags.e = opCode[1] & 0xff;
        state.flags.pc = (state.flags.pc + 1) & 0xffff;
        state.cycles += 7;
        break;

      case 0x1f: 							                                      // RRC A
        var carry = (state.flags.f & fFlags.carry) ? 0x80 : 0;
        if(state.flags.a & 1) {
          state.flags.f |= fFlags.carry;
        } else {
          state.flags.f &= ~fFlags.carry & 0xff;
        }

        state.flags.a = ((state.flags.a & 0xfe) >> 1) | carry;
        state.cycles += 4;
        break;

      case 0x20: state.cycles += 4; break;                    // NOP

      case 0x21: 							                                      // LD2R	HL,word
        if ((state.db.nextOpIReg === "IX") || (state.db.nextOpIReg === "IY")) {
          state.flags[state.db.nextOpIReg.toLowerCase()] = (((opCode[2] << 8) | opCode[1]) & 0xffff);
        } else {
          state.flags.l = opCode[1] & 0xff;
          state.flags.h = opCode[2] & 0xff;
        }

        state.flags.pc += 2;
        state.flags.pc &= 0xffff;
        state.cycles += 10;
        break;

      case 0x22:                                                    // LD2M (word),HL
        var reg;
        if ((state.db.nextOpIReg === "IX") || (state.db.nextOpIReg === "IY")) {
          reg = cpu.getFlags(state, state.db.nextOpIReg.toLowerCase());
        } else {
          reg = cpu.getFlags(state, "hl");
        }
        cpu.writeWord(state, (((opCode[2] << 8) | opCode[1]) & 0xffff), reg);
        state.flags.pc += 2;
        state.flags.pc &= 0xffff;
        state.cycles += 16;
        break;

      case 0x23:                                                    // INCR    HL
        if ((state.db.nextOpIReg === "IX") || (state.db.nextOpIReg === "IY")) {
          state.flags[state.db.nextOpIReg.toLowerCase()] = cpu.getFlags(state, state.db.nextOpIReg.toLowerCase())++ & 0xffff;
        } else {
          var hl = cpu.getFlags(state, "hl");
          hl++ & 0xffff;
          var ret = cpu.splitBytes(hl);
          state.flags.h = ret[1];
          state.flags.l = ret[0];
        }
 
        state.cycles += 6;
        break;

      case 0x24:                                                    // INCR    H
        state.flags.h = cpu.indecrementByte(state, state.flags.h, 1);
        state.cycles += 5;
        break;

      case 0x25:                                                    // DCRR    H
        state.flags.h = cpu.indecrementByte(state, state.flags.h, -1);
        state.cycles += 5;
        break;

      case 0x26:                                                    // LD2R	H,byte
        state.flags.h = opCode[1] & 0xff;
        state.flags.pc = (state.flags.pc + 1) & 0xffff;
        state.cycles += 7;
        break;

      case 0x27: state.cycles += 4; break;                    // NOP // DAA

      case 0x28: state.cycles += 4; break;                    // NOP

      case 0x29: 							                                      // INXR HL, HL
        if ((state.db.nextOpIReg === "IX") || (state.db.nextOpIReg === "IY")) {
          var ret = cpu.getFlags(state, state.db.nextOpIReg.toLowerCase());
          ret += ret;
          state.flags[state.db.nextOpIReg.toLowerCase()] = ret & 0xffff;
        } else {
          var hl = cpu.getFlags(state, "hl");
          var res = hl + hl;
          state.flags.h = (res & 0xff00) >> 8;
          state.flags.l = res & 0xff;
        }
        state.cycles += 11;
        break;

      case 0x2a:  							                                    // LD2R	HL, (word)
        var offset = (opCode[2] << 8) | (opCode[1]);
        if ((state.db.nextOpIReg === "IX") || (state.db.nextOpIReg === "IY")) {
          state.flags[state.db.nextOpIReg.toLowerCase()] = (((opCode[2] << 8) | opCode[1]) & 0xffff);
        } else {
          state.flags.l = state.memory[(offset) & 0xffff] & 0xff;
          state.flags.h = state.memory[(offset + 1) & 0xffff] & 0xff;
        }
        state.flags.pc += 2;
        state.flags.pc &= 0xffff;
        state.cycles += 16;
        break;

      case 0x2b:                                                    // DCRR   HL
        if ((state.db.nextOpIReg === "IX") || (state.db.nextOpIReg === "IY")) {
          state.flags[state.db.nextOpIReg.toLowerCase()] = cpu.getFlags(state, state.db.nextOpIReg.toLowerCase())-- & 0xffff;
        } else {
          var hl = cpu.getFlags(state, "hl");
          hl-- & 0xffff;
          var ret = cpu.splitBytes(hl);
          state.flags.h = ret[1];
          state.flags.l = ret[0];
        }

        state.cycles += 6;
        break;

      case 0x2c:                                                    // INCR    L
        state.flags.l = cpu.indecrementByte(state, state.flags.l, 1);
        state.cycles += 5;
        break;

      case 0x2d: 							                                      // DCRR    L
        state.flags.l = cpu.indecrementByte(state, state.flags.l, -1);
        state.cycles += 7;
        break;

      case 0x2e: 							                                      // LD2R L,byte
        state.flags.l = opCode[1] & 0xff;
        state.flags.pc = (state.flags.pc + 1) & 0xffff;
        state.cycles += 7;
        break;

      case 0x2f: 							                                      // CPL A
        state.flags.a ^= 0xff;
        state.cycles += 4;
        break;

      case 0x30: state.cycles += 4; break;                    // NOP

      case 0x31:                                                    // LD2R SP,word
        state.flags.sp = ((opCode[2] << 8) | opCode[1]) & 0xffff;
        state.flags.pc += 2;
        state.flags.pc &= 0xffff;
        state.cycles += 10;
        break;

      case 0x32: 							                                      // LD2M    (word),A
        var offset = (opCode[2] << 8) | (opCode[1]);
        cpu.writeByte(state, offset, state.flags.a);
        state.flags.pc += 2;
        state.flags.pc &= 0xffff;
        state.cycles += 13;
        break;

      // Note: increasing SP does NOT modify the F register.
      case 0x33:                                                    // INCR   SP
        state.flags.sp = ((state.flags.sp + 1) & 0xffff);
        state.cycles += 6;
        break;

      case 0x34:                                                    // INCM   (HL)
        var offset;
        if ((state.db.nextOpIReg === "IX") || (state.db.nextOpIReg === "IY")) {
          offset = cpu.getFlags(state, state.db.nextOpIReg.toLowerCase());
        } else {
          offset = cpu.getFlags(state, "hl");
        }

        cpu.writeByte(state, offset, cpu.indecrementByte(state, cpu.readByte(state, offset), 1));
        state.cycles += 10;
        break;

      case 0x35:                                                    // DCRM   (HL)
        var offset;
        if ((state.db.nextOpIReg === "IX") || (state.db.nextOpIReg === "IY")) {
          offset = cpu.getFlags(state, state.db.nextOpIReg.toLowerCase());
        } else {
          offset = cpu.getFlags(state, "hl");
        }
        cpu.writeByte(state, offset, cpu.indecrementByte(state, cpu.readByte(state, offset), -1));
        state.cycles += 10;
        break;

      case 0x36:                                                    // LD2M (HL),byte
        var offset;
        if ((state.db.nextOpIReg === "IX") || (state.db.nextOpIReg === "IY")) {
          offset = cpu.getFlags(state, state.db.nextOpIReg.toLowerCase());
        } else {
          offset = cpu.getFlags(state, "hl");
        }

        cpu.writeByte(state, offset, opCode[1]);
        state.flags.pc = (state.flags.pc + 1) & 0xffff;
        state.cycles += 10;
        break;

      case 0x37:                                                    // SCF
        state.flags.f |= fFlags.carry;
        state.cycles += 4;
        break;

      case 0x38: state.cycles += 4; break;                    // NOP

      case 0x39: 							                                      // INXR HL, SP
        var reg;
        if ((state.db.nextOpIReg === "IX") || (state.db.nextOpIReg === "IY")) {
          reg = cpu.getFlags(state, state.db.nextOpIReg.toLowerCase());
        } else {
          reg = cpu.getFlags(state, "hl");
        }

        var res = reg + state.flags.sp;

        if ((state.db.nextOpIReg === "IX") || (state.db.nextOpIReg === "IY")) {
          state.flags[state.db.nextOpIReg.toLowerCase()] = res & 0xffff;
        } else {
          state.flags.h = (res & 0xff00) >> 8;
          state.flags.l = res & 0xff;
        }

        state.cycles += 11;
        break;

      case 0x3a:                                                    // LD2R A,(word)
        var offset = (opCode[2] << 8) | (opCode[1]);
        state.flags.a = cpu.readByte(state, offset);
        state.flags.pc += 2;
        state.flags.pc &= 0xffff;
        state.cycles += 13;
        break;

        // Note: decreasing SP does NOT modify the F register.
      case 0x3b:                                                    // DCRR   SP
        state.flags.sp = ((state.flags.sp - 1) & 0xffff);
        state.cycles += 6;
        break;

      case 0x3c:                                                    // INCR    A
        state.flags.a = cpu.indecrementByte(state, state.flags.a, 1);
        state.cycles += 5;
        break;

      case 0x3d: 							                                      // DCRR    A
        state.flags.a = cpu.indecrementByte(state, state.flags.a, -1);
        state.cycles += 5;
        break;

      case 0x3e:                                       							// LD2R    A,byte
        state.flags.a = opCode[1];
        state.flags.pc = (state.flags.pc + 1) & 0xffff;
        state.cycles += 7;
        break;

      case 0x3f:                                                    // CCF
        state.flags.f &= ~fFlags.carry & 0xff;
        state.cycles += 4;
        break;

      // Not sure why this instruction exists. Maybe they just wanted to get 5 cycles?
      case 0x40: 							                                      // LD2R   B,B
        state.flags.b = state.flags.b & 0xff;
        state.cycles += 5;
        break;

      case 0x41: 							                                      // LD2R   B,C
        state.flags.b = state.flags.c & 0xff;
        state.cycles += 5;
        break;

      case 0x42: 							                                      // LD2R   B,D
        state.flags.b = state.flags.d & 0xff;
        state.cycles += 5;
        break;

      case 0x43:  							                                    // LD2R   B,E
        state.flags.b = state.flags.e & 0xff;
        state.cycles += 5;
        break;

      case 0x44:  							                                    // LD2R   B,H
        state.flags.b = state.flags.h & 0xff;
        state.cycles += 5;
        break;

      case 0x45:  							                                    // LD2R   B,L
        state.flags.b = state.flags.l & 0xff;
        state.cycles += 5;
        break;

      case 0x46: 							                                      // LD2R   B,(HL)
        var offset;
        if ((state.db.nextOpIReg === "IX") || (state.db.nextOpIReg === "IY")) {
          offset = cpu.getFlags(state, state.db.nextOpIReg.toLowerCase());
        } else {
          offset = cpu.getFlags(state, "hl");
        }
        
        state.flags.b = cpu.readByte(state, offset);
        state.cycles += 7;
        break;

      case 0x47:  							                                    // LD2R   B,A
        state.flags.b = state.flags.a & 0xff;
        state.cycles += 5;
        break;

      case 0x48:  							                                    // LD2R   C,L
        state.flags.c = state.flags.b & 0xff;
        state.cycles += 5;
        break;

      // Maybe they just wanted consistancy?
      case 0x49:  							                                    // LD2R   C,C
        state.flags.c = state.flags.c & 0xff;
        state.cycles += 5;
        break;

      case 0x4a:   							                                    // LD2R   C,D
        state.flags.c = state.flags.d & 0xff;
        state.cycles += 5;
        break;

      case 0x4b:  							                                    // LD2R   C,E
        state.flags.c = state.flags.e & 0xff;
        state.cycles += 5;
        break;

      case 0x4c:   							                                    // LD2R   C,H
        state.flags.c = state.flags.h & 0xff;
        state.cycles += 5;
        break;

      case 0x4d:    							                                  // LD2R   C,L
        state.flags.c = state.flags.l & 0xff;
        state.cycles += 5;
        break;

      case 0x4e: 							                                      // LD2R   C,(HL)
        var offset;
        if ((state.db.nextOpIReg === "IX") || (state.db.nextOpIReg === "IY")) {
          offset = cpu.getFlags(state, state.db.nextOpIReg.toLowerCase());
        } else {
          offset = cpu.getFlags(state, "hl");
        }
        state.flags.c = cpu.readByte(state, offset);
        state.cycles += 7;
        break;

      case 0x4f:    							                                  // LD2R   C,A
        state.flags.c = state.flags.a & 0xff;
        state.cycles += 5;
        break;

      case 0x50:     							                                  // LD2R   D,B
        state.flags.d = state.flags.b & 0xff;
        state.cycles += 5;
        break;

      case 0x51:     							                                  // LD2R   D,C
        state.flags.d = state.flags.c & 0xff;
        state.cycles += 5;
        break;

      case 0x52:     							                                  // LD2R   D,D
        state.flags.d = state.flags.d & 0xff;
        state.cycles += 5;
        break;

      case 0x53:     							                                  // LD2R   D,E
        state.flags.d = state.flags.e & 0xff;
        state.cycles += 5;
        break;

      case 0x54:     							                                  // LD2R   D,H
        state.flags.d = state.flags.h & 0xff;
        state.cycles += 5;
        break;

      case 0x55:     							                                  // LD2R   D,L
        state.flags.d = state.flags.l & 0xff;
        state.cycles += 5;
        break;

      case 0x56: 							                                      // LD2R   D,(HL)
        var offset;
        if ((state.db.nextOpIReg === "IX") || (state.db.nextOpIReg === "IY")) {
          offset = cpu.getFlags(state, state.db.nextOpIReg.toLowerCase());
        } else {
          offset = cpu.getFlags(state, "hl");
        }
        state.flags.d = cpu.readByte(state, offset);
        state.cycles += 7;
        break;

      case 0x57:      							                                // LD2R   D,A
        state.flags.d = state.flags.a & 0xff;
        state.cycles += 5;
        break;

      case 0x58:     							                                  // LD2R   E,B
        state.flags.e = state.flags.b & 0xff;
        state.cycles += 5;
        break;

      case 0x59:      							                                // LD2R   E,C
        state.flags.e = state.flags.c & 0xff;
        state.cycles += 5;
        break;

      case 0x5a:      							                                // LD2R   E,D
        state.flags.e = state.flags.d & 0xff;
        state.cycles += 5;
        break;

      // Maybe the circuitry was generated by a forloop, and someone forgot to test i === j?
      case 0x5b:      							                                // LD2R   E,E
        state.flags.e = state.flags.e & 0xff;
        state.cycles += 5;
        break;

      case 0x5c:      							                                // LD2R   E,H
        state.flags.e = state.flags.h & 0xff;
        state.cycles += 5;
        break;

      case 0x5d:      							                                // LD2R   E,L
        state.flags.e = state.flags.l & 0xff;
        state.cycles += 5;
        break;

      case 0x5e: 							                                      // LD2R   E,(HL)
        var offset;
        if ((state.db.nextOpIReg === "IX") || (state.db.nextOpIReg === "IY")) {
          offset = cpu.getFlags(state, state.db.nextOpIReg.toLowerCase());
        } else {
          offset = cpu.getFlags(state, "hl");
        }
        state.flags.e = cpu.readByte(state, offset);;
        state.cycles += 7;
        break;

      case 0x5f:      							                                // LD2R   E,A
        state.flags.e = state.flags.a & 0xff;
        state.cycles += 5;
        break;

      case 0x60:      							                                // LD2R   H,B
        state.flags.h = state.flags.b & 0xff;
        state.cycles += 5;
        break;

      case 0x61:       							                                // LD2R   H,C
        state.flags.h = state.flags.c & 0xff;
        state.cycles += 5;
        break;

      case 0x62:       							                                // LD2R   H,D
        state.flags.h = state.flags.d & 0xff;
        state.cycles += 5;
        break;

      case 0x63:      							                                // LD2R   H,E
        state.flags.h = state.flags.e & 0xff;
        state.cycles += 5;
        break;

      // Almost done all these similar ops
      case 0x64:       							                                // LD2R   H,H
        state.flags.h = state.flags.h & 0xff;
        state.cycles += 5;
        break;

      case 0x65:      							                                // LD2R   H,L
        state.flags.h = state.flags.l & 0xff;
        state.cycles += 5;
        break;

      case 0x66: 							                                      // LD2R   H,(HL)
        var offset;
        if ((state.db.nextOpIReg === "IX") || (state.db.nextOpIReg === "IY")) {
          offset = cpu.getFlags(state, state.db.nextOpIReg.toLowerCase());
        } else {
          offset = cpu.getFlags(state, "hl");
        }
        state.flags.h = cpu.readByte(state, offset);;
        state.cycles += 7;
        break;

      case 0x67:      							                                // LD2R   H,A
        state.flags.h = state.flags.a & 0xff;
        state.cycles += 5;
        break;

      case 0x68:      							                                // LD2R   L,B
        state.flags.l = state.flags.b & 0xff;
        state.cycles += 5;
        break;

      case 0x69:       							                                // LD2R   L,C
        state.flags.l = state.flags.c & 0xff;
        state.cycles += 5;
        break;

      case 0x6a:       							                                // LD2R   L,D
        state.flags.l = state.flags.d & 0xff;
        state.cycles += 5;
        break;

      case 0x6b:       							                                // LD2R   L,E
        state.flags.l = state.flags.e & 0xff;
        state.cycles += 5;
        break;

      case 0x6c:       							                                // LD2R   L,H
        state.flags.l = state.flags.h & 0xff;
        state.cycles += 5;
        break;

      // Bet you didn't expect to see DOGE appear in here. Did you?
      case 0x6d:       							                                // LD2R   L,L
        state.flags.l = state.flags.l & 0xff;
        state.cycles += 5;
        break;

      case 0x6e: 							                                      // LD2R   L,(HL)
        var offset;
        if ((state.db.nextOpIReg === "IX") || (state.db.nextOpIReg === "IY")) {
          offset = cpu.getFlags(state, state.db.nextOpIReg.toLowerCase());
        } else {
          offset = cpu.getFlags(state, "hl");
        }
        state.flags.l = cpu.readByte(state, offset);
        state.cycles += 7;
        break;

      case 0x6f:       							                                // LD2R   L,A
        state.flags.l = state.flags.a & 0xff;
        state.cycles += 5;
        break;

      case 0x70:                                                    // LD2M (HL),B
        var offset;
        if ((state.db.nextOpIReg === "IX") || (state.db.nextOpIReg === "IY")) {
          offset = cpu.getFlags(state, state.db.nextOpIReg.toLowerCase());
        } else {
          offset = cpu.getFlags(state, "hl");
        }
        cpu.writeByte(state, offset, state.flags.b);
        state.cycles += 7;
        break;

      case 0x71:                                                    // LD2M (HL),C
        var offset;
        if ((state.db.nextOpIReg === "IX") || (state.db.nextOpIReg === "IY")) {
          offset = cpu.getFlags(state, state.db.nextOpIReg.toLowerCase());
        } else {
          offset = cpu.getFlags(state, "hl");
        }
        cpu.writeByte(state, offset, state.flags.c);
        state.cycles += 7;
        break;

      case 0x72:                                                    // LD2M (HL),D
        var offset;
        if ((state.db.nextOpIReg === "IX") || (state.db.nextOpIReg === "IY")) {
          offset = cpu.getFlags(state, state.db.nextOpIReg.toLowerCase());
        } else {
          offset = cpu.getFlags(state, "hl");
        }
        cpu.writeByte(state, offset, state.flags.d);
        state.cycles += 7;
        break;

      case 0x73:                                                    // LD2M (HL),E
        var offset;
        if ((state.db.nextOpIReg === "IX") || (state.db.nextOpIReg === "IY")) {
          offset = cpu.getFlags(state, state.db.nextOpIReg.toLowerCase());
        } else {
          offset = cpu.getFlags(state, "hl");
        }
        cpu.writeByte(state, offset, state.flags.e);
        state.cycles += 7;
        break;

      case 0x74:                                                     // LD2M (HL),H
        var offset;
        if ((state.db.nextOpIReg === "IX") || (state.db.nextOpIReg === "IY")) {
          offset = cpu.getFlags(state, state.db.nextOpIReg.toLowerCase());
        } else {
          offset = cpu.getFlags(state, "hl");
        }
        cpu.writeByte(state, offset, state.flags.h);
        state.cycles += 7;
        break;

      case 0x75:                                                    // LD2M (HL),L
        var offset;
        if ((state.db.nextOpIReg === "IX") || (state.db.nextOpIReg === "IY")) {
          offset = cpu.getFlags(state, state.db.nextOpIReg.toLowerCase());
        } else {
          offset = cpu.getFlags(state, "hl");
        }
        cpu.writeByte(state, offset, state.flags.l);
        state.cycles += 7;
        break;

      case 0x76:                                                    // HALT
        state.cycles += 7;
        cpu.unimplementedInstruction(state); // This is the only way to kill it.
        break;

      case 0x77:                                                    // LD2M (HL),A
        var offset;
        if ((state.db.nextOpIReg === "IX") || (state.db.nextOpIReg === "IY")) {
          offset = cpu.getFlags(state, state.db.nextOpIReg.toLowerCase());
        } else {
          offset = cpu.getFlags(state, "hl");
        }
        cpu.writeByte(state, offset, state.flags.a);
        state.cycles += 7;
        break;

      case 0x78:      							                                // LD2R   A,B
        state.flags.a = state.flags.b & 0xff;
        state.cycles += 5;
        break;

      case 0x79:      							                                // LD2R   A,C
        state.flags.a = state.flags.c & 0xff;
        state.cycles += 5;
        break;

      case 0x7a:      							                                // LD2R   A,D
        state.flags.a = state.flags.d & 0xff;
        state.cycles += 5;
        break;

      case 0x7b:       							                                // LD2R   A,E
        state.flags.a = state.flags.e & 0xff;
        state.cycles += 5;
        break;

      case 0x7c:      							                                // LD2R   A,H
        state.flags.a = state.flags.h & 0xff;
        state.cycles += 5;
        break;

      case 0x7d:      							                                // LD2R   A,L
        state.flags.a = state.flags.l & 0xff;
        state.cycles += 5;
        break;

      case 0x7e: 							                                      // LD2R   A,(HL)
        var offset;
        if ((state.db.nextOpIReg === "IX") || (state.db.nextOpIReg === "IY")) {
          offset = cpu.getFlags(state, state.db.nextOpIReg.toLowerCase());
        } else {
          offset = cpu.getFlags(state, "hl");
        }
        state.flags.a = cpu.readByte(state, offset);
        state.cycles += 7;
        break;

      // Yay, last one
      case 0x7f:      							                                // LD2R   A,A
        state.flags.a = state.flags.a & 0xff;
        state.cycles += 5;
        break;

      case 0x80:      							                                // INXR   A,B
        state.flags.a = cpu.addSubByte(state, state.flags.a, state.flags.b) & 0xff;
        state.cycles += 4;
        break;

      case 0x81:      							                                // INXR   A,C
        state.flags.a = cpu.addSubByte(state, state.flags.a, state.flags.c) & 0xff;
        state.cycles += 4;
        break;

      case 0x82:      							                                // INXR   A,D
        state.flags.a = cpu.addSubByte(state, state.flags.a, state.flags.d) & 0xff;
        state.cycles += 4;
        break;

      case 0x83:      							                                // INXR   A,E
        state.flags.a = cpu.addSubByte(state, state.flags.a, state.flags.e) & 0xff;
        state.cycles += 4;
        break;

      case 0x84:      							                                // INXR   A,H
        state.flags.a = cpu.addSubByte(state, state.flags.a, state.flags.h) & 0xff;
        state.cycles += 4;
        break;

      case 0x85:      							                                // INXR   A,L
        state.flags.a = cpu.addSubByte(state, state.flags.a, state.flags.l) & 0xff;
        state.cycles += 4;
        break;

      case 0x86:      							                                // INXR   A,(HL)
        var offset;
        if ((state.db.nextOpIReg === "IX") || (state.db.nextOpIReg === "IY")) {
          offset = cpu.getFlags(state, state.db.nextOpIReg.toLowerCase());
        } else {
          offset = cpu.getFlags(state, "hl");
        }
        state.flags.a = cpu.addSubByte(state, state.flags.a, (cpu.readByte(state, offset))) & 0xff;
        state.cycles += 7;
        break;

      case 0x87:      							                                // INXR   A,A
        state.flags.a = cpu.addSubByte(state, state.flags.a, state.flags.a) & 0xff;
        state.cycles += 4;
        break;

      case 0x88:      							                                // ICXR   A,B
        state.flags.a = cpu.addSubWithCarryByte(state, state.flags.a, state.flags.b) & 0xff;
        state.cycles += 4;
        break;

      case 0x89:      							                                // ICXR   A,C
        state.flags.a = cpu.addSubWithCarryByte(state, state.flags.a, state.flags.c) & 0xff;
        state.cycles += 4;
        break;

      case 0x8a:      							                                // ICXR   A,D
        state.flags.a = cpu.addSubWithCarryByte(state, state.flags.a, state.flags.d) & 0xff;
        state.cycles += 4;
        break;

      case 0x8b:      							                                // ICXR   A,E
        state.flags.a = cpu.addSubWithCarryByte(state, state.flags.a, state.flags.e) & 0xff;
        state.cycles += 4;
        break;

      case 0x8c:      							                                // ICXR   A,H
        state.flags.a = cpu.addSubWithCarryByte(state, state.flags.a, state.flags.h) & 0xff;
        state.cycles += 4;
        break;

      case 0x8d:      							                                // ICXR   A,L
        state.flags.a = cpu.addSubWithCarryByte(state, state.flags.a, state.flags.l) & 0xff;
        state.cycles += 4;
        break;

      case 0x8e:      							                                // ICXR   A,(HL)
        var offset;
        if ((state.db.nextOpIReg === "IX") || (state.db.nextOpIReg === "IY")) {
          offset = cpu.getFlags(state, state.db.nextOpIReg.toLowerCase());
        } else {
          offset = cpu.getFlags(state, "hl");
        }
        state.flags.a = cpu.addSubWithCarryByte(state, state.flags.a, (cpu.readByte(state, offset))) & 0xff;
        state.cycles += 7;
        break;

      case 0x8f:      							                                // ICXR   A,A
        state.flags.a = cpu.addSubWithCarryByte(state, state.flags.a, state.flags.a) & 0xff;
        state.cycles += 4;
        break;

      case 0x90:      							                                // DCXR   A,B
        state.flags.a = cpu.addSubByte(state, state.flags.a, state.flags.b, -1) & 0xff;
        state.cycles += 4;
        break;

      case 0x91:      							                                // DCXR   A,C
        state.flags.a = cpu.addSubByte(state, state.flags.a, state.flags.c, -1) & 0xff;
        state.cycles += 4;
        break;

      case 0x92:      							                                // DCXR   A,D
        state.flags.a = cpu.addSubByte(state, state.flags.a, state.flags.d, -1) & 0xff;
        state.cycles += 4;
        break;

      case 0x93:      							                                // DCXR   A,E
        state.flags.a = cpu.addSubByte(state, state.flags.a, state.flags.e, -1) & 0xff;
        state.cycles += 4;
        break;

      case 0x94:      							                                // DCXR   A,H
        state.flags.a = cpu.addSubByte(state, state.flags.a, state.flags.h, -1) & 0xff;
        state.cycles += 4;
        break;

      case 0x95:      							                                // DCXR   A,L
        state.flags.a = cpu.addSubByte(state, state.flags.a, state.flags.l, -1) & 0xff;
        state.cycles += 4;
        break;

      case 0x96:      							                                // DCXR   A,(HL)
        var offset;
        if ((state.db.nextOpIReg === "IX") || (state.db.nextOpIReg === "IY")) {
          offset = cpu.getFlags(state, state.db.nextOpIReg.toLowerCase());
        } else {
          offset = cpu.getFlags(state, "hl");
        }
        state.flags.a = cpu.addSubByte(state, state.flags.a, (cpu.readByte(state, offset)), -1) & 0xff;
        state.cycles += 7;
        break;

      case 0x97:      							                                // DCXR   A,A
        state.flags.a = cpu.addSubByte(state, state.flags.a, state.flags.a, -1) & 0xff;
        state.cycles += 4;
        break;

      case 0x98:      							                                // DEXR   A,B
        state.flags.a = cpu.addSubWithCarryByte(state, state.flags.a, state.flags.b, -1) & 0xff;
        state.cycles += 4;
        break;

      case 0x99:      							                                // DEXR   A,C
        state.flags.a = cpu.addSubWithCarryByte(state, state.flags.a, state.flags.c, -1) & 0xff;
        state.cycles += 4;
        break;

      case 0x9a:      							                                // DEXR   A,D
        state.flags.a = cpu.addSubWithCarryByte(state, state.flags.a, state.flags.D, -1) & 0xff;
        state.cycles += 4;
        break;

      case 0x9b:      							                                // DEXR   A,E
        state.flags.a = cpu.addSubWithCarryByte(state, state.flags.a, state.flags.e, -1) & 0xff;
        state.cycles += 4;
        break;

      case 0x9c:      							                                // DEXR   A,H
        state.flags.a = cpu.addSubWithCarryByte(state, state.flags.a, state.flags.h, -1) & 0xff;
        state.cycles += 4;
        break;

      case 0x9d:      							                                // DEXR   A,L
        state.flags.a = cpu.addSubWithCarryByte(state, state.flags.a, state.flags.l, -1) & 0xff;
        state.cycles += 4;
        break;

      case 0x9e:      							                                // DEXR   A,(HL)
        var offset;
        if ((state.db.nextOpIReg === "IX") || (state.db.nextOpIReg === "IY")) {
          offset = cpu.getFlags(state, state.db.nextOpIReg.toLowerCase());
        } else {
          offset = cpu.getFlags(state, "hl");
        }
        state.flags.a = cpu.addSubByte(state, state.flags.a, (cpu.readByte(state, offset)), -1) & 0xff;
        state.cycles += 7;
        break;

      case 0x9f:      							                                // DEXR   A,A
        state.flags.a = cpu.addSubWithCarryByte(state, state.flags.a, state.flags.a, -1) & 0xff;
        state.cycles += 4;
        break;

      case 0xa0:      							                                // ANDR   A,B
        state.flags.a = cpu.operandByte(state, state.flags.a, state.flags.b, "&") & 0xff;
        state.cycles += 4;
        break;

      case 0xa1:      							                                // ANDR   A,C
        state.flags.a = cpu.operandByte(state, state.flags.a, state.flags.c, "&") & 0xff;
        state.cycles += 4;
        break;

      case 0xa2:      							                                // ANDR   A,D
        state.flags.a = cpu.operandByte(state, state.flags.a, state.flags.d, "&") & 0xff;
        state.cycles += 4;
        break;

      case 0xa3:      							                                // ANDR   A,E
        state.flags.a = cpu.operandByte(state, state.flags.a, state.flags.e, "&") & 0xff;
        state.cycles += 4;
        break;

      case 0xa4:      							                                // ANDR   A,H
        state.flags.a = cpu.operandByte(state, state.flags.a, state.flags.h, "&") & 0xff;
        state.cycles += 4;
        break;

      case 0xa5:      							                                // ANDR   A,L
        state.flags.a = cpu.operandByte(state, state.flags.a, state.flags.l, "&") & 0xff;
        state.cycles += 4;
        break;

      case 0xa6:      							                                // ANDR   A,(HL)
        var offset;
        if ((state.db.nextOpIReg === "IX") || (state.db.nextOpIReg === "IY")) {
          offset = cpu.getFlags(state, state.db.nextOpIReg.toLowerCase());
        } else {
          offset = cpu.getFlags(state, "hl");
        }
        state.flags.a = cpu.operandByte(state, state.flags.a, (cpu.readByte(state, offset)), "&") & 0xff;
        state.cycles += 7;
        break;

      case 0xa7:      							                                // ANDR   A,A
        state.flags.a = cpu.operandByte(state, state.flags.a, state.flags.a, "&") & 0xff;
        state.cycles += 4;
        break;

      case 0xa8:      							                                // XORR   A,B
        state.flags.a = cpu.operandByte(state, state.flags.a, state.flags.b, "^") & 0xff;
        state.cycles += 4;
        break;

      case 0xa9:      							                                // XORR   A,C
        state.flags.a = cpu.operandByte(state, state.flags.a, state.flags.c, "^") & 0xff;
        state.cycles += 4;
        break;

      case 0xaa:      							                                // XORR   A,D
        state.flags.a = cpu.operandByte(state, state.flags.a, state.flags.d, "^") & 0xff;
        state.cycles += 4;
        break;

      case 0xab:      							                                // XORR   A,E
        state.flags.a = cpu.operandByte(state, state.flags.a, state.flags.e, "^") & 0xff;
        state.cycles += 4;
        break;

      case 0xac:      							                                // XORR   A,H
        state.flags.a = cpu.operandByte(state, state.flags.a, state.flags.h, "^") & 0xff;
        state.cycles += 4;
        break;

      case 0xad:      							                                // XORR   A,L
        state.flags.a = cpu.operandByte(state, state.flags.a, state.flags.l, "^") & 0xff;
        state.cycles += 4;
        break;

      case 0xae:      							                                // XORR   A,(HL)
        var offset;
        if ((state.db.nextOpIReg === "IX") || (state.db.nextOpIReg === "IY")) {
          offset = cpu.getFlags(state, state.db.nextOpIReg.toLowerCase());
        } else {
          offset = cpu.getFlags(state, "hl");
        }
        state.flags.a = cpu.operandByte(state, state.flags.a, (cpu.readByte(state, offset)), "^") & 0xff;
        state.cycles += 7;
        break;

      case 0xaf:      							                                // XORR   A,A
        state.flags.a = cpu.operandByte(state, state.flags.a, state.flags.a, "^") & 0xff;
        state.cycles += 4;
        break;

      case 0xb0:      							                                // ORR   A,B
        state.flags.a = cpu.operandByte(state, state.flags.a, state.flags.b, "|") & 0xff;
        state.cycles += 4;
        break;

      case 0xb1:      							                                // ORR   A,C
        state.flags.a = cpu.operandByte(state, state.flags.a, state.flags.c, "|") & 0xff;
        state.cycles += 4;
        break;

      case 0xb2:      							                                // ORR   A,D
        state.flags.a = cpu.operandByte(state, state.flags.a, state.flags.d, "|") & 0xff;
        state.cycles += 4;
        break;

      case 0xb3:      							                                // ORR   A,E
        state.flags.a = cpu.operandByte(state, state.flags.a, state.flags.e, "|") & 0xff;
        state.cycles += 4;
        break;

      case 0xb4:      							                                // ORR   A,H
        state.flags.a = cpu.operandByte(state, state.flags.a, state.flags.h, "|") & 0xff;
        state.cycles += 4;
        break;

      case 0xb5:      							                                // ORR   A,L
        state.flags.a = cpu.operandByte(state, state.flags.a, state.flags.l, "|") & 0xff;
        state.cycles += 4;
        break;

      case 0xb6:      							                                // ORR   A,(HL)
        var offset;
        if ((state.db.nextOpIReg === "IX") || (state.db.nextOpIReg === "IY")) {
          offset = cpu.getFlags(state, state.db.nextOpIReg.toLowerCase());
        } else {
          offset = cpu.getFlags(state, "hl");
        }
        state.flags.a = cpu.operandByte(state, state.flags.a, (cpu.readByte(state, offset)), "|") & 0xff;
        state.cycles += 7;
        break;

      case 0xb7:      							                                // ORR   A,A
        state.flags.a = cpu.operandByte(state, state.flags.a, state.flags.a, "|") & 0xff;
        state.cycles += 4;
        break;

      // The next 8 ops do not store their result anywhere, but they do modify the F register
      case 0xb8:      							                                // SUBX   A,B
        cpu.addSubByte(state, state.flags.a, state.flags.b, -1) & 0xff;
        state.cycles += 4;
        break;

      case 0xb9:      							                                // SUBX   A,C
        cpu.addSubByte(state, state.flags.a, state.flags.c, -1) & 0xff;
        state.cycles += 4;
        break;

      case 0xba:      							                                // SUBX   A,D
        cpu.addSubByte(state, state.flags.a, state.flags.d, -1) & 0xff;
        state.cycles += 4;
        break;

      case 0xbb:      							                                // SUBX   A,E
        cpu.addSubByte(state, state.flags.a, state.flags.e, -1) & 0xff;
        state.cycles += 4;
        break;

      case 0xbc:      							                                // SUBX   A,H
        cpu.addSubByte(state, state.flags.a, state.flags.h, -1) & 0xff;
        state.cycles += 4;
        break;

      case 0xbd:      							                                // SUBX   A,L
        cpu.addSubByte(state, state.flags.a, state.flags.l, -1) & 0xff;
        state.cycles += 4;
        break;

      case 0xbe:      							                                // ORR   A,(HL)
        var offset;
        if ((state.db.nextOpIReg === "IX") || (state.db.nextOpIReg === "IY")) {
          offset = cpu.getFlags(state, state.db.nextOpIReg.toLowerCase());
        } else {
          offset = cpu.getFlags(state, "hl");
        }
        state.flags.a = cpu.addSubByte(state, state.flags.a, (cpu.readByte(state, offset)), -1) & 0xff;
        state.cycles += 7;
        break;

      case 0xbf:      							                                // SUBX   A,A
        cpu.addSubByte(state, state.flags.a, state.flags.a, -1) & 0xff;
        state.cycles += 4;
        break;

      case 0xc0:      							                                // RETNZ
        if (state.flags.f & fFlags.zero) {
          state.cycles += 5;
        } else {
          state.flags.pc = cpu.pop(state);
          state.cycles += 11;
        }
        break;

      case 0xc1:      							                                // POPR    BC
        var ret = cpu.splitBytes(cpu.pop(state));
				state.flags.b = ret[1];
				state.flags.c = ret[0];
        state.cycles += 10;
        break;

      case 0xc2:      							                                // JMPNZ (word)
        if (state.flags.f & fFlags.zero) {
          state.flags.pc += 2;
          state.flags.pc &= 0xffff;
          state.cycles += 10;
        } else {
          state.flags.pc = ((opCode[2] << 8) | opCode[1]) & 0xffff;
          state.cycles += 15;
        }
        break;

      case 0xc3:      							                                // JMP (word)
        state.flags.pc = ((opCode[2] << 8) | opCode[1]) & 0xffff;
        state.cycles += 10;
        break;

      case 0xc4:      							                                // PUSHNZ (word)
        if (state.flags.f & fFlags.zero) {
          state.flags.pc = (state.flags.pc + 2) & 0xFFFF;
          state.cycles += 11;
        } else {
          var jumpTo = ((opCode[2] << 8) | opCode[1]) & 0xffff;
          state.flags.pc += 2;
          state.flags.pc &= 0xffff;
          cpu.push(state, state.flags.pc);

          state.flags.pc = jumpTo;
          state.cycles += 18;
        }
        break;

      case 0xc5:      							                                // PUSH BC
        var bc = cpu.getFlags(state, "bc");
        cpu.push(state, bc);

        state.cycles += 11;
        break;

      case 0xc6:      							                                // INXR   A,byte
        state.flags.a = cpu.addSubByte(state, state.flags.a, opCode[1]) & 0xff;
        state.flags.pc = (state.flags.pc + 1) & 0xffff;
        state.cycles += 7;
        break;

      case 0xc7:      							                                // RST 00
        state.flags.pc += 2;
        state.flags.pc &= 0xffff;
        cpu.resetN(state, 0);
        state.cycles += 11;
        break;

      case 0xc8:      							                                // RETZ
        if (state.flags.f & fFlags.zero) {
          state.flags.pc =  cpu.pop(state);
          state.cycles += 11;
        } else {
          state.cycles += 5;
        }
        break;

      case 0xc9:      							                                // RET
        state.flags.pc = cpu.pop(state);
        state.cycles += 10;
        break;

      case 0xca:      							                                // JMPZ (word)
        if (state.flags.f & fFlags.zero) {
          state.flags.pc = (opCode[1] | (opCode[2] << 8)) & 0xffff;
          state.cycles += 15;
        } else {
          state.flags.pc += 2;
          state.flags.pc &= 0xffff;
          state.cycles += 10;
        }
        break;

      case 0xcb: state.cycles += 4; break;	                    // NOP

      case 0xcc:      							                                  // CALLZ word
        if (state.flags.f & fFlags.zero) {
          var	ret = (opCode[1] | (opCode[2] << 8)) & 0xffff;
          state.flags.pc += 2;
          state.flags.pc &= 0xffff;
          cpu.push(state, state.flags.pc);
          state.flags.pc = ret;
          state.cycles += 18;
        } else {
          state.flags.pc += 2;
          state.flags.pc &= 0xffff;
          state.cycles += 11;
        }
        break;

      case 0xcd:      							                                // CALL (word)
        var	ret = (opCode[1] | (opCode[2] << 8)) & 0xffff;
        state.flags.pc += 2;
        state.flags.pc &= 0xffff;
        cpu.push(state, state.flags.pc);
        state.flags.pc = ret;
        state.cycles += 17;
        break;

      case 0xce:      							                                // ICXR   A,byte
        state.flags.a = cpu.addSubWithCarryByte(state, state.flags.a, opCode[1]) & 0xff;
        state.flags.pc = (state.flags.pc + 1) & 0xffff;
        state.cycles += 4;
        break;

      case 0xcf:      							                                // RST 08
        state.flags.pc += 2;
        state.flags.pc &= 0xffff;
        cpu.resetN(state, 0x08 * 8);
        state.cycles += 11;
        break;

      case 0xd0:      							                                // RETNC
        if (state.flags.f & fFlags.carry) {
          state.cycles += 5;
        } else {
          state.flags.pc = cpu.readWord(state, state.flags.sp);
          state.flags.sp += 2 & 0xffff
          state.cycles += 11;
        }
        break;

      case 0xd1:      							                                // POPR    DE
        var ret = cpu.splitBytes(cpu.pop(state));
        state.flags.d = ret[1];
        state.flags.e = ret[0];
        state.cycles += 10;
        break;

      case 0xd2:      							                                // JMPNC (word)
        if (state.flags.f & fFlags.carry) {
          state.flags.pc += 2;
          state.flags.pc &= 0xffff;
          state.cycles += 10;
        } else {
          state.flags.pc = ((opCode[2] << 8) | opCode[1]) & 0xffff;
          state.cycles += 15;
        }
      break;

      case 0xd3:      							                                // HWOUT byte A
        cpu.writeHWPort(state, opCode[1], state.flags.a);
        state.flags.pc = (state.flags.pc + 1) & 0xffff;
        state.cycles += 10;
        break;

      case 0xd4:      							                                // CALLNZ (word)
        if (state.flags.f & fFlags.carry) {
          state.flags.pc = (state.flags.pc + 2) & 0xFFFF;
          state.cycles += 11;
        } else {
          var jumpTo = ((opCode[2] << 8) | opCode[1]) & 0xffff;
          state.flags.pc += 2;
          state.flags.pc &= 0xffff;
          cpu.push(state, state.flags.pc);
          state.flags.pc = jumpTo;
          state.cycles += 18;
        }
        break;

      case 0xd5:      							                                // PUSH DE
        var de = cpu.getFlags(state, "de");
        cpu.push(state, de);

        state.cycles += 11;
        break;

      case 0xd6:      							                                // DCXR   A,byte
        state.flags.a = cpu.addSubByte(state, state.flags.a, opCode[1], -1) & 0xff;
        state.flags.pc = (state.flags.pc + 1) & 0xffff;
        state.cycles += 7;
        break;

      case 0xd7:      							                                // RST 10
        state.flags.pc += 2;
        state.flags.pc &= 0xffff;
        cpu.resetN(state, 0x10 * 8);
        state.cycles += 11;
        break;

      case 0xd8:      							                                // RETC
        if (state.flags.f & fFlags.carry) {
          state.flags.pc = cpu.pop(state);
          state.cycles += 11;
        } else {
          state.cycles += 5;
        }
        break;

      case 0xd9: state.cycles += 4; break;	                  // NOP

      case 0xda:      							                                // JMPC (word)
        if (state.flags.f & fFlags.carry) {
          state.flags.pc = ((opCode[2] << 8) | opCode[1]) & 0xffff;
          state.cycles += 15;
        } else {
          state.flags.pc += 2;
          state.flags.pc &= 0xffff;
          state.cycles += 10;
        }
        break;

      case 0xdb:      							                                // HWIN byte
        state.flags.a = cpu.readHWPort(state, opCode[1]);
        state.flags.pc = (state.flags.pc + 1) & 0xffff;
        state.cycles += 10;
        break;

      case 0xdc:      							                                  // CALLC (word)
        if (state.flags.f & fFlags.carry) {
          var	ret = (opCode[1] | (opCode[2] << 8)) & 0xffff;
          state.flags.pc += 2;
          state.flags.pc &= 0xffff;
          cpu.push(state, state.flags.pc);

          state.flags.pc = ret;
          state.cycles += 18;
        } else {
          state.flags.pc += 2 & 0xffff;
          state.cycles += 10;
        }
        break;

      case 0xdd:      							                                  // NEXTOP IX
        state.db.nextOpIReg = "IX";
        cpu.emulate8080OP(state);
        state.cycles += 10;
        break;

      case 0xde:      							                                // DEXR   A,byte
        state.flags.a = cpu.addSubWithCarryByte(state, state.flags.a, opCode[1], -1) & 0xff;
        state.flags.pc = (state.flags.pc + 1) & 0xffff;
        state.cycles += 7;
        break;


      case 0xdf:      							                                // RST 18
        state.flags.pc += 2;
        state.flags.pc &= 0xffff;
        cpu.resetN(state, 0x18 * 8);
        state.cycles += 11;
        break;

      case 0xe0:      							                                // RETNP
        if (state.flags.f & fFlags.parity) {
          state.cycles += 5;
        } else {
          state.flags.pc = cpu.readWord(state, state.flags.sp);
          state.flags.sp += 2 & 0xffff
          state.cycles += 11;
        }
        break;

      case 0xe1:      							                                // POPR    HL
        if ((state.db.nextOpIReg === "IX") || (state.db.nextOpIReg === "IY")) {
          state.flags[state.db.nextOpIReg.toLowerCase()] = cpu.pop(state);
        } else {
          var ret = cpu.splitBytes(cpu.pop(state));
          state.flags.h = ret[1];
          state.flags.l = ret[0];
        }

        state.cycles += 10;
        break;

      case 0xe2:      							                                // JMPNP (word)
        if (state.flags.f & fFlags.parity) {
          state.flags.pc += 2;
          state.flags.pc &= 0xffff;
          state.cycles += 10;
        } else {
          state.flags.pc = ((opCode[2] << 8) | opCode[1]) & 0xffff;
          state.cycles += 15;
        }
      break;

      case 0xe3:                                                      //  XCHM
        if ((state.db.nextOpIReg === "IX") || (state.db.nextOpIReg === "IY")) {
          var tmp = state.flags.sp;
          cpu.writeWord(state, state.flags.sp, cpu.getFlags(state, state.db.nextOpIReg.toLowerCase()));
          state.flags[state.db.nextOpIReg.toLowerCase()] = tmp & 0xffff;
        } else {
          var spv = cpu.splitBytes(cpu.readWord(state, state.flags.sp));
          cpu.writeWord(state, state.flags.sp, cpu.getFlags(state, "hl"));
          state.flags.h = spv[1];
          state.flags.l = spv[0];
        }
        state.cycles += 4;
        break;

      case 0xe4:      							                                // CALLNP (word)
        if (state.flags.f & fFlags.parity) {
          state.flags.pc = (state.flags.pc + 2) & 0xFFFF;
          state.cycles += 11;
        } else {
          var jumpTo = ((opCode[2] << 8) | opCode[1]) & 0xffff;
          state.flags.pc += 2;
          state.flags.pc &= 0xffff;
          cpu.push(state, state.flags.pc);
          state.flags.pc = jumpTo;
          state.cycles += 18;
        }
        break;

      case 0xe5:      							                                //PUSH   HL
      var reg;
        if ((state.db.nextOpIReg === "IX") || (state.db.nextOpIReg === "IY")) {
          reg = cpu.getFlags(state, state.db.nextOpIReg.toLowerCase());
        } else {
          reg = cpu.getFlags(state, "hl");
        }
        cpu.push(state, reg);
        state.cycles += 11;
        break;

      case 0xe6:      							                                // ANDR   A,byte
        state.flags.a = cpu.operandByte(state, state.flags.a, opCode[1], "&") & 0xff;
        state.flags.pc = (state.flags.pc + 1) & 0xffff;
        state.cycles += 7;
        break;

      case 0xe7:      							                                // RST 20
        state.flags.pc += 2;
        state.flags.pc &= 0xffff;
        cpu.resetN(state, 0x20 * 8);
        state.cycles += 11;
        break;

      case 0xe8:      							                                // RETP
        if (state.flags.f & fFlags.parity) {
          state.flags.pc = cpu.pop(state);
          state.cycles += 11;
        } else {
          state.cycles += 5;
        }
        break;

      case 0xe9:      							                                // JMP HL
        if ((state.db.nextOpIReg === "IX") || (state.db.nextOpIReg === "IY")) {
          state.flags.pc = cpu.getFlags(state, state.db.nextOpIReg.toLowerCase());
        } else {
          state.flags.pc = cpu.getFlags(state, "hl");
        }
        state.cycles += 4;
        break;

      case 0xea:      							                                // JMPP (word)
        if (state.flags.f & fFlags.parity) {
          state.flags.pc = ((opCode[2] << 8) | opCode[1]) & 0xffff;
          state.cycles += 15;
        } else {
          state.flags.pc += 2;
          state.flags.pc &= 0xffff;
          state.cycles += 10;
        }
        break;

      case 0xeb:      							                                // XCHR
				var register1 = state.flags.d;
				var register2 = state.flags.e;
				state.flags.d = state.flags.h & 0xff;
				state.flags.e = state.flags.l & 0xff;
				state.flags.h = register1 & 0xff;
        state.flags.l = register2 & 0xff;
        state.cycles += 4;
        break;

      case 0xec:      							                                // CALLP (word)
        if (state.flags.f & fFlags.parity) {
          var	ret = (opCode[1] | (opCode[2] << 8)) & 0xffff;
          state.flags.pc += 2;
          state.flags.pc &= 0xffff;
          cpu.push(state, state.flags.pc);

          state.flags.pc = ret;
          state.cycles += 18;
        } else {
          state.flags.pc += 2;
          state.flags.pc &= 0xffff;
          state.cycles += 10;
        }
        break;

      case 0xed: state.cycles += 4; break;	                          // NOP

      case 0xee:      							                                // XORR   A,byte
        state.flags.a = cpu.operandByte(state, state.flags.a, opCode[1], "^") & 0xff;
        state.flags.pc = (state.flags.pc + 1) & 0xffff;
        state.cycles += 7;
        break;

      case 0xef:      							                                // RST 28
        state.flags.pc += 2;
        state.flags.pc &= 0xffff;
        cpu.resetN(state, 0x28 * 8);
        state.cycles += 11;
        break;

      case 0xf0:      							                                // RETNS
        if (state.flags.f & fFlags.sign) {
          state.cycles += 5;
        } else {
          state.flags.pc = cpu.pop(state);
          state.cycles += 11;
        }
        break;

      case 0xf1:      							                                // POPR    AF
        var ret = cpu.splitBytes(cpu.pop(state));
        state.flags.a = ret[1];
        state.flags.f = ret[0];
        state.cycles += 10;
        break;

      case 0xf2:      							                                // JMPNS (word)
        if (state.flags.f & fFlags.sign) {
          state.flags.pc += 2;
          state.flags.pc &= 0xffff;
          state.cycles += 10;
        } else {
          state.flags.pc = ((opCode[2] << 8) | opCode[1]) & 0xffff;
          state.cycles += 15;
        }
      break;

      case 0xf3:      							                                // DIF
        state.flags.f &= ~fFlags.interrupt & 0xff;
        state.cycles += 4;
        break;

      case 0xf4:      							                                // CALLS (word)
        if (state.flags.f & fFlags.sign) {
          var	ret = (opCode[1] | (opCode[2] << 8)) & 0xffff;
          state.flags.pc += 2;
          state.flags.pc &= 0xffff;
          cpu.push(state, ret);

          state.flags.pc = (opCode[1] | (opCode[2] << 8)) & 0xffff;
          state.cycles += 18;
        } else {
          state.flags.pc += 2;
          state.flags.pc &= 0xffff;
          state.cycles += 11;
        }
        break;

      case 0xf5:      							                                // PUSH AF
        var af = cpu.getFlags(state, "af");
        cpu.push(state, af);
        state.cycles += 11;
        break;

      case 0xf6:      							                                // ORR   A,byte
        state.flags.a = cpu.operandByte(state, state.flags.a, opCode[1], "|") & 0xff;
        state.flags.pc = (state.flags.pc + 1) & 0xffff;
        state.cycles += 7;
        break;

      case 0xf7:      							                                // RST 30
        state.flags.pc += 2;
        state.flags.pc &= 0xffff;
        cpu.resetN(state, 0x30 * 8);
        state.cycles += 11;
        break;

      case 0xf8:      							                                // RETS(word)
        if (state.flags.f & fFlags.sign) {
          state.flags.pc = cpu.pop(state);
          state.cycles += 11;
        } else {
          state.cycles += 5;
        }
        break;

      case 0xf9:      							                                // LD2R
        state.flags.sp = (state.flags.h << 8) | (state.flags.l) & 0xffff;
        state.cycles += 6;
        break;

      case 0xfa:      							                                // JMPS (word)
        if (state.flags.f & fFlags.sign) {
          state.flags.pc = ((opCode[2] << 8) | opCode[1]) & 0xffff;
          state.cycles += 15;
        } else {
          state.flags.pc += 2;
          state.flags.pc &= 0xffff;
          state.cycles += 10;
        }
        break;

      case 0xfb:      							                                // SIF
        state.flags.f |= fFlags.interrupt;
        state.cycles += 4;
        break;

      case 0xfc:      							                                // CALLS (word)
        if (state.flags.f & fFlags.sign) {
          var jumpTo = ((opCode[2] << 8) | opCode[1]) & 0xffff;
          state.flags.pc += 2;
          state.flags.pc &= 0xffff;
          cpu.push(state, state.flags.pc);
          state.flags.pc = jumpTo;
          state.cycles += 18;
        } else {
          state.flags.pc = (state.flags.pc + 2) & 0xffff;
          state.cycles += 11;
        }
        break;

      case 0xfd:      							                                  // NEXTOP IX
        state.db.nextOpIReg = "IY";
        cpu.emulate8080OP(state);
        state.cycles += 10;
        break;

      case 0xfe:      							                                // DCXR   A,byte
        cpu.addSubByte(state, state.flags.a, opCode[1], -1) & 0xff;
        state.flags.pc = (state.flags.pc + 1) & 0xffff;
        state.cycles += 7;
        break;

      case 0xff:      							                                // RST 38
        state.flags.pc += 2;
        state.flags.pc &= 0xffff;
        cpu.resetN(state, 0x38 * 8);
        state.cycles += 11;
        break;

      default:
        if (typeof(state.warningCb) === 'function') { state.warningCb('emulate8080OP', state, ["Warning: Instruction Out Of Bounds: ", opCode[0] != null ? opCode[0].toString(16) : '']); }
        cpu.unimplementedInstruction(state);
    }

    state.db.executionCount++;

    state.db.nextOpIReg = "";

    if (currentPC === state.flags.pc) {
      return 1;
    }

    state.db.totalCPUCycles += (state.cycles - preCycleChange);
    state.lastOpCycle = (state.cycles - preCycleChange);
    state.modeClock = (state.modeClock + 1) & 0xffff;

    cpu.interruptCheck(state);

    return 0;
  }

  cpu.interruptCheck = function(state) {
    if (state.cycles < 16667) {
      return;
    }

    state.db.cycleRollover = true;
    state.cycles -= 16667;

    if (state.pInterrupt === 0x10) {
      state.pInterrupt = 0x08;
    } else {
      state.pInterrupt = 0x10;
    }

    if (state.flags.f & fFlags.interrupt) {
      // We need to push the current PC to (SP) so we can return after executing the interrupt.
      cpu.push(state, state.flags.pc);

      state.flags.pc = state.pInterrupt;
      if (typeof(state.cInterrupt) === "function") {
        state.cInterrupt(state, state.pInterrupt);
      }
    }
  };

  cpu.interruptRequest = function() {

  };

  cpu.push = function(state, value) {
    state.flags.sp -= 2;
    state.flags.sp &= 0xffff;
    cpu.writeWord(state, state.flags.sp, value);
  }

  cpu.pop = function(state, update = false) {
    var ret = cpu.readWord(state, state.flags.sp);
    state.flags.sp += 2;
    state.flags.sp &= 0xffff;
    if (update) {
      state.flags.pc = ret;
    }

    return ret;
  }

  cpu.readHWPort = function(state, portCh) {
    if (typeof(state.hwPortHook) === 'function') {
      state.hwPortHook('preread', state, portCh);
    }

    var portState = state.hwIntPorts[portCh & 0xff] & 0xff;

    if (typeof(state.hwPortHook) === 'function') {
      var hookResponse = state.hwPortHook('postread', state, portCh);
      portState = (hookResponse != null ? hookResponse : portState);
    }

    return portState;
  }

  cpu.writeHWPort = function(state, portCh, value) {
    if (typeof(state.hwPortHook) === 'function') {
      state.hwPortHook('prewrite', state, portCh, value);
    }

    portState = value & 0xff;

    if (typeof(state.hwPortHook) === 'function') {
      var hookResponse = state.hwPortHook('postwrite', state, portCh, value);
      portState = (hookResponse != null ? hookResponse : portState);
    }

    state.hwIntPorts[portCh & 0xff] = portState;
  };

  cpu.unimplementedInstruction = function(cpuState) {
    if (typeof(cpuState.warningCb) === 'function') { cpuState.warningCb('unimplementedInstruction', cpuState, ["Unimplmented instruction.", "Debug info: ", cpuState.disassemble8080OP(cpuState, cpuState.flags.pc - 1)]); }
    // The emulate function returns 1 if the instruction is unimplemented upon execution.
    // We need to rollback the PC so the state can be correctly handled by the function calling emulate8080OP().
    cpuState.flags.pc--;
  };

  cpu.resetN = function(cpuState, location) {
    cpu.push(cpuState, cpuState.flags.pc);
    cpuState.flags.pc = location;
  };

  cpu.romWriteCheck = function(state, writeAddr) {
    if (writeAddr < 0x2000 || writeAddr > 0xffff) {
      if (typeof(state.warningCb) === 'function') { state.warningCb('romWriteCheck', state, [
        "This emulator allows writing to ROM, but if you are receiving this message it means that the CPU is writing to the ROM. This will in most cases break the process and lead to unknown states. Please check your ASM.",
        "Warning: Writing to ROM: ",
        cpu.disassemble8080OP(state, state.flags.pc - 1)
      ]); }
    }
  };

  cpu.splitBytes = function(value) {
    var ret = [];
    ret[1] = ((value & 0xff00) >> 8) & 0xff;
    ret[0] = value & 0xff;

    return ret;
  };

  cpu.readByte = function(state, address) {
    var res = state.memory[address];

    if (res < 0x00 || res > 0xff || res === "" || res == null) {
      if (typeof(state.warningCb) === 'function') { state.warningCb('readByte', state, [
        "Warning: Value is outside of valid range: '" + res + "' This is probably a bug.",
        "A valid range will be returned if one can be recovered.",
        "Debug info: ",
        cpu.disassemble8080OP(state, state.flags.pc - 1),
        "Value info: Typeof: " + typeof(res) + "   < 0x00: " + res < 0x00 + "   > 0xff: " + res > 0xff + "   Empty string: " + res == "" + "   null: " + res == null
      ]); }
    }

    return state.memory[address] & 0xff;
  };

  cpu.readWord = function(state, address) {
    return (cpu.readByte(state, (address + 1) & 0xffff) << 8) | cpu.readByte(state, address);
  };

  cpu.writeByte = function(state, address, value) {
    cpu.romWriteCheck(state, address);

    if (typeof(state.memoryUpdateCb) === "function") {
      state.memoryUpdateCb(address, value);
    }

    if (address >= 0xffff) {
      if (typeof(state.warningCb) === 'function') { state.warningCb('writeByte', state, [
        "You are writing into out of bounds memory. The emulator will allow this, but it generally indicates something is wrong.",
        "Debug info: ",
        cpu.disassemble8080OP(state, state.flags.pc - 1)
      ]); }
    }

    state.memory[address] = value & 0xff;
  };

  cpu.writeWord = function(state, address, value) {
    cpu.writeByte(state, address, (value & 0xff));
    cpu.writeByte(state, (address + 1) & 0xffff, ((value >> 8) & 0xff));
  };

  cpu.addSubByte = function(state, lhv, rhv, addSub = 1) {
    var byteRes;

    if (addSub === 1) {
      byteRes = lhv + rhv;
    } else {
      byteRes = lhv - rhv;
    }

    var res = (byteRes & 0xff);
    if (res % 2) {
      state.flags.f &= ~fFlags.parity & 0xff;
    } else {
      state.flags.f |= fFlags.parity;
    }

    if (byteRes & 0x80) {
      state.flags.f |= fFlags.sign;
    } else {
      state.flags.f &= ~fFlags.sign & 0xFF;
    }

    if (res) {
      state.flags.f &= ~fFlags.zero & 0xff;
    } else {
      state.flags.f |= fFlags.zero;
    }

    if (((rhv ^ byteRes) ^ lhv) & 0x10) {
      state.flags.f |= fFlags.halfcarry;
    } else {
      state.flags.f &= ~fFlags.halfcarry & 0xff;
    }

    if (byteRes >= 0x100 || byteRes < 0) {
      state.flags.f |= fFlags.carry;
    } else {
      state.flags.f &= ~fFlags.carry & 0xff;
    }

    return res;
  };

  cpu.addSubWithCarryByte = function(state, lhv, rhv, addSub = 1) {

    var byteRes;

    if (state.flags.f & fFlags.carry) {
      if (addSub === 1) {
        rhv++;
      } else {
        rhv--;
      }
    }

    if (addSub === 1) {
      byteRes = lhv + rhv;
    } else {
      byteRes = lhv - rhv;
    }

    var res = (byteRes & 0xff);
    if (res % 2) {
      state.flags.f &= ~fFlags.parity & 0xff;
    } else {
      state.flags.f |= fFlags.parity;
    }

    if (byteRes & 0x80) {
      state.flags.f |= fFlags.sign;
    } else {
      state.flags.f &= ~fFlags.sign & 0xff;
    }

    if (res) {
      state.flags.f &= ~fFlags.zero & 0xff;
    } else {
      state.flags.f |= fFlags.zero;
    }

    if (((rhv ^ byteRes) ^ lhv) & 0x10) {
      state.flags.f |= fFlags.halfcarry;
    } else {
      state.flags.f &= ~fFlags.halfcarry & 0xff;
    }

    if (byteRes >= 0x100 || byteRes < 0) {
      state.flags.f |= fFlags.carry;
    } else {
      state.flags.f &= ~fFlags.carry & 0xff;
    }

    return res;
  };

  cpu.operandByte = function(state, lhv, rhv, operand) {
    var operandRes

    if (operand === "&") {
      operandRes = lhv & rhv;
    } else if (operand === "|") {
      operandRes = lhv | rhv;
    } else if (operand === "^") {
      operandRes = lhv ^ rhv;
    } else {
      return ;
    }

    var res = operandRes & 0xff;

    if (res % 2) {
      state.flags.f &= ~fFlags.parity & 0xff;
    } else {
      state.flags.f |= fFlags.parity;
    }

    if (operandRes & 0x80) {
      state.flags.f |= fFlags.sign;
    } else {
      state.flags.f &= ~fFlags.sign & 0xff;
    }

    if (res) {
      state.flags.f &= ~fFlags.zero & 0xff;
    } else {
      state.flags.f |= fFlags.zero;
    }

    if (operand === "&") {
      if (((lhv & 8) >> 3) | ((rhv & 8) >> 3)) {
        state.flags.f &= ~fFlags.halfcarry & 0xff;
      } else {
        state.flags.f |= fFlags.halfcarry;
      }
    }

    state.flags.f &= ~fFlags.carry & 0xff;

    if (operand === "^" || operand === "|") {
      state.flags.f &= ~fFlags.halfcarry & 0xff;
    }

    return res;

  };

  cpu.indecrementByte = function(state, value, upDown = 1) {
    var valueChange = value;

    if (upDown === 1) {
      valueChange++;
    } else {
      valueChange--;
    }

    var pz = (valueChange & 0xff);
    if (pz % 2) {
      state.flags.f &= ~fFlags.parity & 0xff;
    } else {
      state.flags.f |= fFlags.parity;
    }

    if (valueChange & 0x80) {
      state.flags.f |= fFlags.sign;
    } else {
      state.flags.f &= ~fFlags.sign & 0xff;
    }

    if (pz) {
      state.flags.f &= ~fFlags.zero & 0xff;
    } else {
      state.flags.f |= fFlags.zero;
    }

    if (((1 ^ valueChange) ^ value) & 0x10) {
      state.flags.f |= fFlags.halfcarry;
    } else {
      state.flags.f &= ~fFlags.halfcarry & 0xff;
    }

    return pz;
  };

  cpu.getFlags = function(state, flagCombo) {
    if (flagCombo === "af") {
      return ((state.flags.a << 8) | state.flags.f) & 0xffff;
    } else if (flagCombo === "bc") {
      return ((state.flags.b << 8) | state.flags.c) & 0xffff;
    } else if (flagCombo === "de") {
      return ((state.flags.d << 8) | state.flags.e) & 0xffff;
    } else if (flagCombo === "hl") {
      return ((state.flags.h << 8) | state.flags.l) & 0xffff;
    } else if (flagCombo === "ix") {
      return state.flags.ix & 0xffff;
    } else if (flagCombo === "iy") {
      return state.flags.iy & 0xffff;
    }

    if (typeof(state.warningCb) === 'function') { state.warningCb('getFlags', state, ["Invalid flag combo selected: ", flagCombo, " at: ", cpu.disassemble8080OP(state, state.flags.pc - 1)]); }
    return ;
  };

  cpu.parity = function(x, size) {
    var p = 0;
    x = (x & ((1 << size) - 1));
    for (var i = 0; i < size; i++) {
      if (x & 0x1) p++;
      x = x >> 1;
    }
    return (0 == (p & 0x1));
  };

  cpu.preCalculatedParitySize8 = function(value) {
    // Technically cpu.parity(x, 8) will produce this. I extracted the values so it doesn't have to each time.
    var parityBits = [
      1, 0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1, 0, 0, 1,
      0, 1, 1, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 1, 1, 0,
      0, 1, 1, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 1, 1, 0,
      1, 0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1, 0, 0, 1,
      0, 1, 1, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 1, 1, 0,
      1, 0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1, 0, 0, 1,
      1, 0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1, 0, 0, 1,
      0, 1, 1, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 1, 1, 0,
      0, 1, 1, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 1, 1, 0,
      1, 0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1, 0, 0, 1,
      1, 0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1, 0, 0, 1,
      0, 1, 1, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 1, 1, 0,
      1, 0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1, 0, 0, 1,
      0, 1, 1, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 1, 1, 0,
      0, 1, 1, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 1, 1, 0,
      1, 0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1, 0, 0, 1
    ];
    return parityBits[value];
  };

  cpu.getKeyBoardKeysText = function() {
    return [
      "Z80 Game Keys:",
      "     A - Left        D - Right",
      "     Spacebar - Shoot",
      "     1 - Player 1    2 - Player 2",
      "     C - Insert Coin",
      "     "
    ];
  };

  cpu.getKeyBoardKeysHooks = function(event, eventType, cpuState) {
    if (eventType === "down") {
      if (cpuCanStart) {
        if (event.key === 'a') {
          cpuState.hwIntPorts[0x01] |= 0x20;
        }
  
        if (event.key === 'd') {
          cpuState.hwIntPorts[0x01] |= 0x40;
        }
  
        if (event.key === ' ') {
          cpuState.hwIntPorts[0x01] |= 0x10;;
        }
  
        if (event.key === '1') {
          cpuState.hwIntPorts[0x01] |= 0x04;;
        }
  
        if (event.key === 'c') {
          cpuState.hwIntPorts[0x01] |= 0x01;;
        }
      }
    } else if (eventType === "up") {
      if (cpuCanStart) {
        if (event.key === 'a') {
          cpuState.hwIntPorts[0x01] &= 0xff - 0x20;
        }
  
        if (event.key === 'd') {
          cpuState.hwIntPorts[0x01] &= 0xff - 0x40;
        }
  
        if (event.key === ' ') {
          cpuState.hwIntPorts[0x01] &= 0xff - 0x10;;
        }
  
        if (event.key === '1') {
          cpuState.hwIntPorts[0x01] &= 0xff - 0x04;;
        }
  
        if (event.key === 'c') {
          cpuState.hwIntPorts[0x01] &= 0xff - 0x01;;
        }
      }
    }
  };

  return cpu;
});

if (typeof(module) !== 'undefined') {
  module.exports = cpuCore[0];
} else if (typeof define === 'function' && define.amd) {
  define([], function () {
      'use strict';
      return cpuCore;
  });
}
