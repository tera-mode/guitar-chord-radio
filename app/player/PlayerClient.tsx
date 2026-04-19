'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import { Icon } from '@iconify/react'
import { Song, Source, PlayMode } from '@/types'
import YouTubePlayer, { YouTubePlayerRef } from '@/components/player/YouTubePlayer'
import ChordSheet from '@/components/player/ChordSheet'
import SiteFooter from '@/components/ui/SiteFooter'
import { getSongsByDecade, getSongsByIds, getRandomSongFromList, getSongById } from '@/lib/songs/index'
import { resolveVideoId } from '@/lib/youtubeSearch'

type Props = {
  initialSong?: Song
  source: Source
  songId?: string
}

const PLAY_MODES: PlayMode[] = ['off', 'autoplay', 'repeat-one']
const PLAY_MODE_ICON: Record<PlayMode, string> = {
  off: 'mdi:stop-circle-outline',
  autoplay: 'mdi:skip-next-circle-outline',
  'repeat-one': 'mdi:repeat-once',
}
const PLAY_MODE_LABEL: Record<PlayMode, string> = {
  off: '停止',
  autoplay: '自動',
  'repeat-one': 'リピート',
}

// ── ラジカセボタン ──────────────────────────────────────────────
function BbBtn({
  icon, label, onClick, disabled = false, active = false, asLink,
}: {
  icon: string; label: string; onClick?: () => void
  disabled?: boolean; active?: boolean; asLink?: string
}) {
  const cls = [
    'flex flex-col items-center gap-0.5 px-2.5 py-1.5 rounded-lg border transition-all select-none min-w-[42px]',
    active
      ? 'bg-amber-800 border-amber-600 text-amber-200 shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)]'
      : 'bg-zinc-700 border-zinc-500 text-zinc-300 shadow-[0_3px_0_rgba(0,0,0,0.6)] hover:bg-zinc-600 active:translate-y-px active:shadow-none',
    disabled ? 'opacity-30 cursor-not-allowed pointer-events-none' : '',
  ].join(' ')

  if (asLink) {
    return (
      <Link href={asLink} className={cls}>
        <Icon icon={icon} className="text-lg" />
        <span className="text-[10px] font-bold tracking-wider leading-none">{label}</span>
      </Link>
    )
  }
  return (
    <button onClick={onClick} disabled={disabled} className={cls}>
      <Icon icon={icon} className="text-lg" />
      <span className="text-[10px] font-bold tracking-wider leading-none">{label}</span>
    </button>
  )
}

// ── つまみ ───────────────────────────────────────────────────────
function Knob({ size = 34, rotation = 0 }: { size?: number; rotation?: number }) {
  return (
    <div
      className="rounded-full border-2 border-zinc-600 relative flex-shrink-0"
      style={{
        width: size, height: size,
        background: 'radial-gradient(circle at 38% 32%, #52525b, #18181b 75%)',
        boxShadow: '0 3px 8px rgba(0,0,0,0.6), inset 0 1px 2px rgba(255,255,255,0.07)',
        transform: `rotate(${rotation}deg)`,
      }}
    >
      <div
        className="absolute bg-zinc-400 rounded-full"
        style={{ width: 3, top: '11%', left: '50%', transform: 'translateX(-50%)', height: '28%' }}
      />
    </div>
  )
}

