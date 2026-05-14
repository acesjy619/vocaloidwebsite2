import { classifyEngine } from './classifyEngine';
import { classifyEra } from './classifyEra';
import { classifyTags } from './classifyTags';
import type { Song } from './types';

export type RawSongRow = {
  id: string | number;
  name: string;
  artistString?: string;
  songType?: string;
  publishDate?: string;
  nico_view?: string | number;
  nico_url?: string;
  tags?: string;
};

export function parseVocaDbTags(raw?: string): string[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as Array<{ tag?: { name?: string; additionalNames?: string; categoryName?: string } }>;
    return parsed.flatMap((item) => {
      const tag = item.tag;
      if (!tag) return [];
      return [tag.name, tag.additionalNames, tag.categoryName].filter(Boolean) as string[];
    });
  } catch {
    return raw.split(',').map((tag) => tag.trim()).filter(Boolean);
  }
}

export function deriveThumbnailUrl(url?: string): string | undefined {
  const match = url?.match(/(?:sm|nm)(\d+)/i);
  if (!match) return undefined;
  return `https://tn.smilevideo.jp/smile?i=${match[1]}`;
}

export function normalizeSong(row: RawSongRow): Song {
  const publishDate = row.publishDate ? new Date(row.publishDate) : undefined;
  const year = publishDate && !Number.isNaN(publishDate.getTime()) ? publishDate.getFullYear() : 0;
  const artistString = row.artistString ?? '';
  const producer = artistString.split(/feat\./i)[0]?.trim() || undefined;
  const tags = parseVocaDbTags(row.tags);
  const engineInfo = classifyEngine(artistString);
  const tagGroups = classifyTags(tags);
  const views = Number(row.nico_view ?? 0);
  const thumbnailUrl = deriveThumbnailUrl(row.nico_url);

  return {
    id: String(row.id),
    title: row.name,
    artist: artistString,
    producer,
    year,
    uploadDate: publishDate?.toISOString().slice(0, 10),
    views,
    vocal: engineInfo.vocal,
    engine: engineInfo.engine,
    engineGroup: engineInfo.engineGroup,
    tags: Array.from(new Set(tags)).slice(0, 48),
    tagGroups,
    url: row.nico_url,
    image: undefined,
    thumbnailUrl,
    visualType: thumbnailUrl ? 'thumbnail' : 'generated',
    imageStatus: thumbnailUrl ? 'video-thumbnail' : 'generated',
    era: classifyEra(year),
    includeInDataset: engineInfo.includeInDataset,
    needsReview: engineInfo.needsReview,
    shortDescription: `${row.name} is a ${year || 'undated'} ${engineInfo.engineGroup.join(' / ')} entry with ${views.toLocaleString()} Niconico views.`,
    rawArtistString: artistString,
    songType: row.songType
  };
}
