import { useMemo, useState } from 'react';
import * as d3 from 'd3';
import { theme } from '../styles/theme';
import type { Song } from '../utils/types';
import { formatViews } from '../utils/formatViews';

type Props = {
  songs: Song[];
  onSelectSong: (song: Song) => void;
};

export default function MainTimeline({ songs, onSelectSong }: Props) {
  const [hovered, setHovered] = useState<Song | null>(null);
  const width = 1120;
  const height = 430;
  const yearDomain = d3.extent(songs, (song) => song.year) as [number, number];
  const x = d3.scaleLinear().domain([yearDomain[0] - 0.5, yearDomain[1] + 0.5]).range([70, width - 45]);
  const r = d3.scaleSqrt().domain(d3.extent(songs, (song) => song.views) as [number, number]).range([4, 18]);
  const rows = useMemo(() => {
    const buckets = new Map<number, number>();
    return songs.map((song) => {
      const count = buckets.get(song.year) ?? 0;
      buckets.set(song.year, count + 1);
      return { song, y: 90 + (count % 9) * 32 + Math.floor(count / 9) * 8 };
    });
  }, [songs]);

  return (
    <section className="py-24">
      <div className="section-shell">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-cyan-200/70">Main timeline</p>
            <h2 className="mt-3 text-4xl font-black text-white md:text-6xl">Songs as signal flares</h2>
          </div>
          <p className="max-w-lg text-sm leading-6 text-slate-400">Dot size follows Niconico views. Color follows engine group. Hover to inspect; click to open the archival card.</p>
        </div>
        <div className="archive-panel relative overflow-hidden rounded-lg p-3">
          <svg viewBox={`0 0 ${width} ${height}`} className="h-[440px] w-full">
            <defs>
              <filter id="timelineGlow">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <rect width={width} height={height} fill="rgba(5, 7, 13, 0.24)" />
            {d3.range(yearDomain[0], yearDomain[1] + 1).map((year) => (
              <g key={year}>
                <line x1={x(year)} x2={x(year)} y1={48} y2={360} stroke={theme.grid} />
                <text x={x(year)} y={396} textAnchor="middle" className="fill-slate-500 text-[18px] font-black">
                  {year}
                </text>
              </g>
            ))}
            {rows.map(({ song, y }, index) => {
              const color = theme.engineColors[song.engineGroup[0]];
              return (
                <g key={song.id}>
                  {index > 0 && <line x1={x(song.year)} x2={x(song.year) + Math.sin(index) * 26} y1={y} y2={y - 24} stroke={color} opacity={0.08} />}
                  <circle
                    cx={x(song.year)}
                    cy={y}
                    r={r(song.views)}
                    fill={color}
                    stroke={song.needsReview ? theme.engineColors['Needs Review'] : 'rgba(255,255,255,0.75)'}
                    strokeWidth={song.needsReview ? 2 : 0.8}
                    opacity={hovered && hovered.id !== song.id ? 0.32 : 0.9}
                    filter="url(#timelineGlow)"
                    className="cursor-pointer transition-opacity"
                    onMouseEnter={() => setHovered(song)}
                    onMouseLeave={() => setHovered(null)}
                    onClick={() => onSelectSong(song)}
                  />
                </g>
              );
            })}
          </svg>
          {hovered && (
            <div className="pointer-events-none absolute left-5 top-5 max-w-sm rounded-lg border border-cyan-200/20 bg-[#070b14]/95 p-4 shadow-2xl">
              <p className="text-xs uppercase tracking-[0.2em] text-cyan-200">{hovered.year} / {formatViews(hovered.views)}</p>
              <h3 className="mt-2 text-xl font-black text-white">{hovered.title}</h3>
              <p className="mt-2 text-sm text-slate-300">{hovered.vocal.join(', ')} / {hovered.engineGroup.join(', ')}</p>
              <p className="mt-2 line-clamp-2 text-xs text-slate-500">{hovered.tagGroups.join(' · ')}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
