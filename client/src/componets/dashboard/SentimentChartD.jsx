import React from "react";
import Card from "../ui/Card.jsx";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";
import { useDashboard } from "../../context/DashboardContext.jsx";

export default function SentimentSnapshot({ className }) {
  const { activeStock } = useDashboard();
  const data = activeStock?.history || [];
  const color = activeStock?.sentiment > 0 ? "#4ade80" : "#f87171";

  return (
    <Card
      title="Sentiment Snapshot"
      subtitle={activeStock?.symbol ? `Ticker: ${activeStock.symbol}` : "Pick a ticker in the sidebar"}
      className={className}
    >
      {/* Give the chart a real height for ResponsiveContainer */}
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 24, left: 0, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
            <XAxis dataKey="time" stroke="#cbd5e1" />
            <YAxis domain={[-1, 1]} stroke="#cbd5e1" />
            <Tooltip
              contentStyle={{ backgroundColor: "#0f172a", border: "none", borderRadius: 8 }}
              labelStyle={{ color: "#e2e8f0" }}
            />
            <Legend />
            <Line type="monotone" dataKey="sentiment" stroke={color} strokeWidth={3} dot={{ r: 3 }} activeDot={{ r: 5 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
