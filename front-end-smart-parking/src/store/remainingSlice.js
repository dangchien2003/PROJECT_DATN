import { createSlice } from "@reduxjs/toolkit";

const initialState = 0;

const remainingSlice = createSlice({
  name: "remaining",
  initialState,
  reducers: {
    plusRemaining: (state, action) => state + action.payload,
    minusRemaining: (state, action) => state - action.payload,
    setRemaining: (state, action) => action.payload,
  },
});

export const { plusRemaining, minusRemaining, setRemaining } = remainingSlice.actions;
export default remainingSlice.reducer;
