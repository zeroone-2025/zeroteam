"use client";

import { useEffect, useState, useRef } from "react";

const SPEED_OPTIONS = [0.25, 0.3, 0.5, 1.0, 1.5, 2.0, 2.5, 3.0];

interface SpeedSlotMachineProps {
  targetSpeed: number;
  onReveal: () => void;
}

export function SpeedSlotMachine({ targetSpeed, onReveal }: SpeedSlotMachineProps) {
  const [phase, setPhase] = useState<"spinning" | "slowing" | "done">("spinning");
  const [displaySpeed, setDisplaySpeed] = useState(SPEED_OPTIONS[0]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    // Phase 1: Fast scroll (0-1.5s)
    let idx = 0;
    intervalRef.current = setInterval(() => {
      idx = (idx + 1) % SPEED_OPTIONS.length;
      setDisplaySpeed(SPEED_OPTIONS[idx]);
    }, 80);

    // Phase 2: Slow down (1.5s)
    const slowTimer = setTimeout(() => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setPhase("slowing");

      let delay = 120;
      let slowIdx = 0;
      const remaining = [...SPEED_OPTIONS, ...SPEED_OPTIONS];

      const slowStep = () => {
        if (delay > 500) {
          // Done - snap to target
          setDisplaySpeed(targetSpeed);
          setPhase("done");

          // Wait then reveal
          setTimeout(onReveal, 500);
          return;
        }
        setDisplaySpeed(remaining[slowIdx % remaining.length]);
        slowIdx++;
        delay += 60;
        setTimeout(slowStep, delay);
      };
      slowStep();
    }, 1500);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      clearTimeout(slowTimer);
    };
  }, [targetSpeed, onReveal]);

  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl backdrop-blur-sm bg-black/40">
      <div className="flex flex-col items-center gap-3">
        <p className="text-xs font-medium text-white/70">속도 결정 중...</p>
        <div className="overflow-hidden rounded-lg border-2 border-white/30 bg-black/60 px-6 py-3">
          <span
            className={`block text-center text-3xl font-bold text-white tabular-nums transition-all ${
              phase === "done" ? "text-yellow-300 scale-110" : ""
            }`}
          >
            {displaySpeed}x
          </span>
        </div>
        {phase === "done" && (
          <p className="animate-pulse text-sm font-bold text-yellow-300">
            {targetSpeed < 1 ? "🐌 슬로우 모션!" : "🚀 터보 모드!"}
          </p>
        )}
      </div>
    </div>
  );
}
