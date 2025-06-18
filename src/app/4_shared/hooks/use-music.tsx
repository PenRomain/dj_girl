"use client";

import { useEffect, useRef } from "react";
import {
  useGetDriveManifestQuery,
  useGetTrackQuery,
} from "@/shared/store/services/google";
import { useGameState } from "../context/game-context";

export function useMusic() {
  const [state] = useGameState();
  const { data: manifest } = useGetDriveManifestQuery();

  const musicVars = (state.variables?.Music ?? {}) as Record<string, boolean>;
  console.log(
    "%csrc/app/4_shared/hooks/use-music.tsx:15 musicVars",
    "color: #007acc;",
    musicVars,
  );
  const trackKey = Object.entries(musicVars).find(([, on]) => on)?.[0] ?? null;
  console.log(
    "%csrc/app/4_shared/hooks/use-music.tsx:16 trackKey",
    "color: #007acc;",
    trackKey,
  );
  const trackFileName = trackKey ? `${trackKey}.ogg` : null;
  const trackEntry = trackFileName
    ? manifest?.tracks[trackFileName]
    : undefined;
  const trackName = trackEntry?.name;

  const {
    data: url,
    isSuccess,
    isLoading,
    error,
  } = useGetTrackQuery(trackName ?? "", {
    skip: !trackName,
  });

  const audioRef = useRef<HTMLAudioElement>(new Audio());
  const prevUrlRef = useRef<string | null>(null);

  useEffect(() => {
    if (!isSuccess || !url || url === prevUrlRef.current) return;

    prevUrlRef.current = url;
    const audio = audioRef.current;
    audio.pause();
    audio.src = url;
    audio.loop = true;
    audio.currentTime = 0;
    audio.play().catch(console.error);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [isSuccess, url]);

  useEffect(() => {
    return () => {
      audioRef.current.pause();
    };
  }, []);
}
