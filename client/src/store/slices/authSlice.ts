import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

import { api } from "@/api";
import { ROLES } from "@/constants/roles";
import { LoginData, RegistrationUserData } from "@/types/auth";
import { IUser } from "@/types/user";

export const loginUser = createAsyncThunk(
  "auth/login",
  async (user: LoginData) => {
    const response = await api.login(user);
    return response;
  }
);
export const registrationUser = createAsyncThunk(
  "auth/registrationUser",
  async (user: RegistrationUserData) => {
    const response = await api.registrationUser(user);
    return response;
  }
);

interface AuthState {
  loading: boolean;
  error: string | null;
  user: IUser;
}

const initialState: AuthState = {
  loading: false,
  error: null,
  user: {
    username: localStorage.getItem("username"),
    token: localStorage.getItem("token"),
    user_role: (localStorage.getItem("user_role") as ROLES) || ROLES.USER,
  },
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    signOut(state) {
      state.user = {
        ...state.user,
        username: null,
        token: null,
      };
      localStorage.removeItem("username");
      localStorage.removeItem("token");
      localStorage.removeItem("user_role");
    },
    addError(state, action: PayloadAction<string>) {
      state.error = action.payload;
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginUser.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.user = { ...payload };
        localStorage.setItem("username", payload.username);
        localStorage.setItem("token", payload.token);
        localStorage.setItem("user_role", payload.user_role);
      })
      .addCase(loginUser.rejected, (state, { error }) => {
        state.loading = false;
        state.error = error.message || "Unknown error";
      })

      .addCase(registrationUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(registrationUser.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.user = { ...payload, user_role: ROLES.USER };
        localStorage.setItem("username", payload.username);
        localStorage.setItem("token", payload.token);
        localStorage.setItem("user_role", ROLES.USER);
      })
      .addCase(registrationUser.rejected, (state, { error }) => {
        state.loading = false;
        state.error = error.message || "Unknown error";
      });
  },
});

export const { signOut, addError, clearError } = authSlice.actions;

export default authSlice.reducer;
