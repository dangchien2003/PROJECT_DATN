import { setFocusWithAutoClear } from "@/store/focusSlice";

export const validateInput = (error, indexKey, dispatch) => {
  // bắt lỗi input
  const keyError = Object.keys(error);
  if (keyError.length > 0) {
    // forcus
    const firstKeyError = indexKey.find((key) => error[key]);
    if (firstKeyError) {
      dispatch(setFocusWithAutoClear(firstKeyError));
    }
    return false;
  }
  

  return true;
}

export const checkRequireInput= (data, fieldError, usePushError, keyRequire) => {
  if(Array.isArray(keyRequire)) {
    keyRequire.forEach(item => {
      const keys = item.split(".");
      let current = data;
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) {
          current[keys[i]] = {};
        }
        current = current[keys[i]];
      }

      // không có dữ liệu và chưa báo lỗi
      if((current[keys[keys.length - 1]] === null || current[keys[keys.length - 1]] === undefined || current[keys[keys.length - 1]] === "") && !fieldError[item]) {
        usePushError(item, "Bắt buộc nhập"); 
      }
    })
  }
}
