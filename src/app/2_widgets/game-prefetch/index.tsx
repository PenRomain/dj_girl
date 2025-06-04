"use client";

import { usePrefetchLookAhead } from "@/shared/hooks/use-prefetch-look-ahead";
import { memo, ReactNode } from "react";

export default memo(function GamePrefetch({
  children,
}: {
  children: ReactNode;
}) {
  usePrefetchLookAhead();
  return <>{children}</>;
});
