import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import OrganizationPage from "./pages/OrganizationPage";
import OrganizationHostel from "./components/Hostels/Hostel";
import BuildingManagement from "./components/Buildings/BuildingManagement";
import BackButton from "./components/Common/BackButton";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProtectedRoute from "./Pages/ProtectedRoute";
import { loadUser } from "./features/authSlice";
import "./App.css";

const App = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const dispatch = useDispatch();
  const { isLoggedIn, loading: authLoading } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  if (authLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="app-container d-flex">
        {isLoggedIn && (
          <Sidebar
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
          />
        )}
        <div
          className="main-content flex-grow-1"
          style={{
            marginLeft: isLoggedIn ? (sidebarOpen ? "230px" : "70px") : "0px",
            transition: "margin-left 0.3s ease",
            minHeight: "100vh",
          }}
        >
          <div className="content-area p-4">
            {isLoggedIn && <BackButton />}
            <Routes>
              {/* Public Routes */}
              <Route
                path="/login"
                element={isLoggedIn ? <Navigate to="/dashboard" /> : <Login />}
              />
              <Route
                path="/signup"
                element={isLoggedIn ? <Navigate to="/dashboard" /> : <Signup />}
              />

              {/* Protected Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/organizations"
                element={
                  <ProtectedRoute>
                    <OrganizationPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/organization/:orgId/hostels"
                element={
                  <ProtectedRoute>
                    <OrganizationHostel />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/hostels"
                element={
                  <ProtectedRoute>
                    <BuildingManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/hostel/:hostelId/building-management"
                element={
                  <ProtectedRoute>
                    <BuildingManagement />
                  </ProtectedRoute>
                }
              />

              {/* Root Route */}
              <Route
                path="/"
                element={
                  isLoggedIn ? (
                    <Navigate to="/dashboard" />
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />

              {/* Catch all route */}
              <Route
                path="*"
                element={
                  <Navigate to={isLoggedIn ? "/dashboard" : "/login"} />
                }
              />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
};

export default App;