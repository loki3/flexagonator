namespace Flexagonator {

  describe('makeAtomicFlexes', () => {
    it("should compose to create > and Ul", () => {
      testFormula(">", "<'",
        "a / 1 < b",
        "a 1 < / b");
      testFormula("Ul", "~ Ur ~",
        "a / [1,-2] < b",
        "a / 1 > 2 < -b");
    });

    it("should support some alternate base flexes", () => {
      // we can choose any two of ^~% in our base set of flexes
      testFormula("%", "^~",
        "a / b",
        "b / a");
      // Ur        = a / [-2,1] > b  ->  a / 1 < 2 > -b
      // Ul = ~Ur~ = a / [1,-2] < b  ->  a / 1 > 2 < -b
      // Ub = ^Ur^ = a [2,-1] > / b  ->  -a 1 > 2 < / b
      // Ux = %Ur% = a [-2,1] < / b  ->  -a 2 < 1 > / b
      testFormula("Ub", "^ Ur ^",
        "a [2,-1] > / b",
        "-a 1 > 2 < / b");
      testFormula("Ux", "^~ Ur ~^", // Ux = %Ur%
        "a [-2,1] < / b",
        "-a 2 < 1 > / b");
    });

    it("should compose to create the exchange flexes", () => {
      testFormula("Xr", "Ur> ^Ur'^",
        "a 1 > / [-3,2] > b",
        "-a [2,-1] > / 3 > -b");
      testFormula("Xl", "Ul> ^Ul'^",
        "a 4 < / [5,-6] < b",
        "-a [-4,5] < / 6 < -b");
    });

    it("should compose to create the pocket flex", () => {
      testFormula("K", "Ur >^ Ur' > Ul ^",
        "a [-2,1] > -3 > / [5,-4] > b",
        "a 1 < 2 > / [-4,3] > -5 > -b");
      testFormula("K", "Xr^ > Ul^",
        "a [-2,1] > -3 > / [5,-4] > b",
        "a 1 < 2 > / [-4,3] > -5 > -b");
    });

    it("should compose to create the pinch flex", () => {
      testFormula("P", "Ur> ^Ur'^ >> Ul> ^Ul'^ >> Ur> ^Ur'^",
        "a 1 > / [-3,2] > -4 > [6,-5] > 7 > [-9,8] > b",
        "-a [2,-1] > 3 > [-5,4] > -6 > [8,-7] > / 9 > -b");
      testFormula("P", "Xr >> Xl >> Xr",
        "a 1 > / [-3,2] > -4 > [6,-5] > 7 > [-9,8] > b",
        "-a [2,-1] > 3 > [-5,4] > -6 > [8,-7] > / 9 > -b");
    });

    it("should compose to create the inner pivot", () => {
      testFormula("Iv", "> Ul > Ul <<<< Ur' Ul' >>",
        "a 1 < 2 > / 3 > [4,[6,-5]] < b",
        "a [[-2,1],3] < 4 > / 5 > 6 < b");
    });

    it("should compose to create the half flexes", () => {
      testFormula("Hf", "K > Ul' <",
        "a [-2,1] > -3 > / [5,-4] > 6 > b",
        "a 1 < 2 > / [-4,3] > [-5,6] < b");
      testFormula("Hb", "^Hf^",
        "a 1 > [-3,2] > / -4 > [6,-5] > b",
        "a [1,-2] < [4,-3] > / 5 > 6 < b");

      testFormula("Hr", "<< Ur >>>> Xl << Ul' ~",
        "a [-2,1] > -3 > / -4 > [6,-5] > b",
        "a 1 < 2 > / [[-4,5],3] > 6 < b");
      testFormula("Hl", "^Hr^",
        "a [-2,1] > -3 > / -4 > [6,-5] > b",
        "a 1 < [4,[2,-3]] > / 5 > 6 < b");

      testFormula("Hsr", "> K < Ur << Ul' >> Ur'",
        "a 1 > [[-3,4],2] > / 5 > [-7,6] > b",
        "a [1,-2] < -3 > / [[5,-6],-4] > -7 < b");
      testFormula("Hsl", "^Hsr^",
        "a [-2, 1] > -3 > / [-6,[-4,5]] > -7 > b",
        "a 1 < [4,[2,-3]] > / 5 > [6,-7] < b");
    });

    it("should compose to create the half kite slot", () => {
      testFormula("Hkl", "> Ul Ur <<<< Ul' < Ul' >>",
        "a 1 > 2 > 3 < 4 > / 5 > [[-7,6],8] < b",
        "a [1,[3,-2]] < 4 > / 5 > 6 < 7 > 8 > b");
    });

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

    // apply a series of flexes to given input
    const atomics = makeAtomicFlexes(true);
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
            console.log('ERROR in flex', flex.fullName, ' -- ', JSON.stringify(result));
            console.log('   current pats: ', atomicPatternToString(input));
            console.log('  expected pats: ', atomicPatternToString(atomics[flex.fullName].pattern));
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
