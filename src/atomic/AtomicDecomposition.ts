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

    // "morph-kite" flexes
    Mkf: "K > Ul' <",
    Mkb: "^Mkf^",
    Mkr: "<< Ur >>>> Xl << Ul' ~",
    Mkl: "^Mkr^",
    Mkfs: "> K << Xr3 > Ur'",
    Mkbs: "^Mkfs^",
    // partial shuffle (kite-to-kite), combines well with morph-kite flexes
    Sp: "> Ul << Ur > Ul' <<< Ul' >>",
    // kite-to-kite slot, combines well with morph-kite flexes
    Lkk: "> Ul Ur <<<< Ul' < Ul' >>",
    // specific to hexaflexagon
    Mkh: "Xr >>> Xl <<<~",
    Mkt: "< Ur ^<<< Ur' <<^ Xl <<<~",

    // built from morph-kite flexes
    F: "Mkf Mkb'",        // K > Ul' <^> Ul < K' ^
    St: "Mkf Mkfs'",      // K > Ul' < Ur << Ul >> Ur' > K' <
    Fm: "< Mkr Mkb' >",   // Xr~<<< Ur>>Ur' ^ > Ul < K' ^>
    S3: "< Mkr Mkl' >",   // Xr~<<< Ur>>Ur'< Ur>>Ur'<< Xl~>>
    // these have simpler forms, but can be built from morph-kite flexes
    Tfromm: "< Mkr Mkf' >",
    Sfromm: "< Mkfs Mkb' >",
    Sfromsp: "Mkf Sp Mkb' >",
    Mkfsfromsp: "> Mkf Sp",

    Ltf: "Mkf Lkk Mkf' <",
    Lk: "Mkf Lkk Mkbs' <",

    // specific to hexaflexagon
    Ttf: "Mkh Mkf'",
    V: "Mkb Mkh'",
    Lh: "Mkf Lkk Mkh'",
    Ltb: "Mkf Lkk Mkt'",
    Lbb: "Mkf Lkk >>> Mkt' <<",
    Lbf: "Mkf Lkk >>> Mkf' <<",

    // on a pentaflexagon
    L3: "(K^)3 (<)4 (K'^)3",

    // start & end //
    Tf: "Xr Xr",

    // start & end ///
    S: "K Xr' Ul' < Xr >",

    // start & end /\\/
    Iv: "Xl4 Xr4",
    Rfb: "Mkf' Mkb",
    Rsrf: "Mkfs' Mkf",
  }

}
