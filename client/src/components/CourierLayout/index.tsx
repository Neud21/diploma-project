import { Outlet } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { signOut } from "@/store/slices/authSlice";

import styles from "./styles.module.scss";

export default function CourierLayout() {
  const { username } = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();

  const handleSignOut = () => {
    dispatch(signOut());
  };
  return (
    <section className={styles.container}>
      <header className={styles.header}>
        <div className={styles.wrapper}>
          <p className={styles.name}>VFOOD/Courier Dashboard</p>

          <div className={styles.info}>
            <p>{username}</p>
            <p onClick={handleSignOut} className={styles.btn}>
              Sign out
            </p>
          </div>
        </div>
      </header>

      <div className={styles.wrapper}>
        <Outlet />
      </div>
    </section>
  );
}
