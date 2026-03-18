"use client";

import { useRef, useState, useCallback } from "react";
import { usePlayerStore } from "@/stores/use-player-store";
import { Slider } from "@/components/ui/slider";
import { Volume2, VolumeX, Volume1 } from "lucide-react";

function GhostEmoji() {
  return (
    <span className="ghost-float pointer-events-none absolute -top-2 left-1/2 -translate-x-1/2 text-2xl">
      👻
    </span>
  );
}

export function VolumeControl() {
  const volume = usePlayerStore((s) => s.volume);
  const setVolume = usePlayerStore((s) => s.setVolume);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const currentPrankMode = usePlayerStore((s) => s.currentPrankMode);
  const ghostVolumeAttempts = usePlayerStore((s) => s.ghostVolumeAttempts);

  const [offsetX, setOffsetX] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const isGhostMode = currentPrankMode === "FAKE_PLAY" && isPlaying;

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isGhostMode || !containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const sliderCenterX = rect.left + rect.width / 2 + offsetX;
      const distance = Math.abs(e.clientX - sliderCenterX);

      if (distance < 50) {
        // Run away from pointer
        const direction = e.clientX > sliderCenterX ? -1 : 1;
        setOffsetX((prev) => {
          const next = prev + direction * 60;
          // Clamp to prevent going off-screen
          return Math.max(-80, Math.min(80, next));
        });
        setVolume(volume); // triggers ghostVolumeAttempts++
      }
    },
    [isGhostMode, offsetX, setVolume, volume]
  );

  const handleSliderChange = useCallback(
    (val: number | readonly number[]) => {
      const arr = val as number[];
      setVolume(arr[0] / 100);
    },
    [setVolume]
  );

  const VolumeIcon =
    volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;

  return (
    <div
      ref={containerRef}
      className="relative flex items-center gap-2"
      onPointerMove={handlePointerMove}
    >
      <div
        className="flex items-center gap-2 transition-transform duration-300"
        style={{ transform: isGhostMode ? `translateX(${offsetX}px)` : "none" }}
      >
        <VolumeIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
        <Slider
          value={[volume * 100]}
          onValueChange={handleSliderChange}
          max={100}
          step={1}
          className="w-24 cursor-pointer"
        />
      </div>
      {isGhostMode && ghostVolumeAttempts >= 3 && <GhostEmoji />}
    </div>
  );
}
