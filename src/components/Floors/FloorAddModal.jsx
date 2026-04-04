
import React, { useState } from "react";
import "./floor.css";

const FloorAddModal = ({ 
  show, 
  onClose, 
  onSubmit, 
  formData, 
  onFormChange,
  loading = false,
  error = null,
  success = false
}) => {
  const [localErrors, setLocalErrors] = useState({});
  
  if (!show) return null;

  const validateForm = () => {
    const errors = {};
    
    if (!formData.floorNo || formData.floorNo < 0) {
      errors.floorNo = "Please enter a valid floor number";
    }
    
    if (!formData.roomCount || formData.roomCount < 1) {
      errors.roomCount = "Room count must be at least 1";
    }
    
    if (formData.roomCount > 50) {
      errors.roomCount = "Maximum 50 rooms per floor allowed";
    }
    
    setLocalErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit();
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const parsedValue = name === 'floorNo' || name === 'roomCount' 
      ? parseInt(value, 10) || ''
      : value;
    
    onFormChange({
      target: {
        name,
        value: parsedValue
      }
    });
    
    if (localErrors[name]) {
      setLocalErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  return (
    <div className="modal-overlay">
      <div className="floor-add-modal">
        <div className="modal-header">
          <h3>Add New Floor</h3>
          <button className="modal-close" onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {error && (
          <div className="error-message">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 8v4M12 16h.01"/>
            </svg>
            {error}
          </div>
        )}
        
        {success && (
          <div className="success-message">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
            Floor added successfully!
          </div>
        )}

        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Floor Number *</label>
              <input
                type="number"
                name="floorNo"
                value={formData.floorNo}
                onChange={handleInputChange}
                placeholder="Enter floor number"
                className={`form-control ${localErrors.floorNo ? 'error' : ''}`}
                min="0"
                max="50"
                disabled={loading}
              />
              {localErrors.floorNo && (
                <span className="field-error">{localErrors.floorNo}</span>
              )}
            </div>

            <div className="form-group">
              <label>Room Count *</label>
              <input
                type="number"
                name="roomCount"
                value={formData.roomCount}
                onChange={handleInputChange}
                placeholder="Enter number of rooms"
                className={`form-control ${localErrors.roomCount ? 'error' : ''}`}
                min="1"
                max="50"
                disabled={loading}
              />
              {localErrors.roomCount && (
                <span className="field-error">{localErrors.roomCount}</span>
              )}
              <div className="form-hint">
                Enter total number of rooms on this floor
              </div>
            </div>

            <div className="modal-footer">
              <button 
                type="button" 
                className="btn-secondary" 
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="loading-spinner"></span>
                    Adding...
                  </>
                ) : 'Add Floor'}
              </button>
            </div>
          </form>
          
          <div className="modal-note">
            <strong>Note:</strong> Adding a floor will automatically create rooms based on the count specified. Each room will be assigned a sequential number.
          </div>
        </div>
      </div>
    </div>
  );
};

export default FloorAddModal;