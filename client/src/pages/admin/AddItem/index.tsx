import { ChangeEvent, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { api } from "@/api";
import { ITEM_CATEGORIES } from "@/constants/categories";
import { ItemCreate } from "@/types/item";

import styles from "./styles.module.scss";

export default function AddItem() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = useState<ItemCreate>({
    name: "",
    description: "",
    fats: 0,
    proteins: 0,
    carbohydrates: 0,
    calories: 0,
    price: 0,
    category: ITEM_CATEGORIES[0],
  });
  const [error, setError] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChangeItem =
    (field: keyof ItemCreate) =>
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setItem((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const handleAddItem = () => {
    if (item.name.length < 3) {
      setError("Item name >= 3");
      return;
    }
    if (item.description.length < 3) {
      setError("Description >= 3");
      return;
    }

    (async () => {
      try {
        const formData = new FormData();

        formData.append("name", item.name);
        formData.append("description", item.description);
        formData.append("fats", item.fats.toString());
        formData.append("proteins", item.proteins.toString());
        formData.append("carbohydrates", item.carbohydrates.toString());
        formData.append("calories", item.calories.toString());
        formData.append("price", item.price.toString());
        formData.append("category", item.category.toString());

        if (image) {
          formData.append("image", image);
        }

        await api.addItem(id!, formData);
        navigate(`/admin/restaurants/${id}`, { replace: true });
      } catch (err) {
        setError("Failed to add item");
        console.error(err);
      }
      // await api.addItem(id!, item);
      navigate(`/admin/restaurants/${id}`, { replace: true });
    })();
  };

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Add item</h3>
      <input
        value={item.name}
        onChange={handleChangeItem("name")}
        placeholder="Name"
        className={styles.input}
      />
      <input
        value={item.description}
        onChange={handleChangeItem("description")}
        placeholder="Description"
        className={styles.input}
      />
      <label htmlFor="Fats">Fats</label>
      <input
        value={item.fats}
        type="number"
        onChange={handleChangeItem("fats")}
        id="Fats"
        className={styles.input}
      />
      <label htmlFor="Proteins">Proteins</label>
      <input
        value={item.proteins}
        type="number"
        onChange={handleChangeItem("proteins")}
        placeholder="Proteins"
        className={styles.input}
      />
      <label htmlFor="Carbohydrates">Carbohydrates</label>
      <input
        value={item.carbohydrates}
        type="number"
        onChange={handleChangeItem("carbohydrates")}
        placeholder="Carbohydrates"
        className={styles.input}
      />
      <label htmlFor="Calories">Calories</label>
      <input
        value={item.calories}
        type="number"
        onChange={handleChangeItem("calories")}
        placeholder="Calories"
        className={styles.input}
      />

      <select
        value={item.category}
        onChange={handleChangeItem("category")}
        className={styles.input}
      >
        {ITEM_CATEGORIES.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>

      <label htmlFor="Price">Price</label>
      <input
        value={item.price}
        type="number"
        onChange={handleChangeItem("price")}
        placeholder="Price"
        className={styles.input}
      />

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageChange}
        accept="image/*"
        className={styles.input}
      />

      {preview && (
        <img
          src={preview}
          alt="Preview"
          className={styles.preview}
          style={{ maxWidth: "300px", marginTop: "10px" }}
        />
      )}
      {error.length > 0 && <p className={styles.error}>{error}</p>}

      <button onClick={handleAddItem} className={styles.submit}>
        Add
      </button>
    </div>
  );
}
