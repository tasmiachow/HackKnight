import React from "react";
import { Link } from "react-router-dom";
// 1. Import our new custom hook
import { useDashboard } from "../../context/DashboardContext.jsx";

const Watchlist = () => {
  // 2. Get the state and functions from the context
  const { watchlist, activeStock, setActiveStock } = useDashboard();

  return (
    <div className="w-full h-full bg-slate-900 border-r border-slate-700 flex flex-col p-4">
      <h2 className="text-2xl font-bold text-white mb-6">My Watchlist</h2>

      {/* Stock Search Bar */}
      <div>
        <input
          type="text"
          placeholder="Add ticker (e.g., GOOG)"
          className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
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
                ? "bg-cyan-600 shadow-lg"
                : "bg-slate-800 hover:bg-slate-700"
            }`}
          >
            <span className="text-lg font-medium text-white">
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

      {/* Logout Button at the bottom */}
      <div className="mt-auto">
        <Link
          to="/logout"
          onClick={() => console.log("Log out")}
          className="block text-center w-full px-4 py-3 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-md transition-colors"
        >
          Log Out
        </Link>
      </div>
    </div>
  );
};

export default Watchlist;
