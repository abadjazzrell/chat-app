import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { register } from '../../redux/authSlice'
import classes from "./register.module.css"

const Register = () => {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPass, setconfirmPass] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const dispatch = useDispatch()


  const handleRegister = async (e) => {
    e.preventDefault()
    if(password !== confirmPass) return 
    try {
      const res = await fetch('http://localhost:4000/auth/register', {
        headers: {
          'Content-Type': "application/json"
        },
        method: "POST",
        body: JSON.stringify({username, email, password})
      })
      const data = await res.json()
      dispatch(register(data))
      navigate("/")
    } catch (error) {
      setError(prev => true)
      setTimeout(() => {
        setError(prev => false)
      }, 2500)
      console.error(error)
    }
  }

  return (
    <div className={classes.container}>
    <div className={classes.wrapper}>
      <h2 className={classes.title}>Login</h2>
      <form onSubmit={handleRegister}>
        <label htmlFor='username'>
          <input onChange={(e) => setUsername(prev => e.target.value)} type="text" id='username' placeholder='Enter Username' />
        </label>
        <label htmlFor='email'>
          <input onChange={(e) => setEmail(prev => e.target.value)} type="email" id='email' placeholder='Enter Email' />
        </label>
        <label htmlFor='password'>
          <input onChange={(e) => setPassword(prev => e.target.value)} type="password" id='password' placeholder='Enter password' />
        </label>
        <label htmlFor='confirmPass'>
          <input onChange={(e) => setconfirmPass(prev => e.target.value)} type="password" id='confirmPass' placeholder='Confirm Pass' />
        </label>
       
        <button className={classes.submitBtn}>Login</button>
        <Link to='/login' > Already have an account? <p className={classes.register}>Login Now</p></Link>
      </form>
      {
        error &&
        <div className={classes.errorMessage}>
          Wrong credentials! Try different ones.
        </div>
      }
    </div>
    
  </div>
  )
}

export default Register
