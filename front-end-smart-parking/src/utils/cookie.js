export function setCookie(name, value, seconds) {
  let expires = ''
  if (seconds) {
    const date = new Date()
    date.setTime(date.getTime() + (seconds * 1000))
    expires = '; expires=' + date.toUTCString()
  }
  document.cookie = name + '=' + (value || '') + expires + '; path=/'
}

export function getCookie(name) {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) {
    return parts.pop().split('; ').shift()
  }
  return null
}

export function deleteCookie(name) {
  document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;'
}