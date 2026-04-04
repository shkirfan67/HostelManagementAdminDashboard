import React from "react";
import "./room.css";

const AddRoomModal = ({ show, onClose, onSubmit, formData, onFormChange }) => {
  if (!show) return null;

  const roomTypes = [
    { value: "CLA", label: "Classic" },
    { value: "DLX", label: "Deluxe" },
    { value: "DLX-S", label: "Deluxe Suite" },
    { value: "SUP", label: "Super" }
  ];

  const sharingOptions = [1, 2, 3, 4, 5, 6];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="add-room-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Add New Room</h3>
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
          <div className="form-group">
            <label htmlFor="roomNo">Room Number *</label>
            <input
              type="number"
              id="roomNo"
              name="roomNo"
              value={formData.roomNo}
              onChange={onFormChange}
              placeholder="Enter room number (e.g., 10, 101, 201)"
              min="1"
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="sharing">Sharing *</label>
            <select
              id="sharing"
              name="sharing"
              value={formData.sharing}
              onChange={onFormChange}
              className="form-select"
              required
            >
              <option value="">Select sharing</option>
              {sharingOptions.map(num => (
                <option key={num} value={num}>{num} Sharing</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="type">Room Type *</label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={onFormChange}
              className="form-select"
              required
            >
              {roomTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div className="modal-actions">
            <button className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button 
              className="btn-submit" 
              onClick={onSubmit}
              disabled={!formData.roomNo || !formData.sharing || !formData.type}
            >
              Add Room
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddRoomModal;