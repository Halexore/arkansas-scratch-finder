import type { ScratchGame } from "./data";

export type SortMode = "remaining" | "name" | "price";

/**
 * Ranking is kept separate from the view so display order is easy to reason about.
 * The default ranking always puts games with no remaining top prizes last.
 */
export function rankGames(games: ScratchGame[], mode: SortMode): ScratchGame[] {
  return [...games].sort((a, b) => {
    if (mode === "remaining") {
      const aHasPrizes = a.remainingTopPrizes > 0;
      const bHasPrizes = b.remainingTopPrizes > 0;
      if (aHasPrizes !== bHasPrizes) return aHasPrizes ? -1 : 1;
      return b.remainingTopPrizes - a.remainingTopPrizes || a.name.localeCompare(b.name);
    }
    if (mode === "name") return a.name.localeCompare(b.name);
    return a.price - b.price || a.name.localeCompare(b.name);
  });
}
