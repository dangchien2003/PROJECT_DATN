import axios from 'axios'
import { API_BASE_URL } from '@/configs/apiConfig'


// let refreshing = false

// const refreshToken = async () => {
//   refreshing = true
//   const response = await axios.post(`${API_BASE_URL}` + API_IDENTITY_SERVICE.refreshToken,
//     {
//       // refreshToken: getRefeshToken(),
//       // accessToken: getAccessToken()
//     },
//     {
//       headers: {
//         Authorization: undefined
//       }
//     })


//   if (response.status === 200) {
//     const newAccessToken = response.data.result.token
//     setAccessToken(newAccessToken)
//   }

//   refreshing = false
// }

const httpClient = axios.create({
  baseURL: `${API_BASE_URL}`,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 60000
})

// httpClient.interceptors.request.use(
//   (config) => {
//     const token = getAccessToken()
//     if (token) {
//       config.headers['Authorization'] = `Bearer ${token}`
//     }
//     return config
//   },
//   (error) => {
//     return Promise.reject(error)
//   }
// )

// httpClient.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config
//     const status = error.response?.status
//     const code = error.response?.data?.code

//     if (status === 401 && code === 1041 && !originalRequest._retry) {

//       originalRequest._retry = true
//       try {
//         if (!refreshing) {
//           await refreshToken()
//         }

//         await waitForRefreshing()

//         originalRequest.headers['Authorization'] = 'Bearer ' + getAccessToken()

//         return httpClient(originalRequest)
//       } catch (refreshError) {
//         window.location.href = '/login?message=Phiên làm việc hết hạn'
//       }
//     } else {
//       const response = error.response.data
//       const message = messageError[response.code]
//       toastError(message ? message : response.message)
//     }

//     return Promise.reject(error)
//   }
// )

// const waitForRefreshing = () => {
//   return new Promise((resolve) => {
//     const interval = setInterval(() => {
//       if (!refreshing) {
//         clearInterval(interval)
//         resolve()
//       }
//     }, 100)
//   })
// }


export default httpClient