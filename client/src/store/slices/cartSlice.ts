import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { ImageData } from "@/types/item";

import { RootState } from "..";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: ImageData;
}

interface CartState {
  items: CartItem[];
  totalPrice: number;
}

const initialState: CartState = {
  items: [],
  totalPrice: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItemToCart: (
      state,
      action: PayloadAction<Omit<CartItem, "quantity">>
    ) => {
      const existingItem = state.items.find(
        (item) => item.id === action.payload.id
      );

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
      state.totalPrice =
        Number(state.totalPrice) + Number(action.payload.price);
    },

    removeItemFromCart: (state, action: PayloadAction<string>) => {
      const existingItem = state.items.find(
        (item) => item.id === action.payload
      );

      if (!existingItem) return;

      if (existingItem.quantity === 1) {
        state.items = state.items.filter((item) => item.id !== action.payload);
      } else {
        existingItem.quantity -= 1;
      }

      state.totalPrice -= existingItem.price;
    },

    deleteItemFromCart: (state, action: PayloadAction<string | number>) => {
      const existingItem = state.items.find(
        (item) => item.id === action.payload
      );

      if (!existingItem) return;

      state.totalPrice -= existingItem.price * existingItem.quantity;
      state.items = state.items.filter((item) => item.id !== action.payload);
    },

    clearCart: (state) => {
      state.items = [];
      //   state.totalQuantity = 0;
      state.totalPrice = 0;
    },

    // // Для синхронизации с localStorage или API
    // setCart: (state, action: PayloadAction<CartState>) => {
    //   state.items = action.payload.items;
    //   state.totalQuantity = action.payload.totalQuantity;
    //   state.totalAmount = action.payload.totalAmount;
    // },
  },
});

export const {
  addItemToCart,
  removeItemFromCart,
  deleteItemFromCart,
  clearCart,
} = cartSlice.actions;

export const selectCartItems = (state: RootState) => state.cart.items;
export const selectTotalAmount = (state: RootState) => state.cart.items.length;
export const selectTotalPrice = (state: RootState) => state.cart.totalPrice;
export const selectItemQuantity = (id: string | number) => (state: RootState) =>
  state.cart.items.find((item) => item.id === id)?.quantity || 0;

export default cartSlice.reducer;
