// src/contexts/AuthContext.js

import React, { createContext, useContext, useState, useEffect } from "react";
import { auth } from "../config/firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import useUserLocation from "../hooks/useUserLocation"; // Import the custom hook

// Create AuthContext
const AuthContext = createContext();

// AuthProvider component
export const AuthProvider = ({ children }) => {
  // State variables to manage user information and authentication status
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [googleUser, setGoogleUser] = useState(null);
  const [timeoutId, setTimeoutId] = useState(null);

  // Get user location using the custom hook
  const userLocation = useUserLocation();

  // Fetch user info based on userId
  const fetchUserInfo = async (userId) => {
    try {
      const response = await fetch(
        `https://api.coolieno1.in/v1.0/users/userAuth/${userId}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (response.ok) {
        const data = await response.json();
        return data.user;
      } else {
        const errorData = await response.json();
        console.error(
          "Error fetching user info:",
          response.status,
          response.statusText,
          errorData,
        ); // Log error details
      }
    } catch (error) {
      console.error("Error fetching user info:", error); // Log error
    }
  };

  // Effect to handle user authentication status and session timeout
  useEffect(() => {
    const storedJwtToken = sessionStorage.getItem("jwtToken");
    const storedUserId = sessionStorage.getItem("userId");
    const storedExpirationTime = sessionStorage.getItem("expirationTime");

    if (storedJwtToken && storedUserId && storedExpirationTime) {
      const currentTime = Date.now();

      if (currentTime < storedExpirationTime) {
        fetchUserInfo(storedUserId).then((userInfo) => {
          setUser(userInfo);
          setIsAuthenticated(true);
          setSessionTimeout(storedExpirationTime - currentTime);
        });
      } else {
        logout();
      }
    }

    const resetTimeout = () => {
      if (timeoutId) clearTimeout(timeoutId);
      const newTimeoutId = setTimeout(() => {
        logout();
      }, 30 * 60 * 1000); // 30 minutes of inactivity
      setTimeoutId(newTimeoutId);
    };

    const events = ["click", "mousemove", "keypress", "scroll"];

    events.forEach((event) => {
      window.addEventListener(event, resetTimeout);
    });

    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, resetTimeout);
      });
    };
  }, [timeoutId]);

  // Send OTP to the user
  const sendOtp = async (userInfo) => {
    try {
      const response = await fetch(
        "https://api.coolieno1.in/v1.0/users/userAuth/send-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userInfo),
        },
      );

      if (response.ok) {
        const data = await response.json();
        console.log("OTP sent successfully:", data); // Log OTP sent status
        setUser({ ...userInfo, phone: data.phone });
        sessionStorage.setItem("phone", data.phone);
      } else {
        const errorData = await response.json();
        console.error("Failed to send OTP:", errorData); // Log OTP send failure
      }
    } catch (error) {
      console.error("Error during OTP sending:", error); // Log error
    }
  };

  // Login function to authenticate user
  const login = async ({
    phone,
    otp,
    email,
    name,
    displayName,
    photoURL,
    providerId,
  }) => {
    const userInfo = googleUser || {};
    const loginData = {
      phone,
      otp: isNaN(otp) ? otp : Number(otp),
      email: email || userInfo.email,
      name: name || userInfo.name,
      displayName: displayName || userInfo.displayName,
      photoURL: photoURL || userInfo.photoURL,
      providerId: providerId || userInfo.providerId,
    };

    try {
      const response = await fetch(
        "https://api.coolieno1.in/v1.0/users/userAuth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(loginData),
        },
      );

      if (response.ok) {
        const data = await response.json();
        console.log("the backend data after login", data);
        console.log("line 151 Login successful:", data); // Log successful login
        const expirationTime = Date.now() + 60 * 60 * 1000; // Assuming token expires in 1 hour
        sessionStorage.setItem("jwtToken", data.token);
        sessionStorage.setItem("userId", data.user._id);
        sessionStorage.setItem("expirationTime", expirationTime);
        setSessionTimeout(60 * 60 * 1000); // 1 hour
        setUser(data.user);
        setIsAuthenticated(true);

        // Log user location after successful login
        console.log("User location:", userLocation);

        return true;
      } else {
        const errorData = await response.json();
        console.error(
          "Login failed",
          response.status,
          response.statusText,
          errorData,
        ); // Log login failure
      }
    } catch (error) {
      console.error("Error during login:", error); // Log error
    }
    return false;
  };

  // Logout function to clear user session
  const logout = () => {
    sessionStorage.removeItem("jwtToken");
    sessionStorage.removeItem("userId");
    sessionStorage.removeItem("expirationTime");
    setUser(null);
    setIsAuthenticated(false);
    if (timeoutId) clearTimeout(timeoutId);
  };

  // Set session timeout for user
  const setSessionTimeout = (expiresIn) => {
    if (timeoutId) clearTimeout(timeoutId);
    const newTimeoutId = setTimeout(() => {
      logout();
    }, expiresIn);
    setTimeoutId(newTimeoutId);
  };

  // Google login using Firebase
  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userInfo = {
        email: user.email,
        name: user.displayName,
        displayName: user.displayName,
        photoURL: user.photoURL,
        providerId: user.providerData[0].providerId,
      };

      setGoogleUser(userInfo);
    } catch (error) {
      console.error("Google Sign-In error:", error); // Log Google Sign-In error
    }
  };

  // Provide context values to children components
  return (
    <AuthContext.Provider
      value={{
        user,
        userLocation, // Provide userLocation here
        login,
        isAuthenticated,
        sendOtp,
        loginWithGoogle,
        googleUser,
        logout,
        fetchUserInfo,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use AuthContext
export const useAuth = () => useContext(AuthContext);
