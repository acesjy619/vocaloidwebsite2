import { useMemo, useState } from 'react';
import songsJson from './data/songs.normalized.json';
import Intro from './components/Intro';
import DataCriteria from './components/DataCriteria';
import MainTimeline from './components/MainTimeline';
import EraChapters from './components/EraChapters';
import EngineEvolution from './components/EngineEvolution';
import VoiceConstellation from './components/VoiceConstellation';
import TagRiver from './components/TagRiver';
import SongExplorer from './components/SongExplorer';
import SongModal from './components/SongModal';
import FinalMap from './components/FinalMap';
import SignalMap from './pages/SignalMap';
import type { Song } from './utils/types';

export default function App() {
  if (window.location.pathname === '/signal-map') {
    return <SignalMap />;
  }

  return <MainArchive />;
}

function MainArchive() {
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [voiceFilter, setVoiceFilter] = useState<string | null>(null);
  const allSongs = songsJson as Song[];
  const songs = useMemo(() => allSongs.filter((song) => song.includeInDataset), [allSongs]);
  const reviewCount = allSongs.filter((song) => !song.includeInDataset || song.needsReview).length;

  return (
    <main className="min-h-screen overflow-hidden bg-[#05070d] text-slate-100">
      <Intro songs={songs} />
      <DataCriteria total={allSongs.length} included={songs.length} reviewCount={reviewCount} />
      <MainTimeline songs={songs} onSelectSong={setSelectedSong} />
      <EraChapters songs={songs} onSelectSong={setSelectedSong} />
      <EngineEvolution songs={songs} />
      <VoiceConstellation
        songs={songs}
        selectedVoice={voiceFilter}
        onSelectVoice={setVoiceFilter}
        onSelectSong={setSelectedSong}
      />
      <TagRiver songs={songs} />
      <SongExplorer songs={songs} selectedVoice={voiceFilter} onSelectSong={setSelectedSong} />
      <FinalMap songs={songs} onSelectSong={setSelectedSong} />
      <SongModal song={selectedSong} onClose={() => setSelectedSong(null)} />
    </main>
  );
}
