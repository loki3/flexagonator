namespace Flexagonator {

  export interface ScriptItem {
    // creates a new flexagon with the given pat structure
    readonly pats?: LeafTree[];
    // specify the number of pats for a new flexagon
    readonly numPats?: number;
    // for first leaf: [center angle, clockwise angle]
    readonly angles?: number[];
    // how each pat is connected to the previous pat, 0: left, 1: right (if edge at bottom)
    readonly directions?: boolean[];
    // a series flexes
    readonly flexes?: string;
    // run a series of flexes in reverse, effectively undoing them
    readonly reverseFlexes?: string;
    // run a series of flexes, number & coloring any new faces
    readonly flexAndColor?: FlexAndColorOptions;
    // manipulate the flex history: "clear", "undo", "redo", "reset"
    readonly history?: string;
    // array of properties for every leaf
    readonly leafProps?: LeafProperties[];
    // set properties for the entire face (front and/or back)
    readonly setFace?: LeafProperties;
    // set properties for just the portion that's not already set (front and/or back)
    readonly unsetFace?: LeafProperties;
    // add a new flex to what can be applied to the current flexagon
    readonly addFlex?: FlexDef;
    // a list of flexes to search
    readonly searchFlexes?: string;
  }

}
