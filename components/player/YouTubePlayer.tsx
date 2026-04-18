'use client'

import { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react'

type Props = {
  videoId: string
  onEnded?: () => void
  autoplay?: boolean
}

export type YouTubePlayerRef = {
  replay: () => void
}

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    YT: any
    onYouTubeIframeAPIReady: () => void
  }
}

const SPEEDS = [0.5, 0.75, 1.0] as const
type Speed = (typeof SPEEDS)[number]

// 速度 → 周波数マッピング（デコラティブ）
const SPEED_TO_FREQ: Record<number, number> = { 0.5: 82, 0.75: 91, 1.0: 100 }
const SPEED_LABEL: Record<number, string> = { 0.5: '½×', 0.75: '¾×', 1.0: '1×' }
const MIN_FREQ = 78, MAX_FREQ = 114

function FrequencyTuner({ speed, onCycle }: { speed: Speed; onCycle: () => void }) {
  const freq = SPEED_TO_FREQ[speed] ?? 100
  const pct = ((freq - MIN_FREQ) / (MAX_FREQ - MIN_FREQ)) * 100

  return (
    <div className="flex items-center gap-2 px-2 py-2">
      {/* 速度ダイヤルボタン */}
      <button
        onClick={onCycle}
        className="w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold font-mono text-zinc-200 border border-zinc-500 transition-all hover:border-amber-500 hover:text-amber-300 active:scale-95"
        style={{
          background: 'radial-gradient(circle at 35% 30%, #52525b, #18181b 75%)',
          boxShadow: '0 2px 6px rgba(0,0,0,0.5), inset 0 1px 1px rgba(255,255,255,0.07)',
        }}
      >
        {SPEED_LABEL[speed]}
      </button>

      {/* 周波数チューナーバー */}
      <div className="flex-1 bg-zinc-950 rounded-lg border border-zinc-700 px-2.5 pt-1 pb-2 shadow-inner">
        {/* ラベル */}
        <div className="flex justify-between items-end mb-1">
          {[80, 90, 100, 110].map((f) => (
            <span key={f} className="text-[9px] font-mono text-zinc-500">{f}</span>
          ))}
          <span className="text-[9px] font-mono text-zinc-600">MHz</span>
        </div>
        {/* トラック */}
        <div className="relative h-px bg-zinc-700 mx-1">
          {/* 目盛り */}
          {[0, 33.3, 66.6, 100].map((p) => (
            <div
              key={p}
              className="absolute bg-zinc-600"
              style={{ left: `${p}%`, width: 1, height: 6, top: -2 }}
            />
          ))}
          {/* 針 */}
          <div
            className="absolute bg-red-500 transition-all duration-500 ease-in-out"
            style={{ left: `${pct}%`, width: 2, height: 14, top: -6, transform: 'translateX(-50%)' }}
          />
        </div>
      </div>
    </div>
  )
}

const YouTubePlayer = forwardRef<YouTubePlayerRef, Props>(function YouTubePlayer(
  { videoId, onEnded, autoplay },
  ref
) {
  const containerRef = useRef<HTMLDivElement>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const playerRef = useRef<any>(null)
  const onEndedRef = useRef(onEnded)
  const [speed, setSpeed] = useState<Speed>(1.0)
  const [ready, setReady] = useState(false)

  useEffect(() => { onEndedRef.current = onEnded }, [onEnded])

  useImperativeHandle(ref, () => ({
    replay: () => {
      playerRef.current?.seekTo(0)
      playerRef.current?.playVideo()
    },
  }))

  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement('script')
      tag.src = 'https://www.youtube.com/iframe_api'
      document.head.appendChild(tag)
    }

    const initPlayer = () => {
      if (!containerRef.current) return
      playerRef.current = new window.YT.Player(containerRef.current, {
        videoId,
        playerVars: { rel: 0, modestbranding: 1, playsinline: 1, autoplay: autoplay ? 1 : 0 },
        events: {
          onReady: () => setReady(true),
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onStateChange: (e: any) => {
            if (e.data === window.YT.PlayerState.ENDED) onEndedRef.current?.()
          },
        },
      })
    }

    if (window.YT && window.YT.Player) {
      initPlayer()
    } else {
      window.onYouTubeIframeAPIReady = initPlayer
    }

    return () => {
      playerRef.current?.destroy()
      playerRef.current = null
      setReady(false)
    }
  }, [videoId])

  const cycleSpeed = () => {
    const next = SPEEDS[(SPEEDS.indexOf(speed) + 1) % SPEEDS.length]
    setSpeed(next)
    playerRef.current?.setPlaybackRate(next)
  }

  return (
    <div className="flex flex-col">
      {/* 動画エリア */}
      <div className="relative w-full aspect-video bg-black">
        <div ref={containerRef} className="w-full h-full" />
        {!ready && (
          <div className="absolute inset-0 flex items-center justify-center text-zinc-600 text-xs font-mono tracking-widest">
            ■ STANDBY
          </div>
        )}
      </div>
      {/* チューナー */}
      <FrequencyTuner speed={speed} onCycle={cycleSpeed} />
    </div>
  )
})

export default YouTubePlayer
