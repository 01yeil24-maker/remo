// 폼 요소 공통 스타일 (서버·클라이언트 컴포넌트 양쪽에서 씁니다)

export const fieldClass =
  "w-full rounded-xl border border-brand-line bg-white px-4 py-3 text-[15px] text-brand-ink outline-none transition-colors placeholder:text-brand-ink/30 focus:border-brand-orange";

export const labelClass = "block text-[14px] font-semibold text-brand-ink/80";

export const primaryButtonClass =
  "rounded-full bg-brand-orange px-6 py-3 text-[15px] font-semibold text-white transition-colors hover:bg-brand-orange-dark disabled:opacity-60";

export const secondaryButtonClass =
  "rounded-full border border-brand-line px-6 py-3 text-[15px] font-medium text-brand-ink/70 transition-colors hover:border-brand-orange hover:text-brand-orange disabled:opacity-60";

export const smallButtonClass =
  "rounded-full px-4 py-2 text-[13px] font-semibold transition-colors disabled:opacity-60";

export const errorClass =
  "rounded-xl bg-brand-orange/10 px-4 py-3 text-[14px] font-medium text-brand-orange";

export const noticeClass =
  "rounded-2xl border border-brand-line bg-white/70 px-6 py-5 text-[14px] leading-[1.7] text-brand-ink/65";
