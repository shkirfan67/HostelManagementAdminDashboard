import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../features/authSlice";
import { useNavigate, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser({ username, password })).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        navigate("/dashboard");
      }
    });
  };

  return (
    <div className="container-fluid min-vh-100">
      <div className="row h-100">
        <div className="col-lg-6 col-md-5 d-none d-md-block p-0">
          <div
            className="h-100 w-100 position-relative"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1925&q=80')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div
              className="position-absolute top-0 start-0 h-100 w-100"
              style={{
                background: "rgba(0,0,0,0.55)",
                backdropFilter: "blur(2px)",
              }}
            ></div>

            <div className="position-relative text-white p-5 h-100 d-flex flex-column justify-content-between">
              <div>
                <h1 className="display-5 fw-bold mb-3">
                  Modern Hostel Management
                </h1>
                <p className="lead opacity-75 mb-4">
                  Efficiently manage hostels, buildings, and organizations with
                  our advanced admin panel.
                </p>

                <div className="d-flex align-items-center gap-3 mb-3">
                  <div className="bg-primary bg-opacity-25 rounded-circle p-2">
                    <i className="bi bi-check-circle fs-4"></i>
                  </div>
                  <span>Real-time occupancy tracking</span>
                </div>

                <div className="d-flex align-items-center gap-3 mb-3">
                  <div className="bg-primary bg-opacity-25 rounded-circle p-2">
                    <i className="bi bi-check-circle fs-4"></i>
                  </div>
                  <span>Multi-organization support</span>
                </div>

                <div className="d-flex align-items-center gap-3">
                  <div className="bg-primary bg-opacity-25 rounded-circle p-2">
                    <i className="bi bi-check-circle fs-4"></i>
                  </div>
                  <span>Advanced reporting & analytics</span>
                </div>
              </div>

              <div className="mt-4 d-flex align-items-center gap-3">
                <div className="bg-white p-2 rounded-circle">
                  <i className="bi bi-building text-dark fs-4"></i>
                </div>
                <div>
                  <h5 className="fw-semibold mb-0">HostelPro System</h5>
                  <small className="opacity-75">Version 1.0.0</small>
                </div>
              </div>
            </div>
          </div>
        </div>


        <div className="col-lg-6 col-md-7 col-12 d-flex align-items-center justify-content-center p-4">
          <div
            className="card shadow-sm border-0 w-100"
            style={{ maxWidth: "420px" }}
          >
            <div className="card-body p-4">
              {/* Header */}
              <div className="text-center mb-4">
                <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex p-3 mb-2">
                  <i className="bi bi-door-closed text-primary fs-3"></i>
                </div>
                <h2 className="fw-bold mb-1">Secure Login</h2>
                <p className="text-muted small">
                  Access your administration panel
                </p>
              </div>

              {/* FORM */}
              <form onSubmit={handleSubmit}>
                {/* Username */}
                <div className="mb-3">
                  <label className="form-label">Username</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light">
                      <i className="bi bi-person"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light">
                      <i className="bi bi-key"></i>
                    </span>
                    <input
                      type={showPassword ? "text" : "password"}
                      className="form-control"
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <span
                      className="input-group-text bg-light"
                      role="button"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <i
                        className={`bi ${
                          showPassword ? "bi-eye-slash" : "bi-eye"
                        }`}
                      ></i>
                    </span>
                  </div>
                </div>

                {/* Remember + Forgot */}
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="remember"
                    />
                    <label
                      className="form-check-label small"
                      htmlFor="remember"
                    >
                      Keep me signed in
                    </label>
                  </div>
                  <Link className="small text-primary" to="#">
                    Forgot password?
                  </Link>
                </div>

                {/* Error */}
                {error && (
                  <div className="alert alert-danger small py-2">
                    <i className="bi bi-exclamation-circle me-1"></i>
                    {error}
                  </div>
                )}

                {/* Button */}
                <button
                  type="submit"
                  className="btn btn-primary w-100 py-2 fw-semibold"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Authenticating...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-lock me-2"></i> Sign In
                    </>
                  )}
                </button>

                {/* Divider */}
                <div className="text-center my-3">
                  <span className="text-muted small">or</span>
                </div>

                {/* Signup */}
                <div className="text-center">
                  <p className="small text-muted mb-1">New to HostelPro?</p>
                  <Link to="/signup" className="btn btn-outline-primary btn-sm">
                    <i className="bi bi-person-plus me-1"></i> Create
                    Administrator Account
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
