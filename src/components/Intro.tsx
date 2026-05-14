import { useMemo } from 'react';
import type { Song } from '../utils/types';
import { formatViews } from '../utils/formatViews';

type Props = { songs: Song[] };

export default function Intro({ songs }: Props) {
  const dots = useMemo(
    () =>
      songs.slice(0, 80).map((song, index) => ({
        song,
        left: 7 + ((song.year - 2007) / 17) * 84 + Math.sin(index * 1.7) * 1.5,
        top: 18 + ((index * 37) % 58),
        delay: `${(index % 18) * 0.12}s`
      })),
    [songs]
  );
  const totalViews = songs.reduce((sum, song) => sum + song.views, 0);

  return (
    <section className="grid-field relative min-h-screen overflow-hidden pt-16">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent,rgba(5,7,13,0.82)_70%)]" />
      <div className="section-shell relative z-10 flex min-h-[calc(100vh-4rem)] flex-col justify-between pb-14">
        <nav className="flex items-center justify-between text-xs uppercase tracking-[0.28em] text-cyan-100/70">
          <span>Niconico / VocaDB Archive</span>
          <span>{songs.length} included tracks</span>
        </nav>
        <div className="max-w-5xl">
          <p className="mb-6 text-sm font-semibold uppercase tracking-[0.34em] text-lime-200/80">Interactive information design prototype</p>
          <h1 className="max-w-4xl text-6xl font-black leading-[0.92] tracking-normal text-white md:text-8xl">
            5 Million Synthetic Voices
          </h1>
          <p className="mt-7 max-w-3xl text-xl leading-8 text-slate-300 md:text-2xl">
            A visual archive of vocal synth songs that crossed 5 million views on Niconico.
          </p>
          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-400">
            From Hatsune Miku to KAFU and Kasane Teto SV, this project traces how synthesized voices became one of the defining sounds of internet music.
          </p>
          <a
            href="/signal-map"
            className="mt-8 inline-flex rounded-full border border-cyan-200/40 bg-cyan-200/10 px-6 py-3 text-sm font-black uppercase tracking-[0.18em] text-cyan-100 shadow-[0_0_28px_rgba(40,240,255,0.16)] transition hover:bg-cyan-200 hover:text-[#05070d]"
          >
            Open Signal Map
          </a>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <Metric label="Archive span" value="2007-2024" />
          <Metric label="Included Niconico views" value={formatViews(totalViews)} />
          <Metric label="Engine ecology" value="VOCALOID + UTAU + CeVIO + SV" />
        </div>
      </div>
      <div className="pointer-events-none absolute inset-x-0 top-[18vh] h-[48vh]">
        <div className="absolute left-[7%] right-[7%] top-1/2 h-px bg-cyan-100/20" />
        {dots.map(({ song, left, top, delay }) => (
          <span
            key={song.id}
            className="glow-dot absolute h-2 w-2 animate-pulse rounded-full bg-cyan-200 text-cyan-200"
            style={{ left: `${left}%`, top: `${top}%`, animationDelay: delay, opacity: 0.25 + Math.min(song.views / 20_000_000, 0.55) }}
          />
        ))}
      </div>
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="archive-panel rounded-lg p-5">
      <p className="text-xs uppercase tracking-[0.22em] text-slate-500">{label}</p>
      <p className="mt-2 text-lg font-bold text-white">{value}</p>
    </div>
  );
}
