import { Song, Decade } from '@/types'
import { songs80s } from './songs80s'
import { songs90s } from './songs90s'
import { songs2000s } from './songs2000s'

export const allSongs: Song[] = [...songs80s, ...songs90s, ...songs2000s]

export function getSongsByDecade(decade: string): Song[] {
  return allSongs.filter((s) => s.decade === decade)
}

export function getRandomSongByDecade(decade: string): Song | null {
  const filtered = getSongsByDecade(decade)
  if (filtered.length === 0) return null
  return filtered[Math.floor(Math.random() * filtered.length)]
}

export function getSongsByIds(ids: string[]): Song[] {
  const idSet = new Set(ids)
  return allSongs.filter((s) => idSet.has(s.id))
}

export function getRandomSongFromList(list: Song[], exclude?: Song): Song | null {
  if (list.length === 0) return null
  if (list.length === 1) return list[0]
  const candidates = exclude ? list.filter((s) => s.id !== exclude.id) : list
  if (candidates.length === 0) return list[0]
  return candidates[Math.floor(Math.random() * candidates.length)]
}

// 年代ラベル
export const DECADE_LABEL: Record<Decade, string> = {
  '80s': '80年代',
  '90s': '90年代',
  '2000s': '2000年代',
}
