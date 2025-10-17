-- sentiments table
create table if not exists public.sentiments (
    id bigserial primary key,
    ticker text not null,
    source text not null check (source in ('news', 'tweet')),
    text_hash text,
    sentiment text not null check (sentiment in ('positive', 'neutral', 'negative')),
    score numeric,
    meta jsonb default '{}'::jsonb,
    created_at timestamptz not null default now()
);
create index if not exists idx_sentiments_ticker on public.sentiments (ticker);
create index if not exists idx_sentiments_created_at on public.sentiments (created_at desc);
create index if not exists idx_sentiments_ticker_time on public.sentiments (ticker, created_at desc);
create index if not exists idx_sentiments_source on public.sentiments (source);
-- aggregated 15-min view
create or replace view public.sentiment_15m as
select ticker,
    date_trunc('minute', created_at) - (
        (
            extract(
                minute
                from created_at
            )::int % 15
        )
    ) * interval '1 minute' as bucket_15m,
    avg(score) as avg_score,
    count(*) as n_samples,
    sum(
        case
            when sentiment = 'positive' then 1
            else 0
        end
    ) as n_pos,
    sum(
        case
            when sentiment = 'neutral' then 1
            else 0
        end
    ) as n_neu,
    sum(
        case
            when sentiment = 'negative' then 1
            else 0
        end
    ) as n_neg
from public.sentiments
group by 1,
    2
order by 2 desc;
-- helper function for quick aggregates
create or replace function public.get_sentiment_window(p_ticker text, p_hours int) returns table(
        bucket_5m timestamptz,
        avg_score numeric,
        n_samples int
    ) language sql stable as $$
select date_trunc('minute', created_at) - (
        (
            extract(
                minute
                from created_at
            )::int % 5
        )
    ) * interval '1 minute' as bucket_5m,
    avg(score) as avg_score,
    count(*) as n_samples
from public.sentiments
where ticker = p_ticker
    and created_at >= now() - (p_hours || ' hours')::interval
group by 1
order by 1 desc $$;