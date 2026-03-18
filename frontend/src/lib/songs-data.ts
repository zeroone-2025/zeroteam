export interface Song {
  id: string;
  title: string;
  artist: string;
  duration: number; // seconds
  albumEmoji: string;
  albumGradient: string;
  toneFrequency: number;
  tonePattern: number[]; // sequence of note durations in ms
}

export const SONGS: Song[] = [
  {
    id: "1",
    title: "월급은 어디로 갔을까",
    artist: "DJ 통장잔고",
    duration: 213,
    albumEmoji: "💸",
    albumGradient: "from-yellow-400 to-orange-500",
    toneFrequency: 440,
    tonePattern: [200, 100, 200, 100, 400],
  },
  {
    id: "2",
    title: "야근 블루스",
    artist: "퇴근하고싶은 사람들",
    duration: 247,
    albumEmoji: "🌙",
    albumGradient: "from-indigo-500 to-purple-600",
    toneFrequency: 330,
    tonePattern: [400, 200, 400, 200, 200],
  },
  {
    id: "3",
    title: "버그 없는 코드 (판타지)",
    artist: "Ctrl+Z",
    duration: 198,
    albumEmoji: "🐛",
    albumGradient: "from-green-400 to-emerald-600",
    toneFrequency: 523,
    tonePattern: [150, 150, 300, 150, 150, 300],
  },
  {
    id: "4",
    title: "배달 앱을 켜지 마세요",
    artist: "다이어트 실패단",
    duration: 232,
    albumEmoji: "🍕",
    albumGradient: "from-red-400 to-pink-500",
    toneFrequency: 392,
    tonePattern: [300, 100, 300, 100, 200, 200],
  },
  {
    id: "5",
    title: "월요일이 싫어요",
    artist: "MC 주말",
    duration: 265,
    albumEmoji: "😫",
    albumGradient: "from-gray-400 to-slate-600",
    toneFrequency: 349,
    tonePattern: [500, 200, 500, 200],
  },
  {
    id: "6",
    title: "커피가 없으면 나도 없다",
    artist: "카페인 중독자들",
    duration: 189,
    albumEmoji: "☕",
    albumGradient: "from-amber-600 to-yellow-800",
    toneFrequency: 587,
    tonePattern: [100, 100, 100, 300, 100, 100, 100, 300],
  },
  {
    id: "7",
    title: "와이파이를 찾아서",
    artist: "LTE 난민",
    duration: 221,
    albumEmoji: "📶",
    albumGradient: "from-blue-400 to-cyan-500",
    toneFrequency: 494,
    tonePattern: [200, 200, 400, 200, 200],
  },
  {
    id: "8",
    title: "이불 밖은 위험해",
    artist: "집순이 & 집돌이",
    duration: 256,
    albumEmoji: "🛏️",
    albumGradient: "from-pink-300 to-purple-400",
    toneFrequency: 415,
    tonePattern: [400, 400, 200, 200, 400],
  },
  {
    id: "9",
    title: "알람을 꺼줘 (ft. 5분만)",
    artist: "DJ 스누즈",
    duration: 203,
    albumEmoji: "⏰",
    albumGradient: "from-orange-400 to-red-500",
    toneFrequency: 554,
    tonePattern: [100, 100, 200, 100, 100, 200, 400],
  },
  {
    id: "10",
    title: "오늘의 점심 뭐 먹지",
    artist: "선택장애 보이즈",
    duration: 241,
    albumEmoji: "🤔",
    albumGradient: "from-teal-400 to-green-500",
    toneFrequency: 466,
    tonePattern: [300, 300, 200, 200, 300],
  },
];
