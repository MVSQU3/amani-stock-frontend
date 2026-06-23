import { Link } from "react-router";
import { ArrowUpRight } from "lucide-react";
import { fcfa } from "./Formatage_fcfa";

export function MiniStat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-3">
      <div className="flex items-center gap-1.5 text-neutral-500">{icon}</div>
      <div className="mt-1 text-xl font-semibold">
        {value.toLocaleString("fr-FR")}
      </div>
      <div className="text-xs text-neutral-500">{label}</div>
    </div>
  );
}

const TONES: Record<string, { ring: string; text: string }> = {
  amber: { ring: "border-l-amber-500", text: "text-amber-300" },
  red: { ring: "border-l-red-600", text: "text-red-300" },
  emerald: { ring: "border-l-emerald-500", text: "text-emerald-300" },
  neutral: { ring: "border-l-neutral-600", text: "text-neutral-300" },
  sky: { ring: "border-l-sky-500", text: "text-sky-300" },
};

export function AlertTile({
  to,
  icon,
  tone,
  count,
  label,
  sub,
}: {
  to: string;
  icon: React.ReactNode;
  tone: "amber" | "red" | "emerald" | "neutral" | "sky";
  count: number;
  label: string;
  sub?: string;
}) {
  const t = TONES[tone];
  return (
    <Link
      to={to}
      className={`group rounded-xl border border-neutral-800 border-l-4 ${t.ring} bg-neutral-900/60 p-3.5 transition hover:bg-neutral-900`}
    >
      <div className="flex items-center justify-between">
        <span className={t.text}>{icon}</span>
        <ArrowUpRight
          size={14}
          className="text-neutral-600 group-hover:text-neutral-400"
        />
      </div>
      <div className="mt-2 text-2xl font-semibold">
        {(count ?? 0).toLocaleString("fr-FR")}
      </div>
      <div className="text-xs text-neutral-400">{label}</div>
      {sub && <div className={`mt-0.5 text-xs ${t.text}`}>{sub}</div>}
    </Link>
  );
}

export function StatTile({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "emerald" | "amber" | "red";
}) {
  const tones = {
    emerald: "border-l-emerald-500 text-emerald-300",
    amber: "border-l-amber-500 text-amber-300",
    red: "border-l-red-600 text-red-300",
  };
  return (
    <div
      className={`rounded-xl border border-neutral-800 border-l-4 ${tones[tone].split(" ")[0]} bg-neutral-900/60 p-4 transition hover:bg-neutral-900`}
    >
      <div className="text-xs text-neutral-400">{label}</div>
      <div
        className={`mt-1 text-xl font-semibold ${tones[tone].split(" ")[1]}`}
      >
        {fcfa(value)}
      </div>
    </div>
  );
}
export { fcfa };
