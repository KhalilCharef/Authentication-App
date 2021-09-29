import { Route } from "react-router-dom";

import "./styles/index.css";

import Registration from "./components/Registration";
import LoginForm from "./components/LoginForm";
import Profile from "./components/Profile";
import PrivateRoute from "./components/PrivateRoute";
import Upload from "./components/upload";

function App() {
  return (
    <div className="App">
      <Route path="/upload" component={Upload} />
      <Route path="/register" component={Registration} />
      <Route path="/login" component={LoginForm} />
      <PrivateRoute path="/" component={Profile} />
    </div>
  );
}

export default App;
