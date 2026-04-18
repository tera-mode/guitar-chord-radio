'use client'

import { useState } from 'react'
import { Song } from '@/types'
import ChordPopup from '@/components/ui/ChordPopup'
import ChordDiagram from '@/components/ui/ChordDiagram'

type Props = {
  song: Song
  isFavorite: boolean
  onToggleFavorite: () => void
}

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
  const [heartBounce, setHeartBounce] = useState(false)

  const handleFavorite = () => {
    setHeartBounce(true)
    onToggleFavorite()
    setTimeout(() => setHeartBounce(false), 300)
  }

  return (
    <div className="flex flex-col gap-3 h-full">
      {/* モバイル: コンパクトな1行ヘッダー */}
      <div className="flex items-center gap-2 md:hidden">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-gray-900 truncate">
            {song.title}
            <span className="font-normal text-gray-500 ml-1">· {song.artist}</span>
          </p>
          {song.capo > 0 && (
            <span className="text-xs text-blue-600 font-mono">♪{song.capo}</span>
          )}
        </div>
        <button
          onClick={handleFavorite}
          className={`p-1.5 rounded-lg hover:bg-gray-100 transition-colors flex-shrink-0 transition-transform ${heartBounce ? 'scale-125' : 'scale-100'}`}
          aria-label={isFavorite ? 'お気に入りを解除' : 'お気に入りに追加'}
        >
          <span className="text-xl">{isFavorite ? '❤️' : '🤍'}</span>
        </button>
      </div>

      {/* PC: フルヘッダー */}
      <div className="hidden md:flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">{song.title}</h2>
          <p className="text-sm text-gray-500 mt-0.5">{song.artist} • {song.year}年</p>
          {song.capo > 0 && (
            <span className="mt-2 inline-block text-xs text-blue-600 font-mono">♪{song.capo}</span>
          )}
        </div>
        <button
          onClick={handleFavorite}
          className={`p-2 rounded-lg hover:bg-gray-100 transition-colors transition-transform ${heartBounce ? 'scale-125' : 'scale-100'}`}
          aria-label={isFavorite ? 'お気に入りを解除' : 'お気に入りに追加'}
        >
          <span className="text-2xl">{isFavorite ? '❤️' : '🤍'}</span>
        </button>
      </div>

      <hr className="border-gray-200" />

      {/* 使用コード一覧 */}
      <div>
        {/* モバイル: extra-compact */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 md:hidden">
          {chords.map((chord) => (
            <div key={chord} className="flex-shrink-0">
              <ChordDiagram name={chord} extraCompact />
            </div>
          ))}
        </div>
        {/* PC: compact */}
        <div className="hidden md:flex gap-2 overflow-x-auto pb-1">
          {chords.map((chord) => (
            <div key={chord} className="flex-shrink-0">
              <ChordDiagram name={chord} compact />
            </div>
          ))}
        </div>
      </div>

      <hr className="border-gray-200" />

      {/* コード進行 セクション別 */}
      <div className="flex flex-col gap-4 overflow-y-auto flex-1">
        {song.sections.map((section, i) => (
          <div key={i}>
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
              {section.label}
            </div>
            <div className="flex flex-wrap gap-1.5 md:gap-2">
              {section.chords.map((chord, j) => (
                <ChordPopup key={j} chord={chord} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
