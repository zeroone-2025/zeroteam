"use client";

import { useCallback } from "react";
import { usePlayerStore } from "@/stores/use-player-store";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { SpeedSlotMachine } from "./speed-slot-machine";
import { WrongSongReveal } from "./wrong-song-reveal";

export function NowPlaying() {
  const playlist = usePlayerStore((s) => s.playlist);
  const currentSongIndex = usePlayerStore((s) => s.currentSongIndex);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const isLoading = usePlayerStore((s) => s.isLoading);
  const currentPrankMode = usePlayerStore((s) => s.currentPrankMode);
  const playbackSpeed = usePlayerStore((s) => s.playbackSpeed);
  const actualPlayingSongIndex = usePlayerStore((s) => s.actualPlayingSongIndex);
  const speedRevealed = usePlayerStore((s) => s.speedRevealed);
  const wrongSongRevealed = usePlayerStore((s) => s.wrongSongRevealed);
  const revealSpeed = usePlayerStore((s) => s.revealSpeed);

  const handleSpeedReveal = useCallback(() => {
    revealSpeed();
  }, [revealSpeed]);

  const song = playlist[currentSongIndex];
  if (!song) return null;

  const actualSong = playlist[actualPlayingSongIndex];
  const isSpeedMode = currentPrankMode === "SPEED_CHANGE" && isPlaying;
  const isWrongSongMode = currentPrankMode === "WRONG_SONG" && isPlaying;
  const showSlotMachine = isSpeedMode && !speedRevealed;
  const showVinylSpin = isSpeedMode && speedRevealed;

  const speedLabel =
    isSpeedMode && speedRevealed
      ? playbackSpeed < 1
        ? `x${playbackSpeed} 🐌`
        : `x${playbackSpeed} 🚀`
      : null;

  const vinylDuration = showVinylSpin ? `${3 / playbackSpeed}s` : undefined;

  const albumArt = (
    <div className="relative">
      <div
        className={`relative flex h-48 w-48 items-center justify-center bg-gradient-to-br ${song.albumGradient} shadow-lg transition-transform duration-300 ${
          showVinylSpin ? "rounded-full" : "rounded-2xl"
        } ${isPlaying ? "scale-105" : ""}`}
        style={
          showVinylSpin
            ? { animation: `spin ${vinylDuration} linear infinite` }
            : undefined
        }
      >
        <span className="text-7xl">{song.albumEmoji}</span>

        {/* Vinyl center hole */}
        {showVinylSpin && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-6 w-6 rounded-full bg-background/80" />
          </div>
        )}

        {/* Equalizer animation */}
        {(isPlaying || isLoading) && !showVinylSpin && (
          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-end gap-1">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="equalizer-bar w-1 rounded-full bg-white/80"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
        )}

        {/* Speed Slot Machine overlay */}
        {showSlotMachine && (
          <SpeedSlotMachine
            targetSpeed={playbackSpeed}
            onReveal={handleSpeedReveal}
          />
        )}
      </div>
    </div>
  );

  const songInfo = (
    <>
      {/* Loading skeleton */}
      {isLoading && (
        <p className="animate-pulse text-sm text-muted-foreground">
          무손실 음질 변환 중...
        </p>
      )}

      {/* Song info */}
      <div className="text-center">
        <h2 className="text-xl font-bold">{song.title}</h2>
        <p className="text-sm text-muted-foreground">{song.artist}</p>
      </div>
    </>
  );

  const content = (
    <div className="flex flex-col items-center gap-4">
      {albumArt}
      {songInfo}
    </div>
  );

  return (
    <div className="flex flex-col items-center gap-4">
      {isWrongSongMode && actualSong ? (
        <WrongSongReveal displayedSong={song} actualSong={actualSong}>
          {content}
        </WrongSongReveal>
      ) : (
        content
      )}

      {/* Badges */}
      <div className="flex items-center gap-2">
        <Dialog>
          <DialogTrigger
            render={
              <Badge
                variant="secondary"
                className="cursor-pointer transition-colors hover:bg-primary hover:text-primary-foreground"
              />
            }
          >
            ✨ Premium
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>I&apos;M KING 구독</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <p className="text-2xl font-bold">월 ₩99,999,999</p>
              <p className="text-sm text-muted-foreground">
                프리미엄 기능: 곡이 제대로 재생될 수도 있습니다 (보장 안 됨)
              </p>
              <p className="text-xs text-muted-foreground">
                결제 시스템이 점검 중입니다 (영원히)
              </p>
            </div>
          </DialogContent>
        </Dialog>

        {speedLabel && (
          <Badge variant="outline" className="animate-pulse">
            {speedLabel}
          </Badge>
        )}

        {isWrongSongMode && wrongSongRevealed && (
          <Badge variant="destructive" className="animate-bounce">
            🔀 곡이 바뀜!
          </Badge>
        )}
      </div>
    </div>
  );
}
