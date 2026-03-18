"use client";

import { useEffect, useState } from "react";
import { usePlayerStore } from "@/stores/use-player-store";
import { Button } from "@/components/ui/button";
import type { ScreenEffect as ScreenEffectType } from "@/lib/pranks";

const EFFECT_LABELS: Record<ScreenEffectType, string> = {
  FLIP: "화면 뒤집기",
  INVERT: "색상 반전",
  SHAKE: "지진 모드",
  RAINBOW: "무지개 모드",
  BLUR: "안개 모드",
  TILT: "기울어짐 모드",
};

const EFFECT_EMOJIS: Record<ScreenEffectType, string> = {
  FLIP: "🙃",
  INVERT: "🔄",
  SHAKE: "📳",
  RAINBOW: "🌈",
  BLUR: "🌫️",
  TILT: "📐",
};

export function ScreenEffect() {
  const screenEffect = usePlayerStore((s) => s.screenEffect);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const screenEffectRevealed = usePlayerStore((s) => s.screenEffectRevealed);
  const revealScreenEffect = usePlayerStore((s) => s.revealScreenEffect);
  const [intensity, setIntensity] = useState(0);
  const [rainbowDeg, setRainbowDeg] = useState(0);

  // Gradually increase intensity over 3 seconds
  useEffect(() => {
    if (!screenEffect || !isPlaying || screenEffectRevealed) {
      setIntensity(0);
      return;
    }

    const start = Date.now();
    const duration = 3000;
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      setIntensity(progress);
      if (progress >= 1) clearInterval(interval);
    }, 50);

    return () => clearInterval(interval);
  }, [screenEffect, isPlaying, screenEffectRevealed]);

  // Rainbow hue rotation animation
  useEffect(() => {
    if (screenEffect !== "RAINBOW" || !isPlaying || screenEffectRevealed) return;

    const interval = setInterval(() => {
      setRainbowDeg((d) => (d + 5) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, [screenEffect, isPlaying, screenEffectRevealed]);

  // Apply/remove effect on <html>
  useEffect(() => {
    const html = document.documentElement;
    if (!screenEffect || !isPlaying || screenEffectRevealed || intensity === 0) {
      html.style.transition = "all 0.5s ease-out";
      html.style.transform = "";
      html.style.filter = "";
      html.classList.remove("screen-shake");
      return;
    }

    html.style.transition = "all 0.3s ease-in";

    if (screenEffect === "FLIP") {
      html.style.transform = `rotate(${180 * intensity}deg)`;
    } else if (screenEffect === "INVERT") {
      html.style.filter = `invert(${intensity}) hue-rotate(${180 * intensity}deg)`;
    } else if (screenEffect === "SHAKE") {
      if (intensity > 0.5) {
        html.classList.add("screen-shake");
      }
    } else if (screenEffect === "RAINBOW") {
      html.style.filter = `saturate(${1 + 2 * intensity}) hue-rotate(${rainbowDeg}deg)`;
    } else if (screenEffect === "BLUR") {
      html.style.filter = `blur(${3 * intensity}px)`;
    } else if (screenEffect === "TILT") {
      html.style.transform = `perspective(600px) rotateY(${15 * intensity}deg) rotateX(${5 * intensity}deg) scale(${1 - 0.05 * intensity})`;
    }

    return () => {
      html.style.transform = "";
      html.style.filter = "";
      html.classList.remove("screen-shake");
    };
  }, [screenEffect, isPlaying, screenEffectRevealed, intensity, rainbowDeg]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      const html = document.documentElement;
      html.style.transform = "";
      html.style.filter = "";
      html.classList.remove("screen-shake");
    };
  }, []);

  if (!screenEffect || !isPlaying || screenEffectRevealed) return null;

  return (
    <div
      className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2"
      style={screenEffect === "FLIP" ? { transform: "rotate(180deg) translateX(50%)" } : undefined}
    >
      {intensity >= 0.8 && (
        <Button
          onClick={revealScreenEffect}
          variant="destructive"
          className="animate-bounce shadow-lg"
          size="lg"
        >
          {EFFECT_EMOJIS[screenEffect]} {EFFECT_LABELS[screenEffect]} 해제하기!
        </Button>
      )}
    </div>
  );
}
