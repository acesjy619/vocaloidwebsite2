import json
import re
from pathlib import Path

import pandas as pd

INPUT = Path("/Users/kobalt/Downloads/vocadb_niconico_over_5million.xlsx")
OUTPUT = Path("src/data/songs.normalized.json")

ENGINE_RULES = [
    (["Hatsune Miku", "初音ミク", "Miku"], "Hatsune Miku", "VOCALOID", "VOCALOID"),
    (["Kagamine Rin", "鏡音リン"], "Kagamine Rin", "VOCALOID", "VOCALOID"),
    (["Kagamine Len", "鏡音レン"], "Kagamine Len", "VOCALOID", "VOCALOID"),
    (["Megurine Luka", "巡音ルカ"], "Megurine Luka", "VOCALOID", "VOCALOID"),
    (["GUMI", "Megpoid"], "GUMI", "VOCALOID", "VOCALOID"),
    (["IA"], "IA", "VOCALOID", "VOCALOID"),
    (["flower", "v flower", "v4 flower"], "flower", "VOCALOID", "VOCALOID"),
    (["KAITO"], "KAITO", "VOCALOID", "VOCALOID"),
    (["MEIKO"], "MEIKO", "VOCALOID", "VOCALOID"),
    (["MAYU"], "MAYU", "VOCALOID", "VOCALOID"),
    (["Otomachi Una", "音街ウナ"], "Otomachi Una", "VOCALOID", "VOCALOID"),
    (["Yuki", "歌愛ユキ"], "Kaai Yuki", "VOCALOID", "VOCALOID"),
    (["Yuzuki Yukari", "結月ゆかり"], "Yuzuki Yukari", "VOCALOID", "VOCALOID"),
    (["Meika Mikoto", "鳴花ミコト"], "Meika Mikoto", "VOCALOID", "VOCALOID"),
    (["Kasane Teto SV", "重音テトSV"], "Kasane Teto SV", "Synthesizer V", "Synthesizer V"),
    (["Kasane Teto", "重音テト"], "Kasane Teto", "UTAU", "UTAU"),
    (["KAFU", "可不"], "KAFU", "CeVIO AI", "CeVIO / CeVIO AI"),
]

TAG_RULES = [
    ("Character / Idol", ["cute", "idol", "character song", "image song", "meta", "meme", "mascot", "初音ミク", "ミク", "kawaii", "可愛い"]),
    ("Rock / Band", ["rock", "j-rock", "alternative rock", "pop rock", "vocaloud", "guitar", "band", "ロック", "ギター"]),
    ("Electronic / Dance", ["electropop", "techno", "dance-pop", "digital rock", "chiptune", "edm", "happy hardcore", "denpa", "electro", "テクノ"]),
    ("Story / Worldbuilding", ["story", "series", "tragedy", "narrative", "worldbuilding", "kagerou project", "カゲロウプロジェクト", "light novel"]),
    ("Dark / Emotional", ["sad", "dark", "lonely", "intense", "unstable", "fast tempo", "fast singing", "emotional", "heartbreak", "切ない", "ダーク"]),
    ("Game / Redistribution", ["project diva", "project sekai", "プロセカ", "maimai", "chunithm", "groove coaster", "rhythm game", "オンゲキ", "sound voltex", "taiko"]),
    ("Meme / Hyper-Visual", ["meme", "viral", "chaotic", "hypervisual", "short hook", "internet", "parody", "2d animated pv", "fhd pv", "ネタ"]),
]


def era(year: int) -> str:
    if 2007 <= year <= 2009:
        return "The Voice Appears"
    if 2010 <= year <= 2013:
        return "The Voice Becomes a Genre"
    if 2014 <= year <= 2017:
        return "The Voice Reflects and Spreads"
    if 2018 <= year <= 2021:
        return "The Voice Goes Viral"
    if 2022 <= year <= 2024:
        return "The Voice Mutates"
    return "Outside Era Range"


def parse_tags(raw: str) -> list[str]:
    if not isinstance(raw, str) or not raw:
        return []
    try:
        parsed = json.loads(raw)
    except json.JSONDecodeError:
        return [x.strip() for x in raw.split(",") if x.strip()]
    tags = []
    for item in parsed:
        tag = item.get("tag", {})
        for key in ("name", "additionalNames", "categoryName"):
            value = tag.get(key)
            if value:
                tags.append(str(value))
    return list(dict.fromkeys(tags))


def classify_engine(artist: str):
    source = re.split(r"feat\.", artist, flags=re.I)
    source = source[1] if len(source) > 1 else artist
    matches = []
    for labels, voice, engine, group in ENGINE_RULES:
        if any(label.lower() in source.lower() for label in labels):
            matches.append((voice, engine, group))
    vocal = list(dict.fromkeys([m[0] for m in matches])) or ["Unclassified"]
    engines = list(dict.fromkeys([m[1] for m in matches])) or ["Unknown or multiple engines"]
    groups = list(dict.fromkeys([m[2] for m in matches]))
    include = len(matches) > 0
    if include and len(groups) > 1:
        groups = ["Mixed / Other"]
    if not include:
        groups = ["Needs Review"]
    review = (not include) or ("various" in source.lower()) or ("unspecified" in source.lower())
    return vocal, engines, groups, include, review


def classify_tags(tags: list[str]) -> list[str]:
    haystack = " | ".join(tags).lower()
    groups = [group for group, keywords in TAG_RULES if any(k.lower() in haystack for k in keywords)]
    return list(dict.fromkeys(groups)) or ["Other"]


def derive_thumbnail_url(url: str | None):
    if not isinstance(url, str):
        return None
    match = re.search(r"(?:sm|nm)(\d+)", url, flags=re.I)
    if not match:
        return None
    return f"https://tn.smilevideo.jp/smile?i={match.group(1)}"


df = pd.read_excel(INPUT)
records = []
for row in df.to_dict(orient="records"):
    artist = "" if pd.isna(row.get("artistString")) else str(row.get("artistString"))
    date = pd.to_datetime(row.get("publishDate"), errors="coerce")
    year = int(date.year) if not pd.isna(date) else 0
    views = int(row.get("nico_view") or 0)
    tags = parse_tags(row.get("tags"))
    vocal, engines, groups, include, review = classify_engine(artist)
    title = str(row.get("name"))
    thumbnail_url = derive_thumbnail_url(row.get("nico_url"))
    records.append(
        {
            "id": str(row.get("id")),
            "title": title,
            "artist": artist,
            "producer": re.split(r"feat\.", artist, flags=re.I)[0].strip() or None,
            "year": year,
            "uploadDate": date.strftime("%Y-%m-%d") if not pd.isna(date) else None,
            "views": views,
            "vocal": vocal,
            "engine": engines,
            "engineGroup": groups,
            "tags": tags[:48],
            "tagGroups": classify_tags(tags),
            "url": row.get("nico_url"),
            "image": None,
            "thumbnailUrl": thumbnail_url,
            "visualType": "thumbnail" if thumbnail_url else "generated",
            "imageStatus": "video-thumbnail" if thumbnail_url else "generated",
            "era": era(year),
            "includeInDataset": include,
            "needsReview": review,
            "shortDescription": f"{title} is a {year or 'undated'} {' / '.join(groups)} entry with {views:,} Niconico views.",
            "rawArtistString": artist,
            "songType": row.get("songType"),
        }
    )

records.sort(key=lambda r: (r["year"], -r["views"]))
OUTPUT.write_text(json.dumps(records, ensure_ascii=False, indent=2), encoding="utf-8")
print(f"Normalized {len(records)} rows; included {sum(r['includeInDataset'] for r in records)} rows")
