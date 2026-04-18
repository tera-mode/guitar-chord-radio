import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

// TODO: ファビコン (app/icon.png) は後日差し替え予定
// TODO: OGP画像 (app/opengraph-image.png) は後日差し替え予定

export const metadata: Metadata = {
  metadataBase: new URL('https://guitar-chord-radio.life'),
  title: 'ギターコードラジオ',
  description: '年代を選ぶだけで、懐かしの曲が次々流れる。コード譜とYouTubeを同時表示するギター弾き語りラジオ',
  openGraph: {
    title: 'ギターコードラジオ',
    description: '年代を選ぶだけで、懐かしの曲が次々流れる。コード譜とYouTubeを同時表示するギター弾き語りラジオ',
    url: 'https://guitar-chord-radio.life',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ja" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-stone-50 text-gray-900">{children}</body>
    </html>
  )
}
