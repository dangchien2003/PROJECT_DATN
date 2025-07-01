import { createSlice } from "@reduxjs/toolkit";

const initialState = 10000;

const remainingSlice = createSlice({
  name: "remaining",
  initialState,
  reducers: {
    plus: (state, action) => state + action.payload,
    minus: (state, action) => state - action.payload,
  },
});

export const { plus, minus } = remainingSlice.actions;
export default remainingSlice.reducer;
