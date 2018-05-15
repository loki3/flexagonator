namespace Flexagonator {

  export interface ScriptItem {
    // creates a new flexagon with the given pat structure
    readonly pats: LeafTree[];
    // a series of space-delimited flexes
    readonly flexes?: string;
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
    // for first leaf: [center angle, clockwise angle]
    readonly angles?: number[];
  }

}