export const eras = [
  {
    id: 'voice-appears',
    range: '2007-2009',
    start: 2007,
    end: 2009,
    title: 'The Voice Appears',
    description:
      'The early years of Hatsune Miku, Niconico memes, character songs, and vocal synth as internet culture.'
  },
  {
    id: 'genre',
    range: '2010-2013',
    start: 2010,
    end: 2013,
    title: 'The Voice Becomes a Genre',
    description:
      'The golden age of vocal synth rock, emotional fast songs, GUMI, IA, storytelling projects, and producer-centered culture.'
  },
  {
    id: 'spreads',
    range: '2014-2017',
    start: 2014,
    end: 2017,
    title: 'The Voice Reflects and Spreads',
    description:
      'Vocal synth music spreads through rhythm games, YouTube, concerts, covers, and self-referential 10th anniversary culture.'
  },
  {
    id: 'viral',
    range: '2018-2021',
    start: 2018,
    end: 2021,
    title: 'The Voice Goes Viral',
    description:
      'Short hooks, cover culture, sharp visual identity, dark pop, flower, GUMI, KAFU, and songs designed for internet circulation.'
  },
  {
    id: 'mutates',
    range: '2022-2024',
    start: 2022,
    end: 2024,
    title: 'The Voice Mutates',
    description:
      'CeVIO, Synthesizer V, Kasane Teto SV, KAFU, hyper-visual songs, meme-like repetition, and expansion beyond traditional VOCALOID.'
  }
];

export function classifyEra(year: number): string {
  return eras.find((era) => year >= era.start && year <= era.end)?.title ?? 'Outside Era Range';
}
