import React from "react";
import { Link } from "react-router-dom";
// 1. Import our new custom hook
import { useDashboard } from "../../context/DashboardContext.jsx";
import Card from "../ui/Card.jsx";

export default function Watchlist ({ className, items = [] }) {
  // 2. Get the state and functions from the context
  const { watchlist, activeStock, setActiveStock } = useDashboard();

  return (
    <Card
      title="My Watchlist"
      subtitle=""
      className={className}
    >
    <div className="w-full h-full flex flex-col p-4">
    

      {/* Stock Search Bar */}
      <div>
        <input
          type="text"
          placeholder="Add ticker (e.g., GOOG)"
          className="w-full px-3 py-2 bg-[var(--color-green-slate-1)] border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />
      </div>

      {/* 3. List of Stocks (from context) */}
      <ul className="flex-grow mt-6 space-y-3 overflow-y-auto">
        {watchlist.map((stock) => (
          <li
            key={stock.id}
            // 4. On click, set this as the active stock
            onClick={() => setActiveStock(stock)}
            // 5. Highlight the active stock with a different background
            className={`flex justify-between items-center p-3 rounded-md cursor-pointer transition-all ${
              activeStock?.id === stock.id
                ? "bg-[var(--color-green-slate-2)] border border-[var(--color-accent)] shadow-inner"
                : "bg-[var(--color-background-end)] hover:bg-[var(--color-green-slate-2)]"
            }`}
          >
            <span className="text-lg font-medium text-white ">
              {stock.symbol}
            </span>
            <span
              className={`w-3 h-3 rounded-full ${
                stock.sentiment > 0 ? "bg-green-400" : "bg-red-500"
              }`}
            ></span>
          </li>
        ))}
      </ul>

      
    </div>
    </Card>
  );
};
