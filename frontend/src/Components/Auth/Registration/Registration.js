import React, { useState } from "react";
import './Registration.css';
import { Link, useNavigate } from "react-router-dom";
import axios from "axios"; // Make sure to install axios if you haven't already
import Notification from '../../Notification/Notification'
const Registration = ({ onNext }) => {
  const navigate = useNavigate();

  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationColor, setNotificationColor] = useState("");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [isFirstNameValid, setIsFirstNameValid] = useState(true);
  const [isLastNameValid, setIsLastNameValid] = useState(true);

  const [isFirstNameEmpty, setIsFirstNameEmpty] = useState(false);
  const [isLastNameEmpty, setIsLastNameEmpty] = useState(false);

  const [isMobileNumberValid, setIsMobileNumberValid] = useState(true);
  const [isMobileNumberEmpty, setIsMobileNumberEmpty] = useState(false);

  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isEmailEmpty, setIsEmailEmpty] = useState(true);

  const [isPasswordValid, setIsPasswordValid] = useState(true);
  const [isDobValid, setIsDobValid] = useState(true);
  const [isGenderValid, setIsGenderValid] = useState(true);

  const [otp, setOtp] = useState(""); // OTP input state
  const [showOtpInput, setShowOtpInput] = useState(false); // State to control OTP input visibility
  const [serverOtp, setServerOtp] = useState(""); // OTP received from the server

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "firstName") setFirstName(value);
    else if (name === "lastName") setLastName(value);
    else if (name === "mobileNumber") setMobileNumber(value);
    else if (name === "email") setEmail(value);
    else if (name === "password") setPassword(value);
    else if (name === "dob") setDob(value);
    else if (name === "gender") setGender(value);
  };

  const handleOtpChange = (index, value) => {
    if (value.length <= 4) { // Ensure OTP length doesn't exceed 4 digits
      setOtp(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
   
    const isFirstNameValid = validateFirstName();
    const isLastNameValid = validateLastName();
    const isMobileValid = validateMobileNumber();
    const isEmailValid = validateEmail();
    const isPasswordValid = validatePassword();
    const isDobValid = validateDob();
    const isGenderValid = validateGender();
   
    // Check if all validations pass
    if (
       isFirstNameValid &&
       isLastNameValid &&
       isMobileValid &&
       isEmailValid &&
       isPasswordValid &&
       isDobValid &&
       isGenderValid
    ) {
       // Construct the request body
       const requestBody = {
         first_name: firstName,
         last_name: lastName,
         mobile_no: mobileNumber,
         password: password,
         email: email,
         dob: dob,
         Gender: gender,
         Role: {
           Role_Name: "Customer",
         },
         Status: {
           Status_Name: "Offline",
         },
       };
       console.log("Sending OTP request with body:", requestBody);
       // Send OTP to the user's mobile number
       try {
         const response = await axios.post(
           "http://127.0.0.1:8000/api/send-otp/",
           { mobile_no: mobileNumber }
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
    } else {
       setNotificationMessage("Please correct the errors in the form.");
       setNotificationColor("red");
       setShowNotification(true);
       // Optionally, hide the notification after a delay
       setTimeout(() => {
         setShowNotification(false);
       }, 3000);
    }
   };
   
  const handleOtpSubmit = async () => {
    const otpValue = otp;
    if (otpValue === serverOtp) {
      // OTP verified, proceed with registration
      await registerUser();
    } else {
      alert("Invalid OTP. Please try again.");
      navigate("/")
    }
  };

  const registerUser = async () => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/register/",
        {
          first_name: firstName,
          last_name: lastName,
          mobile_no: mobileNumber,
          password: password,
          email: email,
          dob: dob,
          Gender: gender,
          Role: {
            Role_Name: "Customer",
          },
          Status: {
            Status_Name: "Online",
          },
        }
      );
      if (response.status === 200) {
        // Registration successful
        
        // navigate("/address")
        // const userId = response.data.user_id
        // navigate(`/address/${userId}/`)
        // navigate("/address", { state: { user_Id: response.data.user_id } });
        // alert("User ID ADRESS",userId)
        // alert("user",response.user_id)
        // navigate("/address", { state: { user_Id: response.data.user_id } });

        console.log("User ID:", response.data.user_id); // Log the user ID
        navigate("/address", { state: { user_Id: response.data.user_id } });

        // navigate("/login")
      } else {
        // Registration failed
        setNotificationMessage("Registration failed. Please try again.");
        setNotificationColor("red");
        setShowNotification(true);
        // Optionally, hide the notification after a delay
        setTimeout(() => {
          setShowNotification(false);
        }, 3000);
      }
   } catch (error) {
      // Handle error
      setNotificationMessage("An error occurred during registration.");
      setNotificationColor("red");
      setShowNotification(true);
      // Optionally, hide the notification after a delay
      setTimeout(() => {
        setShowNotification(false);
      }, 3000);
    }
    
  };

  const validateFirstName = () => {
    const isEmpty = firstName === "";
    setIsFirstNameEmpty(isEmpty);

    const isValidFormat = /^[a-zA-Z]+$/.test(firstName);
    setIsFirstNameValid(isValidFormat);

    return !isEmpty && isValidFormat;
  };

  const validateLastName = () => {
    const isEmpty = lastName === "";
    setIsLastNameEmpty(isEmpty);

    const isValidFormat = /^[a-zA-Z]+$/.test(lastName);
    setIsLastNameValid(isValidFormat);

    return !isEmpty && isValidFormat;
  };

  const validateMobileNumber = () => {
    const isEmpty = mobileNumber === "";
    setIsMobileNumberEmpty(isEmpty);

    const isValidFormat = /^\d{10}$/.test(mobileNumber);
    setIsMobileNumberValid(isValidFormat);

    return !isEmpty && isValidFormat;
  };

  const validateEmail = () => {
    const isEmptymail = email === "";  
  setIsEmailEmpty(isEmptymail);
  const isValidmail = /\S+@\S+\.\S+/.test(email);
  
  setIsEmailValid(isValidmail);

  return !isEmptymail && isValidmail;
   };

  const validatePassword = () => {
    const isValid = password !== "" && password.length >= 6;
    setIsPasswordValid(isValid);
    return isValid;
  };

  const validateDob = () => {
    const isValid = dob !== "";
    setIsDobValid(isValid);
    return isValid;
  };

  const validateGender = () => {
    const isValid = gender !== "";
    setIsGenderValid(isValid);
    return isValid;
  };

  const handleNext = () => {
    const isFirstNameValid = validateFirstName();
    const isLastNameValid = validateLastName();
    const isMobileValid = validateMobileNumber();
    const isEmailValid = validateEmail();
    const isPasswordValid = validatePassword();
    const isDobValid = validateDob();
    const isGenderValid = validateGender();

    if (
      isFirstNameValid &&
      isLastNameValid &&
      isMobileValid &&
      isEmailValid &&
      isPasswordValid &&
      isDobValid &&
      isGenderValid
    ) {
      console.log({
        firstName,
        lastName,
        mobileNumber,
        email,
        password,
        dob,
        gender,
        profilePicture,
      }
    
    );
    onNext && onNext();
    navigate("/otp");

    // Use navigate to go to the "/otp" route
  } else {

      // Call the parent component's onNext function to navigate to the next page
      console.log("Form has errors. Please check your inputs.");
    }
  };

  return (
    <>
     {/* {showNotification && (
      <Notification message={notificationMessage} color={notificationColor} />
    )} */}
    <div className="container_registration">
    {showNotification && (
  <Notification message={notificationMessage} color={notificationColor} />
)}
    
    <div className="registration-container">
      <h2>Registration</h2>

      {!showOtpInput ? (
        <form onSubmit={handleSubmit}>
          <label>
            First Name:
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              onBlur={validateFirstName}
              className={!isFirstNameValid ? "invalid" : ""}
              />
            {!isFirstNameValid && !isFirstNameEmpty && (
              <span className="error">Invalid first name</span>
            )}
            {!isFirstNameValid && isFirstNameEmpty && (
              <span className="error">First name cannot be empty</span>
            )}
          </label>
          <label>
            Last Name:
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              onBlur={validateLastName}
              className={!isLastNameValid ? "invalid" : ""}
            />
            {!isLastNameValid && !isLastNameEmpty && (
              <span className="error">Invalid last name</span>
            )}
            {!isLastNameValid && isLastNameEmpty && (
              <span className="error">Last name cannot be empty</span>
            )}
          </label>
          {/* Mobile Number */}
          <label>
            Mobile Number:
            <input
              type="text"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              onBlur={validateMobileNumber}
              className={!isMobileNumberValid ? "invalid" : ""}
              />
            {!isMobileNumberValid && !isMobileNumberEmpty && (
              <span className="error">Invalid mobile number</span>
            )}
            {!isMobileNumberValid && isMobileNumberEmpty && (
              <span className="error">Mobile number cannot be empty</span>
            )}
          </label>
          {/* Email */}
          <label>
            Email:
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={validateEmail}
              className={!isEmailValid ? "invalid" : ""}
            />
            {!isEmailValid && !isEmailEmpty && (
              <span className="error">Email cannot be emptyInvalid email</span>
            )}
            {!isEmailValid && isEmailEmpty && (
              <span className="error">Email cannot be empty</span>
            )}
            
          </label>
          {/* Password */}
          <label>
            Password:
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={validatePassword}
              className={!isPasswordValid ? "invalid" : ""}
            />
            {!isPasswordValid && (
              <span className="error">
                Password must be at least 6 characters
              </span>
            )}
          </label>
          {/* Date of Birth */}
          <label>
            Date of Birth:
            <input
              type="date"
              min="1900-01-01"
              max={new Date().toISOString().split("T")[0]}
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className={!isDobValid ? "invalid" : ""}
            />
            {!isDobValid && (
              <span className="error">Date of Birth is required</span>
            )}
          </label>
          {/* Gender */}
          <label>
            Gender:
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className={!isGenderValid ? "invalid" : ""}
            >
              <option value="" disabled>
                Select Gender
              </option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
            {!isGenderValid && (
              <span className="error">Gender is required</span>
            )}
          </label>
          

          <button type="submit">Next</button>
          <label className="account">
            <span>
              <Link to="/login" className="custom-link">
                Have an account? Login
              </Link>
            </span>
          </label>
        </form>
      ) : (
        <div className="OTPcontainerFP">
        <div className="OTPitems">
        <label><strong>OTP</strong></label>
        <input
  className="OTPItem"
  type="text"
  maxLength="4"
  value={otp} // Join the OTP array into a single string
  onChange={(e) => setOtp(e.target.value)} // Pass the entire input value
/>
</div>
      <button className="OTPbtn" onClick={handleOtpSubmit}>
      Submit OTP
    </button>

      </div>
      )}
      
    </div>
      </div>
    </>

  );
};

export default Registration;