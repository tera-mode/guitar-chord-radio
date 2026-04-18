'use client'

import { useState } from 'react'
import { Icon } from '@iconify/react'
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
      if (!seen.has(chord)) { seen.add(chord); result.push(chord) }
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
    <div className="flex flex-col gap-3">
      {/* ── LCDディスプレイ: 曲情報 ── */}
      <div
        className="rounded-xl border border-zinc-700 px-3 py-2.5"
        style={{
          background: 'linear-gradient(to bottom, #0c0c0c, #111)',
          boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.8)',
        }}
      >
        <div className="flex items-center gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <Icon icon="mdi:music-note-eighth" className="text-amber-400 text-sm flex-shrink-0" />
              <p className="text-sm font-bold text-zinc-100 truncate font-mono tracking-wide">
                {song.title}
              </p>
            </div>
            <p className="text-xs text-zinc-500 font-mono mt-0.5 pl-5">
              {song.artist}
              <span className="text-zinc-700 mx-1">·</span>
              {song.year}
              {song.capo > 0 && (
                <span className="ml-2 text-blue-400 font-semibold">カポ {song.capo}</span>
              )}
            </p>
          </div>
          <button
            onClick={handleFavorite}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border text-xs font-bold transition-all flex-shrink-0 ${
              isFavorite
                ? 'bg-red-900/60 border-red-700 text-red-400'
                : 'bg-zinc-800 border-zinc-600 text-zinc-400 hover:border-zinc-400 hover:text-zinc-200'
            } ${heartBounce ? 'scale-125' : 'scale-100'}`}
            aria-label={isFavorite ? 'お気に入りを解除' : 'お気に入りに追加'}
          >
            <Icon icon={isFavorite ? 'mdi:heart' : 'mdi:heart-outline'} className="text-sm" />
            <span>Like</span>
          </button>
        </div>
      </div>

      {/* ── コードダイアグラム一覧 ── */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {chords.map((chord) => (
          <div
            key={chord}
            className="flex-shrink-0 bg-white rounded-lg border border-zinc-300 p-0.5"
            style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.4)' }}
          >
            <ChordDiagram name={chord} extraCompact />
          </div>
        ))}
      </div>

      {/* ── コード進行 セクション別 ── */}
      <div
        className="rounded-xl border border-zinc-700 px-3 py-2.5 flex flex-col gap-3"
        style={{
          background: 'linear-gradient(to bottom, #1a1a1a, #141414)',
          boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.6)',
        }}
      >
        {song.sections.map((section, i) => (
          <div key={i}>
            <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5 font-mono">
              {section.label}
            </div>
            <div className="flex flex-wrap gap-1.5">
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
