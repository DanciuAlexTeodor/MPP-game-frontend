"use client";
import { useOfflineSync } from "@/hooks/useOfflineSync";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Header from "../../../components/NewGamingPlatform/Header";

const capitalizeTitle = (title: string) => title.charAt(0).toUpperCase() + title.slice(1);

const insertNewlines = (text: string, interval: number): string => {
  return text.replace(new RegExp(`.{${interval}}`, "g"), "$&\n");
};

const GameDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const [game, setGame] = useState<{ id: number; name: string; description: string; genre: string; imageUrl: string; price: number } | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedGame, setEditedGame] = useState({ name: "", description: "", genre: "", imageUrl: "", price: "" });
  const [errors, setErrors] = useState<{ name?: string; description?: string; price?: string }>({});
  const { isOnline, serverUp, queueRequest, flushQueue } = useOfflineSync();
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string | null>(null);


  useEffect(() => {
    const fetchGame = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/games/${params.id}`);
        const selectedGame = await res.json();
        if (selectedGame) {
          setGame(selectedGame);
          setEditedGame({
            name: selectedGame.name,
            description: selectedGame.description,
            genre: selectedGame.genre,
            imageUrl: selectedGame.imageUrl,
            price: selectedGame.price?.toString() || "0",
          });
        }
      } catch (error) {
        console.error("Error fetching game:", error);
      }
    };

    fetchGame();
  }, [params.id]);

  useEffect(() => {
    if (isOnline && serverUp) {
      flushQueue();
    }
  }, [isOnline, serverUp, flushQueue]);

  const validateInputs = () => {
    const newErrors: { name?: string; description?: string; price?: string } = {};

    if (!editedGame.name.match(/^[A-Z]/)) {
      newErrors.name = "Title must start with a capital letter.";
    }

    if (editedGame.description.length < 10 || editedGame.description.length > 500) {
      newErrors.description = "Description must be between 10 and 500 characters.";
    }

    if (editedGame.price === "" || parseFloat(editedGame.price) < 0) {
      newErrors.price = "Price must be a positive number.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!game) return;
    if (!validateInputs()) return;

    const payload = {
      name: editedGame.name,
      description: editedGame.description,
      genre: editedGame.genre,
      imageUrl: editedGame.imageUrl,
      price: parseFloat(editedGame.price),
    };

    const url = `${process.env.NEXT_PUBLIC_API_URL}/games/${game.id}`;

    if (!isOnline || !serverUp) {
      queueRequest("PATCH", url, payload);
      alert("Offline. Changes will sync when back online.");
      return;
    }

    try {
      const res = await fetch(url, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const updated = await res.json();
        setGame(updated);
        setIsEditing(false);
      } else {
        const err = await res.json();
        alert("Error: " + err.error);
      }
    } catch (err) {
      console.error("Failed to update game:", err);
    }
  };

  const handleDelete = async () => {
    if (!game) return;
    const url = `${process.env.NEXT_PUBLIC_API_URL}/games/${game.id}`;

    if (!isOnline || !serverUp) {
      queueRequest("DELETE", url, null);
      alert("Offline. Delete will sync when back online.");
      router.push("/");
      return;
    }

    try {
      const res = await fetch(url, { method: "DELETE" });
      if (res.ok) {
        router.push("/");
      } else {
        const err = await res.json();
        alert("Error: " + err.error);
      }
    } catch (err) {
      console.error("Failed to delete game:", err);
    }
  };


  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
  
    const formData = new FormData();
    formData.append("file", file);
  
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload`, {
        method: "POST",
        body: formData,
      });
  
      const data = await res.json();
  
      if (!res.ok) {
        console.error("Upload failed:", data.error);
        alert("Failed to upload file: " + data.error);
        return;
      }
  
      const downloadUrl = `${process.env.NEXT_PUBLIC_API_URL}/uploads/${data.file.filename}`;
      setUploadedFileUrl(downloadUrl);
      setEditedGame((prev) => ({ ...prev, imageUrl: downloadUrl }));
      alert("File uploaded successfully!");
    } catch (error) {
      console.error("Upload error:", error);
      alert("An error occurred during file upload.");
    }
  };
  
  




  if (!game) {
    return (
      <div className="text-white flex flex-col items-center justify-center min-h-screen bg-zinc-800">
        <h1 className="text-3xl font-bold">Game Not Found</h1>
        <button onClick={() => router.push("/")} className="mt-4 px-6 py-3 bg-black text-white rounded-lg">
          Go Back Home
        </button>
      </div>
    );
  }

  return (
    <div className="bg-zinc-800 text-white min-h-screen px-40 flex flex-col">
      <Header />
      <main className="mx-auto max-w-5xl mt-8 flex flex-col flex-grow">
        {!isOnline && <p className="text-yellow-400 mb-4">⚠️ You are currently offline</p>}
        {!serverUp && <p className="text-red-400 mb-4">🚫 Server is down</p>}

        <div className="flex flex-col md:flex-row gap-6 items-start">
          <img src={game.imageUrl} alt={game.name} className="w-96 h-[500px] object-cover rounded-lg" />
          <div className="flex flex-col w-full">
            {isEditing ? (
              <>

                <label className="text-lg mt-4">Upload Game File (video, etc):</label>
                <input
                  type="file"
                  onChange={handleUpload}
                  className="mt-2 text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                />

                {uploadedFileUrl && (
                  <a
                    href={uploadedFileUrl}
                    download
                    className="mt-4 w-fit px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-center"
                  >
                    ⬇️ Download Uploaded File
                  </a>
                )}





                <label className="text-lg">Game Title:</label>
                <input
                  type="text"
                  value={editedGame.name}
                  onChange={(e) => setEditedGame({ ...editedGame, name: capitalizeTitle(e.target.value) })}
                  className="text-3xl font-bold bg-gray-800 border border-gray-600 p-2 rounded"
                />
                {errors.name && <p className="text-red-500">{errors.name}</p>}

                <label className="text-lg mt-4">Genre:</label>
                <input
                  type="text"
                  value={editedGame.genre}
                  onChange={(e) => setEditedGame({ ...editedGame, genre: e.target.value })}
                  className="text-gray-400 text-lg bg-gray-800 border border-gray-600 p-2 rounded mt-2"
                />

                <label className="text-lg mt-4">Description:</label>
                <textarea
                  value={editedGame.description}
                  onChange={(e) => setEditedGame({ ...editedGame, description: e.target.value })}
                  className="mt-2 text-lg bg-gray-800 border border-gray-600 p-2 rounded h-32 resize-y"
                />
                {errors.description && <p className="text-red-500">{errors.description}</p>}

                <label className="text-lg mt-4">Image URL:</label>
                <input
                  type="url"
                  value={editedGame.imageUrl}
                  onChange={(e) => setEditedGame({ ...editedGame, imageUrl: e.target.value })}
                  className="mt-2 text-lg bg-gray-800 border border-gray-600 p-2 rounded"
                />

                <label className="text-lg mt-4">Price ($):</label>
                <input
                  type="number"
                  value={editedGame.price}
                  onChange={(e) => setEditedGame({ ...editedGame, price: e.target.value })}
                  className="mt-2 text-lg bg-gray-800 border border-gray-600 p-2 rounded"
                />
                {errors.price && <p className="text-red-500">{errors.price}</p>}

                <button onClick={handleSave} className="mt-6 px-4 py-2 bg-green-500 text-white rounded-lg w-32">
                  Save Changes
                </button>
              </>
            ) : (
              <>
                <h1 className="text-4xl font-bold">{game.name}</h1>
                <p className="text-gray-400 text-lg mt-4">{game.genre}</p>
                <p className="text-gray-400 text-lg mt-2">Price: ${game.price?.toFixed(2) || "0.00"}</p>
                <pre className="mt-6 text-lg whitespace-pre-wrap">{insertNewlines(game.description, 100)}</pre>
                <div className="mt-6 flex gap-4">
                  <button onClick={() => setIsEditing(true)} className="px-4 py-2 bg-yellow-500 text-white rounded-lg w-32">
                    Edit
                  </button>
                  <button onClick={handleDelete} className="px-4 py-2 bg-red-500 text-white rounded-lg w-32">
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default GameDetailPage;
