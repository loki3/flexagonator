/*
  Copyright (c) 2024 Scott Sherman
  Script & draw options for flexagon templates
*/

/**
 * draw a template
 * @param name name of the template, e.g., "fig1.1"
 * @param outputId id of output element, defaults to template name
 * @param face 'both' | 'front' | 'back', defaults to 'both'
 */
function drawTemplate(name, outputId, face) {
  const id = outputId ? outputId : name;
  const template = allTemplates[name];

  if (typeof template === 'string') {
    addImage(id, template);
    return;
  }

  const [script, options, extras] = template;
  const drawOptions = addFace(options, face);
  if (!extras) {
    drawOne(id, script, drawOptions);
  } else {  // template is split into pieces
    const ids = [], pieces = [];
    let i = 1;
    for (const extra of extras) {
      ids.push(`${id}-${i++}`);
      pieces.push({ ...drawOptions, ...extra });
    }
    drawOne(ids, script, pieces);
  }
}

/**
 * draw an unfolded strip in the given element
 * @param outputId id of output element
 * @param script flexagonator script describing flexagon
 * @param drawOptions options for how to draw template
 */
function drawOne(outputId, script, drawOptions) {
  const fm = Flexagonator.createFromScript(script);
  Flexagonator.drawUnfolded(outputId, fm, drawOptions);
}

// optionally specify just 'front' | 'back' face
function addFace(options, face) {
  if (!face || face === 'both') {
    return options;
  }
  const moreContent = { face, showLeafProps: true, inset: 0.1 };
  let content = options.content;
  content = content ? { ...content, ...moreContent } : moreContent;
  return { ...options, content };
}

// under element 'id', add <img src=template>
function addImage(id, template) {
  const output = document.getElementById(id);
  if (!output) {
    return;
  }

  const img = document.createElement("img");
  img.src = template;
  img.width = 800;
  output.appendChild(img);
}


// draw * on the edges that should be taped together
const firstStar = { text: "⚹", which: 0, scale: 1.8 };
const lastStar = { text: "⚹", which: -1, scale: 1.8 };
const starCaptions = [firstStar, lastStar];
// common colors for faces
const colors = [0x7fbcff, 0x7fff82, 0xff827f, 0xc27fff, 0xfbff7f, 0x999999, 0xdddddd];
const labelAsTree = colors;

function getPinchScript(numPats, flexes, angles2) {
  return [{ numPats, angles2, flexes, labelAsTree }];
}
function getPinchOptions(rotation, start, end, whereFlex, text, edge, endStyle) {
  const captions = whereFlex === undefined ? starCaptions : starCaptions.concat({ text, which: whereFlex, edge });
  return { rotation, content: { showLeafProps: true, endStyle }, captions, start, end };
}

// same as getPinchScript except that it numbers the faces as they're created by 'flexes'
function getPinch2Script(numPats, flexes, angles2) {
  angles2 = angles2 ? angles2 : [60, 60];
  return [{ numPats, angles2, flexAndColor: { flexes: flexes, colors } }];
}
function getPinch2Options(rotation, whereFlex, text, endStyle) {
  const captions = whereFlex === undefined ? starCaptions : starCaptions.concat({ text, which: whereFlex });
  return { rotation, content: { showLeafProps: true, endStyle }, captions };
}

function getSeqScript(numPats, flexes, angles2, postFlexes) {
  return [{ numPats, flexes, angles2, labelAsTree, reverseFlexes: flexes }, { flexes: postFlexes }];
}
function getSeqOptions(rotation, whereFlex, edge, text, endStyle, customCaptions, scale) {
  const captions = customCaptions !== undefined ? customCaptions
    : whereFlex === undefined ? starCaptions : starCaptions.concat({ text, which: whereFlex, edge, scale });
  return { rotation, content: { showLeafProps: true, endStyle }, captions };
}

// use folding order rather than tree order for odd-ordered flexagon
function getOddScript(numPats, flexes, postFlexes, labels, repeats) {
  const script = [{ numPats, flexes, angles2: [], reverseFlexes: flexes }, { flexes: postFlexes }];
  if (labels) script.push({ setLabels: { labels, repeats, colors } });
  return script;
}
function getOddOptions(rotation, whereFlex, edge, text, showLeafProps) {
  const captions = whereFlex === undefined ? starCaptions : starCaptions.concat({ text, which: whereFlex, edge });
  const content = showLeafProps ? { showLeafProps: true } : { showFoldingOrder: true };
  return { rotation, content, captions };
}

