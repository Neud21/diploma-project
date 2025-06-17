import { ChangeEvent } from "react";

import styles from "./styles.module.scss";

interface AuthInputProps {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  type?: string;
  maxLength?: number;
  minLength?: number;
}

export default function AuthInput({
  value,
  onChange,
  placeholder,
  type = "text",
  maxLength,
}: AuthInputProps) {
  return (
    <input
      value={value}
      onChange={onChange}
      type={type}
      placeholder={placeholder}
      className={styles.input}
      maxLength={maxLength}
    />
  );
}
