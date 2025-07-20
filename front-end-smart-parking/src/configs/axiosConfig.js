import { API_BASE_URL } from '@/configs/apiConfig'
import { refreshToken } from '@/service/authenticationService'
import { getAccessToken, setAccessToken } from '@/service/cookieService'
import { getRefeshToken, setAccountFullName, setAccountId, setActor, setPartnerFullName, setRefreshToken } from '@/service/localStorageService'
import { getDataApi } from '@/utils/api'
import { toastError } from '@/utils/toast'
import axios from 'axios'


let refreshing = false

const processRefreshToken = async () => {
  refreshing = true
  const response = await refreshToken(getAccessToken(), getRefeshToken());

  if (response.status === 200) {
    const result = getDataApi(response);
    setAccessToken(result.accessToken);
    setRefreshToken(result.refreshToken);
    setAccountFullName(result?.fullName);
    setPartnerFullName(result?.partnerFullName);
    setAccountId(result?.id);
    setActor(result?.actor)
  } else {
    window.location.href = '/authen'
  }

  refreshing = false
}

const httpClient = axios.create({
  baseURL: `${API_BASE_URL}`,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 60000
})

httpClient.interceptors.request.use(
  (config) => {
    const token = getAccessToken()
    if (!config.headers['Authorization'] && !config.skipAuth && token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

httpClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    const status = error.response?.status
    const code = error.response?.data?.code

    if (status === 401 && code === 1041 && !originalRequest._retry) {
      originalRequest._retry = true
      try {
        if (!refreshing) {
          await processRefreshToken()
        }
        
        await waitForRefreshing()

        originalRequest.headers['Authorization'] = 'Bearer ' + getAccessToken()

        return httpClient(originalRequest)
      } catch (refreshError) {
        toastError("Phiên làm việc đã hết hạn")
        window.location.href = '/authen'
      }
    } else if (status === 401 && code === 1041) {
      window.location.href = '/authen'
    }
    return Promise.reject(error)
  }
)

const waitForRefreshing = () => {
  return new Promise((resolve) => {
    const interval = setInterval(() => {
      if (!refreshing) {
        clearInterval(interval)
        resolve()
      }
    }, 100)
  })
}


export default httpClient