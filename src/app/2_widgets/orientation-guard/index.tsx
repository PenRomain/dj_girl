"use client";

import { ReactNode, useEffect, useState } from "react";
import styles from "./orientation-guard.module.css";

export function OrientationGuard({ children }: { children: ReactNode }) {
  const [landscape, setLandscape] = useState(false);

  useEffect(() => {
    const m = window.matchMedia("(orientation: landscape)");
    const handler = () => setLandscape(m.matches);
    handler();
    m.addEventListener("change", handler);
    return () => m.removeEventListener("change", handler);
  }, []);

  return (
    <>
      <div className={styles.phoneFrame}>{children}</div>
      {landscape && (
        <div className={styles.overlay}>
          <p>Rotate your device ↻</p>
        </div>
      )}
    </>
  );
}
