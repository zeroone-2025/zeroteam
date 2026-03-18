// ===========================================
// 시연 영상 촬영용 데모 모드
// 삭제 방법:
//   1. 이 폴더(src/demo/) 삭제
//   2. use-player-store.ts에서 "// DEMO:" 주석이 달린 줄 3개 삭제
// 활성화: 브라우저 콘솔에서 localStorage.setItem('demo', '1') 입력 후 새로고침
// 비활성화: localStorage.removeItem('demo')
// ===========================================

import type { PrankMode, ScreenEffect } from "@/lib/pranks";

export interface DemoStep {
  prank: PrankMode;
  effect?: ScreenEffect;
  speed?: number;
}

// 노래를 누를 때마다 순서대로 하나씩 나옴
const DEMO_SEQUENCE: DemoStep[] = [
  { prank: "FAKE_PLAY" },
  { prank: "SPEED_CHANGE", speed: 0.25 },
  { prank: "WRONG_SONG" },
  { prank: "SCREEN_PRANK", effect: "FLIP" },
  { prank: "SCREEN_PRANK", effect: "INVERT" },
  { prank: "SCREEN_PRANK", effect: "SHAKE" },
  { prank: "SCREEN_PRANK", effect: "RAINBOW" },
  { prank: "SCREEN_PRANK", effect: "BLUR" },
  { prank: "SCREEN_PRANK", effect: "TILT" },
  { prank: "SPEED_CHANGE", speed: 3.0 },
];

let demoIndex = 0;

export function isDemoMode(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem("demo") === "1";
}

export function getDemoStep(): DemoStep {
  const step = DEMO_SEQUENCE[demoIndex % DEMO_SEQUENCE.length];
  demoIndex++;
  return step;
}

export function resetDemo(): void {
  demoIndex = 0;
}

export function getDemoSequenceLength(): number {
  return DEMO_SEQUENCE.length;
}
