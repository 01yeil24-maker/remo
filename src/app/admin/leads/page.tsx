import Link from "next/link";
import { redirect } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import { currentUser } from "@/lib/auth";
import { distribution, listLeads, type Lead } from "@/lib/leads";
import { labelOf } from "@/lib/sauna-config";
import { formatDateTime } from "@/lib/format";
import { noticeClass, smallButtonClass } from "@/components/formStyles";
import { setCouponSentAction } from "./actions";

export const dynamic = "force-dynamic";

function Breakdown({ title, rows, total }: { title: string; rows: { value: string; count: number }[]; total: number }) {
  return (
    <div className="rounded-2xl border border-brand-line bg-white/70 p-5">
      <h3 className="text-[14px] font-semibold text-brand-ink/80">{title}</h3>
      {rows.length === 0 ? (
        <p className="mt-3 text-[13px] text-brand-ink/40">응답 없음</p>
      ) : (
        <ul className="mt-3 flex flex-col gap-2">
          {rows.map((row) => (
            <li key={row.value} className="flex items-center justify-between gap-3 text-[13px]">
              <span className="text-brand-ink/70">{labelOf(row.value)}</span>
              <span className="shrink-0 font-semibold text-brand-ink">
                {row.count}
                <span className="ml-1 font-normal text-brand-ink/40">
                  ({Math.round((row.count / total) * 100)}%)
                </span>
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default async function LeadsPage() {
  const me = await currentUser();
  if (!me) redirect("/login");
  if (me.role !== "admin") redirect("/board");

  const leads: Lead[] = await listLeads();
  const total = leads.length;
  const buyNow = leads.filter((lead) => lead.intent === "buy_now").length;
  const surveyed = leads.filter((lead) => lead.surveyDone).length;
  const couponsPending = leads.filter((lead) => lead.couponCode && !lead.couponSent).length;

  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-14 sm:px-10 sm:py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[13px] font-semibold tracking-[0.06em] text-brand-orange">ADMIN</p>
            <h1 className="mt-4 text-[30px] font-bold sm:text-[40px]">사우나 치맥 응답</h1>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/sauna-chimaek"
              className="rounded-full border border-brand-line px-4 py-2 text-[13px] font-medium text-brand-ink/60 transition-colors hover:border-brand-orange hover:text-brand-orange"
            >
              랜딩 페이지 보기
            </Link>
            <a
              href="/admin/leads/export"
              className="rounded-full bg-brand-orange px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-brand-orange-dark"
            >
              CSV 내려받기
            </a>
          </div>
        </div>

        {total === 0 ? (
          <p className={`${noticeClass} mt-10`}>아직 응답이 없어요.</p>
        ) : (
          <>
            <div className="mt-10 grid gap-4 sm:grid-cols-4">
              {[
                { label: "전체 응답", value: `${total}건` },
                { label: "바로 신청 의향", value: `${buyNow}명` },
                { label: "설문 완료", value: `${surveyed}명` },
                { label: "쿠폰 미발송", value: `${couponsPending}건` },
              ].map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-brand-line bg-white/70 p-5">
                  <div className="text-[13px] text-brand-ink/55">{stat.label}</div>
                  <div className="mt-1 text-[26px] font-bold tracking-[-0.02em] text-brand-orange">
                    {stat.value}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Breakdown title="참여 의향" rows={distribution(leads, "intent")} total={total} />
              <Breakdown title="나이대" rows={distribution(leads, "ageBand")} total={surveyed || 1} />
              <Breakdown title="희망 가격" rows={distribution(leads, "priceBand")} total={surveyed || 1} />
              <Breakdown title="선호 시간대" rows={distribution(leads, "preferredTime")} total={surveyed || 1} />
            </div>

            <h2 className="mt-14 text-[20px] font-bold tracking-[-0.02em]">응답 목록</h2>
            <ul className="mt-5 flex flex-col gap-4">
              {leads.map((lead) => (
                <li key={lead.id} className="rounded-2xl border border-brand-line bg-white/70 p-6">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-brand-orange/10 px-2.5 py-0.5 text-[12px] font-semibold text-brand-orange">
                      {labelOf(lead.intent)}
                    </span>
                    <span className="text-[13px] text-brand-ink/45">
                      #{lead.id} · {formatDateTime(lead.createdAt)}
                    </span>
                    {lead.contact && (
                      <span className="text-[13px] text-brand-ink/70">{lead.contact}</span>
                    )}
                  </div>

                  {lead.improvement && (
                    <p className="mt-3 whitespace-pre-wrap rounded-xl bg-brand-ink/4 px-4 py-3 text-[14px] leading-[1.75] text-brand-ink/75">
                      {lead.improvement}
                    </p>
                  )}

                  {lead.surveyDone && (
                    <p className="mt-3 text-[13px] text-brand-ink/55">
                      {labelOf(lead.ageBand)} · {labelOf(lead.gender)} · {labelOf(lead.region)} ·{" "}
                      {labelOf(lead.preferredTime)} · {labelOf(lead.priceBand)}
                    </p>
                  )}

                  {lead.couponCode && (
                    <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-brand-line pt-4">
                      <span className="font-mono text-[14px] font-semibold text-brand-ink">
                        {lead.couponCode}
                      </span>
                      <span
                        className={
                          "rounded-full px-2.5 py-0.5 text-[12px] font-semibold " +
                          (lead.couponSent
                            ? "bg-brand-ink/8 text-brand-ink/60"
                            : "bg-brand-orange/10 text-brand-orange")
                        }
                      >
                        {lead.couponSent ? "발송 완료" : "발송 전"}
                      </span>
                      <form action={setCouponSentAction}>
                        <input type="hidden" name="leadId" value={lead.id} />
                        <input type="hidden" name="sent" value={lead.couponSent ? "false" : "true"} />
                        <button
                          type="submit"
                          className={`${smallButtonClass} border border-brand-line text-brand-ink/60 hover:border-brand-orange hover:text-brand-orange`}
                        >
                          {lead.couponSent ? "발송 취소" : "발송 완료로 표시"}
                        </button>
                      </form>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </>
        )}
      </main>
    </div>
  );
}
