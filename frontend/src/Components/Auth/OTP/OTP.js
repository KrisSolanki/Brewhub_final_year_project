// import React, { useContext, useState } from "react";
// import "./OTP.css";
// import { useLocation, useNavigate } from "react-router-dom";
// import axios from "axios";
// import AuthContext from "../../../Context/AuthContext";

// const OTP = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { loginUser } = useContext(AuthContext);
//   const email = location.state?.email; // Access the email from the state
//   const { logoutUser } = useContext(AuthContext);
//   const [otp, setOtp] = useState("");

//   const handleVerify = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post("http://127.0.0.1:8000/api/verify_otp/", {
//         otp,
//         email,
//       });

//       const data = response.data;
//       console.log("OTP Response:", response.data);
//       console.log("Verification Response:", data);

//       if (data.status === 200) {
//         alert("OTP verified successfully");
//         // loginUser();
//         navigate("/"); // Navigate to the next page after successful OTP verification
//       } else {
//         alert("OTP verification failed. Logging out...");
//         logoutUser();
//       }
//     } catch (error) {
//       console.error("Error verifying OTP:", error.message);
//       alert("An error occurred while verifying OTP. Logging out...");
//       logoutUser();
//     }
//   };

//   return (
//     <div className="main_containerOTP">
//       <div className="container_otp">
//         <div className="OTP">
//           <h2 className="OTPtext">OTP Verification</h2>
//           <form onSubmit={loginUser}>
//             <div className="otpDigit">
//               <input
//                 type="text"
//                 maxLength="4"
//                 value={otp}
//                 onChange={(e) => setOtp(e.target.value)}
//                 className="otpInput"
//               />
//             </div>
//             <button type="submit" className="buttonverify" onClick={handleVerify}>
//               Verify
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default OTP;


// import React, { useContext, useState } from "react";
// import "./OTP.css";
// import { useLocation, useNavigate } from "react-router-dom";
// import axios from "axios";
// import AuthContext from "../../../Context/AuthContext";

// const OTP = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { loginUser } = useContext(AuthContext);
//   const { logoutUser } = useContext(AuthContext);
//   const email = location.state?.email; // Access the email from the state
//   const [otp, setOtp] = useState("");

//   const handleVerify = async (e) => {
//     e.preventDefault(); // Prevent default form submission behavior

//     if (!otp) {
//       alert("Please enter the OTP.");
//       return;
//     }

//     try {
//       const response = await axios.post("http://127.0.0.1:8000/api/verify_otp/", {
//         otp,
//         email,
//       });

//       const data = response.data;
//       console.log("OTP Response:", data);

//       if (data.status === 200) {
//         // OTP verified successfully
//         // loginUser(email,password); // This could include setting a token or any other logic for logging in
//         alert("OTP verified successfully");

//         // Call loginUser to log the user in

//         // After login, navigate to the home or main page
//         navigate("/"); // Navigate to the main page after successful OTP verification and login
//       } else {
//         alert("OTP verification failed. Logging out...");
//         logoutUser(); // Log the user out if OTP verification fails
//       }
//     } catch (error) {
//       console.error("Error verifying OTP:", error.message);
//       alert("An error occurred while verifying OTP. Logging out...");
//       logoutUser(); // Log the user out in case of an error
//     }
//   };

//   return (
//     <div className="main_containerOTP">
//       <div className="container_otp">
//         <div className="OTP">
//           <h2 className="OTPtext">OTP Verification</h2>
//           <form onSubmit={handleVerify}> {/* Directly handle submit here */}
//             <div className="otpDigit">
//               <input
//                 type="text"
//                 maxLength="4"
//                 value={otp}
//                 onChange={(e) => setOtp(e.target.value)}
//                 className="otpInput"
//               />
//             </div>
//             <button type="submit" className="buttonverify">
//               Verify
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default OTP;


import React, { useState } from "react";
import "./OTP.css";
import { useNavigate } from "react-router-dom";

const OTP = () => {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const navigate = useNavigate();

  const handleInputChange = (e, index) => {
    const value = e.target.value;
    if (!/^\d*$/.test(value)) return; // Allow only digits

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // Limit input to one digit
    setOtp(newOtp);

    // Move to the next input field if not the last box and value is entered
    if (value && index < 3) {
      document.getElementById(`otp-input-${index + 1}`).focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      // Move to the previous input field on Backspace if empty
      document.getElementById(`otp-input-${index - 1}`).focus();
    }
  };

  const handleVerify = (e) => {
    e.preventDefault();
    const otpValue = otp.join(""); // Combine the OTP digits into a single string
    if (otpValue.length === 4) {
      alert(`OTP Verified Successfully: ${otpValue}`);
      navigate("/"); // Redirect after successful OTP verification
    } else {
      alert("Please enter a valid 4-digit OTP.");
    }
  };

  return (
    <div className="otp-page">
      <div className="otp-container">
        <h1 className="otp-title">Verify Your Account</h1>
        <p className="otp-subtitle">
          Enter the 4-digit code we sent to your email.
        </p>
        <form className="otp-form" onSubmit={handleVerify}>
          <div className="otp-input-container">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-input-${index}`}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleInputChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="otp-box"
              />
            ))}
          </div>
          <button type="submit" className="otp-button">
            Verify
          </button>
        </form>
        <p className="otp-footer">
          Didn’t receive the code? <span className="otp-resend">Resend Code</span>
        </p>
      </div>
    </div>
  );
};

export default OTP;
