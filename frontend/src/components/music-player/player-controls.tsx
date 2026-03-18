"use client";

import { usePlayerStore } from "@/stores/use-player-store";
import { Button } from "@/components/ui/button";
import {
  Shuffle,
  SkipBack,
  Play,
  Pause,
  SkipForward,
  Repeat,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

export function PlayerControls() {
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const isLoading = usePlayerStore((s) => s.isLoading);
  const play = usePlayerStore((s) => s.play);
  const pause = usePlayerStore((s) => s.pause);
  const nextSong = usePlayerStore((s) => s.nextSong);
  const prevSong = usePlayerStore((s) => s.prevSong);
  const shufflePlaylist = usePlayerStore((s) => s.shufflePlaylist);

  const handlePlayPause = () => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  };

  const handleShuffle = () => {
    shufflePlaylist();
    toast("셔플 완료! (아마도)", {
      description: "곡 순서가 변경되었을 수도 있습니다",
    });
  };

  const handleRepeat = () => {
    toast("반복 재생 활성화!", {
      description: "같은 장난이 무한 반복됩니다 🔁",
    });
  };

  return (
    <div className="flex items-center justify-center gap-2">
      <Button variant="ghost" size="icon" onClick={handleShuffle}>
        <Shuffle className="h-4 w-4" />
      </Button>

      <Button variant="ghost" size="icon" onClick={prevSong}>
        <SkipBack className="h-5 w-5" />
      </Button>

      <Button
        size="icon"
        className="h-12 w-12 rounded-full"
        onClick={handlePlayPause}
        disabled={isLoading}
      >
        {isLoading ? (
          <Loader2 className="h-6 w-6 animate-spin" />
        ) : isPlaying ? (
          <Pause className="h-6 w-6" />
        ) : (
          <Play className="h-6 w-6 pl-0.5" />
        )}
      </Button>

      <Button variant="ghost" size="icon" onClick={nextSong}>
        <SkipForward className="h-5 w-5" />
      </Button>

      <Button variant="ghost" size="icon" onClick={handleRepeat}>
        <Repeat className="h-4 w-4" />
      </Button>
    </div>
  );
}
