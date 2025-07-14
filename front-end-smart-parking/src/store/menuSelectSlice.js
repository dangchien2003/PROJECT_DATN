import { createSlice } from "@reduxjs/toolkit";

const initialState = null;

const menuSelectSlice = createSlice({
  name: "menuSelectSlice",
  initialState,
  reducers: {
    selecting: (state, action) => {
      return action.payload;
    },
  },
});

export const { selecting } = menuSelectSlice.actions;
export default menuSelectSlice.reducer;
