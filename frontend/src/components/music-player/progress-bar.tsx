"use client";

import { usePlayerStore } from "@/stores/use-player-store";
import { Slider } from "@/components/ui/slider";

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function ProgressBar() {
  const playlist = usePlayerStore((s) => s.playlist);
  const currentSongIndex = usePlayerStore((s) => s.currentSongIndex);
  const progress = usePlayerStore((s) => s.progress);
  const setProgress = usePlayerStore((s) => s.setProgress);

  const song = playlist[currentSongIndex];
  if (!song) return null;

  const currentTime = (progress / 100) * song.duration;

  return (
    <div className="w-full space-y-1">
      <Slider
        value={[progress]}
        onValueChange={(val) => {
          const arr = val as number[];
          setProgress(arr[0]);
        }}
        max={100}
        step={0.1}
        className="cursor-pointer"
      />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(song.duration)}</span>
      </div>
    </div>
  );
}
