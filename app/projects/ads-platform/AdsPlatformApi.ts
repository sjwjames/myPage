export type ApiRole = "advertiser" | "admin";

export interface ApiCampaign {
  id: string;
  name: string;
  status: "pending_review" | "active" | "paused" | "rejected";
  bid_cpc_micros: number;
  daily_budget_micros: number;
  ad: null | {
    id: string;
    headline: string;
    description: string;
    call_to_action: string;
    destination_url: string;
  };
  statistics: {
    decisions: number;
    impressions: number;
    clicks: number;
    conversions: number;
    ctr: number;
    conversion_rate: number;
    conversion_value_micros: number;
    spend_micros: number;
    budget_capped_clicks: number;
  };
  reporting?: {
    source: "async_projection";
    state: "current" | "lagging" | "blocked";
    as_of: string | null;
    pending_messages: number;
    retrying_messages: number;
    dead_lettered_messages: number;
    oldest_pending_at: string | null;
    lag_seconds: number;
  };
}

export interface ApiDailyReport {
  start_date: string;
  end_date: string;
  timezone: "UTC";
  reporting: {
    source: "async_daily_projection";
    state: "current" | "lagging" | "blocked";
    as_of: string | null;
    pending_messages: number;
    retrying_messages: number;
    dead_lettered_messages: number;
    oldest_pending_at: string | null;
    lag_seconds: number;
  };
  rows: Array<{
    campaign_id: string;
    campaign_name: string;
    date: string;
    statistics: ApiCampaign["statistics"];
  }>;
}

export interface ApiReportingProjection {
  consumer: string;
  state: "current" | "lagging" | "blocked";
  pending_messages: number;
  retrying_messages: number;
  dead_lettered_messages: number;
  decisions: number;
  impressions: number;
  clicks: number;
  conversions: number;
  ctr: number;
  conversion_rate: number;
  conversion_value_micros: number;
  spend_micros: number;
  budget_capped_clicks: number;
  worker: {
    state: "missing" | "running" | "stale" | "error" | "stopped";
    healthy: boolean;
    worker_id: string | null;
    consumer_name: string;
    worker_type: string | null;
    process_status: "running" | "stopped" | "error" | null;
    started_at: string | null;
    last_seen_at: string | null;
    heartbeat_age_seconds: number | null;
    stale_after_seconds: number;
    pending_messages: number | null;
    last_batch: null | {
      claimed: number;
      applied: number;
      ignored: number;
      failed: number;
      dead_lettered: number;
    };
    totals: null | { batches: number; applied: number; failed: number };
    last_error: string | null;
  };
}

export interface ApiPublisherKey {
  id: string;
  publisher_id: string;
  label: string;
  encryption_key_id: string;
  status: "active" | "expired" | "revoked";
  secret_fingerprint: string;
  expires_at: string | null;
  revoked_at: string | null;
  last_used_at: string | null;
  created_at: string;
}

export interface ApiPublisher {
  id: string;
  name: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  placements: Array<{ id: string; name: string; is_active: boolean }>;
  keys: ApiPublisherKey[];
}

export interface ApiIssuedPublisherKey extends ApiPublisherKey {
  secret: string;
  secret_disclosure: "one_time";
}

