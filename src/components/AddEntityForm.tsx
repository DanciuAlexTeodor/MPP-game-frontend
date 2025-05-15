"use client";

import React, { useState } from "react";

export default function AddEntityForm() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [genre, setGenre] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [price, setPrice] = useState<number | "">("");

  const genres = ["Horror", "Survival", "Action", "Puzzle", "Sports", "Strategy", "Shooter"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !description || !genre || !imageUrl || price === "") {
      alert("Please fill out all fields.");
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/games`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description, genre, imageUrl, price: Number(price) }),
      });

      if (response.ok) {
        const added = await response.json();
        alert(`Game "${added.name}" added successfully!`);
        // ✅ Redirect to homepage
        window.location.href = "/";
      } else {
        const err = await response.json();
        alert("Error: " + err.error);
      }
    } catch (error) {
      console.error("Failed to submit:", error);
      alert("Server error while adding game.");
    }

    // Clear form
    setName("");
    setDescription("");
    setGenre("");
    setImageUrl("");
    setPrice("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-gray-800 p-6 rounded-lg">
      <input
        type="text"
        placeholder="Game Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full p-2 border rounded"
        required
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full p-2 border rounded"
        required
      />
      <select
        value={genre}
        onChange={(e) => setGenre(e.target.value)}
        className="w-full p-2 border rounded"
        required
      >
        <option value="">Select Genre</option>
        {genres.map((g) => (
          <option key={g} value={g}>
            {g}
          </option>
        ))}
      </select>
      <input
        type="url"
        placeholder="Image URL"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
        className="w-full p-2 border rounded"
        required
      />
      <input
        type="number"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value === "" ? "" : Number(e.target.value))}
        className="w-full p-2 border rounded"
        required
      />
      <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full">
        Add Game
      </button>
    </form>
  );
}
