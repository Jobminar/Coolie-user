import React, { createContext, useState, useEffect, useContext } from "react";
import { auth } from "../config/firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import useUserLocation from "../hooks/useUserLocation"; // Import the custom hook
import CaptchaComponent from "../components/Security/CaptchaComponent"; // Import CaptchaComponent

// Create AuthContext
const AuthContext = createContext();

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [googleUser, setGoogleUser] = useState(null);
  const [timeoutId, setTimeoutId] = useState(null);
  const [captchaVerified, setCaptchaVerified] = useState(false); // State to track CAPTCHA verification

  // Get user location using the custom hook
  const {
    location: userLocation,
    error: locationError,
    setLocation: setUserLocation,
  } = useUserLocation();

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
        );
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

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
  }, []);

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
        console.log("OTP sent successfully:", data);
        setUser({ ...userInfo, phone: data.phone });
        sessionStorage.setItem("phone", data.phone);
      } else {
        const errorData = await response.json();
        console.error("Failed to send OTP:", errorData);
      }
    } catch (error) {
      console.error("Error during OTP sending:", error);
    }
  };

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
        console.log("line 151 Login successful:", data);
        const expirationTime = Date.now() + 60 * 60 * 1000;
        sessionStorage.setItem("jwtToken", data.token);
        sessionStorage.setItem("userId", data.user._id);
        sessionStorage.setItem("expirationTime", expirationTime);
        sessionStorage.setItem("phone", data.user.phone); // Store phone number
        setSessionTimeout(60 * 60 * 1000);
        setUser(data.user);
        setIsAuthenticated(true);

        console.log("User location:", userLocation);

        return true;
      } else {
        const errorData = await response.json();
        console.error(
          "Login failed",
          response.status,
          response.statusText,
          errorData,
        );
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
    return false;
  };

  const logout = () => {
    sessionStorage.removeItem("jwtToken");
    sessionStorage.removeItem("userId");
    sessionStorage.removeItem("expirationTime");
    sessionStorage.removeItem("phone");
    setUser(null);
    setIsAuthenticated(false);
    if (timeoutId) clearTimeout(timeoutId);
  };

  const setSessionTimeout = (expiresIn) => {
    if (timeoutId) clearTimeout(timeoutId);
    const newTimeoutId = setTimeout(() => {
      if (!captchaVerified) {
        showCaptcha(); // Show CAPTCHA 20 seconds before session expiration
      } else {
        logout();
      }
    }, expiresIn - 20000);
    setTimeoutId(newTimeoutId);
  };

  const showCaptcha = () => {
    confirmAlert({
      title: "Verify You're Human",
      message: (
        <CaptchaComponent
          onVerify={(isVerified) => {
            setCaptchaVerified(isVerified);
            if (isVerified) {
              // Extend the session if CAPTCHA is verified
              const newExpirationTime = Date.now() + 60 * 60 * 1000;
              sessionStorage.setItem("expirationTime", newExpirationTime);
              setSessionTimeout(60 * 60 * 1000);
            }
          }}
        />
      ),
      buttons: [
        {
          label: "Close",
          onClick: () => logout(),
        },
      ],
      closeOnClickOutside: false,
    });
  };

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
      console.error("Google Sign-In error:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userLocation,
        setUserLocation, // Include setUserLocation in context
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
      {locationError && <p>{locationError}</p>}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
