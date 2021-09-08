import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";

import { ReactComponent as Logo } from "../assets/devchallenges.svg";
import { ReactComponent as LogoLight } from "../assets/devchallenges-light.svg";
import { ReactComponent as FacebookLogo } from "../assets/Facebook.svg";
import { ReactComponent as TwitterLogo } from "../assets/Twitter.svg";
import { ReactComponent as GithubLogo } from "../assets/Github.svg";
import GoogleLogin from "./googleLoginBtn";

const Registration = () => {
  const prefersDarkMode = window.matchMedia("(prefers-color-scheme: dark)")
    .matches;
  const [userCredentials, setUserCredentials] = useState({
    email: "",
    password: "",
  });
  const history = useHistory();

  const handleChange = (e) => {
    setUserCredentials({ ...userCredentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:5000/users/register", userCredentials)
      .then((res) => {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("id", res.data.id);
        history.push("/");
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="auth-form">
      <div className="logo">{prefersDarkMode ? <LogoLight /> : <Logo />}</div>
      <h2>Join thousands of learners from around the world</h2>
      <p>
        Master web development by making real-life projects. There are multiple
        paths for you to choose.
      </p>
      <form onSubmit={handleSubmit}>
        <div className="input-wrapper email-wrapper">
          <span className="material-icons email-icon">email</span>
          <input
            type="email"
            placeholder="Email"
            name="email"
            value={userCredentials.email}
            onChange={handleChange}
          />
        </div>

        <div className="input-wrapper">
          <span className="material-icons lock-icon">lock</span>
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={userCredentials.password}
            onChange={handleChange}
          />
        </div>
        <button>Start coding now</button>
      </form>
      <p className="alt-auth-opt">or continue with</p>
      <div className="alt-auth-btns">
        <GoogleLogin />
        <FacebookLogo className="logo-btn" />
        <TwitterLogo className="logo-btn" />
        <GithubLogo className="logo-btn" />
      </div>
      <p className="switch-auth">
        Already a member? <Link to="/login">Login</Link>
      </p>
    </div>
  );
};

export default Registration;