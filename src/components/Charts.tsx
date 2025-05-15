"use client";
import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface Game {
  id: number;
  name: string;
  genre: string;
  price: number;
}

// Colors for charts
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#D32F2F", "#7B1FA2", "#388E3C"];

const Charts: React.FC = () => {
  const [games, setGames] = useState<Game[]>([]);

  useEffect(() => {
    const fetchGames = () => {
      const savedGames = localStorage.getItem("games");
      if (savedGames) {
        setGames(JSON.parse(savedGames));
      }
    };

    fetchGames();
    window.addEventListener("storage", fetchGames); // Listen for localStorage updates

    return () => {
      window.removeEventListener("storage", fetchGames);
    };
  }, []);

  // Calculate Data
  const genreCounts = games.reduce((acc: Record<string, number>, game) => {
    acc[game.genre] = (acc[game.genre] || 0) + 1;
    return acc;
  }, {});

  const avgPricePerGenre = games.reduce((acc: Record<string, { total: number; count: number }>, game) => {
    if (!acc[game.genre]) acc[game.genre] = { total: 0, count: 0 };
    acc[game.genre].total += game.price;
    acc[game.genre].count += 1;
    return acc;
  }, {});

  const avgPriceData = Object.entries(avgPricePerGenre).map(([genre, data]) => ({
    genre,
    avgPrice: (data.total / data.count).toFixed(2),
  }));

  const genreData = Object.entries(genreCounts).map(([genre, count]) => ({ genre, count }));

  return (
    <div className="mt-8 text-white">
      <h2 className="text-2xl font-bold mb-4">Game Statistics</h2>

      {/* Games per Genre */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold">Games Per Genre</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={genreData} dataKey="count" nameKey="genre" cx="50%" cy="50%" outerRadius={100} label>
              {genreData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Average Price Per Genre */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold">Average Price Per Genre</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={avgPriceData}>
            <XAxis dataKey="genre" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="avgPrice" fill="#0088FE" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Charts;
