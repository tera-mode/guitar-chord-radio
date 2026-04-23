'use client'

// ギターコードダイアグラム（横向き：左=ナット、右=高フレット）
// 弦：上=1弦(e)、下=6弦(E) — TAB譜と同じ向き
// フレット：左から1フレット、2フレット…

type Props = {
  name: string
  compact?: boolean
  extraCompact?: boolean
  tile?: boolean
}

type DiagramData = {
  // index 0=6弦(E), 5=1弦(e)  'o'=開放 'x'=ミュート '-'=使わない
  strings: ('o' | 'x' | '-')[]
  // [弦番号(1=1弦), フレット番号]
  frets: [number, number][]
  baseFret: number
  // [フレット, 最高弦番号(1=1弦)] — そのフレットで1弦〜指定弦をバレー
  barre?: [number, number]
}

const DIAGRAMS: Record<string, DiagramData> = {
  // idx: 0=6弦(E低), 1=5弦(A), 2=4弦(D), 3=3弦(G), 4=2弦(B), 5=1弦(e高)
  C: {
    strings: ['x', '-', '-', 'o', '-', 'o'],  // x32010
    frets: [[5, 3], [4, 2], [2, 1]],
    baseFret: 1,
  },
  D: {
    strings: ['x', 'x', 'o', '-', '-', '-'],  // xx0232
    frets: [[3, 2], [2, 3], [1, 2]],
    baseFret: 1,
  },
  E: {
    strings: ['o', '-', '-', '-', 'o', 'o'],  // 022100
    frets: [[5, 2], [4, 2], [3, 1]],
    baseFret: 1,
  },
  Em: {
    strings: ['o', '-', '-', 'o', 'o', 'o'],  // 022000
    frets: [[5, 2], [4, 2]],
    baseFret: 1,
  },
  F: {
    strings: ['-', '-', '-', '-', '-', '-'],  // 133211
    frets: [[5, 3], [4, 3], [3, 2]],
    baseFret: 1,
    barre: [1, 1],
  },
  G: {
    strings: ['-', '-', 'o', 'o', 'o', '-'],  // 320003
    frets: [[6, 3], [5, 2], [1, 3]],
    baseFret: 1,
  },
  A: {
    strings: ['x', 'o', '-', '-', '-', 'o'],  // x02220
    frets: [[4, 2], [3, 2], [2, 2]],
    baseFret: 1,
  },
  Am: {
    strings: ['x', 'o', '-', '-', '-', 'o'],  // x02210
    frets: [[4, 2], [3, 2], [2, 1]],
    baseFret: 1,
  },
  Dm: {
    strings: ['x', 'x', 'o', '-', '-', '-'],  // xx0231
    frets: [[3, 2], [2, 3], [1, 1]],
    baseFret: 1,
  },
  Bm: {
    strings: ['x', '-', '-', '-', '-', '-'],  // x24432
    frets: [[4, 4], [3, 4], [2, 3]],
    baseFret: 2,
    barre: [2, 1],
  },
  B: {
    strings: ['x', '-', '-', '-', '-', '-'],  // x24442
    frets: [[4, 4], [3, 4], [2, 4]],
    baseFret: 2,
    barre: [2, 1],
  },
  'C#m': {
    strings: ['x', '-', '-', '-', '-', '-'],  // x46654
    frets: [[4, 6], [3, 6], [2, 5]],
    baseFret: 4,
    barre: [4, 1],
  },
  // 7th chords
  D7: {
    strings: ['x', 'x', 'o', '-', '-', '-'],  // xx0212
    frets: [[3, 2], [2, 1], [1, 2]],
    baseFret: 1,
  },
  G7: {
    strings: ['-', '-', 'o', 'o', 'o', '-'],  // 320001
    frets: [[6, 3], [5, 2], [1, 1]],
    baseFret: 1,
  },
  C7: {
    strings: ['x', '-', '-', '-', '-', 'o'],  // x32310
    frets: [[5, 3], [4, 2], [3, 3], [2, 1]],
    baseFret: 1,
  },
  E7: {
    strings: ['o', '-', 'o', '-', '-', 'o'],  // 020130
    frets: [[5, 2], [3, 1], [2, 3]],
    baseFret: 1,
  },
  A7: {
    strings: ['x', 'o', '-', 'o', '-', 'o'],  // x02020
    frets: [[4, 2], [2, 2]],
    baseFret: 1,
  },
  B7: {
    strings: ['x', '-', '-', '-', 'o', '-'],  // x21202
    frets: [[5, 2], [4, 1], [3, 2], [1, 2]],
    baseFret: 1,
  },
  Em7: {
    strings: ['o', '-', '-', 'o', '-', 'o'],  // 022030
    frets: [[5, 2], [4, 2], [2, 3]],
    baseFret: 1,
  },
  Am7: {
    strings: ['x', 'o', '-', 'o', '-', 'o'],  // x02010
    frets: [[4, 2], [2, 1]],
    baseFret: 1,
  },
  Dm7: {
    strings: ['x', 'x', 'o', '-', '-', '-'],  // xx0211
    frets: [[3, 2], [2, 1], [1, 1]],
    baseFret: 1,
  },
  // バレーコード
  'F#m': {
    strings: ['-', '-', '-', '-', '-', '-'],  // 244222
    frets: [[5, 4], [4, 4]],
    baseFret: 2,
    barre: [2, 1],
  },
  'G#m': {
    strings: ['-', '-', '-', '-', '-', '-'],  // 466444
    frets: [[5, 6], [4, 6]],
    baseFret: 4,
    barre: [4, 1],
  },
  // sus4 / maj7
  Fmaj7: {
    strings: ['x', '-', '-', '-', '-', 'o'],  // x33210
    frets: [[5, 3], [4, 3], [3, 2], [2, 1]],
    baseFret: 1,
  },
  Cmaj7: {
    strings: ['x', '-', '-', 'o', 'o', 'o'],  // x32000
    frets: [[5, 3], [4, 2]],
    baseFret: 1,
  },
  Dsus4: {
    strings: ['x', 'x', 'o', '-', '-', '-'],  // xx0233
    frets: [[3, 2], [2, 3], [1, 3]],
    baseFret: 1,
  },
  Asus4: {
    strings: ['x', 'o', '-', '-', '-', 'o'],  // x02230
    frets: [[4, 2], [3, 2], [2, 3]],
    baseFret: 1,
  },
  Esus4: {
    strings: ['o', '-', '-', '-', 'o', 'o'],  // 022200
    frets: [[5, 2], [4, 2], [3, 2]],
    baseFret: 1,
  },
  // ── 追加コード ──
  Gaug: {
    strings: ['-', '-', '-', 'o', 'o', '-'],  // 321003
    frets: [[6, 3], [5, 2], [4, 1], [1, 3]],
    baseFret: 1,
  },
  Cm: {
    strings: ['x', '-', '-', '-', '-', '-'],  // x35543
    frets: [[4, 5], [3, 5], [2, 4]],
    baseFret: 3,
    barre: [3, 1],
  },
  Bm7: {
    strings: ['x', '-', 'o', '-', '-', '-'],  // x20232
    frets: [[5, 2], [3, 2], [2, 3], [1, 2]],
    baseFret: 1,
  },
  Gsus4: {
    strings: ['-', '-', 'o', 'o', 'o', '-'],  // 330033
    frets: [[6, 3], [5, 3], [1, 3]],
    baseFret: 1,
  },
  Gm7: {
    strings: ['-', '-', '-', '-', '-', '-'],  // 353333
    frets: [[5, 5]],
    baseFret: 3,
    barre: [3, 1],
  },
  Dm9: {
    strings: ['x', '-', 'o', '-', '-', 'o'],  // x50550
    frets: [[5, 5], [3, 5], [2, 5]],
    baseFret: 1,
  },
  Bb: {
    strings: ['x', '-', '-', '-', '-', '-'],  // x13331
    frets: [[4, 3], [3, 3], [2, 3]],
    baseFret: 1,
    barre: [1, 1],
  },
  // ── add9 / maj7m / オンコード ──
  Cadd9: {
    strings: ['x', '-', '-', 'o', '-', 'o'],  // x32030
    frets: [[5, 3], [4, 2], [2, 3]],
    baseFret: 1,
  },
  Bbadd9: {
    strings: ['x', '-', '-', '-', '-', '-'],  // x13311
    frets: [[4, 3], [3, 3]],
    baseFret: 1,
    barre: [1, 1],
  },
  'D/F#': {
    strings: ['-', 'o', 'o', '-', '-', '-'],  // 200232
    frets: [[6, 2], [3, 2], [2, 3], [1, 2]],
    baseFret: 1,
  },
  'G/D': {
    strings: ['x', 'x', 'o', 'o', '-', '-'],  // xx0033
    frets: [[2, 3], [1, 3]],
    baseFret: 1,
  },
  'Em/D': {
    strings: ['x', 'x', 'o', 'o', 'o', 'o'],  // xx0000 (Em7/D と兼用の簡易形)
    frets: [],
    baseFret: 1,
  },
  'B/D#': {
    strings: ['x', 'x', '-', '-', '-', '-'],  // xx1442
    frets: [[4, 1], [3, 4], [2, 4], [1, 2]],
    baseFret: 1,
  },
  EmM7: {
    strings: ['o', '-', '-', 'o', 'o', 'o'],  // 021000
    frets: [[5, 2], [4, 1]],
    baseFret: 1,
  },
  'C#m7-5': {
    strings: ['x', '-', '-', '-', '-', 'x'],  // x4545x
    frets: [[5, 4], [4, 5], [3, 4], [2, 5]],
    baseFret: 4,
  },
  'EmM7/F#': {
    strings: ['-', '-', '-', 'o', 'o', 'o'],  // 221000
    frets: [[6, 2], [5, 2], [4, 1]],
    baseFret: 1,
  },
  'D/C': {
    strings: ['x', '-', 'o', '-', '-', '-'],  // x30232
    frets: [[5, 3], [3, 2], [2, 3], [1, 2]],
    baseFret: 1,
  },
  AmM7: {
    strings: ['x', 'o', '-', '-', '-', 'o'],  // x02110
    frets: [[4, 2], [3, 1], [2, 1]],
    baseFret: 1,
  },
  Eb: {
    strings: ['x', '-', '-', '-', '-', '-'],  // x68886
    frets: [[4, 8], [3, 8], [2, 8]],
    baseFret: 6,
    barre: [6, 1],
  },
  // ── 追加マイナーコード ──
  Gm: {
    strings: ['-', '-', '-', '-', '-', '-'],  // 355333
    frets: [[5, 5], [4, 5]],
    baseFret: 3,
    barre: [3, 1],
  },
  Fm: {
    strings: ['-', '-', '-', '-', '-', '-'],  // 133111
    frets: [[5, 3], [4, 3]],
    baseFret: 1,
    barre: [1, 1],
  },
  // ── 追加7thコード ──
  Fm7: {
    strings: ['-', '-', '-', '-', '-', '-'],  // 131111
    frets: [[5, 3]],
    baseFret: 1,
    barre: [1, 1],
  },
  Cm7: {
    strings: ['x', '-', '-', '-', '-', '-'],  // x35343
    frets: [[4, 5], [2, 4]],
    baseFret: 3,
    barre: [3, 1],
  },
  'C#m7': {
    strings: ['x', '-', '-', '-', '-', '-'],  // x46454
    frets: [[4, 6], [2, 5]],
    baseFret: 4,
    barre: [4, 1],
  },
  'F#m7': {
    strings: ['-', '-', '-', '-', '-', '-'],  // 242222
    frets: [[5, 4]],
    baseFret: 2,
    barre: [2, 1],
  },
  'A#m7': {
    strings: ['x', '-', '-', '-', '-', '-'],  // x13121
    frets: [[4, 3], [2, 2]],
    baseFret: 1,
    barre: [1, 1],
  },
  'C#7': {
    strings: ['x', '-', '-', '-', '-', 'x'],  // x43424
    frets: [[5, 4], [4, 3], [3, 4], [2, 2]],
    baseFret: 1,
  },
  'F#7': {
    strings: ['-', '-', '-', '-', '-', '-'],  // 242322
    frets: [[5, 4], [3, 3]],
    baseFret: 2,
    barre: [2, 1],
  },
  'F#': {
    strings: ['-', '-', '-', '-', '-', '-'],  // 244322
    frets: [[5, 4], [4, 4], [3, 3]],
    baseFret: 2,
    barre: [2, 1],
  },
  // ── sus4 / maj7 追加 ──
  Csus4: {
    strings: ['x', '-', '-', 'o', '-', '-'],  // x33011
    frets: [[5, 3], [4, 3], [2, 1], [1, 1]],
    baseFret: 1,
  },
  'C#sus4': {
    strings: ['x', 'x', '-', '-', '-', '-'],  // xx3344
    frets: [[4, 3], [3, 3], [2, 4], [1, 4]],
    baseFret: 1,
  },
  'F#sus4': {
    strings: ['-', '-', '-', '-', '-', '-'],  // 244422
    frets: [[5, 4], [4, 4], [3, 4]],
    baseFret: 2,
    barre: [2, 1],
  },
  B7sus4: {
    strings: ['x', '-', '-', '-', '-', '-'],  // x22252
    frets: [[2, 5]],
    baseFret: 1,
    barre: [2, 1],
  },
  A7sus4: {
    strings: ['x', 'o', '-', 'o', '-', 'o'],  // x02030
    frets: [[4, 2], [2, 3]],
    baseFret: 1,
  },
  Em7sus4: {
    strings: ['o', '-', '-', '-', '-', 'o'],  // 022230
    frets: [[5, 2], [4, 2], [3, 2], [2, 3]],
    baseFret: 1,
  },
  Gmaj7: {
    strings: ['-', '-', 'o', 'o', 'o', '-'],  // 320002
    frets: [[6, 3], [5, 2], [1, 2]],
    baseFret: 1,
  },
  // ── 6thコード ──
  G6: {
    strings: ['-', '-', 'o', 'o', 'o', 'o'],  // 320000
    frets: [[6, 3], [5, 2]],
    baseFret: 1,
  },
  D6: {
    strings: ['x', 'o', 'o', '-', 'o', '-'],  // x00202
    frets: [[3, 2], [1, 2]],
    baseFret: 1,
  },
  // ── m7b5 (half-diminished) ──
  'F#m7b5': {
    strings: ['-', 'x', '-', '-', '-', 'x'],  // 2x222x
    frets: [[6, 2], [4, 2], [3, 2], [2, 1]],
    baseFret: 1,
  },
  Fm7b5: {
    strings: ['-', 'x', '-', '-', 'o', 'x'],  // 1x110x
    frets: [[6, 1], [4, 1], [3, 1]],
    baseFret: 1,
  },
  // ── テンション ──
  Am9: {
    strings: ['x', 'o', '-', 'o', '-', '-'],  // x02012
    frets: [[4, 2], [2, 1], [1, 2]],
    baseFret: 1,
  },
  Ddim: {
    strings: ['x', 'x', 'o', '-', '-', '-'],  // xx0131
    frets: [[3, 1], [2, 3], [1, 1]],
    baseFret: 1,
  },
  // ── オンコード (スラッシュコード) ──
  'G/B': {
    strings: ['x', '-', 'o', 'o', '-', '-'],  // x20033
    frets: [[5, 2], [2, 3], [1, 3]],
    baseFret: 1,
  },
  'C/G': {
    strings: ['-', '-', '-', 'o', '-', 'o'],  // 332010
    frets: [[6, 3], [5, 3], [4, 2], [2, 1]],
    baseFret: 1,
  },
  'G/F': {
    strings: ['-', 'x', 'o', 'o', 'o', '-'],  // 1x0003
    frets: [[6, 1], [1, 3]],
    baseFret: 1,
  },
  'G/A': {
    strings: ['x', 'o', '-', 'o', 'o', '-'],  // x02003
    frets: [[4, 2], [1, 3]],
    baseFret: 1,
  },
  'F/A': {
    strings: ['x', 'o', '-', '-', '-', '-'],  // x03211
    frets: [[4, 3], [3, 2], [2, 1], [1, 1]],
    baseFret: 1,
  },
  'A/G': {
    strings: ['-', 'x', '-', '-', '-', 'o'],  // 3x2220
    frets: [[6, 3], [4, 2], [3, 2], [2, 2]],
    baseFret: 1,
  },
  'A/C#': {
    strings: ['x', '-', '-', '-', '-', 'o'],  // x42220
    frets: [[5, 4], [4, 2], [3, 2], [2, 2]],
    baseFret: 1,
  },
  'D/A': {
    strings: ['x', 'o', 'o', '-', '-', '-'],  // x00232
    frets: [[3, 2], [2, 3], [1, 2]],
    baseFret: 1,
  },
  'E/G#': {
    strings: ['-', '-', '-', '-', 'o', 'o'],  // 422100
    frets: [[6, 4], [5, 2], [4, 2], [3, 1]],
    baseFret: 1,
  },
  // ── 7thオンコード ──
  'G7/B': {
    strings: ['x', '-', 'o', 'o', 'o', '-'],  // x20001
    frets: [[5, 2], [1, 1]],
    baseFret: 1,
  },
  'Am7/G': {
    strings: ['-', 'o', '-', 'o', '-', 'o'],  // 302010
    frets: [[6, 3], [4, 2], [2, 1]],
    baseFret: 1,
  },
  'Am7/D': {
    strings: ['x', 'x', 'o', '-', '-', 'o'],  // xx0210
    frets: [[3, 2], [2, 1]],
    baseFret: 1,
  },
  'Em7/A': {
    strings: ['x', 'o', '-', 'o', '-', 'o'],  // x02030
    frets: [[4, 2], [2, 3]],
    baseFret: 1,
  },
  'Dm7/G': {
    strings: ['-', 'x', 'o', '-', '-', '-'],  // 3x0211
    frets: [[6, 3], [3, 2], [2, 1], [1, 1]],
    baseFret: 1,
  },
  'Bm7/E': {
    strings: ['o', '-', 'o', '-', '-', '-'],  // 020232
    frets: [[5, 2], [3, 2], [2, 3], [1, 2]],
    baseFret: 1,
  },
  'Em7/G': {
    strings: ['-', 'x', '-', 'o', '-', 'o'],  // 3x2030
    frets: [[6, 3], [4, 2], [2, 3]],
    baseFret: 1,
  },
  Fsus4: {
    strings: ['-', '-', '-', '-', '-', '-'],  // 133311
    frets: [[5, 3], [4, 3], [3, 3]],
    baseFret: 1,
    barre: [1, 1],
  },
  'Dm/F': {
    strings: ['x', 'x', '-', '-', '-', '-'],  // xx3231
    frets: [[4, 3], [3, 2], [2, 3], [1, 1]],
    baseFret: 1,
  },
  'G/C': {
    strings: ['x', '-', 'o', 'o', 'o', '-'],  // x30003
    frets: [[5, 3], [1, 3]],
    baseFret: 1,
  },
  // ── 80s用追加 ──
  Dadd9: {
    strings: ['x', 'o', 'o', '-', '-', 'o'],  // x00230
    frets: [[3, 2], [2, 3]],
    baseFret: 1,
  },
  D7sus4: {
    strings: ['x', 'o', 'o', 'o', '-', '-'],  // x0001 3 相当
    frets: [[2, 1], [1, 3]],
    baseFret: 1,
  },
  'C/D': {
    strings: ['x', 'x', 'o', 'o', '-', 'o'],  // xx0010
    frets: [[2, 1]],
    baseFret: 1,
  },
  'A/B': {
    strings: ['x', '-', '-', '-', '-', 'o'],  // x22220
    frets: [[5, 2], [4, 2], [3, 2], [2, 2]],
    baseFret: 1,
  },
  Bm7b5: {
    strings: ['x', '-', '-', '-', '-', 'x'],  // x2323x
    frets: [[5, 2], [4, 3], [3, 2], [2, 3]],
    baseFret: 1,
  },
  Em7b5: {
    strings: ['o', 'x', '-', '-', '-', 'x'],  // 0x2330
    frets: [[4, 2], [3, 3], [2, 3]],
    baseFret: 1,
  },
  Bbmaj7: {
    strings: ['x', '-', '-', '-', '-', '-'],  // x13231
    frets: [[4, 3], [3, 2], [2, 3]],
    baseFret: 1,
    barre: [1, 1],
  },
  Dmaj7: {
    strings: ['x', 'x', 'o', '-', '-', '-'],  // xx0222
    frets: [[3, 2], [2, 2], [1, 2]],
    baseFret: 1,
  },
  Caug: {
    strings: ['x', '-', '-', '-', '-', 'o'],  // x32110
    frets: [[5, 3], [4, 2], [3, 1], [2, 1]],
    baseFret: 1,
  },
  'F/G': {
    strings: ['-', 'x', '-', '-', '-', '-'],  // 3x3211
    frets: [[6, 3], [4, 3], [3, 2], [2, 1], [1, 1]],
    baseFret: 1,
  },
  Gdim: {
    strings: ['-', '-', '-', '-', 'x', 'x'],  // 345300
    frets: [[6, 3], [5, 4], [4, 5], [3, 3]],
    baseFret: 1,
  },
  'G#dim': {
    strings: ['-', '-', '-', '-', 'x', 'x'],  // 456400
    frets: [[6, 4], [5, 5], [4, 6], [3, 4]],
    baseFret: 1,
  },
  Fdim: {
    strings: ['-', '-', '-', '-', 'x', 'x'],  // 123100
    frets: [[6, 1], [5, 2], [4, 3], [3, 1]],
    baseFret: 1,
  },
  'Am/G': {
    strings: ['-', 'o', '-', '-', '-', 'o'],  // 302210
    frets: [[6, 3], [4, 2], [3, 2], [2, 1]],
    baseFret: 1,
  },
  'G/E': {
    strings: ['o', '-', 'o', 'o', 'o', '-'],  // 020003
    frets: [[5, 2], [1, 3]],
    baseFret: 1,
  },
  'C#': {
    strings: ['x', '-', '-', '-', '-', '-'],  // x46664
    frets: [[4, 6], [3, 6], [2, 6]],
    baseFret: 4,
    barre: [4, 1],
  },
  F6: {
    strings: ['x', 'x', '-', '-', '-', '-'],  // xx3211
    frets: [[4, 3], [3, 2], [2, 1], [1, 1]],
    baseFret: 1,
  },
  Gadd9: {
    strings: ['-', '-', 'o', 'o', 'o', '-'],  // 320003 (G と兼用の簡易形)
    frets: [[6, 3], [5, 2], [1, 3]],
    baseFret: 1,
  },
  'A#': {
    strings: ['x', '-', '-', '-', '-', '-'],  // x13331 (Bb と同音異名)
    frets: [[4, 3], [3, 3], [2, 3]],
    baseFret: 1,
    barre: [1, 1],
  },
}

