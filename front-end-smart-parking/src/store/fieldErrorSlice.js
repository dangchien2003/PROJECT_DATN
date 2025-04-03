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
    removeManyKeyError: (state, action) => { /*input array key*/
      if(Array.isArray(action.payload)) {
        action.payload.forEach(item => {
          delete state[item];
        })
      }
    },
    resetError: () => ({})
  },
});

export const { addError, removeError, removeManyKeyError, resetError } = fieldError.actions;
export default fieldError.reducer;
