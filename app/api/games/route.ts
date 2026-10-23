import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  const { data, error } = await supabase
    .from("scratch_games")
    .select("id, game_number, name, price, odds, play_style, total_top_prizes, remaining_top_prizes, source_url, last_verified_at")
    .eq("active", true)
    .order("name");

  if (error) {
    console.error("Supabase games query failed:", error.message);
    return NextResponse.json(
      { error: "Unable to load games from the database." },
      { status: 500 }
    );
  }

  return NextResponse.json({ games: data ?? [] });
}