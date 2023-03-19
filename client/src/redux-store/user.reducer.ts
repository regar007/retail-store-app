import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import localStorageUtils from "../utils/localStorage.utils";

export class User {
  id?: string;

  name?: string;

  email?: string;

  type?: string;

  contactNumber?: string;

  password?: string;

  refreshToken?: string;

  designation?: string;

  storeId?: string;

  createdByUserId?: string;

  createdDate?: Date;

  isActive?: boolean;
}

export type UserInitialState = {
  user: User | null;

  fetching: boolean;

  error: string | null;
};

// Define the initial state using that type
const initialState: UserInitialState = {
  user: localStorageUtils.readSession(),
  fetching: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    onError(state, action) {
      state.user = null;
      state.error = action.payload;
      state.fetching = false;
    },
    authenticated(state, action) {
      state.user = action.payload;
      state.error = null;
      state.fetching = false;
    },
    login(state, _action: PayloadAction<User>) {
      state.user = null;
      state.error = null;
      state.fetching = true;
    },
    logout(state, _action) {
      state.user = null;
      state.error = null;
      state.fetching = true;
    },
  },
});

export const { onError, authenticated, login, logout } = userSlice.actions;
export default userSlice.reducer;