// special handling of the regular penta-<x>flexagon to make for a better numbering scheme
function getPentaScript(numPats) {
  const pentaPats = [0, [0, [0, [0, 0]]]];
  const pats = Array(numPats / 2).fill(pentaPats).flatMap(p => p);
  const pentaNums = [[2, 1], [3, 4], [1, 5], [4, 5], [3, 2]];
  return [{ pats, angles2: [60, 60], setLabels: { labels: pentaNums, repeat: numPats / 2, colors } }];
}
function getPentaOptions(rotation, extraCaptions) {
  let captions = starCaptions.concat({ text: "5", which: 2, edge: 2 });
  if (extraCaptions) captions = captions.concat(extraCaptions);
  return { rotation, content: { showLeafProps: true }, captions };
}


///////////
// 1: pinch flex
const templatesPinch = {
  "fig1.1": [getPinchScript(6, "P*"), getPinchOptions(120, undefined, undefined, 0, "3", 2)],
}

///////////
// 3: more faces
function get12Script() {
  const A = "P'*>(P*)2";
  const B = "P'*>(P*)4";
  const flexes = A + B + A + B + A;
  const labels = [[4, 7], [1, 7], [2, 8], [4, 8], [5, 9], [3, 9], [1, 10], [5, 10], [6, 11], [2, 11], [3, 12], [6, 12]];
  return [{ numPats: 6, flexes, setLabels: { labels, repeats: 3, colors } }];
}
function get24Script() {
  const A = "P'*>(P*)2";
  const B = "P'*>(P*)4";
  const C = "P'*>(P*)6";
  const flexes = A + B + A + C + A + B + A + C + A + B + A;
  const labels = [[7, 13], [4, 13], [1, 14], [7, 14], [8, 15], [2, 15], [4, 16], [8, 16], [9, 17], [5, 17], [3, 18], [9, 18],
  [10, 19], [1, 19], [5, 20], [10, 20], [11, 21], [6, 21], [2, 22], [11, 22], [12, 23], [3, 23], [6, 24], [12, 24]];
  return [{ numPats: 6, flexes, setLabels: { labels, repeats: 3, colors } }];
}
const templatesMoreFaces = {
  "fig3.1": [getPinchScript(6, "P*P+"), getPinchOptions(210, undefined, undefined, -1, "4", 1)],
  "fig3.3": [getPentaScript(6), getPentaOptions(60)],
  "fig3.4": [getPinch2Script(6, "P* P+ >P>P P+ ^P P+ ^P^"), getPinch2Options(120, 1, "6a")],
  "fig3.5": [getPinch2Script(6, "P* P+ >P>P P+ PP+ ^P"), getPinch2Options(0, 1, "6b", "solid")],
  "fig3.6": [getPinch2Script(6, "P* P+ >P>P P+ >PPP+ ^PP"), getPinch2Options(0, -2, "6c", "solid")],
  "fig3.7": [get12Script(), getPinchOptions(120, 0, 11, 1, "12", 1)],
  "fig3.8": [get24Script(), getPinchOptions(120, 0, 23, 2, "24", 2)],
}

///////////
// 4: triangle tetra & octa
const templatesTetraOcta = {
  "fig4.1": [
    [{ numPats: 4, flexes: "P*", angles: [60, 60], labelAsTree }],
    { rotation: 120, content: { showLeafProps: true }, captions: starCaptions.concat({ text: "3", which: 0, edge: 2 }, { text: "+", which: 3, edge: 1 }, { text: "+", which: 4, edge: 1 }) }
  ],
  "fig4.3": [getPentaScript(4), getPentaOptions(60, [{ text: "+", which: 0, edge: 2 }, { text: "+", which: -1, edge: 0 }])],
  "fig4.5": [
    [{ numPats: 8, flexes: "P*", angles: [60, 60], labelAsTree }],
    { rotation: 120, content: { showLeafProps: true }, captions: starCaptions.concat({ text: "3", which: 0, edge: 2 }) }
  ],
  "fig4.7": [getPentaScript(8), getPentaOptions(60, [{ text: "+", which: 2, edge: 0 }, { text: "+", which: 5, edge: 0 }])],
}

