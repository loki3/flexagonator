namespace Flexagonator {

  // dictionary of how various flexes are decomposed into atomic flexes
  export const AtomicDecomposition = {
    // filling out the basic atomic flexes
    "<": ">'",
    Ul: "~Ur~",

    // exchange a leaf between adjacent pats or across n pats
    Xr: "Ur < Ul' >~",
    Xl: "Ul < Ur' >~",
    Xr3: "> Ur << Ul' >",
    Xl3: "> Ul << Ur' >",
    Xr4: "> Ur <<< Ul' >>",
    Xl4: "> Ul <<< Ur' >>",
    // pocket
    K: "Xr^ > Ul^",
    K3a: "Xr^ >> Ul^",
    K3b: "Xr^ >> Ul^",
    K4: "Xr^ >>> Ul^",

    // pinch flex & variations
    P222h: "Xr >> Xl >> Xr >>",
    P222222h: "(Xr >> Xl >>)3 ~",
    P3333h: "Xr >>> Xl >>> Xr >>> Xl >>> ~",
    P3333: "(Xr >>> Xl >>> Xr >>> Xl >>>)2",
    P333h: "Xr >>> Xl >>> Xr >>>",
    P444h: "Xr >>>> Xl >>>> Xr >>>>",
    P444: "(Xr >>>> Xl >>>> Xr >>>>)2",
    P66: "(Xr (>)6 Xl (<)6)2",
    // pinch flexes made from pocket flexes
    P222hk: ">>>> K ^>>> K' ^",
    P333hk: ">>>>>> K3a ^>>> K3b' ^",

    // "half" flexes
    Hf: "K > Ul' <",
    Hb: "^Hf^",
    Hr: "<< Ur >>>> Xl << Ul' ~",
    Hl: "^Hr^",
    Hfs: "> K << Xr3 > Ur'",
    Hbs: "^Hfs^",
    // partial shuffle (kite-to-kite), combines well with half flexes
    Sp: "> Ul << Ur > Ul' <<< Ul' >>",
    // kite-to-kite slot, combines well with half flexes
    Lkk: "> Ul Ur <<<< Ul' < Ul' >>",
    // specific to hexaflexagon
    Hh: "Xr >>> Xl <<<~",
    Ht: "< Ur ^<<< Ur' <<^ Xl <<<~",

    // built from half flexes
    F: "Hf Hb'",        // K > Ul' <^> Ul < K' ^
    St: "Hf Hfs'",      // K > Ul' < Ur << Ul >> Ur' > K' <
    Fm: "< Hr Hb' >",   // Xr~<<< Ur>>Ur' ^ > Ul < K' ^>
    S3: "< Hr Hl' >",   // Xr~<<< Ur>>Ur'< Ur>>Ur'<< Xl~>>
    // these have simpler forms, but can be built from half flexes
    Tfromh: "< Hr Hf' >",
    Sfromh: "< Hfs Hb' >",
    Sfromsp: "Hf Sp Hb' >",
    Hfsfromsp: "> Hf Sp",

    Ltf: "Hf Lkk Hf' <",
    Lk: "Hf Lkk Hbs' <",

    // specific to hexaflexagon
    Ttf: "Hh Hf'",
    V: "Hb Hh'",
    Lh: "Hf Lkk Hh'",
    Ltb: "Hf Lkk Ht'",
    Lbb: "Hf Lkk >>> Ht' <<",
    Lbf: "Hf Lkk >>> Hf' <<",

    // on a pentaflexagon
    L3: "(K^)3 (<)4 (K'^)3",

    // start & end //
    Tf: "Xr Xr",

    // start & end ///
    S: "K Xr' Ul' < Xr",

    // start & end /\\/
    Iv: "Xl4 Xr4",
    Rfb: "Hf' Hb",
    Rsrf: "Hfs' Hf",
  }

}
