import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { api } from "@/api";
import deliveryIcon from "@/assets/icons/delivery.svg";
import locationIcon from "@/assets/icons/location.svg";
import CartComponent from "@/components/CartComponent";
import MenuItem from "@/components/MenuItem";
import { IItem } from "@/types/item";
import { IRestaurant } from "@/types/restaurant";

import styles from "./styles.module.scss";

export default function Restaurant() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [items, setItems] = useState<IItem[]>([]);
  const [restaurant, setRestaurant] = useState<IRestaurant | null>(null);

  const { id } = useParams();

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const { items, restaurant } = await api.getMenu(id!);
        setItems(items);
        setRestaurant(restaurant);
      } catch (error) {
        if (error instanceof Error) {
          console.log(error);
          setError(error.message);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <section className={styles.container}>
      <div className={styles.left}>
        {restaurant && (
          <div className={styles.restaurant}>
            <div className={styles.restaurant__info}>
              <h3 className={styles.restaurant__name}>{restaurant.name}</h3>
              <p className={styles.restaurant__category}>
                {restaurant.category}
              </p>
            </div>
            <img
              src={restaurant.delivery ? deliveryIcon : locationIcon}
              alt="icon"
              className={styles.restaurant__icon}
            />
            {/* <p className={styles.delivery}>
              {restaurant.delivery ? "Delivery" : "Takeaway"}
            </p> */}
          </div>
        )}

        <div className={styles.list}>
          {items.map((item) => (
            <MenuItem key={item.id} item={item} />
          ))}
        </div>
      </div>

      <CartComponent />
    </section>
  );
}