///////////
// 5: different triangles
const triCaptions = [
  { text: "a", which: 0, edge: 0 }, { text: "b", which: 0, edge: 1 }, { text: "c", which: 0, edge: 2 },
  { text: "a", which: 1, edge: 0 }, { text: "b", which: 1, edge: 1 }, { text: "c", which: 1, edge: 2 },
  { text: "c", which: 2, edge: 0 }, { text: "b", which: 2, edge: 1 }, { text: "a", which: 2, edge: 2 },
  { text: "b", which: 3, edge: 0 }, { text: "c", which: 3, edge: 1 }, { text: "a", which: 3, edge: 2 },
  { text: "a", which: 4, edge: 0 }, { text: "c", which: 4, edge: 1 }, { text: "b", which: 4, edge: 2 },
  { text: "c", which: 5, edge: 0 }, { text: "a", which: 5, edge: 1 }, { text: "b", which: 5, edge: 2 },
  { text: "b", which: 6, edge: 0 }, { text: "a", which: 6, edge: 1 }, { text: "c", which: 6, edge: 2 },
  { text: "a", which: 7, edge: 0 }, { text: "b", which: 7, edge: 1 }, { text: "c", which: 7, edge: 2 },
  { text: "c", which: 8, edge: 0 }, { text: "b", which: 8, edge: 1 }, { text: "a", which: 8, edge: 2 },
];
const templatesDifferent = {
  "fig5.1": [getSeqScript(6, "P+", [60, 90], ">"), getSeqOptions(90, -3, 0, "3")],
  "fig5.3": [getSeqScript(6, "P+", [60, 60], ">"), getSeqOptions(120, undefined, undefined, undefined, undefined, triCaptions)],
  "fig5.4": [getSeqScript(6, "P+", [60, 90], ">"), getSeqOptions(90, undefined, undefined, undefined, undefined, triCaptions)],
  "fig5.5": [getPinchScript(6, "P*P+", [60, 90]), getPinchOptions(150, undefined, undefined, -1, "4a", 0)],
  "fig5.6": [getPinchScript(6, "P*P+", [30, 60]), getPinchOptions(30, undefined, undefined, -1, "4b", 0, "solid")],
  "fig5.7": [getPinchScript(6, "P*P+", [90, 30]), getPinchOptions(120, undefined, undefined, -1, "4c", 0)],
  "fig5.9": [getPinch2Script(6, "P* P+ >P>P P+ ^P P+ ^P^", [60, 90]), getPinch2Options(90, 1, "6a")],
  "fig5.10": [getSeqScript(6, "P+", [45, 45], ">"), getSeqOptions(135, -3, 0, "3")],
  "fig5.11": [getPinchScript(8, "P*P+", [90, 45]), getPinchOptions(45, undefined, undefined, 3, "4a", 1, "solid")],
  "fig5.12": [getPinchScript(8, "P*P+", [45, 90]), getPinchOptions(225, undefined, undefined, -1, "4b", 1)],
  "fig5.15": [getPinch2Script(6, "P* P+ >P>P P+ ^P P+ ^P^", [45, 45]), getPinch2Options(135, 1, "6a")],
  "fig5.16": [[{ numPats: 4, flexAndColor: { flexes: "P*(^>P*)2>", colors }, angles2: [90, 45] }],
  { rotation: 45, content: { showLeafProps: true } },
  [{ start: 0, end: 5, captions: [{ text: "a", which: 0 }, lastStar, { text: "5", which: 1, edge: 2 }] },
  { start: 6, end: 9, captions: [firstStar, { text: "a", which: -1 }] }]],
  "fig5.X": [getSeqScript(4, "P* ^> P* ^> P* P+", [90, 45]), getSeqOptions(45, -1, 0, "6", "solid")],
  "fig5.18": [getSeqScript(6, "P+", [65, 40], ">"), getSeqOptions(140, -3, 0, "3")],
}

