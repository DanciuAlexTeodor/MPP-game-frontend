"use client";

import React from "react";
import AddEntityForm from "./AddEntityForm";
import EntityCard from "./EntityCard";
import useEntities from "@/hooks/useEntities";

export default function EntityList() {
  const { entities, addEntity, deleteEntity, updateEntity } = useEntities();

  return (
    <div className="space-y-6">
      <AddEntityForm onAdd={addEntity} />
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {entities.map((entity) => (
          <EntityCard
            key={entity.id}
            entity={entity}
            onDelete={deleteEntity}
            onUpdate={updateEntity}
          />
        ))}
      </div>
    </div>
  );
}