const STRING_COUNT = 6
const FRET_COUNT = 5

// サイズ設定（横向きレイアウト）
const SIZES = {
  normal: {
    W: 170, H: 100,
    ML: 24,  // 左マージン（開放/ミュート記号スペース）
    MR: 8,   // 右マージン
    MT: 20,  // 上マージン（コード名）
    MB: 4,   // 下マージン
    DOT_R: 6,
    FONT: 12,
    SMALL_FONT: 8,
  },
  compact: {
    W: 105, H: 64,
    ML: 16,
    MR: 6,
    MT: 14,
    MB: 3,
    DOT_R: 4,
    FONT: 9,
    SMALL_FONT: 6,
  },
  'extra-compact': {
    W: 82, H: 50,
    ML: 12,
    MR: 5,
    MT: 11,
    MB: 2,
    DOT_R: 3,
    FONT: 7,
    SMALL_FONT: 5,
  },
  tile: {
    W: 54, H: 40,
    ML: 9,
    MR: 3,
    MT: 8,  // フレット番号表示用に余白を確保
    MB: 2,
    DOT_R: 2.3,
    FONT: 0,
    SMALL_FONT: 4,
  },
}

export default function ChordDiagram({ name, compact = false, extraCompact = false, tile = false }: Props) {
  const data = DIAGRAMS[name]
  const sizeKey = tile ? 'tile' : extraCompact ? 'extra-compact' : compact ? 'compact' : 'normal'
  const { W, H, ML, MR, MT, MB, DOT_R, FONT, SMALL_FONT } = SIZES[sizeKey]
  const dotColor = tile ? '#e4e4e7' : '#1f2937'
  const lineColor = tile ? '#71717a' : '#9ca3af'
  const fretColor = tile ? '#52525b' : '#d1d5db'

  const gridW = W - ML - MR
  const gridH = H - MT - MB
  const FRET_SPACING = gridW / FRET_COUNT
  const STRING_SPACING = gridH / (STRING_COUNT - 1)

  if (!data) {
    return (
      <div
        className="flex items-center justify-center bg-gray-100 rounded text-gray-500"
        style={{ width: W, height: H, fontSize: FONT }}
      >
        {name}
      </div>
    )
  }

  const { strings, frets, baseFret, barre } = data

  const strY = (str: number) => MT + (str - 1) * STRING_SPACING
  const fretX = (fret: number) => ML + (fret - baseFret + 0.5) * FRET_SPACING
  const strNumFromIdx = (i: number) => STRING_COUNT - i

  return (
    <div className="flex flex-col items-center">
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        {/* コード名 */}
        {!tile && (
          <text
            x={W / 2} y={MT - 6}
            textAnchor="middle" fontSize={FONT} fontWeight="bold" fill="#1f2937"
          >
            {name}
          </text>
        )}

        {/* ナット（太線）or baseFret番号 */}
        {baseFret === 1 ? (
          <rect x={ML} y={MT} width={compact || extraCompact ? 3 : tile ? 2.5 : 4} height={gridH} fill={dotColor} />
        ) : (
          <>
            {/* 薄いナット線：ハイポジションでも描画位置の起点を示す */}
            <rect x={ML} y={MT} width={tile ? 0.8 : 1.2} height={gridH} fill={dotColor} opacity={0.35} />
            {/* フレット番号：1フレット目位置の上に数字のみ表示（frは省略、バレーの上側に配置） */}
            <text
              x={ML + FRET_SPACING * 0.5}
              y={tile ? MT - 3 : MT - 3}
              textAnchor="middle"
              dominantBaseline="alphabetic"
              fontSize={tile ? 7 : extraCompact ? 9 : compact ? 11 : 13}
              fontWeight="bold"
              fill={dotColor}
            >
              {baseFret}
            </text>
          </>
        )}

        {/* フレット線（縦線） */}
        {Array.from({ length: FRET_COUNT }).map((_, i) => (
          <line
            key={i}
            x1={ML + (i + 1) * FRET_SPACING} y1={MT}
            x2={ML + (i + 1) * FRET_SPACING} y2={MT + gridH}
            stroke={fretColor} strokeWidth={0.8}
          />
        ))}

        {/* 弦（横線） */}
        {Array.from({ length: STRING_COUNT }).map((_, i) => (
          <line
            key={i}
            x1={ML} y1={MT + i * STRING_SPACING}
            x2={ML + gridW} y2={MT + i * STRING_SPACING}
            stroke={lineColor} strokeWidth={0.8}
          />
        ))}

        {/* バレーコード */}
        {barre && (() => {
          const cx = fretX(barre[0])
          const y1 = strY(barre[1])
          const y2 = strY(STRING_COUNT)
          return (
            <rect
              x={cx - DOT_R}
              y={y1 - DOT_R}
              width={DOT_R * 2}
              height={y2 - y1 + DOT_R * 2}
              rx={DOT_R}
              fill={dotColor}
            />
          )
        })()}

        {/* 押さえる位置（ドット） */}
        {frets.map(([str, fret], i) => (
          <circle
            key={i}
            cx={fretX(fret)}
            cy={strY(str)}
            r={DOT_R}
            fill={dotColor}
          />
        ))}

        {/* 開放弦・ミュート記号 */}
        {strings.map((s, idx) => {
          const str = strNumFromIdx(idx)
          const y = strY(str)
          const cx = ML - (tile ? 5 : extraCompact ? 6 : compact ? 8 : 11)
          const r = tile ? 1.8 : extraCompact ? 2 : compact ? 2.5 : 4
          const cr = tile ? 1.2 : extraCompact ? 1.5 : compact ? 2 : 3

          if (s === 'o') {
            return (
              <circle key={idx} cx={cx} cy={y} r={r} stroke={dotColor} strokeWidth={1.2} fill="none" />
            )
          }
          if (s === 'x') {
            return (
              <g key={idx}>
                <line x1={cx - cr} y1={y - cr} x2={cx + cr} y2={y + cr} stroke={dotColor} strokeWidth={1.2} />
                <line x1={cx + cr} y1={y - cr} x2={cx - cr} y2={y + cr} stroke={dotColor} strokeWidth={1.2} />
              </g>
            )
          }
          return null
        })}
      </svg>
    </div>
  )
}
