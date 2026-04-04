import React from 'react';
import { styles } from './hostel.style';

const AddHostelModal = ({ 
  show, 
  onClose, 
  onSubmit, 
  formData, 
  onFormChange, 
  loading 
}) => {
  if (!show) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(e);
  };

  const getImageSuggestions = (type) => {
    const suggestions = {
      'boys hostel': [
        'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=500&q=60',
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=500&q=60'
      ],
      'girls hostel': [
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=500&q=60',
        'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=500&q=60'
      ],
      'co-ed hostel': [
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=500&q=60',
        'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=500&q=60'
      ]
    };
    return suggestions[type] || [];
  };

  const imageSuggestions = getImageSuggestions(formData.type);

  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modal}>
        <div style={styles.modalHeader}>
          <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "700" }}>Add New Hostel</h3>
        </div>

        <div style={styles.modalContent}>
          <form onSubmit={handleSubmit}>
            <div style={styles.formGrid}>
              {/* Name, Email, Contact */}
              <div>
                <label>Hostel Name *</label>
                <input
                  type="text"
                  style={styles.input}
                  value={formData.name}
                  onChange={(e) => onFormChange('name', e.target.value)}
                  required
                />
              </div>

              <div style={styles.formRow}>
                <div>
                  <label>Email *</label>
                  <input
                    type="email"
                    style={styles.input}
                    value={formData.email}
                    onChange={(e) => onFormChange('email', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label>Contact Number *</label>
                  <input
                    type="text"
                    style={styles.input}
                    value={formData.contactNumber}
                    onChange={(e) => onFormChange('contactNumber', e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Type, Capacity */}
              <div style={styles.formRow}>
                <div>
                  <label>Type *</label>
                  <select
                    style={styles.select}
                    value={formData.type}
                    onChange={(e) => onFormChange('type', e.target.value)}
                  >
                    <option value="boys hostel">Boys Hostel</option>
                    <option value="girls hostel">Girls Hostel</option>
                    <option value="co-ed hostel">Co-ed Hostel</option>
                  </select>
                </div>
                <div>
                  <label>Capacity *</label>
                  <input
                    type="number"
                    style={styles.input}
                    value={formData.capacity}
                    onChange={(e) => onFormChange('capacity', e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Website, Image */}
              <div style={styles.formRow}>
                <div>
                  <label>Website</label>
                  <input
                    type="url"
                    style={styles.input}
                    value={formData.website}
                    onChange={(e) => onFormChange('website', e.target.value)}
                  />
                </div>
                <div>
                  <label>Image URL</label>
                  <input
                    type="text"
                    style={styles.input}
                    value={formData.image}
                    onChange={(e) => onFormChange('image', e.target.value)}
                  />
                  <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                    {imageSuggestions.map((img, i) => (
                      <img
                        key={i}
                        src={img}
                        alt={`suggestion-${i}`}
                        style={{
                          width: '80px',
                          height: '60px',
                          cursor: 'pointer',
                          border: formData.image === img ? '3px solid #102a82' : '2px solid #e6ebf2',
                          borderRadius: '6px',
                          objectFit: 'cover'
                        }}
                        onClick={() => onFormChange('image', img)}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Address fields */}
              <div style={styles.formRow}>
                <div>
                  <label>Area *</label>
                  <input
                    type="text"
                    style={styles.input}
                    value={formData.address.area}
                    onChange={(e) => onFormChange('address', { ...formData.address, area: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label>City *</label>
                  <input
                    type="text"
                    style={styles.input}
                    value={formData.address.city}
                    onChange={(e) => onFormChange('address', { ...formData.address, city: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div style={styles.formRow}>
                <div>
                  <label>Zip Code *</label>
                  <input
                    type="number"
                    style={styles.input}
                    value={formData.address.zipCode}
                    onChange={(e) => onFormChange('address', { ...formData.address, zipCode: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label>State *</label>
                  <input
                    type="text"
                    style={styles.input}
                    value={formData.address.state}
                    onChange={(e) => onFormChange('address', { ...formData.address, state: e.target.value })}
                    required
                  />
                </div>
              </div>

              {/* Latitude & Longitude */}
              <div style={styles.formRow}>
                <div>
                  <label>Latitude</label>
                  <input
                    type="number"
                    style={styles.input}
                    value={formData.latitude}
                    onChange={(e) => onFormChange('latitude', e.target.value)}
                  />
                </div>
                <div>
                  <label>Longitude</label>
                  <input
                    type="number"
                    style={styles.input}
                    value={formData.longitude}
                    onChange={(e) => onFormChange('longitude', e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div style={styles.buttonGroup}>
              <button type="button" style={styles.cancelButton} onClick={onClose}>Cancel</button>
              <button type="submit" style={styles.submitButton} disabled={loading}>
                {loading ? "Adding..." : "Add Hostel"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddHostelModal;
