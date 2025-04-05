import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { parseCookies } from "nookies";
import DatePicker from "react-datepicker";
import { motion } from "framer-motion";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
} from "chart.js";
import { Line } from "react-chartjs-2";
import Link from "next/link";
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import "../../node_modules/react-datepicker/dist/react-datepicker.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement
);

const Analytics = () => {
  const router = useRouter();
  const { elarniv_users_token } = parseCookies();
  const [selectedClass, setSelectedClass] = useState("");
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [fetchDate, setFetchDate] = useState(new Date());
  const [timetable, setTimetable] = useState("No class scheduled");
  const [newDate, setNewDate] = useState(new Date());
  const [attendanceStats, setAttendanceStats] = useState({});
  const [viewDate, setViewDate] = useState(new Date());
  const [timeTableData, setTimeTableData] = useState([]);
  const [classStarted, setClassStarted] = useState(false);
  const [classStartTime, setClassStartTime] = useState(null);
  const [attendanceSaved, setAttendanceSaved] = useState(false);

  useEffect(() => {
    if (!elarniv_users_token) {
      router.push("/login");
    } else {
      fetchAttendanceStats();
      loadTimetable();
    }
  }, [router, elarniv_users_token]);

  useEffect(() => {
    let timer;
    if (classStarted && classStartTime) {
      const timeElapsed = Date.now() - classStartTime;
      if (timeElapsed >= 60 * 60 * 1000) {
        Swal.fire({
          icon: 'warning',
          title: 'Time elapsed!',
          text: 'Class time (1 hour) has elapsed. Please stop the class.',
        });
        setClassStarted(false);
      } else {
        timer = setTimeout(() => {
        }, 1000);
      }
    }
    return () => clearTimeout(timer);
  }, [classStarted, classStartTime]);

  const handleClassChange = async (e) => {
    const className = e.target.value;
    const students = await fetchStudentsByClass(className);
    setSelectedClass(className);
    setStudents(students);
    setAttendance({});
    setClassStarted(false);
    setClassStartTime(null);
    setAttendanceSaved(false);
  };

  const handleAttendanceChange = (student, status) => {
    if (classStarted) {
      setAttendance({ ...attendance, [student.email]: status });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please start the class before marking attendance!',
      });
    }
  };

  const markAllPresent = () => {
    if (classStarted) {
      const allPresent = {};
      students.forEach(student => {
        allPresent[student.email] = "Present";
      });
      setAttendance(allPresent);
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please start the class before marking attendance!',
      });
    }
  };

  const startClass = () => {
    if (!selectedClass) {
      Swal.fire({
        icon: 'warning',
        title: 'Warning!',
        text: 'Please select a class first!',
      });
      return;
    }
    setClassStarted(true);
    setClassStartTime(Date.now());
    setAttendanceSaved(false);
    Swal.fire({
      icon: 'success',
      title: 'Class Started!',
      text: `Class "${selectedClass}" has started. You have 1 hour to complete attendance.`,
    });
  };

  const saveAttendance = async () => {
    if (!classStarted) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please start the class before saving attendance!',
      });
      return;
    }
    const dateKey = selectedDate.toISOString().slice(0, 10);
    const newStats = { ...attendanceStats, [dateKey]: attendance };
    await saveAttendanceStats(newStats);
    Swal.fire({
      icon: 'success',
      title: 'Attendance Saved!',
      text: 'Attendance has been saved successfully.',
    });
    setAttendanceStats(newStats);
    setAttendance({});
    setAttendanceSaved(true);
  };

  const stopClass = () => {
    if (!attendanceSaved) {
      Swal.fire({
        icon: 'warning',
        title: 'Warning!',
        text: 'Please save attendance before stopping the class!',
      });
      return;
    }
    setClassStarted(false);
    setClassStartTime(null);
    setAttendanceSaved(false);
    Swal.fire({
      icon: 'info',
      title: 'Class Stopped',
      text: 'Class has been stopped.',
    });
  };

  const fetchAttendanceStats = async () => {
    try {
      const response = await fetch("/api/attendance-stats");
      const data = await response.json();
      setAttendanceStats(data);
    } catch (error) {
      console.error("Error fetching attendance stats:", error);
      Swal.fire({
        icon: 'error',
        title: 'Fetch Error',
        text: 'Failed to fetch attendance stats.',
      });
    }
  };

  const saveAttendanceStats = async (stats) => {
    try {
      await fetch("/api/save-attendance-stats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(stats),
      });
    } catch (error) {
      console.error("Error saving attendance stats:", error);
      Swal.fire({
        icon: 'error',
        title: 'Save Error',
        text: 'Failed to save attendance stats.',
      });
    }
  };

  const fetchStudentsByClass = async (className) => {
    try {
      const response = await fetch(`/api/students?class=${className}`);
      const data = await response.json();
      return data.students;
    } catch (error) {
      console.error("Error fetching students:", error);
      Swal.fire({
        icon: 'error',
        title: 'Fetch Error',
        text: 'Failed to fetch students by class.',
      });
      return [];
    }
  };

  const getAttendanceStatsForDate = (date) => {
    const dateKey = date.toISOString().slice(0, 10);
    return attendanceStats[dateKey] || {};
  };

  const monthlyAttendanceData = {
    labels: ["January", "February", "March", "April", "May", "June"],
    datasets: [
      {
        label: "Monthly Attendance Percentage",
        data: [85, 90, 88, 92, 87, 91],
        borderColor: "#5A8DEE",
        backgroundColor: "rgba(90, 141, 238, 0.2)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const loadTimetable = async () => {
    try {
      const response = await fetch("/api/timetable");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setTimeTableData(data);
    } catch (error) {
      console.error("Could not load timetable:", error);
      Swal.fire({
        icon: 'error',
        title: 'Load Error',
        text: 'Could not load timetable.',
      });
    }
  };

  const fetchTimetable = () => {
    const formattedDate = fetchDate.toDateString();
    const classSchedule = timeTableData.find((item) => item.date === formattedDate);
    if (classSchedule) {
      setTimetable(`Class: ${classSchedule.class} at ${classSchedule.time}`);
    } else {
      setTimetable("No class scheduled");
    }
  };

  const saveTimetable = async () => {
    const formattedDate = newDate.toDateString();

    const existingIndex = timeTableData.findIndex((item) => item.date === formattedDate);

    let grade, partner;

    if (existingIndex !== -1) {
      grade = timeTableData[existingIndex].class;
      partner = timeTableData[existingIndex].partner;
    } else {
      const gradeValue = await Swal.fire({
        title: 'Enter the grade:',
        input: 'text',
        showCancelButton: true,
        inputValidator: (value) => {
          if (!value) {
            return 'You need to enter a grade!';
          }
        }
      });

      if (gradeValue.isDismissed) {
        return;
      }

      const partnerValue = await Swal.fire({
        title: 'Enter the partner:',
        input: 'text',
        showCancelButton: true,
        inputValidator: (value) => {
          if (!value) {
            return 'You need to enter a partner!';
          }
        }
      });

      if (partnerValue.isDismissed) {
        return;
      }

      grade = gradeValue.value;
      partner = partnerValue.value;
    }

    const time = newDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    const newEntry = {
      date: formattedDate,
      class: grade,
      time: time,
      duration: "1 Hour",
      partner: partner,
    };

    let updatedTimetable = [...timeTableData];

    if (existingIndex !== -1) {
      updatedTimetable[existingIndex] = newEntry;
    } else {
      updatedTimetable.push(newEntry);
    }

    try {
      const response = await fetch("/api/timetable", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ timetable: updatedTimetable }),
      });

      if (response.ok) {
        loadTimetable();
        Swal.fire({
          icon: 'success',
          title: 'Timetable Updated!',
          text: 'Timetable updated successfully!',
        });
      } else {
        console.error("Failed to update timetable:", response.status);
        Swal.fire({
          icon: 'error',
          title: 'Update Failed',
          text: 'Failed to update timetable.',
        });
      }
    } catch (error) {
      console.error("Error updating timetable:", error);
      Swal.fire({
        icon: 'error',
        title: 'Update Error',
        text: 'Error updating timetable.',
      });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, x: '100vw' },
    visible: {
      opacity: 1,
      x: 0,
      transition: { type: 'spring', delay: 0.1, duration: 0.7 }
    },
    exit: {
      x: '-100vw',
      transition: { ease: 'easeInOut' }
    }
  };

  const buttonStyle = {
    padding: "16px 32px",
    fontSize: "1.2rem",
    fontWeight: "600",
    color: "#fff",
    backgroundColor: "#6366F1",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
    transition: "all 0.2s ease-in-out",
    margin: "10px 0",
    display: "inline-block",
    textAlign: "center",
    textDecoration: "none",
    ':hover': {
      backgroundColor: "#4F46E5",
      transform: "translateY(-2px)",
      boxShadow: "0 6px 8px rgba(0,0,0,0.15)"
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      style={{
        padding: "30px",
        maxWidth: "1400px",
        margin: "0 auto",
        fontFamily: 'Arial, sans-serif',
        color: '#333',
        background: '#f9f9f9',
        borderRadius: '15px',
        boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Link href="/" passHref>
        <a
          className="back-button"
          style={{
            display: 'inline-block',
            padding: '12px 24px',
            fontSize: '1rem',
            background: '#5A67D8',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '8px',
            marginBottom: '20px',
            transition: 'background-color 0.3s ease',
          }}
          onMouseOver={(e) => { e.target.style.backgroundColor = '#434190'; }}
          onMouseOut={(e) => { e.target.style.backgroundColor = '#5A67D8'; }}
        >
          ← Back 
        </a>
      </Link>

      <motion.h2
        style={{
          fontSize: "3rem",
          fontWeight: "bold",
          textAlign: "center",
          marginBottom: "40px",
          color: "#374151",
          textShadow: '2px 2px 4px rgba(0, 0, 0, 0.15)'
        }}
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.3 }}
      >
        Class Analytics & Attendance
      </motion.h2>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
        gap: "30px",
        marginBottom: "40px"
      }}>
        <motion.div
          style={{
            background: "#fff",
            padding: "30px",
            borderRadius: "15px",
            boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
            transition: 'box-shadow 0.3s ease'
          }}
          whileHover={{ boxShadow: '0 7px 17px rgba(0, 0, 0, 0.15)' }}
        >
          <label htmlFor="classSelect" style={{
            display: "block",
            fontSize: "1.2rem",
            fontWeight: "600",
            marginBottom: "12px",
            color: "#4A5568"
          }}>
            Select Class:
          </label>
          <select
            id="classSelect"
            style={{
              width: "100%",
              padding: "14px",
              border: "2px solid #E2E8F0",
              borderRadius: "10px",
              fontSize: "1.1rem",
              color: "#2D3748",
              background: "#F7FAFC",
              appearance: 'none',
              WebkitAppearance: 'none',
              MozAppearance: 'none',
              cursor: "pointer",
              transition: 'border-color 0.3s ease',
              outline: 'none'
            }}
            onChange={handleClassChange}
            value={selectedClass}
          >
            <option value="">Choose a Class</option>
            <option value="Class A">Class 3</option>
            <option value="Class 4">Class 4</option>
            <option value="Class 5">Class 5</option>
            <option value="Class 6">Class 6</option>
            <option value="Class 7">Class 7</option>
            <option value="Class 8">Class 8</option>
            <option value="Class 9">Class 9</option>
          </select>
        </motion.div>
      </div>

      {selectedClass && (
        <motion.div
          style={{
            marginTop: "40px",
            backgroundColor: "#fff",
            padding: "40px",
            borderRadius: "20px",
            boxShadow: '0 7px 17px rgba(0, 0, 0, 0.1)'
          }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h3 style={{
            fontSize: "2.25rem",
            fontWeight: "bold",
            marginBottom: "30px",
            color: "#2D3748",
            borderBottom: '3px solid #EDF2F7',
            paddingBottom: '15px'
          }}>
            Manage Class - {selectedDate.toLocaleDateString()}
          </h3>

          {!classStarted ? (
            <motion.button
              onClick={startClass}
              style={buttonStyle}
              whileHover={{ backgroundColor: "#4F46E5", transform: "translateY(-2px)", boxShadow: "0 6px 8px rgba(0,0,0,0.15)" }}
            >
              🚀 Start Class
            </motion.button>
          ) : (
            !attendanceSaved ? (
              <motion.div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "25px",
                  marginTop: "30px"
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.4 }}
              >
                <motion.button
                  onClick={markAllPresent}
                  style={{
                    ...buttonStyle,
                    backgroundColor: '#48BB78',
                    ':hover': { backgroundColor: '#38A169' }
                  }}
                  whileHover={{ backgroundColor: '#38A169', transform: "translateY(-2px)", boxShadow: "0 6px 8px rgba(0,0,0,0.15)" }}
                >
                  Mark All Present
                </motion.button>
                {students.map((student) => (
                  <div
                    key={student.email}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      background: "#F7FAFC",
                      padding: "20px",
                      borderRadius: "12px",
                      boxShadow: '0 2px 5px rgba(0, 0, 0, 0.08)'
                    }}
                  >
                    <span style={{ fontSize: "1.2rem", color: "#2D3748", fontWeight: "500" }}>
                      {student.first_name} {student.last_name}
                    </span>
                    <div>
                      <motion.button
                        style={{
                          padding: "12px 24px",
                          borderRadius: "8px",
                          border: "none",
                          cursor: "pointer",
                          fontSize: "1rem",
                          transition: 'background-color 0.3s ease, color 0.3s ease',
                          background: attendance[student.email] === "Present" ? "#48BB78" : "transparent",
                          color: attendance[student.email] === "Present" ? "#fff" : "#48BB78",
                          border: '2px solid #48BB78',
                          marginRight: "12px"
                        }}
                        onClick={() => handleAttendanceChange(student, "Present")}
                        whileHover={{ backgroundColor: attendance[student.email] === "Present" ? '#38A169' : '#E6FFFA', color: attendance[student.email] === "Present" ? '#fff' : '#38A169' }}
                      >
                        Present
                      </motion.button>
                      <motion.button
                        style={{
                          padding: "12px 24px",
                          borderRadius: "8px",
                          border: "none",
                          cursor: "pointer",
                          fontSize: "1rem",
                          transition: 'background-color 0.3s ease, color 0.3s ease',
                          background: attendance[student.email] === "Absent" ? "#E53E3E" : "transparent",
                          color: attendance[student.email] === "Absent" ? "#fff" : "#E53E3E",
                          border: '2px solid #E53E3E'
                        }}
                        onClick={() => handleAttendanceChange(student, "Absent")}
                        whileHover={{ backgroundColor: attendance[student.email] === "Absent" ? '#C53030' : '#FEEBC8', color: attendance[student.email] === "Absent" ? '#fff' : '#C53030' }}
                      >
                        Absent
                      </motion.button>
                    </div>
                  </div>
                ))}
                <motion.button
                  onClick={saveAttendance}
                  style={buttonStyle}
                  whileHover={{ backgroundColor: "#4F46E5", transform: "translateY(-2px)", boxShadow: "0 6px 8px rgba(0,0,0,0.15)" }}
                >
                  💾 Save Attendance
                </motion.button>
              </motion.div>
            ) : (
              <motion.button
                onClick={stopClass}
                style={{
                  ...buttonStyle,
                  backgroundColor: '#E53E3E',
                  ':hover': { backgroundColor: '#C53030' }
                }}
                whileHover={{ backgroundColor: "#C53030", transform: "translateY(-2px)", boxShadow: "0 6px 8px rgba(0,0,0,0.15)" }}
              >
                🛑 Stop Class
              </motion.button>
            )
          )}
        </motion.div>
      )}

      <motion.div
        style={{
          marginTop: "40px",
          backgroundColor: "#fff",
          padding: "40px",
          borderRadius: "20px",
          boxShadow: '0 7px 17px rgba(0, 0, 0, 0.1)'
        }}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h3 style={{
          fontSize: "2.25rem",
          fontWeight: "bold",
          marginBottom: "30px",
          color: "#2D3748",
          borderBottom: '3px solid #EDF2F7',
          paddingBottom: '15px'
        }}>
          📅 View Previous Attendance
        </h3>
        <DatePicker
          selected={viewDate}
          onChange={(date) => setViewDate(date)}
          dateFormat="yyyy-MM-dd"
          style={{
            width: "100%",
            padding: "16px",
            border: "2px solid #E2E8F0",
            borderRadius: "10px",
            fontSize: "1.1rem",
            color: "#2D3748",
            background: "#F7FAFC",
            cursor: "pointer",
            transition: 'border-color 0.3s ease',
            outline: 'none'
          }}
        />
        <div style={{ marginTop: "30px" }}>
          <h4 style={{
            fontSize: "1.5rem",
            fontWeight: "600",
            marginBottom: "20px",
            color: "#4A5568"
          }}>
            Attendance for {viewDate.toLocaleDateString()}
          </h4>
          {students.map((student) => (
            <div
              key={student.email}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "20px",
                padding: "20px",
                borderRadius: "12px",
                background: "#F7FAFC",
                boxShadow: '0 2px 5px rgba(0, 0, 0, 0.08)'
              }}
            >
              <span style={{ fontSize: "1.1rem", color: "#374151", fontWeight: "500" }}>
                {student.first_name} {student.last_name}
              </span>
              <span
                style={{
                  fontSize: "1.1rem",
                  color: getAttendanceStatsForDate(viewDate)[student.email] === "Present" ? "#48BB78" : "#E53E3E",
                  fontWeight: "bold"
                }}
              >
                {getAttendanceStatsForDate(viewDate)[student.email] || "Not Marked"}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        style={{
          marginTop: "40px",
          backgroundColor: "#fff",
          padding: "40px",
          borderRadius: "20px",
          boxShadow: '0 7px 17px rgba(0, 0, 0, 0.1)'
        }}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h3 style={{
          fontSize: "2.25rem",
          fontWeight: "bold",
          marginBottom: "30px",
          color: "#2D3748",
          borderBottom: '3px solid #EDF2F7',
          paddingBottom: '15px'
        }}>
          🕒 Timetable Management
        </h3>
        <div style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          marginBottom: "30px"
        }}>
          <DatePicker
            selected={newDate}
            onChange={(date) => setNewDate(date)}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            dateFormat="yyyy-MM-dd HH:mm"
            style={{
              width: "100%",
              padding: "16px",
              border: "2px solid #E2E8F0",
              borderRadius: "10px",
              fontSize: "1.1rem",
              color: "#2D3748",
              background: "#F7FAFC",
              cursor: "pointer",
              transition: 'border-color 0.3s ease',
              outline: 'none'
            }}
          />
          <motion.button
            onClick={saveTimetable}
            style={buttonStyle}
            whileHover={{ backgroundColor: "#4F46E5", transform: "translateY(-2px)", boxShadow: "0 6px 8px rgba(0,0,0,0.15)" }}
          >
            💾 Save Timetable Entry
          </motion.button>
        </div>

        <h4 style={{
          fontSize: "1.5rem",
          fontWeight: "600",
          marginBottom: "20px",
          color: "#4A5568"
        }}>
          📅 Timetable for {fetchDate.toLocaleDateString()}
        </h4>
        <DatePicker
          selected={fetchDate}
          onChange={(date) => {
            setFetchDate(date);
            fetchTimetable();
          }}
          dateFormat="yyyy-MM-dd"
          style={{
            width: "100%",
            padding: "16px",
            border: "2px solid #E2E8F0",
            borderRadius: "10px",
            fontSize: "1.1rem",
            color: "#2D3748",
            background: "#F7FAFC",
            cursor: "pointer",
            transition: 'border-color 0.3s ease',
            outline: 'none'
          }}
        />
        <p style={{
          marginTop: "20px",
          fontSize: "1.1rem",
          color: "#374151"
        }}>
          {timetable}
        </p>
      </motion.div>

      <motion.div
        style={{
          marginTop: "40px",
          backgroundColor: "#fff",
          padding: "40px",
          borderRadius: "20px",
          boxShadow: '0 7px 17px rgba(0, 0, 0, 0.1)'
        }}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h3 style={{
          fontSize: "2.25rem",
          fontWeight: "bold",
          marginBottom: "30px",
          color: "#2D3748",
          borderBottom: '3px solid #EDF2F7',
          paddingBottom: '15px'
        }}>
          📊 Monthly Attendance Statistics
        </h3>
        <Line data={monthlyAttendanceData} options={{
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: 'Monthly Class Attendance',
            },
          },
        }} />
      </motion.div>
    </motion.div>
  );
};

export default Analytics;
