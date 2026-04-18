import { redirect } from 'next/navigation'
import { Decade, Source } from '@/types'
import { getRandomSongByDecade } from '@/lib/mockSongs'
import PlayerClient from './PlayerClient'

type Props = {
  searchParams: Promise<{ decade?: string; source?: string }>
}

const VALID_DECADES: Decade[] = ['80s', '90s', '2000s']

export default async function PlayerPage({ searchParams }: Props) {
  const params = await searchParams

  // お気に入りモード: initialSongなしでクライアントに委譲
  if (params.source === 'favorites') {
    return <PlayerClient source="favorites" />
  }

  const decade = params.decade as Decade

  if (!VALID_DECADES.includes(decade)) {
    redirect('/')
  }

  const song = getRandomSongByDecade(decade)
  if (!song) redirect('/')

  return <PlayerClient initialSong={song} source={decade as Source} />
}
