import React, { useState } from "react";
import Alert from "./Alert.js";

export default function Upload({addImage}) {
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
    // e.preventDefault();
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
      const res = await fetch("http://localhost:5000/api/upload", {
        method: "POST",
        body: JSON.stringify({ data: base64EncodedImage }),
        headers: { "Content-Type": "application/json" },
      });
      const {url} = await res.json()
      setFileInputState("");
      setPreviewSource(url);
      addImage(url);
      setSuccessMsg("Image uploaded successfully");
      // console.log(setFileInputState);
      // console.log(base64EncodedImage);
    } catch (err) {
      console.error(err);
      setErrMsg("Something went wrong!");
    }
  };
  return (
    <div>
      <h1 className="title">Upload an Image</h1>
      <Alert msg={errMsg} type="danger" />
      <Alert msg={successMsg} type="success" />
        <input
          id="fileInput"
          type="file"
          name="image"
          onChange={handleFileInputChange}
          value={fileInputState}
          className="form-input"
        />
        <button className="btn" type="button" onClick={handleSubmitFile}>
          Confirm
        </button>
    
      {previewSource && (
        <img src={previewSource} alt="chosen" style={{ height: "300px" }} />
      )}
    </div>
  );
}
