import type { Song } from '../../utils/types';
import { theme } from '../../styles/theme';

export type SignalMode = 'HOME' | 'YEAR' | 'VOICE' | 'ENGINE' | 'TAG' | 'VIEWS' | 'ERA';

export const signalModes: SignalMode[] = ['HOME', 'YEAR', 'VOICE', 'ENGINE', 'TAG', 'VIEWS', 'ERA'];

export function engineColor(song: Song): string {
  return theme.engineColors[song.engineGroup[0]];
}

export function songSize(song: Song): number {
  const min = 20;
  const max = 52;
  const normalized = Math.sqrt(Math.max(song.views - 5_000_000, 0) / 14_000_000);
  return min + Math.min(normalized, 1) * (max - min);
}

export function gradientForSong(song: Song): string {
  const color = engineColor(song);
  return `radial-gradient(circle at 32% 28%, #ffffff 0 2px, ${color} 0 18%, rgba(255,255,255,0.12) 19%, rgba(5,7,13,0.88) 72%), linear-gradient(135deg, ${color}55, rgba(255,255,255,0.08))`;
}

export function primaryVoice(song: Song): string {
  const voices = song.vocal.join(' / ');
  if (voices.includes('Kagamine Rin') || voices.includes('Kagamine Len')) return 'Kagamine Rin/Len';
  if (voices.includes('Kasane Teto SV')) return 'Kasane Teto SV';
  if (voices.includes('Kasane Teto')) return 'Kasane Teto';
  return song.vocal[0] ?? 'Other';
}

export function compactEraLabel(era: string): string {
  if (era.includes('Appears')) return '2007-2009\nThe Voice Appears';
  if (era.includes('Genre')) return '2010-2013\nThe Voice Becomes a Genre';
  if (era.includes('Spreads')) return '2014-2017\nThe Voice Reflects and Spreads';
  if (era.includes('Viral')) return '2018-2021\nThe Voice Goes Viral';
  if (era.includes('Mutates')) return '2022-2024\nThe Voice Mutates';
  return era;
}
