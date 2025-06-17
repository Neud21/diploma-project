import { FC } from "react";
import { useNavigate } from "react-router-dom";

import deliveryIcon from "@/assets/icons/delivery.svg";
import locationIcon from "@/assets/icons/location.svg";
import { IRestaurant } from "@/types/restaurant";

import styles from "./styles.module.scss";

interface Props {
  restaurants: IRestaurant[];
}

const Restaurants: FC<Props> = ({ restaurants }) => {
  const navigate = useNavigate();

  const handleRestaurantClick = (id: string) => () => {
    navigate(`/restaurants/${id}`);
  };

  return (
    <section className={styles.container}>
      <h2 className={styles.title}>Рестораны</h2>
      <div className={styles.list}>
        {restaurants.map(({ id, name, delivery }) => (
          <div
            key={id}
            onClick={handleRestaurantClick(id)}
            className={styles.item}
          >
            <h4 className={styles.name}>{name}</h4>
            <img
              src={delivery ? deliveryIcon : locationIcon}
              alt="icon"
              className={styles.icon}
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default Restaurants;
