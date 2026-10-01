import SiteHeader from "@/components/SiteHeader";
import { galleryPhotos } from "@/lib/data";

export default function GalleryPage() {
  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader active="Gallery" />
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-14 sm:px-10 sm:py-20">
        <p className="text-[13px] font-semibold tracking-[0.06em] text-brand-orange">GALLERY</p>
        <h1 className="mt-4 text-[30px] font-bold sm:text-[40px]">사진으로 보는 REMO</h1>
        <p className="mt-3 max-w-lg text-[14px] leading-[1.7] text-brand-ink/60">
          지금은 자리를 채운 예시예요. Vercel Blob에 실제 사진을 올리면 이 자리에 표시됩니다.
        </p>

        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
          {galleryPhotos.map((photo) => (
            <div
              key={photo.id}
              className="flex aspect-square items-center justify-center rounded-xl border border-brand-line bg-white/70 text-[13px] font-medium text-brand-ink/35"
            >
              {photo.caption} {photo.id}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
