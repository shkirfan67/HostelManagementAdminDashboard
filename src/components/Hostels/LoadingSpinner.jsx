import React from 'react';
import { styles } from './hostel.style';

const LoadingSpinner = () => (
  <div style={styles.pageContainer}>
    <div className="text-center py-5">
      <div style={styles.loadingSpinner}></div>
      <p style={{ marginTop: "1rem", color: "#5b6b7f" }}>
        Loading hostels...
      </p>
    </div>
  </div>
);

export default LoadingSpinner;