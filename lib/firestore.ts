import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from './firebase'
import { Song, Decade } from '@/types'
import { getSongsByDecade, getRandomSongByDecade } from './mockSongs'

const USE_MOCK = !process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID

export async function fetchSongsByDecade(decade: Decade): Promise<Song[]> {
  if (USE_MOCK) return getSongsByDecade(decade)

  const q = query(collection(db, 'songs'), where('decade', '==', decade))
  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Song))
}

export async function fetchRandomSongByDecade(decade: Decade): Promise<Song | null> {
  if (USE_MOCK) return getRandomSongByDecade(decade)

  const songs = await fetchSongsByDecade(decade)
  if (songs.length === 0) return null
  return songs[Math.floor(Math.random() * songs.length)]
}
