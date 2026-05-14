import { engineMapping, type EngineGroup } from '../data/engineMapping';

export type EngineClassification = {
  vocal: string[];
  engine: string[];
  engineGroup: EngineGroup[];
  includeInDataset: boolean;
  needsReview: boolean;
};

export function classifyEngine(artistString = ''): EngineClassification {
  const source = artistString.split(/feat\./i)[1] ?? artistString;
  const matches = engineMapping.filter((entry) =>
    entry.labels.some((label) => source.toLowerCase().includes(label.toLowerCase()))
  );
  const vocal = Array.from(new Set(matches.map((match) => match.canonicalVoice)));
  const engine = Array.from(new Set(matches.map((match) => match.engine)));
  let engineGroup = Array.from(new Set(matches.map((match) => match.engineGroup))) as EngineGroup[];
  const includeInDataset = vocal.length > 0;
  const needsReview = !includeInDataset || source.toLowerCase().includes('various') || source.toLowerCase().includes('unspecified');

  if (includeInDataset && engineGroup.length > 1) {
    engineGroup = ['Mixed / Other'];
  }

  return {
    vocal: vocal.length ? vocal : ['Unclassified'],
    engine: engine.length ? engine : ['Unknown or multiple engines'],
    engineGroup: includeInDataset ? engineGroup : ['Needs Review'],
    includeInDataset,
    needsReview
  };
}
