"use client";
import * as React from "react";
import Header from "../../components/NewGamingPlatform/Header";
import GameSection from "../../components/NewGamingPlatform/GameSection";

const MyGamelistPage: React.FC = () => {
  // Custom game list data
  const myGamelistGames = [
    {
      id: 13,
      image: "https://cdn.builder.io/api/v1/image/assets/TEMP/736583ef453a887b21de6d789dc87acac5084f24", // Replace with your image URL
      altText: "My Game 1",
    },
    
  ];

  return (
    <main className="px-3 py-0 mx-auto max-w-none min-h-screen bg-zinc-800 max-md:max-w-[991px] max-sm:max-w-screen-sm">
      {/* Reuse the Header component */}
      <Header onGenresClick={() => {}} /> {/* Pass a dummy function if not needed */}
      
      <section>
        <GameSection
          title="My GameList"
          games={myGamelistGames}
          type="star-title"
        />
      </section>
    </main>
  );
};

export default MyGamelistPage;