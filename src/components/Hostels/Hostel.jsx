import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchOrganizationById } from "../../features/organizationSlice";
import {
  fetchHostelsByOrgId,
  addHostel,
  deleteHostel,
  fetchHostelById,
  clearError,
} from "./../../features/hostelSlice";

import HostelHeader from "./HostelHeader";
import HostelTabs from "./HostelTabs";
import HostelStats from "./HostelStats";
import HostelCard from "./HostelCard";
import AddHostelModal from "./AddHostelModal";
import { styles } from "./hostel.style";
import { PacmanLoader } from "react-spinners";

const OrganizationHostel = () => {
  const { orgId } = useParams();
  const dispatch = useDispatch();

  const { selectedOrganization } = useSelector((state) => state.organization);
  const { hostels, loading, error } = useSelector((state) => state.hostel);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showHostelDetails, setShowHostelDetails] = useState(false);
  const [activeTab, setActiveTab] = useState("All");
  const [hostelForm, setHostelForm] = useState({
    name: "",
    email: "",
    capacity: "",
    type: "co-ed hostel",
    contactNumber: "",
    website: "",
    image: "",
    latitude: "",
    longitude: "",
    address: {
      area: "",
      city: "",
      zipCode: "",
      state: "",
    },
    orgId: parseInt(orgId),
  });

  useEffect(() => {
    dispatch(fetchOrganizationById(parseInt(orgId)));
    dispatch(fetchHostelsByOrgId(parseInt(orgId)));
  }, [dispatch, orgId]);

  const getDisplayValue = (hostel, field) => {
    return hostel[field] || "N/A";
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case "boys hostel":
        return "Boys Hostel";
      case "girls hostel":
        return "Girls Hostel";
      case "co-ed hostel":
        return "Co-ed Hostel";
      default:
        return type;
    }
  };

  const normalize = (value) =>
    (value || "").toString().toLowerCase().replace(/[-_]/g, " ").trim();

  const filteredHostels = hostels.filter((hostel) => {
    if (activeTab === "All") return true;

    const hostelType = normalize(getDisplayValue(hostel, "type"));
    const tabType = normalize(activeTab);

    if (tabType.includes("boys")) return hostelType.includes("boy");
    if (tabType.includes("girls")) return hostelType.includes("girl");

   if (tabType.includes("co")) {
      return hostelType.includes("co ed") || hostelType.includes("coed");
    }

    return false;
  });

 
  const handleAddHostel = async (e) => {
    e.preventDefault();

    try {
      const hostelData = {
        name: hostelForm.name,
        email: hostelForm.email,
        address: hostelForm.address,
        capacity: hostelForm.capacity ? parseInt(hostelForm.capacity) : 0,
        buildingCount: hostelForm.buildingCount
          ? parseInt(hostelForm.buildingCount)
          : 0,
        type: hostelForm.type,
        website: hostelForm.website,
        image: hostelForm.image,
        contactNumber: hostelForm.contactNumber
          ? parseInt(hostelForm.contactNumber)
          : 0,
      };

      const payload = {
        orgId: parseInt(orgId),
        hostelData: hostelData,
      };

      await dispatch(addHostel(payload)).unwrap();
      await dispatch(fetchHostelsByOrgId(parseInt(orgId)));

      setHostelForm({
        name: "",
        email: "",
        address: "",
        contactNumber: "",
        type: "boys hostel",
        capacity: "",
        buildingCount: "",
        website: "",
        image: "",
      });

      setShowAddModal(false);
    } catch (err) {
      console.error("❌ Failed to add hostel:", err);
    }
  };

  const handleViewHostelDetails = async (hostelId) => {
    try {
      await dispatch(fetchHostelById(hostelId)).unwrap();
      setShowHostelDetails(true);
    } catch (err) {
      console.error("Failed to fetch hostel details:", err);
    }
  };

  const handleCloseAddModal = () => {
    setShowAddModal(false);
    setHostelForm({
      name: "",
      email: "",
      address: "",
      contactNumber: "",
      type: "boys hostel",
      capacity: "",
      buildingCount: "",
      website: "",
      image: "",
      orgId: parseInt(orgId),
    });
  };

  const handleDeleteHostel = async (hostelId) => {
    if (window.confirm("Are you sure you want to delete this hostel?")) {
      try {
        await dispatch(deleteHostel(hostelId)).unwrap();
        await dispatch(fetchHostelsByOrgId(parseInt(orgId)));
      } catch (err) {
        console.error("Failed to delete hostel:", err);
      }
    }
  };

  const handleFormChange = (field, value) => {
    setHostelForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleClearError = () => {
    dispatch(clearError());
  };

  const handleRefresh = () => {
    dispatch(fetchHostelsByOrgId(parseInt(orgId)));
  };

  // Loading State
  if (loading && !showHostelDetails) {
    return (
      <div className="d-flex align-items-center justify-content-center vh-100 ">
        <PacmanLoader
        color="#063187ff"
        cssOverride={{}}
        size={30}
      />
      </div>
    );
  }

  return (
    <div style={styles.pageContainer}>
      <div style={styles.contentContainer}>
        
        <HostelHeader
          organizationName={selectedOrganization?.name}
          onAddHostel={() => setShowAddModal(true)}
          onRefresh={handleRefresh}
          loading={loading}
        />

        {/* Tabs & Stats Section */}
        <div style={styles.card}>
          <h2
            style={{ fontSize: "20px", margin: "0 0 12px", fontWeight: "700" }}
          >
            Hostel Management
          </h2>

          <HostelTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
            getTypeLabel={getTypeLabel}
          />

          <HostelStats hostels={hostels} getDisplayValue={getDisplayValue} />
        </div>

        {error && (
          <div style={styles.errorAlert}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <strong>Error:</strong> {error}
            </div>
            <button
              onClick={handleClearError}
              style={{
                background: "none",
                border: "none",
                color: "#c00",
                cursor: "pointer",
                float: "right",
                fontSize: "16px",
              }}
            >
              ×
            </button>
          </div>
        )}

        {/* Hostels Grid */}
        <div style={styles.card}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <h3
              style={{
                fontSize: "18px",
                fontWeight: "700",
                margin: 0,
                color: "#0b1f66",
              }}
            >
              All Hostels ({filteredHostels.length})
            </h3>
            
          </div>

          {filteredHostels.length === 0 ? (
            <div style={styles.emptyState}>
              <div
                style={{
                  fontSize: "48px",
                  color: "#cfd8e6",
                  marginBottom: "16px",
                }}
              >
                🏢
              </div>
              <h5 style={{ color: "#5b6b7f", margin: "0 0 8px" }}>
                No Hostels Found
              </h5>
              <p style={{ color: "#5b6b7f", margin: "0 0 20px" }}>
                Get started by adding the first hostel to this organization.
              </p>
              <button
                style={styles.addButton}
                onClick={() => setShowAddModal(true)}
              >
                + Add First Hostel
              </button>
            </div>
          ) : (
            <div style={styles.hostelGrid}>
              <div
                style={styles.addHostelCard}
                onClick={() => setShowAddModal(true)}
              >
                <div
                  style={{
                    width: "38px",
                    height: "38px",
                    display: "grid",
                    placeItems: "center",
                    border: "1px dotted #cbd6ea",
                    borderRadius: "0px",
                    fontSize: "20px",
                    fontWeight: "800",
                    color: "#365ad6",
                  }}
                >
                  +
                </div>
                <div
                  style={{
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#365ad6",
                  }}
                >
                  Add Hostel
                </div>
              </div>

              {/* Hostel Cards */}
              {filteredHostels.map((hostel) => (
                <HostelCard
                  key={hostel.id}
                  hostel={hostel}
                  onViewDetails={handleViewHostelDetails}
                  onDelete={handleDeleteHostel}
                  loading={loading}
                  getDisplayValue={getDisplayValue}
                  getTypeLabel={getTypeLabel}
                />
              ))}
            </div>
          )}
        </div>

        {/* Modals */}
        <AddHostelModal
          show={showAddModal}
          onClose={handleCloseAddModal}
          onSubmit={handleAddHostel}
          formData={hostelForm}
          onFormChange={handleFormChange}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default OrganizationHostel;
