// AddBuildingModal.js - Enhanced version
import React, { useState } from "react";


const AddBuildingModal = ({ show, onClose, onSubmit, formData, onFormChange }) => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  if (!show) return null;

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Building name is required";
    }
    
    if (!formData.floorCount || formData.floorCount <= 0) {
      newErrors.floorCount = "Please enter a valid floor count";
    }
    
    if (formData.wardenEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.wardenEmail)) {
      newErrors.wardenEmail = "Please enter a valid email address";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      await onSubmit();
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onFormChange(e);
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-content">
        <div className="modal-header">
          <h3>🏢 Add New Building</h3>
          <button className="close-button" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>
        
        <div className="modal-body">
          <div className="form-group">
            <label>Building Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="e.g., Main Building, Block A"
              className={errors.name ? "error" : ""}
              required
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>
          
          <div className="form-group">
            <label>Number of Floors *</label>
            <input
              type="number"
              name="floorCount"
              value={formData.floorCount}
              onChange={handleInputChange}
              placeholder="e.g., 5"
              min="1"
              max="50"
              className={errors.floorCount ? "error" : ""}
              required
            />
            {errors.floorCount && <span className="error-message">{errors.floorCount}</span>}
          </div>
          
          <div className="form-group">
            <label>Warden Name</label>
            <input
              type="text"
              name="wardenName"
              value={formData.wardenName}
              onChange={handleInputChange}
              placeholder="Enter warden's full name"
            />
          </div>
          
          <div className="form-group">
            <label>Warden Email</label>
            <input
              type="email"
              name="wardenEmail"
              value={formData.wardenEmail}
              onChange={handleInputChange}
              placeholder="warden@example.com"
              className={errors.wardenEmail ? "error" : ""}
            />
            {errors.wardenEmail && <span className="error-message">{errors.wardenEmail}</span>}
          </div>
          
          <div className="form-group">
            <label>Warden Contact No</label>
            <input
              type="tel"
              name="wardenContactNo"
              value={formData.wardenContactNo}
              onChange={handleInputChange}
              placeholder="+91 98765 43210"
            />
          </div>
        </div>
        
        <div className="modal-footer">
          <button 
            className="btn-cancel" 
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button 
            className={`btn-submit ${loading ? 'loading' : ''}`}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? '' : '🏗️ Add Building'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddBuildingModal;