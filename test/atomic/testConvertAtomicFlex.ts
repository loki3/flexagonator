namespace Flexagonator {

  describe('convertAtomicFlex', () => {
    function checkForEqual(flex: Flex, atomicFlex: Flex): boolean {
      const leaftree = flex.input;
      const dirs = createDirs(atomicFlex.inputDirs);
      const pre = Flexagon.makeFromTree(leaftree, undefined, dirs) as Flexagon;
      const result1 = applyFlex(flex, pre);
      const result2 = applyFlex(atomicFlex, pre);
      return result1.isSameState(result2);
    }
    function createDirs(dirs: DirectionsOpt | undefined): Directions | undefined {
      if (dirs === undefined) {
        return undefined;
      }
      const bools = dirs.asRaw().map(d => d === null ? true : d);
      return Directions.make(bools);
    }
    function applyFlex(flex: Flex, flexagon: Flexagon): Flexagon {
      const result = flex.apply(flexagon);
      if (isFlexError(result)) {
        fail('failed to apply flex');
        return flexagon;
      }
      return result;
    }

    it('supports the atomic pat version of the pyramid shuffle', () => {
      const atomicFlex = convertAtomicFlex('S', 7,
        'a [[[3,-2],-4],1] / -5 / # [7,-6] / b', 'a [-2,1] / -3 / # [7,[-4,[-6,5]]] / b');
      if (isError(atomicFlex)) {
        fail('failed to make pyramid shuffle');
        return;
      }
      const flexes: Flexes = makeAllFlexes(7);

      expect(checkForEqual(flexes['S'], atomicFlex));
    });

    it('supports the atomic pat version of the Tao flex', () => {
      const atomicFlex = convertAtomicFlex('Tao', 10,
        'a [10,-9] / 11 \\ 12 / # [-2,1] / -3 / -4 / -5 \\ b',
        'a -9 \\ -10 / # -11 / [1,-12] / 2 / 3 \\ [-5,4] / b');
      if (isError(atomicFlex)) {
        fail('failed to make Tao flex' + JSON.stringify(atomicFlex));
        return;
      }
      const flexes: Flexes = makeMorphFlexes(10);

      expect(checkForEqual(flexes['Tao'], atomicFlex));
    });

    it('complains about bad atomic input', () => {
      const error = convertAtomicFlex('Err', 6,
        'a [10,-9] / # 5',
        'a [-2,1] / -3 / # [7,[-4,[-6,5]]] / b');
      if (!isAtomicParseError(error)) {
        fail('expected an atomic error' + JSON.stringify(error));
        return;
      }
      expect(error.atomicParseCode).toBe('MissingOtherRight');
      expect(error.flexName).toBe('Err');
    });

    it('complains if it changes the number of pats', () => {
      const error = convertAtomicFlex('Err', 6,
        'a [-2,1] / # 3 / b',
        'a 1 \\ 2 / # -3 \\ -b');
      if (!isFlexError(error)) {
        fail('expected a flex error' + JSON.stringify(error));
        return;
      }
      expect(error.reason).toBe('size mismatch');
    });

    it('complains if input & output have a different number of leaves', () => {
      const error = convertAtomicFlex('Err', 6,
        'a [-2,1] / # 3 / b',
        'a 1 \\ 2 / # [4,-3] \\ -b');
      if (!isFlexError(error)) {
        fail('expected a flex error' + JSON.stringify(error));
        return;
      }
      expect(error.reason).toBe('size mismatch');
    });
  });
}
