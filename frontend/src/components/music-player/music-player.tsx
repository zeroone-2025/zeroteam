"use client";

import { useEffect, useRef } from "react";
import { usePlayerStore } from "@/stores/use-player-store";
import { useAudioEngine } from "@/hooks/use-audio-engine";
import { useSongs } from "@/hooks/use-songs";
import { NowPlaying } from "./now-playing";
import { ProgressBar } from "./progress-bar";
import { PlayerControls } from "./player-controls";
import { VolumeControl } from "./volume-control";
import { Playlist } from "./playlist";
import { PrankHistory } from "./prank-history";
import { ConfettiEffect } from "./confetti-effect";
import { ScreenEffect } from "./screen-effect";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

export function MusicPlayer() {
  useAudioEngine();
  const { data: songs } = useSongs();
  const setPlaylist = usePlayerStore((s) => s.setPlaylist);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const tick = usePlayerStore((s) => s.tick);
  const prankCount = usePlayerStore((s) => s.prankCount);
  const lastPrankMessage = usePlayerStore((s) => s.lastPrankMessage);
  const wrongSongRevealed = usePlayerStore((s) => s.wrongSongRevealed);
  const screenEffectRevealed = usePlayerStore((s) => s.screenEffectRevealed);
  const prevPrankCountRef = useRef(0);

  // Sync songs from API
  useEffect(() => {
    if (songs && songs.length > 0) {
      setPlaylist(songs);
    }
  }, [songs, setPlaylist]);

  // Progress tick
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(tick, 100);
    return () => clearInterval(interval);
  }, [isPlaying, tick]);

  // Show prank toast
  useEffect(() => {
    if (prankCount > prevPrankCountRef.current && lastPrankMessage) {
      toast(lastPrankMessage);
    }
    prevPrankCountRef.current = prankCount;
  }, [prankCount, lastPrankMessage]);

  return (
    <>
      <ConfettiEffect trigger={wrongSongRevealed || screenEffectRevealed} />
      <ScreenEffect />
      <div className="mx-auto grid w-full max-w-4xl gap-6 md:grid-cols-[1fr_320px]">
        {/* Player Section */}
        <Card>
          <CardContent className="flex flex-col items-center gap-6 p-6">
            <NowPlaying />
            <ProgressBar />
            <PlayerControls />
            <div className="flex w-full items-center justify-between">
              <VolumeControl />
              <PrankHistory />
            </div>
          </CardContent>
        </Card>

        {/* Playlist Section */}
        <Card>
          <CardContent className="p-4">
            <Playlist />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
