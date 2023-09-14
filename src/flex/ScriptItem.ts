namespace Flexagonator {

  export interface ScriptItem {
    // a name that follows the convention of "<overall shape> <leaf shape> <face count>-<pat count>flexagon",
    // which can be used to determine properties such as pats, numPats, angles, etc.
    readonly name?: string;
    // creates a new flexagon with the given pat structure
    readonly pats?: LeafTree[];
    // specify the number of pats for a new flexagon
    readonly numPats?: number;
    // for first leaf: [center angle, counterclockwise angle]
    readonly angles2?: number[];
    // DEPRECATED (use angles2): for first leaf: [center angle, counterclockwise angle]
    readonly angles?: number[];
    // how each pat is connected to the previous pat; if previous pat is to the left,
    // false, \, or | means next is to upper right; true or / is to lower right
    readonly directions?: boolean[] | string;
    // a series flexes
    readonly flexes?: string;
    // run a series of flexes in reverse, effectively undoing them
    readonly reverseFlexes?: string;
    // run a series of flexes, number & coloring any new faces
    readonly flexAndColor?: FlexAndColorOptions;
    // manipulate the flex history: "clear", "undo", "redo", "reset"
    readonly history?: string;
    // renumber the leaves so that the ids occur in the same order as the unfolded template
    readonly normalizeIds?: boolean;
    // assign labels & optional colors to every leaf (also calls normalizeIds)
    readonly setLabels?: LabelInfo;
    // array of properties for every leaf
    readonly leafProps?: LeafProperties[];
    // set properties for the entire face (front and/or back)
    readonly setFace?: LeafProperties;
    // set properties for just the portion that's not already set (front and/or back)
    readonly unsetFace?: LeafProperties;
    // label leaf faces based on deep they are in the tree, optionally assigning passed in colors
    readonly labelAsTree?: number[];
    // add a new flex to what can be applied to the current flexagon
    readonly addFlex?: FlexDef | FlexFromSequence;
    // a list of flexes to search
    readonly searchFlexes?: string;
    // add the morph-flexes to the list of flex definitions
    readonly addMorphFlexes?: boolean;
    // (deprecated) same as addMorphFlexes
    readonly addHalfFlexes?: boolean;
  }

  // info about how to label every leaf, optionally coloring them
  export interface LabelInfo {
    // [[front,back], [front,back], ...]
    readonly labels: (string | number)[][];
    // number of times to repeat labels
    readonly repeat?: number;
    // [color1, color2, ...]
    readonly colors?: number[];
  }

  // define a flex in terms of input & output pats
  export interface FlexDef {
    readonly shorthand: string;
    readonly name: string,
    readonly input: LeafTree[],
    readonly output: LeafTree[],
    readonly rotation?: AngleOrder,
    /** the new order for the directions between pats, 1-based */
    readonly orderOfDirs?: number[],
  }

  /** the order of the angles ABC after a flex */
  export type AngleOrder = 'ABC' | 'ACB' | 'BAC' | 'BCA' | 'CAB' | 'CBA' | 'Right' | 'Left';

  // define a flex in terms of a flex sequence
  export interface FlexFromSequence {
    readonly shorthand: string;
    readonly name: string;
    readonly sequence: string;
  }

  export function isFlexFromSequence(result: any): result is FlexFromSequence {
    return (result as FlexFromSequence).sequence !== undefined;
  }

}
