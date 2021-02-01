namespace Flexagonator {

  // a list of flexes associated with a hinge of a flexagon,
  // you can tack on the prefix & postfix to preserve the current hinge
  export interface RegionForFlexes {
    readonly flexes: string[];  // e.g. [ 'P', 'S' ]
    readonly prefix: string;    // e.g. '>>'
    readonly postfix: string;   // e.g. '<<'
    readonly corner: Point;
    readonly isOnLeft: boolean;
    readonly isOnTop: boolean;
  }

  // for every hinge of a flexagon, figure out which flexes can be performed,
  // if 'generate', then it allows every flex in generate-mode, e.g. 'P*'
  export function createFlexRegions(flexagon: Flexagon, allFlexes: Flexes,
    flexesToSearch: Flexes, flip: boolean, generate: boolean, polygon: Polygon
  ): RegionForFlexes[] {

    const regions: RegionForFlexes[] = [];
    const corners = polygon.getCorners();
    const genFlexes: string[] = generate ? getGenFlexes(flexesToSearch) : [];
    let prefix = "", postfix = "";
    for (let i = 0; i < flexagon.getPatCount(); i++) {
      const flexes: string[] = generate
        ? genFlexes
        : checkForFlexesAtHinge(flexagon, allFlexes, flexesToSearch, flip, i);

      const x = corners[i * 2];
      const y = corners[i * 2 + 1];
      const region = {
        flexes: flexes,
        prefix: prefix,
        postfix: postfix,
        corner: { x: x, y: y },
        isOnLeft: x < polygon.xCenter,
        isOnTop: y < polygon.yCenter,
      };
      regions.push(region);

      prefix += ">";
      postfix += "<";
    }
    return regions;
  }

  function getGenFlexes(flexes: Flexes): string[] {
    return Object.keys(flexes).map(name => name + '*');
  }

}
