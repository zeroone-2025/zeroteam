"use client";

import { usePlayerStore } from "@/stores/use-player-store";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const PRANK_ICONS: Record<string, string> = {
  FAKE_PLAY: "👻",
  SPEED_CHANGE: "🎰",
  WRONG_SONG: "🔀",
};

const PRANK_LABELS: Record<string, string> = {
  FAKE_PLAY: "유령 재생",
  SPEED_CHANGE: "속도 룰렛",
  WRONG_SONG: "엉뚱한 노래",
};

function formatTime(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export function PrankHistory() {
  const prankCount = usePlayerStore((s) => s.prankCount);
  const prankHistory = usePlayerStore((s) => s.prankHistory);

  return (
    <Sheet>
      <SheetTrigger
        render={
          <button className="cursor-pointer text-xs text-muted-foreground transition-colors hover:text-foreground" />
        }
      >
        이 플레이어가 거짓말한 횟수:{" "}
        <span className="font-bold text-destructive">{prankCount}</span>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>장난 히스토리 🎭</SheetTitle>
        </SheetHeader>
        <div className="mt-4 space-y-3 overflow-y-auto pr-2">
          {prankHistory.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              아직 장난을 치지 않았습니다. 재생 버튼을 눌러보세요!
            </p>
          ) : (
            [...prankHistory].reverse().map((entry, i) => (
              <div
                key={`${entry.timestamp}-${i}`}
                className="flex items-start gap-3 rounded-lg border p-3"
              >
                <span className="text-2xl">{PRANK_ICONS[entry.mode]}</span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium">
                      {PRANK_LABELS[entry.mode]}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatTime(entry.timestamp)}
                    </span>
                  </div>
                  <p className="truncate text-sm text-muted-foreground">
                    🎵 {entry.songTitle}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground/70">
                    {entry.message}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
