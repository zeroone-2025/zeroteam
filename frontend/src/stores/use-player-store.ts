"use client";

import { create } from "zustand";
import { type Song, SONGS } from "@/lib/songs-data";
import {
  type PrankMode,
  type ScreenEffect,
  selectPrank,
  getSpeedChangeRate,
  getWrongSongIndex,
  getScreenEffect,
  getPrankMessage,
} from "@/lib/pranks";

export interface PrankHistoryEntry {
  mode: PrankMode;
  message: string;
  songTitle: string;
  timestamp: number;
}

interface PlayerState {
  playlist: Song[];
  currentSongIndex: number;
  isPlaying: boolean;
  progress: number; // 0-100
  volume: number; // 0-1
  currentPrankMode: PrankMode | null;
  playbackSpeed: number;
  actualPlayingSongIndex: number;
  prankCount: number;
  lastPrankMessage: string;
  isLoading: boolean;
  prankHistory: PrankHistoryEntry[];
  wrongSongRevealed: boolean;
  speedRevealed: boolean;
  ghostVolumeAttempts: number;
  screenEffect: ScreenEffect | null;
  screenEffectRevealed: boolean;

  play: () => void;
  pause: () => void;
  nextSong: () => void;
  prevSong: () => void;
  selectSong: (index: number) => void;
  setVolume: (v: number) => void;
  setProgress: (p: number) => void;
  tick: () => void;
  shufflePlaylist: () => void;
  setPlaylist: (songs: Song[]) => void;
  revealWrongSong: () => void;
  revealSpeed: () => void;
  incrementGhostAttempts: () => void;
  revealScreenEffect: () => void;
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  playlist: SONGS,
  currentSongIndex: 0,
  isPlaying: false,
  progress: 0,
  volume: 0.5,
  currentPrankMode: null,
  playbackSpeed: 1.0,
  actualPlayingSongIndex: 0,
  prankCount: 0,
  lastPrankMessage: "",
  isLoading: false,
  prankHistory: [],
  wrongSongRevealed: false,
  speedRevealed: false,
  ghostVolumeAttempts: 0,
  screenEffect: null,
  screenEffectRevealed: false,

  play: () => {
    const state = get();
    const prank = selectPrank();
    let actualIndex = state.currentSongIndex;
    let speed = 1.0;
    let effect: ScreenEffect | null = null;

    if (prank === "SPEED_CHANGE") {
      speed = getSpeedChangeRate();
    } else if (prank === "WRONG_SONG") {
      actualIndex = getWrongSongIndex(
        state.currentSongIndex,
        state.playlist.length
      );
    } else if (prank === "SCREEN_PRANK") {
      effect = getScreenEffect();
    }

    const message = getPrankMessage(prank);

    set({
      isLoading: true,
    });

    const songTitle = state.playlist[state.currentSongIndex]?.title ?? "";

    // Fake loading delay
    setTimeout(() => {
      set({
        isPlaying: true,
        isLoading: false,
        currentPrankMode: prank,
        playbackSpeed: speed,
        actualPlayingSongIndex: actualIndex,
        prankCount: state.prankCount + 1,
        lastPrankMessage: message,
        progress: 0,
        wrongSongRevealed: false,
        speedRevealed: false,
        ghostVolumeAttempts: 0,
        screenEffect: effect,
        screenEffectRevealed: false,
        prankHistory: [
          ...state.prankHistory,
          { mode: prank, message, songTitle, timestamp: Date.now() },
        ],
      });
    }, 800 + Math.random() * 1200);
  },

  pause: () => {
    set({ isPlaying: false, wrongSongRevealed: false, speedRevealed: false, ghostVolumeAttempts: 0, screenEffect: null, screenEffectRevealed: false });
  },

  nextSong: () => {
    const state = get();
    const nextIndex = (state.currentSongIndex + 1) % state.playlist.length;
    set({
      currentSongIndex: nextIndex,
      isPlaying: false,
      progress: 0,
      currentPrankMode: null,
      wrongSongRevealed: false,
      speedRevealed: false,
      ghostVolumeAttempts: 0,
    });
  },

  prevSong: () => {
    const state = get();
    const prevIndex =
      (state.currentSongIndex - 1 + state.playlist.length) %
      state.playlist.length;
    set({
      currentSongIndex: prevIndex,
      isPlaying: false,
      progress: 0,
      currentPrankMode: null,
      wrongSongRevealed: false,
      speedRevealed: false,
      ghostVolumeAttempts: 0,
    });
  },

  selectSong: (index: number) => {
    set({
      currentSongIndex: index,
      isPlaying: false,
      progress: 0,
      currentPrankMode: null,
    });
    // Auto-play triggers prank
    setTimeout(() => get().play(), 100);
  },

  setVolume: (v: number) => {
    const state = get();
    if (state.currentPrankMode === "FAKE_PLAY" && state.isPlaying) {
      // Volume slider is "haunted" - don't actually change volume
      set({ ghostVolumeAttempts: state.ghostVolumeAttempts + 1 });
      return;
    }
    set({ volume: v });
  },

  setProgress: (p: number) => {
    set({ progress: p });
  },

  tick: () => {
    const state = get();
    if (!state.isPlaying) return;

    const song = state.playlist[state.currentSongIndex];
    if (!song) return;

    const increment = (100 / song.duration) * 0.1 * state.playbackSpeed;
    let newProgress = state.progress + increment;

    // FAKE_PLAY: occasionally go backwards
    if (state.currentPrankMode === "FAKE_PLAY" && Math.random() < 0.03) {
      newProgress = Math.max(0, state.progress - 3);
    }

    if (newProgress >= 100) {
      // Song "ended", go to next
      set({ isPlaying: false, progress: 0 });
      get().nextSong();
      return;
    }

    set({ progress: newProgress });
  },

  shufflePlaylist: () => {
    const state = get();
    const reversed = [...state.playlist].reverse();
    set({ playlist: reversed });
  },

  setPlaylist: (songs: Song[]) => {
    set({ playlist: songs });
  },

  revealWrongSong: () => {
    set({ wrongSongRevealed: true });
  },

  revealSpeed: () => {
    set({ speedRevealed: true });
  },

  incrementGhostAttempts: () => {
    set((state) => ({ ghostVolumeAttempts: state.ghostVolumeAttempts + 1 }));
  },

  revealScreenEffect: () => {
    set({ screenEffectRevealed: true, screenEffect: null });
  },
}));