///////////
// 6: pinch flex variations
const p333Script = [{ pats: [[[0, 0], 0], [[0, 0], 0], [[0, 0], 0]] },
{ setLabels: { labels: [[2, 3], [1, 4], [3, 4], [2, 5], [1, 6], [5, 6], [2, 7], [1, 8], [7, 8]], colors } },
{ angles: [40, 70] }];
const p444hScript = [{ pats: [0, [0, 0], 0, 0, 0, [0, 0], 0, 0, 0, [0, 0], 0, 0] },
{ setLabels: { labels: [[1, 2], [3, 2], [3, 1], [2, 1], [2, 1], [2, 1], [2, 3], [1, 3], [1, 2], [1, 2], [1, 2], [3, 2], [3, 1], [2, 1], [2, 1]], colors } },
{ angles: [30, 60] }];
const templatesPinchVariations = {
  "fig6.2": [
    [{ numPats: 9, flexAndColor: { flexes: "^P333'*>^", colors } }],
    { rotation: 4, content: { showLeafProps: true }, captions: starCaptions.concat({ text: "#", which: -5, edge: 1 }, { text: "P333", which: 0, edge: 0 }) }
  ],
  "fig6.4": [p333Script, { rotation: 0, content: { showLeafProps: true } },
    [{ captions: [{ text: "a", which: 0, edge: 2 }, { text: "b", which: -1, edge: 1 }, { text: "P333 8", which: 1, edge: 0 }] },
    { captions: [{ text: "b", which: 0, edge: 2 }, { text: "c", which: - 1, edge: 1 }] },
    { captions: [{ text: "c", which: 0, edge: 2 }, { text: "a", which: -1, edge: 1 }] }]],
  "fig6.5": [[{ numPats: 12, flexes: "(P*P+P'>)2", labelAsTree }, { flexes: "^" }],
  { rotation: -15, start: 0, end: 8, content: { showLeafProps: true, endStyle: 'solid' } },
  [{ captions: [{ text: "d", which: 0, edge: 1 }, { text: "a", which: -1, edge: 2 }, { text: "P444", which: 1 }] },
  { captions: [{ text: "a", which: 0, edge: 1 }, { text: "b", which: -1, edge: 2 }] },
  { captions: [{ text: "b", which: 0, edge: 1 }, { text: "c", which: -1, edge: 2 }] },
  { captions: [{ text: "c", which: 0, edge: 1 }, { text: "d", which: -1, edge: 2 }] }]],
  "fig6.7": [p444hScript, { rotation: 120, content: { showLeafProps: true }, captions: starCaptions.concat({ text: "P444h", which: 0, edge: 2 }, { text: "#", which: -5, edge: 1 }) }],
  "fig6.9": [
    [{ pats: [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]], angles: [] },
    { setLabels: { labels: [[3, 2], [3, 1], [2, 4], [1, 4], [3, 2], [3, 1], [2, 4], [1, 4], [3, 2], [3, 1], [2, 4], [1, 4], [5, 2], [5, 1]], colors } }],
    { rotation: 25.714, content: { showLeafProps: true }, captions: starCaptions.concat({ text: "P223h", which: 3, edge: 0 }) }],
}

///////////
// 7: book flex
const templatesBook = {
  "fig7.1": "templates/fig7.1.png",
  "fig7.3": "templates/fig7.3.png",
  "fig7.4": "templates/fig7.4.png",
  "fig7.5": "templates/fig7.5.png",
  "fig7.6": "templates/fig7.6.png",
  "fig7.7": "templates/fig7.7.png",
  "fig7.8": "templates/fig7.8.png",
  "fig7.9": "templates/fig7.9.png",
  "fig7.10": "templates/fig7.10.png",
  "fig7.11": "templates/fig7.11.png",
  "fig7.12": "templates/fig7.12.png",
  "fig7.13": "templates/fig7.13.png",
}

///////////
// 8: box flex
const templatesBox = {
  "fig8.1": "templates/fig8.1.png",
  "fig8.3": "templates/fig8.3.png",
  "fig8.5": "templates/fig8.5.png",
  "fig8.6": "templates/fig8.6.png",
  "fig8.7": "templates/fig8.7.png",
  "fig8.8": "templates/fig8.8.png",
}

///////////
// 10: v-flex
const templatesV = {
  "fig10.1": [getSeqScript(6, "V*"), getSeqOptions(60, 0, 2, "V")],
  "fig10.4": [getSeqScript(6, "(V*>)6"), getSeqOptions(-60, -1, 1, "(V>)6")],
  "fig10.6": [getSeqScript(6, "(V*<)15"), getSeqOptions(60, -2, 2, "(V<)15")],
  "fig10.8": [getSeqScript(8, "V*", [45, 90]), getSeqOptions(-45, -1, 0, "V")],
}

///////////
// 11: tuck
const templatesTuck = {
  "fig11.1": [getSeqScript(6, "T*", [60, 30], "^>>"), getSeqOptions(120, -2, 0, "T")],
  "fig11.5": [getSeqScript(6, "T*", undefined, "^>>"), getSeqOptions(-60, -2, 0, "T")],
  "fig11.7": [getSeqScript(8, "(T2+>>)4", [45, 45]), getSeqOptions(45, 3, 0, "(T>>)4")],
}

///////////
// 12: flip
const labelsF7 = [[1, 2], [3, 4], [2, 4], [1, 5], [3, 5], [4, 3], [4, 2], [5, 1], [5, 3], [3, 4],
[2, 4], [1, 5], [3, 5], [4, 3], [4, 2], [5, 1], [5, 3], [1, 2], [3, 2], [3, 1]];
const templatesFlip = {
  "fig12.1": [getSeqScript(8, "F*", [45, 90], ">>"), getSeqOptions(0, -2, 1, "F")],
  "fig12.4": [getSeqScript(6, "F*", [60, 90], ">>"), getSeqOptions(90, -2, 1, "F")],
  "fig12.5": [getSeqScript(10, "(F+>>)5", [36, 90]), getSeqOptions(0, 2, 2, "(F>>)5", undefined, undefined, 1.35)],
  "fig12.6": [getOddScript(7, "(F*<)5", "^", labelsF7, 1), getOddOptions(undefined, -3, 1, "(F<)5", true)],
}

