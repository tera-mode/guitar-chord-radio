'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Icon } from '@iconify/react'
import { Decade } from '@/types'
import { getSongById } from '@/lib/songs/index'
import SiteFooter from '@/components/ui/SiteFooter'

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
const DECADES: { value: Decade; label: string; en: string; freq: string; accent: string }[] = [
  { value: '80s', label: '80年代', en: "80'S HITS", freq: '1980.0', accent: 'oklch(0.68 0.17 30)' },
  { value: '90s', label: '90年代', en: "90'S HITS", freq: '1990.0', accent: 'oklch(0.72 0.15 80)' },
  { value: '2000s', label: '2000年代', en: "2000'S HITS", freq: '2000.0', accent: 'oklch(0.70 0.13 180)' },
]

const NEEDLE_POSITIONS = [0.18, 0.5, 0.82]

// ルートスペクトル
const ROOT_ORDER = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
const ROOT_COLORS = ROOT_ORDER.map((_, i) => `oklch(0.62 0.17 ${(i / 12) * 360})`)

type LastSong = { songId: string; source: string }

// ── メインページ ─────────────────────────────────────────────────
export default function HomePage() {
  const router = useRouter()
  const [selectedIdx, setSelectedIdx] = useState(1)
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

  const selected = DECADES[selectedIdx]
  const needleLeft = NEEDLE_POSITIONS[selectedIdx]

  return (
    <div className="min-h-screen bg-zinc-900 flex flex-col items-center justify-center px-4 py-8"
      style={{ background: '#1a1512' }}>
      <div className="w-full max-w-sm flex flex-col gap-0">

        {/* ── ブランドパネル ── */}
        <div
          className="rounded-t-3xl border-2 border-b-0 px-5 pt-6 pb-5 text-center"
          style={{
            background: 'linear-gradient(to bottom, #27272a, #1c1c1e)',
            borderColor: 'oklch(0.27 0.015 55)',
            boxShadow: 'inset 0 2px 12px rgba(0,0,0,0.6)',
          }}
        >
          {/* テキストロゴ */}
          <div
            style={{
              fontFamily: 'var(--font-playfair), "Playfair Display", Georgia, serif',
              fontStyle: 'italic',
              fontWeight: 700,
              fontSize: 30,
              background: 'linear-gradient(180deg, #f5d68e, #b8892f 50%, #8b6018)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              letterSpacing: 0.5,
              lineHeight: 1.1,
            }}
          >
            Guitar Chord Radio
          </div>
          <div
            className="mt-1"
            style={{
              fontFamily: 'var(--font-geist-sans), Inter, system-ui',
              fontWeight: 500,
              fontSize: 13,
              color: 'oklch(0.85 0.02 60)',
              letterSpacing: 4,
              opacity: 0.85,
            }}
          >
            ギターコードラジオ
          </div>
          <div
            className="mt-1"
            style={{
              fontFamily: 'var(--font-geist-mono), "Space Mono", monospace',
              fontSize: 9,
              color: 'oklch(0.62 0.02 60)',
              letterSpacing: 3,
            }}
          >
            FM ・ STEREO ・ ONLINE
          </div>
        </div>

        {/* ── メインボディ ── */}
        <div
          className="border-x-2 px-4 py-4 flex flex-col gap-3"
          style={{ background: '#1a1512', borderColor: 'oklch(0.27 0.015 55)' }}
        >

          {/* ── チューニングダイアルパネル ── */}
          <div
            className="rounded-2xl px-4 py-4"
            style={{
              background: 'oklch(0.19 0.015 55)',
              border: '1px solid oklch(0.27 0.015 55)',
              boxShadow: 'inset 0 1px 0 oklch(0.30 0.015 55), 0 2px 8px rgba(0,0,0,0.4)',
            }}
          >
            {/* ヘッダー行 */}
            <div className="flex items-center justify-between mb-3">
              <span
                style={{
                  fontFamily: 'var(--font-geist-mono), monospace',
                  fontSize: 10,
                  color: 'oklch(0.62 0.02 60)',
                  letterSpacing: 2,
                }}
              >
                TUNING ▸ {selected.en}
              </span>
              <div
                style={{
                  fontFamily: 'var(--font-geist-mono), monospace',
                  fontSize: 10,
                  color: selected.accent,
                  border: `1px solid ${selected.accent}`,
                  borderRadius: 10,
                  padding: '1px 7px',
                  boxShadow: `0 0 8px ${selected.accent}44`,
                  transition: 'color 0.3s, border-color 0.3s, box-shadow 0.3s',
                }}
              >
                ● LIVE
              </div>
            </div>

            {/* 周波数ディスプレイ */}
            <div
              className="rounded-lg px-3 py-3"
              style={{
                background: '#000',
                border: '1px solid oklch(0.27 0.015 55)',
                boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.8)',
              }}
            >
              {/* 周波数読み取り */}
              <div className="flex items-baseline justify-center gap-2 mb-2">
                <div
                  style={{
                    fontFamily: 'var(--font-geist-mono), monospace',
                    fontSize: 38,
                    fontWeight: 700,
                    color: selected.accent,
                    letterSpacing: -0.5,
                    lineHeight: 1,
                    textShadow: `0 0 12px ${selected.accent}88`,
                    transition: 'color 0.3s, text-shadow 0.3s',
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {selected.freq}
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-geist-mono), monospace',
                    fontSize: 14,
                    color: 'oklch(0.62 0.02 60)',
                  }}
                >
                  kHz
                </div>
              </div>

              {/* ダイアルルーラー */}
              <div style={{ position: 'relative', height: 42, marginTop: 8 }}>
                {/* ティック */}
                <div style={{ position: 'absolute', top: 14, left: 0, right: 0, height: 20 }}>
                  {Array.from({ length: 60 }).map((_, i) => (
                    <div key={i} style={{
                      position: 'absolute',
                      left: `${(i / 59) * 100}%`,
                      top: 0,
                      width: 1,
                      height: i % 5 === 0 ? 14 : 7,
                      background: 'oklch(0.62 0.02 60)',
                      opacity: 0.5,
                    }} />
                  ))}
                </div>
                {/* 周波数ラベル */}
                {DECADES.map((d, i) => (
                  <div key={d.value} style={{
                    position: 'absolute',
                    left: `${NEEDLE_POSITIONS[i] * 100}%`,
                    top: 0,
                    transform: 'translateX(-50%)',
                    fontFamily: 'var(--font-geist-mono), monospace',
                    fontSize: 8,
                    color: d.accent,
                    letterSpacing: 1,
                    opacity: i === selectedIdx ? 1 : 0.5,
                    transition: 'opacity 0.3s',
                  }}>{d.freq}</div>
                ))}
                {/* 針 */}
                <div style={{
                  position: 'absolute',
                  left: `${needleLeft * 100}%`,
                  top: 10,
                  bottom: 0,
                  width: 2,
                  background: selected.accent,
                  boxShadow: `0 0 8px ${selected.accent}`,
                  transform: 'translateX(-50%)',
                  transition: 'left 0.3s cubic-bezier(0.4, 0, 0.2, 1), background 0.3s, box-shadow 0.3s',
                }} />
                {/* 針ドット */}
                <div style={{
                  position: 'absolute',
                  left: `${needleLeft * 100}%`,
                  top: 6,
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  background: selected.accent,
                  boxShadow: `0 0 10px ${selected.accent}`,
                  transform: 'translate(-50%, 0)',
                  transition: 'left 0.3s cubic-bezier(0.4, 0, 0.2, 1), background 0.3s, box-shadow 0.3s',
                }} />
              </div>

              {/* 年代チップ */}
              <div className="flex gap-1.5 mt-2">
                {DECADES.map((d, i) => (
                  <button
                    key={d.value}
                    onClick={() => setSelectedIdx(i)}
                    className="flex-1 py-1.5 rounded text-xs font-bold transition-all"
                    style={{
                      fontFamily: 'var(--font-geist-mono), monospace',
                      fontSize: 11,
                      letterSpacing: 1,
                      background: i === selectedIdx ? `${d.accent}22` : 'transparent',
                      border: `1px solid ${i === selectedIdx ? d.accent : 'oklch(0.27 0.015 55)'}`,
                      color: i === selectedIdx ? d.accent : 'oklch(0.62 0.02 60)',
                      cursor: 'pointer',
                    }}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            {/* TUNE IN ボタン */}
            <button
              onClick={() => router.push(`/player?decade=${selected.value}`)}
              className="w-full mt-3 py-3 rounded-lg font-bold text-sm transition-all active:scale-[0.98]"
              style={{
                background: selected.accent,
                border: 'none',
                color: '#000',
                fontFamily: 'var(--font-geist-sans), Inter, system-ui',
                fontSize: 14,
                fontWeight: 700,
                letterSpacing: 1,
                cursor: 'pointer',
                boxShadow: `0 0 16px ${selected.accent}55, inset 0 -2px 0 rgba(0,0,0,0.2)`,
                transition: 'background 0.3s, box-shadow 0.3s',
              }}
            >
              TUNE IN ▸ {selected.label}
            </button>
          </div>

          {/* 続きから */}
          {lastSong && (
            <Link
              href={`/player?source=${lastSong.source}&songId=${lastSong.songId}`}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all active:scale-[0.98] group"
              style={{
                background: 'oklch(0.22 0.012 55)',
                border: '1px solid oklch(0.27 0.015 55)',
              }}
            >
              {/* ミニEQ */}
              <div
                className="flex items-end justify-center gap-0.5 flex-shrink-0 rounded"
                style={{
                  width: 36, height: 26, background: '#000',
                  border: '1px solid oklch(0.27 0.015 55)',
                  padding: 3,
                }}
              >
                {[0, 1, 2, 3, 4].map((i) => (
                  <div key={i} style={{
                    width: 3,
                    background: 'oklch(0.70 0.17 45)',
                    height: `${30 + (i * 14) % 55}%`,
                    borderRadius: 1,
                  }} />
                ))}
              </div>
              <div className="flex-1 min-w-0">
                <div
                  style={{
                    fontFamily: 'var(--font-geist-mono), monospace',
                    fontSize: 9,
                    color: 'oklch(0.62 0.02 60)',
                    letterSpacing: 2,
                  }}
                >
                  LAST TUNED
                </div>
                <div className="text-sm font-bold text-zinc-100 truncate">{lastSongTitle ?? '続きから再生'}</div>
                {lastSongArtist && (
                  <div
                    style={{
                      fontFamily: 'var(--font-geist-mono), monospace',
                      fontSize: 11,
                      color: 'oklch(0.62 0.02 60)',
                    }}
                    className="truncate"
                  >{lastSongArtist}</div>
                )}
              </div>
              <Icon icon="mdi:chevron-double-right" className="text-zinc-600 text-lg flex-shrink-0 group-hover:text-amber-500 transition-colors" />
            </Link>
          )}

          {/* お気に入り */}
          <Link
            href="/player?source=favorites"
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all active:scale-[0.98] group"
            style={{
              background: 'oklch(0.22 0.012 55)',
              border: '1px solid oklch(0.27 0.015 55)',
            }}
          >
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 border border-zinc-600 group-hover:border-red-700 transition-colors"
              style={{ background: 'radial-gradient(circle at 35% 30%, #3f1020, #18181b 75%)' }}
            >
              <Icon icon="mdi:heart" className="text-red-500 text-lg" />
            </div>
            <div className="flex-1">
              <div
                style={{
                  fontFamily: 'var(--font-geist-mono), monospace',
                  fontSize: 9,
                  color: 'oklch(0.62 0.02 60)',
                  letterSpacing: 2,
                }}
              >FAVORITES</div>
              <div className="text-sm font-bold text-zinc-100">お気に入り</div>
            </div>
            <Icon icon="mdi:chevron-right" className="text-zinc-600 text-xl flex-shrink-0 group-hover:text-red-500 transition-colors" />
          </Link>

          {/* ルートスペクトル */}
          <div
            className="rounded-xl px-3 py-2.5"
            style={{
              background: 'oklch(0.19 0.015 55)',
              border: '1px solid oklch(0.27 0.015 55)',
            }}
          >
            <div
              className="mb-2"
              style={{
                fontFamily: 'var(--font-geist-mono), monospace',
                fontSize: 9,
                color: 'oklch(0.62 0.02 60)',
                letterSpacing: 2,
              }}
            >ROOT SPECTRUM</div>
            <div className="flex gap-0.5">
              {ROOT_ORDER.map((n, i) => (
                <div key={n} className="flex-1 flex flex-col items-center">
                  <div style={{ height: 10, background: ROOT_COLORS[i], borderRadius: 2, width: '100%' }} />
                  <div
                    className="mt-0.5"
                    style={{
                      fontFamily: 'var(--font-geist-mono), monospace',
                      fontSize: 7,
                      color: 'oklch(0.62 0.02 60)',
                    }}
                  >{n}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── ボトムデコレーション ── */}
        <div
          className="rounded-b-3xl border-2 border-t-0 px-5 py-3"
          style={{
            background: 'linear-gradient(to bottom, #1c1c1e, #18181b)',
            borderColor: 'oklch(0.27 0.015 55)',
          }}
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

      {/* フッター */}
      <div className="w-full max-w-sm mt-2">
        <SiteFooter />
      </div>
    </div>
  )
}
