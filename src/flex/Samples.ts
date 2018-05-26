namespace Flexagonator {

  export const hexaHexaLeafTree: LeafTree = [
    [1, -18], [[4, -5], [2, -3]],
    [7, -6], [[10, -11], [8, -9]],
    [13, -12], [[16, -17], [14, -15]],
  ];

  const hh1 = { label: "1", color: 0x2E4172 };
  const hh2 = { label: "2", color: 0x2B803E };
  const hh3 = { label: "3", color: 0xAA4439 };
  const hh4 = { label: "4", color: 0x622870 };
  const hh5 = { label: "5", color: 0xffff00 };
  const hh6 = { label: "6", color: 0x553900 };

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