export interface ApiOverview {
  model_version: string;
  campaigns: number;
  active_campaigns: number;
  decisions: number;
  impressions: number;
  clicks: number;
  conversions: number;
  ctr: number;
  conversion_rate: number;
  conversion_value_micros: number;
  spend_micros: number;
  budget_capped_clicks: number;
  budget_reservations: {
    active: number;
    active_micros: number;
    consumed_today_micros: number;
    awaiting_expiry_sweep: number;
    ttl_seconds: number;
  };
  traffic_quality: {
    quarantined_events: number;
    primary_reason_counts: Record<string, number>;
    minimum_click_delay_ms: number;
    maximum_conversion_value_micros: number;
  };
  tracking_security: {
    active_key_id: string;
    verification_key_count: number;
    rotation_enabled: boolean;
    legacy_v1_verification_enabled: boolean;
    publisher_conversion_signatures_enabled: boolean;
    publisher_encryption_active_key_id: string | null;
    publisher_encryption_key_count: number;
    publisher_keys_pending_reencryption: number;
    publisher_keys_with_unavailable_encryption_key: number;
    publisher_count: number;
    active_publisher_count: number;
    publisher_verification_key_count: number;
    publisher_revoked_key_count: number;
    publisher_expired_key_count: number;
  };
  serving_telemetry: {
    window_limit: number;
    attempts: number;
    outcomes: Record<string, number>;
    fill_rate: number;
    error_rate: number;
    retrieval_saturation_rate: number;
    mean_retrieved_candidates: number;
    mean_eligible_candidates: number;
    p50_precommit_latency_ms: number;
    p95_precommit_latency_ms: number;
    p99_precommit_latency_ms: number;
    mean_stage_latency_ms: {
      retrieval: number;
      feature: number;
      primary_inference: number;
      budget: number;
    };
    candidate_pool_limit: number;
  };
  pending_outbox_messages: number;
  model_release: {
    primary_model_version: string;
    candidate_model_version: string | null;
    mode: "shadow" | "canary" | "promoted";
    canary_fraction: number;
    revision: number;
    stale_persisted_state: boolean;
    updated_at: string | null;
  };
  release_circuit_breaker: {
    window: number;
    minimum_attempts: number;
    maximum_error_rate: number;
    maximum_p95_latency_ms: number;
    last_trip_at: string | null;
    last_trip_details: null | {
      reasons?: string[];
      previous_mode?: string;
      error_rate?: number;
      p95_latency_ms?: number;
    };
  };
  shadow_evaluation: {
    enabled: boolean;
    model_version: string | null;
    attempted_decisions: number;
    successful_decisions: number;
    errors: number;
    error_rate: number;
    selection_disagreements: number;
    selection_disagreement_rate: number;
    mean_selected_score_delta: number;
    mean_latency_ms: number;
    p95_latency_ms: number;
    labeled_impressions: number;
    canary_labeled_impressions: number;
    primary_click_log_loss: number | null;
    shadow_click_log_loss: number | null;
    canary_ready: boolean;
    canary_blockers: string[];
    promotion_ready: boolean;
    promotion_blockers: string[];
    guardrails: {
      minimum_samples: number;
      minimum_canary_samples: number;
      maximum_error_rate: number;
      maximum_p95_latency_ms: number;
      maximum_log_loss_regression: number;
    };
  };
  local_shadow_diagnostic: {
    scope: "local_personal_site_browser";
    provenance: string;
    attempted_decisions: number;
    successful_decisions: number;
    labeled_impressions: number;
    observed_clicks: number;
    errors: number;
    error_rate: number;
    p95_latency_ms: number;
    primary_click_log_loss: number | null;
    shadow_click_log_loss: number | null;
    ready: boolean;
    blockers: string[];
    guardrails: {
      minimum_samples: number;
      minimum_labeled_impressions: number;
      maximum_error_rate: number;
      maximum_p95_latency_ms: number;
      maximum_log_loss_regression: number;
    };
    release_authority: false;
  };
  reporting_projection: ApiReportingProjection;
  daily_reporting_projection: ApiReportingProjection;
}

export interface ApiDecision {
  decision_id: string;
  request_id: string;
  model_version: string;
  release_mode: "shadow" | "canary" | "promoted";
  routed_to_candidate: boolean;
  traffic_origin:
    | "local_personal_site_browser"
    | "declared_personal_site_unverified"
    | "direct_api_or_unknown"
    | "legacy_unclassified";
  traffic_origin_verification: string;
  predicted_ctr: number;
  expected_value_micros: number;
  budget_reservation: null | {
    reserved_micros: number;
    status: "active" | "consumed" | "expired";
    expires_at: string;
  };
  tracking: {
    impression_token: string;
    click_token: string;
    conversion_token: string;
  };
  ad: {
    id: string;
    campaign_id: string;
    headline: string;
    description: string;
    call_to_action: string;
    destination_url: string;
  };
}

export interface ApiCampaignCreate {
  name: string;
  headline: string;
  description: string;
  call_to_action: string;
  destination_url: string;
  bid_cpc_micros: number;
  daily_budget_micros: number;
  starts_at: string;
}

export class AdsPlatformApi {
  private token: string | null = null;

  constructor(private readonly baseUrl: string) {}

  private async request<T>(path: string, init: RequestInit = {}): Promise<T | null> {
    const headers = new Headers(init.headers);
    if (init.body) headers.set("Content-Type", "application/json");
    if (this.token) headers.set("Authorization", `Bearer ${this.token}`);
    const response = await fetch(`${this.baseUrl}${path}`, { ...init, headers });
    if (response.status === 204) return null;
    if (!response.ok) {
      const body = await response.json().catch(() => null);
      const detail = body && typeof body.detail === "string"
        ? body.detail
        : body?.detail?.message ?? response.statusText;
      const blockers = Array.isArray(body?.detail?.blockers)
        ? `: ${body.detail.blockers.join("; ")}`
        : "";
      throw new Error(`${response.status}: ${detail}${blockers}`);
    }
    return response.json() as Promise<T>;
  }

