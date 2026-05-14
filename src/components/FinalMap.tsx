import * as d3 from 'd3';
import type { Song } from '../utils/types';
import { theme } from '../styles/theme';

type Props = {
  songs: Song[];
  onSelectSong: (song: Song) => void;
};

export default function FinalMap({ songs, onSelectSong }: Props) {
  const width = 1120;
  const height = 720;
  const x = d3.scaleLinear().domain([2007, 2024]).range([70, width - 70]);
  const r = d3.scaleSqrt().domain(d3.extent(songs, (song) => song.views) as [number, number]).range([3, 16]);

  return (
    <section className="grid-field relative min-h-screen py-24">
      <div className="section-shell">
        <div className="mb-10">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-cyan-200/70">Final synthetic voice map</p>
          <h2 className="mt-3 text-5xl font-black text-white md:text-7xl">Synthetic Voice Map</h2>
          <p className="mt-5 max-w-3xl text-base leading-7 text-slate-400">
            This archive shows that vocal synth music is not just the history of one software or one character. It is a map of how artificial voices learned to carry human emotion across internet culture.
          </p>
        </div>
        <div className="archive-panel overflow-hidden rounded-lg p-3">
          <svg viewBox={`0 0 ${width} ${height}`} className="h-[720px] w-full">
            <rect width={width} height={height} fill="rgba(5,7,13,0.36)" />
            {d3.range(2007, 2025).map((year) => (
              <g key={year}>
                <line x1={x(year)} x2={x(year)} y1={70} y2={650} stroke="rgba(150,190,255,0.1)" />
                <text x={x(year)} y={674} textAnchor="middle" className="fill-slate-600 text-[14px] font-black">{year}</text>
              </g>
            ))}
            {songs.map((song, index) => {
              const band = song.tagGroups[0] ?? 'Other';
              const y = 110 + (Math.abs(hash(band)) % 440) + Math.sin(index * 0.8) * 48;
              const color = theme.engineColors[song.engineGroup[0]];
              return (
                <g key={song.id} className="cursor-pointer" onClick={() => onSelectSong(song)}>
                  <line x1={x(song.year)} x2={x(song.year) + Math.sin(index) * 58} y1={y} y2={y + Math.cos(index) * 36} stroke={color} opacity={0.12} />
                  <circle cx={x(song.year)} cy={y} r={r(song.views)} fill={color} opacity={0.8} className="glow-dot" />
                </g>
              );
            })}
            <text x="70" y="58" className="fill-white text-[26px] font-black">Niconico songs over 5 million views</text>
            <text x="70" y="94" className="fill-slate-400 text-[14px]">Color: engine group / Size: views / Vertical atmosphere: dominant tag group</text>
          </svg>
        </div>
      </div>
    </section>
  );
}

function hash(value: string) {
  return value.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
}
