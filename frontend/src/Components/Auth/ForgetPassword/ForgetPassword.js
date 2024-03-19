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
  const [otp, setOtp] = useState(["", "", "", ""]); // OTP input state
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false); // State to control OTP input visibility
  const [mobileNo, setMobileNo] = useState(""); // Mobile number for OTP
  const [serverOtp, setServerOtp] = useState(""); // OTP received from the server

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "newPassword") setNewPassword(value);
    else if (name === "confirmPassword") setConfirmPassword(value);
    else if (name === "mobileNo") setMobileNo(value);
  };

  const handleOtpChange = (index, value) => {
    otp[index] = value;
    setOtp([...otp]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!newPassword || !confirmPassword || !mobileNo) {
      setError("All fields are required");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New password and confirm password must match");
      return;
    }

    // Send OTP to the user's mobile number
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/send-otp/",
        { mobile_no: mobileNo 
        
        }
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

  const handleOtpSubmit = async () => {
    const otpValue = otp.join("");
    if (otpValue === serverOtp) {
      // OTP verified, proceed with password change
      await changePassword();
    } else {
      alert("Invalid OTP. Please try again.");
    }
  };

  const changePassword = async () => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/forget_password/",
        {
          mobileno: mobileNo, // Adjusted property name
          new_password: newPassword, // Adjusted property name
          confirm_password: confirmPassword, // Adjusted property name
        },
        {
          headers: {
            Authorization: `Bearer ${authTokens?.access}`,
          },
        }
      );

      if (response.status === 200) {
        setSuccessMessage("Your password has been changed successfully!");
        console.log("Password changed successfully");
        navigate("/home"); // Navigate to home page on success
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
      {!showOtpInput ? (
        <form onSubmit={handleSubmit}>
          <label>Mobile Number:</label>
          <input
            type="text"
            name="mobileNo"
            value={mobileNo}
            onChange={handleChange}
          />

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
          {successMessage && (
            <p className="success-message">{successMessage}</p>
          )}

          <button className="FPbtn" type="submit">Submit</button>
        </form>
      ) : (
        <div className="OTPcontainer">
          <input
            className="OTPItem"
            type="text"
            maxLength="1"
            value={otp[0]}
            onChange={(e) => handleOtpChange(0, e.target.value)}
          />
          <input
            className="OTPItem"
            type="text"
            maxLength="1"
            value={otp[1]}
            onChange={(e) => handleOtpChange(1, e.target.value)}
          />
          <input
            className="OTPItem"
            type="text"
            maxLength="1"
            value={otp[2]}
            onChange={(e) => handleOtpChange(2, e.target.value)}
          />
          <input
            className="OTPItem"
            type="text"
            maxLength="1"
            value={otp[3]}
            onChange={(e) => handleOtpChange(3, e.target.value)}
          />
      <button className="OTPbtn" onClick={handleOtpSubmit}>
        Submit OTP
      </button>
        </div>
      )}
    </div>
  );
};

export default ForgotPassword;