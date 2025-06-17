import { FC } from "react";
import { Tooltip } from "react-tooltip";

import { SERVER_URL } from "@/constants/server";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import {
  addItemToCart,
  removeItemFromCart,
  selectItemQuantity,
} from "@/store/slices/cartSlice";
import { IItem } from "@/types/item";

import styles from "./styles.module.scss";

interface Props {
  item: IItem;
}

const MenuItem: FC<Props> = ({ item }) => {
  const dispatch = useAppDispatch();

  const {
    id,
    name,
    description,
    calories,
    proteins,
    carbohydrates,
    image,
    price,
  } = item;

  const handleAddToCart = () => {
    dispatch(addItemToCart({ id, name, price, image }));
  };
  const handleRemoveFromCart = () => {
    dispatch(removeItemFromCart(id));
  };

  const quantity = useAppSelector(selectItemQuantity(id));

  return (
    <div className={styles.container}>
      <img
        src={`${SERVER_URL}${image[0].data}`}
        alt="image"
        className={styles.img}
      />
      <div className={styles.info}>
        <div className={styles.info__top}>
          <h4 className={styles.name}>{name}</h4>
          <p className={styles.price}>{price} BYN</p>
        </div>
        <div className={styles.info__bottom}>
          <div className={styles.cart}>
            <button className={styles.button} onClick={handleAddToCart}>
              +
            </button>
            <p className={styles.quantity}>{quantity}</p>
            <button className={styles.button} onClick={handleRemoveFromCart}>
              -
            </button>
          </div>
          <a data-tooltip-id={id} className={styles.inf}>
            i
          </a>
          <Tooltip id={id} className={styles.extra}>
            <h4 className={styles.extra__name}>{name}</h4>
            <p className={styles.extra__desc}>{description}</p>
            <p className={styles.extra__inf}>
              <span>Carbohydrates:</span> {carbohydrates}
            </p>
            <p className={styles.extra__inf}>
              <span>Proteins:</span> {proteins}
            </p>
            <p className={styles.extra__inf}>
              <span>Calories:</span> {calories}
            </p>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

export default MenuItem;
