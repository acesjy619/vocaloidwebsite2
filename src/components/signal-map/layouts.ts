import type { Song } from '../../utils/types';
import type { SignalMode } from './visualUtils';
import { compactEraLabel, primaryVoice, songSize } from './visualUtils';

export type SignalNodePosition = {
  id: string;
  x: number;
  y: number;
  size: number;
};

export type SignalGuide = {
  label: string;
  x: number;
  y: number;
  align?: 'left' | 'center' | 'right';
};

export type SignalLayout = {
  nodes: Record<string, SignalNodePosition>;
  guides: SignalGuide[];
};

type LayoutInput = {
  songs: Song[];
  mode: SignalMode;
  width: number;
  height: number;
};

const margin = 80;

export function buildSignalLayout({ songs, mode, width, height }: LayoutInput): SignalLayout {
  if (!width || !height) return { nodes: {}, guides: [] };
  if (mode === 'YEAR') return yearLayout(songs, width, height);
  if (mode === 'VOICE') return clusterLayout(songs, width, height, primaryVoice);
  if (mode === 'ENGINE') return clusterLayout(songs, width, height, (song) => song.engineGroup[0]);
  if (mode === 'TAG') return clusterLayout(songs, width, height, (song) => song.tagGroups[0] ?? 'Other');
  if (mode === 'VIEWS') return viewsLayout(songs, width, height);
  if (mode === 'ERA') return clusterLayout(songs, width, height, (song) => compactEraLabel(song.era));
  return homeLayout(songs, width, height);
}

function homeLayout(songs: Song[], width: number, height: number): SignalLayout {
  const nodes: Record<string, SignalNodePosition> = {};
  const cx = width * 0.5;
  const cy = height * 0.5;
  songs.forEach((song, index) => {
    const angle = index * 2.399963 + (song.year - 2007) * 0.17;
    const radius = Math.sqrt(index / songs.length) * Math.min(width, height) * 0.42;
    nodes[song.id] = {
      id: song.id,
      x: cx + Math.cos(angle) * radius + Math.sin(song.views) * 18,
      y: cy + Math.sin(angle) * radius * 0.82 + Math.cos(song.year) * 14,
      size: songSize(song)
    };
  });
  return {
    nodes,
    guides: [
      { label: 'Archive cloud', x: cx, y: 72, align: 'center' },
      { label: '115 vocal synth signals', x: cx, y: height - 50, align: 'center' }
    ]
  };
}

function yearLayout(songs: Song[], width: number, height: number): SignalLayout {
  const nodes: Record<string, SignalNodePosition> = {};
  const years = Array.from(new Set(songs.map((song) => song.year))).sort((a, b) => a - b);
  const guides = years.map((year, index) => ({
    label: String(year),
    x: margin + (index / Math.max(years.length - 1, 1)) * (width - margin * 2),
    y: 76,
    align: 'center' as const
  }));
  const counts = new Map<number, number>();
  songs.forEach((song) => {
    const yearIndex = years.indexOf(song.year);
    const count = counts.get(song.year) ?? 0;
    counts.set(song.year, count + 1);
    nodes[song.id] = {
      id: song.id,
      x: margin + (yearIndex / Math.max(years.length - 1, 1)) * (width - margin * 2) + ((count % 3) - 1) * 15,
      y: 145 + (count % 12) * 38 + Math.floor(count / 12) * 11,
      size: songSize(song)
    };
  });
  return { nodes, guides };
}

function viewsLayout(songs: Song[], width: number, height: number): SignalLayout {
  const nodes: Record<string, SignalNodePosition> = {};
  const sorted = [...songs].sort((a, b) => b.views - a.views);
  const cx = width / 2;
  const cy = height / 2;
  sorted.forEach((song, index) => {
    const ring = Math.floor(Math.sqrt(index));
    const angle = index * 2.17;
    nodes[song.id] = {
      id: song.id,
      x: cx + Math.cos(angle) * ring * 42,
      y: cy + Math.sin(angle) * ring * 31,
      size: songSize(song) + Math.max(0, 12 - index * 0.12)
    };
  });
  return {
    nodes,
    guides: [
      { label: 'highest views', x: cx, y: cy - 74, align: 'center' },
      { label: 'lower view count orbit', x: width - 120, y: height - 58, align: 'right' }
    ]
  };
}

function clusterLayout(songs: Song[], width: number, height: number, getKey: (song: Song) => string): SignalLayout {
  const nodes: Record<string, SignalNodePosition> = {};
  const groups = Array.from(new Set(songs.map(getKey))).sort((a, b) => a.localeCompare(b));
  const cols = Math.ceil(Math.sqrt(groups.length));
  const rows = Math.ceil(groups.length / cols);
  const guides: SignalGuide[] = [];
  const grouped = new Map<string, Song[]>();
  groups.forEach((group) => grouped.set(group, []));
  songs.forEach((song) => grouped.get(getKey(song))?.push(song));

  groups.forEach((group, groupIndex) => {
    const col = groupIndex % cols;
    const row = Math.floor(groupIndex / cols);
    const cx = margin + (col + 0.5) * ((width - margin * 2) / cols);
    const cy = 120 + (row + 0.5) * ((height - 185) / rows);
    guides.push({ label: group, x: cx, y: cy - 72, align: 'center' });
    const groupSongs = grouped.get(group) ?? [];
    groupSongs.forEach((song, index) => {
      const angle = index * 2.399963;
      const radius = 18 + Math.sqrt(index) * 20;
      nodes[song.id] = {
        id: song.id,
        x: cx + Math.cos(angle) * radius,
        y: cy + Math.sin(angle) * radius * 0.82,
        size: songSize(song)
      };
    });
  });
  return { nodes, guides };
}
