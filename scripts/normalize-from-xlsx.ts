import fs from 'node:fs';
import path from 'node:path';
import XLSX from 'xlsx';
import { normalizeSong, type RawSongRow } from '../src/utils/normalizeSongs';

const inputPath = process.argv[2] ?? '/Users/kobalt/Downloads/vocadb_niconico_over_5million.xlsx';
const outputPath = path.resolve('src/data/songs.normalized.json');

const workbook = XLSX.readFile(inputPath, { cellDates: false });
const sheetName = workbook.SheetNames[0];
const rows = XLSX.utils.sheet_to_json<RawSongRow>(workbook.Sheets[sheetName], { raw: false });
const normalized = rows.map(normalizeSong).sort((a, b) => a.year - b.year || b.views - a.views);

fs.writeFileSync(outputPath, JSON.stringify(normalized, null, 2));
console.log(`Normalized ${normalized.length} rows into ${outputPath}`);
console.log(`${normalized.filter((song) => song.includeInDataset).length} rows included in the vocal synth archive`);
