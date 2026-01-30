import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import DashboardLayout from "./pages/dashboard/DashboardLayout.jsx";
import Relation from "./pages/dashboard/Relation.jsx";
import Profile from "./pages/dashboard/Profile.jsx";
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
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Relation />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Route>

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
    </AuthProvider>
  );
}

export default App;