///////////
// 13: pyramid shuffle
const templatesS = {
  "fig13.1": [getSeqScript(6, "S*", undefined, ">>"), getSeqOptions(-120, -2, 1, "S")],
  "fig13.4": [getSeqScript(8, "S*", [45, 90], ">>"), getSeqOptions(0, -2, 1, "S")],
  "fig13.5": [getOddScript(5, "S*", ">>"), getOddOptions(-72, -2, 1, "S")],
}

///////////
// 14: breakdown
function getMkScript(flexes) {
  return [{ numPats: 8, angles2: [45, 90], addMorphFlexes: true }, { flexes, labelAsTree }];
}
function getMkOptions(rotation, text) {
  return { rotation, content: { showLeafProps: true }, captions: [firstStar, lastStar, { text, which: -2, edge: 1 }] };
}
function getKiteScript(flexes) {
  return [{ name: "kite bronze octaflexagon" }, { addMorphFlexes: true }, { flexes }, { normalizeIds: true, labelAsTree }];
}
function getKiteOptions(rotation, start, end, captions) {
  return { scale: 300, content: { showLeafProps: true }, rotation, start, end, captions };
}
const silverMorphScript = [
  { numPats: 8, angles2: [45, 45], "addMorphFlexes": true },
  { flexes: "> Mkf* Mkb'+Mkl'+Mkr'+Mkbs'+Mkfs'+ Mkf' Mkb* Mkf'+Mkl'+Mkr'+Mkbs'+Mkfs'+ Mkb' Mkl* Mkf'+Mkb'+Mkr'+Mkbs'+Mkfs'+ Mkl' Mkr* Mkf'+Mkb'+Mkl'+Mkbs'+Mkfs'+ Mkr' Mkbs* Mkf'+Mkb'+Mkl'+Mkr'+Mkfs'+ Mkbs' Mkfs* Mkf'+Mkb'+Mkl'+Mkr'+Mkbs'+ Mkfs' >>>>" },
  { labelAsTree }
];
const kiteAllScript = getKiteScript("Mkf'* Mkb+Mkl+Mkr+Mkbs+Mkfs+ Mkf Mkb'* Mkf+Mkl+Mkr+Mkbs+Mkfs+ Mkb Mkl'* Mkf+Mkb+Mkr+Mkbs+Mkfs+ Mkl Mkr'* Mkf+Mkb+Mkl+Mkbs+Mkfs+ Mkr Mkbs'* Mkf+Mkb+Mkl+Mkr+Mkfs+ Mkbs Mkfs'* Mkf+Mkb+Mkl+Mkr+Mkbs+ Mkfs >>>");
const templatesBreakdown = {
  "fig14.3": [getMkScript("Mkf+"), getMkOptions(225, "Mkf")],
  "fig14.5": [getMkScript("Mkfs+"), getMkOptions(-45, "Mkfs")],
  "fig14.7": [getMkScript("Mkr+"), getMkOptions(-45, "Mkr")],
  "fig14.8": [silverMorphScript, { rotation: 135, content: { showLeafProps: true }, captions: [firstStar, lastStar, { text: "Mk's", which: 1, edge: 1 }] }],
  "fig14.10": [getSeqScript(8, "St*", [45, 90], ">>>>"), getSeqOptions(135, 5, 1, "St")],
  "fig14.13": [getSeqScript(8, "Fm*", [45, 45], ">>"), getSeqOptions(45, -2, 0, "Fm")],
  "fig14.16": [getSeqScript(8, "S3*", [45, 45], ">>"), getSeqOptions(45, -2, 0, "S3")],
  "fig14.20": [getKiteScript("Bf+ >>>"), {},
  [{ rotation: -30, end: 7, captions: [firstStar, { text: "a", which: -1 }, { text: "Bf", which: 0, edge: 2 }] },
  { rotation: 0, start: 8, captions: [lastStar, { text: "a", which: 0 }] }]],
  "fig14.22": [kiteAllScript, {},
    [getKiteOptions(30, 0, 6, [firstStar, { text: "a", which: -1 }, { text: "Mk's", which: 0, edge: 0 }]),
    getKiteOptions(150, 7, 13, [{ text: "a", which: 0 }, { text: "b", which: -1 }]),
    getKiteOptions(210, 14, 19, [{ text: "b", which: 0 }, { text: "c", which: -1 }]),
    getKiteOptions(300, 20, 24, [lastStar, { text: "c", which: 0 }])],],
  "fig14.25": [getSeqScript(8, "(P*^>)3"), getSeqOptions(undefined, 2, 0, "5")],
}

