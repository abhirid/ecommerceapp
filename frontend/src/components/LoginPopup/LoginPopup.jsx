import React, { useContext, useState } from 'react';
import './LoginPopup.css';
import { assets } from '../../assets/assets';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';

function LoginPopup({ setShowLogin }) {
  const { url, setToken } = useContext(StoreContext);
  const [errors, setErrors] = useState({ email: '', password: '', name: '' });
  const [currState, setCurrState] = useState("Login");
  const [data, setData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData(data => ({ ...data, [name]: value }));
    setErrors(errors => ({ ...errors, [name]: '' })); // Clear error for the changed field
  };

  const onLogin = async (event) => {
    event.preventDefault();

    const newUrl = `${url}/api/user/${currState === "Login" ? 'login' : 'register'}`;
    const filteredData = {
      ...(currState === "Sign Up" && { name: data.name }), // Include name only for registration
      email: data.email,
      password: data.password
    };

    try {
      const response = await axios.post(newUrl, filteredData);
      if (response.data.success) {
        setToken(response.data.token);
        localStorage.setItem('token', response.data.token);
        setShowLogin(false);
        setErrors({ email: '', password: '', name: '' }); // Clear errors on success
      } else {
        // Handle specific error messages based on the response
        if (response.data.msg.includes("User already exists")) {
          setErrors(errors => ({ ...errors, email: response.data.msg }));
        } else if (response.data.msg.includes("Invalid credential")) {
          setErrors(errors => ({ ...errors, password: response.data.msg }));
        } else {
          setErrors(errors => ({ ...errors, email: response.data.msg }));
        }
      }
    } catch (error) {
      // Handle specific error messages
      const errorMessage = error.response ? error.response.data.msg : "An error occurred. Please try again.";
      if (errorMessage.includes("User already exists")) {
        setErrors(errors => ({ ...errors, email: errorMessage }));
      } else if (errorMessage.includes("Invalid credential")) {
        setErrors(errors => ({ ...errors, password: errorMessage }));
      } else {
        setErrors(errors => ({ ...errors, email: errorMessage })); // Default to email error
      }
    }
  };

  return (
    <div className='login-popup'>
      <form onSubmit={onLogin} className="login-popup-container">
        <div className="login-popup-title">
          <h2>{currState}</h2>
          <img onClick={() => setShowLogin(false)} src={assets.cross_icon} alt="" />
        </div>
        <div className="login-popup-inputs">
          {currState === "Login" ? null : (
            <input type="text" name='name' onChange={onChangeHandler} value={data.name} placeholder='Your Name' required />
          )}
          
          <input name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder='Your Email' required />
          <span className="error-message">{errors.email}</span>
          <input name='password' onChange={onChangeHandler} value={data.password} type="password" placeholder='Password' required />
          <span className="error-message">{errors.password}</span>
        </div>
        <button type='submit'>{currState === "Sign Up" ? "Create account" : "Login"}</button>
        <div className="login-popup-condition">
          <input type="checkbox" required />
          <p>By continuing, I agree to the terms of use & privacy policy</p>
        </div>
        {currState === "Login" ? (
          <p>Create a new account? <span onClick={() => setCurrState("Sign Up")}>Click here</span></p>
        ) : (
          <p>Already have an account? <span onClick={() => setCurrState("Login")}>Login here</span></p>
        )}
      </form>
    </div>
  );
}

export default LoginPopup;
