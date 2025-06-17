import { ChangeEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { AuthForm } from "@/components/AuthForm";
import AuthInput from "@/components/AuthInput";
import WelcomeText from "@/components/WelcomeText";
import { ROLES } from "@/constants/roles";
import { ROUTES } from "@/constants/routes";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { addError, clearError, loginUser } from "@/store/slices/authSlice";

import styles from "./styles.module.scss";

export default function Login() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");

  const { loading, error } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const handleSetLogin = (e: ChangeEvent<HTMLInputElement>) => {
    setLogin(e.target.value);
  };
  const handleSetPassword = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleLogin = () => {
    if (!login.trim().length || !password.trim().length) {
      dispatch(addError("Поля не должны быть пустыми"));
      return;
    }

    dispatch(clearError());

    dispatch(loginUser({ login: login.trim(), password }))
      .unwrap()
      .then((user) => {
        switch (user.user_role) {
          case ROLES.ADMIN:
            navigate(ROUTES.ADMIN_ROOT);
            break;
          case ROLES.COURIER:
            navigate(ROUTES.COURIER_ROOT);
            break;
          default:
            navigate(ROUTES.ROOT);
        }
      });
  };

  useEffect(() => {
    dispatch(clearError());
  }, []);

  return (
    <section className={styles.container}>
      <WelcomeText />
      <AuthForm
        title="Login"
        submitText="Login"
        onSubmit={handleLogin}
        linkText=" Don’t have an account? Sign up!"
        linkPath={ROUTES.REGISTRATION}
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
      </AuthForm>
    </section>
  );
}
