namespace Flexagonator {

  describe('makeAtomicFlexes', () => {
    it("should compose to create > and Ul", () => {
      testFormula(">", "<'", // AtomicDecomposition.>
        "a # 1 \\ b",
        "a 1 \\ # b");
      testDefinition("Ul", AtomicDecomposition.Ul);
    });

    it("should support some alternate base flexes", () => {
      // we can choose any two of ^~% in our base set of flexes
      testFormula("%", "^~",
        "a # b",
        "b # a");
      // Ur        = a # [-2,1] / b  ->  a # 1 \\ 2 / -b
      // Ul = ~Ur~ = a # [1,-2] \\ b  ->  a # 1 / 2 \\ -b
      // Ub = ^Ur^ = a [2,-1] / # b  ->  -a 1 / 2 \\ # b
      // Ux = %Ur% = a [-2,1] \\ # b  ->  -a 2 \\ 1 / # b
      testFormula("Ub", "^ Ur ^",
        "a [2,-1] / # b",
        "-a 1 / 2 \\ # b");
      testFormula("Ux", "^~ Ur ~^", // Ux = %Ur%
        "a [-2,1] \\ # b",
        "-a 2 \\ 1 / # b");
    });

    it("should compose to create the exchange flexes", () => {
      testDefinition("Xr", AtomicDecomposition.Xr);
      testDefinition("Xl", AtomicDecomposition.Xl);
      testDefinition("Xr3", AtomicDecomposition.Xr3);
      testDefinition("Xl3", AtomicDecomposition.Xl3);
      testDefinition("Xr4", AtomicDecomposition.Xr4);
      testDefinition("Xl4", AtomicDecomposition.Xl4);
    });

    it("should compose to create the pocket flex", () => {
      testDefinition("K", "Ur >^ Ur' > Ul ^");
      testDefinition("K", AtomicDecomposition.K);
    });

    it("should compose to create the pinch flex on a hexaflexagon", () => {
      testFormula("P", "Ur> ^Ur'^ >> Ul> ^Ul'^ >> Ur> ^Ur'^",
        "a 1 / # [-3,2] / -4 / [6,-5] / 7 / [-9,8] / b",
        "-a [2,-1] / 3 / [-5,4] / -6 / [8,-7] / # 9 / -b");
      testFormula("P", "Xr >> Xl >> Xr",
        "a 1 / # [-3,2] / -4 / [6,-5] / 7 / [-9,8] / b",
        "-a [2,-1] / 3 / [-5,4] / -6 / [8,-7] / # 9 / -b");
      testFormula("P", "K <<< ^K'^ >>>",
        "a 1 / [-3,2] / -4 / [6,-5] / 7 / # [-9,8] / b",
        "-a [2,-1] / 3 / [-5,4] / -6 / # [8,-7] / 9 / -b");
    });

    it("should compose to create pinch flex variations on a dodecaflexagon", () => {
      testFormula("P", "Xr >> Xl >> Xr >> Xl >> Xr >> Xl ~",
        "a 1 / # [-3,2] / -4 / [6,-5] / 7 / [-9,8] / -10 / [12,-11] / 13 / [-15,14] / -16 / [18,-17] / b",
        "-a [2,-1] / 3 / [-5,4] / -6 / [8,-7] / 9 / [-11,10] / -12 / [14,-13] / 15 / [-17,16] / # -18 / -b");
      testFormula("P3333h", "Xr >>> Xl >>> Xr >>> Xl ~",
        "a 1 / # [-3,2] / -4 / -5 / [7,-6] / 8 / 9 / [-11,10] / -12 / -13 / [15,-14] / 16 / b",
        "-a [2,-1] / 3 / 4 \\ [-6,5] / -7 / -8 \\ [10,-9] / 11 / 12 \\ [-14,13] / # -15 / -16 \\ -b");
      testFormula("P3333", "Xr >>> Xl >>> Xr >>> Xl (<)9 Xl >>> Xr >>> Xl >>> Xr (<)9",
        "a 1 / # [[-3,4],2] / 5 / 6 / [[-8,9],7] / 10 / 11 / [[-13,14],12] / 15 / 16 / [[-18,19],17] / 20 / b",
        "a [3,[1,-2]] / # 4 / 5 / [8,[6,-7]] / 9 / 10 / [13,[11,-12]] / 14 / 15 / [18,[16,-17]] / 19 / 20 / b");
      testFormula("P444h", "Xr >>>> Xl >>>> Xr",
        "a 1 / # [-3,2] / -4 / -5 / -6 / [8,-7] / 9 / 10 / 11 / [-13,12] / -14 / -15 / b",
        "-a [2,-1] / 3 / 4 \\ 5 \\ [-7,6] / -8 / -9 \\ -10 \\ [12,-11] / # 13 / 14 \\ 15 \\ -b");
      testFormula("P444", "Xr >>>> Xl >>>> Xr (<)8 Xr >>>> Xl >>>> Xr (<)8",
        "a 1 / # [[-3,4],2] / 5 / 6 / 7 / [[-9,10],8] / 11 / 12 / 13 / [[-15,16],14] / 17 / 18 / b",
        "a [3,[1,-2]] / # 4 / 5 / 6 / [9,[7,-8]] / 10 / 11 / 12 / [15,[13,-14]] / 16 / 17 / 18 / b");
      testFormula("P66", "Xr (>)6 Xl (<)6 Xl (>)6 Xr (<)6",
        "a 1 / # [[-3,4],2] / 5 / 6 / 7 / 8 / 9 / [[-11,12],10] / 13 / 14 / 15 / 16 / b",
        "a [3,[1,-2]] / # 4 / 5 / 6 / 7 / 8 / [11,[9,-10]] / 12 / 13 / 14 / 15 / 16 / b");
    });

    it("should compose to create the inner pivot", () => {
      testDefinition("Iv", AtomicDecomposition.Iv);
    });

    it("should compose to create the half flexes", () => {
      testDefinition("Hf", AtomicDecomposition.Hf);
      testDefinition("Hb", AtomicDecomposition.Hb);
      testDefinition("Hr", AtomicDecomposition.Hr);
      testDefinition("Hl", AtomicDecomposition.Hl);
      testDefinition("Hsr", AtomicDecomposition.Hsr);
      testDefinition("Hsl", AtomicDecomposition.Hsl);
    });

    it("should compose to create the half flexes specific to a hexaflexagon", () => {
      testFormula("Hh", AtomicDecomposition.Hh,
        "a 7 / 8 / # [-2,1] / -3 / -4 / [6,-5] / b",
        "-a -7 \\ [1,-8] / # 2 / 3 \\ [-5,4] / -6 / -b");
      testFormula("Ht", AtomicDecomposition.Ht,
        "a -7 / [1,-8] / # 2 / 3 / 4 / [-6,5] / b",
        "-a 7 \\ 8 / # [-2,1] / -3 \\ [5,-4] / 6 / -b");
    });

    it("should compose to create the half kite slot", () => {
      testDefinition("Hkl", AtomicDecomposition.Hkl);
    });

    it("should compose pocket flexes", () => {
      testFormula("(K^)2", "(K^)2",
        "a [[-2,3],1] / 4 / # [[-6,7],5] / b",
        "-a -1 / -2 / [[4,-5],-3] / # -6 / -7 \\ -b");
      testFormula("(K^)3", "(K^)3",
        "a [[[3,-2],-4],1] / -5 / # [[[-8,7],9],-6] / b",
        "-b -9 / -8 / [[[-5,6],4],-7] / # 3 / 2 \\ 1 / a");

      // L3 = (K^)3 (<)4 (K'^)3
      // (note that Awr is needed to handle wrapping around the ends, since 'a' & 'b' are empty,
      //  but are still needed because they tell us when the strip is a mobius band)
      testFormula("L3", "(K^)3 (<)4 (Awr)2 (K'^)3",
        "a [[[3,-2],-4],1] / -5 / # [[[-8,7],9],-6] / [[[12,-11],-13],10] / 14 / b",
        "-a -3 / [7,[-4,[-6,5]]] / [-11,[8,[10,-9]]] / # -12 / [-2,[-13,[1,-14]]] / -b");
    });

    const atomics = makeAtomicFlexes('all');

    // for flex 'name', test that 'flexes' applied to 'input' generates 'output'
    function testFormula(name: string, flexes: string, input: string, output: string, log?: boolean): void {
      const inputPattern = stringToAtomicPattern(input);
      if (isAtomicParseError(inputPattern)) {
        fail('bad input for flex ' + name + ' with error ' + JSON.stringify(inputPattern));
        return;
      }
      const result = applyFlexes(inputPattern, flexes, log);
      if (isAtomicPatternError(result)) {
        fail('failed to apply flex ' + name + ' with error ' + JSON.stringify(result));
        return;
      }
      const asString = atomicPatternToString(result);
      expect(asString).toBe(output, "flex: " + name);
    }

    // for flex 'name', test that atomics[name] properly describes the sequence in 'flexes'
    function testDefinition(name: string, flexes: string, log?: boolean): void {
      const inputPattern = atomics[name].pattern;
      const result = applyFlexes(inputPattern, flexes, log);
      if (isAtomicPatternError(result)) {
        fail('failed to apply flex ' + name + ' with error ' + JSON.stringify(result));
        return;
      }
      const asString = atomicPatternToString(result);
      const output = atomicPatternToString(atomics[name].output);
      expect(asString).toBe(output, "flex: " + name);
    }

    // apply a series of flexes to given input
    function applyFlexes(input: AtomicPattern, flexes: string, log?: boolean): AtomicPattern | AtomicPatternError {
      if (log) {
        console.log('\n---- applying flexes:', flexes, '------');
        console.log('\t\t', atomicPatternToString(input));
      }
      const list = parseFlexSequence(flexes);
      for (let flex of list) {
        const result = atomics[flex.fullName].apply(input);
        if (isAtomicPatternError(result)) {
          if (log) {
            console.log('ERROR in flex', flex.fullName, ' -- ', atomicPatternErrorToString(result));
          }
          return result;
        }
        input = result;
        if (log) {
          console.log('\t', flex.fullName, '\t', atomicPatternToString(input));
        }
      }
      return input;
    }

  });

}
