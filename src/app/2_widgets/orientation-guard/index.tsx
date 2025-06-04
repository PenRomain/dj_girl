"use client";

import { ReactNode, useEffect, useState } from "react";
import styles from "./orientation-guard.module.css";

// function LockOrientationButton() {
//   async function lock() {
//     try {
//       console.log(
//         "%csrc/app/2_widgets/orientation-guard/index.tsx:9 screen.orientation",
//         "color: #007acc;",
//         screen.orientation,
//       );
//       if (screen.orientation?.lock) {
//         const res = await screen.orientation.lock("portrait");
//         console.log(
//           "%csrc/app/2_widgets/orientation-guard/index.tsx:12 res",
//           "color: #007acc;",
//           res,
//         );
//       }
//     } catch {
//       /* игнорируем ошибки */
//     }
//   }

//   return (
//     <button onClick={lock} style={{ display: "none" }} id="orientation-lock" />
//   );
// }

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
      {children}
      {landscape && (
        <div className={styles.overlay}>
          <p>Поверните устройство ↻</p>
        </div>
      )}
    </>
  );
}
