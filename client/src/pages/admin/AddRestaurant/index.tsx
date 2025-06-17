import { ChangeEvent, useState } from "react";
import { useNavigate } from "react-router-dom";

import { api } from "@/api";
import {
  RESTAURANT_CATEGORIES,
  RestaurantCategory,
} from "@/constants/categories";
import { RestaurantCreate } from "@/types/restaurant";

import styles from "./styles.module.scss";

interface RestaurantState {
  name: string;
  category: "" | RestaurantCategory;
  delivery: boolean;
}

export default function AddRestaurant() {
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState<RestaurantState>({
    name: "",
    category: "",
    delivery: false,
  });
  const [error, setError] = useState("");

  const handleChangeRestaurant =
    (field: keyof RestaurantState) =>
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setRestaurant((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const handleChangeDelivery = () => {
    setRestaurant((prev) => ({ ...prev, delivery: !prev.delivery }));
  };
  const handleAddRestaurant = () => {
    if (restaurant.name.length < 3) {
      setError("Restaurant name >= 3");
      return;
    }
    if (restaurant.category === "") {
      setError("Category is required");
      return;
    }
    (async () => {
      await api.addRestaurant(restaurant as RestaurantCreate);
      navigate("/admin", { replace: true });
    })();
  };

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Add restaurant</h3>
      <input
        value={restaurant.name}
        onChange={handleChangeRestaurant("name")}
        placeholder="Name"
        className={styles.input}
      />
      <select
        value={restaurant.category}
        onChange={handleChangeRestaurant("category")}
        className={styles.input}
      >
        <option value="">Category</option>
        {Object.values(RESTAURANT_CATEGORIES).map(({ value }) => (
          <option key={value} value={value}>
            {value}
          </option>
        ))}
      </select>
      <div className={styles.delivery}>
        <label htmlFor="delivery">Is delivery</label>
        <input
          checked={restaurant.delivery}
          onChange={handleChangeDelivery}
          type="checkbox"
          id="delivery"
          className={styles.input}
        />
      </div>
      {error.length > 0 && <p className={styles.error}>{error}</p>}

      <button onClick={handleAddRestaurant} className={styles.submit}>
        Add
      </button>
    </div>
  );
}
