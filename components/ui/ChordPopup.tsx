'use client'

import { useState, useEffect } from 'react'
import ChordDiagram from './ChordDiagram'

type Props = { chord: string }

// コードルートごとの色テーマ
function getChordColor(chord: string): string {
  const root = chord.match(/^[A-G][#b]?/)?.[0]?.[0] ?? 'C'
  const isMinor = /m(?!aj)/.test(chord.slice(1))

  const colors: Record<string, [string, string]> = {
    //       [メジャー,                                    マイナー]
    C: ['bg-stone-600   border-stone-500   text-stone-100', 'bg-stone-700   border-stone-600   text-stone-100'],
    D: ['bg-amber-800   border-amber-700   text-amber-100', 'bg-amber-900   border-amber-800   text-amber-100'],
    E: ['bg-yellow-700  border-yellow-600  text-yellow-50', 'bg-green-800   border-green-700   text-green-100'],
    F: ['bg-red-800     border-red-700     text-red-100',   'bg-rose-900    border-rose-800    text-rose-100'],
    G: ['bg-teal-800    border-teal-700    text-teal-100',  'bg-cyan-900    border-cyan-800    text-cyan-100'],
    A: ['bg-blue-800    border-blue-700    text-blue-100',  'bg-purple-800  border-purple-700  text-purple-100'],
    B: ['bg-violet-800  border-violet-700  text-violet-100','bg-indigo-900  border-indigo-800  text-indigo-100'],
  }

  const [major, minor] = colors[root] ?? [
    'bg-zinc-700 border-zinc-600 text-zinc-100',
    'bg-zinc-800 border-zinc-700 text-zinc-100',
  ]
  return isMinor ? minor : major
}

export default function ChordPopup({ chord }: Props) {
  const [open, setOpen] = useState(false)
  const colorCls = getChordColor(chord)

  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open])

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setOpen((v) => !v)}
        className={`px-2.5 py-1 rounded-lg border font-mono font-bold text-sm transition-all select-none
          shadow-[0_2px_0_rgba(0,0,0,0.5)] active:shadow-none active:translate-y-px ${colorCls}`}
      >
        {chord}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div
            className="absolute z-50 bottom-full mb-2 left-1/2 -translate-x-1/2 rounded-xl border border-zinc-600 p-2.5"
            style={{
              background: '#1c1c1e',
              boxShadow: '0 8px 32px rgba(0,0,0,0.7)',
            }}
          >
            <div className="bg-white rounded-lg p-1">
              <ChordDiagram name={chord} />
            </div>
            <button
              onClick={() => setOpen(false)}
              className="mt-1.5 w-full text-xs text-zinc-500 hover:text-zinc-300 font-mono"
            >
              閉じる
            </button>
          </div>
        </>
      )}
    </div>
  )
}
