"use client";

import { useAppDispatch } from "@/shared/store/hooks";
import {
  googleApi,
  useGetDriveManifestQuery,
  useGetSheetsManifestQuery,
} from "@/shared/store/services/google";
import Spinner from "@/shared/uikit/spinner";
import { ReactNode, useEffect, useState } from "react";
import styles from "./prefetch.module.css";

export function Prefetch({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch();
  const { data: manifest, isLoading } = useGetDriveManifestQuery();
  const { isLoading: sheetsIsLoading } = useGetSheetsManifestQuery();
  const [tracksLoaded, setTracksLoaded] = useState(false);

  useEffect(() => {
    if (!manifest?.tracks) return;
    const trackEntries = Object.values(manifest.tracks);
    if (trackEntries.length === 0) {
      setTracksLoaded(true);
      return;
    }
    const promises = trackEntries.map((t) =>
      dispatch(googleApi.endpoints.getTrack.initiate(t.name)).unwrap(),
    );
    Promise.all(promises).finally(() => {
      setTracksLoaded(true);
    });
  }, [manifest, dispatch]);

  if (!manifest || isLoading || sheetsIsLoading || !tracksLoaded)
    return (
      <div className={styles.spinnerWrap}>
        <Spinner />
      </div>
    );
  return <>{children}</>;
}
