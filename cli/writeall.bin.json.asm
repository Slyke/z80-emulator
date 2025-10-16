; Address  |   OP Code   |   Mnem    | IREG  | OREG |   P1  |  P2   | PTR | opBytes | Cycles | CondCycle  | 
   0000        (01)           LD2R              BC      0f     00             3         10       false
   0003        (3e)           LD2R               A      66                    2         07       false
   0005        (31)           LD2R              SP      0f     00             3         10       false
   0008        (02)           LD2M        A     BC                     #      1         07       false
   0009        (3c)           INCR        A      A                            1         06       false
   000a        (03)           INCR       BC     BC                            1         06       false
   000b        (33)           INCR       SP     SP                            1         06       false
   000c        (c3)            JMP                      08     00             3         10       false
