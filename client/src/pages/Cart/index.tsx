import { useAppSelector } from "@/hooks/redux";
import { selectCartItems, selectTotalPrice } from "@/store/slices/cartSlice";
import { getImageURL } from "@/utils/getImageURL";

import styles from "./styles.module.scss";

export default function Cart() {
  const cartItems = useAppSelector(selectCartItems);
  const totalPrice = useAppSelector(selectTotalPrice);

  return (
    <section className={styles.container}>
      <h1 className={styles.title}>Cart</h1>
      <div className={styles.content}>
        <div className={styles.list}>
          {cartItems.map(({ id, name, quantity, image, price }) => (
            <div key={id} className={styles.item}>
              <img
                src={getImageURL(image)}
                alt={name}
                className={styles.image}
              />
              <div className={styles.info}>
                <p className={styles.name}>{name}</p>
                <p className={styles.price}>
                  {quantity} - {price * quantity} BYN
                </p>
              </div>
            </div>
          ))}
        </div>
        {totalPrice ? (
          <div className={styles.total}>
            <div className={styles.text}>
              <p>Total:</p>
              <p>{totalPrice} BYN</p>
            </div>
            <button className={styles.button}>Pay</button>
          </div>
        ) : (
          <p className={styles.noItems}>No items in cart</p>
        )}
      </div>
    </section>
  );
}
