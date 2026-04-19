// コードダイアグラムデータ（ChordDiagram.tsx の DIAGRAMS と同期を保つこと）
// strings: 6弦（E A D G B e）の開放弦状態 'o'=開放, 'x'=ミュート
// frets: [弦番号(1-6), フレット(1-5)]

export type ChordDiagram = {
  name: string
  strings: ('o' | 'x')[]
  frets: [number, number][]
  baseFret: number
}

export const chordDiagrams: Record<string, ChordDiagram> = {
  // ── 基本コード ──
  C: { name: 'C', strings: ['x', 'o', 'o', 'o', 'o', 'o'], frets: [[2, 3], [4, 2], [5, 1]], baseFret: 1 },
  D: { name: 'D', strings: ['x', 'x', 'o', 'o', 'o', 'o'], frets: [[3, 2], [4, 3], [5, 2], [6, 2]], baseFret: 1 },
  E: { name: 'E', strings: ['o', 'o', 'o', 'o', 'o', 'o'], frets: [[5, 2], [4, 2], [3, 1]], baseFret: 1 },
  Em: { name: 'Em', strings: ['o', 'o', 'o', 'o', 'o', 'o'], frets: [[5, 2], [4, 2]], baseFret: 1 },
  F: { name: 'F', strings: ['o', 'o', 'o', 'o', 'o', 'o'], frets: [[5, 3], [4, 3], [3, 2]], baseFret: 1 },
  G: { name: 'G', strings: ['o', 'o', 'o', 'o', 'o', 'o'], frets: [[6, 3], [5, 2], [1, 3]], baseFret: 1 },
  A: { name: 'A', strings: ['x', 'o', 'o', 'o', 'o', 'o'], frets: [[5, 2], [4, 2], [3, 2]], baseFret: 1 },
  Am: { name: 'Am', strings: ['x', 'o', 'o', 'o', 'o', 'o'], frets: [[5, 2], [4, 2], [3, 1]], baseFret: 1 },
  Dm: { name: 'Dm', strings: ['x', 'x', 'o', 'o', 'o', 'o'], frets: [[4, 2], [3, 3], [2, 2]], baseFret: 1 },
  Bm: { name: 'Bm', strings: ['x', 'o', 'o', 'o', 'o', 'o'], frets: [[5, 2], [4, 4], [3, 4], [2, 3], [1, 2]], baseFret: 2 },
  B: { name: 'B', strings: ['x', 'o', 'o', 'o', 'o', 'o'], frets: [[5, 2], [4, 4], [3, 4], [2, 4], [1, 2]], baseFret: 2 },
  'C#m': { name: 'C#m', strings: ['x', 'o', 'o', 'o', 'o', 'o'], frets: [[5, 4], [4, 6], [3, 6], [2, 5], [1, 4]], baseFret: 4 },
  // ── 7thコード ──
  D7: { name: 'D7', strings: ['x', 'x', 'o', 'o', 'o', 'o'], frets: [[3, 2], [2, 1], [1, 2]], baseFret: 1 },
  G7: { name: 'G7', strings: ['o', 'o', 'o', 'o', 'o', 'o'], frets: [[6, 3], [5, 2], [1, 1]], baseFret: 1 },
  C7: { name: 'C7', strings: ['x', 'o', 'o', 'o', 'o', 'o'], frets: [[5, 3], [4, 2], [3, 3], [2, 1]], baseFret: 1 },
  E7: { name: 'E7', strings: ['o', 'o', 'o', 'o', 'o', 'o'], frets: [[5, 2], [3, 1], [2, 3]], baseFret: 1 },
  A7: { name: 'A7', strings: ['x', 'o', 'o', 'o', 'o', 'o'], frets: [[4, 2], [2, 2]], baseFret: 1 },
  B7: { name: 'B7', strings: ['x', 'o', 'o', 'o', 'o', 'o'], frets: [[5, 2], [4, 1], [3, 2], [1, 2]], baseFret: 1 },
  Em7: { name: 'Em7', strings: ['o', 'o', 'o', 'o', 'o', 'o'], frets: [[5, 2], [4, 2], [2, 3]], baseFret: 1 },
  Am7: { name: 'Am7', strings: ['x', 'o', 'o', 'o', 'o', 'o'], frets: [[4, 2], [2, 1]], baseFret: 1 },
  Dm7: { name: 'Dm7', strings: ['x', 'x', 'o', 'o', 'o', 'o'], frets: [[3, 2], [2, 1], [1, 1]], baseFret: 1 },
  // ── バレーコード ──
  'F#m': { name: 'F#m', strings: ['o', 'o', 'o', 'o', 'o', 'o'], frets: [[5, 4], [4, 4]], baseFret: 2 },
  'G#m': { name: 'G#m', strings: ['o', 'o', 'o', 'o', 'o', 'o'], frets: [[5, 6], [4, 6], [3, 5]], baseFret: 4 },
  // ── sus4 / maj7 ──
  Fmaj7: { name: 'Fmaj7', strings: ['x', 'o', 'o', 'o', 'o', 'o'], frets: [[5, 3], [4, 3], [3, 2], [2, 1]], baseFret: 1 },
  Cmaj7: { name: 'Cmaj7', strings: ['x', 'o', 'o', 'o', 'o', 'o'], frets: [[5, 3], [4, 2]], baseFret: 1 },
  Dsus4: { name: 'Dsus4', strings: ['x', 'x', 'o', 'o', 'o', 'o'], frets: [[3, 2], [2, 3], [1, 3]], baseFret: 1 },
  Asus4: { name: 'Asus4', strings: ['x', 'o', 'o', 'o', 'o', 'o'], frets: [[4, 2], [3, 2], [2, 3]], baseFret: 1 },
  Esus4: { name: 'Esus4', strings: ['o', 'o', 'o', 'o', 'o', 'o'], frets: [[5, 2], [4, 2], [3, 2]], baseFret: 1 },
  // ── 追加コード ──
  Gaug: { name: 'Gaug', strings: ['o', 'o', 'o', 'o', 'o', 'o'], frets: [[6, 3], [5, 2], [4, 1], [1, 3]], baseFret: 1 },
  Cm: { name: 'Cm', strings: ['x', 'o', 'o', 'o', 'o', 'o'], frets: [[5, 3], [4, 5], [3, 5], [2, 4], [1, 3]], baseFret: 3 },
  Bm7: { name: 'Bm7', strings: ['x', 'o', 'o', 'o', 'o', 'o'], frets: [[5, 2], [3, 2], [2, 3], [1, 2]], baseFret: 1 },
  Gsus4: { name: 'Gsus4', strings: ['o', 'o', 'o', 'o', 'o', 'o'], frets: [[6, 3], [5, 3], [1, 3]], baseFret: 1 },
  Dm9: { name: 'Dm9', strings: ['x', 'x', 'o', 'o', 'o', 'o'], frets: [[3, 2], [2, 1]], baseFret: 1 },
}
