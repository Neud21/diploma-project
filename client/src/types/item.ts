import { ItemCategory } from "@/constants/categories";

export interface ItemCreate {
  name: string;
  description: string;
  fats: number;
  proteins: number;
  carbohydrates: number;
  calories: number;
  price: number;
  category: ItemCategory;
}

export interface IItem extends ItemCreate {
  id: string;
  image: ImageData;
}

export type ImageData = [
  {
    data: string;
  },
];

export interface ItemReccomend {
  id: string;
  name: string;
  price: number;
  images: [{ imageUrl: string }];
}
