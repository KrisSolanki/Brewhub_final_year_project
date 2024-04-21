import React, { useState, useContext } from "react";
import axios from "axios";
import "./ForgetPassword.css";
import AuthContext from "../../../Context/AuthContext"; // Adjust the import path as necessary
import { useNavigate } from "react-router-dom"; // Import useNavigate

const ForgotPassword = () => {
 const { authTokens } = useContext(AuthContext);
 const navigate = useNavigate(); // Initialize useNavigate
 const [newPassword, setNewPassword] = useState("");
 const [confirmPassword, setConfirmPassword] = useState("");
 const [otp, setOtp] = useState("");
 const [error, setError] = useState("");
 const [successMessage, setSuccessMessage] = useState("");
 const [showOtpInput, setShowOtpInput] = useState(false); // State to control OTP input visibility
 const [showInput, setShowInput] = useState(false); // State to control OTP input visibility
 const [mobileNo, setMobileNo] = useState(""); // Mobile number for OTP
 const [serverOtp, setServerOtp] = useState(""); // OTP received from the server

 const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "newPassword") setNewPassword(value);
    else if (name === "confirmPassword") setConfirmPassword(value);
    else if (name === "mobileNo") setMobileNo(value);
 };

//  const handleSubmit = async (e) => {
//     e.preventDefault();
//     console.log("Submit mob", mobileNo);
//     // Validation
//     if (!mobileNo) {
//       setError("Mobile number is required");
//       return;
//     }

const handleSubmit = async (e) => {
  e.preventDefault();

  // Validation
  if ( !mobileNo) {
    setError("All fields are required");
    return;
  }

    // Send OTP to the user's mobile number
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/send-otp/",
        { mobile_no: mobileNo }
      );
      if (response.status === 200) {
        setServerOtp(response.data.otp.toString()); // Store the received OTP
        console.log("Received OTP:", response.data.otp); // Log the received OTP
        setShowOtpInput(true);
      } else {
        alert("An error occurred while sending the OTP.");
      }
    } catch (error) {
      console.error("Error sending OTP:", error.message);
      alert("An error occurred while sending the OTP.");
    }
 };

 const handleOtpSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    if (otp === serverOtp) {
      // OTP verified, proceed with password change
      setShowOtpInput(false);
      setShowInput(true);
    } else {
      setError("Invalid OTP. Please try again.");
    }
 };

 const changePassword = async (e) => {
  e.preventDefault(); // Ensure form submission is prevented
  console.log("Mobile_no", mobileNo);
  if (!newPassword || !confirmPassword) {
     setError("New password and confirm password are required");
     return;
  }
 
  if (newPassword !== confirmPassword) {
     setError("New password and confirm password must match");
     return;
  }
 
  try {
     const response = await axios.post(
       "http://127.0.0.1:8000/api/forget_password/",
       {
         mobileno: mobileNo,
         new_password: newPassword,
         confirm_password: confirmPassword,
       }
     );
 
     if (response.status === 200 && response.data.message === "Password (forget)changed successfully") {
       setSuccessMessage("Your password has been changed successfully!");
       console.log("Password changed successfully");
       navigate("/"); // Navigate to home page on success
     } else {
       console.error("Error changing password:", response.data);
       alert("An error occurred while changing the password.");
       navigate("/forgotpassword"); // Navigate to forgot password page on failure
     }
  } catch (error) {
     console.error("Error changing password:", error.message);
     alert("An error occurred while changing the password.");
     navigate("/forgotpassword"); // Navigate to forgot password page on failure
  }
 };

 return (
    <div className="change-password-container">
      <h2>Forgot Password</h2>
      <form onSubmit={handleSubmit}>
        <label>Mobile Number:</label>
        <input
          type="text"
          name="mobileNo"
          value={mobileNo}
          onChange={handleChange}
        />
        {error && <p className="error-message">{error}</p>}
        <button className="OTPbtn" type="submit">Send OTP</button>
      </form>
      {showOtpInput && (
        <form onSubmit={handleOtpSubmit}>
          <label>OTP:</label>
          <input
            type="text"
            maxLength="4"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="otpInput"
          />
          {error && <p className="error-message">{error}</p>}
          <button className="FPbtn" type="submit">Submit</button>
        </form>
      )}
      {showInput && (
        <form onSubmit={changePassword}>
          <label>New Password:</label>
          <input
            type="password"
            name="newPassword"
            value={newPassword}
            onChange={handleChange}
            className="FPI"
          />
          <label>Confirm Password:</label>
          <input
            type="password"
            name="confirmPassword"
            value={confirmPassword}
            onChange={handleChange}
            className="FPI"
          />
          {error && <p className="error-message">{error}</p>}
          <button className="FPbtn" type="submit">Submit</button>
        </form>
      )}
      {successMessage && (
        <p className="success-message">{successMessage}</p>
      )}
    </div>
 );
};

export default ForgotPassword;
