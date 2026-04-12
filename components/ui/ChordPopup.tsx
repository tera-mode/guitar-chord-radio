'use client'

import { useState, useEffect } from 'react'
import ChordDiagram from './ChordDiagram'

type Props = {
  chord: string
}

export default function ChordPopup({ chord }: Props) {
  const [open, setOpen] = useState(false)

  // Escapeキーで閉じる
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open])

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setOpen((v) => !v)}
        className="px-2 py-1 rounded bg-amber-100 hover:bg-amber-200 text-amber-900 font-mono font-bold text-sm transition-colors"
      >
        {chord}
      </button>

      {open && (
        <>
          {/* オーバーレイ：クリックで閉じる */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />
          <div className="absolute z-50 bottom-full mb-2 left-1/2 -translate-x-1/2 bg-white border border-gray-200 rounded-xl shadow-lg p-3">
            <ChordDiagram name={chord} />
            <button
              onClick={() => setOpen(false)}
              className="mt-1 w-full text-xs text-gray-400 hover:text-gray-600"
            >
              閉じる
            </button>
          </div>
        </>
      )}
    </div>
  )
}
