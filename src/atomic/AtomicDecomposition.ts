namespace Flexagonator {

  // dictionary of how various flexes are decomposed into atomic flexes
  export const AtomicDecomposition = {
    // filling out the basic atomic flexes
    "<": ">'",
    Ul: "~Ur~",

    // exchange a leaf between adjacent pats or across n pats
    Xr: "Ur < Ul' >",
    Xl: "Ul < Ur' >",
    Xr3: "> Ur << Ul' >",
    Xl3: "> Ul << Ur' >",
    Xr4: "> Ur <<< Ul' >>",
    Xl4: "> Ul <<< Ur' >>",
    // pocket
    K: "Xr~^ > Ul^",
    K3a: "Xr~^ >> Ul^",
    K3b: "Xr~^ >> Ul^",
    K4: "Xr~^ >>> Ul^",

    // pinch flex & variations
    P222: "(Xr >> AwlAwl)3 ~",
    P222222: "(Xr >> AwlAwl)6 ~",
    P3333: "(Xr >>> AwlAwlAwl)4 ~",
    P3333d: "(Xr >>> AwlAwlAwl)4 ~ (Xr >>> AwlAwlAwl)4 ~",
    P333: "(Xr >>> AwlAwlAwl)3 ~",
    P444: "(Xr >>>> AwlAwlAwlAwl)3 ~",
    P444d: "(Xr >>>> AwlAwlAwlAwl)3 ~ (Xr >>>> AwlAwlAwlAwl)3 ~",
    P66d: "(Xr >>>>>> AwlAwlAwlAwlAwlAwl)2 ~ (Xr >>>>>> AwlAwlAwlAwlAwlAwl)2 ~",
    // pinch flexes made from pocket flexes
    P222k: ">>>> K ^>>> K' ^",
    P333k: ">>>>>> K3a ^>>> K3b' ^",

    // "morph-kite" flexes
    Mkf: "K > Ul' <",
    Mkb: "^Mkf^",
    Mkr: "<< Ur >>>> Xl << Ur'",
    Mkl: "^Mkr^",
    Mkfs: "> K << Xr3 > Ur'",
    Mkbs: "^Mkfs^",
    // partial shuffle (kite-to-kite), combines well with morph-kite flexes
    Sp: "> Ul << Ur > Ul' <<< Ul' >>",
    // kite-to-kite slot, combines well with morph-kite flexes
    Lkk: "> Ul Ur <<<< Ul' < Ul' >>",
    // specific to hexaflexagon
    Mkh: "Xr~ >>> Xl <<<",
    Mkt: "< Ur ^<<< Ur' <<^ Xl <<<",

    // built from morph-kite flexes
    F: "Mkf Mkb'",        // K > Ul' <^> Ul < K' ^
    St: "Mkf Mkfs'",      // K > Ul' < Ur << Ul >> Ur' > K' <
    Fm: "< Mkr Mkb' >",   // Xr<<< Ur>>Ur' ^ > Ul < K' ^>
    S3: "< Mkr Mkl' >",   // Xr<<< Ur>>Ur'< Ur>>Ur'<< Xl>>
    // these have simpler forms, but can be built from morph-kite flexes
    Tfromm: "< Mkr Mkf' >",
    Sfromm: "< Mkfs Mkb' >",
    Sfromsp: "Mkf Sp Mkb' >",
    Mkfsfromsp: "> Mkf Sp",

    Ltf: "Mkf Lkk Mkf' <",
    Lk: "Mkf Lkk Mkbs' <",

    // specific to hexaflexagon
    V: "< (Xr>>)2 Xl' AwlAwlAwlAwlAwl >>> Awl~",
    Ttf: "Mkh Mkf'",
    Lh: "Mkf Lkk Mkh'",
    Ltb: "Mkf Lkk Mkt'",
    Lbb: "Mkf Lkk >>> Mkt' <<",
    Lbf: "Mkf Lkk >>> Mkf' <<",

    // on a pentaflexagon
    L3: "(K^)3 (<)4 (K'^)3",

    // start & end //
    Tf: "Xr Xl",

    // start & end ///
    S: "K Xl' Ur' < Xl >",

    // start & end /////
    F3: ">Xl'<< Ul'<< Ur>>> Ul'<< Ur< Ul>Ur'>",

    // start & end /\\/
    Tr4: "Xl4 Xr4",
    Bf: "Mkf' Mkb",
    Rsrf: "Mkfs' Mkf",
  }

}
