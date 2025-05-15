"use client";

import { useState, useEffect } from "react";
import { Entity } from "@/types/entity";

export default function useEntities() {
  const [entities, setEntities] = useState<Entity[]>(() => {
    // Load games from localStorage when the app starts
    if (typeof window !== "undefined") {
      const savedEntities = localStorage.getItem("games");
      return savedEntities ? JSON.parse(savedEntities) : [];
    }
    return [];
  });

  useEffect(() => {
    // Save games to localStorage whenever they change
    localStorage.setItem("games", JSON.stringify(entities));
  }, [entities]);

  const addEntity = (entity: Omit<Entity, "id">) => {
    const newEntity = { ...entity, id: Date.now() };
    setEntities((prevEntities) => {
      const updatedEntities = [...prevEntities, newEntity];
      console.log("Game Added:", newEntity);
      console.log("Updated Games List:", updatedEntities);
      return updatedEntities;
    });
  };

  const deleteEntity = (id: number) => {
    setEntities((prevEntities) => prevEntities.filter((entity) => entity.id !== id));
  };

  const updateEntity = (id: number, updatedEntity: Entity) => {
    setEntities((prevEntities) =>
      prevEntities.map((entity) => (entity.id === id ? updatedEntity : entity))
    );
  };

  return { entities, addEntity, deleteEntity, updateEntity };
}
