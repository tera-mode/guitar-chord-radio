import { Song } from '@/types'

export const mockSongs: Song[] = [
  // 80年代
  {
    id: 'song_001',
    title: 'I LOVE YOU',
    artist: '尾崎豊',
    year: 1983,
    decade: '80s',
    genre: 'jpop',
    youtubeId: 'dQw4w9WgXcQ', // 要差し替え
    sections: [
      { label: 'イントロ', chords: ['Am', 'F', 'G', 'C'] },
      { label: 'Aメロ', chords: ['Am', 'F', 'G', 'C', 'Am', 'F', 'G', 'E'] },
      { label: 'サビ', chords: ['F', 'G', 'Am', 'C', 'F', 'G', 'C'] },
    ],
    capo: 0,
    difficulty: 'easy',
    tags: ['定番', '弾き語り'],
  },
  {
    id: 'song_002',
    title: 'MARIONETTE',
    artist: 'BOØWY',
    year: 1985,
    decade: '80s',
    genre: 'rock',
    youtubeId: 'dQw4w9WgXcQ', // 要差し替え
    sections: [
      { label: 'イントロ', chords: ['E', 'A', 'B'] },
      { label: 'Aメロ', chords: ['E', 'A', 'E', 'B'] },
      { label: 'サビ', chords: ['A', 'B', 'E', 'C#m', 'A', 'B', 'E'] },
    ],
    capo: 0,
    difficulty: 'easy',
    tags: ['ロック', '定番'],
  },
  {
    id: 'song_003',
    title: '真夏の果実',
    artist: 'サザンオールスターズ',
    year: 1990,
    decade: '80s',
    genre: 'jpop',
    youtubeId: 'dQw4w9WgXcQ', // 要差し替え
    sections: [
      { label: 'イントロ', chords: ['C', 'G', 'Am', 'Em', 'F', 'G', 'C'] },
      { label: 'Aメロ', chords: ['C', 'G', 'Am', 'Em', 'F', 'G', 'C'] },
      { label: 'サビ', chords: ['F', 'G', 'Em', 'Am', 'F', 'G', 'C'] },
    ],
    capo: 0,
    difficulty: 'easy',
    tags: ['夏', '定番', '弾き語り'],
  },
  // 90年代
  {
    id: 'song_004',
    title: 'チェリー',
    artist: 'スピッツ',
    year: 1996,
    decade: '90s',
    genre: 'jpop',
    youtubeId: 'dQw4w9WgXcQ', // 要差し替え
    sections: [
      { label: 'イントロ', chords: ['D', 'A', 'G', 'A'] },
      { label: 'Aメロ', chords: ['D', 'A', 'G', 'A', 'D', 'A', 'G', 'A'] },
      { label: 'Bメロ', chords: ['G', 'A', 'Bm', 'G', 'A'] },
      { label: 'サビ', chords: ['D', 'A', 'G', 'A', 'D', 'A', 'G', 'A'] },
    ],
    capo: 3,
    difficulty: 'easy',
    tags: ['定番', '弾き語り', '初心者向け'],
  },
  {
    id: 'song_005',
    title: 'Tomorrow never knows',
    artist: 'Mr.Children',
    year: 1994,
    decade: '90s',
    genre: 'jpop',
    youtubeId: 'dQw4w9WgXcQ', // 要差し替え
    sections: [
      { label: 'イントロ', chords: ['D', 'A', 'Bm', 'G'] },
      { label: 'Aメロ', chords: ['D', 'A', 'Bm', 'G', 'D', 'A', 'G'] },
      { label: 'サビ', chords: ['G', 'A', 'D', 'Bm', 'G', 'A', 'D'] },
    ],
    capo: 0,
    difficulty: 'easy',
    tags: ['定番', '弾き語り'],
  },
  {
    id: 'song_006',
    title: 'HOWEVER',
    artist: 'GLAY',
    year: 1997,
    decade: '90s',
    genre: 'rock',
    youtubeId: 'dQw4w9WgXcQ', // 要差し替え
    sections: [
      { label: 'イントロ', chords: ['G', 'Em', 'C', 'D'] },
      { label: 'Aメロ', chords: ['G', 'Em', 'C', 'D'] },
      { label: 'サビ', chords: ['Em', 'C', 'G', 'D', 'Em', 'C', 'D'] },
    ],
    capo: 0,
    difficulty: 'easy',
    tags: ['バラード', '定番', '弾き語り'],
  },
  // 2000年代
  {
    id: 'song_007',
    title: '天体観測',
    artist: 'BUMP OF CHICKEN',
    year: 2001,
    decade: '2000s',
    genre: 'rock',
    youtubeId: 'dQw4w9WgXcQ', // 要差し替え
    sections: [
      { label: 'イントロ', chords: ['G', 'D', 'Em', 'C'] },
      { label: 'Aメロ', chords: ['G', 'D', 'Em', 'C', 'G', 'D', 'Em', 'C'] },
      { label: 'Bメロ', chords: ['Em', 'C', 'G', 'D'] },
      { label: 'サビ', chords: ['C', 'G', 'D', 'Em', 'C', 'G', 'D'] },
    ],
    capo: 0,
    difficulty: 'easy',
    tags: ['定番', '弾き語り', '青春'],
  },
  {
    id: 'song_008',
    title: '粉雪',
    artist: 'レミオロメン',
    year: 2005,
    decade: '2000s',
    genre: 'jpop',
    youtubeId: 'dQw4w9WgXcQ', // 要差し替え
    sections: [
      { label: 'イントロ', chords: ['G', 'D', 'Em', 'C'] },
      { label: 'Aメロ', chords: ['G', 'D', 'Em', 'C'] },
      { label: 'サビ', chords: ['C', 'D', 'G', 'Em', 'C', 'D', 'G'] },
    ],
    capo: 0,
    difficulty: 'easy',
    tags: ['冬', '定番', '弾き語り'],
  },
  {
    id: 'song_009',
    title: '小さな恋のうた',
    artist: 'MONGOL800',
    year: 2001,
    decade: '2000s',
    genre: 'rock',
    youtubeId: 'dQw4w9WgXcQ', // 要差し替え
    sections: [
      { label: 'イントロ', chords: ['C', 'G', 'Am', 'F'] },
      { label: 'Aメロ', chords: ['C', 'G', 'Am', 'F', 'C', 'G', 'F', 'G'] },
      { label: 'サビ', chords: ['F', 'G', 'C', 'Am', 'F', 'G', 'C'] },
    ],
    capo: 0,
    difficulty: 'easy',
    tags: ['定番', '弾き語り', '初心者向け'],
  },
]

export function getRandomSongByDecade(decade: string): Song | null {
  const filtered = mockSongs.filter((s) => s.decade === decade)
  if (filtered.length === 0) return null
  return filtered[Math.floor(Math.random() * filtered.length)]
}

export function getSongsByDecade(decade: string): Song[] {
  return mockSongs.filter((s) => s.decade === decade)
}
