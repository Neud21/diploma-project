import { ReactNode } from "react";
import { Link } from "react-router-dom";

import styles from "./styles.module.scss";

interface AuthFormProps {
  title: string;
  children: ReactNode;
  submitText: string;
  onSubmit: () => void;
  error: string | null;
  linkPath: string;
  linkText: string;
  loading?: boolean;
}

export const AuthForm = ({
  title,
  children,
  submitText,
  error,
  linkPath,
  linkText,
  onSubmit,
  loading,
}: AuthFormProps) => {
  return (
    <section className={styles.form}>
      <h2 className={styles.form__title}>{title}</h2>

      {children}

      <button onClick={onSubmit} className={styles.button} disabled={loading}>
        {loading ? "Loading..." : submitText}
      </button>

      {error && <p className={styles.error}>{error}</p>}

      <Link to={linkPath} className={styles.link}>
        {linkText}
      </Link>
    </section>
  );
};
