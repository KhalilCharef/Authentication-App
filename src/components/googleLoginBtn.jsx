import React, { useEffect } from "react";
import { GoogleLogin } from "react-google-login";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { ReactComponent as GoogleLogo } from "../assets/Google.svg";

const clientId = process.env.REACT_APP_CLIENT_ID;

const GoogleLoginBtn = () => {
  const history = useHistory();

  const loginSuccess = (res) => {
    axios
      .post("http://localhost:5000/users/login/google", res.profileObj)
      .then((res) => {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("id", res.data.id);
        history.push("/");
      })
      .catch((err) => console.log(err));
  };

useEffect(()=>{console.log('rerender')})

  const loginFailure = (res) => {
    console.log("[Login Failed] res:", res);
  };

  return (
    <div>
      <GoogleLogin
        clientId={clientId}
        render={(renderProps) => (
          <GoogleLogo className="logo-btn" onClick={renderProps.onClick} />
        )}
        onSuccess={loginSuccess}
        onFailure={loginFailure}
        cookiePolicy={"single_host_origin"}
        // isSignedIn={true}
      />
    </div>
  );
};

export default GoogleLoginBtn;