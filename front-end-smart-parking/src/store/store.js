import { configureStore } from "@reduxjs/toolkit";
import loadingReducer from "./loadingSlice";
import focusReducer from "./focusSlice";
import fieldErrorReducer from "./fieldErrorSlice";
import requireFieldReducer from "./requireFieldSlice";

const store = configureStore({
  reducer: {
    loading: loadingReducer,
    focus: focusReducer,
    fieldError: fieldErrorReducer,
    requireField: requireFieldReducer
  },
});

export default store;
