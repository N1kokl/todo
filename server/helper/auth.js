import jwt from 'jsonwebtoken'
import { ApiError } from './ApiError.js'

const { verify } = jwt

const auth = (req, _res, next) => {
  const [scheme, token] =
    req.get('authorization')?.split(' ') || []

  if (scheme !== 'Bearer' || !token) {
    return next(
      new ApiError('Authentication required', 401),
    )
  }

  try {
    req.user = verify(
      token,
      process.env.JWT_SECRET_KEY,
    )
    return next()
  } catch {
    return next(
      new ApiError(
        'Invalid or expired token',
        401,
      ),
    )
  }
}

export { auth }
