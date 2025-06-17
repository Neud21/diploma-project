import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { api } from "@/api";
import cartIcon from "@/assets/icons/cart.svg";
import CategoryFilter from "@/components/CategoryFilter";
import Restaurants from "@/components/Restaurants";
import { FILTER_CATEGORIES, FilterCategories } from "@/constants/categories";
import { ROUTES } from "@/constants/routes";
import { useAppSelector } from "@/hooks/redux";
import { selectTotalAmount } from "@/store/slices/cartSlice";
import { IRestaurant } from "@/types/restaurant";

import styles from "./styles.module.scss";

export default function Home() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [restaurants, setRestaurants] = useState<IRestaurant[]>([]);

  const [categories, setCategories] = useState<FilterCategories[]>([
    FILTER_CATEGORIES.ALL.value,
  ]);

  const navigate = useNavigate();

  const cartAmount = useAppSelector(selectTotalAmount);

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

  const handleToggleCategory = (category: FilterCategories) => {
    setCategories((prev) => {
      if (category === FILTER_CATEGORIES.ALL.value) {
        return prev.includes(FILTER_CATEGORIES.ALL.value)
          ? []
          : [FILTER_CATEGORIES.ALL.value];
      }

      const newSelection = prev.includes(FILTER_CATEGORIES.ALL.value)
        ? [category]
        : prev.includes(category)
          ? prev.filter((c) => c !== category)
          : [...prev, category];

      return newSelection.length === 0
        ? [FILTER_CATEGORIES.ALL.value]
        : newSelection;
    });
  };

  const handleCartClick = () => {
    navigate(ROUTES.CART);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  const filteredResurants = categories.includes(FILTER_CATEGORIES.ALL.value)
    ? restaurants
    : restaurants.filter(({ category }) => categories.includes(category));

  return (
    <section className={styles.container}>
      <CategoryFilter categories={categories} onToggle={handleToggleCategory} />
      <Restaurants restaurants={filteredResurants} />

      <section className={styles.cartWrapper} onClick={handleCartClick}>
        <div className={styles.cart}>
          <img src={cartIcon} alt="cart icon" className={styles.cartIcon} />
          <p className={styles.cartItems}>{cartAmount}</p>
        </div>
      </section>
    </section>
  );
}
