"use client";

import { usePlayerStore } from "@/stores/use-player-store";
import { PlaylistItem } from "./playlist-item";

export function Playlist() {
  const playlist = usePlayerStore((s) => s.playlist);
  const currentSongIndex = usePlayerStore((s) => s.currentSongIndex);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const selectSong = usePlayerStore((s) => s.selectSong);

  return (
    <div className="space-y-1">
      <h3 className="mb-2 text-sm font-semibold text-muted-foreground">
        재생 목록
      </h3>
      <div className="max-h-[360px] space-y-0.5 overflow-y-auto">
        {playlist.map((song, index) => (
          <PlaylistItem
            key={song.id}
            song={song}
            index={index}
            isActive={index === currentSongIndex}
            isPlaying={isPlaying}
            onSelect={selectSong}
          />
        ))}
      </div>
    </div>
  );
}
