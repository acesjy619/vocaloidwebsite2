import fs from 'node:fs/promises';

const DATA_PATH = new URL('../src/data/songs.normalized.json', import.meta.url);
const API_BASE = 'https://vocadb.net/api';
const FIELDS = 'MainPicture,PVs,Albums,ThumbUrl';

const albumPreference = new Map([
  ['Single', 0],
  ['EP', 1],
  ['Album', 2],
  ['OriginalAlbum', 2],
  ['SplitAlbum', 3],
  ['Compilation', 4],
  ['Video', 5]
]);

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function imageExtension(mime = '') {
  if (mime.includes('png')) return 'png';
  if (mime.includes('gif')) return 'gif';
  return 'jpg';
}

function bestAlbumCover(songDetail) {
  const albums = (songDetail.albums ?? [])
    .filter((album) => album.id && album.coverPictureMime)
    .sort((a, b) => {
      const aScore = albumPreference.get(a.discType) ?? 9;
      const bScore = albumPreference.get(b.discType) ?? 9;
      if (aScore !== bScore) return aScore - bScore;
      const aYear = a.releaseDate?.year ?? 9999;
      const bYear = b.releaseDate?.year ?? 9999;
      return aYear - bYear;
    });

  const album = albums[0];
  if (!album) return undefined;
  const ext = imageExtension(album.coverPictureMime);
  const version = album.version ? `?v=${album.version}` : '';
  return {
    image: `https://static.vocadb.net/img/Album/mainThumb/${album.id}.${ext}${version}`,
    imageStatus: 'album-cover',
    imageSource: album.name
  };
}

function bestVocaDbThumbnail(songDetail) {
  if (songDetail.mainPicture?.urlOriginal || songDetail.mainPicture?.urlThumb) {
    return {
      image: songDetail.mainPicture.urlOriginal ?? songDetail.mainPicture.urlThumb,
      imageStatus: 'video-thumbnail',
      imageSource: 'VocaDB main picture'
    };
  }

  const pv = (songDetail.pvs ?? []).find((item) => item.thumbUrl && item.pvType === 'Original') ?? (songDetail.pvs ?? []).find((item) => item.thumbUrl);
  if (pv) {
    return {
      image: pv.thumbUrl,
      imageStatus: 'video-thumbnail',
      imageSource: `${pv.service} thumbnail`
    };
  }

  if (songDetail.thumbUrl) {
    return {
      image: songDetail.thumbUrl,
      imageStatus: 'video-thumbnail',
      imageSource: 'VocaDB thumbUrl'
    };
  }

  return undefined;
}

async function fetchSong(id) {
  const response = await fetch(`${API_BASE}/songs/${id}?fields=${encodeURIComponent(FIELDS)}`, {
    headers: {
      Accept: 'application/json',
      'User-Agent': '5-million-synthetic-voices-prototype/0.1'
    }
  });
  if (!response.ok) throw new Error(`VocaDB ${id}: ${response.status}`);
  return response.json();
}

const songs = JSON.parse(await fs.readFile(DATA_PATH, 'utf8'));
let albumCoverCount = 0;
let vocadbThumbCount = 0;
let failedCount = 0;

for (const [index, song] of songs.entries()) {
  try {
    const detail = await fetchSong(song.id);
    const albumCover = bestAlbumCover(detail);
    const fallbackImage = bestVocaDbThumbnail(detail);
    const selected = albumCover ?? fallbackImage;

    if (selected) {
      song.image = selected.image;
      song.visualType = 'image';
      song.imageStatus = selected.imageStatus;
      song.imageSource = selected.imageSource;
      if (selected.imageStatus === 'album-cover') albumCoverCount += 1;
      else vocadbThumbCount += 1;
    } else if (song.thumbnailUrl) {
      song.visualType = 'thumbnail';
      song.imageStatus = 'video-thumbnail';
      song.imageSource = 'derived Niconico thumbnail';
    } else {
      song.visualType = 'generated';
      song.imageStatus = 'generated';
      song.imageSource = 'generated engine tile';
    }

    if ((index + 1) % 20 === 0) {
      console.log(`Enriched ${index + 1}/${songs.length}`);
    }
    await delay(120);
  } catch (error) {
    failedCount += 1;
    song.visualType = song.thumbnailUrl ? 'thumbnail' : 'generated';
    song.imageStatus = song.thumbnailUrl ? 'video-thumbnail' : 'generated';
    song.imageSource = 'fallback after VocaDB error';
    console.warn(error.message);
    await delay(350);
  }
}

await fs.writeFile(DATA_PATH, `${JSON.stringify(songs, null, 2)}\n`);
console.log(`Album covers: ${albumCoverCount}`);
console.log(`VocaDB thumbnails: ${vocadbThumbCount}`);
console.log(`Failed lookups: ${failedCount}`);
