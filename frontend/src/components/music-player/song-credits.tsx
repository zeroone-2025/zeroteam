"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { toast } from "sonner";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { Song } from "@/lib/songs-data";

interface SongCreditsProps {
  song: Song;
}

export function SongCredits({ song }: SongCreditsProps) {
  const [copied, setCopied] = useState(false);
  const copyright = song.copyright;

  if (!copyright) return null;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(copyright.safeCode);
    setCopied(true);
    toast.success("SAFE CODE가 클립보드에 복사되었습니다");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>BGM 저작권 정보</DialogTitle>
        <DialogDescription>
          이 곡의 SAFE CODE 및 출처 정보입니다.
        </DialogDescription>
      </DialogHeader>
      <div className="space-y-3 py-2">
        <div>
          <p className="text-xs text-muted-foreground">원곡 제목</p>
          <p className="font-medium">{copyright.originalTitle}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">작곡가</p>
          <p className="font-medium">{copyright.composer}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">SAFE CODE</p>
          <div className="mt-1 flex items-center gap-2">
            <code className="flex-1 rounded bg-muted px-3 py-2 font-mono text-sm">
              {copyright.safeCode}
            </code>
            <Button variant="outline" size="icon-sm" onClick={handleCopy}>
              {copied ? (
                <Check className="size-4" />
              ) : (
                <Copy className="size-4" />
              )}
            </Button>
          </div>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">출처</p>
          <p className="font-medium">{copyright.source}</p>
        </div>
      </div>
    </DialogContent>
  );
}
