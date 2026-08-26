import { Link, useNavigate } from 'react-router-dom'
import { useUser } from '../context/useUser'
import '../App.css'

export const AuthenticationMode = Object.freeze({
  SignIn: 'Login',
  SignUp: 'SignUp',
})

const getErrorMessage = (error) =>
  error.response?.data?.error?.message ||
  error.response?.data?.message ||
  error.message ||
  String(error)

export default function Authentication({
  authenticationMode,
}) {
  const { user, setUser, signUp, signIn } = useUser()
  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      if (authenticationMode === AuthenticationMode.SignUp) {
        await signUp()
        navigate('/signin')
      } else {
        await signIn()
        navigate('/')
      }
    } catch (error) {
      alert(getErrorMessage(error))
    }
  }

  const changeModePath =
    authenticationMode === AuthenticationMode.SignIn
      ? '/signup'
      : '/signin'

  return (
    <div className="auth-page">
      <h3>
        {authenticationMode === AuthenticationMode.SignIn
          ? 'Sign in'
          : 'Sign up'}
      </h3>

      <form
        className="auth-form"
        onSubmit={handleSubmit}
      >
        <label htmlFor="email">Email</label>
        <input
          id="email"
          placeholder="Email"
          type="email"
          value={user.email || ''}
          onChange={(event) =>
            setUser({
              ...user,
              email: event.target.value,
            })
          }
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          placeholder="Password"
          type="password"
          value={user.password || ''}
          onChange={(event) =>
            setUser({
              ...user,
              password: event.target.value,
            })
          }
        />

        <button type="submit">
          {authenticationMode === AuthenticationMode.SignIn
            ? 'Login'
            : 'Submit'}
        </button>

        <Link
          to={changeModePath}
          onClick={() =>
            setUser({ email: '', password: '' })
          }
        >
          {authenticationMode === AuthenticationMode.SignIn
            ? 'No account? Sign up'
            : 'Already signed up? Sign in'}
        </Link>
      </form>
    </div>
  )
}
