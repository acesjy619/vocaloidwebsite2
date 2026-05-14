import { signalModes, type SignalMode } from './visualUtils';

type Props = {
  activeMode: SignalMode;
  onModeChange: (mode: SignalMode) => void;
};

export default function SignalMapMenu({ activeMode, onModeChange }: Props) {
  return (
    <aside className="z-20 flex w-full flex-row items-center gap-3 overflow-x-auto border-b border-white/10 bg-[#05070d]/90 p-4 backdrop-blur-xl lg:h-screen lg:w-52 lg:flex-col lg:items-stretch lg:border-b-0 lg:border-r lg:p-6">
      <a href="/" className="mb-0 mr-2 shrink-0 rounded-full border border-cyan-200/25 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-cyan-100 hover:bg-cyan-200/10 lg:mb-8 lg:mr-0 lg:text-center">
        Back to Main Archive
      </a>
      <div className="hidden lg:block">
        <p className="text-xs uppercase tracking-[0.32em] text-slate-500">Project</p>
        <h1 className="mt-3 text-3xl font-black leading-none text-white">VOCALOID SIGNAL</h1>
      </div>
      <nav className="flex gap-2 lg:mt-8 lg:flex-col">
        {signalModes.map((mode) => (
          <button
            key={mode}
            className={`rounded-lg px-4 py-3 text-left text-sm font-black uppercase tracking-[0.18em] transition ${
              activeMode === mode ? 'bg-cyan-200 text-[#05070d] shadow-[0_0_24px_rgba(40,240,255,0.35)]' : 'text-slate-400 hover:bg-white/10 hover:text-white'
            }`}
            onClick={() => onModeChange(mode)}
          >
            {mode}
          </button>
        ))}
      </nav>
    </aside>
  );
}
