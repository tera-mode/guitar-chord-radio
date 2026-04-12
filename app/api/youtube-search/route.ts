import { NextRequest, NextResponse } from 'next/server'

// YouTube Data API v3 で動画を検索して最初のvideoIdを返す
// GET /api/youtube-search?q=スピッツ+チェリー
export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q')
  if (!q) {
    return NextResponse.json({ error: 'q is required' }, { status: 400 })
  }

  const apiKey = process.env.YOUTUBE_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'YOUTUBE_API_KEY not configured' }, { status: 500 })
  }

  const url = new URL('https://www.googleapis.com/youtube/v3/search')
  url.searchParams.set('part', 'snippet')
  url.searchParams.set('q', q)
  url.searchParams.set('type', 'video')
  url.searchParams.set('maxResults', '1')
  url.searchParams.set('key', apiKey)

  const res = await fetch(url.toString(), { next: { revalidate: 86400 } }) // 24時間キャッシュ
  if (!res.ok) {
    const err = await res.json()
    return NextResponse.json({ error: err?.error?.message ?? 'YouTube API error' }, { status: res.status })
  }

  const data = await res.json()
  const videoId: string | undefined = data?.items?.[0]?.id?.videoId
  if (!videoId) {
    return NextResponse.json({ error: 'No video found' }, { status: 404 })
  }

  return NextResponse.json({ videoId })
}