///////////
// 15: slots
const templatesSlot = {
  "fig15.1": [getSeqScript(6, "Lk+Ltb+Lbb+", [60, 60], ">>>^"),
  getSeqOptions(90, undefined, undefined, undefined, undefined, [firstStar, lastStar, { text: "slots", which: -6 }, { text: "#", which: 5 }])],
  "fig15.9": [getSeqScript(8, "Lk+ Ltf+", [], ">>^"),
  getSeqOptions(45, undefined, undefined, undefined, undefined, [firstStar, lastStar, { text: "slots", which: 2, edge: 2 }, { text: "#", which: 5 }])],
  "fig15.10": [getOddScript(5, "L3*", "", [[3, 2], [4, 5], [1, 5], [3, 4], [2, 6], [8, 7], [8, 1], [7, 6], [1, 2], [3, 2], [4, 5], [1, 5], [3, 4], [2, 1]]),
  getOddOptions(252, 2, 2, "L3", true)],
}

///////////
// 17: state diagrams
const templatesStateDiagrams = {
  "fig17.13": [
    [{ pats: [[-2, 1], [-7, [-3, [6, [4, -5]]]], [11, [-8, [-10, 9]]], 12, [[[15, -14], -16], 13], [18, -17]] }, { labelAsTree }],
    { content: { showLeafProps: true, showIds: true }, rotation: 0, captions: starCaptions }],
  "diagram-hexa11": [
    [{ pats: [[-2, 1], [[4, -5], -3], [7, -6], 8, [-10, 9], -11] }, { labelAsTree }],
    { content: { showLeafProps: true, showIds: true }, rotation: 120, captions: starCaptions }],
}

///////////
// 18: sequences
const flipleftScript = [{ numPats: 8 }, { flexes: "(F*<)6" }, { labelAsTree }];
const templatesSequences = {
  "fig18.2": [flipleftScript, { content: { showLeafProps: true } },
    [{ end: 11, scale: 140, rotation: 67.5, captions: [firstStar, { text: "a", which: -1 }, { text: "(F<)6", which: -3, edge: 2 }] },
    { start: 12, scale: 140, rotation: 180 + 67.5, captions: [lastStar, { text: "a", which: 0 }] }],],
  "fig18.5": [[{ pats: [[0, 0], 0, [0, 0], 0, [0, 0], [[0, 0], [0, 0]]] }, { labelAsTree }],
  { content: { showLeafProps: true }, captions: [{ text: "12", which: 0 }, { text: "12", which: -1 }] }],
}

///////////
// 19: pat notation
const templatesPatNotation = {
  "fig19.1": [
    [{ pats: [1, [-3, 2], [-6, [-4, 5]], [[8, -9], -7], -10, [[[-13, 12], 14], -11]] }, { labelAsTree, searchFlexes: "P S T V" }],
    { content: { showLeafProps: true, showIds: true }, rotation: 180, captions: starCaptions }],
  "fig19.2": [[{ pats: [[-2, 1], -3, [5, -4], 6, [-8, 7], -9], labelAsTree }],
  { content: { showLeafProps: true, showIds: true }, rotation: 60, captions: starCaptions }],
  "fig19.4": [[{ "pats": [[[- 2, [[-4, [7, [5, -6]]], 3]], 1], 8, 9, 10, 11, 12] }],
  { rotation: 60, content: { showFoldingOrder: true, showIds: true }, captions: starCaptions }],
  "fig19.5": [[{ "pats": [[[- 2, [[-4, [7, [5, -6]]], 3]], 1], 8, [-10, 9], [12, -11], [-14, 13], -15] }],
  { rotation: 90, content: { showFoldingOrder: true, showIds: true }, captions: starCaptions }],
}

///////////
// 28: square silver octa
const silverOcta8Script = [{ numPats: 8, angles2: [45, 90], flexAndColor: { flexes: "P* P+ >P>P P+ ^P P+ ^P^", colors } }];
const templatesSilverOcta = {
  "fig28.2": [silverOcta8Script, { content: { showLeafProps: true }, rotation: 90 },
    [{ start: 6, end: 17, captions: [firstStar, { text: "a", which: -1 }, { text: "6", which: -1, edge: 1 }] },
    { start: 6, end: 17, captions: [lastStar, { text: "a", which: 0 }] },]],
  "fig28.7": [getSeqScript(8, "Tw*", [45, 45], ">"), getSeqOptions(45, -1, 1, "Tw")],
}

