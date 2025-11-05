import axios from 'axios'

// Ensure credentials are sent by default
axios.defaults.withCredentials = true

// Add a response interceptor to handle 401 (forced logout)
let isRedirecting = false
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error?.response?.status
    const originalRequest = error.config

    // Only handle 401 errors
    if (status !== 401) {
      return Promise.reject(error)
    }

    // If the error is from the logout endpoint itself, just let it pass.
    if (originalRequest.url.includes('/api/auth/logout')) {
      return Promise.reject(error)
    }

    // For the initial check of the current user, we expect a 401 if not logged in.
    // We just reject it so the app can render its public state without showing an error.
    if (originalRequest.url.includes('/api/user/currentuser')) {
      return Promise.reject(error)
    }

    // Prevent redirect loops or multiple redirects.
    // If we are already redirecting or on the login page, don't do anything.
    if (isRedirecting || window.location.pathname === '/login') {
      return Promise.reject(error)
    }

    isRedirecting = true

    // Redirect to the login page.
    // The user state should be cleared by the component that calls logout.
    // This interceptor's job is to handle unexpected 401s (e.g., expired token, forced logout).
    window.location.replace('/login')

    // We return a rejected promise to stop the original request chain.
        return Promise.reject(error)
  }
)

export default axios
