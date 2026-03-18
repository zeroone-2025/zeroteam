"use client";

import { useRef, useState, useCallback, useEffect } from "react";
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

  const containerRef = useRef<HTMLDivElement>(null);
  const isGhostMode = currentPrankMode === "FAKE_PLAY" && isPlaying;

  // null = normal flow, { x, y } = fixed position (runaway mode)
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const [isShaking, setIsShaking] = useState(false);

  // Enter/exit ghost runaway mode
  useEffect(() => {
    if (isGhostMode && !pos && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setPos({ x: rect.left, y: rect.top });
    }
    if (!isGhostMode) {
      setPos(null);
    }
  }, [isGhostMode]); // eslint-disable-line react-hooks/exhaustive-deps

  // Global pointer tracking for runaway behavior
  useEffect(() => {
    if (!pos) return;

    const handler = (e: PointerEvent) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const dx = e.clientX - centerX;
      const dy = e.clientY - centerY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 100) {
        // Run away from pointer in the opposite direction
        const angle = Math.atan2(dy, dx);
        const runDistance = 150 + Math.random() * 100; // 150~250px random

        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const pad = 16;

        const newX = Math.max(pad, Math.min(vw - rect.width - pad,
          pos.x - Math.cos(angle) * runDistance
        ));
        const newY = Math.max(pad, Math.min(vh - rect.height - pad,
          pos.y - Math.sin(angle) * runDistance
        ));

        setPos({ x: newX, y: newY });

        // Trigger shake animation
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 300);

        // Increment ghost attempts
        setVolume(volume);
      }
    };

    window.addEventListener("pointermove", handler);
    return () => window.removeEventListener("pointermove", handler);
  }, [pos, setVolume, volume]);

  const handleSliderChange = useCallback(
    (val: number | readonly number[]) => {
      const arr = val as number[];
      setVolume(arr[0] / 100);
    },
    [setVolume]
  );

  const VolumeIcon =
    volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;

  const isRunaway = pos !== null;

  return (
    <div
      ref={containerRef}
      className={`relative flex items-center gap-2 ${isRunaway ? "z-50" : ""}`}
      style={
        isRunaway
          ? {
              position: "fixed",
              left: pos.x,
              top: pos.y,
              transition: "left 300ms ease-out, top 300ms ease-out",
            }
          : undefined
      }
    >
      <div
        className={`flex items-center gap-2 ${isShaking ? "volume-shake" : ""}`}
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
