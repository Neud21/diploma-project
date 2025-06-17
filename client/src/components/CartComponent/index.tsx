import { ChangeEvent, useState } from "react";

import { api } from "@/api";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import {
  addItemToCart,
  clearCart,
  selectCartItems,
  selectTotalPrice,
} from "@/store/slices/cartSlice";
import { getImageURL } from "@/utils/getImageURL";

import { Modal } from "../Modal";
import styles from "./styles.module.scss";

export default function CartComponent() {
  const dispatch = useAppDispatch();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const cartItems = useAppSelector(selectCartItems);
  const totalPrice = useAppSelector(selectTotalPrice);

  const [sum, setSum] = useState(0);

  const [address, setAddress] = useState("");

  const handleChangeAddress = (e: ChangeEvent<HTMLInputElement>) => {
    setAddress(e.target.value);
  };

  const handleChangeSum = (e: ChangeEvent<HTMLInputElement>) => {
    setSum(Number(e.target.value));
  };

  const handleReccomend = () => {
    if (sum === 0) return;
    (async () => {
      const { recommendations } = await api.reccomendCart(cartItems[0].id, sum);
      recommendations.forEach((item) => {
        dispatch(
          addItemToCart({ ...item, image: [{ data: item.images[0].imageUrl }] })
        );
      });
    })();
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handlePay = () => {
    if (!address.length) return;

    const a = Math.random();
    const items = cartItems.map((item) => {
      return { id: item.id };
    });

    if (a < 0.5) {
      api
        .sendOrder(address, items)
        .then(() => {
          alert("Success payment");
          setIsModalOpen(false);
          dispatch(clearCart());
        })
        .catch((e) => {
          console.log(e);
        });
    } else {
      alert("Error payment");
    }
  };

  return (
    <>
      <div className={styles.cart}>
        <h3 className={styles.title}>Cart</h3>
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
        {cartItems.length === 1 && (
          <div className={styles.reccomend}>
            <label htmlFor="sum" className={styles.label}>
              Enter sum
            </label>
            <input
              id="sum"
              type="number"
              value={sum}
              onChange={handleChangeSum}
              className={styles.input}
            />
            <button className={styles.button} onClick={handleReccomend}>
              Reccomend
            </button>
          </div>
        )}

        {totalPrice ? (
          <div className={styles.total}>
            <div className={styles.text}>
              <p>Total:</p>
              <p>{totalPrice} BYN</p>
            </div>
            <button className={styles.button} onClick={handleOpenModal}>
              Pay
            </button>
          </div>
        ) : (
          <p className={styles.noItems}>No items in cart</p>
        )}
      </div>
      <Modal onClose={() => setIsModalOpen(false)} isOpen={isModalOpen}>
        <div className={styles.payment}>
          <h2>Payment</h2>
          <input
            className={styles.input}
            value={address}
            onChange={handleChangeAddress}
            placeholder="Address"
          />
          <button className={styles.button} onClick={handlePay}>
            pay
          </button>
        </div>
      </Modal>
    </>
  );
}
