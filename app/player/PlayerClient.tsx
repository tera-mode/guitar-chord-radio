'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import { Song, Source, PlayMode, Decade } from '@/types'
import YouTubePlayer, { YouTubePlayerRef } from '@/components/player/YouTubePlayer'
import ChordSheet from '@/components/player/ChordSheet'
import { getSongsByDecade, getSongsByIds, getRandomSongFromList, getSongById } from '@/lib/songs/index'
import { resolveVideoId } from '@/lib/youtubeSearch'

type Props = {
  initialSong?: Song
  source: Source
  songId?: string
}

const PLAY_MODES: PlayMode[] = ['off', 'autoplay', 'repeat-one']
const PLAY_MODE_ICON: Record<PlayMode, string> = {
  off: '⏹',
  autoplay: '⏭',
  'repeat-one': '🔂',
}
const PLAY_MODE_LABEL: Record<PlayMode, string> = {
  off: '停止',
  autoplay: '自動',
  'repeat-one': 'リピート',
}

export default function PlayerClient({ initialSong, source, songId }: Props) {
  const [song, setSong] = useState<Song | null>(initialSong ?? null)
  const [videoId, setVideoId] = useState<string>(initialSong?.youtubeId ?? '')
  const [searching, setSearching] = useState(false)
  const [favorites, setFavorites] = useState<string[]>([])
  const [playMode, setPlayMode] = useState<PlayMode>('autoplay')
  const [favSongs, setFavSongs] = useState<Song[]>([])
  const [favLoaded, setFavLoaded] = useState(false)

  const transitioning = useRef(false)
  const ytRef = useRef<YouTubePlayerRef>(null)

  const isFavoritesMode = source === 'favorites'
  const decadeSongs = !isFavoritesMode ? getSongsByDecade(source as Decade) : []

  useEffect(() => {
    try {
      const storedFavs = localStorage.getItem('gcr-favorites')
      const ids: string[] = storedFavs ? JSON.parse(storedFavs) : []
      setFavorites(ids)

      if (isFavoritesMode) {
        const favList = getSongsByIds(ids)
        setFavSongs(favList)
        if (!initialSong) {
          const first = songId ? getSongById(songId) ?? getRandomSongFromList(favList) : getRandomSongFromList(favList)
          setSong(first)
          setVideoId(first?.youtubeId ?? '')
        }
        setFavLoaded(true)
      } else if (songId && !initialSong) {
        const found = getSongById(songId)
        if (found) setSong(found)
      }

      const storedMode = localStorage.getItem('gcr-play-mode') as PlayMode | null
      if (storedMode && PLAY_MODES.includes(storedMode)) {
        setPlayMode(storedMode)
      }
    } catch {}
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // 曲が変わるたびにYouTube動画IDを解決 + last-song保存
  useEffect(() => {
    if (!song) return
    transitioning.current = false
    setSearching(true)
    resolveVideoId(song.id, song.artist, song.title, song.youtubeId)
      .then((id) => setVideoId(id))
      .finally(() => setSearching(false))

    try {
      localStorage.setItem('gcr-last-song', JSON.stringify({ songId: song.id, source }))
    } catch {}
  }, [song, source])

  const isFavorite = song ? favorites.includes(song.id) : false

  const toggleFavorite = useCallback(() => {
    if (!song) return
    setFavorites((prev) => {
      const next = prev.includes(song.id)
        ? prev.filter((id) => id !== song.id)
        : [...prev, song.id]
      try {
        localStorage.setItem('gcr-favorites', JSON.stringify(next))
      } catch {}
      return next
    })
  }, [song])

  const cyclePlayMode = useCallback(() => {
    setPlayMode((prev) => {
      const idx = PLAY_MODES.indexOf(prev)
      const next = PLAY_MODES[(idx + 1) % PLAY_MODES.length]
      try {
        localStorage.setItem('gcr-play-mode', next)
      } catch {}
      return next
    })
  }, [])

  const songList = isFavoritesMode ? favSongs : decadeSongs

  const nextSong = useCallback(() => {
    if (transitioning.current) return
    transitioning.current = true
    setSong((current) => getRandomSongFromList(songList, current ?? undefined))
  }, [songList])

  const handleEnded = useCallback(() => {
    if (playMode === 'autoplay') {
      nextSong()
    } else if (playMode === 'repeat-one') {
      ytRef.current?.replay()
    }
  }, [playMode, nextSong])

  if (isFavoritesMode && favLoaded && favSongs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4 gap-6 text-center">
        <div className="text-5xl">🤍</div>
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">お気に入りがまだありません</h2>
          <p className="text-gray-500 text-sm">曲を聴きながら ❤️ を押して追加してください</p>
        </div>
        <Link
          href="/"
          className="px-6 py-3 rounded-full bg-amber-500 hover:bg-amber-600 text-white font-semibold text-sm shadow-md transition-colors"
        >
          年代選択に戻る
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* ヘッダー */}
      <header className="flex items-center px-4 py-2 bg-white border-b border-gray-200 sticky top-0 z-10">
        {/* 左: 戻る */}
        <Link
          href="/"
          className="flex flex-col items-center gap-0.5 w-12 text-gray-500 hover:text-gray-900 transition-colors"
          aria-label="ホームへ戻る"
        >
          <span className="text-lg leading-none">←</span>
          <span className="text-xs">戻る</span>
        </Link>

        {/* 中央: 再生モード */}
        <div className="flex-1 flex justify-center">
          <button
            onClick={cyclePlayMode}
            className="flex flex-col items-center gap-0.5 px-4 py-1 rounded-xl hover:bg-gray-100 transition-colors"
            aria-label={`再生モード: ${PLAY_MODE_LABEL[playMode]}`}
          >
            <span className="text-lg leading-none">{PLAY_MODE_ICON[playMode]}</span>
            <span className="text-xs text-gray-500">{PLAY_MODE_LABEL[playMode]}</span>
          </button>
        </div>

        {/* 右: 次の曲 */}
        <button
          onClick={nextSong}
          className="flex flex-col items-center gap-0.5 w-12 text-gray-500 hover:text-gray-900 transition-colors"
          aria-label="次の曲"
        >
          <span className="text-lg leading-none">⏩</span>
          <span className="text-xs">次の曲</span>
        </button>
      </header>

      {/* メインコンテンツ */}
      <main className="flex-1 flex flex-col lg:flex-row gap-0 max-w-6xl mx-auto w-full">
        {/* 左：YouTube */}
        <div className="lg:w-1/2 p-3 lg:p-6 lg:border-r border-gray-200">
          {searching || !song ? (
            <div className="w-full h-[32vh] md:aspect-video bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 text-sm">
              {searching ? '動画を検索中...' : '読み込み中...'}
            </div>
          ) : (
            <YouTubePlayer
              ref={ytRef}
              videoId={videoId}
              onEnded={handleEnded}
            />
          )}
        </div>

        {/* 右：コード譜 */}
        <div className="lg:w-1/2 p-3 lg:p-6 flex flex-col">
          {song && (
            <ChordSheet
              song={song}
              isFavorite={isFavorite}
              onToggleFavorite={toggleFavorite}
            />
          )}
        </div>
      </main>
    </div>
  )
}
