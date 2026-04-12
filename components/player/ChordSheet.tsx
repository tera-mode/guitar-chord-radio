'use client'

import { Song } from '@/types'
import ChordPopup from '@/components/ui/ChordPopup'
import ChordDiagram from '@/components/ui/ChordDiagram'

type Props = {
  song: Song
  isFavorite: boolean
  onToggleFavorite: () => void
}

const SECTION_LABELS: Record<string, string> = {
  intro: 'イントロ',
  verse: 'Aメロ',
  'verse-b': 'Bメロ',
  chorus: 'サビ',
  outro: 'アウトロ',
  bridge: 'ブリッジ',
}

// 曲中の全ユニークコードを出現順に抽出
function uniqueChords(song: Song): string[] {
  const seen = new Set<string>()
  const result: string[] = []
  for (const section of song.sections) {
    for (const chord of section.chords) {
      if (!seen.has(chord)) {
        seen.add(chord)
        result.push(chord)
      }
    }
  }
  return result
}

export default function ChordSheet({ song, isFavorite, onToggleFavorite }: Props) {
  const chords = uniqueChords(song)

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* 曲情報ヘッダー */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">{song.title}</h2>
          <p className="text-sm text-gray-500 mt-0.5">{song.artist} • {song.year}年</p>
          <div className="flex gap-2 mt-2">
            {song.capo > 0 && (
              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full font-mono">
                カポ {song.capo}
              </span>
            )}
            <span className={`px-2 py-0.5 text-xs rounded-full ${
              song.difficulty === 'easy'
                ? 'bg-green-100 text-green-700'
                : song.difficulty === 'medium'
                ? 'bg-yellow-100 text-yellow-700'
                : 'bg-red-100 text-red-700'
            }`}>
              {song.difficulty === 'easy' ? '初級' : song.difficulty === 'medium' ? '中級' : '上級'}
            </span>
          </div>
        </div>

        {/* お気に入りボタン */}
        <button
          onClick={onToggleFavorite}
          className="flex flex-col items-center gap-0.5 p-2 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label={isFavorite ? 'お気に入りを解除' : 'お気に入りに追加'}
        >
          <span className="text-2xl">{isFavorite ? '❤️' : '🤍'}</span>
          <span className="text-xs text-gray-400">お気に入り</span>
        </button>
      </div>

      <hr className="border-gray-200" />

      {/* コードダイアグラム常時表示 */}
      <div>
        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
          使用コード一覧
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {chords.map((chord) => (
            <div key={chord} className="flex-shrink-0">
              <ChordDiagram name={chord} compact />
            </div>
          ))}
        </div>
      </div>

      <hr className="border-gray-200" />

      {/* コード進行 セクション別 */}
      <div className="flex flex-col gap-5 overflow-y-auto flex-1">
        {song.sections.map((section, i) => (
          <div key={i}>
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              {SECTION_LABELS[section.label] ?? section.label}
            </div>
            <div className="flex flex-wrap gap-2">
              {section.chords.map((chord, j) => (
                <ChordPopup key={j} chord={chord} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* タグ */}
      {song.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 pt-2 border-t border-gray-100">
          {song.tags.map((tag, i) => (
            <span key={i} className="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs rounded-full">
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
