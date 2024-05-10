import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import axios from "axios";
import "./auth.css";

const Auth = (props) => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    fullName: "",
    phoneNumber: "",
    email: "",
    isAdmin: false,
  });

  // const [isLoggedIn, setIsLoggedIn] = useState(props.isLoggedIn);
  // const [emailUser, setEmailUser] = useState("");
  // const [usernameUser, setUsernameUser] = useState("");
  // const [admin, setAdmin] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [signUpState, setSignUpState] = useState(false);

  const { state } = useLocation();

  const { username, password, fullName, phoneNumber, email } = formData;

  const navigate = useNavigate();

  // Reset form after submit
  const formReset = () => {
    setFormData({
      username: "",
      password: "",
      fullName: "",
      phoneNumber: "",
      email: "",
      isAdmin: false,
    });
  };

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Check input errors
  const errorInputCheck = () => {
    // Set initial error values to empty
    setEmailError("");
    setPasswordError("");

    // Check if the user has entered both fields correctly
    if ("" === formData.email) {
      setEmailError("Please enter your email");
      return true;
    } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      setEmailError("Please enter a valid email");
      return true;
    } else if ("" === formData.password) {
      setPasswordError("Please enter a password");
      return true;
    } else if (formData.password.length < 7) {
      setPasswordError("The password must be 8 characters or longer");
      return true;
    } else return false;
  };

  // Register Handler
  const handleSignup = async () => {
    try {
      if (!errorInputCheck()) {
        await axios.post("http://localhost:5000/signup", formData);
        alert("Signup successful");
        setSignUpState(false);
        formReset();
      }
    } catch (error) {
      if (error.response.data === "Username already exists") {
        setUsernameError(error.response.data);
      } else if (error.response.data === "Email already exists") {
        setEmailError(error.response.data);
      } else alert("Have an error");
    }
  };

  // Login Handler
  const handleLogin = async () => {
    try {
      if (!errorInputCheck()) {
        const response = await axios.post("http://localhost:5000/login", {
          email,
          password,
        });

        localStorage.setItem("token", response.data.token);

        formReset();
        props.setIsLoggedIn(true);
        navigate("/");
      }
    } catch (error) {
      if (error.response.data === "User not found") {
        setEmailError(error.response.data);
      } else if (error.response.data === "Invalid credentials") {
        setPasswordError(error.response.data);
      } else alert("Have an error");
    }
  };

  // Logout Handler
  const handleLogout = () => {
    localStorage.removeItem("token");
    props.setIsLoggedIn(false);
    alert("Logout successful");
    navigate("/");
  };

  // Press "Enter"
  const handleKeyDown = (e) => {
    //it triggers by pressing the enter key
    if (e.keyCode === 13) {
      handleLogin();
    }
  };

  // Read user information from JWT Token
  // useEffect(() => {
  //   if (localStorage.getItem("token")) {
  //     setIsLoggedIn(true);
  //     const token = localStorage.getItem("token");
  //     setUsernameUser(jwtDecode(token).username);
  //     setEmailUser(jwtDecode(token).email);
  //     setAdmin(jwtDecode(token).isAdmin);
  //   }
  // }, [isLoggedIn]);

  // Processing when press "login" && "register" at home page
  useEffect(() => {
    if (state === "register") {
      setSignUpState(true);
    } else if (state === "login") {
      setSignUpState(false);
    }
  }, [state]);

  return (
    <div>
      {props.isLoggedIn && (
        <div className={"mainContainer"}>
          <div className={"titleContainer"}>
            <div>
              You are login as {props.username} ({props.email})
            </div>
          </div>
          <br />

          <div className={"buttonContainer"}>
            {props.isAdmin ? (
              <button className={"inputButton"}>Go to Admin</button>
            ) : (
              <button onClick={() => navigate("/")} className={"inputButton"}>
                Go Home
              </button>
            )}
            <button onClick={handleLogout} className={"inputButton"}>
              Logout
            </button>
          </div>
        </div>
      )}

      {/* Login */}
      {!signUpState && (
        <div className={"mainContainer"}>
          <div className={"titleContainer"}>
            <div>Login</div>
          </div>
          <br />
          <div className={"inputContainer"}>
            <input
              type="text"
              name="email"
              value={email}
              placeholder="Email"
              onChange={onChange}
              onKeyDown={handleKeyDown}
              className={"inputBox"}
              required
            />
            <label className="errorLabel">{emailError}</label>
          </div>

          <div className={"inputContainer"}>
            <input
              type="password"
              name="password"
              value={password}
              placeholder="Password"
              onChange={onChange}
              onKeyDown={handleKeyDown}
              className={"inputBox"}
              required
            />
            <label className="errorLabel">{passwordError}</label>
          </div>

          <div className={"buttonContainer"}>
            <button
              onClick={handleLogin}
              type="submit"
              className={"inputButton"}
            >
              Login
            </button>
            <button
              onClick={() => {
                setSignUpState(true);
                formReset();
              }}
              className={"inputButton"}
            >
              Go to Register
            </button>
          </div>
        </div>
      )}

      {/* Signup */}
      {signUpState && (
        <div className={"mainContainer"}>
          <div className={"titleContainer"}>
            <div>Register</div>
          </div>
          <br />

          <div className={"inputContainer"}>
            <input
              type="text"
              name="username"
              value={username}
              placeholder="Username"
              onChange={onChange}
              className={"inputBox"}
              required
            />
            <label className="errorLabel">{usernameError}</label>
          </div>

          <div className={"inputContainer"}>
            <input
              type="text"
              name="email"
              value={email}
              placeholder="Email"
              onChange={onChange}
              className={"inputBox"}
              required
            />
            <label className="errorLabel">{emailError}</label>
          </div>

          <div className={"inputContainer"}>
            <input
              type="password"
              name="password"
              value={password}
              placeholder="Password"
              onChange={onChange}
              className={"inputBox"}
              required
            />
            <label className="errorLabel">{passwordError}</label>
          </div>

          <div className={"inputContainer"}>
            <input
              type="text"
              name="fullName"
              value={fullName}
              placeholder="Full name"
              onChange={onChange}
              className={"inputBox"}
              required
            />
          </div>

          <div className={"inputContainer"}>
            <input
              type="text"
              name="phoneNumber"
              value={phoneNumber}
              placeholder="Phone"
              onChange={onChange}
              className={"inputBox"}
              required
            />
          </div>

          <div className={"buttonContainer"}>
            <button onClick={handleSignup} className={"inputButton"}>
              Register
            </button>
            <button
              onClick={() => {
                setSignUpState(false);
                formReset();
              }}
              className={"inputButton"}
            >
              Back to Login
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Auth;
