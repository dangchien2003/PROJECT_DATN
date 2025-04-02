import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "@/store/loadingSlice";

export function useLoading() {
  const dispatch = useDispatch();

  const showLoad = (title) => {
    dispatch(showLoading(title));
  };

  const hideLoad = () => {
    dispatch(hideLoading());
  };

  return { showLoad, hideLoad };
}
