import { configureStore } from "@reduxjs/toolkit";
import loadingReducer from "./loadingSlice";
import focusReducer from "./focusSlice";
import fieldErrorReducer from "./fieldErrorSlice";
import requireFieldReducer from "./requireFieldSlice";
import startSearchReducer from "./startSearchSlice";

const store = configureStore({
  reducer: {
    loading: loadingReducer,
    focus: focusReducer,
    fieldError: fieldErrorReducer,
    requireField: requireFieldReducer,
    startSearch: startSearchReducer
  },
});

export default store;
