import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'ギターコードラジオ',
    short_name: 'ギターコードラジオ',
    description: '年代を選ぶだけで、懐かしの曲が次々流れる。コード譜とYouTubeを同時表示するギター弾き語りラジオ',
    start_url: '/',
    display: 'standalone',
    background_color: '#fef3c7',
    theme_color: '#f59e0b',
    // TODO: icons は後日 192x192 / 512x512 の実アイコンに差し替え予定
    icons: [
      { src: '/favicon.ico', sizes: '48x48', type: 'image/x-icon' },
    ],
  }
}
