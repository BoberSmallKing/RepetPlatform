import { useState, useEffect, useRef } from "react";
import { Outlet, NavLink } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import "../../styles/dashboard.css";

function DashboardLayout() {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <div className="sidebar-logo">RepetPlatform</div>

        <nav className="sidebar-nav">
          <NavLink
            to="/dashboard"
            end
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <svg
              style={{ marginRight: "10px" }}
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="7" height="7"></rect>
              <rect x="14" y="3" width="7" height="7"></rect>
              <rect x="14" y="14" width="7" height="7"></rect>
              <rect x="3" y="14" width="7" height="7"></rect>
            </svg>
            Обзор
          </NavLink>

          <NavLink
            to="/dashboard/profile"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <svg
              style={{ marginRight: "10px" }}
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            Профиль
          </NavLink>
        </nav>
      </aside>

      <div className="main-content">
        <header className="dashboard-header">
          <div className="header-title">Рабочее пространство</div>

          <div className="profile-section" ref={dropdownRef}>
            <div className="avatar" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {user?.first_name?.[0] || "U"}
            </div>

            {isMenuOpen && (
              <div className="profile-dropdown">
                <div className="dropdown-info">
                  <p className="user-name">
                    {user?.first_name} {user?.last_name}
                  </p>
                  <p className="user-email">{user?.email}</p>
                </div>
                <hr />
                <NavLink
                  to="/dashboard/profile"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Настройки аккаунта
                </NavLink>
                <button onClick={logout} className="logout-btn">
                  Выйти из системы
                </button>
              </div>
            )}
          </div>
        </header>

        <main className="content-body">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
