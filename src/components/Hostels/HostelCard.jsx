import React from 'react';
import { useNavigate } from 'react-router-dom';
import { styles } from './hostel.style';

const HostelCard = ({ 
  hostel, 
  onDelete,
  loading, 
  getDisplayValue, 
  getTypeLabel 
}) => {
  const navigate = useNavigate();

  const handleViewHostelDetails = () => {
    navigate(`/hostel/${hostel.id}/building-management`);
  };

  // Default images logic
  const getDefaultImage = (hostelType, hostelId) => {
    const boysHostelImages = [
      'https://images.unsplash.com/photo-1562774053-701939374585',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7',
      'https://images.unsplash.com/photo-1620336655055-bd87b6a88b7c',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427',
      'https://images.unsplash.com/photo-1555854877-bab0e564b8d5'
    ];

    const girlsHostelImages = [
      'https://images.unsplash.com/photo-1555854877-bab0e564b8d5',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2',
      'https://images.unsplash.com/photo-1584132967334-10e028bd69f7',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945',
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461'
    ];

    const coedHostelImages = [
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7',
      'https://images.unsplash.com/photo-1562774053-701939374585',
      'https://images.unsplash.com/photo-1620336655055-bd87b6a88b7c',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427',
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461'
    ];

    let imageArray;
    switch (hostelType) {
      case 'boys hostel':
        imageArray = boysHostelImages;
        break;
      case 'girls hostel':
        imageArray = girlsHostelImages;
        break;
      case 'co-ed hostel':
        imageArray = coedHostelImages;
        break;
      default:
        imageArray = coedHostelImages;
    }

    const imageIndex = (hostelId || 0) % imageArray.length;
    return imageArray[imageIndex];
  };

  const displayImage = getDisplayValue(hostel, "image") !== "N/A"
    ? getDisplayValue(hostel, "image")
    : getDefaultImage(getDisplayValue(hostel, "type"), hostel.id);

  return (
    <div
      style={styles.hostelCard}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = "0 8px 25px rgba(0,0,0,0.1)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 6px 20px rgba(7,16,27,.06)";
      }}
      onClick={handleViewHostelDetails}
    >
      {/* Delete Button Only */} 
      <button
        style={styles.deleteButton}
        onClick={(e) => {
          e.stopPropagation();
          onDelete(hostel.id);
        }}
        disabled={loading}
      >
        ×
      </button>

      {/* Image Preview */}
      <div style={{ ...styles.imagePreview, height: "130px" }}>
        <img
          src={displayImage}
          alt={getDisplayValue(hostel, "name")}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
          onError={(e) =>
            e.target.src = getDefaultImage(getDisplayValue(hostel, "type"), hostel.id)
          }
        />
      </div>

      <div style={{ fontSize: "12px", color: "#7a889a", marginBottom: "6px" }}>
        Hostel Name
      </div>
      <div style={{ fontSize: "18px", fontWeight: "700", color: "#0b1f66", marginBottom: "8px" }}>
        {getDisplayValue(hostel, "name")}
      </div>

      <div style={{ fontSize: "12px", color: "#7a889a", marginBottom: "4px" }}>
        {getDisplayValue(hostel, "email")}
      </div>
      <div style={{ fontSize: "12px", color: "#7a889a", marginBottom: "8px" }}>
        {getDisplayValue(hostel, "contactNumber")}
      </div>

      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center", 
        marginTop: "8px" 
      }}>
        <span style={{ 
          fontSize: "11px", 
          fontWeight: "700", 
          color: "#7a889a", 
          textTransform: "uppercase" 
        }}>
          {getTypeLabel(getDisplayValue(hostel, "type"))}
        </span>
        <span style={{ fontSize: "11px", color: "#7a889a" }}>
          Cap: {getDisplayValue(hostel, "capacity")}
        </span>
      </div>
    </div>
  );
};

export default HostelCard;
