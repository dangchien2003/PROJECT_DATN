import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

const requireField = createSlice({
  name: "requireField",
  initialState,
  reducers: {
    setKeyRequire: (state, action) => {
      if (Array.isArray(action.payload)) {
        return action.payload;
      }
      return [];
    },
    pushKeyRequire: (state, action) => {
      if (Array.isArray(action.payload)) {
        return state.concat(action.payload);
      }
    },
    deleteKeyRequire: (state, action) => {
      if (Array.isArray(action.payload)) {
        return state.filter(item => !action.payload.includes(item));
      }
    },
  },
});

export const { setKeyRequire, pushKeyRequire, deleteKeyRequire } = requireField.actions;
export default requireField.reducer;
