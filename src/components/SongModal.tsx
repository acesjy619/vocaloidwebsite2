import { X } from 'lucide-react';
import type { Song } from '../utils/types';
import { formatViews } from '../utils/formatViews';
import { theme } from '../styles/theme';

type Props = {
  song: Song | null;
  onClose: () => void;
};

export default function SongModal({ song, onClose }: Props) {
  if (!song) return null;
  const color = theme.engineColors[song.engineGroup[0]];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-md" onClick={onClose}>
      <article className="archive-panel max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-lg p-6 md:p-8" onClick={(event) => event.stopPropagation()}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.22em]" style={{ color }}>{song.year} / {formatViews(song.views)}</p>
            <h2 className="mt-3 text-3xl font-black text-white md:text-5xl">{song.title}</h2>
          </div>
          <button className="chip rounded-full p-2 text-slate-300 hover:text-white" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>
        <div className="mt-7 grid gap-4 md:grid-cols-2">
          <Info label="Producer" value={song.producer ?? 'Unknown'} />
          <Info label="Voice" value={song.vocal.join(', ')} />
          <Info label="Engine" value={song.engine.join(', ')} />
          <Info label="Engine group" value={song.engineGroup.join(', ')} />
          <Info label="Era" value={song.era} />
          <Info label="Status" value={song.needsReview ? 'Needs Review' : 'Included'} />
        </div>
        <p className="mt-7 rounded-lg border border-white/10 bg-white/[0.04] p-4 text-sm leading-7 text-slate-300">
          {song.shortDescription} Its tag pattern places it near {song.tagGroups.join(', ')}, making it part of the archive’s broader reading of vocal synth culture.
        </p>
        <div className="mt-6">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Tag groups</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {song.tagGroups.map((tag) => (
              <span key={tag} className="chip rounded-full px-3 py-1.5 text-xs text-slate-200">{tag}</span>
            ))}
          </div>
        </div>
        <div className="mt-6">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Raw tags</p>
          <p className="mt-3 max-h-28 overflow-y-auto text-xs leading-5 text-slate-500">{song.tags.join(' · ')}</p>
        </div>
        {song.url && (
          <a className="mt-7 inline-flex rounded-full border border-cyan-200/30 px-5 py-2 text-sm font-bold text-cyan-100 hover:bg-cyan-200/10" href={song.url} target="_blank" rel="noreferrer">
            Open Niconico source
          </a>
        )}
      </article>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.035] p-4">
      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{label}</p>
      <p className="mt-2 text-sm font-bold text-slate-100">{value}</p>
    </div>
  );
}
