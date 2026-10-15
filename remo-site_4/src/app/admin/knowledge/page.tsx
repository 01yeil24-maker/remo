import Link from "next/link";
import { redirect } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import { currentUser } from "@/lib/auth";
import { listDocuments, listSupportMessages } from "@/lib/knowledge";
import { CHAT_MODEL, EMBED_MODEL, isGeminiConfigured } from "@/lib/gemini";
import { SEED_TITLE } from "@/lib/remo-seed";
import { formatDateTime } from "@/lib/format";
import { noticeClass, smallButtonClass } from "@/components/formStyles";
import { deleteDocumentAction } from "./actions";
import { AddDocumentForm, QuickActions } from "./KnowledgeForms";

export const dynamic = "force-dynamic";

export default async function KnowledgePage() {
  const me = await currentUser();
  if (!me) redirect("/login");
  if (me.role !== "admin") redirect("/board");

  const [documents, logs] = await Promise.all([listDocuments(), listSupportMessages(30)]);
  const hasSeed = documents.some((doc) => doc.title === SEED_TITLE);
  const unanswered = logs.filter((log) => !log.grounded);

  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-14 sm:px-10 sm:py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[13px] font-semibold tracking-[0.06em] text-brand-orange">ADMIN</p>
            <h1 className="mt-4 text-[30px] font-bold sm:text-[40px]">상담 챗봇 자료</h1>
          </div>
          <Link
            href="/support"
            className="rounded-full border border-brand-line px-4 py-2 text-[13px] font-medium text-brand-ink/60 transition-colors hover:border-brand-orange hover:text-brand-orange"
          >
            상담 화면 보기
          </Link>
        </div>

        <p className="mt-4 text-[14px] leading-[1.8] text-brand-ink/60">
          답변 모델 <code className="font-mono text-brand-ink/80">{CHAT_MODEL}</code> · 임베딩{" "}
          <code className="font-mono text-brand-ink/80">{EMBED_MODEL}</code> · 키{" "}
          {isGeminiConfigured() ? (
            <span className="font-semibold text-brand-ink/80">설정됨</span>
          ) : (
            <span className="font-semibold text-brand-orange">없음</span>
          )}
        </p>

        {!isGeminiConfigured() && (
          <p className={`${noticeClass} mt-6 max-w-2xl`}>
            Vercel 환경변수에 <code>GEMINI_API_KEY</code>를 추가하고 Redeploy하면 챗봇이
            동작합니다. 키는 서버에서만 읽고 브라우저로 내려가지 않습니다.
          </p>
        )}

        <QuickActions hasSeed={hasSeed} />

        {/* 등록된 문서 */}
        <h2 className="mt-14 text-[20px] font-bold tracking-[-0.02em]">
          등록된 자료 {documents.length > 0 && `(${documents.length})`}
        </h2>
        {documents.length === 0 ? (
          <p className={`${noticeClass} mt-5 max-w-2xl`}>
            아직 자료가 없습니다. 위의 &ldquo;기본 안내 문서 넣기&rdquo;로 시작하거나, 아래에서
            직접 추가하세요.
          </p>
        ) : (
          <ul className="mt-5 flex flex-col gap-3">
            {documents.map((doc) => (
              <li
                key={doc.id}
                className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-brand-line bg-white/70 px-6 py-5"
              >
                <div className="min-w-0">
                  <div className="text-[16px] font-semibold tracking-[-0.02em]">{doc.title}</div>
                  <p className="mt-1 text-[13px] text-brand-ink/50">
                    {doc.chunkCount}개 조각 · {doc.charCount.toLocaleString("ko-KR")}자
                    {doc.source && ` · ${doc.source}`} · {formatDateTime(doc.createdAt)}
                  </p>
                </div>
                <form action={deleteDocumentAction}>
                  <input type="hidden" name="documentId" value={doc.id} />
                  <button
                    type="submit"
                    className={`${smallButtonClass} border border-brand-line text-brand-ink/60 hover:border-brand-orange hover:text-brand-orange`}
                  >
                    삭제
                  </button>
                </form>
              </li>
            ))}
          </ul>
        )}

        {/* 문서 추가 */}
        <h2 className="mt-14 text-[20px] font-bold tracking-[-0.02em]">자료 추가</h2>
        <p className="mt-2 max-w-2xl text-[14px] leading-[1.8] text-brand-ink/60">
          NotebookLM에 모아둔 내용은 원문을 복사해 여기에 붙여넣으면 됩니다. 챗봇은 여기 있는
          내용만 근거로 답합니다.
        </p>
        <AddDocumentForm />

        {/* 들어온 질문 */}
        <h2 className="mt-16 text-[20px] font-bold tracking-[-0.02em]">최근 질문</h2>
        <p className="mt-2 max-w-2xl text-[14px] leading-[1.8] text-brand-ink/60">
          {logs.length === 0
            ? "아직 들어온 질문이 없습니다."
            : `최근 ${logs.length}건 · 자료로 답하지 못한 질문 ${unanswered.length}건`}
          {logs.length > 0 &&
            " · 답할 수 있는 질문인데 '답변 못 함'이 많으면 환경변수 RAG_MIN_SCORE를 낮춰보세요(기본 0.55)."}
        </p>
        {logs.length > 0 && (
          <ul className="mt-5 flex flex-col gap-3">
            {logs.map((log) => (
              <li key={log.id} className="rounded-2xl border border-brand-line bg-white/70 p-6">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={
                      "rounded-full px-2.5 py-0.5 text-[12px] font-semibold " +
                      (log.grounded
                        ? "bg-brand-ink/8 text-brand-ink/60"
                        : "bg-brand-orange/10 text-brand-orange")
                    }
                  >
                    {log.grounded ? "자료로 답변" : "답변 못 함"}
                  </span>
                  <span className="text-[13px] text-brand-ink/45">
                    {formatDateTime(log.createdAt)}
                  </span>
                  {log.topScore !== null && (
                    <span className="font-mono text-[12px] text-brand-ink/40">
                      유사도 {log.topScore.toFixed(2)}
                    </span>
                  )}
                </div>
                <p className="mt-3 text-[15px] font-semibold tracking-[-0.02em]">{log.question}</p>
                <p className="mt-2 whitespace-pre-wrap text-[14px] leading-[1.75] text-brand-ink/65">
                  {log.answer}
                </p>
                {log.sources && (
                  <p className="mt-2 text-[12px] text-brand-ink/40">참고: {log.sources}</p>
                )}
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
