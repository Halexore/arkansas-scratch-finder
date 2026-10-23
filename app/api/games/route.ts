import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  const { data, error } = await supabase
    .from("scratch_games")
    .select(
      "id, game_number, name, price, slot, odds, play_style, total_top_prizes, remaining_top_prizes, source_url, last_verified_at"
    )
    .eq("active", true)
    .order("name");

  if (error) {
    console.error("Supabase games query failed:", error.message);
    return NextResponse.json(
      { error: "Unable to load games from the database." },
      { status: 500 }
    );
  }

  const games = (data ?? []).map((game) => ({
    id: game.id,
    name: game.name,
    price: Number(game.price),
    slot: game.slot ?? 0,
    remainingTopPrizes: game.remaining_top_prizes ?? 0,
    totalTopPrizes: game.total_top_prizes ?? 0,
    odds: game.odds ?? "Not available",
    playStyle: game.play_style ?? "Not specified",
    accent: "blue",
    mark: game.name.slice(0, 2).toUpperCase(),
    gameNumber: game.game_number,
    sourceUrl: game.source_url,
    lastVerifiedAt: game.last_verified_at
  }));

  return NextResponse.json({ games });
}