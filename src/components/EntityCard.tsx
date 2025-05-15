"use client";

import React, { useState } from "react";
import { Entity } from "@/types/entity";

interface EntityCardProps {
  entity: Entity;
  onDelete: (id: number) => void;
  onUpdate: (id: number, updatedEntity: Entity) => void;
}

export default function EntityCard({ entity, onDelete, onUpdate }: EntityCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [updatedName, setUpdatedName] = useState(entity.name);
  const [updatedDescription, setUpdatedDescription] = useState(entity.description);

  const handleUpdate = () => {
    onUpdate(entity.id, { ...entity, name: updatedName, description: updatedDescription });
    setIsEditing(false);
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-4">
      {isEditing ? (
        <div className="space-y-2">
          <input
            type="text"
            value={updatedName}
            onChange={(e) => setUpdatedName(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <textarea
            value={updatedDescription}
            onChange={(e) => setUpdatedDescription(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <button onClick={handleUpdate} className="bg-green-500 text-white p-2 rounded">
            Save
          </button>
        </div>
      ) : (
        <div>
          <img src={entity.imageUrl} alt={entity.name} className="w-full h-48 object-cover rounded" />
          <h2 className="text-xl font-bold mt-2">{entity.name}</h2>
          <p className="text-gray-600">{entity.description}</p>
          <span className="text-sm text-gray-400">{entity.genre}</span>
          <div className="mt-4 space-x-2">
            <button onClick={() => setIsEditing(true)} className="bg-yellow-500 text-white p-2 rounded">
              Edit
            </button>
            <button onClick={() => onDelete(entity.id)} className="bg-red-500 text-white p-2 rounded">
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
