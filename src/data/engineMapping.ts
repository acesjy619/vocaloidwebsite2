export type EngineGroup =
  | 'VOCALOID'
  | 'UTAU'
  | 'Synthesizer V'
  | 'CeVIO / CeVIO AI'
  | 'Mixed / Other'
  | 'Needs Review';

export type EngineMappingEntry = {
  labels: string[];
  canonicalVoice: string;
  engine: string;
  engineGroup: EngineGroup;
};

// Edit this file when a spreadsheet uses a new voice spelling or when a newer
// vocal synth engine should be represented separately in the exhibition.
export const engineMapping: EngineMappingEntry[] = [
  { labels: ['Hatsune Miku', '初音ミク', 'Miku'], canonicalVoice: 'Hatsune Miku', engine: 'VOCALOID', engineGroup: 'VOCALOID' },
  { labels: ['Kagamine Rin', '鏡音リン'], canonicalVoice: 'Kagamine Rin', engine: 'VOCALOID', engineGroup: 'VOCALOID' },
  { labels: ['Kagamine Len', '鏡音レン'], canonicalVoice: 'Kagamine Len', engine: 'VOCALOID', engineGroup: 'VOCALOID' },
  { labels: ['Megurine Luka', '巡音ルカ'], canonicalVoice: 'Megurine Luka', engine: 'VOCALOID', engineGroup: 'VOCALOID' },
  { labels: ['GUMI', 'Megpoid'], canonicalVoice: 'GUMI', engine: 'VOCALOID', engineGroup: 'VOCALOID' },
  { labels: ['IA'], canonicalVoice: 'IA', engine: 'VOCALOID', engineGroup: 'VOCALOID' },
  { labels: ['flower', 'v flower', 'v4 flower'], canonicalVoice: 'flower', engine: 'VOCALOID', engineGroup: 'VOCALOID' },
  { labels: ['KAITO'], canonicalVoice: 'KAITO', engine: 'VOCALOID', engineGroup: 'VOCALOID' },
  { labels: ['MEIKO'], canonicalVoice: 'MEIKO', engine: 'VOCALOID', engineGroup: 'VOCALOID' },
  { labels: ['MAYU'], canonicalVoice: 'MAYU', engine: 'VOCALOID', engineGroup: 'VOCALOID' },
  { labels: ['Otomachi Una', '音街ウナ'], canonicalVoice: 'Otomachi Una', engine: 'VOCALOID', engineGroup: 'VOCALOID' },
  { labels: ['Yuki', '歌愛ユキ'], canonicalVoice: 'Kaai Yuki', engine: 'VOCALOID', engineGroup: 'VOCALOID' },
  { labels: ['Yuzuki Yukari', '結月ゆかり'], canonicalVoice: 'Yuzuki Yukari', engine: 'VOCALOID', engineGroup: 'VOCALOID' },
  { labels: ['Meika Mikoto', '鳴花ミコト'], canonicalVoice: 'Meika Mikoto', engine: 'VOCALOID', engineGroup: 'VOCALOID' },
  { labels: ['Kasane Teto SV', '重音テトSV'], canonicalVoice: 'Kasane Teto SV', engine: 'Synthesizer V', engineGroup: 'Synthesizer V' },
  { labels: ['Kasane Teto', '重音テト'], canonicalVoice: 'Kasane Teto', engine: 'UTAU', engineGroup: 'UTAU' },
  { labels: ['KAFU', '可不'], canonicalVoice: 'KAFU', engine: 'CeVIO AI', engineGroup: 'CeVIO / CeVIO AI' }
];

export const engineColors: Record<EngineGroup, string> = {
  VOCALOID: '#28f0ff',
  UTAU: '#ff477e',
  'Synthesizer V': '#9c6cff',
  'CeVIO / CeVIO AI': '#caff4a',
  'Mixed / Other': '#e6edf3',
  'Needs Review': '#ff9d2e'
};
