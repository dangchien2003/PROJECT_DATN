import { toast, Bounce } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const configToast = {
  position: "bottom-right",
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: false,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "light",
  transition: Bounce,
}

export const toastSuccess = (message) => {
  toast.success(message , configToast);
}

export const toastError = (message) => {
  toast.error(message , configToast);
}

export const toastInfo = (message) => {
  toast.info(message , configToast);
}

export const toastWarning = (message) => {
  toast.warning(message , configToast);
}