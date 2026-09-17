import {
  ChartBarSquareIcon,
  CheckCircleIcon,
  CircleStackIcon,
  CpuChipIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

interface EvidenceCount {
  value: number;
  exact: boolean;
  method?: string;
}

interface BinaryMetrics {
  approx_auc: number;
  calibration_error: number;
  examples: number;
  log_loss: number;
  positive_rate: number;
}

interface Availability {
  availability: "included" | "not_included";
  reason?: string;
}

export interface OfflineMlEvidence {
  schema_version: number;
  snapshot_id: string;
  snapshot_at: string;
  snapshot_at_source: string;
  intended_surface: string;
  delivery_mode: string;
  claim_boundaries: string[];
  measurement_classes: {
    criteo_offline_dataset_statistics: Availability & {
      source: string;
      usage: string;
      counts: {
        total_rows: EvidenceCount;
        train_rows: EvidenceCount;
        validation_rows: EvidenceCount;
        replay_rows: EvidenceCount;
        clicked_rows: EvidenceCount;
        converted_rows: EvidenceCount;
        estimated_users: EvidenceCount;
        estimated_campaigns: EvidenceCount;
      };
      chronological_split: Record<"train" | "validation" | "replay", string>;
    };
    criteo_validation_metrics: Availability & {
      usage: string;
      model: {
        model_version: string;
        feature_version: string;
        completed_epochs: number;
        optimizer_steps: number;
      };
      evaluation: {
        rows: number;
        complete_partition: boolean;
        device: string;
        precision: string;
        approx_auc_bin_count: number;
        click: BinaryMetrics;
        conversion_per_impression: BinaryMetrics;
      };
    };
    criteo_historical_replay_metrics: Availability;
    synthetic_product_training_metrics: Availability;
    live_local_product_events: Availability;
    github_pages_static_evidence_snapshot: Availability & { description: string };
    illustrative_ui_simulation: Availability;
  };
  provenance: {
    checkpoint_sha256: string;
    source_dataset_sha256: string;
    manifest: { filename: string; sha256: string };
    validation_report: { filename: string; sha256: string };
  };
}

function formatInteger(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

function formatPercent(value: number, digits = 2) {
  return `${(value * 100).toFixed(digits)}%`;
}

function shortHash(value: string) {
  return `${value.slice(0, 10)}…${value.slice(-8)}`;
}

function MetricCard({
  label,
  metrics,
}: {
  label: string;
  metrics: BinaryMetrics;
}) {
  return (
    <article className="rounded-2xl border border-indigo-100 bg-white p-5 shadow-sm">
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-indigo-700">{label}</p>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
            Approx. AUC
          </p>
          <p className="mt-1 text-2xl font-semibold text-slate-950">
            {metrics.approx_auc.toFixed(4)}
          </p>
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
            Log loss
          </p>
          <p className="mt-1 text-2xl font-semibold text-slate-950">
            {metrics.log_loss.toFixed(4)}
          </p>
        </div>
        <div className="rounded-xl bg-slate-50 px-3 py-2.5">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">ECE</p>
          <p className="mt-1 text-sm font-semibold text-slate-800">
            {metrics.calibration_error.toFixed(4)}
          </p>
        </div>
        <div className="rounded-xl bg-slate-50 px-3 py-2.5">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
            Positive rate
          </p>
          <p className="mt-1 text-sm font-semibold text-slate-800">
            {formatPercent(metrics.positive_rate)}
          </p>
        </div>
      </div>
    </article>
  );
}

export default function OfflineMlLaboratory({ evidence }: { evidence: OfflineMlEvidence }) {
  const dataset = evidence.measurement_classes.criteo_offline_dataset_statistics;
  const validation = evidence.measurement_classes.criteo_validation_metrics;
  const counts = dataset.counts;
  const evaluation = validation.evaluation;
  const totalRows = counts.total_rows.value;
  const splitRows = [
    { label: "Train", value: counts.train_rows.value, color: "bg-indigo-600" },
    { label: "Validation", value: counts.validation_rows.value, color: "bg-sky-500" },
    { label: "Replay", value: counts.replay_rows.value, color: "bg-amber-500" },
  ];
  const excluded = [
    ["Historical replay", evidence.measurement_classes.criteo_historical_replay_metrics],
    ["Synthetic product training", evidence.measurement_classes.synthetic_product_training_metrics],
    ["Live local events", evidence.measurement_classes.live_local_product_events],
    ["Illustrative UI values", evidence.measurement_classes.illustrative_ui_simulation],
  ] as const;
  const snapshotDate = new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "UTC",
  }).format(new Date(evidence.snapshot_at));

  return (
    <section className="mt-2 overflow-hidden rounded-3xl border border-indigo-100 bg-indigo-50/40 shadow-xl shadow-indigo-100/40">
      <div className="border-b border-indigo-100 bg-white px-6 py-7 sm:px-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-indigo-700">
              <CpuChipIcon className="h-4 w-4" /> Offline ML Laboratory
            </div>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
              Reproducible evidence, isolated from live product traffic
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base">
              This section reads a versioned static snapshot generated from the Criteo offline
              dataset manifest and a complete chronological validation run. It does not query the
              local API or represent activity on this website.
            </p>
          </div>
          <div className="shrink-0 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-emerald-800">
              <CheckCircleIcon className="h-5 w-5" /> Verified static snapshot
            </div>
            <p className="mt-1 text-xs text-emerald-700">{snapshotDate} UTC</p>
          </div>
        </div>
      </div>

      <div className="space-y-6 p-6 sm:p-8">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            ["Logged rows", formatInteger(totalRows), "Criteo offline dataset"],
            ["Training rows", formatInteger(counts.train_rows.value), "Days 0–21"],
            ["Validation rows", formatInteger(evaluation.rows), "Complete held-out partition"],
            [
              "Training run",
              `${validation.model.completed_epochs} epochs`,
              `${formatInteger(validation.model.optimizer_steps)} optimizer steps`,
            ],
          ].map(([label, value, detail]) => (
            <article key={label} className="rounded-2xl border border-indigo-100 bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                {label}
              </p>
              <p className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">{value}</p>
              <p className="mt-1 text-xs font-medium text-indigo-700">{detail}</p>
            </article>
          ))}
        </div>

        <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <article className="rounded-2xl border border-indigo-100 bg-white p-6 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="rounded-xl bg-indigo-50 p-2 text-indigo-700">
                <CircleStackIcon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-950">Chronological data split</h3>
                <p className="mt-1 text-sm text-slate-500">
                  No random split; future partitions remain isolated from training.
                </p>
              </div>
            </div>
            <div className="mt-6 flex h-3 overflow-hidden rounded-full bg-slate-100">
              {splitRows.map((partition) => (
                <div
                  key={partition.label}
                  className={partition.color}
                  style={{ width: `${(partition.value / totalRows) * 100}%` }}
                  title={`${partition.label}: ${formatInteger(partition.value)} rows`}
                />
              ))}
            </div>
            <dl className="mt-5 space-y-3">
              {splitRows.map((partition) => (
                <div key={partition.label} className="flex items-center justify-between gap-4 text-sm">
                  <dt className="flex items-center gap-2 text-slate-600">
                    <span className={`h-2.5 w-2.5 rounded-full ${partition.color}`} />
                    {partition.label}
                  </dt>
                  <dd className="font-semibold text-slate-900">
                    {formatInteger(partition.value)} · {formatPercent(partition.value / totalRows, 1)}
                  </dd>
                </div>
              ))}
            </dl>
            <p className="mt-5 rounded-xl bg-slate-50 px-4 py-3 text-xs leading-5 text-slate-600">
              User and campaign cardinalities are HyperLogLog estimates. Row, click, conversion,
              and partition counts are exact.
            </p>
          </article>

          <div className="space-y-4">
            <div className="flex items-start gap-3 px-1">
              <div className="rounded-xl bg-indigo-100 p-2 text-indigo-700">
                <ChartBarSquareIcon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-950">Complete validation partition</h3>
                <p className="mt-1 text-sm text-slate-500">
                  {validation.model.model_version} · {validation.model.feature_version} ·{" "}
                  {evaluation.device.toUpperCase()}/{evaluation.precision.toUpperCase()}
                </p>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <MetricCard label="Click prediction" metrics={evaluation.click} />
              <MetricCard
                label="Conversion per impression"
                metrics={evaluation.conversion_per_impression}
              />
            </div>
            <p className="rounded-xl border border-indigo-100 bg-white px-4 py-3 text-xs leading-5 text-slate-600">
              AUC is a bounded-memory approximation using {formatInteger(evaluation.approx_auc_bin_count)}
              {" "}probability bins. Log loss is computed over every validation example.
              Conversion is per impression—not post-click CVR or production value.
            </p>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <article className="rounded-2xl border border-amber-200 bg-amber-50/60 p-6">
            <div className="flex items-start gap-3">
              <ExclamationTriangleIcon className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" />
              <div>
                <h3 className="font-semibold text-slate-950">Evidence boundaries</h3>
                <p className="mt-1 text-sm text-slate-600">
                  Missing evidence stays missing rather than being replaced with demo values.
                </p>
              </div>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {excluded.map(([label, item]) => (
                <div key={label} className="rounded-xl border border-amber-100 bg-white px-4 py-3">
                  <p className="text-sm font-semibold text-slate-900">{label}</p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">{item.reason}</p>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="font-semibold text-slate-950">Snapshot provenance</h3>
            <p className="mt-1 text-sm text-slate-500">
              Public-safe projection with immutable source references.
            </p>
            <dl className="mt-5 space-y-3 text-xs">
              {[
                ["Snapshot", evidence.snapshot_id],
                ["Manifest", shortHash(evidence.provenance.manifest.sha256)],
                ["Validation", shortHash(evidence.provenance.validation_report.sha256)],
                ["Checkpoint", shortHash(evidence.provenance.checkpoint_sha256)],
              ].map(([label, value]) => (
                <div key={label} className="flex items-start justify-between gap-4 border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                  <dt className="font-semibold text-slate-500">{label}</dt>
                  <dd className="break-all text-right font-mono text-slate-700">{value}</dd>
                </div>
              ))}
            </dl>
            <a
              href="/data/ads-ai-offline-evidence-v1.json"
              className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-indigo-700 hover:text-indigo-900"
            >
              Inspect the static JSON <span aria-hidden="true">→</span>
            </a>
          </article>
        </div>
      </div>
    </section>
  );
}
