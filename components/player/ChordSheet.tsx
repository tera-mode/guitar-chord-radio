'use client'

import { useState } from 'react'
import { Icon } from '@iconify/react'
import { Song } from '@/types'
import ChordDiagram from '@/components/ui/ChordDiagram'

type Props = {
  song: Song
  isFavorite: boolean
  onToggleFavorite: () => void
}

// ── ルートノートカラーシステム ───────────────────────────────────
const ROOT_ORDER = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
const ROOT_COLORS: Record<string, string> = {}
ROOT_ORDER.forEach((n, i) => {
  ROOT_COLORS[n] = `oklch(0.62 0.17 ${(i / 12) * 360})`
})
ROOT_COLORS['Db'] = ROOT_COLORS['C#']
ROOT_COLORS['Eb'] = ROOT_COLORS['D#']
ROOT_COLORS['Gb'] = ROOT_COLORS['F#']
ROOT_COLORS['Ab'] = ROOT_COLORS['G#']
ROOT_COLORS['Bb'] = ROOT_COLORS['A#']

function chordColor(name: string): string {
  const m = name.match(/^[A-G][#b]?/)
  const root = m ? m[0] : 'C'
  return ROOT_COLORS[root] || '#888'
}

// ── コードタイル ────────────────────────────────────────────────
function ChordTile({ name }: { name: string }) {
  const color = chordColor(name)
  return (
    <div
      style={{
        background: `linear-gradient(135deg, ${color}28, ${color}08)`,
        border: `1px solid ${color}55`,
        borderRadius: 8,
        padding: '5px 7px',
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        boxShadow: `0 0 0 1px ${color}0a`,
      }}
    >
      <div
        style={{
          fontFamily: 'var(--font-geist-sans), Inter, system-ui',
          fontSize: 14,
          fontWeight: 700,
          color,
          lineHeight: 1,
          textShadow: `0 0 8px ${color}55`,
          minWidth: 26,
          flexShrink: 0,
        }}
      >
        {name}
      </div>
      <ChordDiagram name={name} tile />
    </div>
  )
}

// ── セクションブロック ───────────────────────────────────────────
function SectionBlock({ label, chords }: { label: string; chords: string[] }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <span
          className="text-[10px] font-bold tracking-widest px-1.5 py-0.5 rounded-sm border border-zinc-600 text-zinc-400 font-mono"
        >
          {label}
        </span>
        <div className="flex-1 h-px bg-zinc-700" />
        <span className="text-[10px] font-mono text-zinc-600">{chords.length} STEPS</span>
      </div>
      <div className="grid grid-cols-3 gap-1.5">
        {chords.map((chord, i) => (
          <ChordTile key={i} name={chord} />
        ))}
      </div>
    </div>
  )
}

export default function ChordSheet({ song, isFavorite, onToggleFavorite }: Props) {
  const [heartBounce, setHeartBounce] = useState(false)

  const handleFavorite = () => {
    setHeartBounce(true)
    onToggleFavorite()
    setTimeout(() => setHeartBounce(false), 300)
  }

  return (
    <div className="flex flex-col gap-3">
      {/* ── 曲情報カード ── */}
      <div
        className="rounded-xl border px-3 py-2.5 flex items-center gap-2"
        style={{
          background: 'oklch(0.22 0.012 55)',
          borderColor: 'oklch(0.27 0.015 55)',
          boxShadow: 'inset 0 1px 0 oklch(0.30 0.015 55)',
        }}
      >
        <div className="text-amber-400 text-lg flex-shrink-0">♪</div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-bold text-zinc-100 truncate leading-tight">
            {song.title}
          </div>
          <div className="text-[11px] text-zinc-500 font-mono mt-0.5">
            {song.artist}・{song.year}
            {song.capo > 0 && (
              <span className="ml-2 text-blue-400 font-semibold">カポ {song.capo}</span>
            )}
          </div>
        </div>
        <button
          onClick={handleFavorite}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border text-xs font-bold transition-all flex-shrink-0 ${
            isFavorite
              ? 'border-amber-600 text-amber-400'
              : 'border-zinc-600 text-zinc-500 hover:border-zinc-400 hover:text-zinc-300'
          } ${heartBounce ? 'scale-125' : 'scale-100'}`}
          style={isFavorite ? { background: 'oklch(0.68 0.17 45 / 0.15)' } : { background: 'transparent' }}
          aria-label={isFavorite ? 'お気に入りを解除' : 'お気に入りに追加'}
        >
          <Icon icon={isFavorite ? 'mdi:heart' : 'mdi:heart-outline'} className="text-sm" />
          <span>{isFavorite ? 'Liked' : 'Like'}</span>
        </button>
      </div>

      {/* ── コード進行セクション ── */}
      <div className="flex flex-col gap-4">
        {song.sections.map((section, i) => (
          <SectionBlock key={i} label={section.label} chords={section.chords} />
        ))}
      </div>
    </div>
  )
}
