import type { EngineGroup } from '../data/engineMapping';

export const theme = {
  background: '#05070d',
  panel: 'rgba(9, 13, 24, 0.72)',
  panelStrong: 'rgba(12, 18, 32, 0.94)',
  grid: 'rgba(150, 190, 255, 0.13)',
  text: '#f3f7ff',
  muted: '#9aa9bf',
  accent: '#28f0ff',
  engineColors: {
    VOCALOID: '#28f0ff',
    UTAU: '#ff477e',
    'Synthesizer V': '#9c6cff',
    'CeVIO / CeVIO AI': '#caff4a',
    'Mixed / Other': '#e6edf3',
    'Needs Review': '#ff9d2e'
  } satisfies Record<EngineGroup, string>
};