// ── VUメーター ───────────────────────────────────────────────────
function VUMeter() {
  return (
    <svg width="68" height="46" viewBox="0 0 80 56" className="flex-shrink-0">
      <rect x="2" y="2" width="76" height="52" rx="5" fill="#0a0a0a" stroke="#3f3f46" strokeWidth="1.5" />
      {/* アーク背景 */}
      <path d="M 13 50 A 27 27 0 0 1 67 50" fill="none" stroke="#14532d" strokeWidth="5" />
      <path d="M 57 28 A 27 27 0 0 1 67 50" fill="none" stroke="#7f1d1d" strokeWidth="5" />
      {/* 目盛り */}
      {Array.from({ length: 9 }).map((_, i) => {
        const angle = -90 + (i / 8) * 180
        const rad = (angle * Math.PI) / 180
        const r = 25, cx = 40, cy = 50
        const len = i % 2 === 0 ? 7 : 4
        return (
          <line
            key={i}
            x1={cx + (r - len) * Math.cos(rad)} y1={cy + (r - len) * Math.sin(rad)}
            x2={cx + r * Math.cos(rad)}           y2={cy + r * Math.sin(rad)}
            stroke={i >= 6 ? '#f87171' : '#4ade80'}
            strokeWidth={i % 2 === 0 ? 1.5 : 1}
          />
        )
      })}
      {/* 針 */}
      <line x1="40" y1="50" x2="40" y2="25" stroke="#fbbf24" strokeWidth="1.5" strokeLinecap="round" className="vu-needle" />
      <circle cx="40" cy="50" r="3" fill="#52525b" stroke="#71717a" strokeWidth="1" />
      <text x="40" y="57" textAnchor="middle" fontSize="6" fill="#52525b" fontFamily="monospace" letterSpacing="1">VU</text>
    </svg>
  )
}

