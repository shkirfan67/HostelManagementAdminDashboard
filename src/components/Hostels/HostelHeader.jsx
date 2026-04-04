import React from "react";
import { styles } from "./hostel.style";

const HostelHeader = ({
  organizationName,
  onAddHostel,
  onRefresh,
  loading,
}) => (
  <div style={styles.header}>
    <h1 style={styles.title}>{organizationName || "Organization"} Hostels</h1>
    <div>
      {" "}
      <button
        style={{
          marginRight: "10px",
          border: "1px solid #e6ebf2",
          background: "#fff",
          padding: "10px 14px",
          borderRadius: "0px",
          fontSize: "14px",
          fontWeight: "600",
          color: "#0b1f66",
          cursor: "pointer",
        }}
        onClick={onRefresh}
        disabled={loading}
      >
        ↻ Refresh
      </button>
      <button style={styles.addButton} onClick={onAddHostel} disabled={loading}>
        + Add Hostel
      </button>
    </div>
  </div>
);

export default HostelHeader;
