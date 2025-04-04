import { createSlice } from "@reduxjs/toolkit";

const initialState = { isSearching: false };

const startSearch = createSlice({
  name: "startSearch",
  initialState,
  reducers: {
    setSearching: (state, action) => {
      state.isSearching = action.payload;
    },
  },
});

export const { setSearching } = startSearch.actions;
export default startSearch.reducer;

export const runSearch = (delay = 100) => (dispatch) => {
  dispatch(setSearching(true));
  setTimeout(() => {
    dispatch(setSearching(false));
  }, delay);
};
