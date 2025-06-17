import { IItem } from "./item";

export interface IOrder {
  id: string;
  state: string;
  deliveryAddress: string;
  item: IItem[];
}
