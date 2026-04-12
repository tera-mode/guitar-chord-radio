// コードダイアグラムデータ
// strings: 6弦（E A D G B e）の開放弦状態 'o'=開放, 'x'=ミュート
// frets: [弦番号(1=1弦=e), フレット番号, 指番号]

export type ChordDiagram = {
  name: string
  strings: ('o' | 'x')[] // index 0 = 6弦(E), index 5 = 1弦(e)
  frets: [number, number][] // [弦番号(1-6), フレット(1-5)]
  baseFret: number
}

export const chordDiagrams: Record<string, ChordDiagram> = {
  C: {
    name: 'C',
    strings: ['x', 'o', 'o', 'o', 'o', 'o'],
    frets: [
      [2, 3], // A弦3フレット
      [4, 2], // G弦2フレット
      [5, 1], // B弦1フレット
    ],
    baseFret: 1,
  },
  D: {
    name: 'D',
    strings: ['x', 'x', 'o', 'o', 'o', 'o'],
    frets: [
      [3, 2], // D弦2フレット
      [4, 3], // G弦3フレット
      [5, 2], // B弦2フレット
      [6, 2], // e弦2フレット ... 実際は[1,2]
    ],
    baseFret: 1,
  },
  E: {
    name: 'E',
    strings: ['o', 'o', 'o', 'o', 'o', 'o'],
    frets: [
      [5, 2], // A弦2フレット → 実際は[2,2]
      [4, 2], // D弦2フレット → [3,2]
      [3, 1], // G弦1フレット → [4,1]
    ],
    baseFret: 1,
  },
  Em: {
    name: 'Em',
    strings: ['o', 'o', 'o', 'o', 'o', 'o'],
    frets: [
      [5, 2],
      [4, 2],
    ],
    baseFret: 1,
  },
  F: {
    name: 'F',
    strings: ['o', 'o', 'o', 'o', 'o', 'o'],
    frets: [
      [6, 1],
      [5, 1],
      [4, 1],
      [3, 1],
      [2, 1],
      [1, 1],
      [5, 3],
      [4, 3],
      [3, 2],
    ],
    baseFret: 1,
  },
  G: {
    name: 'G',
    strings: ['o', 'o', 'o', 'o', 'o', 'o'],
    frets: [
      [6, 3],
      [5, 2],
      [4, 0],
      [3, 0],
      [2, 0],
      [1, 3],
    ],
    baseFret: 1,
  },
  A: {
    name: 'A',
    strings: ['x', 'o', 'o', 'o', 'o', 'o'],
    frets: [
      [5, 2],
      [4, 2],
      [3, 2],
    ],
    baseFret: 1,
  },
  Am: {
    name: 'Am',
    strings: ['x', 'o', 'o', 'o', 'o', 'o'],
    frets: [
      [5, 2],
      [4, 2],
      [3, 1],
    ],
    baseFret: 1,
  },
  Dm: {
    name: 'Dm',
    strings: ['x', 'x', 'o', 'o', 'o', 'o'],
    frets: [
      [4, 2],
      [3, 3],
      [2, 2],
    ],
    baseFret: 1,
  },
  Bm: {
    name: 'Bm',
    strings: ['x', 'o', 'o', 'o', 'o', 'o'],
    frets: [
      [5, 2],
      [4, 4],
      [3, 4],
      [2, 3],
      [1, 2],
    ],
    baseFret: 2,
  },
  'C#m': {
    name: 'C#m',
    strings: ['x', 'o', 'o', 'o', 'o', 'o'],
    frets: [
      [5, 4],
      [4, 6],
      [3, 6],
      [2, 5],
      [1, 4],
    ],
    baseFret: 4,
  },
  B: {
    name: 'B',
    strings: ['x', 'o', 'o', 'o', 'o', 'o'],
    frets: [
      [5, 2],
      [4, 4],
      [3, 4],
      [2, 4],
      [1, 2],
    ],
    baseFret: 2,
  },
}
