'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Icon } from '@iconify/react'
import { Decade } from '@/types'
import { getSongById } from '@/lib/songs/index'

// ── カセットテープSVG ──────────────────────────────────────────
function CassetteSVG({ color = '#52525b' }: { color?: string }) {
  return (
    <svg width="64" height="42" viewBox="0 0 64 42" fill="none">
      <rect x="1" y="3" width="62" height="36" rx="4" fill="#18181b" stroke="#3f3f46" strokeWidth="1.5" />
      {/* ラベル窓 */}
      <rect x="7" y="9" width="50" height="20" rx="2" fill="#0a0a0a" stroke="#3f3f46" strokeWidth="1" />
      {/* 左リール */}
      <circle cx="20" cy="19" r="7.5" fill="#0a0a0a" stroke={color} strokeWidth="1.5" />
      <circle cx="20" cy="19" r="3" fill="#27272a" stroke="#71717a" strokeWidth="1" />
      <line x1="20" y1="12" x2="20" y2="15" stroke={color} strokeWidth="1" />
      <line x1="20" y1="23" x2="20" y2="26" stroke={color} strokeWidth="1" />
      <line x1="13.5" y1="16" x2="16" y2="17.5" stroke={color} strokeWidth="1" />
      <line x1="24" y1="20.5" x2="26.5" y2="22" stroke={color} strokeWidth="1" />
      {/* 右リール */}
      <circle cx="44" cy="19" r="7.5" fill="#0a0a0a" stroke={color} strokeWidth="1.5" />
      <circle cx="44" cy="19" r="3" fill="#27272a" stroke="#71717a" strokeWidth="1" />
      <line x1="44" y1="12" x2="44" y2="15" stroke={color} strokeWidth="1" />
      <line x1="44" y1="23" x2="44" y2="26" stroke={color} strokeWidth="1" />
      <line x1="37.5" y1="16" x2="40" y2="17.5" stroke={color} strokeWidth="1" />
      <line x1="48" y1="20.5" x2="50.5" y2="22" stroke={color} strokeWidth="1" />
      {/* テープライン */}
      <path d="M 12 27 Q 20 24 27 27 L 37 27 Q 44 24 52 27" stroke="#52525b" strokeWidth="1" fill="none" />
      {/* 底面ノッチ */}
      <rect x="24" y="37" width="16" height="2" rx="1" fill="#3f3f46" />
    </svg>
  )
}


// ── VUメーター (小) ──────────────────────────────────────────────
function VUMeter() {
  return (
    <svg width="56" height="38" viewBox="0 0 80 56">
      <rect x="2" y="2" width="76" height="52" rx="5" fill="#0a0a0a" stroke="#3f3f46" strokeWidth="1.5" />
      <path d="M 13 50 A 27 27 0 0 1 67 50" fill="none" stroke="#14532d" strokeWidth="5" />
      <path d="M 57 28 A 27 27 0 0 1 67 50" fill="none" stroke="#7f1d1d" strokeWidth="5" />
      {Array.from({ length: 9 }).map((_, i) => {
        const angle = -90 + (i / 8) * 180
        const rad = (angle * Math.PI) / 180
        const r = 25, cx = 40, cy = 50, len = i % 2 === 0 ? 7 : 4
        return (
          <line key={i}
            x1={cx + (r - len) * Math.cos(rad)} y1={cy + (r - len) * Math.sin(rad)}
            x2={cx + r * Math.cos(rad)}           y2={cy + r * Math.sin(rad)}
            stroke={i >= 6 ? '#f87171' : '#4ade80'} strokeWidth={i % 2 === 0 ? 1.5 : 1}
          />
        )
      })}
      <line x1="40" y1="50" x2="40" y2="25" stroke="#fbbf24" strokeWidth="1.5" strokeLinecap="round" className="vu-needle" />
      <circle cx="40" cy="50" r="3" fill="#52525b" stroke="#71717a" strokeWidth="1" />
      <text x="40" y="57" textAnchor="middle" fontSize="6" fill="#52525b" fontFamily="monospace" letterSpacing="1">VU</text>
    </svg>
  )
}

