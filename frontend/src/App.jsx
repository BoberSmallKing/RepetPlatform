import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";

import Register from "./pages/auth/Register.jsx";
import Activate from "./pages/auth/Activate.jsx";
import Login from "./pages/auth/Login.jsx";
import Logout from "./pages/auth/Logout.jsx";
import ResetPassword from "./pages/auth/ResetPassword.jsx";
import ResetPasswordActivate from "./pages/auth/ResetPasswordActivate.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/logout" element={<Logout />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route
        path="password-reset-confirm/:uid/:token"
        element={<ResetPasswordActivate />}
      />
      <Route path="/activate/:uid/:token" element={<Activate />} />
    </Routes>
  );
}

export default App;
