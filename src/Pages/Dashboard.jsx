import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line, Doughnut } from "react-chartjs-2";
import { useDispatch, useSelector } from "react-redux";
import { fetchHostels } from "../features/hostelSlice";
import { getBuildingsByHostelId } from "../features/buildingSlice";
import { getAllRooms } from "../features/roomSlice";
import { getAllBeds } from "../features/bedSlice";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const dispatch = useDispatch();
  const { hostels, loading: hostelsLoading } = useSelector((state) => state.hostel);
  const { rooms, loading: roomsLoading } = useSelector((state) => state.room);
  const { beds, loading: bedsLoading } = useSelector((state) => state.bed);

  const [dashboardBuildings, setDashboardBuildings] = useState([]);
  const [occupancyHistory, setOccupancyHistory] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null);

  const hostelsList = Array.isArray(hostels) ? hostels : [];
  const roomsList = Array.isArray(rooms) ? rooms : [];
  const bedsList = Array.isArray(beds) ? beds : [];

  const refreshDashboardData = useCallback(async () => {
    try {
      const [hostelsPayload] = await Promise.all([
        dispatch(fetchHostels()).unwrap(),
        dispatch(getAllRooms()).unwrap(),
        dispatch(getAllBeds()).unwrap(),
      ]);

      if (Array.isArray(hostelsPayload) && hostelsPayload.length > 0) {
        const buildingLists = await Promise.all(
          hostelsPayload.map((hostel) =>
            dispatch(getBuildingsByHostelId(hostel.id))
              .unwrap()
              .catch(() => [])
          )
        );
        setDashboardBuildings(buildingLists.flat());
      } else {
        setDashboardBuildings([]);
      }
    } catch (error) {
      console.error("Dashboard refresh failed:", error);
    } finally {
      setLastUpdated(new Date());
    }
  }, [dispatch]);

  useEffect(() => {
    refreshDashboardData();
  }, [refreshDashboardData]);

  useEffect(() => {
    const interval = setInterval(refreshDashboardData, 30000);
    return () => clearInterval(interval);
  }, [refreshDashboardData]);

  const bedSummary = useMemo(() => {
    const students = new Set();
    let revenue = 0;
    let occupied = 0;
    let available = 0;
    let maintenance = 0;
    let other = 0;

    bedsList.forEach((bed) => {
      const status = (bed.status || "VACANT").toUpperCase();
      const hasStudent = Boolean(bed.student);
      if (hasStudent) {
        students.add(bed.student);
      }

      if (hasStudent || status === "OCCUPIED") {
        occupied += 1;
      } else if (["VACANT", "AVAILABLE"].includes(status)) {
        available += 1;
      } else if (status.includes("MAINTENANCE")) {
        maintenance += 1;
      } else {
        other += 1;
      }

      if (hasStudent || status === "OCCUPIED") {
        revenue += Number(bed.price) || 0;
      }
    });

    return {
      totalBeds: bedsList.length,
      occupied,
      available,
      maintenance,
      other,
      revenue,
      studentCount: students.size,
    };
  }, [bedsList]);

  const occupancyRate = bedSummary.totalBeds
    ? Math.round((bedSummary.occupied / bedSummary.totalBeds) * 100)
    : 0;

  useEffect(() => {
    setOccupancyHistory((prev) => {
      const next = [...prev, occupancyRate].slice(-6);
      if (prev.length && prev[prev.length - 1] === occupancyRate) {
        return prev.length === next.length ? prev : next;
      }
      return next;
    });
  }, [occupancyRate]);

  const occupancyChartData = useMemo(() => {
    const history = occupancyHistory.length ? occupancyHistory : [occupancyRate];
    return {
      labels: history.map((_, index) => `T-${history.length - index}`),
      datasets: [
        {
          label: "Occupancy Rate (%)",
          data: history,
          borderColor: "rgb(75, 192, 192)",
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          tension: 0.4,
          fill: true,
          borderWidth: 2,
        },
      ],
    };
  }, [occupancyHistory, occupancyRate]);

  const chartOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "top",
          labels: {
            boxWidth: 12,
            font: { size: 11 },
          },
        },
        title: {
          display: true,
          text: "Occupancy Trends",
          font: { size: 14 },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          ticks: {
            callback: (value) => `${value}%`,
          },
        },
      },
    }),
    []
  );

  const roomDistributionData = useMemo(() => {
    const statusBuckets = [
      { label: "Occupied", value: bedSummary.occupied, color: "rgba(59, 130, 246, 0.8)" },
      { label: "Available", value: bedSummary.available, color: "rgba(16, 185, 129, 0.8)" },
      { label: "Maintenance", value: bedSummary.maintenance, color: "rgba(253, 186, 116, 0.8)" },
      { label: "Other", value: bedSummary.other, color: "rgba(147, 197, 253, 0.8)" },
    ];

    return {
      labels: statusBuckets.map((status) => status.label),
      datasets: [
        {
          data: statusBuckets.map((status) => status.value),
          backgroundColor: statusBuckets.map((status) => status.color),
          borderColor: statusBuckets.map((status) => status.color.replace("0.8", "1")),
          borderWidth: 1,
        },
      ],
    };
  }, [bedSummary]);

  const roomDistributionOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: "bottom", labels: { boxWidth: 12 } },
        title: {
          display: true,
          text: "Bed Status Snapshot",
          font: { size: 14 },
        },
      },
    }),
    []
  );

  const recentAssignments = useMemo(
    () =>
      bedsList
        .filter((bed) => bed.student)
        .slice(-4)
        .reverse()
        .map((bed) => ({
          id: bed.id,
          student: bed.student,
          bedNo: bed.bedNo || `Bed ${bed.id}`,
          status: bed.status || "Occupied",
          price: Number(bed.price) || 0,
        })),
    [bedsList]
  );

  const uniqueBuildings = useMemo(() => {
    const ids = new Set(dashboardBuildings.map((building) => building.id));
    return ids.size;
  }, [dashboardBuildings]);

  const isRefreshing = hostelsLoading || roomsLoading || bedsLoading;

  const quickActions = [
    { title: "Add Booking", icon: "➕", link: "/bookings/add" },
    { title: "Manage Rooms", icon: "🛏️", link: "/rooms" },
    { title: "View Payments", icon: "💰", link: "/payments" },
    { title: "Maintenance", icon: "🛠️", link: "/maintenance" },
  ];

  return (
    <div className="container-fluid py-3 py-md-4 overflow-hidden">
      <div className="row mb-3 mb-md-4 align-items-end">
        <div className="col-12 col-md-8">
          <div className="d-flex flex-column gap-1">
            <div className="d-flex justify-content-between align-items-start gap-3">
              <div>
                <h1 className="h4 h3-md fw-bold text-dark mb-1">
                  Hostel Management Dashboard
                </h1>
                <p className="text-muted mb-0 small small-md">
                  Real-time view refreshed every 30 seconds
                </p>
              </div>
              <button
                className="btn btn-sm btn-outline-primary"
                onClick={refreshDashboardData}
                disabled={isRefreshing}
              >
                {isRefreshing ? "Syncing..." : "Sync Now"}
              </button>
            </div>
            <div className="d-flex flex-wrap gap-3 small text-muted">
              <span>Hostels monitored: {hostelsList.length}</span>
              <span>Buildings: {uniqueBuildings}</span>
              <span>Rooms tracked: {roomsList.length}</span>
              <span>Active students: {bedSummary.studentCount}</span>
              <span>Open beds: {bedSummary.available}</span>
              <span>
                Last synced:{" "}
                {lastUpdated
                  ? lastUpdated.toLocaleTimeString(undefined, {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "pending"}
              </span>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-4 text-md-end mt-2 mt-md-0">
          <div className="bg-primary rounded-circle p-2 p-md-3 d-inline-flex">
            <i className="fas fa-home text-white fs-6 fs-md-5"></i>
          </div>
        </div>
      </div>

      <div className="row g-2 g-md-3 mb-3 mb-md-4">
        {[
          {
            title: "Total Hostels",
            value: hostelsList.length,
            color: "primary",
            icon: "fa-building",
            subtitle: "Across all registered hostels",
          },
          {
            title: "Total Buildings",
            value: uniqueBuildings,
            color: "info",
            icon: "fa-city",
            subtitle: "Grouped by hostel",
          },
          {
            title: "Occupancy Rate",
            value: `${occupancyRate}%`,
            color: "success",
            icon: "fa-chart-line",
            subtitle: `${bedSummary.occupied}/${bedSummary.totalBeds || 0} occupied`,
          },
          {
            title: "Revenue Estimate",
            value: `₹${bedSummary.revenue.toLocaleString()}`,
            color: "warning",
            icon: "fa-dollar-sign",
            subtitle: "Summed for occupied beds",
          },
        ].map((metric, index) => (
          <div key={index} className="col-6 col-md-3">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body p-2 p-md-3">
                <div className="d-flex justify-content-between align-items-start">
                  <div className="flex-grow-1">
                    <h6 className="card-title text-muted mb-1 small">{metric.title}</h6>
                    <h4 className="fw-bold text-dark mb-1">{metric.value}</h4>
                    <small className="text-muted">{metric.subtitle}</small>
                  </div>
                  <div className={`bg-${metric.color} bg-opacity-10 rounded-circle p-2 ms-2`}>
                    <i className={`fas ${metric.icon} text-${metric.color} fs-6`}></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-2 g-md-3 mb-3 mb-md-4">
        <div className="col-12 col-lg-8">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white py-2 py-md-3">
              <h5 className="mb-0 fw-semibold small small-md">Occupancy Trends</h5>
            </div>
            <div className="card-body p-2 p-md-3">
              <div className="chart-container" style={{ height: "250px", minHeight: "200px" }}>
                <Line data={occupancyChartData} options={chartOptions} />
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white py-2 py-md-3">
              <h5 className="mb-0 fw-semibold small small-md">Bed Status</h5>
            </div>
            <div className="card-body p-2 p-md-3 d-flex align-items-center">
              <div className="chart-container w-100" style={{ height: "250px", minHeight: "200px" }}>
                <Doughnut data={roomDistributionData} options={roomDistributionOptions} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-2 g-md-3">
        <div className="col-12 col-lg-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white py-2 py-md-3">
              <h5 className="mb-0 fw-semibold small small-md">Quick Actions</h5>
            </div>
            <div className="card-body p-2 p-md-3">
              <div className="row g-2">
                {quickActions.map((action, index) => (
                  <div className="col-6" key={index}>
                    <button className="btn btn-outline-primary w-100 h-100 p-2 p-md-3 d-flex flex-column align-items-center">
                      <span className="fs-5 fs-md-4 mb-1">{action.icon}</span>
                      <small className="fw-semibold text-center">{action.title}</small>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-8">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white py-2 py-md-3 d-flex justify-content-between align-items-center">
              <h5 className="mb-0 fw-semibold small small-md">Recent Bed Assignments</h5>
              <button className="btn btn-sm btn-outline-primary">View All</button>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="table-light">
                    <tr>
                      <th className="small py-2">Student</th>
                      <th className="small py-2">Bed</th>
                      <th className="small py-2">Status</th>
                      <th className="small py-2">Price</th>
                      <th className="small py-2">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentAssignments.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="text-center text-muted py-3">
                          No student assignments yet
                        </td>
                      </tr>
                    ) : (
                      recentAssignments.map((assignment) => (
                        <tr key={assignment.id}>
                          <td className="py-2">
                            <div className="d-flex align-items-center">
                              <div
                                className="bg-light rounded-circle d-flex align-items-center justify-content-center me-2"
                                style={{ width: "32px", height: "32px" }}
                              >
                                <i className="fas fa-user text-muted small"></i>
                              </div>
                              <span className="small">{assignment.student}</span>
                            </div>
                          </td>
                          <td className="small py-2">{assignment.bedNo}</td>
                          <td className="py-2">
                            <span
                              className={`badge ${
                                assignment.status.toLowerCase() === "occupied"
                                  ? "bg-success"
                                  : "bg-secondary"
                              } small`}
                            >
                              {assignment.status}
                            </span>
                          </td>
                          <td className="small py-2">₹{assignment.price.toLocaleString()}</td>
                          <td className="py-2">
                            <button className="btn btn-sm btn-outline-primary small">
                              <i className="fas fa-eye me-1"></i>
                              View
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
