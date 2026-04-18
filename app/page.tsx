'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Decade } from '@/types'
import { getSongById } from '@/lib/songs/index'

const DECADES: { value: Decade; label: string; sub: string; bg: string }[] = [
  { value: '80s', label: '80年代', sub: '80s', bg: 'from-orange-400 to-amber-500' },
  { value: '90s', label: '90年代', sub: '90s', bg: 'from-amber-400 to-yellow-500' },
  { value: '2000s', label: '2000年代', sub: '2000s', bg: 'from-yellow-400 to-lime-500' },
]

type LastSong = { songId: string; source: string }

export default function HomePage() {
  const [lastSong, setLastSong] = useState<LastSong | null>(null)
  const [lastSongTitle, setLastSongTitle] = useState<string | null>(null)
  const [lastSongArtist, setLastSongArtist] = useState<string | null>(null)

  useEffect(() => {
    try {
      const raw = localStorage.getItem('gcr-last-song')
      if (raw) {
        const parsed: LastSong = JSON.parse(raw)
        setLastSong(parsed)
        const song = getSongById(parsed.songId)
        if (song) {
          setLastSongTitle(song.title)
          setLastSongArtist(song.artist)
        }
      }
    } catch {}
  }, [])

  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-4 py-12">
      {/* ヘッダー */}
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">ギターコードラジオ</h1>
        <p className="text-gray-500 text-base max-w-xs mx-auto leading-relaxed">
          ギターを構えた30秒後には、もう弾いている
        </p>
      </div>

      <div className="w-full max-w-sm flex flex-col gap-4">
        {/* 続きからカード */}
        {lastSong && (
          <Link
            href={`/player?source=${lastSong.source}&songId=${lastSong.songId}`}
            className="relative flex items-center gap-4 p-5 rounded-2xl bg-gradient-to-r from-stone-600 to-stone-700 text-white shadow-md hover:shadow-lg hover:scale-[1.02] transition-all active:scale-[0.98]"
          >
            <span className="text-2xl">▶</span>
            <div className="flex-1 min-w-0">
              <div className="text-base font-bold">続きから</div>
              {lastSongTitle && (
                <div className="text-xs opacity-70 mt-0.5 truncate">
                  {lastSongTitle}
                  {lastSongArtist && ` · ${lastSongArtist}`}
                </div>
              )}
            </div>
            <span className="absolute right-5 text-xl opacity-60">→</span>
          </Link>
        )}

        {/* 年代カード */}
        {DECADES.map((d) => (
          <Link
            key={d.value}
            href={`/player?decade=${d.value}`}
            className={`relative flex items-center gap-4 p-5 rounded-2xl bg-gradient-to-r ${d.bg} text-white shadow-md hover:shadow-lg hover:scale-[1.02] transition-all active:scale-[0.98]`}
          >
            <div className="flex-1">
              <div className="text-2xl font-bold">{d.label}</div>
              <div className="text-sm opacity-70 font-mono">{d.sub}</div>
            </div>
            <span className="absolute right-5 text-xl opacity-60">→</span>
          </Link>
        ))}

        {/* お気に入りカード */}
        <Link
          href="/player?source=favorites"
          className="relative flex items-center gap-4 p-5 rounded-2xl bg-gradient-to-r from-pink-400 to-rose-500 text-white shadow-md hover:shadow-lg hover:scale-[1.02] transition-all active:scale-[0.98]"
        >
          <span className="text-2xl">❤️</span>
          <div className="text-xl font-bold">お気に入り</div>
          <span className="absolute right-5 text-xl opacity-60">→</span>
        </Link>
      </div>
    </main>
  )
}
