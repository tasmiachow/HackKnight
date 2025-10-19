import React from "react";
import Card from "../ui/Card.jsx";

export default function OverallSentiment({ className }) {
  // placeholder stats – swap with real values
  const overall = { score: 0.27, bullRatio: 0.62, articles: 348 };

  return (
    <Card title="Overall Sentiment" className={className}>
      <div className="space-y-5">
        <div>
          <div className="text-4xl font-bold text-white">
            {overall.score > 0 ? "+" : ""}{overall.score.toFixed(2)}
          </div>
          <p className="text-slate-300/80 text-sm">Aggregate market mood</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-white/5 border border-white/10 p-3">
            <div className="text-xs text-slate-300/70">Bull/Bear</div>
            <div className="text-lg font-semibold">{Math.round(overall.bullRatio * 100)}% / {100 - Math.round(overall.bullRatio * 100)}%</div>
          </div>
          <div className="rounded-lg bg-white/5 border border-white/10 p-3">
            <div className="text-xs text-slate-300/70">Articles</div>
            <div className="text-lg font-semibold">{overall.articles}</div>
          </div>
        </div>

        <div className="text-xs text-slate-400">
          Updated <span className="text-slate-200">just now</span>
        </div>
      </div>
    </Card>
  );
}
