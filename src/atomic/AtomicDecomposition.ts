namespace Flexagonator {

  // dictionary of how various flexes are decomposed into atomic flexes
  export const AtomicDecomposition = {
    // filling out the basic atomic flexes
    "<": ">'",
    Ul: "~Ur~",

    // exchange a leaf
    Xr: "Ur> ^Ur'^",
    Xl: "Ul> ^Ul'^",
    // pocket
    K: "Xr^ > Ul^",

    // pinch flex & variations
    P: "Xr >> Xl >> Xr >>", // just for a hexaflexagon, "(Xr >> Xl >>)3 ~" is for a dodeca
    P3333h: "Xr >>> Xl >>> Xr >>> Xl >>> ~",
    P3333: "(Xr >>> Xl >>> Xr >>> Xl >>>)2",
    P444h: "Xr >>>> Xl >>>> Xr >>>>",
    P444: "(Xr >>>> Xl >>>> Xr >>>>)2",
    P66: "(Xr (>)6 Xl (<)6)2",

    // "half" flexes
    Hf: "K > Ul' <",
    Hb: "^Hf^",
    Hr: "<< Ur >>>> Xl << Ul' ~",
    Hl: "^Hr^",
    Hsr: "> K < Ur << Ul' >> Ur'",
    Hsl: "^Hsr^",
    Hkl: "> Ul Ur <<<< Ul' < Ul' >>",
    // specific to hexaflexagon
    Hh: "Xr >>> Xl <<<~",
    Ht: "< Ur ^<<< Ur' <<^ Xl <<<~",

    // built from half flexes
    F: "Hf Hb'",
    St: "Hf Hsr'",
    S: "< Hsr Hb' >",
    T: "< Hr Hf' >",
    Mf: "< Hr Hb' >",
    S3: "< Hr Hl' >",

    Ltf: "Hf Hkl Hf' <",
    Lk: "Hf Hkl Hsl' <",

    // specific to hexaflexagon
    Ttf: "Hh Hf'",
    V: "Hb Hh'",
    Lh: "Hf Hkl Hh'",
    Ltb: "Hf Hkl Ht'",
    Lbb: "Hf Hkl >>> Ht' <<",
    Lbf: "Hf Hkl >>> Hf' <<",

    // on a pentaflexagon
    L3: "(K^)3 (<)5 (K'^)3",

    // "inner pivot" with pat directions /\\/
    Iv: "> Ul > Ul <<<< Ur' Ul' >>",
  }

}
