import { Link, useNavigate } from "react-router-dom";

import { ROUTES } from "@/constants/routes";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { signOut } from "@/store/slices/authSlice";

import styles from "./styles.module.scss";

const Header = () => {
  const navigate = useNavigate();
  const { username } = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();

  const handleSignOut = () => {
    dispatch(signOut());
  };

  return (
    <header className={styles.header}>
      <div className={styles.wrapper}>
        <p className={styles.name} onClick={() => navigate(ROUTES.ROOT)}>
          VFOOD
        </p>
        <nav className={styles.nav}>
          <Link to={ROUTES.ABOUT} className={styles.nav__item}>
            About
          </Link>
          <Link to={ROUTES.CONTACTS} className={styles.nav__item}>
            Contacts
          </Link>
          <Link to={ROUTES.CART} className={styles.nav__item}>
            Cart
          </Link>
        </nav>
        <div className={styles.info}>
          <p>{username}</p>
          <p onClick={handleSignOut} className={styles.btn}>
            Sign out
          </p>
        </div>
      </div>
    </header>
  );
};

export default Header;
