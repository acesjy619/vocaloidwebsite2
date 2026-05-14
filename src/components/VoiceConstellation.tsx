import { useMemo } from 'react';
import * as d3 from 'd3';
import type { Song } from '../utils/types';
import { theme } from '../styles/theme';

type Props = {
  songs: Song[];
  selectedVoice: string | null;
  onSelectVoice: (voice: string | null) => void;
  onSelectSong: (song: Song) => void;
};

export default function VoiceConstellation({ songs, selectedVoice, onSelectVoice, onSelectSong }: Props) {
  const width = 1120;
  const height = 620;
  const voices = useMemo(() => {
    const counts = new Map<string, Song[]>();
    songs.forEach((song) => song.vocal.forEach((voice) => counts.set(voice, [...(counts.get(voice) ?? []), song])));
    return Array.from(counts.entries())
      .map(([voice, voiceSongs], index) => ({ voice, songs: voiceSongs, index }))
      .sort((a, b) => b.songs.length - a.songs.length);
  }, [songs]);
  const songRadius = d3.scaleSqrt().domain(d3.extent(songs, (song) => song.views) as [number, number]).range([2.5, 8]);

  return (
    <section className="py-24">
      <div className="section-shell">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-violet-200/70">Voice constellation</p>
            <h2 className="mt-3 text-4xl font-black text-white md:text-6xl">Characters as gravity wells</h2>
          </div>
          {selectedVoice && (
            <button className="chip rounded-full px-4 py-2 text-sm text-slate-200" onClick={() => onSelectVoice(null)}>
              Clear voice filter: {selectedVoice}
            </button>
          )}
        </div>
        <div className="archive-panel overflow-hidden rounded-lg p-3">
          <svg viewBox={`0 0 ${width} ${height}`} className="h-[620px] w-full">
            <rect width={width} height={height} fill="rgba(5,7,13,0.16)" />
            {voices.map((voiceNode, voiceIndex) => {
              const angle = (voiceIndex / voices.length) * Math.PI * 2 - Math.PI / 2;
              const ring = voiceIndex < 4 ? 160 : voiceIndex < 10 ? 230 : 285;
              const cx = width / 2 + Math.cos(angle) * ring;
              const cy = height / 2 + Math.sin(angle) * ring * 0.72;
              const firstGroup = voiceNode.songs[0]?.engineGroup[0] ?? 'Mixed / Other';
              const color = theme.engineColors[firstGroup];
              const active = !selectedVoice || selectedVoice === voiceNode.voice;
              return (
                <g key={voiceNode.voice} opacity={active ? 1 : 0.18}>
                  {voiceNode.songs.slice(0, 16).map((song, songIndex) => {
                    const orbit = 36 + (songIndex % 4) * 16;
                    const theta = (songIndex / Math.max(voiceNode.songs.length, 1)) * Math.PI * 2 + voiceIndex;
                    const sx = cx + Math.cos(theta) * orbit;
                    const sy = cy + Math.sin(theta) * orbit;
                    return (
                      <g key={`${voiceNode.voice}-${song.id}`}>
                        <line x1={cx} y1={cy} x2={sx} y2={sy} stroke={color} opacity={0.16} />
                        <circle cx={sx} cy={sy} r={songRadius(song.views)} fill={color} opacity={0.72} className="cursor-pointer glow-dot" onClick={() => onSelectSong(song)} />
                      </g>
                    );
                  })}
                  <circle
                    cx={cx}
                    cy={cy}
                    r={15 + Math.sqrt(voiceNode.songs.length) * 6}
                    fill="rgba(5,7,13,0.92)"
                    stroke={color}
                    strokeWidth={2}
                    className="cursor-pointer glow-dot"
                    onClick={() => onSelectVoice(selectedVoice === voiceNode.voice ? null : voiceNode.voice)}
                  />
                  <text x={cx} y={cy + 4} textAnchor="middle" className="pointer-events-none fill-white text-[13px] font-black">
                    {voiceNode.voice}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>
    </section>
  );
}
