import { eras } from '../utils/classifyEra';
import type { Song } from '../utils/types';
import { formatViews } from '../utils/formatViews';
import { theme } from '../styles/theme';

type Props = {
  songs: Song[];
  onSelectSong: (song: Song) => void;
};

export default function EraChapters({ songs, onSelectSong }: Props) {
  return (
    <section className="py-20">
      <div className="section-shell space-y-8">
        {eras.map((era, index) => {
          const eraSongs = songs
            .filter((song) => song.year >= era.start && song.year <= era.end)
            .sort((a, b) => b.views - a.views)
            .slice(0, 6);
          return (
            <article key={era.id} className="archive-panel grid gap-8 rounded-lg p-6 md:grid-cols-[0.8fr_1.2fr] md:p-8">
              <div>
                <p className="text-7xl font-black leading-none text-white/10 md:text-8xl">{era.range}</p>
                <p className="mt-5 text-sm uppercase tracking-[0.28em] text-cyan-200/70">Chapter {index + 1}</p>
                <h2 className="mt-3 text-3xl font-black text-white md:text-5xl">{era.title}</h2>
                <p className="mt-5 text-sm leading-6 text-slate-400">{era.description}</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {eraSongs.map((song) => (
                  <button
                    key={song.id}
                    className="group rounded-lg border border-white/10 bg-white/[0.035] p-4 text-left transition hover:border-cyan-200/40 hover:bg-white/[0.07]"
                    onClick={() => onSelectSong(song)}
                  >
                    <div className="mb-3 h-1 rounded-full" style={{ background: theme.engineColors[song.engineGroup[0]] }} />
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{song.year} · {formatViews(song.views)}</p>
                    <h3 className="mt-2 line-clamp-2 min-h-12 text-base font-black text-white group-hover:text-cyan-100">{song.title}</h3>
                    <p className="mt-2 line-clamp-1 text-xs text-slate-400">{song.vocal.join(', ')}</p>
                  </button>
                ))}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
