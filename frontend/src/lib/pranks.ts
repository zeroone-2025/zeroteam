export type PrankMode = "FAKE_PLAY" | "SPEED_CHANGE" | "WRONG_SONG";

const PRANK_MODES: PrankMode[] = ["FAKE_PLAY", "SPEED_CHANGE", "WRONG_SONG"];

export function selectPrank(): PrankMode {
  return PRANK_MODES[Math.floor(Math.random() * PRANK_MODES.length)];
}

const SPEED_OPTIONS = [0.25, 0.3, 0.5, 1.5, 2.0, 2.5, 3.0];

export function getSpeedChangeRate(): number {
  return SPEED_OPTIONS[Math.floor(Math.random() * SPEED_OPTIONS.length)];
}

export function getWrongSongIndex(currentIndex: number, totalSongs: number): number {
  let idx = Math.floor(Math.random() * (totalSongs - 1));
  if (idx >= currentIndex) idx++;
  return idx;
}

const FAKE_PLAY_MESSAGES = [
  "🎵 무손실 음질로 재생 중... (아마도)",
  "🔇 AI가 최적의 음량을 계산 중입니다...",
  "🎧 서버 햄스터가 열심히 달리고 있습니다",
  "🔊 프리미엄 사운드 엔진 로딩 중...",
  "🎶 당신의 귀를 위한 최고의 침묵을 준비 중",
];

const SPEED_CHANGE_MESSAGES = [
  "⚡ AI가 당신에게 최적의 속도를 추천합니다!",
  "🎵 새로운 음악 경험을 제공합니다",
  "🚀 속도 최적화 완료! (누가 요청했지?)",
  "🐌 여유로운 감상 모드 활성화",
  "🎼 당신만을 위한 커스텀 템포!",
];

const WRONG_SONG_MESSAGES = [
  "🎯 AI가 당신의 취향을 분석해 추천한 곡입니다",
  "🎵 이 곡이 더 좋을 거예요, 우리를 믿으세요",
  "🤖 개인 맞춤 추천 알고리즘 가동 중",
  "✨ 프리미엄 셔플: 기대하지 않은 곡을 선사합니다",
  "🎶 오늘의 깜짝 추천곡!",
];

export function getPrankMessage(mode: PrankMode): string {
  const messages =
    mode === "FAKE_PLAY"
      ? FAKE_PLAY_MESSAGES
      : mode === "SPEED_CHANGE"
        ? SPEED_CHANGE_MESSAGES
        : WRONG_SONG_MESSAGES;
  return messages[Math.floor(Math.random() * messages.length)];
}
