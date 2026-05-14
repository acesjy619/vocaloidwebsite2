import { useState } from 'react';
import type { Song } from '../../utils/types';
import { formatViews } from '../../utils/formatViews';
import { engineColor, gradientForSong } from './visualUtils';

type Props = {
  song: Song;
  x: number;
  y: number;
  size: number;
  selected: boolean;
  onSelect: (song: Song) => void;
  onHover: (song: Song | null, point?: { x: number; y: number }) => void;
};

export default function SongNode({ song, x, y, size, selected, onSelect, onHover }: Props) {
  const [imageFailed, setImageFailed] = useState(false);
  const imageUrl = song.image || song.thumbnailUrl;
  const showImage = Boolean(imageUrl) && !imageFailed;
  const color = engineColor(song);
  const hitSize = Math.max(size + 14, 36);

  return (
    <button
      className="signal-node absolute rounded-full transition-[transform,width,height,opacity] duration-700 ease-[cubic-bezier(.19,1,.22,1)]"
      style={{
        width: hitSize,
        height: hitSize,
        transform: `translate(${x - hitSize / 2}px, ${y - hitSize / 2}px)`,
        background: 'transparent',
        opacity: selected ? 1 : 0.88
      }}
      aria-label={song.title}
      onClick={() => onSelect(song)}
      onMouseEnter={(event) => onHover(song, { x: event.clientX, y: event.clientY })}
      onMouseLeave={() => onHover(null)}
    >
      <span
        className="pointer-events-none absolute left-1/2 top-1/2 overflow-hidden rounded-full border"
        style={{
          width: size,
          height: size,
          transform: 'translate(-50%, -50%)',
          borderColor: selected ? '#ffffff' : `${color}aa`,
          boxShadow: selected ? `0 0 0 2px #fff, 0 0 34px ${color}` : `0 0 18px ${color}88`,
          background: showImage ? '#05070d' : gradientForSong(song)
        }}
      >
        {showImage && (
          <img
            src={imageUrl}
            alt=""
            className="h-full w-full rounded-full object-cover opacity-90"
            loading="lazy"
            onError={() => setImageFailed(true)}
          />
        )}
        {!showImage && <span className="absolute inset-[28%] rounded-full bg-white/60 blur-[2px]" />}
      </span>
      <span className="sr-only">{song.title} {song.year} {formatViews(song.views)}</span>
    </button>
  );
}
