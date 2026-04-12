export type Decade = '80s' | '90s' | '2000s'

export type Difficulty = 'easy' | 'medium' | 'hard'

export type Genre = 'jpop' | 'rock' | 'pops' | 'other'

export type ChordSection = {
  label: string
  chords: string[]
}

export type Song = {
  id: string
  title: string
  artist: string
  year: number
  decade: Decade
  genre: Genre
  youtubeId: string
  sections: ChordSection[]
  capo: number
  difficulty: Difficulty
  tags: string[]
}
