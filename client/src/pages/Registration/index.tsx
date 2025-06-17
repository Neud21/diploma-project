import { ChangeEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { AuthForm } from "@/components/AuthForm";
import AuthInput from "@/components/AuthInput";
import WelcomeText from "@/components/WelcomeText";
import { ROUTES } from "@/constants/routes";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import {
  addError,
  clearError,
  registrationUser,
} from "@/store/slices/authSlice";

import styles from "./styles.module.scss";

export default function Registration() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");

  const navigate = useNavigate();

  const { loading, error } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const handleSetLogin = (e: ChangeEvent<HTMLInputElement>) => {
    setLogin(e.target.value);
  };
  const handleSetPassword = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };
  const handleSetRepeatPassword = (e: ChangeEvent<HTMLInputElement>) => {
    setRepeatPassword(e.target.value);
  };

  const handleRegistrate = () => {
    if (login.trim().length < 3) {
      dispatch(addError("Логин должен содержать минимум 3 символа"));
      return;
    }

    if (password.trim().length < 3) {
      dispatch(addError("Пароль должен содержать минимум 3 символа"));
      return;
    }

    if (password !== repeatPassword) {
      dispatch(addError("Пароли не совпадают"));
      return;
    }

    dispatch(clearError());

    dispatch(registrationUser({ login, password }))
      .unwrap()
      .then(() => {
        navigate(ROUTES.ROOT);
      });
  };

  useEffect(() => {
    dispatch(clearError());
  }, []);

  return (
    <section className={styles.container}>
      <WelcomeText />

      <AuthForm
        title="Sign up"
        submitText="Sign up"
        onSubmit={handleRegistrate}
        linkText="Already have an account? Log in!"
        linkPath={ROUTES.LOGIN}
        error={error}
        loading={loading}
      >
        <AuthInput
          value={login}
          onChange={handleSetLogin}
          maxLength={30}
          placeholder="Enter login"
        />
        <AuthInput
          value={password}
          onChange={handleSetPassword}
          maxLength={16}
          type="password"
          placeholder="Enter password"
        />
        <AuthInput
          value={repeatPassword}
          onChange={handleSetRepeatPassword}
          maxLength={16}
          type="password"
          placeholder="Repeat password"
        />
      </AuthForm>
    </section>
  );
}
