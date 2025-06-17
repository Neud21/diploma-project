import { useEffect, useState } from "react";

import { api } from "@/api";
import Order from "@/components/Order";
import { IOrder } from "@/types/order";

import styles from "./styles.module.scss";

export default function CourierMain() {
  const [avaliableOrders, setAvaliableOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const orders = await api.getAvaliableOrders();
      setAvaliableOrders(orders);
    } catch (error) {
      if (error instanceof Error) {
        console.log(error);
        setError(error.message);
      }
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    (async () => {
      await fetchOrder();
    })();
  }, []);

  const handleTakeOrder = (id: string) => {
    api.takeOrder(id);
    (async () => {
      await fetchOrder();
    })();
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <section className={styles.container}>
      <h2 className={styles.title}>Avaliable Orders</h2>
      <ul className={styles.orders}>
        {avaliableOrders.map((order) => (
          <Order key={order.id} order={order} onTake={handleTakeOrder} />
        ))}
      </ul>
    </section>
  );
}
