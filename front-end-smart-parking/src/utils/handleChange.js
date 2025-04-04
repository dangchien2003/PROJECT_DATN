import { updateObjectValue } from "./object";

export const changeInputTrend = (dataSearch, key, value, trend, skip) => {
  if(dataSearch) {
    if(skip !== "value") {
      updateObjectValue(dataSearch, key + ".value", value);
    }
    if(skip !== "trend") {
      updateObjectValue(dataSearch, key + ".trend", trend);
    }
  }
}

export const changeInput = (dataSearch, key, value) => {
  if (dataSearch) {
    updateObjectValue(dataSearch, key, value);
  }
}

