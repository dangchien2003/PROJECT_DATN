import { deleteKeyRequire, pushKeyRequire, setKeyRequire } from "@/store/requireFieldSlice";
import { useDispatch } from "react-redux";

export function useRequireField() {
  const dispatch = useDispatch();

  const setRequireField = (keys) => {
    dispatch(setKeyRequire(keys));
  };

  const pushRequireField = (keys) => {
    dispatch(pushKeyRequire(keys));
  };

  const deleteRequireField = (keys) => {
    dispatch(deleteKeyRequire(keys))
  }

  const resetRequireField = () => {
    dispatch(setKeyRequire([]));
  };

  return { setRequireField, pushRequireField, resetRequireField, deleteRequireField };
}
