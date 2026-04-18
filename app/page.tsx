import Link from 'next/link'
import { Decade } from '@/types'

const DECADES: { value: Decade; label: string; sub: string; emoji: string; bg: string }[] = [
  {
    value: '80s',
    label: '80年代',
    sub: '尾崎豊 / BOØWY / サザン',
    emoji: '🎸',
    bg: 'from-orange-400 to-amber-500',
  },
  {
    value: '90s',
    label: '90年代',
    sub: 'スピッツ / Mr.Children / GLAY',
    emoji: '🎵',
    bg: 'from-amber-400 to-yellow-500',
  },
  {
    value: '2000s',
    label: '2000年代',
    sub: 'BUMP / レミオロメン / MONGOL800',
    emoji: '🎶',
    bg: 'from-yellow-400 to-lime-500',
  },
]

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-4 py-12">
      {/* ヘッダー */}
      <div className="text-center mb-12">
        <div className="text-5xl mb-4">🎸</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">あの頃チャンネル</h1>
        <p className="text-gray-500 text-base max-w-xs mx-auto leading-relaxed">
          ギターを手に取ったら、<br />あの頃の曲がすぐ弾ける
        </p>
      </div>

      {/* 年代選択 */}
      <div className="w-full max-w-sm flex flex-col gap-4">
        <p className="text-center text-sm text-gray-400 font-medium tracking-wider uppercase">
          年代を選ぶ
        </p>
        {DECADES.map((d) => (
          <Link
            key={d.value}
            href={`/player?decade=${d.value}`}
            className={`relative flex items-center gap-4 p-5 rounded-2xl bg-gradient-to-r ${d.bg} text-white shadow-md hover:shadow-lg hover:scale-[1.02] transition-all active:scale-[0.98]`}
          >
            <span className="text-3xl">{d.emoji}</span>
            <div>
              <div className="text-xl font-bold">{d.label}</div>
              <div className="text-sm opacity-80 mt-0.5">{d.sub}</div>
            </div>
            <span className="absolute right-5 text-xl opacity-60">→</span>
          </Link>
        ))}

        {/* お気に入りカード */}
        <Link
          href="/player?source=favorites"
          className="relative flex items-center gap-4 p-5 rounded-2xl bg-gradient-to-r from-pink-400 to-rose-500 text-white shadow-md hover:shadow-lg hover:scale-[1.02] transition-all active:scale-[0.98]"
        >
          <span className="text-3xl">❤️</span>
          <div>
            <div className="text-xl font-bold">お気に入り</div>
            <div className="text-sm opacity-80 mt-0.5">保存した曲を聴く</div>
          </div>
          <span className="absolute right-5 text-xl opacity-60">→</span>
        </Link>
      </div>

      <p className="mt-12 text-xs text-gray-300">
        コード名をタップすると押さえ方が見られます
      </p>
    </main>
  )
}
