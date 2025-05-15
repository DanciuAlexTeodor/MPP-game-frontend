"use client";
import * as React from "react";
import Header from "../NewGamingPlatform/Header";
import GameSection from "../NewGamingPlatform/GameSection";

const NetGamingPlatform: React.FC = () => {
  // Custom game list data
  const myGamelistGames = [
    {
      id: 1,
      image: "https://cdn.builder.io/api/v1/image/assets/TEMP/736583ef453a887b21de6d789dc87acac5084f24",
      altText: "My Game 1",
      genre: "Custom",
    },
    {
      id: 2,
      image: "https://cdn.builder.io/api/v1/image/assets/TEMP/ac8d1fce36a8cb7aa4c414681ace193523e50f2e",
      altText: "My Game 2",
      genre: "Custom",
    },
  ];

  const recommendedGames = [
    {
      id: 3,
      image: "https://cdn.builder.io/api/v1/image/assets/TEMP/732cc420b6d7ed6581f56a62abe9b4ecd72f03a7",
      altText: "Recommended Game 1",
      genre: "Recommended",
    },
    {
      id: 4,
      image: "https://cdn.builder.io/api/v1/image/assets/TEMP/d54bf249ca84d06463b4bbad042506ae08a3e29c",
      altText: "Recommended Game 2",
      genre: "Recommended",
    },
  ];

  const allGames = [
    { id: 1, image: "https://cdn.builder.io/api/v1/image/assets/TEMP/baccb606940350e114bf1b23b6f563846f756c57", altText: "Horror Game 1", genre: "Horror" },
    { id: 2, image: "https://cdn.builder.io/api/v1/image/assets/TEMP/f8fea25df5b7e9c5d2e0b06f167bb42de7216dac", altText: "Survival Game 1", genre: "Survival" },
    { id: 3, image: "https://cdn.builder.io/api/v1/image/assets/TEMP/732cc420b6d7ed6581f56a62abe9b4ecd72f03a7", altText: "Action Game 1", genre: "Action" },
    { id: 4, image: "https://cdn.builder.io/api/v1/image/assets/TEMP/dafaa984f0e015977ca548be1baa7b28d003c7cc", altText: "Puzzle Game 1", genre: "Puzzle" },
    { id: 5, image: "https://cdn.builder.io/api/v1/image/assets/TEMP/d54bf249ca84d06463b4bbad042506ae08a3e29c", altText: "Sports Game 1", genre: "Sports" },
    { id: 6, image: "https://cdn.builder.io/api/v1/image/assets/TEMP/ac8d1fce36a8cb7aa4c414681ace193523e50f2e", altText: "Strategy Game 1", genre: "Strategy" },
    { id: 7, image: "https://cdn.builder.io/api/v1/image/assets/TEMP/736583ef453a887b21de6d789dc87acac5084f24", altText: "Shooter Game 1", genre: "Shooter" },
  ];

  const [selectedGenre, setSelectedGenre] = React.useState<string | null>(null);
  const [showGenres, setShowGenres] = React.useState(false);

  // Filter games based on selected genre
  const filteredGames = selectedGenre ? allGames.filter(game => game.genre === selectedGenre) : allGames;

  return (
    <main className="px-3 py-0 mx-auto max-w-none min-h-screen bg-zinc-800 max-md:max-w-[991px] max-sm:max-w-screen-sm">
      {/* Header with genre toggle */}
      <Header onGenresClick={() => setShowGenres(!showGenres)} />

      {/* Show genres ONLY when clicking the "Genres" button */}
      {showGenres && (
        <div className="flex flex-wrap justify-center gap-4 mt-5">
          {["All", "Horror", "Survival", "Action", "Puzzle", "Sports", "Strategy", "Shooter"].map(genre => (
            <button
              key={genre}
              onClick={() => {
                setSelectedGenre(genre === "All" ? null : genre);
                setShowGenres(false); // Hide genres after selection
              }}
              className={`px-4 py-2 text-lg font-medium text-white bg-black rounded-full ${
                selectedGenre === genre ? "bg-gray-700" : ""
              }`}
            >
              {genre}
            </button>
          ))}
        </div>
      )}

      {/* Display Filtered Games */}
      <section>
        <GameSection 
          title={selectedGenre ? `${selectedGenre} Games` : "All games"} 
          games={filteredGames} 
          type="star-title" 
        />
        <GameSection 
          title="My Gamelist" 
          games={myGamelistGames} 
          type="star-title" 
        />
        <GameSection 
          title="Recommend to Add" 
          games={recommendedGames} 
          type="text-with-stars" 
        />
      </section>
    </main>
  );
};

export default NetGamingPlatform;