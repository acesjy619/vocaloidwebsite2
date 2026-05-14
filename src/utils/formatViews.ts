export function formatViews(views: number): string {
  if (views >= 10_000_000) return `${(views / 1_000_000).toFixed(1)}M`;
  return `${(views / 1_000_000).toFixed(2)}M`;
}
