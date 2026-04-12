// YouTube動画IDをAPIで検索し、ローカルストレージにキャッシュする
// API呼び出しを最小限に抑えるため、一度取得したIDはキャッシュに保存

const CACHE_KEY = 'anokoro-yt-cache'
const PLACEHOLDER_ID = 'dQw4w9WgXcQ'

type Cache = Record<string, string> // songId → videoId

function readCache(): Cache {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function writeCache(cache: Cache) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache))
  } catch {}
}

/**
 * 曲のYouTube動画IDを取得する。
 * キャッシュにあればそれを返し、なければAPI検索を行う。
 * @param songId    曲のID（キャッシュキー）
 * @param artist    アーティスト名
 * @param title     曲タイトル
 * @param storedId  mockSongsに設定済みのID（プレースホルダー以外ならそのまま使う）
 */
export async function resolveVideoId(
  songId: string,
  artist: string,
  title: string,
  storedId: string,
): Promise<string> {
  // プレースホルダー以外が設定されていればそのまま使う
  if (storedId && storedId !== PLACEHOLDER_ID) return storedId

  // キャッシュを確認
  const cache = readCache()
  if (cache[songId]) return cache[songId]

  // API検索
  const q = encodeURIComponent(`${artist} ${title}`)
  try {
    const res = await fetch(`/api/youtube-search?q=${q}`)
    if (!res.ok) throw new Error(`status ${res.status}`)
    const data = await res.json()
    const videoId: string = data.videoId
    // キャッシュに保存
    cache[songId] = videoId
    writeCache(cache)
    return videoId
  } catch (e) {
    console.error('[youtubeSearch] 検索失敗:', e)
    return storedId // 失敗時は元のID（プレースホルダーでも）を返す
  }
}
