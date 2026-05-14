import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { Song } from '../utils/types';
import { theme } from '../styles/theme';
import type { EngineGroup } from '../data/engineMapping';

type Props = { songs: Song[] };

const groups: EngineGroup[] = ['VOCALOID', 'UTAU', 'CeVIO / CeVIO AI', 'Synthesizer V', 'Mixed / Other', 'Needs Review'];

export default function EngineEvolution({ songs }: Props) {
  const data = Array.from({ length: 18 }, (_, index) => 2007 + index).map((year) => {
    const row: Record<string, string | number> = { year };
    groups.forEach((group) => {
      row[group] = songs.filter((song) => song.year === year && song.engineGroup.includes(group)).length;
    });
    return row;
  });

  return (
    <section className="py-24">
      <div className="section-shell">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-lime-200/70">Engine evolution</p>
          <h2 className="mt-3 text-4xl font-black text-white md:text-6xl">From single icon to ecosystem</h2>
        </div>
        <div className="archive-panel h-[420px] rounded-lg p-5">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 16, right: 20, bottom: 16, left: 0 }}>
              <CartesianGrid stroke="rgba(150,190,255,0.1)" vertical={false} />
              <XAxis dataKey="year" stroke="#708199" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} stroke="#708199" tick={{ fontSize: 12 }} />
              <Tooltip
                cursor={{ fill: 'rgba(255,255,255,0.04)' }}
                contentStyle={{ background: '#070b14', border: '1px solid rgba(180,215,255,0.18)', borderRadius: 8 }}
              />
              {groups.map((group) => (
                <Bar key={group} dataKey={group} stackId="engine" fill={theme.engineColors[group]} radius={[2, 2, 0, 0]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-5 flex flex-wrap gap-3">
          {groups.map((group) => (
            <span key={group} className="chip rounded-full px-3 py-1.5 text-xs text-slate-300">
              <span className="mr-2 inline-block h-2 w-2 rounded-full" style={{ background: theme.engineColors[group] }} />
              {group}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
