"use client";

import { useEffect, useRef } from "react";
import { AudioEngine } from "@/lib/audio-engine";
import { usePlayerStore } from "@/stores/use-player-store";

export function useAudioEngine() {
  const engineRef = useRef<AudioEngine | null>(null);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const currentPrankMode = usePlayerStore((s) => s.currentPrankMode);
  const playbackSpeed = usePlayerStore((s) => s.playbackSpeed);
  const actualPlayingSongIndex = usePlayerStore((s) => s.actualPlayingSongIndex);
  const volume = usePlayerStore((s) => s.volume);
  const playlist = usePlayerStore((s) => s.playlist);
  const speedRevealed = usePlayerStore((s) => s.speedRevealed);

  useEffect(() => {
    engineRef.current = AudioEngine.getInstance();
  }, []);

  useEffect(() => {
    const engine = engineRef.current;
    if (!engine) return;

    if (!isPlaying) {
      engine.stop();
      return;
    }

    const song = playlist[actualPlayingSongIndex];
    if (!song) return;

    if (currentPrankMode === "FAKE_PLAY") {
      engine.playFake(song.toneFrequency, song.tonePattern);
    } else if (currentPrankMode === "SPEED_CHANGE") {
      // Wait for slot machine reveal before playing
      if (!speedRevealed) return;
      engine.play(song.toneFrequency, song.tonePattern, playbackSpeed);
    } else {
      engine.play(song.toneFrequency, song.tonePattern, playbackSpeed);
    }

    return () => {
      engine.stop();
    };
  }, [isPlaying, currentPrankMode, playbackSpeed, actualPlayingSongIndex, playlist, speedRevealed]);

  // Volume control - FAKE_PLAY always blocked (handled in store), others pass through
  useEffect(() => {
    const engine = engineRef.current;
    if (!engine) return;
    engine.setVolume(volume);
  }, [volume]);
}
