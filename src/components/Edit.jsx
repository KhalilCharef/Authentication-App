import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
// import Upload from "./upload.js";
import { axiosWithAuth } from "../utils/axiosWithAuth";
import Upload from "./upload";

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
  const [fileInputState, setFileInputState] = useState("");
  const [previewSource, setPreviewSource] = useState("");
  const [selectedFile, setSelectedFile] = useState();
  const [successMsg, setSuccessMsg] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    previewFile(file);
    setSelectedFile(file);
    setFileInputState(e.target.value);
  };

  const previewFile = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setPreviewSource(reader.result);
    };
  };

  const handleSubmitFile = (e) => {
    e.preventDefault();
    if (!selectedFile) return;
    const reader = new FileReader();
    reader.readAsDataURL(selectedFile);
    reader.onloadend = () => {
      uploadImage(reader.result);
    };
    reader.onerror = () => {
      console.error("AHHHHHHHH!!");
      setErrMsg("something went wrong!");
    };
  };

  const uploadImage = async (base64EncodedImage) => {
    try {
      await fetch("http://localhost:5000/api/upload", {
        method: "POST",
        body: JSON.stringify({ data: base64EncodedImage }),
        headers: { "Content-Type": "application/json" },
      });
      setFileInputState("");
      setPreviewSource("");
      setSuccessMsg("Image uploaded successfully");
    } catch (err) {
      console.error(err);
      setErrMsg("Something went wrong!");
    }
  };

  useEffect(() => {
    axiosWithAuth()
      .get(`http://localhost:5000/users/${userId}`)
      .then((res) => {
        setUserInfo(res.data);
        setUserImage(res.data.photo);
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

  const addImage = (url) => {
    setUserInfo({ ...userInfo, photo : url})
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const entries = Object.entries(userInfo);
    const formData = new FormData();

    // if (!selectedFile) return;
    // const reader = new FileReader();
    // reader.readAsDataURL(selectedFile);
    // reader.onloadend = () => {
    //   uploadImage(reader.result);
    // };
    // reader.onerror = () => {
    //   console.error("AHHHHHHHH!!");
    //   setErrMsg("something went wrong!");
    // };
    // format the updated user info
    entries.forEach((entry) => {
      if (entry[1]) {
        formData.set(entry[0], entry[1]);
      }
    });

    // add the update props (and the new image if applicable) to the formData
    if (selectedFile) formData.append("userImage", selectedFile);

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
        {/* <div className="edit-image">
          
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
        </div> */}
        <Upload addImage={addImage}/>
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
