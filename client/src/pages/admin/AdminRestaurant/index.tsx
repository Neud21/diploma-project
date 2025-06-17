import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Tooltip } from "react-tooltip";

import { api } from "@/api";
import { SERVER_URL } from "@/constants/server";
import { IItem } from "@/types/item";

import styles from "./styles.module.scss";

export default function AdminRestaurant() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<IItem[]>([]);

  const navigate = useNavigate();

  const { id } = useParams();

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const { items } = await api.getMenu(id!);
        setItems(items);
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

  const handleAddItem = () => {
    navigate(`/admin/restaurants/${id}/add`);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  return (
    <section className={styles.container}>
      <ul className={styles.list}>
        {items.map(
          ({
            id,
            image,
            name,
            description,
            carbohydrates,
            proteins,
            calories,
          }) => (
            <div key={id} className={styles.item}>
              <img
                src={`${SERVER_URL}${image[0].data}`}
                alt="image"
                className={styles.img}
              />
              <div className={styles.info}>
                <h4 className={styles.name}>{name}</h4>
                <a data-tooltip-id="info" className={styles.inf}>
                  i
                </a>
                <Tooltip id="info" className={styles.extra}>
                  <h4>{name}</h4>
                  <p>{description}</p>
                  <p>Carbohydrates: {carbohydrates}</p>
                  <p>Proteins: {proteins}</p>
                  <p>Calories: {calories}</p>
                </Tooltip>
              </div>
            </div>
          )
        )}
      </ul>
      <button className={styles.button} onClick={handleAddItem}>
        Add
      </button>
    </section>
  );
}
