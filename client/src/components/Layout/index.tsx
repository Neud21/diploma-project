import { Outlet } from "react-router-dom";

import Header from "../Header";
import styles from "./styles.module.scss";

export default function Layout() {
  return (
    <section className={styles.container}>
      <Header />
      <div className={styles.wrapper}>
        <Outlet />
      </div>
    </section>
  );
}
