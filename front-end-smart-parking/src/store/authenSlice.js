import { createSlice } from "@reduxjs/toolkit";

const initialState = false;

const authenSlice = createSlice({
  name: "authenSlice",
  initialState,
  reducers: {
    authened: (state, action) => {
      return action.payload;
    },
  },
});

export const { authened } = authenSlice.actions;
export default authenSlice.reducer;
