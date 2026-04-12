'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import { Song, Decade } from '@/types'
import YouTubePlayer from '@/components/player/YouTubePlayer'
import ChordSheet from '@/components/player/ChordSheet'
import { getSongsByDecade } from '@/lib/mockSongs'
import { resolveVideoId } from '@/lib/youtubeSearch'

type Props = {
  initialSong: Song
  decade: Decade
}

const DECADE_LABEL: Record<Decade, string> = {
  '80s': '80年代',
  '90s': '90年代',
  '2000s': '2000年代',
}

function getRandomFrom<T>(arr: T[], exclude?: T): T {
  if (arr.length === 1) return arr[0]
  const candidates = exclude ? arr.filter((x) => x !== exclude) : arr
  return candidates[Math.floor(Math.random() * candidates.length)]
}

export default function PlayerClient({ initialSong, decade }: Props) {
  const [song, setSong] = useState<Song>(initialSong)
  const [videoId, setVideoId] = useState<string>(initialSong.youtubeId)
  const [searching, setSearching] = useState(false)
  const [favorites, setFavorites] = useState<string[]>([])
  const songs = getSongsByDecade(decade)
  // 自動次曲中の二重発火を防ぐフラグ
  const transitioning = useRef(false)

  // ローカルストレージからお気に入り読み込み
  useEffect(() => {
    try {
      const stored = localStorage.getItem('anokoro-favorites')
      if (stored) setFavorites(JSON.parse(stored))
    } catch {}
  }, [])

  // 曲が変わるたびにYouTube動画IDを解決
  useEffect(() => {
    transitioning.current = false
    setSearching(true)
    resolveVideoId(song.id, song.artist, song.title, song.youtubeId)
      .then((id) => setVideoId(id))
      .finally(() => setSearching(false))
  }, [song])

  const isFavorite = favorites.includes(song.id)

  const toggleFavorite = useCallback(() => {
    setFavorites((prev) => {
      const next = prev.includes(song.id)
        ? prev.filter((id) => id !== song.id)
        : [...prev, song.id]
      try {
        localStorage.setItem('anokoro-favorites', JSON.stringify(next))
      } catch {}
      return next
    })
  }, [song.id])

  const nextSong = useCallback(() => {
    if (transitioning.current) return
    transitioning.current = true
    setSong((current) => getRandomFrom(songs, current))
  }, [songs])

  return (
    <div className="flex flex-col min-h-screen">
      {/* ヘッダー */}
      <header className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200 sticky top-0 z-10">
        <Link
          href="/"
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <span className="text-lg">←</span>
          <span className="text-sm font-medium">年代選択</span>
        </Link>
        <div className="text-sm font-semibold text-amber-600">
          🎸 {DECADE_LABEL[decade]}
        </div>
        <div className="w-16" />
      </header>

      {/* メインコンテンツ：2カラム（モバイルは上下） */}
      <main className="flex-1 flex flex-col lg:flex-row gap-0 lg:gap-0 max-w-6xl mx-auto w-full">
        {/* 左：YouTube */}
        <div className="lg:w-1/2 p-4 lg:p-6 lg:border-r border-gray-200">
          {searching ? (
            <div className="w-full aspect-video bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 text-sm">
              動画を検索中...
            </div>
          ) : (
            <YouTubePlayer videoId={videoId} onEnded={nextSong} />
          )}
        </div>

        {/* 右：コード譜 */}
        <div className="lg:w-1/2 p-4 lg:p-6 flex flex-col">
          <ChordSheet
            song={song}
            isFavorite={isFavorite}
            onToggleFavorite={toggleFavorite}
          />
        </div>
      </main>

      {/* 下部：ナビゲーション */}
      <footer className="sticky bottom-0 bg-white border-t border-gray-200 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-center">
          <button
            onClick={nextSong}
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-amber-500 hover:bg-amber-600 text-white font-semibold text-sm shadow-md transition-colors active:scale-95"
          >
            <span>次の曲</span>
            <span>→</span>
          </button>
        </div>
      </footer>
    </div>
  )
}
