import { configureStore } from "@reduxjs/toolkit";
import loadingReducer from "./loadingSlice";
import focusReducer from "./focusSlice";

const store = configureStore({
  reducer: {
    loading: loadingReducer,
    focus: focusReducer,
  },
});

export default store;
