type Props = {
  total: number;
  included: number;
  reviewCount: number;
};

const includedItems = ['VOCALOID', 'UTAU', 'Synthesizer V', 'CeVIO / CeVIO AI', 'Other vocal synth engines'];
const excludedItems = ['Human vocal songs', 'Anime songs without vocal synth', 'Touhou songs without vocal synth', 'General meme songs', 'Non-vocal-synth tracks'];

export default function DataCriteria({ total, included, reviewCount }: Props) {
  return (
    <section className="py-24">
      <div className="section-shell">
        <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-cyan-200/70">Archive criteria</p>
            <h2 className="mt-3 text-4xl font-black text-white md:text-6xl">What enters the map</h2>
          </div>
          <p className="max-w-xl text-sm leading-6 text-slate-400">
            The workbook is kept auditable: every source row is normalized, while detected non-vocal-synth rows are excluded from exhibition charts.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-[1.1fr_1.1fr_0.8fr]">
          <ClassPanel title="Included" tone="cyan" items={includedItems} />
          <ClassPanel title="Excluded" tone="orange" items={excludedItems} />
          <div className="archive-panel rounded-lg p-6">
            <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Normalization status</p>
            <div className="mt-6 space-y-5">
              <Status label="Workbook rows" value={total} />
              <Status label="Included songs" value={included} />
              <Status label="Review or excluded rows" value={reviewCount} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ClassPanel({ title, tone, items }: { title: string; tone: 'cyan' | 'orange'; items: string[] }) {
  return (
    <div className="archive-panel rounded-lg p-6">
      <h3 className={`text-2xl font-black ${tone === 'cyan' ? 'text-cyan-200' : 'text-orange-200'}`}>{title}</h3>
      <div className="mt-6 flex flex-wrap gap-3">
        {items.map((item) => (
          <span key={item} className="chip rounded-full px-4 py-2 text-sm text-slate-200">
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

function Status({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <p className="text-4xl font-black text-white">{value}</p>
      <p className="text-sm text-slate-400">{label}</p>
    </div>
  );
}
