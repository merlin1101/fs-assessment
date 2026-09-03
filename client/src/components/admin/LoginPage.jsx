import axios from 'axios'
import { useState } from 'react'

const LoginPage = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = (event) => {
    event.preventDefault();

    axios.post("/api/login", { username, password })
      .then(response => {
        localStorage.setItem('loggedin', response.data.status);
        window.location.href = '/admin/dashboard';
      })
      .catch(error => {
        console.error("Login failed:", error.response.data.message || error.message)
        setError(error.response.data.message || "Login failed")
        setTimeout(() => setError(""), 3000)
      })
  }

  return (
    <>
      <h1>Login</h1>
      <form onSubmit={ handleSubmit } className='login-form'>
        <input type="text" name="username" placeholder="username" value={username} onChange={(e) => setUsername(e.target.value)} />
        <input type="password" name="password" placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit">Submit</button>
        <p>{ error }</p>
      </form>
    </>
  )
}

export default LoginPage