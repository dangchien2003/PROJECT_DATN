import { setFocusWithAutoClear } from "@/store/focusSlice";

export const validateInput = (error, indexKey, dispatch) => {
  // bắt lỗi input
  if(error) {
    const keyError = Object.keys(error);
    if (keyError.length > 0) {
      // forcus
      const firstKeyError = indexKey.find((key) => error[key]);
      if (firstKeyError) {
        console.log(firstKeyError)
        dispatch(setFocusWithAutoClear(firstKeyError));
      }
      return false;
    }
  }

  return true;
}

export const checkRequireInput= (data, keyRequire) => {
  if(Array.isArray(keyRequire)) {
    keyRequire.forEach(item => {
      debugger
      // không có dữ liệu và chưa báo lỗi
      if((data[item] === null || data[item] === undefined) && !data.error[item]) {
        data.error[item] = "Bắt buộc nhập"
      }
    })
  }
}