"use client";
import * as React from "react";
import { useRouter } from "next/navigation";

// Define the props for the Header component
interface HeaderProps {
  onGenresClick?: () => void; // Make it optional
}

const Header: React.FC<HeaderProps> = ({ onGenresClick }) => {
  const router = useRouter();

  return (
    <header className="relative flex flex-col items-center px-0 py-5 w-full">
      {/* Title */}
      <div className="absolute top-5 flex justify-center w-full">
        <div className="flex gap-4 items-center">
          <h1 className="text-6xl font-bold text-white">NetGaming</h1>
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/99bf4d2ece080ea8d27b8847e6216e022b700c6c"
            className="h-[80px] w-[60px]"
            alt="Helmet icon"
          />
        </div>
      </div>

      {/* Search Bar */}
      <div className="absolute right-10 top-5 w-[300px]">
        <div className="flex items-center px-4 py-2 bg-black rounded-lg">
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/2c12e47f702a32ed9775208e9118a100e0466877"
            className="mr-4 h-[30px] w-[30px]"
            alt="Search icon"
          />
          <input
            type="text"
            placeholder="Search game..."
            className="text-lg text-white bg-transparent border-none outline-none w-full"
            aria-label="Search for games"
          />
        </div>
      </div>

      {/* Navigation Buttons */}
      <nav className="mt-28 flex gap-5">
        <button
          onClick={() => router.push("/my-gamelist")}
          className="px-4 py-3 text-xl font-medium text-white bg-black rounded-full w-[160px]"
        >
          My gamelist
        </button>
        <button
          onClick={onGenresClick} // Handle genres toggle
          className="px-4 py-3 text-xl font-medium text-white bg-black rounded-full w-[160px]"
        >
          Genres
        </button>
        <button
          onClick={() => router.push("/add-game")} // Home button
          className="px-4 py-3 text-xl font-medium text-white bg-black rounded-full w-[160px]"
        >
          Add Game
        </button>
        <div className="ml-auto">
          <button
            onClick={() => router.push("/")} // Home button
            className="px-4 py-3 text-xl font-medium text-white bg-black rounded-full w-[160px]"
          >
            Home
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Header;
