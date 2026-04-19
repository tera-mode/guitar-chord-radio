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
  C: {
    strings: ['-', 'o', 'o', 'o', 'o', 'x'],
    frets: [[5, 1], [3, 2], [2, 3]],
    baseFret: 1,
  },
  D: {
    strings: ['-', '-', 'o', 'o', 'o', 'x'],
    frets: [[1, 2], [2, 3], [3, 2]],
    baseFret: 1,
  },
  E: {
    strings: ['o', 'o', 'o', 'o', 'o', 'o'],
    frets: [[5, 2], [4, 2], [3, 1]],
    baseFret: 1,
  },
  Em: {
    strings: ['o', 'o', 'o', 'o', 'o', 'o'],
    frets: [[5, 2], [4, 2]],
    baseFret: 1,
  },
  F: {
    strings: ['o', 'o', 'o', 'o', 'o', 'o'],
    frets: [[5, 3], [4, 3], [3, 2]],
    baseFret: 1,
    barre: [1, 1],
  },
  G: {
    strings: ['o', 'o', 'o', 'o', 'o', 'o'],
    frets: [[6, 3], [5, 2], [1, 3]],
    baseFret: 1,
  },
  A: {
    strings: ['-', 'o', 'o', 'o', 'o', 'x'],
    frets: [[4, 2], [3, 2], [2, 2]],
    baseFret: 1,
  },
  Am: {
    strings: ['-', 'o', 'o', 'o', 'o', 'x'],
    frets: [[4, 2], [3, 2], [2, 1]],
    baseFret: 1,
  },
  Dm: {
    strings: ['-', '-', 'o', 'o', 'o', 'x'],
    frets: [[3, 2], [2, 3], [1, 1]],
    baseFret: 1,
  },
  Bm: {
    strings: ['-', 'o', 'o', 'o', 'o', 'x'],
    frets: [[4, 4], [3, 4], [2, 3]],
    baseFret: 2,
    barre: [2, 1],
  },
  B: {
    strings: ['-', 'o', 'o', 'o', 'o', 'x'],
    frets: [[4, 4], [3, 4], [2, 4]],
    baseFret: 2,
    barre: [2, 1],
  },
  'C#m': {
    strings: ['-', 'o', 'o', 'o', 'o', 'x'],
    frets: [[4, 6], [3, 6], [2, 5]],
    baseFret: 4,
    barre: [4, 1],
  },
  // 7th chords
  D7: {
    strings: ['-', '-', 'o', 'o', 'o', 'x'],
    frets: [[3, 2], [2, 1], [1, 2]],
    baseFret: 1,
  },
  G7: {
    strings: ['o', 'o', 'o', 'o', 'o', 'o'],
    frets: [[6, 3], [5, 2], [1, 1]],
    baseFret: 1,
  },
  C7: {
    strings: ['-', 'o', 'o', 'o', 'o', 'x'],
    frets: [[5, 3], [4, 2], [3, 3], [2, 1]],
    baseFret: 1,
  },
  E7: {
    strings: ['o', 'o', 'o', 'o', 'o', 'o'],
    frets: [[5, 2], [3, 1], [2, 3]],
    baseFret: 1,
  },
  A7: {
    strings: ['-', 'o', 'o', 'o', 'o', 'x'],
    frets: [[4, 2], [2, 2]],
    baseFret: 1,
  },
  B7: {
    strings: ['-', 'o', 'o', 'o', 'o', 'x'],
    frets: [[5, 2], [4, 1], [3, 2], [1, 2]],
    baseFret: 1,
  },
  Em7: {
    strings: ['o', 'o', 'o', 'o', 'o', 'o'],
    frets: [[5, 2], [4, 2], [2, 3]],
    baseFret: 1,
  },
  Am7: {
    strings: ['-', 'o', 'o', 'o', 'o', 'x'],
    frets: [[4, 2], [2, 1]],
    baseFret: 1,
  },
  Dm7: {
    strings: ['-', '-', 'o', 'o', 'o', 'x'],
    frets: [[3, 2], [2, 1], [1, 1]],
    baseFret: 1,
  },
  // バレーコード
  'F#m': {
    strings: ['o', 'o', 'o', 'o', 'o', 'o'],
    frets: [[5, 4], [4, 4]],
    baseFret: 2,
    barre: [2, 1],
  },
  'G#m': {
    strings: ['o', 'o', 'o', 'o', 'o', 'o'],
    frets: [[5, 6], [4, 6], [3, 5]],
    baseFret: 4,
    barre: [4, 1],
  },
  // sus4 / maj7
  Fmaj7: {
    strings: ['-', 'o', 'o', 'o', 'o', 'x'],
    frets: [[5, 3], [4, 3], [3, 2], [2, 1]],
    baseFret: 1,
  },
  Cmaj7: {
    strings: ['-', 'o', 'o', 'o', 'o', 'x'],
    frets: [[5, 3], [4, 2]],
    baseFret: 1,
  },
  Dsus4: {
    strings: ['-', '-', 'o', 'o', 'o', 'x'],
    frets: [[3, 2], [2, 3], [1, 3]],
    baseFret: 1,
  },
  Asus4: {
    strings: ['-', 'o', 'o', 'o', 'o', 'x'],
    frets: [[4, 2], [3, 2], [2, 3]],
    baseFret: 1,
  },
  Esus4: {
    strings: ['o', 'o', 'o', 'o', 'o', 'o'],
    frets: [[5, 2], [4, 2], [3, 2]],
    baseFret: 1,
  },
  // ── 追加コード ──
  Gaug: {
    strings: ['o', 'o', 'o', 'o', 'o', 'o'],
    frets: [[6, 3], [5, 2], [4, 1], [1, 3]],
    baseFret: 1,
  },
  Cm: {
    strings: ['-', 'o', 'o', 'o', 'o', 'x'],
    frets: [[4, 5], [3, 5], [2, 4]],
    baseFret: 3,
    barre: [3, 1],
  },
  Bm7: {
    strings: ['-', 'o', 'o', 'o', 'o', '-'],
    frets: [[5, 2], [3, 2], [2, 3], [1, 2]],
    baseFret: 1,
  },
  Gsus4: {
    strings: ['o', 'o', 'o', 'o', 'o', 'o'],
    frets: [[6, 3], [5, 3], [1, 3]],
    baseFret: 1,
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
    W: 54, H: 36,
    ML: 9,
    MR: 3,
    MT: 4,
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
          <text x={ML - 2} y={MT + gridH / 2 + 3} textAnchor="end" fontSize={SMALL_FONT} fill={lineColor}>
            {baseFret}fr
          </text>
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
          const cx = ML - (extraCompact ? 6 : compact ? 8 : 11)
          const r = extraCompact ? 2 : compact ? 2.5 : 4
          const cr = extraCompact ? 1.5 : compact ? 2 : 3

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
