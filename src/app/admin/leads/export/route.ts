import { currentUser } from "@/lib/auth";
import { leadsToCsv, listLeads } from "@/lib/leads";

export const dynamic = "force-dynamic";

export async function GET() {
  const me = await currentUser();
  if (me?.role !== "admin") {
    return new Response("관리자만 내려받을 수 있습니다.", { status: 403 });
  }

  const csv = leadsToCsv(await listLeads());
  const today = new Date().toISOString().slice(0, 10);

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="sauna-chimaek-leads-${today}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
