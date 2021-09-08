import React from "react";
import { useHistory } from "react-router-dom";

const UserInfos = ({ userInfo }) => {
  const history = useHistory();

  return (
    <div>
      <h2>Personal info</h2>
      <p>Basic info, like your name and photo</p>
      <div className="user-info">
        <div className="user-info-header">
          <div>
            <h3>Profile</h3>
            <span>Some info may be visible to other people</span>
          </div>
          <button onClick={() => history.push("/edit")}>Edit</button>
        </div>
        <div className="user-info-row photo-row">
          <span className="row-name">Photo</span>
          <div className="image-wrapper">
            <img src={userInfo.photo} alt="" />
          </div>
        </div>
        <div className="user-info-row">
          <span className="row-name">Name</span>
          <span className="row-data">{userInfo.name}</span>
        </div>
        <div className="user-info-row">
          <span className="row-name">Bio</span>
          <span className="row-data">{userInfo.bio}</span>
        </div>
        <div className="user-info-row">
          <span className="row-name">Phone</span>
          <span className="row-data">{userInfo.phone}</span>
        </div>
        <div className="user-info-row">
          <span className="row-name">Email</span>
          <span className="row-data">{userInfo.email}</span>
        </div>
        <div className="user-info-row" id="password-row">
          <span className="row-name">Password</span>
          <span className="row-data">************</span>
        </div>
      </div>
    </div>
  );
};

export default UserInfos;