import { useMemo, useState } from 'react';
import type { Song } from '../utils/types';
import { formatViews } from '../utils/formatViews';
import { theme } from '../styles/theme';

type Props = {
  songs: Song[];
  selectedVoice: string | null;
  onSelectSong: (song: Song) => void;
};

export default function SongExplorer({ songs, selectedVoice, onSelectSong }: Props) {
  const [search, setSearch] = useState('');
  const [engine, setEngine] = useState('All');
  const [era, setEra] = useState('All');
  const [minViews, setMinViews] = useState(5);
  const [yearMax, setYearMax] = useState(2024);
  const engines = ['All', ...Array.from(new Set(songs.flatMap((song) => song.engineGroup)))];
  const eras = ['All', ...Array.from(new Set(songs.map((song) => song.era)))];
  const voices = ['All voices', ...Array.from(new Set(songs.flatMap((song) => song.vocal))).sort()];
  const [voice, setVoice] = useState('All voices');

  const filtered = useMemo(() => {
    const activeVoice = selectedVoice ?? (voice === 'All voices' ? null : voice);
    return songs
      .filter((song) => song.year <= yearMax)
      .filter((song) => song.views >= minViews * 1_000_000)
      .filter((song) => engine === 'All' || song.engineGroup.includes(engine as never))
      .filter((song) => era === 'All' || song.era === era)
      .filter((song) => !activeVoice || song.vocal.includes(activeVoice))
      .filter((song) => {
        const q = search.toLowerCase();
        return !q || [song.title, song.producer, song.artist, song.vocal.join(' ')].join(' ').toLowerCase().includes(q);
      })
      .sort((a, b) => b.views - a.views);
  }, [songs, search, engine, era, minViews, yearMax, voice, selectedVoice]);

  return (
    <section className="py-24">
      <div className="section-shell">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-cyan-200/70">Song explorer</p>
          <h2 className="mt-3 text-4xl font-black text-white md:text-6xl">The archive grid</h2>
        </div>
        <div className="archive-panel rounded-lg p-5">
          <div className="grid gap-3 md:grid-cols-6">
            <input className="chip rounded-lg px-4 py-3 text-sm text-white outline-none md:col-span-2" placeholder="Search title, producer, voice" value={search} onChange={(e) => setSearch(e.target.value)} />
            <Select value={engine} onChange={setEngine} options={engines} />
            <Select value={voice} onChange={setVoice} options={voices} disabled={Boolean(selectedVoice)} />
            <Select value={era} onChange={setEra} options={eras} />
            <label className="chip rounded-lg px-4 py-2 text-xs uppercase tracking-[0.14em] text-slate-400">
              Min views {minViews}M
              <input type="range" min={5} max={18} step={1} value={minViews} onChange={(e) => setMinViews(Number(e.target.value))} className="mt-2 w-full accent-cyan-300" />
            </label>
          </div>
          <label className="mt-3 block text-xs uppercase tracking-[0.14em] text-slate-500">
            Through year {yearMax}
            <input type="range" min={2007} max={2024} value={yearMax} onChange={(e) => setYearMax(Number(e.target.value))} className="mt-2 w-full accent-lime-300" />
          </label>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((song) => (
            <button key={song.id} onClick={() => onSelectSong(song)} className="archive-panel group rounded-lg p-5 text-left transition hover:-translate-y-1 hover:border-cyan-200/45">
              <div className="mb-4 flex items-center justify-between gap-3">
                <span className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">{song.year}</span>
                <span className="rounded-full px-2.5 py-1 text-xs font-bold text-[#05070d]" style={{ background: theme.engineColors[song.engineGroup[0]] }}>
                  {song.engineGroup[0]}
                </span>
              </div>
              <h3 className="line-clamp-2 min-h-14 text-xl font-black text-white group-hover:text-cyan-100">{song.title}</h3>
              <p className="mt-3 text-sm text-slate-400">{song.producer} feat. {song.vocal.join(', ')}</p>
              <p className="mt-4 text-2xl font-black text-white">{formatViews(song.views)}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {song.tagGroups.slice(0, 3).map((group) => (
                  <span key={group} className="chip rounded-full px-2.5 py-1 text-xs text-slate-300">{group}</span>
                ))}
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function Select({ value, onChange, options, disabled }: { value: string; onChange: (value: string) => void; options: string[]; disabled?: boolean }) {
  return (
    <select disabled={disabled} className="chip rounded-lg px-4 py-3 text-sm text-white outline-none disabled:opacity-50" value={value} onChange={(e) => onChange(e.target.value)}>
      {options.map((option) => (
        <option key={option} value={option} className="bg-[#070b14]">
          {option}
        </option>
      ))}
    </select>
  );
}
