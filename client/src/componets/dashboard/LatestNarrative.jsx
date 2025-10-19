import React from "react";
import Card from "../ui/Card.jsx";

export default function LatestNarrative({ className, items = [] }) {
  // Example fallback content – replace with your API data
  const data = items.length
    ? items
    : [
        {
          id: 1,
          title: "Tech leads rally on upbeat guidance",
          summary:
            "Semis and cloud lifted indices as guidance topped expectations.",
          source: "Bloomberg",
          time: "15m ago",
        },
        {
          id: 2,
          title: "Energy dips as crude cools",
          summary:
            "WTI pullback weighed on majors; refiners held up on crack spreads.",
          source: "Reuters",
          time: "32m ago",
        },
        {
          id: 3,
          title: "Yields ease after dovish remarks",
          summary:
            "Fed commentary nudged the curve lower; growth outperformed value.",
          source: "WSJ",
          time: "1h ago",
        },
      ];

  return (
    <Card
      title="Latest Narrative"
      subtitle="AI-generated summaries from recent headlines"
      className={className}
    >
      <ul className="space-y-4">
        {data.map((n) => (
          <li
            key={n.id}
            className="rounded-lg border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition"
          >
            <h3 className="text-base md:text-lg font-semibold text-white">
              {n.title}
            </h3>
            <p className="mt-1 text-sm text-slate-300">{n.summary}</p>
            <div className="mt-2 text-xs text-slate-400">
              <span className="mr-2">{n.source}</span>·{" "}
              <span className="ml-2">{n.time}</span>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}
