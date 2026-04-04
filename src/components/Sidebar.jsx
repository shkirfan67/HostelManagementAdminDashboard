import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/authSlice";

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const isOpen = sidebarOpen;

  const getUserDisplayName = () => {
    if (!user) return "Hostel Admin";

    if (user.userData) {
      return (
        user.userData.fullName ||
        user.userData.name ||
        user.userData.username ||
        "Hostel Admin"
      );
    }

    return user.username || "Hostel Admin";
  };

  const getUserRole = () => {
    if (!user) return "Administrator";

    if (user.userData) {
      return user.userData.role || "Administrator";
    }

    return "Administrator";
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const navLinks = [
    { path: "/dashboard", label: "Dashboard", icon: "bi-speedometer2" },
    { path: "/organizations", label: "Organizations", icon: "bi-people" },
  ];

  const getLinkClass = (path) =>
    `nav-link d-flex align-items-center text-decoration-none ${
      location.pathname === path
        ? "bg-primary text-white shadow-sm"
        : "text-light hover-bg"
    } rounded-3 px-3 py-2 mb-1 transition-all`;

  const displayName = getUserDisplayName();
  const userRole = getUserRole();

  return (
    <div
      className="d-flex flex-column border-end"
      style={{
        width: isOpen ? "230px" : "70px",
        height: "100vh",
        background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
        color: "#fff",
        overflow: "hidden",
        transition: "width 0.3s",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 1000,
      }}
    >
      <div className="d-flex align-items-center justify-content-between p-3 border-bottom border-light border-opacity-25">
        {isOpen && (
          <div className="d-flex align-items-center">
            <div className="bg-white rounded-3 p-2 me-2 shadow">
              <i className="bi bi-building text-primary fs-5"></i>
            </div>
            <div>
              <h5
                className="fw-bold mb-0 text-white"
                style={{ fontSize: "1.1rem" }}
              >
                {displayName}
              </h5>
              <small
                className="text-light opacity-75"
                style={{ fontSize: "0.7rem" }}
              >
                Management System
              </small>
            </div>
          </div>
        )}
        <button
          className="btn btn-light btn-sm rounded-circle p-1 shadow"
          style={{ width: "32px", height: "32px" }}
          onClick={() => setSidebarOpen(!isOpen)}
        >
          <i
            className={`bi ${
              isOpen ? "bi-chevron-left" : "bi-chevron-right"
            } text-dark`}
            style={{ fontSize: "0.8rem" }}
          />
        </button>
      </div>

      <nav className="flex-grow-1 p-3">
        <ul className="nav flex-column">
          {navLinks.map((link) => (
            <li key={link.path} className="nav-item">
              <Link
                to={link.path}
                className={getLinkClass(link.path)}
                style={{ fontSize: "0.85rem" }}
              >
                <i
                  className={`bi ${link.icon} ${isOpen ? "me-3" : "mx-auto"}`}
                  style={{ fontSize: "1rem", minWidth: "20px" }}
                />
                {isOpen && <span className="fw-medium">{link.label}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {isOpen ? (
        <div className="mt-auto border-top border-light border-opacity-25">
          <div className="p-3 d-flex align-items-center">
            <div className="rounded-circle bg-white p-1 me-3 shadow-sm">
              <i
                className="bi bi-person-fill text-primary"
                style={{ fontSize: "1.2rem" }}
              ></i>
            </div>
            <div>
              <h6
                className="mb-0 text-white fw-semibold"
                style={{ fontSize: "0.9rem" }}
              >
                {displayName}
              </h6>
              <small
                className="text-light opacity-75"
                style={{ fontSize: "0.75rem" }}
              >
                {userRole}
              </small>
            </div>
          </div>
          <div className="p-3 pt-0">
            <button className="btn btn-outline-light btn-sm w-100 mb-2 rounded-2">
              <i className="bi bi-gear me-2"></i>
              Settings
            </button>
            <button
              className="btn btn-danger btn-sm w-100 rounded-2"
              onClick={handleLogout}
            >
              <i className="bi bi-box-arrow-right me-2"></i>
              Logout
            </button>
            <div className="text-center mt-3">
              <small className="text-light opacity-50">v2.1.0 © 2025</small>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-auto p-3 text-center">
          <button
            className="btn btn-danger btn-sm rounded-circle p-2"
            onClick={handleLogout}
          >
            <i className="bi bi-box-arrow-right"></i>
          </button>
          <small
            className="text-light opacity-50 d-block mt-2"
            style={{ fontSize: "0.65rem" }}
          >
            v2.1.0
          </small>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
