import { configureStore } from "@reduxjs/toolkit";
import loadingReducer from "./loadingSlice";
import focusReducer from "./focusSlice";
import fieldErrorReducer from "./fieldErrorSlice";
import requireFieldReducer from "./requireFieldSlice";
import startSearchReducer from "./startSearchSlice";
import remainingReducer from "./remainingSlice";

const store = configureStore({
  reducer: {
    loading: loadingReducer,
    focus: focusReducer,
    fieldError: fieldErrorReducer,
    requireField: requireFieldReducer,
    startSearch: startSearchReducer,
    remaining: remainingReducer,
  },
});

export default store;
