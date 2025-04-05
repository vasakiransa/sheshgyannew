import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import axios from "axios";
import baseUrl from "@/utils/baseUrl";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const FeedbackSliderWithFunFacts = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    const fetchTests = async () => {
      const url = `${baseUrl}/api/testimonials`;
      const response = await axios.get(url);
      setTestimonials(response.data.testimonials);
    };
    fetchTests();
  }, []);

  // Student Growth Analytics Data with Achievements
  const growthData = {
    labels: ["Class 3", "Class 4", "Class 5", "Class 6", "Class 7"],
    datasets: [
      {
        label: "Student Growth (%)",
        data: [0, 20, 45, 70, 100],
        borderColor: "#3498db", // A more appealing blue
        backgroundColor: "rgba(52, 152, 219, 0.2)", // Lighter shade for fill
        pointRadius: 7, // Slightly larger points
        pointBackgroundColor: "#3498db",
        pointBorderColor: "#fff",
        fill: true,
        tension: 0.3, // Adds a smooth curve to the line
      },
    ],
  };

  const growthOptions = {
    responsive: true,
    maintainAspectRatio: false, // Allows the chart to fill its container
    plugins: {
      legend: {
        display: true,
        position: "bottom", // More modern placement
        labels: {
          font: {
            size: 12,
          },
          color: "#555",
        },
      },
      tooltip: {
        backgroundColor: "rgba(0,0,0,0.8)", // Darker tooltip
        titleColor: "#fff",
        bodyColor: "#eee",
        titleFont: {
          size: 14,
        },
        bodyFont: {
          size: 12,
        },
        callbacks: {
          label: function (context) {
            const achievements = [
              "IoT",
              "Robotics",
              "Python",
              "Advanced Python",
              "Web Development",
            ];
            return `${context.raw}% - ${achievements[context.dataIndex]}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(0, 0, 0, 0.05)", // Lighter grid lines
        },
        ticks: {
          color: "#666",
        },
      },
      x: {
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
        },
        ticks: {
          color: "#666",
        },
      },
    },
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials]);

  return (
    <div style={styles.container}>
      <div style={styles.innerContainer}>
        {/* Growth Chart on Left */}
        <motion.div
          style={styles.chartContainer}
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
        >
          <h3 style={styles.chartTitle}>📈 Student Growth Over Time</h3>
          <p style={styles.chartDescription}>
            Our students show consistent improvement as they progress through
            classes.
          </p>
          <div style={styles.chartWrapper}>
            {/* Ensure chart fills the wrapper */}
            <Line data={growthData} options={growthOptions} />
          </div>
        </motion.div>

        {/* Student Photo on Right */}
        <motion.div
          style={styles.photoContainer}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
        >
          <img
            src="https://www.competitionsciences.org/wp-content/uploads/2019/03/generic-first-place-cropped.jpg"
            alt="Student"
            style={styles.studentPhoto}
          />
        </motion.div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    background: "#f5f5f5", // A soft, modern background
    color: "#333",
    padding: "80px 20px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    fontFamily: " 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", // Modern font
  },
  innerContainer: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "40px",
    maxWidth: "1200px",
    width: "100%",
    alignItems: "center",
  },
  chartContainer: {
    background: "#fff", // Clean white background for the chart
    padding: "30px", // Increased padding
    borderRadius: "15px", // Softer rounded corners
    boxShadow: "0px 6px 20px rgba(0, 0, 0, 0.08)", // Subtle shadow
  },
  chartTitle: {
    fontSize: "24px", // Slightly larger title
    fontWeight: "600", // Semi-bold
    textAlign: "center",
    marginBottom: "15px",
    color: "#2c3e50", // Darker, professional color
  },
  chartDescription: {
    color: "#777", // Softer text color
    textAlign: "center",
    marginBottom: "25px",
    fontSize: "16px",
  },
  chartWrapper: {
    height: "300px", // Fixed height for the chart
    position: "relative", // Required for absolute positioning of the chart
  },
  photoContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  studentPhoto: {
    width: "100%",
    maxWidth: "400px",
    borderRadius: "12px", // Slightly more rounded
    boxShadow: "0px 10px 25px rgba(0, 0, 0, 0.12)", // More pronounced shadow
    transition: "transform 0.3s ease-in-out", // Add transition
    "&:hover": {
      transform: "scale(1.05)", // Slight scale on hover
    },
  },
};

export default FeedbackSliderWithFunFacts;
