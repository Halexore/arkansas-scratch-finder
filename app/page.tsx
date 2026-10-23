"use client";

import { useEffect, useMemo, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import type { ScratchGame } from "./data";
import { rankGames, type SortMode } from "./ranking";

type PrizeFilter = "all" | "available" | "none";

function CameraIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
      <path d="M4 7.5h3l1.4-2h7.2l1.4 2h3v11H4v-11Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <circle cx="12" cy="13" r="3.2" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function GameRow({
  game,
  onSlotChange
}: {
  game: ScratchGame;
  onSlotChange: (id: string, slot: number) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draftSlot, setDraftSlot] = useState(String(game.slot));

  function openEditor() {
    setDraftSlot(String(game.slot));
    setEditing(true);
  }

  function saveSlot(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsed = Number(draftSlot);
    if (Number.isInteger(parsed) && parsed > 0 && parsed < 1000) {
      onSlotChange(game.id, parsed);
      setEditing(false);
    }
  }

  return (
    <article className="game-row">
      <div className="game-identity">
        <div className={`game-stamp ${game.accent}`} aria-hidden="true">{game.mark}</div>
        <div className="game-copy">
          <h3 className="game-name">{game.name}</h3>
          <div className="game-subtitle">
            <span className="fiction-chip">FICTIONAL</span>
            <span>{game.playStyle}</span>
          </div>
        </div>
      </div>

      <div className="stat-cell">
        <span className="cell-label">Ticket price</span>
        <span className="price-value">${game.price}</span>
      </div>

      <div className="stat-cell">
        <span className="cell-label">Top prizes left</span>
        <div className="prize-readout">
          <strong className="prize-value">{game.remainingTopPrizes}</strong>
          <span className="prize-total">/ {game.totalTopPrizes}</span>
        </div>
        <span className={`prize-note ${game.remainingTopPrizes === 0 ? "zero" : ""}`}>
          {game.remainingTopPrizes === 0 ? "None in sample" : "of sample total"}
        </span>
      </div>

      <div className="stat-cell">
        <span className="cell-label">Display slot</span>
        {editing ? (
          <form className="slot-editor" onSubmit={saveSlot}>
            <label className="visually-hidden" htmlFor={`slot-${game.id}`}>New display slot for {game.name}</label>
            <input
              id={`slot-${game.id}`}
              type="number"
              inputMode="numeric"
              min="1"
              max="999"
              value={draftSlot}
              onChange={(event) => setDraftSlot(event.target.value)}
              autoFocus
              required
            />
            <button type="submit" aria-label={`Save slot for ${game.name}`}>OK</button>
            <button type="button" aria-label={`Cancel slot edit for ${game.name}`} onClick={() => setEditing(false)}>×</button>
          </form>
        ) : (
          <div className="slot-group">
            <span className="slot-number">{game.slot}</span>
            <button
              type="button"
              className="slot-edit"
              onClick={openEditor}
              aria-label={`Edit display slot for ${game.name}, currently ${game.slot}`}
            >
              Edit
            </button>
          </div>
        )}
      </div>

      <div className="metadata-cell">
        {game.odds}
        <small>sample odds</small>
      </div>
    </article>
  );
}

