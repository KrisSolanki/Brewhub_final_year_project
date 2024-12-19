import React, { useContext, useState } from 'react';
import './Login.css';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../../../Context/AuthContext';
import axios from 'axios';
import Notification from '../../Notification/Notification';

const Login = ({ onNext }) => {
  const { loginUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isPasswordValid, setIsPasswordValid] = useState(true);
  const [loginError, setLoginError] = useState('');

  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationColor, setNotificationColor] = useState('');

  // Validate email format
  const validateEmail = () => {
    let isValid = true;
    let errorMessage = '';

    if (email.trim() === '') {
      isValid = false;
      errorMessage = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      isValid = false;
      errorMessage = 'Invalid email format';
    }

    setIsEmailValid(isValid);
    setLoginError(errorMessage);
    return isValid;
  };

  // Validate password length
  const validatePassword = () => {
    const isValid = password.length >= 6;
    setIsPasswordValid(isValid);
    return isValid;
  };

  // Handle form submission
  const handleNext = async () => {
    const isEmailValid = validateEmail();
    const isPasswordValid = validatePassword();

    if (isEmailValid && isPasswordValid) {
      try {
        const response = await axios.post('http://127.0.0.1:8000/api/login/', {
          email: email,
          password: password,
        });

        if (response.status === 200) {
          alert('OTP sent successfully');
          setNotificationMessage('OTP sent successfully');
          setNotificationColor('green');
          setShowNotification(true);
          setTimeout(() => setShowNotification(false), 3000);
          navigate('/otp', { state: { email } });
        } else {
          setNotificationMessage('Failed to send OTP. Please try again.');
          setNotificationColor('red');
          setShowNotification(true);
          setTimeout(() => setShowNotification(false), 3000);
        }
      } catch (error) {
        console.error('Error sending OTP:', error.message);
        setNotificationMessage('Failed to send OTP. Please try again later.');
        setNotificationColor('red');
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 3000);
      }
    } else {
      console.log('Form has errors. Please check your inputs.');
    }
  };

  return (
    <>
      <div className="container_login">
        {showNotification && (
          <Notification message={notificationMessage} color={notificationColor} />
        )}
        <div className="container_loginchilde">
          <div className="loginForm">
            <h2 className="logintext">Login</h2>
            <form onSubmit={loginUser}>
              <label>
                Email:
                <input
                  type="email"
                  value={email}
                  name="email"
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={validateEmail}
                  className={!isEmailValid ? 'invalid' : ''}
                />
                {!isEmailValid && <span className="error login-span">{loginError}</span>}
              </label>
              <label>
                Password:
                <input
                  type="password"
                  value={password}
                  name="password"
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={validatePassword}
                  className={!isPasswordValid ? 'invalid' : ''}
                />
                {!isPasswordValid && (
                  <span className="error login-span">Password must be at least 6 characters</span>
                )}
              </label>
              <label className="forgotPass">
                <Link to="/forgotpassword" className="forgotPassLink">
                  <span className="login-span">Forgot Password?</span>
                </Link>
              </label>
              <button type="submit" onClick={handleNext} className="login-button">
                Next
              </button>
              <label className="custom-label">
                <span className="login-span">
                  <Link to="/Registration" className="custom-link">
                    Don't have an account? Sign up
                  </Link>
                </span>
              </label>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
