export interface Entity {
  id: number;
  name: string;
  description: string;
  genre: string;
  imageUrl: string;
  price: number;
}

export type EntityWithoutId = Omit<Entity, "id">; 