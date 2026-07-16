"use client";
import { useMemo, useState, useTransition } from "react";
import { Download, Inbox, Mail, Phone } from "lucide-react";
import { setEnquiryStatus, type EnquiryType, type EnquiryStatus } from "@/lib/enquiry-actions";

type Row = {
  id: string; type: string; name: string; email: string; phone: string | null;
  level: string | null; timing: string | null; message: string | null;
  sourcePath: string | null; status: string; createdAt: string;
};

const TYPE_LABEL: Record<string, string> = {
  course: "Course", private: "Private", plida: "PLIDA", workshop: "Workshop", trial: "Trial class", general: "General",
};
const STATUS_STYLE: Record<string, string> = {
  new: "bg-sole/40 text-ink", contacted: "bg-azzurro/15 text-azzurro-deep", closed: "bg-ink/5 text-ink-muted",
};
const STATUSES: EnquiryStatus[] = ["new", "contacted", "closed"];

function fmt(iso: string) {
  const d = new Date(iso);
  return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
}

function toCSV(rows: Row[]) {
  const head = ["Date", "Type", "Name", "Email", "Phone", "Level", "Timing", "Message", "Page", "Status"];
  const esc = (v: string) => `"${(v ?? "").replace(/"/g, '""')}"`;
  const lines = rows.map((r) =>
    [fmt(r.createdAt), TYPE_LABEL[r.type] ?? r.type, r.name, r.email, r.phone ?? "", r.level ?? "", r.timing ?? "", r.message ?? "", r.sourcePath ?? "", r.status]
      .map((v) => esc(String(v))).join(","),
  );
  return [head.join(","), ...lines].join("\n");
}

export default function EnquiriesClient({ rows, error }: { rows: Row[]; error: string | null }) {
  const [filter, setFilter] = useState<"all" | EnquiryType>("all");
  const [hideClosed, setHideClosed] = useState(true);
  const [busy, startTransition] = useTransition();
  const [localStatus, setLocalStatus] = useState<Record<string, string>>({});

  const statusOf = (r: Row) => localStatus[r.id] ?? r.status;

  const filtered = useMemo(
    () => rows.filter((r) => (filter === "all" || r.type === filter) && (!hideClosed || statusOf(r) !== "closed")),
    [rows, filter, hideClosed, localStatus],
  );

  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    rows.forEach((r) => { if (statusOf(r) === "new") c[r.type] = (c[r.type] ?? 0) + 1; });
    return c;
  }, [rows, localStatus]);
  const newTotal = Object.values(counts).reduce((a, b) => a + b, 0);

  function changeStatus(id: string, status: EnquiryStatus) {
    setLocalStatus((s) => ({ ...s, [id]: status }));
    startTransition(() => { setEnquiryStatus(id, status); });
  }

  function downloadCSV() {
    const blob = new Blob([toCSV(filtered)], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `enquiries-${filter}.csv`; a.click();
    URL.revokeObjectURL(url);
  }

  if (error) {
    return <div className="max-w-3xl"><div className="frame p-8 bg-white text-center text-ink-muted">{error}</div></div>;
  }

  const types: ("all" | EnquiryType)[] = ["all", "course", "private", "plida", "workshop", "trial", "general"];

  return (
    <div className="max-w-6xl">
      <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
        <div>
          <p className="eyebrow">Admin · Enquiries</p>
          <h1 className="mt-2 text-3xl md:text-4xl inline-flex items-center gap-3">
            Enquiries.
            {newTotal > 0 && <span className="text-sm font-body bg-sole text-ink rounded-full px-3 py-1">{newTotal} new</span>}
          </h1>
        </div>
        <button type="button" onClick={downloadCSV} disabled={!filtered.length} className="btn btn-ghost disabled:opacity-40">
          <Download size={16} /> Export CSV
        </button>
      </div>

      <div className="frame p-4 md:p-5 bg-white flex flex-wrap items-center gap-2">
        {types.map((t) => (
          <button key={t} type="button" onClick={() => setFilter(t)}
            className={`px-3.5 py-2 rounded-full text-sm font-medium border ${filter === t ? "bg-ink text-cream border-ink" : "border-line hover:border-ink-muted"}`}>
            {t === "all" ? "All" : TYPE_LABEL[t]}
            {t !== "all" && counts[t] ? <span className="ml-1.5 text-xs opacity-80">({counts[t]})</span> : null}
          </button>
        ))}
        <label className="ml-auto text-sm text-ink-muted inline-flex items-center gap-2">
          <input type="checkbox" checked={hideClosed} onChange={(e) => setHideClosed(e.target.checked)} /> Hide closed
        </label>
      </div>

      {filtered.length === 0 ? (
        <div className="mt-6 frame bg-white p-12 text-center">
          <Inbox size={28} className="mx-auto text-ink-muted" aria-hidden />
          <p className="mt-3 text-ink-muted">No enquiries here yet.</p>
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {filtered.map((r) => {
            const st = statusOf(r);
            return (
              <div key={r.id} className="frame bg-white p-5">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-cream-2 border border-line">{TYPE_LABEL[r.type] ?? r.type}</span>
                      <span className="font-heading font-bold">{r.name}</span>
                      {r.level && <span className="text-xs text-ink-muted">· wants {r.level}</span>}
                      <span className="text-xs text-ink-muted">· {fmt(r.createdAt)}</span>
                    </div>
                    <div className="mt-1.5 flex items-center gap-4 text-sm flex-wrap">
                      <a href={`mailto:${r.email}`} className="inline-flex items-center gap-1.5 text-azzurro-deep hover:underline"><Mail size={14} /> {r.email}</a>
                      {r.phone && <a href={`tel:${r.phone}`} className="inline-flex items-center gap-1.5 text-ink-muted hover:text-ink"><Phone size={14} /> {r.phone}</a>}
                    </div>
                    {r.timing && <p className="mt-2 text-sm"><span className="text-ink-muted">When:</span> {r.timing}</p>}
                    {r.message && <p className="mt-1 text-sm text-ink-muted">“{r.message}”</p>}
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    {STATUSES.map((s) => (
                      <button key={s} type="button" disabled={busy} onClick={() => changeStatus(r.id, s)}
                        className={`text-xs px-2.5 py-1 rounded-full capitalize disabled:opacity-50 ${st === s ? STATUS_STYLE[s] + " font-medium ring-1 ring-ink/10" : "text-ink-muted hover:bg-cream-2"}`}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
