import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { parseCookies } from "nookies";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Bar,
  Pie,
  Line
} from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  ArcElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  ArcElement
);

// Mock Data (Replace with real API calls)
const mockAnalyticsData = {
  attendance: {
    present: 85,
    absent: 5,
    late: 10,
  },
  courseProgress: {
    Math: 78,
    Science: 92,
    English: 85,
  },
  testScores: {
    "IOT Test 1": 90,
    "Python Quiz 1": 88,
    " Essay 1": 95,
  },
};

const Analytics = () => {
  const router = useRouter();
  const {
    elarniv_users_token
  } = parseCookies();
  const [user, setUser] = useState(null);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const fetchUserDataAndAnalytics = async () => {
      setLoading(true); // Start loading

      if (!elarniv_users_token) {
        router.push("/login");
        return;
      }

      // Simulate fetching user data (replace with your API call)
      // Example:
      // const userData = await fetch('/api/user').then(res => res.json());
      const userData = {
        name: "Current User",
        id: 123
      }; // Mock user data
      setUser(userData);

      // Simulate fetching analytics data (replace with your API call)
      // Example:
      // const analytics = await fetch('/api/analytics').then(res => res.json());
      const analytics = mockAnalyticsData; // Use mock data
      setAnalyticsData(analytics);
      setLoading(false); // End loading
    };

    fetchUserDataAndAnalytics();
  }, [router, elarniv_users_token]);

  // Chart Data Generation Functions
  const getAttendanceChartData = () => {
    if (!analyticsData) return null;

    return {
      labels: ["Present", "Absent", "Late"],
      datasets: [{
        label: "Attendance",
        data: [
          analyticsData.attendance.present,
          analyticsData.attendance.absent,
          analyticsData.attendance.late
        ],
        backgroundColor: ["#28a745", "#dc3545", "#ffc107"],
        borderWidth: 1,
      }, ],
    };
  };

  const getCourseProgressChartData = () => {
    if (!analyticsData) return null;

    const courses = Object.keys(analyticsData.courseProgress);
    const progressValues = Object.values(analyticsData.courseProgress);

    return {
      labels: courses,
      datasets: [{
        label: "Course Progress",
        data: progressValues,
        backgroundColor: [
          "#36A2EB",
          "#FFCE56",
          "#FF6384",
          "#4BC0C0",
          "#9966FF",
        ],
        borderWidth: 1,
      }, ],
    };
  };

  const getTestScoresChartData = () => {
    if (!analyticsData) return null;

    const testNames = Object.keys(analyticsData.testScores);
    const testValues = Object.values(analyticsData.testScores);

    return {
      labels: testNames,
      datasets: [{
        label: "Test Scores",
        data: testValues,
        backgroundColor: [
          "#36A2EB",
          "#FFCE56",
          "#FF6384",
          "#4BC0C0",
          "#9966FF",
        ],
        borderWidth: 1,
      }, ],
    };
  };

  return (
    <>
      {/* Back Button */}
      <Link href="/" passHref>
        <a className="btn btn-secondary position-absolute top-0 start-0 m-3">
          ←Back
        </a>
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mt-5"
      >
        <h2 className="text-center fw-bold">📈 Your Analytics</h2>

        {loading && (
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}

        {user && (
          <div className="text-center mb-4">
            <h4>
              Welcome, <strong className="text-primary">{user.name}</strong>!
            </h4>
            <p className="text-muted">Here's a summary of your performance.</p>
          </div>
        )}

        {analyticsData && !loading && (
          <div className="row">
            <div className="col-md-4 mb-4">
              <div className="card shadow h-100">
                <div className="card-body">
                  <h5 className="card-title text-center">📅 Attendance</h5>
                  {getAttendanceChartData() && (
                    <Bar
                      data={getAttendanceChartData()}
                      options={{
                        responsive: true,
                        plugins: {
                          legend: {
                            display: false,
                          },
                        },
                        scales: {
                          y: {
                            beginAtZero: true,
                            max: 100, // Assuming percentage
                          },
                        },
                      }}
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="col-md-4 mb-4">
              <div className="card shadow h-100">
                <div className="card-body">
                  <h5 className="card-title text-center">📚 Course Progress</h5>
                  {getCourseProgressChartData() && (
                    <Pie
                      data={getCourseProgressChartData()}
                      options={{
                        responsive: true,
                        plugins: {
                          legend: {
                            position: "bottom",
                          },
                        },
                      }}
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="col-md-4 mb-4">
              <div className="card shadow h-100">
                <div className="card-body">
                  <h5 className="card-title text-center">📝 Test Scores</h5>
                  {getTestScoresChartData() && (
                    <Line
                      data={getTestScoresChartData()}
                      options={{
                        responsive: true,
                        plugins: {
                          legend: {
                            display: false,
                          },
                        },
                        scales: {
                          y: {
                            beginAtZero: true,
                            // suggestedMax: 100,
                          },
                        },
                      }}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </>
  );
};

export default Analytics;
