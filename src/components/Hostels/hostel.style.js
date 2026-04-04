export const styles = {

  pageContainer: {
    backgroundColor: "#f5f7fb",
    minHeight: "100vh",
    fontFamily:
      "Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
    color: "#0f1b2d",
  },

  contentContainer: {
    maxWidth: "1200px",
    margin: "20px auto 80px",
    padding: "0 16px",
  },

  // Header Styles
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    margin: "14px 0 28px",
  },

  title: {
    fontSize: "24px",
    fontWeight: "700",
    margin: "14px 0 18px",
    color: "#0f1b2d",
  },

  addButton: {
    background: "#ff7e73",
    color: "#fff",
    border: "0",
    padding: "10px 16px",
    borderRadius: "6px",
    fontWeight: "700",
    cursor: "pointer",
    fontSize: "14px",
  },

  // Card Styles
  card: {
    background: "#ffffff",
    border: "1px solid #e6ebf2",
    boxShadow: "0 6px 20px rgba(7,16,27,.06)",
    padding: "22px",
    margin: "0 0 28px",
  },

  // Tab Styles
  tabContainer: {
    display: "flex",
    gap: "12px",
    margin: "8px 0 16px",
  },

  tab: (isActive) => ({
    display: "inline-flex",
    alignItems: "center",
    gap: "10px",
    background: isActive ? "#102a82" : "#f1f4fa",
    border: isActive ? "1px solid #102a82" : "1px dashed #cfd8e6",
    color: isActive ? "#fff" : "#1c2a43",
    padding: "10px 14px",
    borderRadius: "0px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
  }),

  // Stats Styles
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "16px",
    margin: "20px 0",
  },

  statCard: {
    background: "#fff",
    border: "1px solid #e6ebf2",
    borderRadius: "0px",
    padding: "18px 14px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    minHeight: "100px",
  },

  // Hostel Grid Styles
  hostelGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "16px",
  },

  hostelCard: {
    background: "#fff",
    border: "1px solid #e6ebf2",
    borderRadius: "0px",
    boxShadow: "0 6px 20px rgba(7,16,27,.06)",
    minHeight: "140px",
    padding: "18px 14px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    position: "relative",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },

  addHostelCard: {
    background: "#f9fbff",
    border: "2px dashed #cfd8e6",
    borderRadius: "0px",
    minHeight: "140px",
    padding: "18px 14px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    cursor: "pointer",
  },

  // Modal Styles
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },

  modal: {
    background: "#fff",
    border: "1px solid #e6ebf2",
    borderRadius: "0px",
    boxShadow: "0 6px 20px rgba(7,16,27,.06)",
    width: "90%",
    maxWidth: "500px",
    maxHeight: "90vh",
    overflow: "auto",
  },

  modalHeader: {
    background: "#102a82",
    color: "#fff",
    padding: "16px 20px",
    borderBottom: "1px solid #e6ebf2",
  },

  modalContent: {
    padding: "20px",
  },

  // Form Styles
  formGrid: {
    display: "grid",
    gap: "12px",
  },

  formRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px",
  },

  input: {
    width: "100%",
    padding: "8px 12px",
    border: "1px solid #e6ebf2",
    borderRadius: "0px",
    fontSize: "14px",
  },

  textarea: {
    width: "100%",
    padding: "8px 12px",
    border: "1px solid #e6ebf2",
    borderRadius: "0px",
    fontSize: "14px",
    minHeight: "60px",
    resize: "vertical",
  },

  select: {
    width: "100%",
    padding: "8px 12px",
    border: "1px solid #e6ebf2",
    borderRadius: "0px",
    fontSize: "14px",
  },

  // Button Styles
  buttonGroup: {
    display: "flex",
    gap: "12px",
    justifyContent: "flex-end",
    marginTop: "20px",
    paddingTop: "16px",
    borderTop: "1px solid #e6ebf2",
  },

  cancelButton: {
    background: "none",
    border: "1px solid #e6ebf2",
    padding: "8px 16px",
    borderRadius: "0px",
    fontSize: "14px",
    fontWeight: "600",
    color: "#5b6b7f",
    cursor: "pointer",
  },

  submitButton: {
    background: "#ff7e73",
    color: "#fff",
    border: "0",
    padding: "8px 16px",
    borderRadius: "0px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
  },

  closeButton: {
    background: "#102a82",
    color: "#fff",
    border: "0",
    padding: "8px 16px",
    borderRadius: "0px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
  },

  deleteButton: {
    position: "absolute",
    top: "10px",
    right: "10px",
    background: "none",
    border: "1px solid #e6ebf2",
    width: "24px",
    height: "24px",
    display: "grid",
    placeItems: "center",
    cursor: "pointer",
    color: "#f40101ff",
    fontSize: "12px",
  },

  // Loading Styles
  loadingSpinner: {
    width: "3rem",
    height: "3rem",
    border: "4px solid #183bff",
    borderRightColor: "transparent",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    margin: "0 auto",
  },

  // Error Styles
  errorAlert: {
    background: "#fee",
    border: "1px solid #fcc",
    color: "#c00",
    padding: "12px 16px",
    margin: "0 0 20px",
    borderRadius: "0px",
    fontSize: "14px",
  },

  // Empty State Styles
  emptyState: {
    textAlign: "center",
    padding: "40px 20px",
  },
  infoButton: {
    position: "absolute",
    bottom: "10px",
    right: "10px",
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    width: "28px",
    height: "28px",
    display: "grid",
    placeItems: "center",
    cursor: "pointer",
    color: "#64748b",
    fontSize: "12px",
    borderRadius: "6px",
    transition: "all 0.2s ease",
  },

  infoButtonHover: {
    background: "#f1f5f9",
    color: "#475569",
    borderColor: "#cbd5e1",
  },

  // Beautiful Modal Styles
  beautifulModalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0, 0, 0, 0.6)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    backdropFilter: "blur(4px)",
  },

  beautifulModal: {
    background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
    border: "1px solid #e2e8f0",
    borderRadius: "16px",
    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15), 0 8px 32px rgba(0, 0, 0, 0.1)",
    width: "90%",
    maxWidth: "500px",
    maxHeight: "85vh",
    overflow: "hidden",
    position: "relative",
  },

  beautifulModalHeader: {
    background: "linear-gradient(135deg, #102a82 0%, #1e40af 100%)",
    color: "#fff",
    padding: "20px 24px",
    borderBottom: "1px solid #e2e8f0",
  },

  beautifulModalContent: {
    padding: "24px",
    maxHeight: "calc(85vh - 80px)",
    overflowY: "auto",
  },

  // Detail Item Styles
  detailItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: "12px 0",
    borderBottom: "1px solid #f1f5f9",
  },

  detailLabel: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#475569",
    minWidth: "120px",
  },

  detailValue: {
    fontSize: "14px",
    color: "#0f172a",
    textAlign: "right",
    flex: 1,
    lineHeight: "1.5",
  },

  // Status Badge Styles
  statusBadge: {
    display: "inline-flex",
    alignItems: "center",
    padding: "4px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "600",
    textTransform: "capitalize",
  },

  // Close Button
  beautifulCloseButton: {
    position: "absolute",
    top: "16px",
    right: "16px",
    background: "rgba(255, 255, 255, 0.2)",
    border: "none",
    width: "32px",
    height: "32px",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    color: "#fff",
    fontSize: "18px",
    transition: "all 0.2s ease",
  },
};
