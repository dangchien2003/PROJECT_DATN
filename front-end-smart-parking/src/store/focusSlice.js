import { createSlice } from "@reduxjs/toolkit";

const initialState = null;

const focusSlice = createSlice({
  name: "focus",
  initialState,
  reducers: {
    setFocus: (state, action) => action.payload,
  },
});

export const { setFocus } = focusSlice.actions;
export default focusSlice.reducer;
export const setFocusWithAutoClear = (key, delay = 100) => (dispatch) => {
  dispatch(setFocus(key));
  setTimeout(() => {
    dispatch(setFocus(null));
  }, delay);
};
