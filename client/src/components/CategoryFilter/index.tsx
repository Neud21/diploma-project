import { FC } from "react";

import { FILTER_CATEGORIES, FilterCategories } from "@/constants/categories";

import styles from "./styles.module.scss";

interface Props {
  categories: FilterCategories[];
  onToggle: (category: FilterCategories) => void;
}

const CategoryFilter: FC<Props> = ({ categories, onToggle }) => {
  const handleToggle = (category: FilterCategories) => () => onToggle(category);

  return (
    <section className={styles.container}>
      <h2 className={styles.title}>Категории</h2>
      <section className={styles.categories}>
        {Object.values(FILTER_CATEGORIES).map((category) => (
          <p
            key={category.label}
            className={`${styles.category} ${categories.includes(category.value) && styles.active}`}
            onClick={handleToggle(category.value)}
          >
            {category.label}
          </p>
        ))}
      </section>
    </section>
  );
};

export default CategoryFilter;
