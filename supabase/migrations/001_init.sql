-- Drop/replace previous objects if they exist (safe for dev)
drop view if exists public.sentiment_15m cascade;
drop function if exists public.get_sentiment_window(text, int) cascade;
drop table if exists public.sentiments cascade;

-- -----------------------------------------------------------------------------
-- Core table: one row per /analyze call (overall snapshot for a ticker)
-- -----------------------------------------------------------------------------
create table if not exists public.sentiment_snapshots (
  id            bigserial primary key,
  ticker        text not null,
  overall_sentiment text not null check (overall_sentiment in ('positive','neutral','negative')),
  score         numeric not null,
  summary       text,
  -- optional: store the raw headlines you analyzed for traceability (JSON array of strings)
  context_headlines jsonb default '[]'::jsonb,
  created_at    timestamptz not null default now()
);

-- Helpful indexes for time-series & ticker filters
create index if not exists idx_snapshots_ticker on public.sentiment_snapshots (ticker);
create index if not exists idx_snapshots_created_at on public.sentiment_snapshots (created_at desc);
create index if not exists idx_snapshots_ticker_time on public.sentiment_snapshots (ticker, created_at desc);

-- -----------------------------------------------------------------------------
-- 15-minute bucketed view (good for smoothing charts)
-- -----------------------------------------------------------------------------
create or replace view public.sentiment_snapshots_15m as
select
  ticker,
  /* floor timestamps to 15-minute buckets */
  date_trunc('minute', created_at)
    - ( (extract(minute from created_at)::int % 15) ) * interval '1 minute' as bucket_15m,
  avg(score)       as avg_score,
  count(*)         as n_samples,
  sum(case when overall_sentiment='positive' then 1 else 0 end) as n_pos,
  sum(case when overall_sentiment='neutral'  then 1 else 0 end) as n_neu,
  sum(case when overall_sentiment='negative' then 1 else 0 end) as n_neg
from public.sentiment_snapshots
group by 1, 2
order by 2 desc;

-- -----------------------------------------------------------------------------
-- Helper: get a rolling window aggregated to 5-min buckets for a single ticker
-- Use this for your line chart (smooth but still responsive)
-- -----------------------------------------------------------------------------
create or replace function public.get_sentiment_window(
  p_ticker text,
  p_hours  int
)
returns table(
  bucket_5m timestamptz,
  avg_score numeric,
  n_samples int
) language sql stable as $$
  select
    date_trunc('minute', created_at)
      - ( (extract(minute from created_at)::int % 5) ) * interval '1 minute' as bucket_5m,
    avg(score)  as avg_score,
    count(*)    as n_samples
  from public.sentiment_snapshots
  where ticker = p_ticker
    and created_at >= now() - (p_hours || ' hours')::interval
  group by 1
  order by 1 asc
$$;
