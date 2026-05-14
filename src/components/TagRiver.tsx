import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { Song } from '../utils/types';
import type { TagGroup } from '../data/tagGroups';

type Props = { songs: Song[] };

const groups: TagGroup[] = ['Character / Idol', 'Rock / Band', 'Electronic / Dance', 'Story / Worldbuilding', 'Dark / Emotional', 'Game / Redistribution', 'Meme / Hyper-Visual', 'Other'];
const colors: Record<TagGroup, string> = {
  'Character / Idol': '#28f0ff',
  'Rock / Band': '#ff477e',
  'Electronic / Dance': '#9c6cff',
  'Story / Worldbuilding': '#6ee7ff',
  'Dark / Emotional': '#ff9d2e',
  'Game / Redistribution': '#caff4a',
  'Meme / Hyper-Visual': '#ffffff',
  Other: '#64748b'
};

export default function TagRiver({ songs }: Props) {
  const data = Array.from({ length: 18 }, (_, index) => 2007 + index).map((year) => {
    const row: Record<string, string | number> = { year };
    groups.forEach((group) => {
      row[group] = songs.filter((song) => song.year === year && song.tagGroups.includes(group)).length;
    });
    return row;
  });

  return (
    <section className="py-24">
      <div className="section-shell">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-pink-200/70">Tag river</p>
          <h2 className="mt-3 text-4xl font-black text-white md:text-6xl">The changing atmosphere of songs</h2>
        </div>
        <div className="archive-panel h-[430px] rounded-lg p-5">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 16, right: 20, bottom: 16, left: 0 }}>
              <defs>
                {groups.map((group) => (
                  <linearGradient key={group} id={`tag-${group.replace(/[^a-z0-9]/gi, '')}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={colors[group]} stopOpacity={0.9} />
                    <stop offset="100%" stopColor={colors[group]} stopOpacity={0.18} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid stroke="rgba(150,190,255,0.1)" vertical={false} />
              <XAxis dataKey="year" stroke="#708199" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} stroke="#708199" tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={{ background: '#070b14', border: '1px solid rgba(180,215,255,0.18)', borderRadius: 8 }} />
              {groups.map((group) => (
                <Area key={group} type="monotone" dataKey={group} stackId="tag" stroke={colors[group]} fill={`url(#tag-${group.replace(/[^a-z0-9]/gi, '')})`} />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}