  async login(email: string, password: string): Promise<ApiRole> {
    const response = await this.request<{
      access_token: string;
      user: { role: ApiRole };
    }>("/v1/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    if (!response) throw new Error("Login returned no session");
    this.token = response.access_token;
    return response.user.role;
  }

  async logout(): Promise<void> {
    try {
      if (this.token) await this.request<never>("/v1/auth/logout", { method: "POST" });
    } finally {
      this.token = null;
    }
  }

  listCampaigns(): Promise<ApiCampaign[] | null> {
    return this.request<ApiCampaign[]>("/v1/advertiser/campaigns");
  }

  dailyReport(): Promise<ApiDailyReport | null> {
    return this.request<ApiDailyReport>("/v1/advertiser/reports/daily");
  }

  createCampaign(payload: ApiCampaignCreate): Promise<ApiCampaign | null> {
    return this.request<ApiCampaign>("/v1/advertiser/campaigns", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  changeCampaignStatus(id: string, status: "active" | "paused"): Promise<ApiCampaign | null> {
    return this.request<ApiCampaign>(`/v1/advertiser/campaigns/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  }

  pendingCampaigns(): Promise<ApiCampaign[] | null> {
    return this.request<ApiCampaign[]>("/v1/admin/campaigns/pending");
  }

  reviewCampaign(id: string, approved: boolean): Promise<ApiCampaign | null> {
    return this.request<ApiCampaign>(`/v1/admin/campaigns/${id}/review`, {
      method: "PATCH",
      body: JSON.stringify({ approved }),
    });
  }

  overview(): Promise<ApiOverview | null> {
    return this.request<ApiOverview>("/v1/admin/overview");
  }

  publishers(): Promise<ApiPublisher[] | null> {
    return this.request<ApiPublisher[]>("/v1/admin/publishers?limit=100");
  }

  createPublisher(name: string): Promise<ApiPublisher | null> {
    return this.request<ApiPublisher>("/v1/admin/publishers", {
      method: "POST",
      body: JSON.stringify({ name, placement_ids: [] }),
    });
  }

  assignPlacementPublisher(
    placementId: string,
    publisherId: string,
  ): Promise<{ publisher_id: string } | null> {
    return this.request<{ publisher_id: string }>(
      `/v1/admin/placements/${placementId}/publisher`,
      {
        method: "PATCH",
        body: JSON.stringify({ publisher_id: publisherId }),
      },
    );
  }

  issuePublisherKey(
    publisherId: string,
    label: string,
  ): Promise<ApiIssuedPublisherKey | null> {
    return this.request<ApiIssuedPublisherKey>(`/v1/admin/publishers/${publisherId}/keys`, {
      method: "POST",
      body: JSON.stringify({ label }),
    });
  }

  revokePublisherKey(keyId: string): Promise<ApiPublisherKey | null> {
    return this.request<ApiPublisherKey>(`/v1/admin/publisher-keys/${keyId}/revoke`, {
      method: "POST",
    });
  }

  changeModelRelease(
    action: "start_canary" | "promote" | "rollback",
    canaryFraction?: number,
  ): Promise<ApiOverview["model_release"] | null> {
    return this.request<ApiOverview["model_release"]>("/v1/admin/model-release", {
      method: "PATCH",
      body: JSON.stringify({
        action,
        ...(canaryFraction === undefined ? {} : { canary_fraction: canaryFraction }),
      }),
    });
  }

  decide(requestId: string, visitorId: string): Promise<ApiDecision | null> {
    return this.request<ApiDecision>("/v1/ad-decisions", {
      method: "POST",
      body: JSON.stringify({
        request_id: requestId,
        placement_id: "placement_personal_site_banner",
        visitor_id: visitorId,
        source: "personal_site",
      }),
    });
  }

  recordEvent(
    decisionId: string,
    eventType: "impression" | "click" | "conversion",
    idempotencyKey: string,
    trackingToken: string,
    conversionValueMicros?: number,
  ): Promise<{ accepted: boolean; duplicate: boolean } | null> {
    return this.request<{ accepted: boolean; duplicate: boolean }>("/v1/events", {
      method: "POST",
      body: JSON.stringify({
        idempotency_key: idempotencyKey,
        decision_id: decisionId,
        event_type: eventType,
        occurred_at: new Date().toISOString(),
        tracking_token: trackingToken,
        ...(conversionValueMicros === undefined
          ? {}
          : { conversion_value_micros: conversionValueMicros }),
      }),
    });
  }
}
