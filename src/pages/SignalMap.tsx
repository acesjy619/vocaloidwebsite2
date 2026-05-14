import { useMemo, useState } from 'react';
import songsJson from '../data/songs.normalized.json';
import SignalMapCanvas from '../components/signal-map/SignalMapCanvas';
import SignalMapMenu from '../components/signal-map/SignalMapMenu';
import SongDetailPanel from '../components/signal-map/SongDetailPanel';
import type { SignalMode } from '../components/signal-map/visualUtils';
import type { Song } from '../utils/types';

export default function SignalMap() {
  const [mode, setMode] = useState<SignalMode>('HOME');
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const songs = useMemo(() => (songsJson as Song[]).filter((song) => song.includeInDataset), []);

  return (
    <main className="min-h-screen bg-[#05070d] text-slate-100 lg:flex">
      <SignalMapMenu activeMode={mode} onModeChange={setMode} />
      <SignalMapCanvas songs={songs} mode={mode} selectedSong={selectedSong} onSelectSong={setSelectedSong} />
      <SongDetailPanel song={selectedSong} onClose={() => setSelectedSong(null)} />
    </main>
  );
}
