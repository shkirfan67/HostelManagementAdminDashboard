import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Line, Doughnut } from "react-chartjs-2";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  // Sample data - replace with actual API data
  const dashboardData = {
    overview: {
      totalHostels: 5,
      totalBuildings: 12,
      totalRooms: 156,
      totalStudents: 142,
      occupancyRate: 91,
      revenue: 125400,
      pendingRequests: 8,
      maintenanceIssues: 3
    },
    recentBookings: [
      { id: 1, student: "John Doe", room: "A-101", date: "2024-01-15", status: "Active" },
      { id: 2, student: "Jane Smith", room: "B-205", date: "2024-01-14", status: "Pending" },
      { id: 3, student: "Mike Johnson", room: "C-102", date: "2024-01-13", status: "Active" },
      { id: 4, student: "Sarah Wilson", room: "A-201", date: "2024-01-12", status: "Active" }
    ],
    quickActions: [
      { title: "Add Booking", icon: "➕", link: "/bookings/add" },
      { title: "Manage Rooms", icon: "🏠", link: "/rooms" },
      { title: "View Payments", icon: "💰", link: "/payments" },
      { title: "Maintenance", icon: "🔧", link: "/maintenance" }
    ]
  };

  // Chart data and options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          boxWidth: 12,
          font: {
            size: 11
          }
        }
      },
    },
  };

  const occupancyChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Occupancy Rate (%)',
        data: [85, 82, 88, 90, 87, 91],
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.1)',
        tension: 0.4,
        fill: true,
        borderWidth: 2,
      },
    ],
  };

  const occupancyChartOptions = {
    ...chartOptions,
    plugins: {
      ...chartOptions.plugins,
      title: {
        display: true,
        text: 'Occupancy Trends',
        font: {
          size: 14
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: function(value) {
            return value + '%';
          }
        }
      },
    },
  };

  
  const roomDistributionData = {
    labels: ['Single', 'Double', 'Suite', 'Dorm'],
    datasets: [
      {
        data: [45, 68, 25, 18],
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 206, 86, 0.8)',
          'rgba(75, 192, 192, 0.8)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const roomDistributionOptions = {
    ...chartOptions,
    plugins: {
      ...chartOptions.plugins,
      title: {
        display: true,
        text: 'Room Distribution',
        font: {
          size: 14
        }
      },
    },
  };

  return (
    <div className="container-fluid py-3 py-md-4 overflow-hidden">
      {/* Header */}
      <div className="row mb-3 mb-md-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="h4 h3-md fw-bold text-dark mb-1">Hostel Management Dashboard</h1>
              <p className="text-muted mb-0 small small-md">Welcome to your administration panel</p>
            </div>
            <div className="bg-primary rounded-circle p-2 p-md-3 d-none d-sm-block">
              <i className="fas fa-home text-white fs-6 fs-md-5"></i>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics - Responsive Grid */}
      <div className="row g-2 g-md-3 mb-3 mb-md-4">
        {[
          { 
            title: "Total Hostels", 
            value: dashboardData.overview.totalHostels, 
            color: "primary",
            icon: "fa-building",
            subtitle: "Across all locations"
          },
          { 
            title: "Occupancy Rate", 
            value: `${dashboardData.overview.occupancyRate}%`, 
            color: "success",
            icon: "fa-chart-line",
            subtitle: `${dashboardData.overview.totalStudents} / ${dashboardData.overview.totalRooms} occupied`
          },
          { 
            title: "Total Revenue", 
            value: `$${dashboardData.overview.revenue.toLocaleString()}`, 
            color: "info",
            icon: "fa-dollar-sign",
            subtitle: "This month"
          },
          { 
            title: "Pending Requests", 
            value: dashboardData.overview.pendingRequests, 
            color: "warning",
            icon: "fa-clock",
            subtitle: "Require attention"
          }
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

      {/* Charts Section - Responsive Layout */}
      <div className="row g-2 g-md-3 mb-3 mb-md-4">
        {/* Occupancy Chart - Full width on mobile, 2/3 on desktop */}
        <div className="col-12 col-lg-8">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white py-2 py-md-3">
              <h5 className="mb-0 fw-semibold small small-md">Occupancy Trends</h5>
            </div>
            <div className="card-body p-2 p-md-3">
              <div className="chart-container" style={{ height: '250px', minHeight: '200px' }}>
                <Line 
                  data={occupancyChartData} 
                  options={occupancyChartOptions}
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Room Distribution - Full width on mobile, 1/3 on desktop */}
        <div className="col-12 col-lg-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white py-2 py-md-3">
              <h5 className="mb-0 fw-semibold small small-md">Room Distribution</h5>
            </div>
            <div className="card-body p-2 p-md-3 d-flex align-items-center">
              <div className="chart-container w-100" style={{ height: '250px', minHeight: '200px' }}>
                <Doughnut 
                  data={roomDistributionData} 
                  options={roomDistributionOptions}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section - Quick Actions & Recent Bookings */}
      <div className="row g-2 g-md-3">
        {/* Quick Actions */}
        <div className="col-12 col-lg-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white py-2 py-md-3">
              <h5 className="mb-0 fw-semibold small small-md">Quick Actions</h5>
            </div>
            <div className="card-body p-2 p-md-3">
              <div className="row g-2">
                {dashboardData.quickActions.map((action, index) => (
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

        {/* Recent Bookings */}
        <div className="col-12 col-lg-8">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white py-2 py-md-3 d-flex justify-content-between align-items-center">
              <h5 className="mb-0 fw-semibold small small-md">Recent Bookings</h5>
              <button className="btn btn-sm btn-outline-primary">View All</button>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="table-light">
                    <tr>
                      <th className="small py-2">Student</th>
                      <th className="small py-2">Room</th>
                      <th className="small py-2">Date</th>
                      <th className="small py-2">Status</th>
                      <th className="small py-2">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboardData.recentBookings.map(booking => (
                      <tr key={booking.id}>
                        <td className="py-2">
                          <div className="d-flex align-items-center">
                            <div className="bg-light rounded-circle d-flex align-items-center justify-content-center me-2" style={{width: '32px', height: '32px'}}>
                              <i className="fas fa-user text-muted small"></i>
                            </div>
                            <span className="small">{booking.student}</span>
                          </div>
                        </td>
                        <td className="small py-2">{booking.room}</td>
                        <td className="small py-2">{booking.date}</td>
                        <td className="py-2">
                          <span className={`badge ${booking.status === 'Active' ? 'bg-success' : 'bg-warning'} small`}>
                            {booking.status}
                          </span>
                        </td>
                        <td className="py-2">
                          <button className="btn btn-sm btn-outline-primary small">
                            <i className="fas fa-eye me-1"></i>
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
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