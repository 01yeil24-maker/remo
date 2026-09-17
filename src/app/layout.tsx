import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "REMO",
  description: "한계 없는 버전의 팀, REMO 홈페이지",
  icons: {
    icon: "/icon.png",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* App Router root layout applies to every route, so this is not the single-page
            custom-font case the eslint rule below warns about. */}
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Jua&family=Noto+Sans+KR:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col font-body bg-brand-yellow text-brand-ink antialiased">
        {children}
      </body>
    </html>
  );
}
