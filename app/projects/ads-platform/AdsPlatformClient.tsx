"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  ArrowPathIcon,
  ArrowTopRightOnSquareIcon,
  BoltIcon,
  ChartBarSquareIcon,
  CheckCircleIcon,
  CircleStackIcon,
  ClipboardDocumentIcon,
  ClockIcon,
  CpuChipIcon,
  ExclamationTriangleIcon,
  KeyIcon,
  MegaphoneIcon,
  PauseIcon,
  PlayIcon,
  PlusIcon,
  ServerStackIcon,
  SignalIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import {
  AdsPlatformApi,
  ApiCampaign,
  ApiDailyReport,
  ApiDecision,
  ApiIssuedPublisherKey,
  ApiOverview,
  ApiPublisher,
} from "./AdsPlatformApi";

type Role = "advertiser" | "admin";
type CampaignStatus = "Active" | "Paused" | "Pending review" | "Rejected";
type ReleaseAction = "start_canary" | "promote" | "rollback";

interface Campaign {
  id: string;
  name: string;
  headline: string;
  description: string;
  cta: string;
  status: CampaignStatus;
  bid: number;
  dailyBudget: number;
  spent: number;
  impressions: number;
  clicks: number;
  destinationUrl?: string;
  reportingState?: "current" | "lagging" | "blocked";
  reportingPending?: number;
  reportingLagSeconds?: number;
  reportingAsOf?: string;
}

interface Metric {
  label: string;
  value: string;
  change: string;
  tone?: "positive" | "neutral" | "warning";
}

const initialCampaigns: Campaign[] = [
  {
    id: "cmp-1042",
    name: "ML Systems Field Guide",
    headline: "Ship reliable ML systems without losing the plot.",
    description:
      "A practical field guide to observability, feature freshness, and safe model releases.",
    cta: "Read the guide",
    status: "Active",
    bid: 1.8,
    dailyBudget: 180,
    spent: 1128.42,
    impressions: 68120,
    clicks: 2841,
  },
  {
    id: "cmp-1038",
    name: "Data Infrastructure Course",
    headline: "Design data systems that survive real traffic.",
    description: "Learn event contracts, backfills, quality gates, and production ownership.",
    cta: "View curriculum",
    status: "Active",
    bid: 1.45,
    dailyBudget: 120,
    spent: 824.16,
    impressions: 44280,
    clicks: 1532,
  },
  {
    id: "cmp-1029",
    name: "Ranking Architecture Brief",
    headline: "From candidate retrieval to a calibrated final rank.",
    description: "A concise architecture brief for modern recommendation and ads teams.",
    cta: "Download brief",
    status: "Paused",
    bid: 1.2,
    dailyBudget: 90,
    spent: 231.72,
    impressions: 16020,
    clicks: 443,
  },
];

const trafficBars = [44, 57, 52, 68, 63, 81, 74];
const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const apiBaseUrl = process.env.NEXT_PUBLIC_ADS_API_URL?.replace(/\/$/, "") ?? "";
const publicShowcaseMode = process.env.NODE_ENV === "production";

function mapCampaign(campaign: ApiCampaign): Campaign {
  const statuses: Record<ApiCampaign["status"], CampaignStatus> = {
    active: "Active",
    paused: "Paused",
    pending_review: "Pending review",
    rejected: "Rejected",
  };
  return {
    id: campaign.id,
    name: campaign.name,
    headline: campaign.ad?.headline ?? "No active text ad",
    description: campaign.ad?.description ?? "",
    cta: campaign.ad?.call_to_action ?? "Learn more",
    destinationUrl: campaign.ad?.destination_url,
    status: statuses[campaign.status],
    bid: campaign.bid_cpc_micros / 1_000_000,
    dailyBudget: campaign.daily_budget_micros / 1_000_000,
    spent: campaign.statistics.spend_micros / 1_000_000,
    impressions: campaign.statistics.impressions,
    clicks: campaign.statistics.clicks,
    reportingState: campaign.reporting?.state,
    reportingPending: campaign.reporting?.pending_messages,
    reportingLagSeconds: campaign.reporting?.lag_seconds,
    reportingAsOf: campaign.reporting?.as_of ?? undefined,
  };
}