export default function Home() {
  const [games, setGames] = useState<ScratchGame[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [query, setQuery] = useState("");
  const [priceFilter, setPriceFilter] = useState("all");
  const [prizeFilter, setPrizeFilter] = useState<PrizeFilter>("all");
  const [sortMode, setSortMode] = useState<SortMode>("remaining");
  const [photoOpen, setPhotoOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState("");
  const fileInput = useRef<HTMLInputElement>(null);
  useEffect(() => {
  let cancelled = false;

  async function loadGames() {
    try {
      const response = await fetch("/api/games");
      if (!response.ok) {
        throw new Error("Unable to load games.");
      }

      const result = await response.json();
      if (!cancelled) {
        setGames(result.games ?? []);
        setLoadError("");
      }
    } catch {
      if (!cancelled) {
        setLoadError("Couldn't load games. Please try again.");
      }
    } finally {
      if (!cancelled) {
        setLoading(false);
      }
    }
  }

  loadGames();

  return () => {
    cancelled = true;
  };
}, []);

  useEffect(() => {
    if (!photoOpen) return;
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setPhotoOpen(false);
        setSelectedFile("");
        if (fileInput.current) fileInput.current.value = "";
      }
    }
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [photoOpen]);

  const visibleGames = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const filtered = games.filter((game) => {
      const matchesQuery =
        !normalizedQuery ||
        game.name.toLowerCase().includes(normalizedQuery) ||
        String(game.slot).includes(normalizedQuery) ||
        game.playStyle.toLowerCase().includes(normalizedQuery);
      const matchesPrice = priceFilter === "all" || String(game.price) === priceFilter;
      const matchesPrize =
        prizeFilter === "all" ||
        (prizeFilter === "available" && game.remainingTopPrizes > 0) ||
        (prizeFilter === "none" && game.remainingTopPrizes === 0);
      return matchesQuery && matchesPrice && matchesPrize;
    });
    return rankGames(filtered, sortMode);
  }, [games, query, priceFilter, prizeFilter, sortMode]);

  const totalRemaining = games.reduce((sum, game) => sum + game.remainingTopPrizes, 0);

  function updateSlot(id: string, slot: number) {
    setGames((current) => current.map((game) => game.id === id ? { ...game, slot } : game));
  }

  function resetFilters() {
    setQuery("");
    setPriceFilter("all");
    setPrizeFilter("all");
    setSortMode("remaining");
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    setSelectedFile(file?.name ?? "");
  }

  function closePhotoDialog() {
    setPhotoOpen(false);
    setSelectedFile("");
    if (fileInput.current) fileInput.current.value = "";
  }

  return (
    <main>
      <div className="shell">
        <header className="topbar">
          <a className="brand" href="/" aria-label="Arkansas Scratch Finder home">
            <span className="brand-mark" aria-hidden="true">SF</span>
            <span>
              <span className="brand-name">Scratch Finder</span>
              <span className="brand-region">Arkansas · pocket guide</span>
            </span>
          </a>
          <div className="header-note">
            <span className="status-dot" aria-hidden="true" />
            Sample mode
          </div>
        </header>

        <section className="hero" aria-labelledby="page-title">
          <div>
            <span className="eyebrow">A clearer look at the display</span>
            <h1 id="page-title">Find your game.<br /><em>Know its slot.</em></h1>
            <p className="hero-copy">
              A quick pocket reference for comparing sample top-prize counts and locating a game by its number on the store display.
            </p>
          </div>
          <aside className="hero-aside" aria-label="Sample prize count summary">
            <div className="aside-label">In this fictional sample</div>
            <div className="aside-stat">
              <strong>{totalRemaining}</strong>
              <span>top prizes shown across all games</span>
            </div>
            <div className="aside-foot">{games.length} sample games · no live data</div>
          </aside>
        </section>

        <div className="fiction-banner" role="note">
          <span className="alert-mark" aria-hidden="true">i</span>
          <span>
            <strong>Fictional sample data — not real Arkansas Lottery information</strong>
            Every game name, prize count, ticket price, slot number, and odds figure on this page is invented for demonstration.
          </span>
        </div>

        <section className="workspace" aria-labelledby="games-heading">
          <div className="toolbar">
            <div className="section-heading">
              <h2 id="games-heading">Browse sample games</h2>
              <p>Compare what’s left, then check the display slot.</p>
            </div>
            <div className="toolbar-actions">
              <button className="photo-button" type="button" onClick={() => setPhotoOpen(true)}>
                <CameraIcon />
                Find a slot from a photo
              </button>
            </div>
          </div>

          <div className="filters" role="search" aria-label="Search and filter sample games">
            <div className="control search-control">
              <label htmlFor="game-search">Search games or slot</label>
              <input
                id="game-search"
                type="search"
                placeholder="Try “gold” or slot 12"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </div>
            <div className="control">
              <label htmlFor="price-filter">Ticket price</label>
              <select id="price-filter" value={priceFilter} onChange={(event) => setPriceFilter(event.target.value)}>
                <option value="all">Any price</option>
                <option value="2">$2 tickets</option>
                <option value="3">$3 tickets</option>
                <option value="5">$5 tickets</option>
                <option value="10">$10 tickets</option>
                <option value="20">$20 tickets</option>
                <option value="30">$30 tickets</option>
              </select>
            </div>
            <div className="control">
              <label htmlFor="prize-filter">Prize status</label>
              <select id="prize-filter" value={prizeFilter} onChange={(event) => setPrizeFilter(event.target.value as PrizeFilter)}>
                <option value="all">All sample games</option>
                <option value="available">Prizes remaining</option>
                <option value="none">None remaining</option>
              </select>
            </div>
            <div className="control">
              <label htmlFor="sort-order">Sort by</label>
              <select id="sort-order" value={sortMode} onChange={(event) => setSortMode(event.target.value as SortMode)}>
                <option value="remaining">Most prizes left</option>
                <option value="name">Game name</option>
                <option value="price">Ticket price</option>
              </select>
            </div>
            <button className="clear-button" type="button" onClick={resetFilters}>Reset</button>
          </div>

          <div className="list-meta">
            <span>{visibleGames.length} of {games.length} fictional games</span>
            <span className="sample-time">Sample snapshot · March 18, 2025 · 8:30 AM CT</span>
          </div>

          {visibleGames.length > 0 ? (
            <div className="game-list" aria-live="polite">
              {visibleGames.map((game, index) => (
                <div key={game.id} style={{ animationDelay: `${Math.min(index * 35, 210)}ms` }}>
                  <GameRow game={game} onSlotChange={updateSlot} />
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div>
                <span className="empty-icon" aria-hidden="true">?</span>
                <h3>No sample games found</h3>
                <p>Try another game name or slot number, or loosen the ticket and prize filters.</p>
                <button type="button" onClick={resetFilters}>Clear filters</button>
              </div>
            </div>
          )}

          <footer className="footnote">
            <span><strong>For demonstration only.</strong> Counts and odds are invented and should not be used to make purchasing decisions.</span>
            <span>Slot edits stay on this device for this session.</span>
          </footer>
        </section>
      </div>

      {photoOpen && (
        <div className="modal-backdrop" onMouseDown={(event) => {
          if (event.target === event.currentTarget) closePhotoDialog();
        }}>
          <section className="photo-modal" role="dialog" aria-modal="true" aria-labelledby="photo-title">
            <div className="modal-top">
              <div>
                <span className="eyebrow">Display photo helper</span>
                <h2 id="photo-title">Photo recognition is coming later.</h2>
                <p>No image is analyzed or uploaded here. This is a preview of a future feature.</p>
              </div>
              <button type="button" className="modal-close" aria-label="Close photo placeholder" onClick={closePhotoDialog}>×</button>
            </div>
            <div className="photo-placeholder">
              <div className="placeholder-inner">
                <span className="placeholder-symbol" aria-hidden="true"><CameraIcon /></span>
                <strong>Slot finding from a display photo</strong>
                <p>Image recognition is not available in this sample app. Use the numbered list to find a game instead.</p>
              </div>
            </div>
            <input
              ref={fileInput}
              className="visually-hidden"
              type="file"
              accept="image/*"
              capture="environment"
              aria-label="Choose or take a display photo"
              onChange={handleFileChange}
            />
            <div className="modal-actions">
              <button type="button" onClick={closePhotoDialog}>Close</button>
              <button type="button" className="choose-photo" onClick={() => fileInput.current?.click()}>
                Choose or take photo
              </button>
            </div>
            {selectedFile && <p className="file-name">Selected locally: {selectedFile} · not uploaded</p>}
          </section>
        </div>
      )}
    </main>
  );
}
