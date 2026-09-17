import SiteHeader from "@/components/SiteHeader";
import { galleryPhotos } from "@/lib/data";

export default function GalleryPage() {
  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader active="Gallery" />
      <main className="flex flex-1 flex-col gap-10 px-6 py-12 sm:px-10 sm:py-16">
        <div>
          <p className="font-display text-sm uppercase tracking-widest text-brand-orange">
            Gallery
          </p>
          <h1 className="mt-3 font-display text-4xl text-brand-ink sm:text-5xl">
            사진으로 보는 REMO
          </h1>
          <p className="mt-2 max-w-lg text-sm text-brand-ink/70">
            지금은 자리를 채운 예시 사진이에요. Vercel Blob에 실제 사진을 올리면 이 자리에 표시됩니다.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {galleryPhotos.map((photo) => (
            <div
              key={photo.id}
              className="flex aspect-square items-center justify-center rounded-lg border border-brand-line bg-white/60 text-xs tracking-wide text-brand-ink/50"
            >
              {photo.caption} · {photo.id}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
