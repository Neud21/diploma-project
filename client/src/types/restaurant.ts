import { RestaurantCategory } from "@/constants/categories";

import { IItem } from "./item";

export interface IRestaurant {
  id: string;
  name: string;
  category: RestaurantCategory;
  delivery: boolean;
}

export interface RestaurantsResponse {
  restaurants: IRestaurant[];
}

export type RestaurantCreate = Omit<IRestaurant, "id">;

export interface MenuResponse {
  restaurant: IRestaurant;
  items: IItem[];
}
