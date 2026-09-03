namespace Flexagonator {

  /** how to draw on leaves, a collection of leaf-id-to-tile mappings */
  export interface Tiles {
    /** lookup drawing tile info by leaf id (negative for back face) */
    [id: number]: Tile;
    /** add outline around tile? */
    readonly outline?: boolean;
  }

  /** how to draw on a leaf-face */
  export interface Tile {
    /** background color */
    readonly color?: string | number;
    /** items to draw */
    readonly items: ItemType[];
  }


  /**
   * individual drawing items, where coordinates are relative
   * to a leaf baseline that maps to (0,0)-(1,0)
   */
  export type ItemType = ItemLines | ItemPolygon | ItemCircle;

  /** lines connecting a series of points */
  export interface ItemLines {
    readonly color: string | number;
    readonly points: Point[];
  }
  /** a filled polygon */
  export interface ItemPolygon {
    readonly color: string | number;
    readonly corners: Point[];
  }
  /** a circle outline */
  export interface ItemCircle {
    readonly color: string | number;
    readonly center: Point;
    readonly radius: number;
  }

  /** interface that handles every type of drawing item */
  export interface ItemDispatch {
    doLines(item: ItemLines): void;
    doPolygon(item: ItemPolygon): void;
    doCircle(item: ItemCircle): void;
  }

  /** dispatch to the appropriate item handler */
  export function handleItem(dispatch: ItemDispatch, item: ItemType): void {
    if ((item as ItemLines).points !== undefined) {
      dispatch.doLines(item as ItemLines);
    } else if ((item as ItemPolygon).corners !== undefined) {
      dispatch.doPolygon(item as ItemPolygon);
    } else if ((item as ItemCircle).center !== undefined && (item as ItemCircle).radius !== undefined) {
      dispatch.doCircle(item as ItemCircle);
    }
  }

}
