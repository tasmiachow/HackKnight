import React from "react";
import Card from "../ui/Card.jsx";
import { useEffect, useState } from "react";
import { useSession } from "../../useSession";
import BACKEND_URL from "../../config.js";

export default function OverallSentiment({ className }) {
  // placeholder stats – swap with real values
  const [overall, setOverall] = useState(null);
  const [loading, setLoading] = useState(true);
  const session = useSession();


  useEffect(() => {
    const fetchOverall = async () => {
      if (!session?.user) return;
      setLoading(true);

      try {
        const res = await fetch(
          `${BACKEND_URL}/sentiment/overall/${session.user.id}`
        );

        const data = await res.json();

        if (res.ok) {
          setOverall(data);
        } else {
          console.error("Backend error:", data);
          setOverall({ score: 0, bullRatio: 0, articles: 0 });
        }
      } catch (err) {
        console.error("Error fetching sentiment:", err);
        setOverall({ score: 0, bullRatio: 0, articles: 0 });
      } finally {
        setLoading(false);
      }
    };

    fetchOverall();
  }, [session]);
  
  if (loading || !overall) {
    return (
      <Card title="Overall Sentiment" className={className}>
        <p className="text-slate-400 text-sm">Loading overall sentiment...</p>
      </Card>
    );
  }



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
