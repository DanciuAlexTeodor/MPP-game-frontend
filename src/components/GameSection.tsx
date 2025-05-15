"use client";
import * as React from "react";
import StarIcon from "./NewGamingPlatform/StarIcon";
import StarTitle from "./NewGamingPlatform/StarTitle";

interface Game {
  id: number;
  image: string;
  altText: string;
}

interface GameSectionProps {
  title: string;
  games: Game[];
  type: "star-title" | "text-with-stars";
}

const GameSection: React.FC<GameSectionProps> = ({ title, games, type }) => {
  return (
    <section className="mt-10">
      <div className="flex gap-2 items-center mb-5">
        {type === "star-title" ? (
          <>
            <StarTitle title={title} />
            <StarIcon />
          </>
        ) : (
          <div className="flex gap-2 items-center text-4xl font-bold text-white">
            <StarIcon />
            <span>{title}</span>
            <StarIcon />
          </div>
        )}
      </div>

      <div className="grid gap-4 grid-cols-[repeat(6,1fr)] max-md:grid-cols-[repeat(3,1fr)] max-sm:grid-cols-[repeat(2,1fr)]">
        {games.map((game) => (
          <img
            key={game.id}
            src={game.image}
            className="object-cover w-full h-auto aspect-[216/293]"
            alt={game.altText}
          />
        ))}
      </div>
    </section>
  );
};

export default GameSection;