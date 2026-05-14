import { tagGroupRules, type TagGroup } from '../data/tagGroups';

export function classifyTags(tags: string[]): TagGroup[] {
  const haystack = tags.join(' | ').toLowerCase();
  const groups = tagGroupRules
    .filter((rule) => rule.keywords.some((keyword) => haystack.includes(keyword.toLowerCase())))
    .map((rule) => rule.group);
  return groups.length ? Array.from(new Set(groups)) : ['Other'];
}
