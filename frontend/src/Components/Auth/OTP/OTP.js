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


import React, { useContext, useState } from "react";
import "./OTP.css";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import AuthContext from "../../../Context/AuthContext";

const OTP = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginUser } = useContext(AuthContext);
  const { logoutUser } = useContext(AuthContext);
  const email = location.state?.email; // Access the email from the state
  const [otp, setOtp] = useState("");

  const handleVerify = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    if (!otp) {
      alert("Please enter the OTP.");
      return;
    }

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/verify_otp/", {
        otp,
        email,
      });

      const data = response.data;
      console.log("OTP Response:", data);

      if (data.status === 200) {
        // OTP verified successfully
        // loginUser(email,password); // This could include setting a token or any other logic for logging in
        alert("OTP verified successfully");

        // Call loginUser to log the user in

        // After login, navigate to the home or main page
        navigate("/"); // Navigate to the main page after successful OTP verification and login
      } else {
        alert("OTP verification failed. Logging out...");
        logoutUser(); // Log the user out if OTP verification fails
      }
    } catch (error) {
      console.error("Error verifying OTP:", error.message);
      alert("An error occurred while verifying OTP. Logging out...");
      logoutUser(); // Log the user out in case of an error
    }
  };

  return (
    <div className="main_containerOTP">
      <div className="container_otp">
        <div className="OTP">
          <h2 className="OTPtext">OTP Verification</h2>
          <form onSubmit={handleVerify}> {/* Directly handle submit here */}
            <div className="otpDigit">
              <input
                type="text"
                maxLength="4"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="otpInput"
              />
            </div>
            <button type="submit" className="buttonverify">
              Verify
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OTP;
