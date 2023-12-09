namespace Flexagonator {

  /** parse strings like "[0,[0,0]]" and "2,4" to generate the pat structure needed for the given number of pats */
  export function parsePats(rawPats: string, patCount: number): LeafTree[] | false {
    const s = rawPats.trim();
    if (s[0] === '[') {
      return parseAsArray(s, patCount);
    }
    return parseShortcuts(s, patCount);
  }

  /** assume we have something like "[1,[2,3]]" */
  function parseAsArray(rawPats: string, patCount: number): LeafTree[] | false {
    try {
      const parsed = JSON.parse(rawPats);
      if (!Array.isArray(parsed)) {
        return false;
      }
      return repeatPats(parsed, patCount);
    } catch (e) {
      return false;
    }
  }

  /** assume we have a list of various pat shortcuts (like 4=[[0,0],[0,0]]), e.g., "21,1,4" */
  function parseShortcuts(rawPats: string, patCount: number): LeafTree[] | false {
    const result: LeafTree[] = [];
    const pieces = rawPats.split(',');
    for (let i = 0; i < pieces.length; i++) {
      const piece = pieces[i].trim();
      switch (piece) {
        case '1': result.push(0); break;
        case '2': result.push([0, 0]); break;
        // 3
        case '12': result.push([0, [0, 0]]); break;
        case '21': result.push([[0, 0], 0]); break;
        // 4
        case '4': result.push([[0, 0], [0, 0]]); break;
        case '211': result.push([[[0, 0], 0], 0]); break;
        case '112': result.push([0, [0, [0, 0]]]); break;
        case '12-1': result.push([[0, [0, 0]], 0]); break;
        case '1-21': result.push([0, [[0, 0], 0]]); break;
        // unhandled
        default:
          return false;
      }
    }
    return repeatPats(result, patCount);
  }

  /** if necessary, keep repeating what's in 'parsed' till we have 'patCount' entries */
  function repeatPats(parsed: LeafTree[], patCount: number): LeafTree[] {
    if (parsed.length === patCount) {
      return parsed;
    }
    const result: LeafTree[] = [];
    for (let i = 0, j = 0; i < patCount; i++) {
      result.push(parsed[j]);
      j = (j === parsed.length - 1) ? 0 : j + 1;
    }
    return result;
  }

}

