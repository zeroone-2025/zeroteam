# 🛠️ 개발 문서 — I'M KING

> 세상에서 가장 쓸데없는 음악 플레이어

## 핵심 기능 (4가지 Prank Mode - 랜덤 선택)

| 모드 | 이름 | 동작 |
|------|------|------|
| FAKE_PLAY | 가짜 재생 | UI는 "재생 중입니다" + 애니메이션이 돌지만 소리가 전혀 안 남 |
| SPEED_CHANGE | 속도 변경 | 노래가 재생되지만 0.25x~3.0x 랜덤 속도로 나옴 (슬롯머신 애니메이션) |
| WRONG_SONG | 엉뚱한 노래 | 사용자가 선택한 곡이 아닌 전혀 다른 곡이 재생됨 (플립카드 공개) |
| SCREEN_PRANK | 🎨 스크린 이펙트 | 화면에 시각 이펙트 적용 — FLIP(뒤집기), INVERT(색상 반전), SHAKE(지진), RAINBOW(무지개), BLUR(안개), TILT(기울어짐) |

## 기술 스택

| 분류 | 기술 | 용도 |
|------|------|------|
| 프레임워크 | Next.js 15 (App Router) | 풀스택 웹 앱 |
| UI | shadcn/ui + Tailwind CSS | 컴포넌트 & 스타일링 |
| 상태 관리 | Zustand | 클라이언트 상태 |
| 서버 상태 | React Query | API 데이터 캐싱 |
| 오디오 | Web Audio API (OscillatorNode) | 외부 파일 없이 톤/멜로디 생성 |
| shadcn/ui | slider, progress, tooltip, badge, card, dialog, input, label, separator, sheet, skeleton, tabs, textarea, sonner(toast) | 플레이어 UI 컴포넌트 |

## 화면 구성

| 페이지 | 경로 | 설명 |
|--------|------|------|
| 메인 (음악 플레이어) | `/` | 단일 페이지에 모든 기능 집중 |

## 컴포넌트 구조

```
src/
├── app/
│   ├── page.tsx                        # 메인 음악 플레이어 페이지
│   └── api/
│       └── songs/route.ts              # GET: 노래 목록 반환
├── components/
│   ├── music-player/
│   │   ├── music-player.tsx            # 메인 래퍼 (오디오 엔진 연결, 타이머 관리)
│   │   ├── now-playing.tsx             # 앨범아트(바이닐 레코드) + 곡정보 + "Premium" 뱃지
│   │   ├── player-controls.tsx         # 재생/일시정지, 이전/다음, 셔플/반복
│   │   ├── progress-bar.tsx            # 진행바 (FAKE_PLAY시 가끔 뒤로 감)
│   │   ├── volume-control.tsx          # 볼륨 슬라이더 ("귀신 볼륨" — 커서 도망 + 유령 이모지)
│   │   ├── playlist.tsx                # 노래 목록 패널
│   │   ├── playlist-item.tsx           # 개별 노래 항목
│   │   ├── speed-slot-machine.tsx      # 속도 변경 슬롯머신 애니메이션
│   │   ├── wrong-song-reveal.tsx       # 엉뚱한 곡 플립카드 공개 애니메이션
│   │   ├── prank-history.tsx           # 프랭크 히스토리 시트 (로그 기록)
│   │   ├── screen-effect.tsx           # 스크린 이펙트 오버레이 (6종)
│   │   ├── song-credits.tsx            # BGM 저작권 정보 다이얼로그
│   │   └── confetti-effect.tsx         # 컨페티 축하 애니메이션
│   └── layout/
│       ├── header.tsx                  # "I'M KING" 브랜딩
│       └── footer.tsx                  # 푸터 컴포넌트
├── hooks/
│   ├── use-songs.ts                    # React Query - GET /api/songs
│   └── use-audio-engine.ts            # Web Audio API 훅
├── stores/
│   └── use-player-store.ts            # Zustand - 플레이어 전체 상태
└── lib/
    ├── audio-engine.ts                # Web Audio API 싱글톤 클래스
    ├── pranks.ts                      # Prank 선택 로직 + 비꼬는 토스트 메시지
    └── songs-data.ts                  # 가짜 노래 데이터 (10곡)
```

## API 설계

| Method | Endpoint | 설명 | 응답 |
|--------|----------|------|------|
| GET | `/api/songs` | 노래 목록 | `Song[]` |

## 노래 데이터 (10곡)

각 곡은 다음 필드를 포함:
- `toneFrequency` — Web Audio API 기본 주파수 (Hz)
- `tonePattern` — 음표 시퀀스 (ms 단위 duration 배열)
- `albumGradient` — 앨범아트 배경 그라데이션 (Tailwind CSS 클래스)
- `copyright?` — 저작권 정보 (일부 곡에 포함)

| 곡명 | 아티스트 | 앨범아트 |
|------|----------|----------|
| 월급은 어디로 갔을까 | DJ 통장잔고 | 💸 |
| 야근 블루스 | 퇴근하고싶은 사람들 | 🌙 |
| 버그 없는 코드 (판타지) | Ctrl+Z | 🐛 |
| 배달 앱을 켜지 마세요 | 다이어트 실패단 | 🍕 |
| 월요일이 싫어요 | MC 주말 | 😫 |
| 커피가 없으면 나도 없다 | 카페인 중독자들 | ☕ |
| 와이파이를 찾아서 | LTE 난민 | 📶 |
| 이불 밖은 위험해 | 집순이 & 집돌이 | 🛏️ |
| 알람을 꺼줘 (ft. 5분만) | DJ 스누즈 | ⏰ |
| 오늘의 점심 뭐 먹지 | 선택장애 보이즈 | 🤔 |

## 재미 요소

| 요소 | 설명 |
|------|------|
| 비꼬는 토스트 | "AI가 최적의 음량을 계산 중...", "서버 햄스터가 열심히 달리고 있습니다" |
| 가짜 로딩 | 재생 전 1~2초 "무손실 음질 변환 중..." |
| Premium 뱃지 | 클릭하면 "결제 시스템이 점검 중입니다 (영원히)" |
| 거짓말 카운터 | "이 플레이어가 거짓말한 횟수: N" |
| 이퀄라이저 | FAKE_PLAY에서도 열심히 움직이지만 소리 없음 |
| 뒤로 가는 진행바 | FAKE_PLAY에서 가끔 progress가 감소 |
| 귀신 볼륨 | 볼륨 슬라이더 커서가 도망 + 유령 이모지 등장 |
| 컨페티 효과 | 특정 이벤트 시 축하 애니메이션 |
| 프랭크 히스토리 | 지금까지 당한 프랭크 로그 기록 (시트) |
| 스크린 이펙트 | SCREEN_PRANK 시 화면 뒤집기/반전/지진/무지개/안개/기울어짐 (6종) |
| 바이닐 레코드 | 앨범아트가 LP 레코드처럼 회전하는 애니메이션 |
