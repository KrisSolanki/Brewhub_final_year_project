// import { createContext, useEffect, useState } from "react";
// import axios from "axios";
// import { jwtDecode } from "jwt-decode";
// import { useNavigate } from "react-router-dom";

// const AuthContext = createContext();

// export default AuthContext;

// export const AuthProvider = ({ children }) => {
//  const navigate = useNavigate();
//  let [loading, setLoading] = useState(true);

//  let [authTokens, setAuthTokens] = useState(() =>
//     localStorage.getItem("authTokens")
//       ? JSON.parse(localStorage.getItem("authTokens"))
//       : null
//  );

//  let [user, setUser] = useState(() =>
//     localStorage.getItem("authTokens")
//       ? jwtDecode(localStorage.getItem("authTokens"))
//       : null
//  );

//  let loginUser = async (e) => {
//     e.preventDefault();

//     try {
//       let response = await axios.post("http://127.0.0.1:8000/api/token/", {
//         email: e.target.email.value,
//         password: e.target.password.value,
//       });

//       if (response.status === 200) {
//         const data = response.data;
//         setAuthTokens(data);
//         setUser(jwtDecode(data.access));
//         localStorage.setItem("authTokens", JSON.stringify(data));
//         // navigate("/"); // Uncomment this if you want to navigate after login
//       } else {
//         alert("Something went wrong!");
//       }
//     } catch (error) {
//       console.error("Error during login:", error.message);
//       alert("An error occurred during login.");
//     }
//  };

//  let logoutUser = () => {
//     setAuthTokens(null);
//     setUser(null);
//     localStorage.removeItem("authTokens");
//     // navigate("/login"); // Uncomment this if you want to navigate after logout
//  };

//  let updateToken = async () => {
//     try {
//       let response = await axios.post(
//         "http://127.0.0.1:8000/api/token/refresh/",
//         {
//           refresh: authTokens?.refresh,
//         }
//       );

//       if (response.status === 200) {
//         const data = response.data;
//         setAuthTokens(data);
//         setUser(jwtDecode(data.access));
//         localStorage.setItem("authTokens", JSON.stringify(data));
//       } else {
//         logoutUser();
//       }

//       if (loading) {
//         setLoading(false);
//       }
//     } catch (error) {
//       console.error("Error during token refresh:", error.message);
//       logoutUser();
//     }
//  };

//  useEffect(() => {
//     if (loading) {
//       updateToken();
//     }

//     let fourMinutes = 1000 * 60 * 4;

//     let interval = setInterval(() => {
//       if (authTokens) {
//         updateToken();
//       }
//     }, fourMinutes);

//     return () => clearInterval(interval);
//  }, [authTokens, loading]);

//  // Removed the useEffect hook that navigates to /login based on user or loading state

//  let contextData = {
//     user: user,
//     authTokens: authTokens,
//     loginUser: loginUser,
//     logoutUser: logoutUser,
//  };

//  return (
//     <AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>
//  );
// };


import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode"; // Correct for v3.x.x and above

// import jwtDecode from "jwt-decode"; // Fix import
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const [authTokens, setAuthTokens] = useState(() =>
    localStorage.getItem("authTokens")
      ? JSON.parse(localStorage.getItem("authTokens"))
      : null
  );

  const [user, setUser] = useState(() =>
    authTokens ? jwtDecode(authTokens.access) : null
  );

  const loginUser = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/token/", {
        email: e.target.email.value,
        password: e.target.password.value,
      });

      if (response.status === 200) {
        const data = response.data;
        console.log("Access Token (Login):", data.access);
        console.log("Refresh Token (Login):", data.refresh);
        setAuthTokens(data);
        setUser(jwtDecode(data.access));
        localStorage.setItem("authTokens", JSON.stringify(data));
        // navigate("/"); // Uncomment to navigate after login
      } else {
        alert("Invalid login credentials!");
      }
    } catch (error) {
      console.error("Error during login:", error.message);
      alert("An error occurred during login.");
    }
  };
  // let loginUser = async (email,password) => {
  //   try {
  //     const response = await axios.post("http://127.0.0.1:8000/api/token/", {
  //       email: email,  // You can use the email you passed to this function
  //       password: password, // You can collect the password or handle it accordingly
  //     });
  
  //     if (response.status === 200) {
  //       const data = response.data;
  //       console.log("Access Token (Login):", data.access);
  //       setAuthTokens(data);
  //       setUser(jwtDecode(data.access));
  //       localStorage.setItem("authTokens", JSON.stringify(data));
  //     } else {
  //       alert("Invalid login credentials!");
  //     }
  //   } catch (error) {
  //     console.error("Error during login:", error.message);
  //     alert("An error occurred during login.");
  //   }
  // };
  const logoutUser = () => {
    setAuthTokens(null);
    setUser(null);
    localStorage.removeItem("authTokens");
    navigate("/login"); // Uncomment to navigate after logout
  };

  const updateToken = async () => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/token/refresh/",
        { refresh: authTokens?.refresh }
      );

      if (response.status === 200) {
        const data = response.data;
        console.log("TOKENS UPDATE:",data)
        setAuthTokens(data);
        setUser(jwtDecode(data.access));
        localStorage.setItem("authTokens", JSON.stringify(data));
      } else {
        logoutUser();
      }
    } catch (error) {
      console.error("Error during token refresh:", error.message);
      logoutUser();
    } finally {
      if (loading) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (loading) {
      updateToken();
    }

    const interval = setInterval(() => {
      if (authTokens) {
        updateToken();
      }
    }, 1000 * 60 * 4); // Adjust interval as needed

    return () => clearInterval(interval);
  }, [authTokens, loading]);

  const contextData = {
    user,
    authTokens,
    loginUser,
    logoutUser,
  };

  return (
    <AuthContext.Provider value={contextData}>
      {loading ? <div>Loading...</div> : children}
    </AuthContext.Provider>
  );
};
