"use client";
import * as React from "react";
import Header from "../components/NewGamingPlatform/Header";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useOfflineSync } from "@/hooks/useOfflineSync";

const HomePage: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const [games, setGames] = useState<any[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [showGenres, setShowGenres] = useState(false);
  const [page, setPage] = useState(1);
  const { isOnline, serverUp, flushQueue } = useOfflineSync();
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const pageSize = 8;

  // Mount control to avoid hydration errors
  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchGames = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/games`)
;
      const data = await res.json();
      setGames(data);
    } catch (err) {
      console.error("Failed to fetch games:", err);
    }
  };

  useEffect(() => {
    (async () => {
      if (isOnline && serverUp) await flushQueue();
      fetchGames();
    })();
  }, [isOnline, serverUp]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && page * pageSize < games.length) {
        setPage((prev) => prev + 1);
      }
    });

    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current);
    };
  }, [games.length, page]);

  useEffect(() => {
    socketRef.current = new WebSocket("ws://localhost:8080");
    socketRef.current.onmessage = (event) => {
      try {
        const newGame = JSON.parse(event.data);
        setGames((prevGames) => {
          const exists = prevGames.some((game) => game.id === newGame.id);
          return exists ? prevGames : [...prevGames, newGame];
        });
      } catch (err) {
        console.error("WebSocket message error:", err);
      }
    };

    return () => socketRef.current?.close();
  }, []);

  const filteredGames = selectedGenre
    ? games.filter((game) => game.Genre?.name === selectedGenre)
    : games;

  const displayedGames = filteredGames.slice(0, page * pageSize);

  const genreCounts = games.reduce((acc: Record<string, number>, game) => {
    const genreName = game.Genre?.name;
    if (!genreName) return acc;
    acc[genreName] = (acc[genreName] || 0) + 1;
    return acc;
  }, {});

  const avgPricePerGenre = games.reduce((acc: Record<string, { total: number; count: number }>, game) => {
    const genreName = game.Genre?.name;
    if (!genreName) return acc;
    if (!acc[genreName]) acc[genreName] = { total: 0, count: 0 };
    acc[genreName].total += game.price;
    acc[genreName].count += 1;
    return acc;
  }, {});

  const avgPriceData = Object.entries(avgPricePerGenre).map(([genre, data]) => ({
    genre,
    avgPrice: (data.total / data.count).toFixed(2),
  }));

  const genreData = Object.entries(genreCounts).map(([genre, count]) => ({ genre, count }));

  if (!mounted) return null;

  return (
    <main className="px-10 py-0 mx-auto max-w-none min-h-screen bg-zinc-800">
      <Header onGenresClick={() => setShowGenres(!showGenres)} />

      {!isOnline && <p className="text-yellow-400 mt-4">⚠️ You are currently offline</p>}
      {!serverUp && <p className="text-red-400">🚫 Server is down</p>}

      {showGenres && (
        <div className="flex flex-wrap justify-center gap-3 mt-4">
          {["All", "Horror", "Survival", "Action", "Puzzle", "Sports", "Strategy", "Shooter"].map((genre) => (
            <button
              key={genre}
              onClick={() => {
                setSelectedGenre(genre === "All" ? null : genre);
                setShowGenres(false);
                setPage(1);
              }}
              className={`px-6 py-3 text-lg font-medium text-white bg-black rounded-lg ${
                selectedGenre === genre ? "bg-gray-700" : ""
              } transition hover:bg-gray-600`}
            >
              {genre}
            </button>
          ))}
        </div>
      )}

      <h1 className="text-white text-3xl font-bold mt-10">
        {selectedGenre ? `${selectedGenre} Games` : "All Games"}
      </h1>

      {displayedGames.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6 mt-6">
          {displayedGames.map((game) => (
            <div
              key={game.id}
              className="overflow-hidden rounded-lg cursor-pointer bg-gray-800 p-2 hover:scale-105 transition"
              onClick={() => router.push(`/game/${game.id}`)}
            >
              <img
                src={game.imageUrl}
                alt={game.name}
                className="w-full h-80 object-cover rounded-lg"
              />
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 mt-4">No games found.</p>
      )}

      <div ref={loaderRef} className="h-10" />

      <div className="mt-8 text-white">
        <h2 className="text-2xl font-bold mb-4">Game Statistics</h2>

        <div className="mb-8">
          <h3 className="text-xl font-semibold">Games Per Genre</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={genreData} dataKey="count" nameKey="genre" cx="50%" cy="50%" outerRadius={100} label>
                {genreData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#D32F2F", "#7B1FA2", "#388E3C"][index % 7]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

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

        <div className="mb-8">
          <h3 className="text-xl font-semibold">Price Distribution of Games</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={games.map((game) => ({ name: game.name, price: game.price }))}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="price" fill="#FF8042" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </main>
  );
};

export default HomePage;
