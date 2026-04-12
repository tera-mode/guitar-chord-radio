import { redirect } from 'next/navigation'
import { Decade } from '@/types'
import { getRandomSongByDecade } from '@/lib/mockSongs'
import PlayerClient from './PlayerClient'

type Props = {
  searchParams: Promise<{ decade?: string }>
}

const VALID_DECADES: Decade[] = ['80s', '90s', '2000s']

export default async function PlayerPage({ searchParams }: Props) {
  const params = await searchParams
  const decade = params.decade as Decade

  if (!VALID_DECADES.includes(decade)) {
    redirect('/')
  }

  const song = getRandomSongByDecade(decade)
  if (!song) redirect('/')

  return <PlayerClient initialSong={song} decade={decade} />
}
