export type TagGroup =
  | 'Character / Idol'
  | 'Rock / Band'
  | 'Electronic / Dance'
  | 'Story / Worldbuilding'
  | 'Dark / Emotional'
  | 'Game / Redistribution'
  | 'Meme / Hyper-Visual'
  | 'Other';

export type TagGroupRule = {
  group: TagGroup;
  keywords: string[];
};

// Add keywords here to tune the archival reading. Matching is case-insensitive
// and partial, so Japanese aliases and game titles can be short but specific.
export const tagGroupRules: TagGroupRule[] = [
  {
    group: 'Character / Idol',
    keywords: ['cute', 'idol', 'character song', 'image song', 'meta', 'meme', 'mascot', '初音ミク', 'ミク', 'kawaii', '可愛い']
  },
  {
    group: 'Rock / Band',
    keywords: ['rock', 'j-rock', 'alternative rock', 'pop rock', 'vocaloud', 'guitar', 'band', 'ロック', 'ギター']
  },
  {
    group: 'Electronic / Dance',
    keywords: ['electropop', 'techno', 'dance-pop', 'digital rock', 'chiptune', 'edm', 'happy hardcore', 'denpa', 'electro', 'テクノ']
  },
  {
    group: 'Story / Worldbuilding',
    keywords: ['story', 'series', 'tragedy', 'narrative', 'worldbuilding', 'kagerou project', 'カゲロウプロジェクト', 'light novel']
  },
  {
    group: 'Dark / Emotional',
    keywords: ['sad', 'dark', 'lonely', 'intense', 'unstable', 'fast tempo', 'fast singing', 'emotional', 'heartbreak', '切ない', 'ダーク']
  },
  {
    group: 'Game / Redistribution',
    keywords: ['project diva', 'project sekai', 'プロセカ', 'maimai', 'chunithm', 'groove coaster', 'rhythm game', 'オンゲキ', 'sound voltex', 'taiko']
  },
  {
    group: 'Meme / Hyper-Visual',
    keywords: ['meme', 'viral', 'chaotic', 'hypervisual', 'short hook', 'internet', 'parody', '2d animated pv', 'fhd pv', 'ネタ']
  }
];
