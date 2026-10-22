export type ScratchGame = {
  id: string;
  name: string;
  price: number;
  slot: number;
  remainingTopPrizes: number;
  totalTopPrizes: number;
  odds: string;
  playStyle: string;
  accent: string;
  mark: string;
};

// Entirely invented sample records. They are not affiliated with the Arkansas Lottery.
export const sampleGames: ScratchGame[] = [
  {
    id: "ozark-gold",
    name: "Ozark Gold Rush",
    price: 10,
    slot: 4,
    remainingTopPrizes: 7,
    totalTopPrizes: 12,
    odds: "1 in 3.42",
    playStyle: "Match 3",
    accent: "ochre",
    mark: "OG"
  },
  {
    id: "river-run",
    name: "River Run Riches",
    price: 5,
    slot: 12,
    remainingTopPrizes: 11,
    totalTopPrizes: 20,
    odds: "1 in 4.18",
    playStyle: "Reveal & match",
    accent: "blue",
    mark: "RR"
  },
  {
    id: "diamond-draw",
    name: "Diamond Draw",
    price: 20,
    slot: 7,
    remainingTopPrizes: 2,
    totalTopPrizes: 8,
    odds: "1 in 3.05",
    playStyle: "Number match",
    accent: "plum",
    mark: "DD"
  },
  {
    id: "lucky-lantern",
    name: "Lucky Lanterns",
    price: 2,
    slot: 18,
    remainingTopPrizes: 0,
    totalTopPrizes: 15,
    odds: "1 in 4.71",
    playStyle: "Symbol match",
    accent: "coral",
    mark: "LL"
  },
  {
    id: "big-pine",
    name: "Big Pine Payday",
    price: 10,
    slot: 2,
    remainingTopPrizes: 4,
    totalTopPrizes: 10,
    odds: "1 in 3.76",
    playStyle: "Match 3",
    accent: "pine",
    mark: "BP"
  },
  {
    id: "moonlit-mill",
    name: "Moonlit Millions",
    price: 30,
    slot: 21,
    remainingTopPrizes: 1,
    totalTopPrizes: 6,
    odds: "1 in 2.94",
    playStyle: "Reveal & match",
    accent: "midnight",
    mark: "MM"
  },
  {
    id: "wildflower",
    name: "Wildflower Win",
    price: 3,
    slot: 15,
    remainingTopPrizes: 0,
    totalTopPrizes: 9,
    odds: "1 in 4.36",
    playStyle: "Symbol match",
    accent: "rose",
    mark: "WW"
  },
  {
    id: "highway-7",
    name: "Highway 7 Jackpot",
    price: 5,
    slot: 9,
    remainingTopPrizes: 8,
    totalTopPrizes: 16,
    odds: "1 in 3.88",
    playStyle: "Number match",
    accent: "copper",
    mark: "H7"
  }
];
