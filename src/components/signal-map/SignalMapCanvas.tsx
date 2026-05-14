import { useMemo, useRef, useState } from 'react';
import type { Song } from '../../utils/types';
import { formatViews } from '../../utils/formatViews';
import { useElementSize } from './useElementSize';
import { buildSignalLayout } from './layouts';
import SongNode from './SongNode';
import type { SignalMode } from './visualUtils';
import { engineColor } from './visualUtils';

type Props = {
  songs: Song[];
  mode: SignalMode;
  selectedSong: Song | null;
  onSelectSong: (song: Song) => void;
};

type HoverState = {
  song: Song;
  x: number;
  y: number;
} | null;

export default function SignalMapCanvas({ songs, mode, selectedSong, onSelectSong }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const hoverTimerRef = useRef<number | null>(null);
  const size = useElementSize(containerRef);
  const [hovered, setHovered] = useState<HoverState>(null);
  const layout = useMemo(() => buildSignalLayout({ songs, mode, width: size.width, height: size.height }), [songs, mode, size.width, size.height]);

  const updateHover = (song: Song | null, point?: { x: number; y: number }) => {
    if (hoverTimerRef.current) {
      window.clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }

    if (song && point) {
      setHovered({ song, x: point.x, y: point.y });
      return;
    }

    hoverTimerRef.current = window.setTimeout(() => {
      setHovered(null);
      hoverTimerRef.current = null;
    }, 120);
  };

  return (
    <section ref={containerRef} className="signal-map-field grid-field relative min-h-[720px] flex-1 overflow-hidden bg-[#05070d]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(40,240,255,0.10),transparent_34rem),radial-gradient(circle_at_72%_30%,rgba(156,108,255,0.12),transparent_28rem)]" />
      <div className="pointer-events-none absolute left-8 top-8 z-10">
        <p className="text-xs uppercase tracking-[0.32em] text-cyan-100/70">Experimental archive layout</p>
        <h2 className="mt-3 text-5xl font-black text-white">{mode}</h2>
      </div>
      <svg className="pointer-events-none absolute inset-0 h-full w-full">
        {layout.guides.map((guide) => (
          <g key={`${guide.label}-${guide.x}-${guide.y}`} transform={`translate(${guide.x} ${guide.y})`}>
            <text
              textAnchor={guide.align === 'left' ? 'start' : guide.align === 'right' ? 'end' : 'middle'}
              className="fill-white/10 text-[42px] font-black uppercase"
              style={{ whiteSpace: 'pre-line' }}
            >
              {guide.label.split('\n').map((line, index) => (
                <tspan key={line} x={0} dy={index === 0 ? 0 : 38}>
                  {line}
                </tspan>
              ))}
            </text>
          </g>
        ))}
      </svg>
      <div className="absolute inset-0">
        {songs.map((song) => {
          const node = layout.nodes[song.id];
          if (!node) return null;
          return (
            <SongNode
              key={song.id}
              song={song}
              x={node.x}
              y={node.y}
              size={node.size}
              selected={selectedSong?.id === song.id}
              onSelect={onSelectSong}
              onHover={updateHover}
            />
          );
        })}
      </div>
      <EngineLegend songs={songs} />
      {hovered && (
        <div
          className="pointer-events-none fixed z-50 max-w-xs rounded-lg border border-cyan-200/20 bg-[#070b14]/95 p-4 shadow-2xl"
          style={{ left: Math.min(hovered.x + 18, window.innerWidth - 300), top: Math.max(18, hovered.y - 20) }}
        >
          <p className="text-xs uppercase tracking-[0.18em]" style={{ color: engineColor(hovered.song) }}>
            {hovered.song.year} · {formatViews(hovered.song.views)}
          </p>
          <h3 className="mt-2 text-base font-black text-white">{hovered.song.title}</h3>
          <p className="mt-2 text-xs text-slate-400">{hovered.song.vocal.join(', ')}</p>
          <p className="mt-1 text-xs text-slate-500">{hovered.song.engineGroup.join(', ')}</p>
        </div>
      )}
    </section>
  );
}

function EngineLegend({ songs }: { songs: Song[] }) {
  const groups = Array.from(new Set(songs.flatMap((song) => song.engineGroup)));
  return (
    <div className="absolute bottom-5 left-6 z-10 flex flex-wrap gap-2">
      {groups.map((group) => (
        <span key={group} className="rounded-full border border-white/10 bg-black/30 px-3 py-1.5 text-xs text-slate-300 backdrop-blur">
          <span className="mr-2 inline-block h-2 w-2 rounded-full" style={{ background: engineColor(songs.find((song) => song.engineGroup.includes(group)) ?? songs[0]) }} />
          {group}
        </span>
      ))}
    </div>
  );
}
