import type { Tender, UserProfile } from "../backend.d";

/** Convert nanosecond timestamp to JS Date */
export function nsToDate(ns: bigint): Date {
  return new Date(Number(ns) / 1_000_000);
}

/** Days remaining from now */
export function daysRemaining(deadline: bigint): number {
  const ms = Number(deadline) / 1_000_000 - Date.now();
  return Math.ceil(ms / (1000 * 60 * 60 * 24));
}

/** Format deadline display */
export function formatDeadline(deadline: bigint): string {
  const date = nsToDate(deadline);
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/** Compute relevance score (0-100) */
export function computeRelevanceScore(
  tender: Tender,
  profile: UserProfile | null | undefined,
): number {
  const seed = Number(tender.id % BigInt(20));
  if (!profile?.industry) {
    return 20 + seed + Math.floor(seed * 1.3);
  }
  const industry = profile.industry.toLowerCase();
  const tags = tender.relevanceTags.map((t) => t.toLowerCase());
  const cat = tender.category.toLowerCase();

  const exactMatch =
    tags.includes(industry) || cat.includes(industry) || industry.includes(cat);
  const partialMatch = tags.some(
    (t) => t.includes(industry.slice(0, 3)) || industry.includes(t.slice(0, 3)),
  );

  if (exactMatch) return Math.min(95, 82 + seed);
  if (partialMatch) return Math.min(78, 50 + seed);
  return Math.min(45, 18 + seed);
}

/** Compute company fit score (0-100) */
export function computeFitScore(
  tender: Tender,
  profile: UserProfile | null | undefined,
): number {
  const seed = Number(tender.id % BigInt(15));
  if (!profile) return 35 + seed;

  const exp = Number(profile.experience);
  let base: number;
  if (exp >= 10) base = 88 + seed;
  else if (exp >= 5) base = 72 + seed;
  else if (exp >= 3) base = 58 + seed;
  else base = 38 + seed;

  return Math.min(99, base);
}

/** Risk color class */
export function riskColor(level: string): string {
  switch (level.toUpperCase()) {
    case "HIGH":
      return "text-destructive";
    case "MEDIUM":
      return "text-warning-foreground";
    case "LOW":
      return "text-success";
    default:
      return "text-muted-foreground";
  }
}

/** Risk bg class */
export function riskBgClass(level: string): string {
  switch (level.toUpperCase()) {
    case "HIGH":
      return "bg-destructive/10 text-destructive border-destructive/20";
    case "MEDIUM":
      return "bg-amber-100 text-amber-800 border-amber-200";
    case "LOW":
      return "bg-emerald-100 text-emerald-800 border-emerald-200";
    default:
      return "bg-muted text-muted-foreground border-border";
  }
}

/** Score color */
export function scoreColor(score: number): string {
  if (score >= 80) return "text-emerald-700";
  if (score >= 60) return "text-amber-700";
  return "text-muted-foreground";
}

/** Score bar color */
export function scoreBarColor(score: number): string {
  if (score >= 80) return "bg-emerald-500";
  if (score >= 60) return "bg-amber-500";
  return "bg-muted-foreground";
}
