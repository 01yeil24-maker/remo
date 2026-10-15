import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { SESSION, formatWon } from "@/lib/sauna-config";
import LeadForm from "./LeadForm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "사우나 치맥 | REMO",
  description: "처음 만나는 사람들과 땀 빼고 치맥 한 잔. REMO가 여는 3시간짜리 소셜 세션.",
};

const reasons = [
  {
    no: "01",
    title: "땀 흘리면 말이 쉬워진다",
    body: "찜질복은 직업도 연봉도 지웁니다. 다들 똑같은 옷을 입고 있으면 첫 마디를 꺼내기가 훨씬 쉬워져요.",
  },
  {
    no: "02",
    title: "폰을 두고 온다",
    body: "찜질복에는 주머니가 없습니다. 어색하다고 화면을 들여다볼 수가 없으니, 결국 옆 사람과 이야기하게 됩니다.",
  },
  {
    no: "03",
    title: "끝이 정해져 있다",
    body: "3시간이면 끝납니다. 언제 일어나야 하나 눈치 볼 일이 없어서 오히려 편하게 남아 있게 돼요.",
  },
];

const timeline = [
  { time: "19:00", title: "체크인", body: "닉네임 스티커를 붙이고 오늘의 규칙을 함께 읽습니다.", min: "15분" },
  { time: "19:15", title: "불가마 1라운드", body: "5분씩 두 번. 중간에 나와서 식히며 자연스럽게 대화가 시작됩니다.", min: "35분" },
  { time: "19:50", title: "휴게실 토크", body: "질문 카드를 가지고 4명씩 두 조로 나눠 앉습니다.", min: "30분" },
  { time: "20:20", title: "샤워 · 환복", body: "각자 씻고 옷을 갈아입은 뒤 입구에서 모입니다.", min: "20분" },
  { time: "20:40", title: "치맥", body: "도보 5분 호프집. 중간에 한 번 자리를 바꿔 모두와 이야기합니다.", min: "70분" },
  { time: "21:50", title: "마무리", body: "연락처 교환은 전적으로 자율입니다. 호스트가 정리하고 해산.", min: "10분" },
];

const included = [
  "찜질방 입장료",
  "찜질복 · 수건",
  "치킨 (4인당 1마리)",
  "생맥주 2잔 (무알콜 선택 가능)",
  "호스트 진행 · 아이스브레이킹 키트",
  "질문 카드 세트",
];

const rules = [
  { title: "실명 확인 후 입장", body: `예약 시 본인 확인을 하고, 노쇼 방지 보증금 ${formatWon(SESSION.deposit)}은 참석하면 그대로 돌려드립니다.` },
  { title: "목욕탕은 각자, 모임은 공용 공간에서", body: "남녀 목욕탕은 당연히 따로입니다. 함께 있는 시간은 찜질복을 입은 공용 공간에서만 진행해요." },
  { title: "술 권하지 않기", body: "잔을 채워주는 문화 없습니다. 무알콜이나 음료로 바꿔도 가격은 같아요." },
  { title: "연락처는 먼저 요구하지 않기", body: "원하는 사람이 직접 건네는 것만 허용합니다. 호스트가 끝까지 자리에 함께 있습니다." },
];

const faqs = [
  { q: "혼자 가도 되나요?", a: "네. 혼자 오는 것을 기준으로 설계한 세션입니다. 호스트가 첫 대화를 붙여드리고, 질문 카드로 자연스럽게 이어집니다." },
  { q: "사우나가 부담스러우면요?", a: "불가마 라운드는 선택입니다. 휴게실 토크부터 합류하셔도 되고, 중간에 나와서 쉬셔도 괜찮습니다." },
  { q: "성비는 어떻게 되나요?", a: `${SESSION.capacity}명을 남녀 절반씩 모집합니다. 한쪽이 모자라면 날짜를 미루고, 미리 안내드립니다.` },
  { q: "술을 못 마셔요.", a: "무알콜 맥주나 음료로 바꿔드리고 가격은 동일합니다. 치킨은 그대로 드셔도 됩니다." },
  { q: "환불이 되나요?", a: "세션 3일 전까지는 전액 환불입니다. 그 이후에는 대체 참석자를 찾아드리거나 다음 회차로 옮겨드립니다." },
];