///////////
// 29: hexa bronze dodeca
const bronzeHexaScript = [{ numPats: 12, angles2: [30, 90], flexAndColor: { flexes: "P* P+ >P>P P+ ^P P+ ^P^", colors } }];
const templatesBronzeDodeca = {
  "fig29.2": [bronzeHexaScript, { content: { showLeafProps: true }, rotation: 90 },
    [{ start: 4, end: 21, captions: [firstStar, { text: "a", which: -1 }, { text: "6", which: -3 }] },
    { start: 4, end: 21, captions: [lastStar, { text: "a", which: 0 }] }],],
  "fig29.9": [[{ pats: [0, 0, [0, 0], 0, [0, 0], 0, 0, 0, [0, 0], 0, [0, 0], 0], angles2: [30, 90], labelAsTree }],
  { content: { showLeafProps: true }, rotation: 30, captions: [firstStar, lastStar, { text: "#", which: -2, edge: 1 }, { text: "rhombic morph", which: 6, edge: 1 }] }],
}

///////////
// 30: hexa silver dodeca
function getSilver12Script(flexes) {
  return [{ name: "hexagonal silver dodecaflexagon" }, { addMorphFlexes: true }, { flexes, labelAsTree }];
}
const templatesSilverDodeca = {
  "fig30.3": [getSilver12Script("Tu*Tu*"),
  { rotation: 90, content: { showLeafProps: true }, captions: [firstStar, lastStar, { text: "TuTu", which: 0, edge: 1 }] }],
  "fig30.5": [getSilver12Script("<<Ds+"),
  { rotation: -45, content: { showLeafProps: true }, captions: [firstStar, lastStar, { text: "Ds", which: -1, edge: 0 }] }],
  "fig30.7": [getSilver12Script("<Tf+>>>Tf+>>>Tf+>>>Tf+>>>>"),
  { rotation: 90, content: { showLeafProps: true }, captions: [firstStar, lastStar, { text: "T's", which: 1, edge: 1 }] }],
}

///////////
// 31: bracelets
function getWrapScript(flexes) {
  return [
    { numPats: 12, angles2: [90, 45], directions: "|//||//||//|" },
    { // a [1,-2] \ # -3 \ -4 / -5 / b  ->  a 1 / [-3,2] / # -4 / -5 / b
      addFlex: {
        name: "wrapper",
        shorthand: "W",
        input: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, [12, -13]],
        output: [[1, 13], 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        inputDirs: "|//||//||//|",
        outputDirs: "///||//||///"
      }
    },
    { flexes, labelAsTree }
  ];
}
function getWrapOptions(rotation, extraCaptions) {
  const captions = [...extraCaptions, firstStar, lastStar];
  return { rotation, content: { showLeafProps: true }, captions };
}
const braceletScript = [{ numPats: 12, angles2: [45, 45], directions: "/||//||//||/", addMorphFlexes: true }];
const tetraPats = [0, 0, [0, [0, 0]], [0, [0, 0]], 0, 0, [0, [0, 0]], [0, [0, 0]], 0, 0, [0, [0, 0]], [0, [0, 0]], 0, 0, [0, [0, 0]], [0, [0, 0]]];
const bfScript = { flexes: ">>>> Bf+ <<<<", labelAsTree };
const bfCaptions = [firstStar, lastStar, { text: "Bf", which: 10, edge: 1 }, { text: "#", which: 10, edge: 0 }, { text: "#", which: 7, edge: 2 }];
const mobiusScript = [{ numPats: 14, angles2: [45, 45], directions: "/||//||//||//|", addMorphFlexes: true }, bfScript];
const mobiusCaptions = [firstStar, lastStar, { text: "Möbius Bf", which: 11, edge: 2 }];
const templatesBracelets = {
  "fig31.2": [[...braceletScript, { flexes: "<<Tr2+<<", labelAsTree }], { rotation: 135, content: { showLeafProps: true }, captions: [firstStar, lastStar, { text: "Tr2", which: 2, edge: 0 }] }],
  "fig31.4": [[{ angles2: [45, 45], directions: "/||//||//||//||/", pats: tetraPats, labelAsTree }], { rotation: 45, content: { showLeafProps: true }, captions: [firstStar, lastStar, { text: "tetra", which: 2, edge: 0 }] }],
  "fig31.7": [[...braceletScript, { flexes: "Tr4+", labelAsTree }], { rotation: 45, content: { showLeafProps: true }, captions: [firstStar, lastStar, { text: "Tr4", which: -1, edge: 2 }] }],
  "fig31.10": [[...braceletScript, bfScript], { rotation: -45, content: { showLeafProps: true }, captions: bfCaptions }],
  "fig31.X1": [mobiusScript, { rotation: -45, content: { showLeafProps: true }, captions: mobiusCaptions }],
  "fig31.11": [getWrapScript("W*>F*<W'*  W>F'<W'  >>>>"), getWrapOptions(18, [{ text: "F", which: 9, edge: 0 }])],
  "fig31.X2": [getWrapScript("W*>S*<W'*  W>S'<W'  <<<<"), getWrapOptions(104, [{ text: "S", which: 5, edge: 1 }])],
}

