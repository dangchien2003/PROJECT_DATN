import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  title: null
};

const loadingSlice = createSlice({
  name: "loading",
  initialState,
  reducers: {
    showLoading: (state, action) => {
      state.isLoading = true;
      state.title = action.payload;
    },

    hideLoading: (state) => {
      state.isLoading = false;
      state.title = null;
    },
  },
});

export const { showLoading, hideLoading } = loadingSlice.actions;
export default loadingSlice.reducer;
