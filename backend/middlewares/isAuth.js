
import jwt from "jsonwebtoken"
import User from '../models/userModel.js'

const isAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies

    if (!token) {
      return res.status(401).json({ message: "User is not authenticated" })
    }

    let verifyToken
    try {
      verifyToken = jwt.verify(token, process.env.JWT_SECRET)
    } catch (e) {
      // Token invalid or expired -> unauthorized
      return res.status(401).json({ message: "Invalid or expired authentication token" })
    }

    if (!verifyToken || !verifyToken.userId) {
      return res.status(401).json({ message: "Invalid authentication token" })
    }

    // Attach full user object to request
    const user = await User.findById(verifyToken.userId)
    if (!user) return res.status(401).json({ message: 'User not found' })

    // If forceLogout flag is set and not expired, deny access
    if (user.forceLogout) {
      // If a forceLogoutUntil exists and is in the past, clear it
      if (user.forceLogoutUntil && user.forceLogoutUntil < new Date()) {
        user.forceLogout = false
        user.forceLogoutUntil = null
        await user.save()
      } else {
        return res.status(401).json({ message: 'User has been logged out due to policy violation' })
      }
    }

    req.user = user
    req.userId = user._id
    next()
  } catch (error) {
    console.error('isAuth unexpected error:', error)
    // In case of truly unexpected error, still avoid leaking internals
    return res.status(500).json({ message: 'Internal server error' })
  }
}

export default isAuth