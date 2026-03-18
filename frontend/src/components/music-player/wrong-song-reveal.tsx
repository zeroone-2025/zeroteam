"use client";

import { useEffect, useState } from "react";
import { usePlayerStore } from "@/stores/use-player-store";
import type { Song } from "@/lib/songs-data";

interface WrongSongRevealProps {
  displayedSong: Song;
  actualSong: Song;
  children: React.ReactNode;
}

export function WrongSongReveal({ displayedSong, actualSong, children }: WrongSongRevealProps) {
  const [flipped, setFlipped] = useState(false);
  const revealWrongSong = usePlayerStore((s) => s.revealWrongSong);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const wrongSongRevealed = usePlayerStore((s) => s.wrongSongRevealed);

  useEffect(() => {
    if (!isPlaying || wrongSongRevealed) return;

    const timer = setTimeout(() => {
      setFlipped(true);
      revealWrongSong();
    }, 3000);

    return () => clearTimeout(timer);
  }, [isPlaying, wrongSongRevealed, revealWrongSong]);

  // Reset flip when song changes
  useEffect(() => {
    if (!isPlaying) {
      setFlipped(false);
    }
  }, [isPlaying]);

  return (
    <div style={{ perspective: "1000px" }} className="w-full">
      <div className={`flip-card-inner relative ${flipped ? "flipped" : ""}`}>
        {/* Front: displayed song */}
        <div className="flip-card-front">
          {children}
        </div>

        {/* Back: actual song */}
        <div className="flip-card-back absolute inset-0">
          <div className="flex flex-col items-center gap-4">
            <div
              className={`flex h-48 w-48 items-center justify-center rounded-2xl bg-gradient-to-br ${actualSong.albumGradient} shadow-lg scale-105`}
            >
              <span className="text-7xl">{actualSong.albumEmoji}</span>
            </div>
            <div className="text-center">
              <p className="mb-1 text-xs font-medium text-destructive">🔀 실제 재생 중인 곡:</p>
              <h2 className="text-xl font-bold">{actualSong.title}</h2>
              <p className="text-sm text-muted-foreground">{actualSong.artist}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
