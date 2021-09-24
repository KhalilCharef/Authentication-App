import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";

import { axiosWithAuth } from "../utils/axiosWithAuth";

const Edit = () => {
  const history = useHistory();
  const [userInfo, setUserInfo] = useState({
    name: "",
    bio: "",
    phone: "",
    email: "",
    password: "",
    photo: "",
  });
  const [userImage, setUserImage] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const userId = localStorage.getItem("id");

  useEffect(() => {
    axiosWithAuth()
      .get(`http://localhost:5000/users/${userId}`)
      .then((res) => {
        setUserInfo(res.data);
        // setUserImage(res.data.photo)
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:5000/me", {
        headers: { "x-access-token": localStorage.getItem("token") },
      })
      .then((response) => {
        setUserInfo({ ...userInfo, ...response.data, password: "" });
      });
  }, []);

  const handleChange = (e) => {
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
  };

  const addImage = (e) => {
    const file = e.target.files[0];
    setUserImage(file);

    // create a temporary local URL for the file
    const preview = URL.createObjectURL(file);
    setImagePreview(preview);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const entries = Object.entries(userInfo);
    const formData = new FormData();

    // format the updated user info
    entries.forEach((entry) => {
      if (entry[1]) {
        formData.set(entry[0], entry[1]);
      }
    });

    // add the update props (and the new image if applicable) to the formData
    if (userImage) formData.append("userImage", userImage);

    axios
      // .put(`http://localhost:5000/users/${userId}`, formData)
      .put("http://localhost:5000/edit", formData, {
        headers: { "x-access-token": localStorage.getItem("token") },
      })
      .then((res) => {
        history.push("/");
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="edit-user-info">
      <Link to="/">
        <span className="material-icons">chevron_left</span>Back
      </Link>
      <form id="update-form" onSubmit={handleSubmit}>
        <h3>Change Info</h3>
        <span>Changes will be reflected on every service</span>
        <div className="edit-image">
          <div className="image-wrapper">
            <span className="material-icons">photo_camera</span>
            <img src={imagePreview ? imagePreview : userInfo.photo} alt="" />
          </div>
          <label htmlFor="file-upload">Change Photo</label>
          <input
            type="file"
            name="photo"
            id="file-upload"
            onChange={addImage}
          />
        </div>

        <label htmlFor="edit-name-field">Name</label>
        <input
          type="text"
          id="edit-name-field"
          placeholder="Enter your name..."
          name="name"
          value={userInfo.name}
          onChange={handleChange}
        />
        <label htmlFor="edit-bio-field">Bio</label>
        <textarea
          className="bio-input"
          type="text"
          id="edit-bio-field"
          placeholder="Enter your bio..."
          name="bio"
          value={userInfo.bio}
          onChange={handleChange}
        />
        <label htmlFor="edit-phone-field">Phone</label>
        <input
          type="text"
          id="edit-phone-field"
          placeholder="Enter your phone..."
          name="phone"
          value={userInfo.phone}
          onChange={handleChange}
        />
        <label htmlFor="edit-email-field">Email</label>
        <input
          type="email"
          id="edit-email-field"
          placeholder="Enter your email..."
          name="email"
          value={userInfo.email}
          onChange={handleChange}
        />
        <label htmlFor="edit-password-field">Password</label>
        <input
          type="password"
          id="edit-password-field"
          placeholder="Enter your password..."
          name="password"
          value={userInfo.password}
          onChange={handleChange}
        />
        <button type="submit" onClick={handleSubmit}>
          Save
        </button>
      </form>
    </div>
  );
};

export default Edit;