// ── メインコンポーネント ─────────────────────────────────────────
export default function PlayerClient({ initialSong, source, songId }: Props) {
  const [song, setSong] = useState<Song | null>(initialSong ?? null)
  const [videoId, setVideoId] = useState<string>(initialSong?.youtubeId ?? '')
  const [searching, setSearching] = useState(false)
  const [favorites, setFavorites] = useState<string[]>([])
  const [playMode, setPlayMode] = useState<PlayMode>('autoplay')
  const [favSongs, setFavSongs] = useState<Song[]>([])
  const [favLoaded, setFavLoaded] = useState(false)
  const [shouldAutoplay, setShouldAutoplay] = useState(false)
  const [songHistory, setSongHistory] = useState<Song[]>([])

  const transitioning = useRef(false)
  const ytRef = useRef<YouTubePlayerRef>(null)

  const isFavoritesMode = source === 'favorites'
  const decadeSongs = !isFavoritesMode ? getSongsByDecade(source as import('@/types').Decade) : []

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
      if (storedMode && PLAY_MODES.includes(storedMode)) setPlayMode(storedMode)
    } catch {}
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!song) return
    transitioning.current = false
    setSearching(true)
    resolveVideoId(song.id, song.artist, song.title, song.youtubeId)
      .then((id) => setVideoId(id))
      .finally(() => setSearching(false))
    try { localStorage.setItem('gcr-last-song', JSON.stringify({ songId: song.id, source })) } catch {}
  }, [song, source])

  const isFavorite = song ? favorites.includes(song.id) : false

  const toggleFavorite = useCallback(() => {
    if (!song) return
    setFavorites((prev) => {
      const next = prev.includes(song.id) ? prev.filter((id) => id !== song.id) : [...prev, song.id]
      try { localStorage.setItem('gcr-favorites', JSON.stringify(next)) } catch {}
      return next
    })
  }, [song])

  const songList = isFavoritesMode ? favSongs : decadeSongs

  const nextSong = useCallback(() => {
    if (transitioning.current) return
    transitioning.current = true
    setSong((current) => {
      if (current) setSongHistory((h) => [...h, current])
      return getRandomSongFromList(songList, current ?? undefined)
    })
  }, [songList])

  const prevSong = useCallback(() => {
    if (songHistory.length === 0) return
    const prev = songHistory[songHistory.length - 1]
    setSongHistory((h) => h.slice(0, -1))
    setSong(prev)
  }, [songHistory])

  const handleEnded = useCallback(() => {
    if (playMode === 'autoplay') {
      setShouldAutoplay(true)
      nextSong()
    } else if (playMode === 'repeat-one') {
      ytRef.current?.replay()
    }
  }, [playMode, nextSong])

  if (isFavoritesMode && favLoaded && favSongs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4 gap-6 text-center bg-zinc-900">
        <div className="text-5xl">🤍</div>
        <div>
          <h2 className="text-xl font-bold text-zinc-100 mb-2">お気に入りがまだありません</h2>
          <p className="text-zinc-500 text-sm">曲を聴きながら ❤️ を押して追加してください</p>
        </div>
        <Link href="/" className="px-6 py-3 rounded-full bg-amber-600 hover:bg-amber-500 text-white font-semibold text-sm shadow-md transition-colors">
          年代選択に戻る
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-900 flex flex-col">
      {/* ── ヘッダー: コントロールパネル ── */}
      <header
        className="sticky top-0 z-10 bg-zinc-800 border-b-2 border-zinc-600 px-3 py-2"
        style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.6)' }}
      >
        <div className="flex items-center justify-between gap-1 max-w-lg mx-auto">
          {/* 左 */}
          <div className="flex items-center gap-1">
            <BbBtn icon="mdi:arrow-left-bold" label="戻る" asLink="/" />
            <BbBtn icon="mdi:skip-previous" label="前の曲" onClick={prevSong} disabled={songHistory.length === 0} />
          </div>
          {/* 中央: 再生モード */}
          <div className="flex items-center gap-1">
            {PLAY_MODES.map((mode) => (
              <BbBtn
                key={mode}
                icon={PLAY_MODE_ICON[mode]}
                label={PLAY_MODE_LABEL[mode]}
                active={playMode === mode}
                onClick={() => {
                  setPlayMode(mode)
                  try { localStorage.setItem('gcr-play-mode', mode) } catch {}
                }}
              />
            ))}
          </div>
          {/* 右 */}
          <BbBtn icon="mdi:skip-next" label="次の曲" onClick={nextSong} />
        </div>
      </header>

      {/* ── ボディ ── */}
      <main className="flex-1 flex flex-col max-w-lg mx-auto w-full">
        {/* スクリーンエリア */}
        <div className="px-3 pt-3">
          <div
            className="rounded-2xl overflow-hidden border-2 border-zinc-600"
            style={{
              background: 'linear-gradient(to bottom, #27272a, #18181b)',
              boxShadow: 'inset 0 0 24px rgba(0,0,0,0.7), 0 4px 12px rgba(0,0,0,0.5)',
            }}
          >
            <div className="p-2.5">
              <div className="rounded-xl overflow-hidden border border-zinc-700 bg-black">
                {searching || !song ? (
                  <div className="w-full aspect-video flex items-center justify-center text-zinc-500 text-sm font-mono tracking-widest">
                    {searching ? '▶ SEARCHING...' : '■ LOADING...'}
                  </div>
                ) : (
                  <YouTubePlayer
                    ref={ytRef}
                    videoId={videoId}
                    onEnded={handleEnded}
                    autoplay={shouldAutoplay}
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* コード譜エリア */}
        <div className="flex-1 px-3 py-3">
          {song && (
            <ChordSheet song={song} isFavorite={isFavorite} onToggleFavorite={toggleFavorite} />
          )}
        </div>

        {/* ── ボトム: ラジカセ底面 ── */}
        <div
          className="border-t-2 border-zinc-600 px-5 py-3"
          style={{ background: 'linear-gradient(to bottom, #27272a, #18181b)' }}
        >
          <div className="flex items-center justify-between">
            <Knob size={32} rotation={-40} />
            <Knob size={26} rotation={25} />
            <VUMeter />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/image/gcr-logo-en.png" alt="Guitar Chord Radio" className="h-8 w-auto object-contain" />
            <Knob size={26} rotation={-15} />
            <Knob size={32} rotation={60} />
          </div>
        </div>

        {/* フッター */}
        <SiteFooter />
      </main>
    </div>
  )
}
