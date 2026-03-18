"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import { usePlayerStore } from "@/stores/use-player-store";
import { Slider } from "@/components/ui/slider";
import { Volume2, VolumeX, Volume1 } from "lucide-react";

function GhostEmoji() {
  return (
    <span className="ghost-float pointer-events-none absolute -top-2 left-1/2 -translate-x-1/2 text-5xl">
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
  const incrementGhostAttempts = usePlayerStore((s) => s.incrementGhostAttempts);

  const containerRef = useRef<HTMLDivElement>(null);
  const posRef = useRef<{ x: number; y: number } | null>(null);
  const isGhostMode = currentPrankMode === "FAKE_PLAY" && isPlaying;

  const [renderPos, setRenderPos] = useState<{ x: number; y: number } | null>(null);
  const [isShaking, setIsShaking] = useState(false);

  // Enter/exit ghost runaway mode
  useEffect(() => {
    if (isGhostMode && !posRef.current && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const initial = { x: rect.left, y: rect.top };
      posRef.current = initial;
      setRenderPos(initial);
    }
    if (!isGhostMode) {
      posRef.current = null;
      setRenderPos(null);
    }
  }, [isGhostMode]);

  // Global pointer tracking for runaway behavior — registered once when entering/exiting runaway mode
  useEffect(() => {
    if (!renderPos) return;

    const handler = (e: PointerEvent) => {
      const pos = posRef.current;
      if (!pos || !containerRef.current) return;

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

        const newPos = {
          x: Math.max(pad, Math.min(vw - rect.width - pad,
            pos.x - Math.cos(angle) * runDistance
          )),
          y: Math.max(pad, Math.min(vh - rect.height - pad,
            pos.y - Math.sin(angle) * runDistance
          )),
        };

        posRef.current = newPos;
        setRenderPos(newPos);

        // Trigger shake animation
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 300);

        // Increment ghost attempts directly
        incrementGhostAttempts();
      }
    };

    window.addEventListener("pointermove", handler);
    return () => window.removeEventListener("pointermove", handler);
  }, [renderPos !== null]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSliderChange = useCallback(
    (val: number | readonly number[]) => {
      const arr = val as number[];
      setVolume(arr[0] / 100);
    },
    [setVolume]
  );

  const VolumeIcon =
    volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;

  const volumeUI = (
    <div
      ref={containerRef}
      className="relative flex items-center gap-2"
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

  if (renderPos) {
    return (
      <>
        {/* Placeholder to maintain layout when volume control is portaled out */}
        <div className="w-[calc(1rem+96px+16px)] h-4" />
        {createPortal(
          <div
            style={{
              position: "fixed",
              left: renderPos.x,
              top: renderPos.y,
              zIndex: 9999,
              transition: "left 300ms ease-out, top 300ms ease-out",
            }}
          >
            {volumeUI}
          </div>,
          document.body
        )}
      </>
    );
  }

  return volumeUI;
}
