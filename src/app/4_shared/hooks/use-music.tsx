"use client";

import { useEffect, useRef } from "react";
import { useAppSelector } from "@/shared/store/hooks";
import { useGameState } from "../context/game-context";
import { googleApi, useGetDriveManifestQuery } from "../store/services/google";

export function useMusic() {
  const [state] = useGameState();
  const { data: manifest } = useGetDriveManifestQuery();

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentKeyRef = useRef<string | null>(null);
  const prevMusicRef = useRef<Record<string, boolean> | null>(null);

  let trackKey: string | null = null;
  {
    const vars = state.variables?.Music as Record<string, boolean> | undefined;
    if (vars) {
      trackKey = Object.keys(vars).find((k) => vars[k]) ?? null;
      prevMusicRef.current = vars;
    }
  }

  const url = useAppSelector((state) => {
    if (!trackKey || !manifest) return undefined;
    const name = manifest.tracks[`${trackKey}.ogg`].name;

    if (!name) return undefined;

    return googleApi.endpoints.getTrack.select(name)(state)?.data;
  });

  useEffect(() => {
    if (!url || trackKey === currentKeyRef.current) return;
    currentKeyRef.current = trackKey!;

    if (!audioRef.current) audioRef.current = new Audio();
    const audio = audioRef.current;

    if (!audio.paused) audio.pause();
    audio.src = url;
    audio.loop = true;
    audio.currentTime = 0;
    audio.play().catch(console.error);

    return () => URL.revokeObjectURL(url);
  }, [url, trackKey]);
}