///////////
// 34: decorating
const templatesDecorating = {
  "fig34.4": [getSeqScript(8, "P+", [45, 45],), getSeqOptions(180 + 45, -3, 2, "pivot")],
  "fig34.5": [getSeqScript(10, "P+", [36, 36],), getSeqOptions(180 + 36, -6, 2, "pivot")],
  "fig34.6": [getSeqScript(12, "P+", [30, 30],), getSeqOptions(180 + 30, -3, 2, "pivot")],
  "decorate-tuck-deca": [[{ numPats: 10, flexes: "(Tf+>>)5", angles2: [36, 54], labelAsTree }], { rotation: 0, content: { showLeafProps: true } },
  [{ end: 9, captions: [firstStar, { text: "a", which: -1 }] },
  { start: 10, captions: [{ text: "a", which: 0 }, lastStar] }],],
}

///////////
// 36: puzzles
const puzzleHeptaScript = [{
  numPats: 4, flexes: "(P*^>)5", reverseFlexes: "(P*^>)5", angles: [60, 60],
  setLabels: { labels: [[2, 1], [3, 4], [6, 5], [6, "C"], [5, 4], [2, 3], [1, "B"], [1, 2], [4, 3], [5, 6], ["A", 6], [4, 5], [3, 2], ["D", 1]], colors }
}];
const puzzleHeptaCaptions = [firstStar,
  { text: "a", which: -4, edge: 0 }, { text: "b", which: -4, edge: 1 }, { text: "c", which: -4, edge: 2 }, // A
  { text: "a", which: 6, edge: 2 }, { text: "b", which: 6, edge: 0 }, { text: "c", which: 6, edge: 1 }, // B
  { text: "a", which: 3, edge: 0 }, { text: "b", which: 3, edge: 2 }, { text: "c", which: 3, edge: 1 }, // C
  { text: "a⚹", which: -1, edge: 1 }, { text: "b", which: -1, edge: 0 }, { text: "c", which: -1, edge: 2 }, // D
];
const templatesPuzzles = {
  "puzzle-hepta": [puzzleHeptaScript, { rotation: 60, content: { showLeafProps: true }, captions: puzzleHeptaCaptions }],
}

///////////
// 37: popups
const animalScript = [{ pats: [0, 0, [[[0, 0], 0], 0], 0, [[[0, 0], 0], 0]] },
{ angles: [72, 54], setLabels: { labels: [[1, 2], [1, 2], [3, 2], [4, 5], [1, 5], [3, 4], [2, 1], [2, 3], [5, 4], [5, 1], [4, 3]], colors } }];
const templatesPopups = {
  "animal-penta": [animalScript, { rotation: 36 + 90, content: { showLeafProps: true }, captions: starCaptions }],
}

/**
 * details on drawing all the templates, arrays keyed by figure name, e.g., "fig1.1"
 * content is either an image file name or an array with the following items:
 * 1: flexagonator script to create flexagon
 * 2: options for drawing the template
 * 3: [optional] array of additional options when splitting template into multiple pieces
 */
const allTemplates = {
  ...templatesPinch,
  ...templatesMoreFaces,
  ...templatesTetraOcta,
  ...templatesDifferent,
  ...templatesPinchVariations,
  ...templatesBook,
  ...templatesBox,
  ...templatesV,
  ...templatesTuck,
  ...templatesFlip,
  ...templatesS,
  ...templatesBreakdown,
  ...templatesSlot,
  ...templatesStateDiagrams,
  ...templatesSequences,
  ...templatesPatNotation,
  ...templatesSilverOcta,
  ...templatesBronzeDodeca,
  ...templatesSilverDodeca,
  ...templatesBracelets,
  ...templatesDecorating,
  ...templatesPuzzles,
  ...templatesPopups,
};
