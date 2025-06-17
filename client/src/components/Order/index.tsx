import { FC } from "react";

import { IOrder } from "@/types/order";

import styles from "./styles.module.scss";

interface OrderProps {
  order: IOrder;
  onTake: (id: string) => void;
}

const Order: FC<OrderProps> = ({ order, onTake }) => {
  const { id, deliveryAddress, item } = order;

  const handleTakeOrder = () => {
    onTake(id);
  };

  return (
    <div className={styles.container}>
      <h4 className={styles.address}>
        <span>ADDRESS: </span>
        {deliveryAddress}
      </h4>
      <p className={styles.subtitle}>Items</p>
      <ul className={styles.items}>
        {item.map(({ name }) => name).join(", ")}
      </ul>
      <button className={styles.button} onClick={handleTakeOrder}>
        Take
      </button>
    </div>
  );
};

export default Order;
