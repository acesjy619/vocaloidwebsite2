import { X } from 'lucide-react';
import type { Song } from '../../utils/types';
import { formatViews } from '../../utils/formatViews';
import { engineColor, gradientForSong } from './visualUtils';

type Props = {
  song: Song | null;
  onClose: () => void;
};

export default function SongDetailPanel({ song, onClose }: Props) {
  return (
    <aside className={`z-20 border-l border-white/10 bg-[#070b14]/94 backdrop-blur-xl transition-transform duration-500 lg:w-96 ${song ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}`}>
      {song ? (
        <div className="h-full overflow-y-auto p-6">
          <div className="flex items-start justify-between gap-4">
            <p className="text-xs font-black uppercase tracking-[0.22em]" style={{ color: engineColor(song) }}>
              {song.year} · {formatViews(song.views)}
            </p>
            <button className="rounded-full border border-white/15 p-2 text-slate-300 hover:text-white" onClick={onClose} aria-label="Close song detail">
              <X size={18} />
            </button>
          </div>
          <div className="mt-5 aspect-square w-full overflow-hidden rounded-lg border border-white/10" style={{ background: gradientForSong(song) }}>
            {(song.image || song.thumbnailUrl) && <img src={song.image || song.thumbnailUrl} alt="" className="h-full w-full object-cover" onError={(event) => ((event.currentTarget.style.display = 'none'))} />}
          </div>
          <h2 className="mt-6 text-3xl font-black leading-tight text-white">{song.title}</h2>
          <p className="mt-3 text-sm leading-6 text-slate-400">{song.shortDescription}</p>
          <div className="mt-6 space-y-4">
            <Info label="Producer" value={song.producer ?? 'Unknown'} />
            <Info label="Voice" value={song.vocal.join(', ')} />
            <Info label="Engine" value={song.engine.join(', ')} />
            <Info label="Tag groups" value={song.tagGroups.join(', ')} />
            <Info label="Visual source" value={song.imageStatus ?? 'generated'} />
          </div>
          <div className="mt-6">
            <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Tags</p>
            <p className="mt-2 max-h-28 overflow-y-auto text-xs leading-5 text-slate-500">{song.tags.join(' · ')}</p>
          </div>
          {song.url && (
            <a href={song.url} target="_blank" rel="noreferrer" className="mt-6 inline-flex rounded-full border border-cyan-200/30 px-5 py-2 text-sm font-bold text-cyan-100 hover:bg-cyan-200/10">
              Open source URL
            </a>
          )}
        </div>
      ) : (
        <div className="hidden h-full p-6 lg:block">
          <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Detail Panel</p>
          <h2 className="mt-4 text-3xl font-black text-white">Select a signal</h2>
          <p className="mt-4 text-sm leading-6 text-slate-400">Click any node to inspect its archival music card, source URL, tags, and visual status.</p>
        </div>
      )}
    </aside>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{label}</p>
      <p className="mt-2 text-sm font-bold text-slate-100">{value}</p>
    </div>
  );
}
