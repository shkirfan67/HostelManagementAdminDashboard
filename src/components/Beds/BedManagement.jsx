import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getBedsByRoomId,
  addBedByRoomId,
  deleteBedById,
} from "../../features/bedSlice";

import "./bed.css";
const BedManagementModal = ({ show, onClose, room, onUpdate }) => {
  const dispatch = useDispatch();
  const { beds, loading } = useSelector((state) => state.bed);
  const [showAddForm, setShowAddForm] = useState(false);
  const [bedForm, setBedForm] = useState({
    bedNo: "",
    status: "VACANT",
    price: "",
    deposit: "",
  });

  // Load beds when room changes
  useEffect(() => {
    if (room?.id) {
      console.log(`Loading beds for room ${room.id}`);
      dispatch(getBedsByRoomId(room.id));
    }
  }, [dispatch, room]);

  // Add bed (backend)
  const handleAddBed = async (e) => {
    e.preventDefault();

    if (!room?.id) {
      alert("Room ID not found");
      return;
    }

    if (!bedForm.bedNo.trim()) {
      alert("Please enter bed number");
      return;
    }

    const bedData = {
      bedNo: bedForm.bedNo.trim(),
      status: bedForm.status,
      price: bedForm.price ? parseInt(bedForm.price) : 0,
      deposit: bedForm.deposit ? parseInt(bedForm.deposit) : 0,
    };

    console.log("Adding bed with data:", bedData);

    try {
      await dispatch(addBedByRoomId({ roomId: room.id, bedData })).unwrap();

      // Refresh beds list
      dispatch(getBedsByRoomId(room.id));

      // Reset form and close add form
      setBedForm({ bedNo: "", status: "VACANT", price: "", deposit: "" });
      setShowAddForm(false);

      // Notify parent component to refresh rooms
      if (onUpdate) onUpdate();

      alert("Bed added successfully!");
    } catch (err) {
      console.error("Add bed failed:", err);
      alert("Failed to add bed: " + (err.message || "Unknown error"));
    }
  };

  // Delete bed
  const handleDeleteBed = async (bedId) => {
    if (!window.confirm("Are you sure you want to delete this bed?")) return;

    try {
      await dispatch(deleteBedById(bedId)).unwrap();

      // Refresh beds list
      dispatch(getBedsByRoomId(room.id));

      // Notify parent component to refresh rooms
      if (onUpdate) onUpdate();

      alert("Bed deleted successfully!");
    } catch (err) {
      console.error("Delete bed failed:", err);
      alert("Failed to delete bed: " + (err.message || "Unknown error"));
    }
  };

  // Status color helper - MATCHING YOUR ORIGINAL DESIGN
  const getStatusColor = (status) => {
    if (!status) return "#6b7280";

    const statusUpper = status.toUpperCase();
    switch (statusUpper) {
      case "VACANT":
      case "AVAILABLE":
        return "#10b981"; // green - same as your "available"
      case "OCCUPIED":
        return "#ef4444"; // red - same as your "occupied"
      case "MAINTENANCE":
      case "UNDER_MAINTENANCE":
        return "#f59e0b"; // orange - same as your "maintenance"
      default:
        return "#6b7280"; // gray
    }
  };

  // Get status text - MATCHING YOUR ORIGINAL FORMAT
  const getStatusText = (status) => {
    if (!status) return "Unknown";
    const statusUpper = status.toUpperCase();
    switch (statusUpper) {
      case "VACANT":
        return "Available"; // Map "VACANT" to "Available" for display
      case "OCCUPIED":
        return "Occupied";
      case "MAINTENANCE":
        return "Maintenance";
      default:
        return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
    }
  };

  // Get bed status for select dropdown
  const getBedStatus = (status) => {
    const statusUpper = status?.toUpperCase() || "";
    switch (statusUpper) {
      case "AVAILABLE":
        return "VACANT";
      case "OCCUPIED":
        return "OCCUPIED";
      case "MAINTENANCE":
        return "MAINTENANCE";
      default:
        return status || "VACANT";
    }
  };

  if (!show || !room) return null;

  return (
    <div className="modal-overlay">
      <div className="bed-management-modal small-modal">
        <div className="modal-header">
          <h3>Room {room.number} - Bed Management</h3>
          <button className="close-btn" onClick={onClose}>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="modal-content">
          {/* Add Bed Button */}
          <div className="add-bed-button-section">
            <button
              className="btn-add-bed"
              onClick={() => setShowAddForm(!showAddForm)}
            >
              {showAddForm ? "Cancel Add Bed" : "+ Add New Bed"}
            </button>
          </div>

          {/* Add Bed Form (Collapsible) */}
          {showAddForm && (
            <div className="add-bed-form-small">
              <h4>Add New Bed</h4>
              <form onSubmit={handleAddBed} className="compact-form">
                <div className="form-row-compact">
                  <div className="form-group-compact">
                    <label>Bed Number *</label>
                    <input
                      type="text"
                      value={bedForm.bedNo}
                      onChange={(e) =>
                        setBedForm({ ...bedForm, bedNo: e.target.value })
                      }
                      placeholder="E.g., A, B, 1, 2"
                      required
                      className="small-input"
                    />
                  </div>

                  <div className="form-group-compact">
                    <label>Status</label>
                    <select
                      value={bedForm.status}
                      onChange={(e) =>
                        setBedForm({ ...bedForm, status: e.target.value })
                      }
                      className="small-select"
                    >
                      <option value="VACANT">Available</option>
                      <option value="OCCUPIED">Occupied</option>
                      <option value="MAINTENANCE">Maintenance</option>
                    </select>
                  </div>
                </div>

                <div className="form-row-compact">
                  <div className="form-group-compact">
                    <label>Price (₹)</label>
                    <input
                      type="number"
                      value={bedForm.price}
                      onChange={(e) =>
                        setBedForm({ ...bedForm, price: e.target.value })
                      }
                      placeholder="Price"
                      min="0"
                      className="small-input"
                    />
                  </div>

                  <div className="form-group-compact">
                    <label>Deposit (₹)</label>
                    <input
                      type="number"
                      value={bedForm.deposit}
                      onChange={(e) =>
                        setBedForm({ ...bedForm, deposit: e.target.value })
                      }
                      placeholder="Deposit"
                      min="0"
                      className="small-input"
                    />
                  </div>
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn-primary-small">
                    Add Bed
                  </button>
                  <button
                    type="button"
                    className="btn-secondary-small"
                    onClick={() => setShowAddForm(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="beds-list-small">
            <h4 className="beds-title">Beds ({beds.length})</h4>
            {!loading && beds.length === 0 && (
              <div className="no-beds-small">No beds found for this room</div>
            )}
            
            <div className="beds-grid-original">
              {/* Add Bed Card (First Card) */}
              <div
                className="add-bed-card"
                onClick={() => setShowAddForm(!showAddForm)}
              >
                <div className="add-bed-content">
                  <div className="add-bed-icon">+</div>
                  <div className="add-bed-text">
                    {showAddForm ? "Cancel Add Bed" : "Add New Bed"}
                  </div>
                </div>
              </div>

              {/* Existing Bed Cards */}
              {beds.map((bed) => (
                <div key={bed.id} className="bed-card-original">
                  <div className="bed-header-original">
                    <span className="bed-number-original">Bed {bed.bedNo}</span>
                    <span
                      className="bed-status-original"
                      style={{ backgroundColor: getStatusColor(bed.status) }}
                    >
                      {getStatusText(bed.status)}
                    </span>
                  </div>

                  <div className="bed-info-original">
                    {bed.student ? (
                      <div className="student-info-original">
                        <div className="student-name-original">
                          {bed.student}
                        </div>
                        <div className="student-id-original">ID: {bed.id}</div>
                      </div>
                    ) : (
                      <div className="no-student-original">
                        No student assigned
                      </div>
                    )}

                    <div className="bed-details-original">
                      <div className="price-deposit">
                        <div className="price-item">
                          <span className="label-original">Price:</span>
                          <span className="value-original">
                            ₹{bed.price || 0}
                          </span>
                        </div>
                        <div className="deposit-item">
                          <span className="label-original">Deposit:</span>
                          <span className="value-original">
                            ₹{bed.deposit || 0}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bed-actions-original">
                    <select
                      value={getBedStatus(bed.status)}
                      onChange={(e) => {
                        console.log(
                          `Change bed ${bed.id} status to:`,
                          e.target.value
                        );
                      }}
                      className="status-select-original"
                    >
                      <option value="VACANT">Available</option>
                      <option value="OCCUPIED">Occupied</option>
                      <option value="MAINTENANCE">Maintenance</option>
                    </select>

                    <button
                      className="delete-btn-original"
                      onClick={() => handleDeleteBed(bed.id)}
                      title="Delete bed"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="modal-footer-small">
          <button className="btn-close-small" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default BedManagementModal;
