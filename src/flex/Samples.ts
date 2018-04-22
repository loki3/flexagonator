namespace Flexagonator {

  export const hexaHexaLeafTree: LeafTree = [
    [1, -18], [[4, -5], [2, -3]],
    [7, -6], [[10, -11], [8, -9]],
    [13, -12], [[16, -17], [14, -15]],
  ];

  const hh1 = { label: "1", color: 0x0000ff };
  const hh2 = { label: "2", color: 0x00ff00 };
  const hh3 = { label: "3", color: 0xff0000 };
  const hh4 = { label: "4", color: 0xffff00 };
  const hh5 = { label: "5", color: 0xff00ff };
  const hh6 = { label: "6", color: 0x00ffff };

  export const hexaHexaProperties: LeafProperties[] = [
    { front: hh1, back: hh4 },  // 1
    { front: hh2, back: hh5 },  // 2
    { front: hh3, back: hh5 },  // 3
    { front: hh1, back: hh6 },  // 4
    { front: hh2, back: hh6 },  // 5
    { front: hh3, back: hh4 },  // 6
    { front: hh1, back: hh4 },  // 7
    { front: hh2, back: hh5 },  // 8
    { front: hh3, back: hh5 },  // 9
    { front: hh1, back: hh6 },  // 10
    { front: hh2, back: hh6 },  // 11
    { front: hh3, back: hh4 },  // 12
    { front: hh1, back: hh4 },  // 13
    { front: hh2, back: hh5 },  // 14
    { front: hh3, back: hh5 },  // 15
    { front: hh1, back: hh6 },  // 16
    { front: hh2, back: hh6 },  // 17
    { front: hh3, back: hh4 },  // 18
  ]

}
