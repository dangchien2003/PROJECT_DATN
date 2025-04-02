import { createSlice } from "@reduxjs/toolkit";

const initialState = {};

const fieldError = createSlice({
  name: "fieldError",
  initialState,
  reducers: {
    addError: (state, action) => ({...state, ...action.payload}) /*input {key: value}*/,
    removeError: (state, action) => { /*input key*/
      delete state[action.payload];
    },
    resetError: () => ({})
  },
});

export const { addError, removeError, resetError } = fieldError.actions;
export default fieldError.reducer;
