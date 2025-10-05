import { API_BASE_URL } from '@/configs/apiConfig'
import { refreshToken } from '@/service/authenticationService'
import { getAccessToken, moveAccessToken, setAccessToken } from '@/service/cookieService'
import { 
  deleteRefeshToken, 
  getRefeshToken, 
  setAccountFullName, 
  setAccountId, 
  setActor, 
  setPartnerFullName, 
  setRefreshToken 
} from '@/service/localStorageService'
import { getDataApi } from '@/utils/api'
import { toastError } from '@/utils/toast'
import axios from 'axios'

// Biến toàn cục để quản lý refresh token
let refreshTokenPromise = null
let isRedirecting = false // Thêm flag để tránh redirect nhiều lần

/**
 * Redirect về trang đăng nhập
 */
const redirectToLogin = (showToast = true) => {
  // Tránh redirect nhiều lần
  if (isRedirecting) {
    return
  }
  
  isRedirecting = true
  
  // Clear token
  moveAccessToken()
  deleteRefeshToken()
  
  // Show toast
  if (showToast) {
    toastError('Phiên làm việc đã hết hạn')
  }
  
  // Redirect
  setTimeout(() => {
    if (window.location.pathname !== '/authen') {
      window.location.href = '/authen'
    }
  }, 100)
}

/**
 * Xử lý refresh token
 * Đảm bảo chỉ có 1 request refresh token tại 1 thời điểm
 */
const processRefreshToken = async () => {
  // Nếu đang refresh, return promise hiện tại
  if (refreshTokenPromise) {
    return refreshTokenPromise
  }

  const currentRefreshToken = getRefeshToken()
  const currentAccessToken = getAccessToken()

  // Kiểm tra token tồn tại
  if (!currentRefreshToken || !currentAccessToken) {
    redirectToLogin(false)
    return Promise.reject(new Error('No tokens available'))
  }

  refreshTokenPromise = refreshToken(currentAccessToken, currentRefreshToken)
    .then(response => {
      // Kiểm tra status code
      if (response.status === 200) {
        const result = getDataApi(response)
        
        // Validate response data
        if (!result.accessToken || !result.refreshToken) {
          throw new Error('Invalid token response')
        }
        
        // Lưu token mới
        setAccessToken(result.accessToken)
        setRefreshToken(result.refreshToken)
        setAccountFullName(result?.fullName)
        setPartnerFullName(result?.partnerFullName)
        setAccountId(result?.id)
        setActor(result?.actor)
        
        return result.accessToken
      } else {
        throw new Error(`Refresh token failed with status: ${response.status}`)
      }
    })
    .catch(error => {
      console.error('Refresh token error:', error)
      
      // Clear token và redirect
      redirectToLogin()
      
      throw error
    })
    .finally(() => {
      refreshTokenPromise = null
    })

  return refreshTokenPromise
}

/**
 * Tạo axios instance
 */
const httpClient = axios.create({
  baseURL: `${API_BASE_URL}`,
  headers: {
    'Content-Type': 'application/json',
    'from-domain': window.location.origin
  },
  timeout: 60000
})

/**
 * Request interceptor
 * Tự động thêm token vào header
 */
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

/**
 * Response interceptor
 * Xử lý auto refresh token khi 401
 */
httpClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    const status = error.response?.status
    
    // Bỏ qua nếu là request refresh token bị lỗi
    if (originalRequest.url?.includes('refresh') || originalRequest.url?.includes('token')) {
      return Promise.reject(error)
    }

    // Kiểm tra lỗi 401
    if (status === 401) {
      // Token expired (code 1041 hoặc bất kỳ lỗi 401 nào)
      if (!originalRequest._retry) {
        originalRequest._retry = true

        try {
          // Refresh token
          const newAccessToken = await processRefreshToken()

          // Cập nhật token mới vào request
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`

          // Retry request gốc
          return httpClient(originalRequest)
          
        } catch (refreshError) {
          // Refresh thất bại -> đã redirect trong processRefreshToken
          console.error('Cannot refresh token:', refreshError)
          return Promise.reject(refreshError)
        }
      } else {
        // Đã retry rồi mà vẫn lỗi
        console.error('Request failed after token refresh')
        redirectToLogin()
        return Promise.reject(error)
      }
    }

    // Lỗi khác
    return Promise.reject(error)
  }
)

export default httpClient
export { processRefreshToken }
