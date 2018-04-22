namespace Flexagonator {

  export const hexaHexaLeafTree: LeafTree = [
    [[1, 2], [3, 4]], [5, 6],
    [[7, 8], [9, 10]], [11, 12],
    [[13, 14], [15, 16]], [17, 18]
  ];

  const hh1 = { label: "1", color: 0x0000ff };
  const hh2 = { label: "2", color: 0x0000ff };
  const hh3 = { label: "3", color: 0x0000ff };
  const hh4 = { label: "4", color: 0x0000ff };
  const hh5 = { label: "5", color: 0x0000ff };
  const hh6 = { label: "6", color: 0x0000ff };

  export const hexaHexaProperties: LeafProperties[] = [
    { front: hh1, back: hh4 },  // 1
    { front: hh2, back: hh4 },  // 2
    { front: hh3, back: hh5 },  // 3
    { front: hh1, back: hh5 },  // 4
    { front: hh2, back: hh6 },  // 5
    { front: hh3, back: hh6 },  // 6
    { front: hh1, back: hh4 },  // 7
    { front: hh2, back: hh4 },  // 8
    { front: hh3, back: hh5 },  // 9
    { front: hh1, back: hh5 },  // 10
    { front: hh2, back: hh6 },  // 11
    { front: hh3, back: hh6 },  // 12
    { front: hh1, back: hh4 },  // 13
    { front: hh2, back: hh4 },  // 14
    { front: hh3, back: hh5 },  // 15
    { front: hh1, back: hh5 },  // 16
    { front: hh2, back: hh6 },  // 17
    { front: hh3, back: hh6 },  // 18
  ]

}
