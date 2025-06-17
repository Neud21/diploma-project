import axios, { AxiosInstance } from "axios";

import { SERVER_URL } from "@/constants/server";
import { AuthResponse, LoginData, RegistrationUserData } from "@/types/auth";
import { ItemReccomend } from "@/types/item";
import {
  MenuResponse,
  RestaurantCreate,
  RestaurantsResponse,
} from "@/types/restaurant";

class Api {
  private instance: AxiosInstance;

  constructor() {
    this.instance = axios.create({
      baseURL: SERVER_URL,
      timeout: 10000,
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.instance.interceptors.request.use((config) => {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    this.instance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          window.location.href = "/login";
        }
        return Promise.reject(error);
      }
    );
  }

  public async login({ login, password }: LoginData) {
    const response = await this.instance.post<AuthResponse>("/auth/login", {
      login,
      password,
    });
    return response.data;
  }

  public async registrationUser({ login, password }: RegistrationUserData) {
    const response = await this.instance.post<AuthResponse>(
      "/auth/registration",
      {
        login,
        password,
      }
    );
    return response.data;
  }

  public async getRestaurants() {
    const response =
      await this.instance.get<RestaurantsResponse>("/restaurant/get");

    return response.data.restaurants;
  }

  public async getMenu(id: string) {
    const response = await this.instance.get<MenuResponse>(`/restaurant/${id}`);

    return response.data;
  }

  public async addRestaurant(restaurant: RestaurantCreate) {
    const response = await this.instance.post("/restaurant/create", restaurant);

    return response.data;
  }

  public async addItem(restaurantId: string, item: FormData) {
    const response = await this.instance.post(
      `/restaurant/create/${restaurantId}`,
      item
    );

    return response.data;
  }

  public async reccomendCart(itemId: string, totalPrice: number) {
    const response = await this.instance.post<{
      recommendations: ItemReccomend[];
    }>(`/order/recommend-items`, {
      itemId,
      totalPrice,
    });

    return response.data;
  }
  public async sendOrder(deliveryAddress: string, items: { id: string }[]) {
    const response = await this.instance.post(`/order`, {
      deliveryAddress,
      items,
    });

    return response.data;
  }

  public async getAvaliableOrders() {
    const response = await this.instance.get(`/delivery/available`);

    return response.data;
  }
  public async takeOrder(id: string) {
    const response = await this.instance.get(`delivery/take/${id}`);

    return response.data;
  }
}

export const api = new Api();
