import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useDashboard } from "../../context/DashboardContext.jsx";
import Card from "../ui/Card.jsx";

// We have removed the 'fakeHistory' object from this file.

export default function SentimentChart({ className, items = [] }){
  // 1. Get the full activeStock object from the context
  const { activeStock } = useDashboard();

  // 2. Get the history and sentiment from the activeStock
  const chartData = activeStock?.history || [];
  const stockColor = activeStock?.sentiment > 0 ? "var(--color-accent)" : "#f87171";

  return (
    <Card
      title=""  
      subtitle=""
      className={className}
    >
    <div className="mt-8">
      <h2 className="text-2xl font-semibold text-white">
        Sentiment History: {activeStock?.symbol || "..."}
      </h2>
      <div className="mt-4 w-full h-72  rounded-xl p-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{
              top: 5,
              right: 30,
              left: 0,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
            <XAxis dataKey="time" stroke="#cbd5e1" />
            <YAxis domain={[-1, 1]} stroke="#cbd5e1" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1e293b",
                border: "none",
                borderRadius: "8px",
              }}
              labelStyle={{ color: "#cbd5e1" }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="sentiment"
              stroke={stockColor}
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
    </Card>
  );
};


