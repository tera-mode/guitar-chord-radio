'use client'

import { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react'

type Props = {
  videoId: string
  onEnded?: () => void
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

const YouTubePlayer = forwardRef<YouTubePlayerRef, Props>(function YouTubePlayer(
  { videoId, onEnded },
  ref
) {
  const containerRef = useRef<HTMLDivElement>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const playerRef = useRef<any>(null)
  const onEndedRef = useRef(onEnded)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState<Speed>(1.0)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    onEndedRef.current = onEnded
  }, [onEnded])

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
        playerVars: {
          rel: 0,
          modestbranding: 1,
          playsinline: 1,
        },
        events: {
          onReady: () => setReady(true),
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onStateChange: (e: any) => {
            const state = e.data
            setIsPlaying(state === window.YT.PlayerState.PLAYING)
            if (state === window.YT.PlayerState.ENDED) {
              onEndedRef.current?.()
            }
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
      setIsPlaying(false)
    }
  }, [videoId])

  const togglePlay = () => {
    if (!playerRef.current || !ready) return
    if (isPlaying) {
      playerRef.current.pauseVideo()
    } else {
      playerRef.current.playVideo()
    }
  }

  const changeSpeed = (s: Speed) => {
    setSpeed(s)
    playerRef.current?.setPlaybackRate(s)
  }

  return (
    <div className="flex flex-col gap-2">
      {/* YouTube埋め込みエリア: モバイルは高さを32vhに制限 */}
      <div className="relative w-full bg-black rounded-xl overflow-hidden h-[32vh] md:h-auto md:aspect-video">
        <div ref={containerRef} className="w-full h-full" />
      </div>

      {/* コントロール */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* 再生/停止 */}
        <button
          onClick={togglePlay}
          disabled={!ready}
          className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full bg-amber-500 hover:bg-amber-600 disabled:bg-gray-300 text-white transition-colors shadow flex-shrink-0"
          aria-label={isPlaying ? '一時停止' : '再生'}
        >
          {isPlaying ? (
            <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 24 24">
              <rect x="6" y="4" width="4" height="16" />
              <rect x="14" y="4" width="4" height="16" />
            </svg>
          ) : (
            <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>

        {/* 再生速度 */}
        <div className="flex items-center gap-1">
          <span className="text-xs text-gray-500 mr-0.5">速度</span>
          {SPEEDS.map((s) => (
            <button
              key={s}
              onClick={() => changeSpeed(s)}
              className={`px-1.5 py-0.5 md:px-2 md:py-1 text-xs rounded-full font-mono transition-colors ${
                speed === s
                  ? 'bg-amber-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>
    </div>
  )
})

export default YouTubePlayer
