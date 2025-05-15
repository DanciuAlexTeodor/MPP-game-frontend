"use client";

import { useOfflineSync } from "@/hooks/useOfflineSync";
import * as React from "react";
import Header from "./NewGamingPlatform/Header";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function AddGameForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const gameId = searchParams.get("id");

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [genre, setGenre] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; description?: string; price?: string }>({});
  const { isOnline, serverUp, queueRequest, flushQueue } = useOfflineSync();

  const genres = ["Horror", "Survival", "Action", "Puzzle", "Sports", "Strategy", "Shooter"];

  useEffect(() => {
    if (isOnline && serverUp) {
      flushQueue();
    }
  }, [isOnline, serverUp, flushQueue]);

  useEffect(() => {
    const fetchGame = async () => {
      if (!gameId) return;

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/games`);
        const data = await res.json();
        const existingGame = data.find((g: any) => g.id === parseInt(gameId));

        if (existingGame) {
          setName(existingGame.name);
          setDescription(existingGame.description);
          setGenre(existingGame.Genre?.name || "");
          setImageUrl(existingGame.imageUrl);
          setPrice(existingGame.price);
          setIsEditing(true);
        }
      } catch (err) {
        console.error("Failed to load game:", err);
      }
    };

    fetchGame();
  }, [gameId]);

  const validateInputs = () => {
    const newErrors: { name?: string; description?: string; price?: string } = {};

    if (!name.match(/^[A-Z]/)) {
      newErrors.name = "Title must start with a capital letter.";
    }

    if (description.length < 10 || description.length > 500) {
      newErrors.description = "Description must be between 10 and 500 characters.";
    }

    if (price === "" || price < 0) {
      newErrors.price = "Price must be a positive number.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateInputs()) return;

    const gamePayload = { name, description, genre, imageUrl, price: Number(price) };
    const url = isEditing ? `${process.env.NEXT_PUBLIC_API_URL}/games/${gameId}` : `${process.env.NEXT_PUBLIC_API_URL}/games`;
    const method = isEditing ? "PUT" : "POST";

    if (!isOnline || !serverUp) {
      queueRequest(method, url, gamePayload);
      alert("Offline. Changes will sync when back online.");
      router.push("/");
      return;
    }

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(gamePayload),
      });

      if (res.ok) {
        alert(isEditing ? `Game "${name}" updated!` : `Game "${name}" added!`);
        router.push(isEditing ? `/game/${gameId}` : "/");
      } else {
        const err = await res.json();
        alert("Error: " + err.error);
      }
    } catch (err) {
      console.error("Server error:", err);
      alert("Server error occurred.");
    }
  };

  return (
    <main className="px-3 py-0 mx-auto max-w-none min-h-screen bg-zinc-800 flex flex-col items-center">
      <Header />
      {!isOnline && <p className="text-yellow-400 mt-4">⚠️ You are currently offline</p>}
      {!serverUp && <p className="text-red-400">🚫 Server is down</p>}

      <form
        onSubmit={handleSubmit}
        className="mt-6 flex flex-col gap-4 bg-zinc-900 p-6 rounded-lg shadow-lg w-full max-w-lg"
      >
        <label className="text-white text-xl">
          Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1))}
            className="block w-full px-3 py-2 mt-2 bg-black text-white rounded-lg border border-gray-600"
            required
          />
        </label>
        {errors.name && <p className="text-red-500">{errors.name}</p>}

        <label className="text-white text-xl">
          Description:
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="block w-full px-3 py-2 mt-2 bg-black text-white rounded-lg border border-gray-600 h-24"
            required
          ></textarea>
        </label>
        {errors.description && <p className="text-red-500">{errors.description}</p>}

        <label className="text-white text-xl">
          Genre:
          <select
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            className="block w-full px-3 py-2 mt-2 bg-black text-white rounded-lg border border-gray-600"
            required
          >
            <option value="">Select Genre</option>
            {genres.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </label>

        <label className="text-white text-xl">
          Image URL:
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="block w-full px-3 py-2 mt-2 bg-black text-white rounded-lg border border-gray-600"
            required
          />
        </label>

        <label className="text-white text-xl">
          Price ($):
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value === "" ? "" : Number(e.target.value))}
            className="block w-full px-3 py-2 mt-2 bg-black text-white rounded-lg border border-gray-600"
            required
          />
        </label>
        {errors.price && <p className="text-red-500">{errors.price}</p>}

        <div className="flex justify-center gap-4 mt-5">
          <button type="submit" className="px-5 py-3 text-lg font-medium text-white bg-black rounded-full">
            {isEditing ? "Edit Game" : "Add Game"}
          </button>
        </div>
      </form>
    </main>
  );
} 