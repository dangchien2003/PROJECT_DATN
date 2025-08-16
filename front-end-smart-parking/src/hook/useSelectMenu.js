import { selecting } from "@/store/menuSelectSlice";
import { useDispatch } from "react-redux";

export function useSelectMenu() {
  const dispatch = useDispatch();

  const select = (menuId) => {
    dispatch(selecting(menuId));
  };

  return { select };
}
