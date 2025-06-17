import styles from "./styles.module.scss";

export default function WelcomeText() {
  return (
    <section className={styles.welcome__container}>
      <h1 className={styles.title}>VFood</h1>
      <div className={styles.description__container}>
        <p className={styles.description}>
          Welcome to VFood! Here you can buy some delicious and tasty food.
        </p>
        <p className={styles.description}>Login or Sign up to get started!</p>
      </div>
    </section>
  );
}
