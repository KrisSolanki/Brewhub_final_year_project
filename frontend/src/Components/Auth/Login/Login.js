import React, { useContext, useState } from 'react';
import './Login.css';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../../../Context/AuthContext';
import axios from 'axios';
import Notification from '../../Notification/Notification';

const Login = ({ onNext }) => {



  let { loginUser } = useContext(AuthContext)

  const navigate = useNavigate();

  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [isMobileNumberValid, setIsMobileNumberValid] = useState(true);
  const [isPasswordValid, setIsPasswordValid] = useState(true);
  const [loginError, setLoginError] = useState("");

  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationColor, setNotificationColor] = useState("");

  // const validateMobileNumber = () => {
  //   const isValid = /^\d{10}$/.test(mobileNumber);
  //   setIsMobileNumberValid(isValid);
  //   return isValid;
  // };

  const validateMobileNumber = () => {
    let isValid = true;
    let errorMessage = "";

    // Check if the mobile number is empty
    if (mobileNumber.trim() === "") {
      isValid = false;
      errorMessage = "Mobile number is required";
    } else if (!/^\d{10}$/.test(mobileNumber)) {
      // Check if the mobile number has exactly 10 digits
      isValid = false;
      errorMessage = "Mobile number must be exactly 10 digits";
    }
    setIsMobileNumberValid(isValid);
    setLoginError(errorMessage); // Set the error message
    return isValid;
  };

  const validatePassword = () => {
    const isValid = password.length >= 6;
    setIsPasswordValid(isValid);
    return isValid;
  };

  const handleNext = async () => {
    const isMobileValid = validateMobileNumber();


    // const isPasswordValid = validatePassword();

    if (isMobileValid) {
      try {
        const response = await axios.post("http://127.0.0.1:8000/api/login/", {
          mobile_no: mobileNumber,
          password: password,
        });

        if (response.status === 200) {
          // Assuming the response contains the OTP or a message indicating success
          alert("OTP sent successfully");
          setNotificationMessage("OTP sent successfully");
          setNotificationColor("green");
          setShowNotification(true);
          setTimeout(() => setShowNotification(false), 3000);
          console.log("OTP sent successfully", response.data.otp);
          navigate("/otp", { state: { mobileNumber } });
        } else {
          setNotificationMessage("Failed to send OTP. Please try again.");
          setNotificationColor("red");
          setShowNotification(true);
          setTimeout(() => setShowNotification(false), 3000);
          //  alert("Failed to send OTP. Please try again.");
        }
      } catch (error) {
        console.error("Error sending OTP:", error.message);
        setNotificationMessage("Failed to send OTP. Please try again later.");
        setNotificationColor("red");
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 3000);
        //  alert("An error occurred while sending OTP.");
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


          <div className='loginForm'>
            <h2 className='logintext'>Login</h2>
            <form onSubmit={loginUser}>
              <label>
                Mobile Number:
                <input
                  type="text"
                  value={mobileNumber}
                  name='mobile'
                  maxLength={10}

                  onChange={(e) => setMobileNumber(e.target.value)}
                  onBlur={validateMobileNumber}
                  className={!isMobileNumberValid ? 'invalid' : ''}
                />
                {!isMobileNumberValid && <span className="error login-span">Mobile number is required</span>}
              </label>
              <label>
                Password:
                <input
                  type="password"
                  value={password}
                  name='password'
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={validatePassword}

                  className={!isPasswordValid ? 'invalid' : ''}
                />
                {!isPasswordValid && <span className="error login-span">Password must be at least 6 characters</span>}
              </label>
              <label className='forgotPass'>
                <Link to="/forgotpassword" className='forgotPassLink'>
                  <span className="login-span">Forget Password?</span>
                </Link>
              </label>
              <button type="submit" onClick={handleNext} className="login-button">
                Next
              </button>

              <label className="custom-label">
                <span className="login-span">
                  <Link to="/Registration" className="custom-link">
                    Don't Have an account? Sign-up
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


