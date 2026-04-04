import React from 'react';
import { styles } from './hostel.style';

const HostelTabs = ({ activeTab, onTabChange, getTypeLabel }) => {
  const tabs = ["All", "boys hostel", "girls hostel", "co-ed hostel"];

  return (
    <div style={styles.tabContainer}>
      {tabs.map((tab) => (
        <div
          key={tab}
          style={styles.tab(activeTab === tab)}
          onClick={() => onTabChange(tab)}
        >
          {tab === "All" ? "All Hostels" : getTypeLabel(tab)}
        </div>
      ))}
    </div>
  );
};

export default HostelTabs;
