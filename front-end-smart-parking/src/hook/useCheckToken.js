import { checkAccessToken } from "@/service/authenticationService";
import { getAccessToken } from "@/service/cookieService";
import { authened } from "@/store/authenSlice";
import { getDataApi } from "@/utils/api";
import { toastError } from "@/utils/toast";
import { useDispatch } from "react-redux";

export function useCheckToken() {
  const dispatch = useDispatch();

  const check = () => {
    const access = getAccessToken();
    if (access) {
      checkAccessToken({ token: access }).then(respose => {
        const result = getDataApi(respose);
        if (result === true) {
          dispatch(authened(true));
        } else {
          dispatch(authened(false));
        }
      })
        .catch(e => {
          const response = getDataApi(e);
          toastError(response.message);
          dispatch(authened(false));
        })
    } else {
      dispatch(authened(false));
    }
  };

  return { check };
}
