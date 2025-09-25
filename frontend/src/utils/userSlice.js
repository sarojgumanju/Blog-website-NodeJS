import { createSlice } from "@reduxjs/toolkit";

let initialState;
try {
  const storedUser = localStorage.getItem("user");
  initialState = storedUser ? JSON.parse(storedUser) : { token: null };
} catch {
  initialState = { token: null };
}
  
const userSlice = createSlice({
  name: "userSlice",
  initialState,
  reducers: {
    login(state, action) {
      console.log(action.payload);
      localStorage.setItem("user", JSON.stringify(action.payload));
      console.log(action.payload);
      return action.payload;
    },

    logout() {
      localStorage.removeItem("user");
      return { token: null };
    },
  },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;
