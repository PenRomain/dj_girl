"use client";

import { ReactNode, useEffect, useState } from "react";
import styles from "./orientation-guard.module.css";
import { isDev } from "@/shared/types";

export function OrientationGuard({ children }: { children: ReactNode }) {
  const [landscape, setLandscape] = useState(false);

  useEffect(() => {
    if (isDev) return;
    const m = window.matchMedia("(orientation: landscape)");
    const handler = () => setLandscape(m.matches);
    handler();
    m.addEventListener("change", handler);
    return () => m.removeEventListener("change", handler);
  }, []);

  if (isDev) return <>{children}</>;
  return (
    <>
      {children}
      {landscape && (
        <div className={styles.overlay}>
          <p>Поверните устройство ↻</p>
        </div>
      )}
    </>
  );
}