export default function SaunaChimaekPage() {
  return (
    <div className="sauna-landing flex flex-1 flex-col bg-[var(--ink)] text-amber-50">
      {/* 상단 바 */}
      <div className="absolute inset-x-0 top-0 z-20">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5 sm:px-10">
          <Link href="/" className="shrink-0">
            <Image
              src="/logo.png"
              alt="REMO"
              width={96}
              height={96}
              className="h-7 w-auto brightness-0 invert"
            />
          </Link>
          <a
            href="#apply"
            className="rounded-full border border-white/25 px-4 py-2 text-[13px] font-semibold text-amber-50 transition-colors hover:border-[var(--ember)] hover:text-[var(--ember)] sm:text-[14px]"
          >
            참여 의향 남기기
          </a>
        </div>
      </div>

      {/* 히어로 */}
      <section className="relative isolate flex min-h-[88vh] items-end overflow-hidden">
        <Image
          src="/sauna/hero.jpg"
          alt="찜질복을 입고 둘러앉아 이야기하는 사람들"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--ink)] via-[var(--ink)]/75 to-[var(--ink)]/30" />
        <div className="relative mx-auto w-full max-w-6xl px-6 pb-16 sm:px-10 sm:pb-24">
          <p className="text-[13px] font-semibold tracking-[0.18em] text-[var(--ember)]">
            REMO SESSION 01
          </p>
          <h1 className="mt-5 text-[44px] font-bold leading-[1.1] tracking-[-0.04em] sm:text-[72px] lg:text-[88px]">
            사우나 치맥
          </h1>
          <p className="mt-5 max-w-xl text-[18px] leading-[1.6] text-amber-50/80 sm:text-[22px]">
            {SESSION.tagline}
            <br />
            처음 만나는 {SESSION.capacity}명이 같이 땀 빼고, 치킨에 맥주 한 잔 하고 헤어지는 3시간.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <a
              href="#apply"
              className="rounded-full bg-[var(--ember)] px-7 py-3.5 text-[16px] font-bold text-[#1a1208] transition-opacity hover:opacity-90"
            >
              열리면 알려주세요
            </a>
            <span className="text-[14px] text-amber-50/55">
              아직 열지 않았습니다 · 반응을 보고 1호 세션을 엽니다
            </span>
          </div>
        </div>
      </section>

      {/* 문제 제기 */}
      <section className="mx-auto w-full max-w-3xl px-6 py-24 text-center sm:px-10 sm:py-32">
        <p className="text-[20px] leading-[1.75] text-amber-50/70 sm:text-[26px] sm:leading-[1.7]">
          회사 사람 말고 새로 만난 사람이
          <br className="hidden sm:block" /> 올해 몇 명인가요.
        </p>
        <p className="mt-8 text-[16px] leading-[1.85] text-amber-50/45 sm:text-[17px]">
          모임은 많은데, 명함 돌리는 네트워킹은 피곤하고 소개팅은 부담스럽습니다.
          <br className="hidden sm:block" />
          그냥 편하게 떠들다 헤어질 자리가 의외로 없습니다.
        </p>
      </section>

      {/* 왜 통하나 */}
      <section className="border-y border-white/10 bg-white/[0.03]">
        <div className="mx-auto w-full max-w-6xl px-6 py-20 sm:px-10 sm:py-28">
          <h2 className="text-[28px] font-bold tracking-[-0.03em] sm:text-[38px]">
            왜 하필 사우나에서 만나나
          </h2>
          <div className="mt-12 grid gap-10 sm:grid-cols-3 sm:gap-8">
            {reasons.map((reason) => (
              <div key={reason.no}>
                <div className="text-[13px] font-bold tracking-[0.1em] text-[var(--ember)]">
                  {reason.no}
                </div>
                <h3 className="mt-4 text-[20px] font-bold tracking-[-0.02em]">{reason.title}</h3>
                <p className="mt-3 text-[15px] leading-[1.8] text-amber-50/55">{reason.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 세션 흐름 */}
      <section className="mx-auto w-full max-w-6xl px-6 py-20 sm:px-10 sm:py-28">
        <div className="grid gap-14 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
          <div>
            <h2 className="text-[28px] font-bold tracking-[-0.03em] sm:text-[38px]">
              3시간, 이렇게 흘러갑니다
            </h2>
            <p className="mt-4 text-[15px] leading-[1.8] text-amber-50/55">
              어색한 순간이 생기지 않도록 분 단위로 짜두었습니다. 호스트가 처음부터 끝까지
              함께합니다.
            </p>
            <div className="relative mt-10 overflow-hidden rounded-3xl">
              <Image
                src="/sauna/bulgama.jpg"
                alt="불가마 입구"
                width={1264}
                height={848}
                sizes="(max-width: 1024px) 100vw, 520px"
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          <ol className="flex flex-col">
            {timeline.map((step, index) => (
              <li
                key={step.time}
                className="flex gap-5 border-t border-white/10 py-6 first:border-t-0 first:pt-0"
              >
                <div className="w-16 shrink-0 pt-0.5">
                  <div className="font-mono text-[15px] font-bold text-[var(--ember)]">
                    {step.time}
                  </div>
                  <div className="mt-1 text-[12px] text-amber-50/35">{step.min}</div>
                </div>
                <div>
                  <h3 className="text-[18px] font-bold tracking-[-0.02em]">
                    {index + 1}. {step.title}
                  </h3>
                  <p className="mt-2 text-[15px] leading-[1.75] text-amber-50/55">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 가격 */}
      <section className="border-y border-white/10 bg-white/[0.03]">
        <div className="mx-auto grid w-full max-w-6xl gap-12 px-6 py-20 sm:px-10 sm:py-28 lg:grid-cols-[1.1fr_1fr] lg:items-center">
          <div className="relative overflow-hidden rounded-3xl">
            <Image
              src="/sauna/chimaek.jpg"
              alt="치킨과 맥주로 건배하는 모습"
              width={1264}
              height={848}
              sizes="(max-width: 1024px) 100vw, 560px"
              className="h-full w-full object-cover"
            />
          </div>

          <div>
            <h2 className="text-[28px] font-bold tracking-[-0.03em] sm:text-[38px]">
              한 번에 다 포함해서
            </h2>
            <div className="mt-6 flex flex-wrap items-baseline gap-4">
              <span className="text-[44px] font-bold tracking-[-0.04em] text-[var(--ember)] sm:text-[56px]">
                {formatWon(SESSION.priceEarly)}
              </span>
              <span className="text-[18px] text-amber-50/40 line-through">
                {formatWon(SESSION.priceRegular)}
              </span>
              <span className="rounded-full bg-[var(--ember)]/15 px-3 py-1 text-[13px] font-semibold text-[var(--ember)]">
                1호 세션 한정
              </span>
            </div>
            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {included.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-[15px] text-amber-50/70">
                  <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--ember)]" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-8 text-[14px] leading-[1.7] text-amber-50/40">
              정원 {SESSION.capacity}명 (남녀 절반씩) · 서울 · 약 {SESSION.durationHours}시간 ·
              노쇼 보증금 {formatWon(SESSION.deposit)}은 참석 시 환급
            </p>
          </div>
        </div>
      </section>

      {/* 안심 규칙 */}
      <section className="mx-auto w-full max-w-6xl px-6 py-20 sm:px-10 sm:py-28">
        <h2 className="text-[28px] font-bold tracking-[-0.03em] sm:text-[38px]">
          이것부터 정하고 시작합니다
        </h2>
        <p className="mt-4 max-w-xl text-[15px] leading-[1.8] text-amber-50/55">
          처음 만나는 사람들과 사우나에 간다는 게 걱정되는 게 당연합니다. 걱정되는 지점을 먼저
          규칙으로 못 박아 뒀어요.
        </p>
        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {rules.map((rule, index) => (
            <div
              key={rule.title}
              className="rounded-2xl border border-white/12 bg-white/[0.04] p-6 sm:p-7"
            >
              <div className="text-[12px] font-bold tracking-[0.1em] text-[var(--ember)]">
                RULE {String(index + 1).padStart(2, "0")}
              </div>
              <h3 className="mt-3 text-[18px] font-bold tracking-[-0.02em]">{rule.title}</h3>
              <p className="mt-2.5 text-[15px] leading-[1.75] text-amber-50/55">{rule.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-white/10">
        <div className="mx-auto w-full max-w-3xl px-6 py-20 sm:px-10 sm:py-28">
          <h2 className="text-[28px] font-bold tracking-[-0.03em] sm:text-[38px]">자주 묻는 것</h2>
          <div className="mt-10">
            {faqs.map((faq) => (
              <details key={faq.q} className="group border-b border-white/10 py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[17px] font-semibold tracking-[-0.02em] marker:hidden">
                  {faq.q}
                  <span
                    aria-hidden
                    className="shrink-0 text-[22px] font-light text-[var(--ember)] transition-transform group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="mt-3 text-[15px] leading-[1.8] text-amber-50/55">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* 폼 */}
      <section id="apply" className="scroll-mt-10 border-t border-white/10 bg-white/[0.03]">
        <div className="mx-auto w-full max-w-3xl px-6 py-20 sm:px-10 sm:py-28">
          <p className="text-[13px] font-semibold tracking-[0.1em] text-[var(--ember)]">
            BEFORE WE OPEN
          </p>
          <h2 className="mt-4 text-[30px] font-bold leading-[1.25] tracking-[-0.03em] sm:text-[42px]">
            열어도 될지, 당신이 정해주세요
          </h2>
          <p className="mt-5 text-[16px] leading-[1.8] text-amber-50/55">
            아직 1호 세션을 열기 전입니다. 참여 의향과 고칠 점을 모아서, 올 사람이 실제로 원하는
            모양으로 만들고 열려고 합니다. 결제 없이 1분이면 끝나요.
          </p>
          <div className="mt-12">
            <LeadForm />
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 px-6 py-10 text-center text-[13px] text-amber-50/35">
        © 2026 REMO · 사우나 치맥 세션
      </footer>
    </div>
  );
}