function Knob({ size = 30, rotation = 0 }: { size?: number; rotation?: number }) {
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
      <div className="absolute bg-zinc-400 rounded-full"
        style={{ width: 2, top: '11%', left: '50%', transform: 'translateX(-50%)', height: '26%' }} />
    </div>
  )
}

// ── 年代データ ───────────────────────────────────────────────────
const DECADES: {
  value: Decade; label: string; sub: string
  accent: string; reelColor: string; icon: string
}[] = [
  {
    value: '80s', label: '80年代', sub: "80's HITS",
    accent: 'border-orange-600', reelColor: '#ea580c', icon: 'mdi:guitar-electric',
  },
  {
    value: '90s', label: '90年代', sub: "90's HITS",
    accent: 'border-amber-500', reelColor: '#d97706', icon: 'mdi:guitar-acoustic',
  },
  {
    value: '2000s', label: '2000年代', sub: "2000's HITS",
    accent: 'border-teal-600', reelColor: '#0d9488', icon: 'mdi:music-note-eighth',
  },
]

type LastSong = { songId: string; source: string }

// ── メインページ ─────────────────────────────────────────────────
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
        if (song) { setLastSongTitle(song.title); setLastSongArtist(song.artist) }
      }
    } catch {}
  }, [])

  return (
    <div className="min-h-screen bg-zinc-900 flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm flex flex-col gap-0">

        {/* ── ブランドパネル ── */}
        <div
          className="rounded-t-3xl border-2 border-b-0 border-zinc-600 px-5 pt-6 pb-4"
          style={{
            background: 'linear-gradient(to bottom, #27272a, #1c1c1e)',
            boxShadow: 'inset 0 2px 12px rgba(0,0,0,0.6)',
          }}
        >
          {/* メインロゴ */}
          <div className="mb-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/image/gcr-logo.png" alt="Guitar Chord Radio" className="w-full h-20 object-contain" />
          </div>

          {/* 周波数チューナーバー */}
          <div className="bg-zinc-950 rounded-lg border border-zinc-700 px-3 py-2 shadow-inner">
            <div className="flex justify-between text-[9px] font-mono text-zinc-600 mb-1">
              <span>76</span><span>80</span><span>86</span><span>90</span><span>96</span><span>100</span><span>108</span>
            </div>
            <div className="relative h-0.5 bg-zinc-700 mx-1">
              {[0, 14.3, 28.6, 42.9, 57.1, 71.4, 100].map((p) => (
                <div key={p} className="absolute bg-zinc-600" style={{ left: `${p}%`, width: 1, height: 6, top: -2 }} />
              ))}
              {/* 針 - 90MHzあたりに固定 */}
              <div className="absolute bg-red-500" style={{ left: '43%', width: 2, height: 14, top: -6, transform: 'translateX(-50%)' }} />
            </div>
            <div className="text-right text-[9px] font-mono text-zinc-600 mt-1">MHz</div>
          </div>

          {/* キャッチコピー */}
          <div className="mt-3 bg-zinc-950 rounded-lg border border-zinc-700 px-3 py-2 shadow-inner">
            <p className="text-xs text-green-400 font-mono tracking-wide leading-relaxed">
              &gt; ギターを構えた30秒後には、<br />
              &nbsp;&nbsp;もう弾いている。
            </p>
          </div>
        </div>

        {/* ── メインボディ ── */}
        <div
          className="border-x-2 border-zinc-600 px-4 py-4 flex flex-col gap-3"
          style={{ background: '#1a1a1c' }}
        >
          {/* 続きから */}
          {lastSong && (
            <Link
              href={`/player?source=${lastSong.source}&songId=${lastSong.songId}`}
              className="flex items-center gap-3 rounded-xl border border-zinc-600 px-3 py-2.5 transition-all hover:border-amber-600 active:scale-[0.98] group"
              style={{
                background: 'linear-gradient(to right, #27272a, #1c1c1e)',
                boxShadow: '0 3px 0 rgba(0,0,0,0.5)',
              }}
            >
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 border border-zinc-500 group-hover:border-amber-500 transition-colors"
                style={{ background: 'radial-gradient(circle at 35% 30%, #52525b, #18181b 75%)' }}
              >
                <Icon icon="mdi:play" className="text-amber-400 text-lg ml-0.5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[10px] text-zinc-500 font-mono tracking-widest">RESUME</div>
                <div className="text-sm font-bold text-zinc-100 truncate">{lastSongTitle ?? '続きから再生'}</div>
                {lastSongArtist && (
                  <div className="text-[11px] text-zinc-500 font-mono truncate">{lastSongArtist}</div>
                )}
              </div>
              <Icon icon="mdi:chevron-right" className="text-zinc-600 text-xl flex-shrink-0 group-hover:text-amber-500 transition-colors" />
            </Link>
          )}

          {/* 年代カード (カセットテープ風) */}
          <div className="flex flex-col gap-2">
            <div className="text-[10px] text-zinc-600 font-mono tracking-widest px-1">── SELECT STATION ──</div>
            {DECADES.map((d) => (
              <Link
                key={d.value}
                href={`/player?decade=${d.value}`}
                className={`flex items-center gap-4 rounded-xl border-2 px-3 py-3 transition-all hover:brightness-110 active:scale-[0.98] active:translate-y-px ${d.accent}`}
                style={{
                  background: 'linear-gradient(to right, #27272a, #1c1c1e)',
                  boxShadow: '0 4px 0 rgba(0,0,0,0.6)',
                }}
              >
                <CassetteSVG color={d.reelColor} />
                <div className="flex-1 min-w-0">
                  <div className="text-lg font-black text-zinc-100 leading-none">{d.label}</div>
                  <div className="text-[11px] text-zinc-500 font-mono mt-0.5 tracking-wider">{d.sub}</div>
                </div>
                <Icon icon={d.icon} className="text-2xl text-zinc-600" />
              </Link>
            ))}
          </div>

          {/* お気に入り */}
          <Link
            href="/player?source=favorites"
            className="flex items-center gap-3 rounded-xl border border-zinc-600 px-3 py-2.5 transition-all hover:border-red-700 active:scale-[0.98] group"
            style={{
              background: 'linear-gradient(to right, #1c1015, #1a1a1c)',
              boxShadow: '0 3px 0 rgba(0,0,0,0.5)',
            }}
          >
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 border border-zinc-600 group-hover:border-red-700 transition-colors"
              style={{ background: 'radial-gradient(circle at 35% 30%, #3f1020, #18181b 75%)' }}
            >
              <Icon icon="mdi:heart" className="text-red-500 text-lg" />
            </div>
            <div className="flex-1">
              <div className="text-[10px] text-zinc-600 font-mono tracking-widest">FAVORITES</div>
              <div className="text-sm font-bold text-zinc-100">お気に入り</div>
            </div>
            <Icon icon="mdi:chevron-right" className="text-zinc-600 text-xl flex-shrink-0 group-hover:text-red-500 transition-colors" />
          </Link>
        </div>

        {/* ── ボトムデコレーション ── */}
        <div
          className="rounded-b-3xl border-2 border-t-0 border-zinc-600 px-5 py-3"
          style={{ background: 'linear-gradient(to bottom, #1c1c1e, #18181b)' }}
        >
          <div className="flex items-center justify-between">
            <Knob size={30} rotation={-40} />
            <Knob size={24} rotation={25} />
            <VUMeter />
            <div
              className="w-6 h-6 rounded-full border border-zinc-600 flex items-center justify-center text-zinc-600"
              style={{ background: 'radial-gradient(circle at 35% 30%, #3f3f46, #18181b)' }}
            >
              <Icon icon="mdi:star-four-points" className="text-[10px]" />
            </div>
            <Knob size={24} rotation={-20} />
            <Knob size={30} rotation={60} />
          </div>
        </div>

      </div>
    </div>
  )
}
