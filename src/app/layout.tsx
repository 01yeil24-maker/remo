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
        {/* Apple 기기에서는 시스템 서체(SF Pro / Apple SD Gothic Neo)를 쓰고,
            그 외 환경에서는 Pretendard를 내려받아 같은 인상을 유지합니다. */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
      </head>
      <body className="min-h-full flex flex-col bg-brand-yellow text-brand-ink antialiased">
        {children}
      </body>
    </html>
  );
}
