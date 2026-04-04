import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

import {
  fetchOrganizations,
  addOrganization,
  deleteOrganization,
} from "../../features/organizationSlice";
import {PulseLoader } from "react-spinners";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Initial form values - removed hostelCount
const emptyForm = {
  name: "",
  address: "",
  contactNumber: "",
  email: "",
};

const OrganizationList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { organizations = [], loading = false } = useSelector(
    (state) => state.organization || {}
  );

  const [activeTab, setActiveTab] = useState("overview");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const [form, setForm] = useState(emptyForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // Fetch organizations initially
  useEffect(() => {
    dispatch(fetchOrganizations());
  }, [dispatch]);

  // Dashboard statistics
  const stats = useMemo(() => {
    const totalOrgs = organizations.length;
    const totalHostels = organizations.reduce(
      (sum, o) => sum + o.hostelCount,
      0
    );

    return {
      totalOrgs,
      totalHostels,
      avgHostels: totalOrgs === 0 ? 0 : Math.round(totalHostels / totalOrgs),
    };
  }, [organizations]);

  // Chart Data
  const chartData = useMemo(() => {
    const sorted = [...organizations].sort(
      (a, b) => b.hostelCount - a.hostelCount
    );
    const top = sorted.slice(0, 6);

    return {
      labels: top.map((o) =>
        o.name.length > 14 ? o.name.substring(0, 14) + "…" : o.name
      ),
      datasets: [
        {
          label: "Hostels",
          data: top.map((o) => o.hostelCount),
          backgroundColor: "rgba(54, 162, 235, 0.7)",
        },
      ],
    };
  }, [organizations]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: "Top Organizations by Hostel Count",
        font: { size: 14 },
      },
    },
    scales: {
      y: { beginAtZero: true, ticks: { stepSize: 1 } },
      x: { ticks: { autoSkip: false } },
    },
  };

  // Form change handler
  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Add Organization
  const handleAddOrganization = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) return alert("Organization name is required");

    setIsSubmitting(true);

    try {
      await dispatch(addOrganization(form)).unwrap();
      await dispatch(fetchOrganizations());

      setIsAddOpen(false);
      setForm(emptyForm);
      setActiveTab("list");
    } catch (error) {
      alert("Failed to add organization: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete confirmation
  const openConfirmDelete = (id) => {
    setDeletingId(id);
    setIsConfirmOpen(true);
  };

  const confirmDelete = async () => {
    setIsSubmitting(true);

    try {
      await dispatch(deleteOrganization(deletingId)).unwrap();
      await dispatch(fetchOrganizations());
    } catch (err) {
      alert("Failed to delete organization" + err);
    } finally {
      setIsSubmitting(false);
      setDeletingId(null);
      setIsConfirmOpen(false);
    }
  };

  return (
    <div className="container-fluid py-3 py-md-4">
      {/* HEADER */}
      <div className="row align-items-center mb-4">
        <div className="col-md-8">
          <h1 className="h3 fw-bold">Organization Dashboard</h1>
          <p className="text-muted d-none d-md-block">
            Manage organizations and analyze hostel distribution
          </p>
        </div>
        <div className="col-md-4 text-md-end">
          <button
            className="btn btn-outline-secondary me-2"
            onClick={() => dispatch(fetchOrganizations())}
          >
            Refresh
          </button>
          <button
            className="btn btn-primary"
            onClick={() => setIsAddOpen(true)}
          >
            Add Organization
          </button>
        </div>
      </div>

      {/* TABS */}
      <ul className="nav nav-tabs mb-4">
        {["overview", "list", "analytics"].map((tab) => (
          <li className="nav-item" key={tab}>
            <button
              className={`nav-link ${activeTab === tab ? "active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          </li>
        ))}
      </ul>

      {/* OVERVIEW TAB */}
      {activeTab === "overview" && (
        <>
          <div className="row g-3 mb-4">
            <div className="col-6 col-md-4 col-lg-3">
              <div className="card border-primary h-100 text-center p-3">
                <h6>Total Organizations</h6>
                <h3>{stats.totalOrgs}</h3>
              </div>
            </div>

            <div className="col-6 col-md-4 col-lg-3">
              <div className="card border-success h-100 text-center p-3">
                <h6>Total Hostels</h6>
                <h3>{stats.totalHostels}</h3>
              </div>
            </div>

            <div className="col-6 col-md-4 col-lg-3">
              <div className="card border-warning h-100 text-center p-3">
                <h6>Avg Hostels / Organization</h6>
                <h3>{stats.avgHostels}</h3>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header bg-white">
              <h5 className="mb-0">Top Organizations</h5>
            </div>
            <div className="card-body" style={{ height: 300 }}>
              <Bar data={chartData} options={chartOptions} />
            </div>
          </div>
        </>
      )}

      {/* LIST TAB */}
      {activeTab === "list" && (
        <div className="card">
          <div className="card-header bg-white">
            <h5 className="mb-0">All Organizations</h5>
          </div>

          <div className="card-body p-0">
            {loading ? (
              <div className="text-center py-5">
                <span>
                  <PulseLoader />
                </span>
              </div>
            ) : organizations.length === 0 ? (
              <div className="text-center py-5">
                <h5>No organizations found</h5>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Hostels</th>
                      <th>Contact</th>
                      <th>Email</th>
                      <th className="text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {organizations.map((o) => (
                      <tr key={o.id}>
                        <td>#{o.id}</td>
                        <td>{o.name}</td>
                        <td>{o.hostelCount}</td>
                        <td>{o.contactNumber || "-"}</td>
                        <td>{o.email || "-"}</td>
                        <td className="text-end">
                          <button
                            className="btn btn-sm btn-outline-primary me-2"
                            onClick={() =>
                              navigate(`/organization/${o.id}/hostels`)
                            }
                          >
                            View
                          </button>

                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => openConfirmDelete(o.id)}
                            disabled={isSubmitting && deletingId === o.id}
                          >
                            {isSubmitting && deletingId === o.id
                              ? "..."
                              : "Delete"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ANALYTICS TAB */}
      {activeTab === "analytics" && (
        <div className="card">
          <div className="card-header bg-white">
            <h5 className="mb-0">Analytics</h5>
          </div>
          <div className="card-body" style={{ height: 400 }}>
            <Bar data={chartData} options={chartOptions} />
          </div>
        </div>
      )}

      {/* ADD ORGANIZATION MODAL - PREMIUM BOOTSTRAP DESIGN */}
      {isAddOpen && (
        <div
          className="modal fade show d-block"
          style={{ background: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content shadow-lg border-0">
              {/* Premium Modal Header */}
              <div className="modal-header bg-gradient-primary text-white border-0">
                <div className="d-flex align-items-center w-100">
                  <div className="modal-icon me-3">
                    <i
                      className="bi bi-building"
                      style={{ fontSize: "1.5rem" }}
                    ></i>
                  </div>
                  <div className="flex-grow-1">
                    <h5 className="modal-title fw-bold mb-0">
                      Add New Organization
                    </h5>
                    <p
                      className="mb-0 opacity-75"
                      style={{ fontSize: "0.85rem" }}
                    >
                      Enter organization details below
                    </p>
                  </div>
                  <button
                    type="button"
                    className="btn-close btn-close-white"
                    onClick={() => setIsAddOpen(false)}
                    aria-label="Close"
                  ></button>
                </div>
              </div>

              <form onSubmit={handleAddOrganization}>
                <div className="modal-body p-4">
                  <div className="row g-3">
                    {/* Organization Name - Full Width */}
                    <div className="col-12">
                      <label className="form-label fw-semibold">
                        Organization Name <span className="text-danger">*</span>
                      </label>
                      <div className="input-group">
                        <span className="input-group-text bg-light border-end-0">
                          <i className="bi bi-buildings"></i>
                        </span>
                        <input
                          type="text"
                          name="name"
                          className="form-control ps-0 border-start-0"
                          value={form.name}
                          onChange={handleFormChange}
                          placeholder="Enter organization name"
                          required
                        />
                      </div>
                      <div className="form-text">
                        Enter the full legal name of the organization
                      </div>
                    </div>

                    {/* Contact Details in Two Columns */}
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">
                        Contact Number
                      </label>
                      <div className="input-group">
                        <span className="input-group-text bg-light border-end-0">
                          <i className="bi bi-telephone"></i>
                        </span>
                        <input
                          type="tel"
                          name="contactNumber"
                          className="form-control ps-0 border-start-0"
                          value={form.contactNumber}
                          onChange={handleFormChange}
                          placeholder="+1 (123) 456-7890"
                        />
                      </div>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold">
                        Email Address
                      </label>
                      <div className="input-group">
                        <span className="input-group-text bg-light border-end-0">
                          <i className="bi bi-envelope"></i>
                        </span>
                        <input
                          type="email"
                          name="email"
                          className="form-control ps-0 border-start-0"
                          value={form.email}
                          onChange={handleFormChange}
                          placeholder="organization@example.com"
                        />
                      </div>
                    </div>

                    {/* Address - Full Width */}
                    <div className="col-12">
                      <label className="form-label fw-semibold">
                        Full Address
                      </label>
                      <div className="input-group">
                        <span className="input-group-text bg-light align-items-start pt-3 border-end-0">
                          <i className="bi bi-geo-alt"></i>
                        </span>
                        <textarea
                          name="address"
                          rows="3"
                          className="form-control ps-0 border-start-0"
                          value={form.address}
                          onChange={handleFormChange}
                          placeholder="Enter complete address including street, city, state, and zip code"
                        ></textarea>
                      </div>
                      <div className="form-text">
                        This address will be used for official communications
                      </div>
                    </div>

                    {/* Information Card */}
                    <div className="col-12">
                      <div className="alert alert-info border-0 bg-light-info">
                        <div className="d-flex align-items-center">
                          <i className="bi bi-info-circle me-2"></i>
                          <div>
                            <p className="mb-0">
                              <strong>Note:</strong> Organization will start
                              with 0 hostels. You can add hostels after creating
                              the organization.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Premium Modal Footer */}
                <div className="modal-footer border-top-0 bg-light p-4">
                  <div className="d-flex justify-content-between w-100">
                    <button
                      type="button"
                      className="btn btn-outline-secondary px-4"
                      onClick={() => setIsAddOpen(false)}
                      disabled={isSubmitting}
                    >
                      <i className="bi bi-x-circle me-2"></i>
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary px-4"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2"></span>
                          Creating...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-check-circle me-2"></i>
                          Create Organization
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRM MODAL */}
      {isConfirmOpen && (
        <div
          className="modal fade show d-block"
          style={{ background: "#0003" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-danger text-white">
                <h5>Confirm Delete</h5>
              </div>

              <div className="modal-body">
                Are you sure you want to delete this organization?
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setIsConfirmOpen(false)}
                >
                  Cancel
                </button>

                <button
                  className="btn btn-danger"
                  onClick={confirmDelete}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrganizationList;
