"use client";

import type { Song } from "@/lib/songs-data";
import { cn } from "@/lib/utils";

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

interface PlaylistItemProps {
  song: Song;
  index: number;
  isActive: boolean;
  isPlaying: boolean;
  onSelect: (index: number) => void;
}

export function PlaylistItem({
  song,
  index,
  isActive,
  isPlaying,
  onSelect,
}: PlaylistItemProps) {
  return (
    <button
      onClick={() => onSelect(index)}
      className={cn(
        "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors hover:bg-accent",
        isActive && "bg-accent"
      )}
    >
      <span className="text-2xl">{song.albumEmoji}</span>
      <div className="min-w-0 flex-1">
        <p
          className={cn(
            "truncate text-sm font-medium",
            isActive && "text-primary"
          )}
        >
          {isActive && isPlaying && (
            <span className="mr-1 inline-block animate-pulse">♫</span>
          )}
          {song.title}
        </p>
        <p className="truncate text-xs text-muted-foreground">{song.artist}</p>
      </div>
      <span className="shrink-0 text-xs text-muted-foreground">
        {formatDuration(song.duration)}
      </span>
    </button>
  );
}
