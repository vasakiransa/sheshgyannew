import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { parseCookies } from "nookies";
import Footer from "@/components/_App/Footer";
import { motion } from "framer-motion";
import Link from "next/link";
import { Bar, Pie, Line } from "react-chartjs-2";
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
import axios from "axios";
import baseUrl from "@/utils/baseUrl";

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

const Attendance = () => {
    const { elarniv_users_token } = parseCookies();
    const [school, setSchool] = useState("");
    const [selectedClass, setSelectedClass] = useState("");
    const [students, setStudents] = useState([]);
    const [showTable, setShowTable] = useState(false);
    const [user, setUser] = useState(null);
    const [router, setRouter] = useState(useRouter());
    const [selectedDate, setSelectedDate] = useState("");
    const [partners, setPartners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(""); // Error state for displaying error messages


    useEffect(() => {
        const fetchPartners = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${baseUrl}/api/partners`);
                setPartners(response.data.partners);
            } catch (error) {
                console.error("Error fetching schools:", error);
                setError("Error fetching schools."); // Set error message
            } finally {
                setLoading(false);
            }
        };

        fetchPartners();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(""); // Clear previous errors
        if (school && selectedClass && selectedDate) {
            try {
                // Fetch attendance data from the local JSON file
                const response = await axios.get(`/admin/attendance.json`);
                const attendanceData = response.data;

                // Check for errors or missing data
                if (attendanceData && attendanceData.message) {
                    console.error(attendanceData.message);
                    setError("Failed to fetch attendance data."); // Set error message
                    setStudents([]);
                    setShowTable(false);
                    return;
                }

                const selectedDateFormatted = new Date(selectedDate).toISOString().slice(0, 10);

                // Extract students' attendance based on the selected date
                const studentAttendance = attendanceData[selectedDateFormatted];

                if (studentAttendance) {
                    // Convert attendance data into an array of student objects
                    const studentArray = Object.entries(studentAttendance).map(([email, status]) => ({
                        email,
                        status,
                    }));
                    setStudents(studentArray);
                    setShowTable(true);
                } else {
                    setError("No attendance data found for the selected date."); // Set error message
                    setStudents([]); // Clear existing student data
                    setShowTable(false); // Hide attendance table
                }
            } catch (error) {
                console.error("Error fetching attendance data:", error);
                setError("Error fetching attendance data."); // Set error message
                setStudents([]); // Clear existing student data
                setShowTable(false); // Hide attendance table
            }
        } else {
            setError("Please select School, Class, and Date"); // Set error message
        }
    };

    const getAttendanceData = () => {
        const presentCount = students.filter(
            (student) => student.status === "Present"
        ).length;
        const absentCount = students.filter(
            (student) => student.status === "Absent"
        ).length;
        const lateCount = students.filter(
            (student) => student.status === "Late"
        ).length;

        return {
            labels: ["Present", "Absent", "Late"],
            datasets: [
                {
                    label: "Attendance Status",
                    data: [presentCount, absentCount, lateCount],
                    backgroundColor: ["#28a745", "#dc3545", "#ffc107"],
                },
            ],
        };
    };

    const getPieChartData = () => {
        const presentCount = students.filter(
            (student) => student.status === "Present"
        ).length;
        const absentCount = students.filter(
            (student) => student.status === "Absent"
        ).length;
        const lateCount = students.filter(
            (student) => student.status === "Late"
        ).length;

        return {
            labels: ["Present", "Absent", "Late"],
            datasets: [
                {
                    data: [presentCount, absentCount, lateCount],
                    backgroundColor: ["#28a745", "#dc3545", "#ffc107"],
                },
            ],
        };
    };

    const getLineChartData = () => {
        return {
            labels: ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5"],
            datasets: [
                {
                    label: "Attendance Rate (%)",
                    data: [90, 85, 92, 88, 95],
                    fill: false,
                    borderColor: "#28a745",
                    tension: 0.1,
                },
            ],
        };
    };

    useEffect(() => {
        const { elarniv_users_token } = parseCookies();

        if (!elarniv_users_token) {
            if (router) {
                router.push("/login");
            }

        } else {
            setUser({ name: "John Doe" });
        }
    }, [router]);

    return (
        <>
            <Link href="/" passHref>
                <a className="btn btn-secondary position-absolute top-0 start-0 m-3">
                    ← Back
                </a>
            </Link>

            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="container mt-5"
            >
                <h2 className="text-center fw-bold">📋 Student Attendance</h2>
                <p className="text-center text-muted">
                    Select School & Class to View Attendance
                </p>

                {/* User Info */}
                {user ? (
                    <p className="text-center text-muted">
                        Welcome, <strong>{user.name}</strong>
                    </p>
                ) : (
                    <p className="text-center text-muted">You are not logged in.</p>
                )}

                {/* Login Button */}
                {!user && (
                    <div className="d-flex justify-content-center mt-4">
                        <Link href="/login" passHref>
                            <button className="btn btn-primary px-4">📍 Login</button>
                        </Link>
                    </div>
                )}

                {/* Attendance Form */}
                <form onSubmit={handleSubmit} className="p-4 border rounded shadow bg-white">
                    <div className="row">
                        <div className="col-md-6">
                            <label className="fw-bold">🏫 Select School</label>
                            <select
                                className="form-select"
                                value={school}
                                onChange={(e) => setSchool(e.target.value)}
                                required
                            >
                                <option value="">Choose School</option>
                                {loading ? (
                                    <option>Loading schools...</option>
                                ) : (
                                    partners.map((partner) => (
                                        <option key={partner.id} value={partner.id}>
                                            {partner.name}
                                        </option>
                                    ))
                                )}
                            </select>
                        </div>
                        <div className="col-md-6">
                            <label className="fw-bold">📚 Select Class</label>
                            <select
                                className="form-select"
                                value={selectedClass}
                                onChange={(e) => setSelectedClass(e.target.value)}
                                required
                            >
                                <option value="">Choose Class</option>
                                <option value="Grade A">Grade A</option>
                                <option value="Grade B">Grade B</option>
                            </select>
                        </div>
                        <div className="col-md-4">
                            <label className="fw-bold">📅 Select Date</label>
                            <input
                                type="date"
                                className="form-control"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                max={new Date().toISOString().split("T")[0]}
                                required
                            />
                        </div>
                    </div>

                    <div className="d-flex justify-content-center mt-4">
                        <button type="submit" className="btn btn-primary px-4">
                            📊 View Attendance
                        </button>
                    </div>
                    {/* Display Error Message */}
                    {error && <div className="alert alert-danger mt-3">{error}</div>}
                </form>

                {/* Display Analytics - Bar Chart, Pie Chart, Line Chart */}
                {showTable && (
                    <>
                        <motion.div className="mt-5 p-4 border rounded shadow bg-white">
                            <h4 className="fw-bold text-center">
                                📅 Attendance Analytics for {selectedClass} - {partners.find((p) => p.id === school)?.name}
                            </h4>

                            <div className="row">
                                {/* Bar Chart for Attendance Status */}
                                <div className="col-md-4">
                                    <h5 className="text-center">📊 Attendance Status (Bar Chart)</h5>
                                    <Bar data={getAttendanceData()} options={{ responsive: true }} />
                                </div>

                                {/* Pie Chart for Attendance Proportions */}
                                <div className="col-md-4">
                                    <h5 className="text-center">🍰 Attendance Proportions (Pie Chart)</h5>
                                    <Pie data={getPieChartData()} options={{ responsive: true }} />
                                </div>

                                {/* Line Chart for Attendance Trend */}
                                <div className="col-md-4">
                                    <h5 className="text-center">📈 Attendance Trend (Line Chart)</h5>
                                    <Line data={getLineChartData()} options={{ responsive: true }} />
                                </div>
                            </div>
                        </motion.div>

                        {/* Attendance Table */}
                        <motion.div className="mt-5 p-4 border rounded shadow bg-white">
                            <h4 className="fw-bold text-center">📅 Attendance Details</h4>
                            <table className="table table-hover mt-3">
                                <thead className="table-dark">
                                <tr>
                                    <th>#</th>
                                    <th>👤 Student Email</th>
                                    <th>📌 Status</th>
                                </tr>
                                </thead>
                                <tbody>
                                {students.map((student, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{student.email}</td>
                                        <td>
                                            <span
                                                className={`badge bg-${student.status === "Present" ? "success" : student.status === "Absent" ? "danger" : "warning"
                                                    }`}
                                            >
                                                {student.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </motion.div>
                    </>
                )}
            </motion.div>

            <Footer />
        </>
    );
};

export default Attendance;
