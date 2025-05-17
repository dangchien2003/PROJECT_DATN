import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  title: null,
  type: 1,
};

const loadingSlice = createSlice({
  name: "loading",
  initialState,
  reducers: {
    showLoading: (state, action) => {
      state.isLoading = true;
      if(typeof action.payload === "object" ) {
        state.title = action.payload.title;
        state.type = action.payload.type;
      } else {
        state.title = action.payload;
        state.type = 1;
      }
    },

    hideLoading: (state) => {
      state.isLoading = false;
      state.title = null;
      state.type = 1;
    },
  },
});

export const { showLoading, hideLoading } = loadingSlice.actions;
export default loadingSlice.reducer;
