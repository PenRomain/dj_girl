import type { Metadata } from "next";
import { Montserrat, Montserrat_Subrayada } from "next/font/google";
import "./globals.css";
import { ReactNode } from "react";
import StoreProvider from "./4_shared/store/store-provider";
import cx from "clsx";
import { OrientationGuard } from "./2_widgets/orientation-guard";
import { Prefetch } from "./2_widgets/prefetch";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

const montserratSubrayada = Montserrat_Subrayada({
  variable: "--font-montserrat-subrayada",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dubai",
  description: "Visual novel",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const list: string[] = await fetch(
    "http://localhost:3000/api/assets-list",
  ).then((r) => r.json());

  const preloadLinks = list
    .filter((l) => l.includes("png"))
    .map((name) => {
      const url = `/ivhid_src/${encodeURIComponent(name)}`;
      return `/_next/image?url=${encodeURIComponent(url)}&w=640&q=100`;
    });

  return (
    <html lang="en">
      {preloadLinks.map((href) => (
        <link key={href} rel="preload" as="image" href={href} />
      ))}
      <body className={cx(montserrat.variable, montserratSubrayada.variable)}>
        <OrientationGuard>
          <StoreProvider>
            <Prefetch>{children}</Prefetch>
          </StoreProvider>
        </OrientationGuard>
      </body>
    </html>
  );
}
