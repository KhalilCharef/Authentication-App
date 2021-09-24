import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

import { axiosWithAuth } from "../utils/axiosWithAuth";

import { ReactComponent as Logo } from "../assets/devchallenges.svg";
import { ReactComponent as LogoLight } from "../assets/devchallenges-light.svg";
import UserInfos from "./UserInfos";
import Edit from "./Edit";
import PrivateRoute from "./PrivateRoute";

const Profile = () => {
  const prefersDarkMode = window.matchMedia(
    "(prefers-color-scheme: dark)"
  ).matches;
  const history = useHistory();
  const userId = localStorage.getItem("id");

  const [userInfo, setUserInfo] = useState({});

  // useEffect(() => {
  //   axiosWithAuth()
  //     .get(`http://localhost:5000/users/${userId}`)
  //     .then((res) => {
  //       // console.log(res.data);
  //       setUserInfo(res.data);
  //     })
  //     .catch((err) => console.log(err));
  // }, []);

  const displayAccountOptions = () => {
    const arrow = document.querySelector(".dropdown-arrow");
    const accountOptions = document.querySelector(".account-options");

    arrow.classList.toggle("rotate-arrow");
    accountOptions.style.display === "none"
      ? (accountOptions.style.display = "flex")
      : (accountOptions.style.display = "none");
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("id");
    history.push("/login");
  };

  return (
    <div className="profile-page">
      <header>
        {prefersDarkMode ? <LogoLight /> : <Logo />}
        <div className="account" onClick={displayAccountOptions}>
          <div className="image-wrapper">
            <img src={userInfo.photo} alt="" />
          </div>
          <span className="user-name">
            {userInfo.name ? userInfo.name : userInfo.email}
          </span>
          <span className="material-icons dropdown-arrow">arrow_drop_down</span>
          <div className="account-options" style={{ display: "none" }}>
            <button onClick={() => history.push("/")}>
              <span className="material-icons">account_circle</span>
              My Profile
            </button>
            <button>
              <span className="material-icons">people</span>
              Group Chat
            </button>
            <hr />
            <button className="logout-btn" onClick={logout}>
              <span className="material-icons">logout</span>
              Logout
            </button>
          </div>
        </div>
      </header>
      <PrivateRoute exact path="/">
        <UserInfos userInfo={userInfo} />
      </PrivateRoute>
      <PrivateRoute path="/edit" component={Edit} />
    </div>
  );
};

export default Profile;
