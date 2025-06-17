import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { api } from "@/api";
import deliveryIcon from "@/assets/icons/delivery.svg";
import locationIcon from "@/assets/icons/location.svg";
import { ROUTES } from "@/constants/routes";
import { IRestaurant } from "@/types/restaurant";

import styles from "./styles.module.scss";

export default function AdminDashboard() {
  const [restaurants, setRestaurants] = useState<IRestaurant[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const restaurants = await api.getRestaurants();
        setRestaurants(restaurants);
      } catch (error) {
        if (error instanceof Error) {
          console.log(error);
          setError(error.message);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleRestaurantClick = (id: string) => () => {
    navigate(`/admin/restaurants/${id}`);
  };

  const handleAddRestaurant = () => {
    navigate(ROUTES.RESTAURANT_ADD);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <section className={styles.container}>
      <ul className={styles.list}>
        {restaurants.map(({ id, name, category, delivery }) => (
          <div
            key={id}
            className={styles.item}
            onClick={handleRestaurantClick(id)}
          >
            <div className={styles.info}>
              <p className={styles.name}>{name}</p>
              <p className={styles.category}>{category}</p>
            </div>
            <img
              src={delivery ? deliveryIcon : locationIcon}
              alt="icon"
              className={styles.icon}
            />
          </div>
        ))}
      </ul>
      <button className={styles.button} onClick={handleAddRestaurant}>
        Add
      </button>
    </section>
  );
}
