import { addError, removeError, removeManyKeyError, resetError } from "@/store/fieldErrorSlice";
import { useDispatch } from "react-redux";

export function useMessageError() {
  const dispatch = useDispatch();

  const pushMessage = (key, message) => {
    dispatch(addError({ [key]: message }));
  };

  const deleteKey = (key) => {
    dispatch(removeError(key))
  }

  const deleteManyKey = (keys) => {
    dispatch(removeManyKeyError(keys))
  }

  const reset = () => {
    dispatch(resetError())
  }

  return { pushMessage, deleteKey, deleteManyKey, reset };
}