function formatInteger(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

function formatMoney(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

function MetricGrid({ metrics }: { metrics: Metric[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric) => (
        <article key={metric.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
            {metric.label}
          </p>
          <p className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">{metric.value}</p>
          <p
            className={`mt-1 text-xs font-medium ${
              metric.tone === "warning"
                ? "text-amber-700"
                : metric.tone === "neutral"
                  ? "text-slate-500"
                  : "text-emerald-700"
            }`}
          >
            {metric.change}
          </p>
        </article>
      ))}
    </div>
  );
}

function StatusBadge({ status }: { status: CampaignStatus }) {
  const styles = {
    Active: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
    Paused: "bg-slate-100 text-slate-600 ring-slate-500/20",
    "Pending review": "bg-amber-50 text-amber-700 ring-amber-600/20",
    Rejected: "bg-rose-50 text-rose-700 ring-rose-600/20",
  };
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${styles[status]}`}>
      {status}
    </span>
  );
}

function PerformanceChart({ title, subtitle, points }: { title: string; subtitle: string; points?: Array<{ label: string; value: number }> }) {
  const chartPoints = points ?? trafficBars.map((value, index) => ({ label: dayLabels[index], value }));
  const maximum = Math.max(1, ...chartPoints.map((point) => point.value));
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-emerald-50 p-2 text-emerald-700">
          <ChartBarSquareIcon className="h-5 w-5" />
        </div>
        <div>
          <h2 className="font-semibold text-slate-950">{title}</h2>
          <p className="text-sm text-slate-500">{subtitle}</p>
        </div>
      </div>
      <div className="mt-7 flex h-48 items-end gap-2 sm:gap-3" aria-label="Seven-day performance chart">
        {chartPoints.map((point) => (
          <div key={point.label} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
            <div className="flex h-full w-full items-end">
              <div
                className="w-full rounded-t-lg bg-emerald-500 transition hover:bg-emerald-600"
                style={{ height: `${point.value ? Math.max(3, (point.value / maximum) * 100) : 0}%` }}
                title={`${point.label}: ${formatInteger(point.value)} clicks`}
              />
            </div>
            <span className="text-[11px] text-slate-400 sm:text-xs">{point.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function CampaignForm({
  onClose,
  onCreate,
}: {
  onClose: () => void;
  onCreate: (campaign: Campaign) => Promise<void> | void;
}) {
  const [name, setName] = useState("");
  const [headline, setHeadline] = useState("");
  const [description, setDescription] = useState("");
  const [cta, setCta] = useState("Learn more");
  const [destinationUrl, setDestinationUrl] = useState("https://example.com/");
  const [bid, setBid] = useState("1.50");
  const [budget, setBudget] = useState("100");
  const [submitting, setSubmitting] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      await onCreate({
        id: `cmp-demo-${Date.now()}`,
        name: name.trim(),
        headline: headline.trim(),
        description: description.trim(),
        cta: cta.trim(),
        destinationUrl: destinationUrl.trim(),
        status: "Pending review",
        bid: Number(bid),
        dailyBudget: Number(budget),
        spent: 0,
        impressions: 0,
        clicks: 0,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    "mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100";

  return (
    <section className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-5 shadow-sm sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-emerald-700">New campaign</p>
          <h2 className="mt-1 text-xl font-semibold text-slate-950">Create a text advertisement</h2>
          <p className="mt-1 text-sm text-slate-600">New campaigns enter the demo approval queue.</p>
        </div>
        <button type="button" onClick={onClose} className="rounded-lg p-2 text-slate-500 hover:bg-white" aria-label="Close campaign form">
          <XMarkIcon className="h-5 w-5" />
        </button>
      </div>

      <form onSubmit={submit} className="mt-6 grid gap-4 lg:grid-cols-2">
        <label className="text-sm font-medium text-slate-700">
          Campaign name
          <input required value={name} onChange={(event) => setName(event.target.value)} className={inputClass} placeholder="Q4 engineering guide" />
        </label>
        <label className="text-sm font-medium text-slate-700">
          Call to action
          <input required value={cta} onChange={(event) => setCta(event.target.value)} className={inputClass} maxLength={28} />
        </label>
        <label className="text-sm font-medium text-slate-700 lg:col-span-2">
          Headline
          <input required value={headline} onChange={(event) => setHeadline(event.target.value)} className={inputClass} maxLength={80} placeholder="Build systems your team can trust." />
          <span className="mt-1 block text-right text-xs text-slate-400">{headline.length}/80</span>
        </label>
        <label className="text-sm font-medium text-slate-700 lg:col-span-2">
          Description
          <textarea required value={description} onChange={(event) => setDescription(event.target.value)} className={`${inputClass} min-h-24 resize-y`} maxLength={150} placeholder="Describe the offer and why it is useful." />
          <span className="mt-1 block text-right text-xs text-slate-400">{description.length}/150</span>
        </label>
        <label className="text-sm font-medium text-slate-700 lg:col-span-2">
          Destination URL
          <input required type="url" value={destinationUrl} onChange={(event) => setDestinationUrl(event.target.value)} className={inputClass} />
        </label>
        <label className="text-sm font-medium text-slate-700">
          Max CPC bid
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-slate-400">$</span>
            <input required type="number" min="0.01" step="0.01" value={bid} onChange={(event) => setBid(event.target.value)} className={`${inputClass} pl-7`} />
          </div>
        </label>
        <label className="text-sm font-medium text-slate-700">
          Daily budget
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-slate-400">$</span>
            <input required type="number" min="1" step="1" value={budget} onChange={(event) => setBudget(event.target.value)} className={`${inputClass} pl-7`} />
          </div>
        </label>
        <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end lg:col-span-2">
          <button type="button" onClick={onClose} className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">Cancel</button>
          <button disabled={submitting} type="submit" className="rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-800 focus:outline-none focus:ring-4 focus:ring-emerald-200 disabled:cursor-wait disabled:opacity-60">{submitting ? "Submitting…" : "Submit for review"}</button>
        </div>
      </form>
    </section>
  );
}

function AdvertiserDashboard({ campaigns, dailyReport, onToggle, onOpenForm }: { campaigns: Campaign[]; dailyReport: ApiDailyReport | null; onToggle: (id: string) => void; onOpenForm: () => void }) {
  const totals = useMemo(
    () => campaigns.reduce(
      (result, campaign) => ({ impressions: result.impressions + campaign.impressions, clicks: result.clicks + campaign.clicks, spend: result.spend + campaign.spent }),
      { impressions: 0, clicks: 0, spend: 0 },
    ),
    [campaigns],
  );
  const ctr = totals.impressions ? (totals.clicks / totals.impressions) * 100 : 0;
  const projectedCampaigns = campaigns.filter((campaign) => campaign.reportingState !== undefined);
  const pendingProjectionMessages = projectedCampaigns.reduce(
    (total, campaign) => total + (campaign.reportingPending ?? 0),
    0,
  );
  const reportingBlocked = projectedCampaigns.some((campaign) => campaign.reportingState === "blocked");
  const reportingLagging = projectedCampaigns.some((campaign) => campaign.reportingState === "lagging");
  const maximumReportingLag = projectedCampaigns.reduce(
    (maximum, campaign) => Math.max(maximum, campaign.reportingLagSeconds ?? 0),
    0,
  );
  const dailyPoints = useMemo(() => {
    if (!dailyReport) return undefined;
    const clicksByDate = new Map<string, number>();
    dailyReport.rows.forEach((row) => clicksByDate.set(
      row.date,
      (clicksByDate.get(row.date) ?? 0) + row.statistics.clicks,
    ));
    const end = new Date(`${dailyReport.end_date}T00:00:00Z`);
    return Array.from({ length: 7 }, (_, index) => {
      const pointDate = new Date(end);
      pointDate.setUTCDate(end.getUTCDate() - (6 - index));
      const key = pointDate.toISOString().slice(0, 10);
      return {
        label: pointDate.toLocaleDateString("en-US", { weekday: "short", timeZone: "UTC" }),
        value: clicksByDate.get(key) ?? 0,
      };
    });
  }, [dailyReport]);
  const metrics: Metric[] = [
    { label: "Impressions", value: formatInteger(totals.impressions), change: "Accepted delivery events" },
    { label: "Clicks", value: formatInteger(totals.clicks), change: "Accepted delivery events" },
    { label: "CTR", value: `${ctr.toFixed(2)}%`, change: "Projected clicks / impressions" },
    { label: "Spend", value: formatMoney(totals.spend), change: "Settled CPC charges", tone: "neutral" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">Advertiser workspace</p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">Campaign performance</h2>
          <p className="mt-1 text-sm text-slate-500">Accepted lifetime delivery facts from the asynchronous reporting read model.</p>
        </div>
        <button type="button" onClick={onOpenForm} className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-slate-200">
          <PlusIcon className="h-4 w-4" />Create campaign
        </button>
      </div>

      <MetricGrid metrics={metrics} />

      {projectedCampaigns.length > 0 && (
        <div className={`rounded-xl border px-4 py-3 text-sm ${reportingBlocked ? "border-rose-200 bg-rose-50 text-rose-800" : reportingLagging ? "border-amber-200 bg-amber-50 text-amber-800" : "border-emerald-200 bg-emerald-50 text-emerald-800"}`}>
          <span className="font-semibold">
            {reportingBlocked ? "Reporting requires operator attention." : reportingLagging ? "Reporting is catching up." : "Reporting projection is current."}
          </span>{" "}
          {reportingBlocked || reportingLagging
            ? `${pendingProjectionMessages} event${pendingProjectionMessages === 1 ? " is" : "s are"} pending; counters may lag by up to ${Math.ceil(maximumReportingLag)} seconds.`
            : "All durable campaign events have been applied to these counters."}
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[0.78fr_1.22fr]">
        <PerformanceChart
          title="Clicks by UTC day"
          subtitle={dailyReport ? `${dailyReport.reporting.state === "current" ? "Current" : dailyReport.reporting.state === "blocked" ? "Blocked" : "Catching up"} asynchronous projection · last 7 days` : "Illustrative offline telemetry · last 7 days"}
          points={dailyPoints}
        />
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-5 py-4 sm:px-6">
            <div className="flex items-center justify-between gap-3">
              <div><h2 className="font-semibold text-slate-950">Your campaigns</h2><p className="text-sm text-slate-500">Bid, budget, delivery, and lifecycle controls</p></div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">{campaigns.length} total</span>
            </div>
          </div>
          <div className="divide-y divide-slate-100">
            {campaigns.map((campaign) => {
              const ctrValue = campaign.impressions ? (campaign.clicks / campaign.impressions) * 100 : 0;
              return (
                <article key={campaign.id} className="p-5 sm:p-6">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2"><h3 className="truncate font-semibold text-slate-950">{campaign.name}</h3><StatusBadge status={campaign.status} /></div>
                      <p className="mt-1 truncate text-sm text-slate-500">{campaign.headline}</p>
                    </div>
                    {(campaign.status === "Active" || campaign.status === "Paused") && (
                      <button type="button" onClick={() => onToggle(campaign.id)} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">
                        {campaign.status === "Active" ? <PauseIcon className="h-4 w-4" /> : <PlayIcon className="h-4 w-4" />}{campaign.status === "Active" ? "Pause" : "Resume"}
                      </button>
                    )}
                  </div>
                  <dl className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {[["Spend", formatMoney(campaign.spent)], ["CTR", `${ctrValue.toFixed(2)}%`], ["Max CPC", formatMoney(campaign.bid)], ["Daily budget", formatMoney(campaign.dailyBudget)]].map(([label, value]) => (
                      <div key={label} className="rounded-xl bg-slate-50 px-3 py-2.5"><dt className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">{label}</dt><dd className="mt-1 text-sm font-semibold text-slate-800">{value}</dd></div>
                    ))}
                  </dl>
                </article>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}

function PublisherCredentialPanel({
  publishers,
  issuedKey,
  onCreatePublisher,
  onIssueKey,
  onRevokeKey,
  onAssignDemoPlacement,
  onAcknowledgeSecret,
}: {
  publishers: ApiPublisher[];
  issuedKey: ApiIssuedPublisherKey | null;
  onCreatePublisher: (name: string) => void;
  onIssueKey: (publisherId: string) => void;
  onRevokeKey: (keyId: string) => void;
  onAssignDemoPlacement: (publisherId: string) => void;
  onAcknowledgeSecret: () => void;
}) {
  const [publisherName, setPublisherName] = useState("");
  const demoPlacementId = "placement_personal_site_banner";

  return (
    <section className="rounded-2xl border border-teal-200 bg-teal-50/30 p-6 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div><p className="text-xs font-bold uppercase tracking-[0.16em] text-teal-700">Publisher security</p><h3 className="mt-1 font-semibold text-slate-950">Placement-bound conversion credentials</h3><p className="mt-1 max-w-2xl text-sm text-slate-600">Rotate by issuing the replacement first, deploy it to the publisher server, verify use, then revoke the prior key.</p></div>
        <form
          className="flex w-full gap-2 lg:max-w-md"
          onSubmit={(event) => {
            event.preventDefault();
            if (!publisherName.trim()) return;
            onCreatePublisher(publisherName.trim());
            setPublisherName("");
          }}
        >
          <input value={publisherName} onChange={(event) => setPublisherName(event.target.value)} maxLength={160} placeholder="New publisher name" className="min-w-0 flex-1 rounded-xl border border-teal-200 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-teal-500" />
          <button type="submit" className="rounded-xl bg-teal-800 px-4 py-2.5 text-sm font-semibold text-white">Create</button>
        </form>
      </div>

      {issuedKey && (
        <div className="mt-5 rounded-xl border-2 border-amber-300 bg-amber-50 p-4" role="alert">
          <div className="flex items-start gap-3"><KeyIcon className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" /><div className="min-w-0 flex-1"><p className="text-sm font-semibold text-amber-950">Store this secret now—it will not be shown again.</p><p className="mt-1 text-xs text-amber-800">Key ID: <code>{issuedKey.id}</code> · fingerprint {issuedKey.secret_fingerprint}</p><code className="mt-3 block overflow-x-auto rounded-lg bg-slate-950 px-3 py-2.5 text-xs text-emerald-300">{issuedKey.secret}</code><div className="mt-3 flex flex-wrap gap-2"><button type="button" onClick={() => void navigator.clipboard.writeText(issuedKey.secret)} className="inline-flex items-center gap-1.5 rounded-lg border border-amber-300 bg-white px-3 py-2 text-xs font-semibold text-amber-900"><ClipboardDocumentIcon className="h-4 w-4" />Copy secret</button><button type="button" onClick={onAcknowledgeSecret} className="rounded-lg bg-amber-800 px-3 py-2 text-xs font-semibold text-white">I stored it securely</button></div></div></div>
        </div>
      )}

      <div className="mt-5 grid gap-4 xl:grid-cols-2">
        {publishers.map((publisher) => {
          const ownsDemoPlacement = publisher.placements.some((item) => item.id === demoPlacementId);
          return (
            <article key={publisher.id} className="rounded-xl border border-teal-100 bg-white p-4">
              <div className="flex flex-wrap items-start justify-between gap-3"><div><h4 className="text-sm font-semibold text-slate-900">{publisher.name}</h4><code className="mt-1 block text-[11px] text-slate-400">{publisher.id}</code></div><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${ownsDemoPlacement ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-600"}`}>{ownsDemoPlacement ? "Owns demo banner" : `${publisher.placements.length} placements`}</span></div>
              <div className="mt-4 space-y-2">
                {publisher.keys.length ? publisher.keys.slice(0, 6).map((key) => (
                  <div key={key.id} className="flex flex-col gap-2 rounded-lg bg-slate-50 px-3 py-2.5 sm:flex-row sm:items-center sm:justify-between"><div className="min-w-0"><p className="truncate text-xs font-semibold text-slate-800">{key.label}</p><p className="mt-0.5 truncate font-mono text-[10px] text-slate-400">{key.id} · {key.secret_fingerprint} · master {key.encryption_key_id}</p></div><div className="flex items-center gap-2"><span className={`text-[11px] font-semibold capitalize ${key.status === "active" ? "text-emerald-700" : key.status === "revoked" ? "text-rose-700" : "text-amber-700"}`}>{key.status}</span>{key.status === "active" && <button type="button" onClick={() => onRevokeKey(key.id)} className="rounded-md border border-rose-200 bg-white px-2 py-1 text-[11px] font-semibold text-rose-700">Revoke</button>}</div></div>
                )) : <p className="rounded-lg bg-slate-50 px-3 py-2.5 text-xs text-slate-500">No credentials issued.</p>}
              </div>
              <div className="mt-4 flex flex-wrap gap-2"><button type="button" onClick={() => onIssueKey(publisher.id)} className="inline-flex items-center gap-1.5 rounded-lg bg-teal-800 px-3 py-2 text-xs font-semibold text-white"><PlusIcon className="h-4 w-4" />Issue rotation key</button>{!ownsDemoPlacement && <button type="button" onClick={() => onAssignDemoPlacement(publisher.id)} className="rounded-lg border border-teal-200 px-3 py-2 text-xs font-semibold text-teal-800">Move demo banner here</button>}</div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function AdminDashboard({
  overview,
  pendingCampaigns,
  publishers,
  issuedPublisherKey,
  onReview,
  onReleaseAction,
  onCreatePublisher,
  onIssuePublisherKey,
  onRevokePublisherKey,
  onAssignDemoPlacement,
  onAcknowledgePublisherSecret,
}: {
  overview: ApiOverview | null;
  pendingCampaigns: Campaign[];
  publishers: ApiPublisher[];
  issuedPublisherKey: ApiIssuedPublisherKey | null;
  onReview: (id: string, approved: boolean) => void;
  onReleaseAction: (action: ReleaseAction) => void;
  onCreatePublisher: (name: string) => void;
  onIssuePublisherKey: (publisherId: string) => void;
  onRevokePublisherKey: (keyId: string) => void;
  onAssignDemoPlacement: (publisherId: string) => void;
  onAcknowledgePublisherSecret: () => void;
}) {
  const releaseMode = overview?.model_release.mode ?? "shadow";
  const releaseReady = releaseMode === "shadow"
    ? overview?.shadow_evaluation.canary_ready
    : overview?.shadow_evaluation.promotion_ready;
  const releaseBlockers = releaseMode === "shadow"
    ? overview?.shadow_evaluation.canary_blockers ?? []
    : overview?.shadow_evaluation.promotion_blockers ?? [];
  const metrics: Metric[] = overview
    ? [
        { label: "Decisions", value: formatInteger(overview.decisions), change: `$${(overview.spend_micros / 1_000_000).toFixed(2)} spent · $${(overview.budget_reservations.active_micros / 1_000_000).toFixed(2)} reserved` },
        { label: "p99 decision", value: `${overview.serving_telemetry.p99_precommit_latency_ms.toFixed(1)} ms`, change: `pre-commit · ${formatInteger(overview.serving_telemetry.attempts)}-request window` },
        { label: "Fill rate", value: `${(overview.serving_telemetry.fill_rate * 100).toFixed(1)}%`, change: `${(overview.serving_telemetry.error_rate * 100).toFixed(2)}% scorer errors`, tone: overview.serving_telemetry.error_rate > 0 ? "neutral" : "positive" },
        { label: "Traffic quality", value: formatInteger(overview.traffic_quality.quarantined_events), change: "quarantined · excluded from billing", tone: overview.traffic_quality.quarantined_events > 0 ? "neutral" : "positive" },
      ]
    : [
        { label: "Requests / min", value: "18,642", change: "+6.2% vs prior hour" },
        { label: "p99 latency", value: "43 ms", change: "7 ms inside SLO" },
        { label: "Fill rate", value: "96.8%", change: "+0.6 percentage points" },
        { label: "Error rate", value: "0.07%", change: "Offline demo", tone: "neutral" },
      ];
  const endpoints = [
    { name: "Ad decision", path: "POST /v1/ad-decisions", p99: "measured server-side" },
    { name: "Delivery events", path: "POST /v1/events", p99: "idempotent writes" },
    { name: "Advertiser reporting", path: "GET /v1/advertiser/campaigns", p99: "event-derived" },
    { name: "Admin overview", path: "GET /v1/admin/overview", p99: "authenticated" },
  ];

  return (
    <div className="space-y-6">
      <div><p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">Platform operations</p><h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">Marketplace and model health</h2><p className="mt-1 text-sm text-slate-500">Serving, release, feedback, and moderation controls.</p></div>
      <MetricGrid metrics={metrics} />
      {overview && (
        <section className="rounded-2xl border border-sky-200 bg-sky-50/40 p-6 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div><p className="text-xs font-bold uppercase tracking-[0.16em] text-sky-700">Measured serving path</p><h3 className="mt-1 font-semibold text-slate-950">Bounded retrieval and stage latency</h3><p className="mt-1 text-sm text-slate-600">Structural retrieval is capped before feature construction, ranking, and transactional budget control.</p></div>
            <span className="w-fit rounded-full bg-white px-3 py-1 text-xs font-semibold text-sky-800">Pool limit {overview.serving_telemetry.candidate_pool_limit}</span>
          </div>
          <dl className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
            {[
              ["Retrieved", overview.serving_telemetry.mean_retrieved_candidates.toFixed(1)],
              ["Eligible", overview.serving_telemetry.mean_eligible_candidates.toFixed(1)],
              ["Retrieval", `${overview.serving_telemetry.mean_stage_latency_ms.retrieval.toFixed(2)} ms`],
              ["Features", `${overview.serving_telemetry.mean_stage_latency_ms.feature.toFixed(2)} ms`],
              ["Inference", `${overview.serving_telemetry.mean_stage_latency_ms.primary_inference.toFixed(2)} ms`],
              ["Budget", `${overview.serving_telemetry.mean_stage_latency_ms.budget.toFixed(2)} ms`],
            ].map(([label, value]) => <div key={label} className="rounded-xl border border-sky-100 bg-white p-3.5"><dt className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">{label}</dt><dd className="mt-1.5 text-sm font-semibold text-slate-800">{value}</dd></div>)}
          </dl>
          <p className="mt-4 text-xs text-slate-500">p50 / p95 / p99 pre-commit: {overview.serving_telemetry.p50_precommit_latency_ms.toFixed(1)} / {overview.serving_telemetry.p95_precommit_latency_ms.toFixed(1)} / {overview.serving_telemetry.p99_precommit_latency_ms.toFixed(1)} ms · retrieval saturated on {(overview.serving_telemetry.retrieval_saturation_rate * 100).toFixed(1)}% of attempts.</p>
        </section>
      )}
      {overview && (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Reporting reliability</p>
            <h3 className="mt-1 font-semibold text-slate-950">Independent asynchronous projections</h3>
            <p className="mt-1 text-sm text-slate-500">Lifetime and UTC-day reporting consume the same durable event log independently, so one stalled worker cannot hide behind the other.</p>
          </div>
          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            {[
              { label: "Lifetime campaign totals", projection: overview.reporting_projection },
              { label: "UTC daily campaign totals", projection: overview.daily_reporting_projection },
            ].map(({ label, projection }) => {
              const stateTone = projection.state === "current"
                ? "bg-emerald-100 text-emerald-800"
                : projection.state === "blocked"
                  ? "bg-rose-100 text-rose-800"
                  : "bg-amber-100 text-amber-800";
              const workerTone = projection.worker.healthy
                ? "text-emerald-700"
                : projection.worker.state === "missing" || projection.worker.state === "stopped"
                  ? "text-slate-500"
                  : "text-rose-700";
              return (
                <article key={label} className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div><h4 className="text-sm font-semibold text-slate-900">{label}</h4><code className="mt-1 block text-[11px] text-slate-400">{projection.consumer}</code></div>
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${stateTone}`}>{projection.state}</span>
                  </div>
                  <dl className="mt-4 grid grid-cols-3 gap-2 text-center">
                    {[
                      ["Pending", projection.pending_messages],
                      ["Retrying", projection.retrying_messages],
                      ["Dead letters", projection.dead_lettered_messages],
                    ].map(([metric, value]) => <div key={metric} className="rounded-lg bg-white px-2 py-3"><dt className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">{metric}</dt><dd className="mt-1 text-sm font-semibold text-slate-800">{formatInteger(Number(value))}</dd></div>)}
                  </dl>
                  <p className="mt-3 text-xs text-slate-500">{formatInteger(projection.decisions)} decisions · {formatInteger(projection.impressions)} impressions · {formatInteger(projection.clicks)} clicks</p>
                  <p className={`mt-1.5 text-xs font-semibold ${workerTone}`}>Worker {projection.worker.state}{projection.worker.heartbeat_age_seconds === null ? "" : ` · heartbeat ${projection.worker.heartbeat_age_seconds.toFixed(1)}s ago`}</p>
                </article>
              );
            })}
          </div>
        </section>
      )}
      {overview && (
        <PublisherCredentialPanel
          publishers={publishers}
          issuedKey={issuedPublisherKey}
          onCreatePublisher={onCreatePublisher}
          onIssueKey={onIssuePublisherKey}
          onRevokeKey={onRevokePublisherKey}
          onAssignDemoPlacement={onAssignDemoPlacement}
          onAcknowledgeSecret={onAcknowledgePublisherSecret}
        />
      )}
      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-3"><div className="rounded-xl bg-emerald-50 p-2 text-emerald-700"><CpuChipIcon className="h-5 w-5" /></div><div><div className="flex flex-wrap items-center gap-2"><h3 className="font-semibold text-slate-950">Primary ranker</h3><span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />Serving</span></div><p className="mt-1 text-sm text-slate-500">Expected-value selection with a separately observed candidate</p></div></div>
            <span className="rounded-lg bg-slate-100 px-3 py-2 font-mono text-xs font-semibold text-slate-700">{overview?.model_version ?? "ranker-ddp-v1"}</span>
          </div>
          <dl className="mt-6 grid gap-3 sm:grid-cols-2">
            {[["Feature snapshot", "product-ranking-features-v2"], ["Release state", releaseMode], ["Candidate", overview?.model_release.candidate_model_version ?? "Not configured"], ["Canary traffic", `${((overview?.model_release.canary_fraction ?? 0) * 100).toFixed(0)}%`], ["State revision", String(overview?.model_release.revision ?? 0)], ["Circuit breaker", overview?.release_circuit_breaker.last_trip_at ? "Auto-rollback recorded" : `Armed · ${overview?.release_circuit_breaker.minimum_attempts ?? 20}/${overview?.release_circuit_breaker.window ?? 50}`]].map(([label, value]) => (
              <div key={label} className="rounded-xl border border-slate-100 bg-slate-50 p-3.5"><dt className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">{label}</dt><dd className="mt-1.5 text-sm font-semibold text-slate-800">{value}</dd></div>
            ))}
          </dl>
          <div className="mt-5 flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row">
            {releaseMode === "shadow" && <button disabled={!overview?.shadow_evaluation.canary_ready} type="button" onClick={() => onReleaseAction("start_canary")} className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"><ArrowPathIcon className="h-4 w-4" />Start 10% canary</button>}
            {releaseMode === "canary" && <button disabled={!overview?.shadow_evaluation.promotion_ready} type="button" onClick={() => onReleaseAction("promote")} className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-40"><PlayIcon className="h-4 w-4" />Promote candidate</button>}
            {releaseMode !== "shadow" && <button type="button" onClick={() => onReleaseAction("rollback")} className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">Roll back to baseline</button>}
          </div>
        </section>
        <PerformanceChart title="Decision traffic" subtitle="Requests per minute · normalized demo series" />
      </div>

      {overview && (
        <section className="rounded-2xl border border-amber-200 bg-amber-50/40 p-6 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-amber-700">Measurement integrity</p>
              <h3 className="mt-1 font-semibold text-slate-950">Traffic-quality quarantine</h3>
              <p className="mt-1 text-sm text-slate-600">Suspicious signed events remain auditable but never become billing, reporting, or training facts.</p>
            </div>
            <span className="w-fit rounded-full bg-white px-3 py-1 text-xs font-semibold text-amber-800">{formatInteger(overview.traffic_quality.quarantined_events)} retained</span>
          </div>
          <dl className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["Fast clicks", formatInteger(overview.traffic_quality.primary_reason_counts.click_too_fast ?? 0)],
              ["Automated clients", formatInteger(overview.traffic_quality.primary_reason_counts.automated_user_agent ?? 0)],
              ["Untrusted origins", formatInteger(overview.traffic_quality.primary_reason_counts.origin_not_allowed ?? 0)],
              ["Value outliers", formatInteger(overview.traffic_quality.primary_reason_counts.conversion_value_outlier ?? 0)],
            ].map(([label, value]) => (
              <div key={label} className="rounded-xl border border-amber-100 bg-white p-3.5">
                <dt className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">{label}</dt>
                <dd className="mt-1.5 text-sm font-semibold text-slate-800">{value}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 text-xs text-slate-500">Minimum click delay: {overview.traffic_quality.minimum_click_delay_ms} ms · maximum accepted conversion value: ${(overview.traffic_quality.maximum_conversion_value_micros / 1_000_000).toLocaleString()} · tracking key: {overview.tracking_security.active_key_id} ({overview.tracking_security.verification_key_count} accepted) · publisher signatures: {overview.tracking_security.publisher_conversion_signatures_enabled ? `${overview.tracking_security.publisher_verification_key_count} active keys across ${overview.tracking_security.active_publisher_count} publishers · ${overview.tracking_security.publisher_revoked_key_count} revoked · master key ${overview.tracking_security.publisher_encryption_active_key_id ?? "unconfigured"} (${overview.tracking_security.publisher_encryption_key_count} decryptors, ${overview.tracking_security.publisher_keys_pending_reencryption} pending re-encryption, ${overview.tracking_security.publisher_keys_with_unavailable_encryption_key} unavailable)` : "disabled"}</p>
        </section>
      )}

      {overview && (
        <section className="rounded-2xl border border-violet-200 bg-violet-50/40 p-6 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-violet-700">Safe model evaluation</p>
              <h3 className="mt-1 font-semibold text-slate-950">Shadow ranker</h3>
              <p className="mt-1 text-sm text-slate-600">The candidate is scored alongside the primary model and never changes delivery.</p>
            </div>
            <span className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${releaseReady ? "bg-emerald-100 text-emerald-800" : overview.shadow_evaluation.enabled ? "bg-amber-100 text-amber-800" : "bg-slate-100 text-slate-600"}`}>
              {releaseReady ? releaseMode === "shadow" ? "Ready for canary" : "Ready for promotion" : overview.shadow_evaluation.enabled ? "Collecting evidence" : "Disabled"}
            </span>
          </div>
          <dl className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {[
              ["Attempts", formatInteger(overview.shadow_evaluation.attempted_decisions)],
              ["Canary labels", `${formatInteger(overview.shadow_evaluation.canary_labeled_impressions)} / ${formatInteger(overview.shadow_evaluation.guardrails.minimum_canary_samples)}`],
              ["Winner disagreement", `${(overview.shadow_evaluation.selection_disagreement_rate * 100).toFixed(1)}%`],
              ["p95 latency", `${overview.shadow_evaluation.p95_latency_ms.toFixed(2)} ms`],
              ["Errors", formatInteger(overview.shadow_evaluation.errors)],
            ].map(([label, value]) => (
              <div key={label} className="rounded-xl border border-violet-100 bg-white p-3.5">
                <dt className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">{label}</dt>
                <dd className="mt-1.5 text-sm font-semibold text-slate-800">{value}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-4 rounded-xl border border-sky-200 bg-sky-50 px-4 py-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-sky-800">Local personal-site diagnostic</p>
                <p className="mt-1 text-xs text-sky-900">Only decisions with persisted server-derived personal-site provenance are included.</p>
              </div>
              <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${overview.local_shadow_diagnostic.ready ? "bg-emerald-100 text-emerald-800" : "bg-white text-sky-800"}`}>
                {overview.local_shadow_diagnostic.ready ? "Diagnostic passed" : "Diagnostic collecting"}
              </span>
            </div>
            <p className="mt-3 text-xs text-sky-900">
              {formatInteger(overview.local_shadow_diagnostic.successful_decisions)} / {formatInteger(overview.local_shadow_diagnostic.guardrails.minimum_samples)} verified samples · {formatInteger(overview.local_shadow_diagnostic.labeled_impressions)} / {formatInteger(overview.local_shadow_diagnostic.guardrails.minimum_labeled_impressions)} impression labels · p95 {overview.local_shadow_diagnostic.p95_latency_ms.toFixed(2)} ms
            </p>
            <p className="mt-1 text-[11px] text-sky-700">Diagnostic only: it has no release authority and never enables Canary or Promotion. The formal Canary gate remains {formatInteger(overview.shadow_evaluation.guardrails.minimum_samples)} samples.</p>
          </div>
          <p className="mt-4 text-xs text-slate-500">Mean score delta on the primary winner: {overview.shadow_evaluation.mean_selected_score_delta.toFixed(4)} · promotion remains an explicit operator decision.</p>
          {releaseBlockers.length > 0 && (
            <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-amber-800">Promotion blockers</p>
              <ul className="mt-2 list-disc space-y-1 pl-4 text-xs text-amber-900">
                {releaseBlockers.map((reason) => <li key={reason}>{reason}</li>)}
              </ul>
            </div>
          )}
        </section>
      )}

      <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6"><div><h3 className="font-semibold text-slate-950">Service endpoints</h3><p className="text-sm text-slate-500">Proposed API contract and demo health</p></div><ServerStackIcon className="h-5 w-5 text-slate-400" /></div>
          <div className="divide-y divide-slate-100">
            {endpoints.map((endpoint) => (
              <div key={endpoint.path} className="grid gap-2 px-5 py-4 sm:grid-cols-[1fr_1.4fr_auto_auto] sm:items-center sm:gap-4 sm:px-6"><p className="text-sm font-semibold text-slate-800">{endpoint.name}</p><code className="text-xs text-slate-500">{endpoint.path}</code><p className="text-xs font-medium text-slate-500">{endpoint.p99}</p><span className="inline-flex w-fit items-center gap-1 text-xs font-semibold text-emerald-700"><CheckCircleIcon className="h-4 w-4" />Defined</span></div>
            ))}
          </div>
        </section>
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3"><div className="rounded-xl bg-amber-50 p-2 text-amber-700"><MegaphoneIcon className="h-5 w-5" /></div><div><h3 className="font-semibold text-slate-950">Review queue</h3><p className="text-sm text-slate-500">Creative and campaign policy</p></div></div>
          <div className="mt-5 space-y-3">
            {pendingCampaigns.length ? pendingCampaigns.map((campaign) => (
              <div key={campaign.id} className="rounded-xl bg-slate-50 px-4 py-3">
                <p className="text-sm font-semibold text-slate-900">{campaign.name}</p>
                <p className="mt-1 text-xs text-slate-500">{campaign.headline}</p>
                <div className="mt-3 flex gap-2">
                  <button type="button" onClick={() => onReview(campaign.id, true)} className="rounded-lg bg-emerald-700 px-3 py-1.5 text-xs font-semibold text-white">Approve</button>
                  <button type="button" onClick={() => onReview(campaign.id, false)} className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700">Reject</button>
                </div>
              </div>
            )) : (
              <div className="rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-600">No campaigns awaiting review.</div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default function AdsPlatformClient() {
  const api = useMemo(
    () => (!publicShowcaseMode && apiBaseUrl ? new AdsPlatformApi(apiBaseUrl) : null),
    [],
  );
  const [role, setRole] = useState<Role>("advertiser");
  const [sessionRole, setSessionRole] = useState<Role | null>(null);
  const [email, setEmail] = useState("advertiser@example.com");
  const [password, setPassword] = useState("");
  const [campaigns, setCampaigns] = useState(initialCampaigns);
  const [pendingCampaigns, setPendingCampaigns] = useState<Campaign[]>([]);
  const [overview, setOverview] = useState<ApiOverview | null>(null);
  const [publishers, setPublishers] = useState<ApiPublisher[]>([]);
  const [issuedPublisherKey, setIssuedPublisherKey] = useState<ApiIssuedPublisherKey | null>(null);
  const [dailyReport, setDailyReport] = useState<ApiDailyReport | null>(null);
  const [liveDecision, setLiveDecision] = useState<ApiDecision | null>(null);
  const [showCampaignForm, setShowCampaignForm] = useState(false);
  const [notice, setNotice] = useState(
    publicShowcaseMode
      ? "Public showcase · illustrative interface data with no sign-in or backend writes"
      : apiBaseUrl
        ? "Connecting to the local ad-decision API…"
        : "Offline demo data · API URL not configured",
  );

  useEffect(() => {
    if (!api) return;
    let mounted = true;
    const loadAd = async () => {
      try {
        const visitorId = sessionStorage.getItem("ads-demo-visitor-id") ?? crypto.randomUUID();
        const requestId = crypto.randomUUID();
        sessionStorage.setItem("ads-demo-visitor-id", visitorId);
        const decision = await api.decide(requestId, visitorId);
        if (!mounted || !decision) {
          if (mounted) setNotice("The backend returned no eligible advertisement");
          return;
        }
        setLiveDecision(decision);
        await api.recordEvent(
          decision.decision_id,
          "impression",
          `${decision.decision_id}:impression`,
          decision.tracking.impression_token,
        );
        if (mounted) setNotice(`Live decision served by ${decision.model_version} · $${((decision.budget_reservation?.reserved_micros ?? 0) / 1_000_000).toFixed(2)} click budget reserved`);
      } catch (error) {
        if (mounted) setNotice(`Backend unavailable · showing offline demo (${String(error)})`);
      }
    };
    void loadAd();
    return () => {
      mounted = false;
    };
  }, [api]);

  const currentAd: Campaign = liveDecision
    ? {
        id: liveDecision.ad.campaign_id,
        name: "Live served campaign",
        headline: liveDecision.ad.headline,
        description: liveDecision.ad.description,
        cta: liveDecision.ad.call_to_action,
        destinationUrl: liveDecision.ad.destination_url,
        status: "Active",
        bid: 0,
        dailyBudget: 0,
        spent: 0,
        impressions: 0,
        clicks: 0,
      }
    : (campaigns.find((campaign) => campaign.status === "Active") ?? campaigns[0]);

  const loadAdvertiser = async () => {
    if (!api) return;
    const [campaignResponse, dailyResponse] = await Promise.all([
      api.listCampaigns(),
      api.dailyReport(),
    ]);
    if (campaignResponse) setCampaigns(campaignResponse.map(mapCampaign));
    setDailyReport(dailyResponse);
  };

  const loadAdmin = async () => {
    if (!api) return;
    const [overviewResponse, pendingResponse, publisherResponse] = await Promise.all([
      api.overview(),
      api.pendingCampaigns(),
      api.publishers(),
    ]);
    setOverview(overviewResponse);
    setPendingCampaigns((pendingResponse ?? []).map(mapCampaign));
    setPublishers(publisherResponse ?? []);
  };

  const signIn = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!api) return;
    try {
      const authenticatedRole = await api.login(email, password);
      setSessionRole(authenticatedRole);
      setRole(authenticatedRole);
      setPassword("");
      if (authenticatedRole === "advertiser") await loadAdvertiser();
      else await loadAdmin();
      setNotice(`Connected to the persistent ${authenticatedRole} API`);
    } catch (error) {
      setNotice(`Sign-in failed: ${String(error)}`);
    }
  };

  const selectRole = async (nextRole: Role) => {
    if (publicShowcaseMode) {
      setRole(nextRole);
      setShowCampaignForm(false);
      setNotice(
        nextRole === "advertiser"
          ? "Viewing the static campaign-management showcase · illustrative UI data"
          : "Viewing the static platform-operations showcase · illustrative UI data",
      );
      return;
    }
    if (sessionRole && sessionRole !== nextRole) {
      await api?.logout();
      setSessionRole(null);
      setOverview(null);
      setPendingCampaigns([]);
      setPublishers([]);
      setIssuedPublisherKey(null);
    }
    setRole(nextRole);
    setEmail(nextRole === "advertiser" ? "advertiser@example.com" : "admin@example.com");
    setShowCampaignForm(false);
    setNotice(sessionRole === nextRole ? `Viewing the connected ${nextRole} workspace` : `Sign in as ${nextRole} to use persistent controls`);
  };

  const toggleCampaign = async (id: string) => {
    const selected = campaigns.find((campaign) => campaign.id === id);
    if (api && sessionRole === "advertiser" && selected) {
      try {
        const updated = await api.changeCampaignStatus(
          id,
          selected.status === "Active" ? "paused" : "active",
        );
        if (updated) setCampaigns((current) => current.map((item) => item.id === id ? mapCampaign(updated) : item));
        setNotice("Campaign state persisted through the control-plane API");
      } catch (error) {
        setNotice(`Campaign update failed: ${String(error)}`);
      }
      return;
    }
    setCampaigns((current) => current.map((campaign) => campaign.id === id ? { ...campaign, status: campaign.status === "Active" ? "Paused" : "Active" } : campaign));
    setNotice("Campaign state changed locally in the offline demo");
  };

  const createCampaign = async (campaign: Campaign) => {
    if (api && sessionRole === "advertiser") {
      try {
        const created = await api.createCampaign({
          name: campaign.name,
          headline: campaign.headline,
          description: campaign.description,
          call_to_action: campaign.cta,
          destination_url: campaign.destinationUrl ?? "https://example.com/",
          bid_cpc_micros: Math.round(campaign.bid * 1_000_000),
          daily_budget_micros: Math.round(campaign.dailyBudget * 1_000_000),
          starts_at: new Date().toISOString(),
        });
        if (created) setCampaigns((current) => [mapCampaign(created), ...current]);
        setShowCampaignForm(false);
        setNotice("Campaign persisted and added to the admin review queue");
        return;
      } catch (error) {
        setNotice(`Campaign creation failed: ${String(error)}`);
        return;
      }
    }
    setCampaigns((current) => [campaign, ...current]);
    setShowCampaignForm(false);
    setNotice("Campaign added only to the offline demo review queue");
  };

  const reviewCampaign = async (id: string, approved: boolean) => {
    if (!api || sessionRole !== "admin") return;
    try {
      await api.reviewCampaign(id, approved);
      await loadAdmin();
      setNotice(approved ? "Campaign approved for delivery" : "Campaign rejected");
    } catch (error) {
      setNotice(`Review failed: ${String(error)}`);
    }
  };

  const recordAdClick = async () => {
    if (liveDecision && api) {
      window.open(liveDecision.ad.destination_url, "_blank", "noopener,noreferrer");
      try {
        await api.recordEvent(
          liveDecision.decision_id,
          "click",
          `${liveDecision.decision_id}:click`,
          liveDecision.tracking.click_token,
        );
        if (sessionRole === "advertiser") await loadAdvertiser();
        setNotice("Click accepted by the idempotent measurement API");
      } catch (error) {
        setNotice(`Destination opened, but measurement failed: ${String(error)}`);
      }
      return;
    }
    setCampaigns((current) => current.map((campaign) => campaign.id === currentAd.id ? { ...campaign, clicks: campaign.clicks + 1, spent: campaign.spent + campaign.bid } : campaign));
    setNotice("Offline demo click recorded locally · no external page was opened");
  };

  const changeRelease = async (action: ReleaseAction) => {
    if (!api || sessionRole !== "admin") return;
    try {
      await api.changeModelRelease(action, action === "start_canary" ? 0.1 : undefined);
      await loadAdmin();
      setNotice(action === "rollback" ? "Candidate rolled back to shadow-only evaluation" : action === "promote" ? "Candidate promoted after passing guardrails" : "10% sticky canary started");
    } catch (error) {
      setNotice(`Release change rejected: ${String(error)}`);
    }
  };

  const createPublisher = async (name: string) => {
    if (!api || sessionRole !== "admin") return;
    try {
      await api.createPublisher(name);
      await loadAdmin();
      setNotice(`Publisher “${name}” created; bind a placement before using its key`);
    } catch (error) {
      setNotice(`Publisher creation failed: ${String(error)}`);
    }
  };

  const issuePublisherKey = async (publisherId: string) => {
    if (!api || sessionRole !== "admin") return;
    if (issuedPublisherKey) {
      setNotice("Store and acknowledge the currently displayed secret before issuing another key");
      return;
    }
    try {
      const issued = await api.issuePublisherKey(
        publisherId,
        `Rotation ${new Date().toISOString().slice(0, 10)}`,
      );
      if (!issued) throw new Error("Key issuance returned no credential");
      setIssuedPublisherKey(issued);
      await loadAdmin();
      setNotice("Publisher key issued; its secret is visible once until acknowledged");
    } catch (error) {
      setNotice(`Publisher key issuance failed: ${String(error)}`);
    }
  };

  const revokePublisherKey = async (keyId: string) => {
    if (!api || sessionRole !== "admin") return;
    if (!window.confirm("Revoke this publisher key now? Requests using it will fail immediately.")) return;
    try {
      await api.revokePublisherKey(keyId);
      if (issuedPublisherKey?.id === keyId) setIssuedPublisherKey(null);
      await loadAdmin();
      setNotice("Publisher key revoked; signed requests now fail closed");
    } catch (error) {
      setNotice(`Publisher key revocation failed: ${String(error)}`);
    }
  };

  const assignDemoPlacement = async (publisherId: string) => {
    if (!api || sessionRole !== "admin") return;
    if (!window.confirm("Move the personal-site banner to this publisher? Existing publisher keys will lose access immediately.")) return;
    try {
      await api.assignPlacementPublisher("placement_personal_site_banner", publisherId);
      await loadAdmin();
      setNotice("Demo banner ownership changed; conversion authorization updated immediately");
    } catch (error) {
      setNotice(`Placement ownership update failed: ${String(error)}`);
    }
  };

  return (
    <div className="-mt-2 space-y-6 pb-12">
      <section className="overflow-hidden rounded-3xl bg-slate-950 text-white shadow-xl shadow-slate-200">
        <div className="border-b border-white/10 px-6 py-5 sm:px-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div><div className="mb-2 flex items-center gap-2 text-sm font-semibold text-emerald-300"><BoltIcon className="h-4 w-4" />Ads AI infrastructure demo</div><h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Meridian Ads Console</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">A text-ad platform connecting campaign management, ranking, delivery, feedback, and operations.</p></div>
            <div className="inline-flex self-start rounded-xl bg-white/10 p-1 sm:self-auto" aria-label={publicShowcaseMode ? "Select showcase view" : "Select role"}>
              {(["advertiser", "admin"] as const).map((option) => (
                <button key={option} type="button" onClick={() => void selectRole(option)} className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${role === option ? "bg-white text-slate-950 shadow-sm" : "text-slate-300 hover:text-white"}`} aria-pressed={role === option}>{publicShowcaseMode ? option === "advertiser" ? "Campaign demo" : "Operations demo" : option}</button>
              ))}
            </div>
          </div>
        </div>
        <div className="grid gap-3 px-6 py-4 text-xs text-slate-300 sm:grid-cols-3 sm:px-8"><div className="flex items-center gap-2"><SignalIcon className={`h-4 w-4 ${liveDecision ? "text-emerald-400" : "text-amber-400"}`} />{publicShowcaseMode ? "Static interface preview" : liveDecision ? "Live decision received" : "Offline decision fallback"}</div><div className="flex items-center gap-2"><CircleStackIcon className={`h-4 w-4 ${api ? "text-emerald-400" : "text-amber-400"}`} />{publicShowcaseMode ? "No public backend connection" : api ? "Measurement API configured" : "In-memory demo state"}</div><div className="flex items-center gap-2"><ClockIcon className="h-4 w-4 text-emerald-400" />{publicShowcaseMode ? "No sign-in or persistent writes" : "Session-scoped visitor identifier"}</div></div>
      </section>

      {!publicShowcaseMode && api && !sessionRole && (
        <form onSubmit={signIn} className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:grid-cols-[1fr_1fr_auto] sm:items-end">
          <label className="text-sm font-medium text-slate-700">{role === "advertiser" ? "Advertiser" : "Admin"} email<input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-1.5 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-emerald-500" /></label>
          <label className="text-sm font-medium text-slate-700">Password<input required minLength={12} type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="mt-1.5 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-emerald-500" placeholder="Demo account password" /></label>
          <button type="submit" className="rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white">Connect workspace</button>
        </form>
      )}

      <section className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 shadow-sm" aria-label="Current advertisement">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-start gap-3"><div className="rounded-lg bg-amber-100 p-2 text-amber-800"><MegaphoneIcon className="h-5 w-5" /></div><div><p className="text-[11px] font-bold uppercase tracking-[0.18em] text-amber-700">Sponsored · {liveDecision ? "API-served placement" : "offline placement preview"}</p><p className="mt-1 text-lg font-semibold text-slate-900">{currentAd.headline}</p><p className="mt-1 text-sm text-slate-600">{currentAd.description}</p></div></div><button type="button" onClick={() => void recordAdClick()} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-amber-200">{currentAd.cta}<ArrowTopRightOnSquareIcon className="h-4 w-4" /></button></div>
      </section>

      <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs text-slate-600 shadow-sm" role="status" aria-live="polite"><ExclamationTriangleIcon className="h-4 w-4 shrink-0 text-amber-600" />{notice}</div>
      {showCampaignForm && role === "advertiser" && <CampaignForm onClose={() => setShowCampaignForm(false)} onCreate={createCampaign} />}
      {role === "advertiser" ? <AdvertiserDashboard campaigns={campaigns} dailyReport={dailyReport} onToggle={(id) => void toggleCampaign(id)} onOpenForm={() => setShowCampaignForm(true)} /> : <AdminDashboard overview={overview} pendingCampaigns={pendingCampaigns} publishers={publishers} issuedPublisherKey={issuedPublisherKey} onReview={(id, approved) => void reviewCampaign(id, approved)} onReleaseAction={(action) => void changeRelease(action)} onCreatePublisher={(name) => void createPublisher(name)} onIssuePublisherKey={(publisherId) => void issuePublisherKey(publisherId)} onRevokePublisherKey={(keyId) => void revokePublisherKey(keyId)} onAssignDemoPlacement={(publisherId) => void assignDemoPlacement(publisherId)} onAcknowledgePublisherSecret={() => setIssuedPublisherKey(null)} />}
    </div>
  );
}
