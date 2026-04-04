import React from 'react';
import { styles } from './hostel.style';

const HostelStats = ({ hostels, getDisplayValue }) => {

  // Normalize string: lowercase, trim, replace symbols
  const normalize = (value) => (value || "").toString().toLowerCase().replace(/[-_]/g, " ").trim();

  // Check type
  const isBoys = (type) => normalize(type).includes("boy");
  const isGirls = (type) => normalize(type).includes("girl");
  const isCoEd = (type) => normalize(type).includes("co") && normalize(type).includes("ed");

  // Calculate stats
  const stats = [
    { label: "Total Hostels", value: hostels.length },
    { label: "Boys Hostels", value: hostels.filter(h => isBoys(getDisplayValue(h, "type"))).length },
    { label: "Girls Hostels", value: hostels.filter(h => isGirls(getDisplayValue(h, "type"))).length },
    { label: "Co-ed Hostels", value: hostels.filter(h => isCoEd(getDisplayValue(h, "type"))).length },
  ];

  return (
    <div style={styles.statsGrid}>
      {stats.map((stat, index) => (
        <div key={index} style={styles.statCard}>
          <div style={{ fontSize: "12px", color: "#7a889a", marginBottom: "6px" }}>
            {stat.label}
          </div>
          <div style={{ fontSize: "24px", fontWeight: "700", color: "#0b1f66" }}>
            {stat.value}
          </div>
        </div>
      ))}
    </div>
  );
};

export default HostelStats;
