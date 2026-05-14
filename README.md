# 5 Million Synthetic Voices

An interactive information design prototype built from the uploaded VocaDB / Niconico workbook of songs over 5 million Niconico views.

## Run locally

```bash
npm install
npm run dev
```

The Vite server will start at `http://127.0.0.1:5173`.

## Pages

- Main archive: `http://127.0.0.1:5173/`
- Experimental signal map: `http://127.0.0.1:5173/signal-map`

## Dataset

The source workbook used for this prototype is:

`/Users/kobalt/Downloads/vocadb_niconico_over_5million.xlsx`

The normalized archive is saved at:

`src/data/songs.normalized.json`

The JSON preserves every workbook row and uses `includeInDataset` to remove non-vocal-synth songs from the exhibition charts. Ambiguous or excluded rows are marked with `needsReview`.

Visual fields are optional. The normalizer derives `thumbnailUrl` from Niconico IDs when possible and falls back to generated engine-colored nodes through `visualType` and `imageStatus`.

To enrich the normalized data with VocaDB album/single covers and main pictures, run:

```bash
npm run enrich:images
```

## Replace the dataset

1. Put a replacement workbook somewhere on your machine.
2. Make sure it has VocaDB-like columns such as `id`, `name`, `artistString`, `publishDate`, `nico_view`, `nico_url`, and `tags`.
3. Run:

```bash
npm run normalize -- /absolute/path/to/your-workbook.xlsx
```

4. Review `src/data/songs.normalized.json`.
5. Run `npm run dev`.

## Edit classifications

Voice and engine rules live in:

`src/data/engineMapping.ts`

Tag group rules live in:

`src/data/tagGroups.ts`

Color tokens live in:

`src/styles/theme.ts`

These files are intentionally small and editable so the archive can be tuned as new engines, aliases, and Japanese tags appear.
