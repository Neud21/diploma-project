import { Outlet } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { signOut } from "@/store/slices/authSlice";

import styles from "./styles.module.scss";

export default function AdminLayout() {
  const { username } = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();

  const handleSignOut = () => {
    dispatch(signOut());
  };
  return (
    <section className={styles.container}>
      <header className={styles.header}>
        <div className={styles.wrapper}>
          <p className={styles.name}>VFOOD/Admin Dashboard</p>
          {/* <nav className={styles.nav}>
            <Link to={"/"} className={styles.nav__item}>
              About
            </Link>
            <Link to={"/"} className={styles.nav__item}>
              Contacts
            </Link>
            <Link to={ROUTES.CART} className={styles.nav__item}>
              Cart
            </Link>
          </nav> */}
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
