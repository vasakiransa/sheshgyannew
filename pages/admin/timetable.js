import React, { useState, useEffect } from "react";
import Navbar from "@/components/_App/Navbar";
import Footer from "@/components/_App/Footer";
import TimePicker from "react-time-picker";
import "react-time-picker/dist/TimePicker.css";
import { motion } from "framer-motion";
import Link from "next/link";
import axios from "axios";

const Timetable = () => {
  const [partner, setPartner] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedDay, setSelectedDay] = useState("Monday"); // Day of the week
  const [selectedTime, setSelectedTime] = useState("09:00");
  const [duration, setDuration] = useState("1 Hour");
  const [customDuration, setCustomDuration] = useState(""); // Custom duration input
  const [useCustomDuration, setUseCustomDuration] = useState(false); // Toggle custom duration
  const [timetable, setTimetable] = useState([]);
  const [partners, setPartners] = useState([]);
  const [dayFilter, setDayFilter] = useState("Monday"); // Filter schedules by day

  const classes = [
    { id: 1, name: "Grade 3" },
    { id: 2, name: "Grade 4" },
    { id: 3, name: "Grade 5" },
    { id: 4, name: "Grade 6" },
    { id: 5, name: "Grade 7" },
    { id: 6, name: "Grade 8" },
    { id: 7, name: "Grade 9" },
  ];

  const baseUrl = 'http://localhost:3000';

  useEffect(() => {
    fetchPartners();
    fetchTimetable();
  }, []);

  const fetchPartners = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/partners`);
      if (response.status === 200) {
        setPartners(response.data.partners);
      }
    } catch (error) {
      console.error("Error fetching partners:", error);
    }
  };

  const fetchTimetable = async () => {
    try {
      const response = await axios.get('/api/timetable');
      setTimetable(response.data);
    } catch (error) {
      console.error('Error fetching timetable:', error);
    }
  };

  // Function to add schedules for all occurrences of a specific day in the year
  const handleAddSchedule = async (e) => {
    e.preventDefault();
    if (!partner || !selectedClass) {
      alert("Please select a partner and class.");
      return;
    }

    const startDate = new Date(2025, 0, 1); // Start date: Jan 1, 2025
    const endDate = new Date(2025, 11, 31); // End date: Dec 31, 2025
    const newEntries = [];

    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      // Check if the current date matches the selected day of the week
      if (
        currentDate.toLocaleString("en-US", { weekday: "long" }) === selectedDay
      ) {
        // Check if a schedule already exists for this date
        const exists = timetable.some(
          (entry) =>
            entry.date === currentDate.toDateString() &&
            entry.time === selectedTime &&
            entry.partner === partner &&
            entry.class === selectedClass
        );

        if (!exists) {
          newEntries.push({
            date: currentDate.toDateString(),
            day: selectedDay,
            time: selectedTime,
            duration: useCustomDuration ? customDuration : duration,
            partner,
            class: selectedClass,
          });
        }
      }

      // Move to the next day
      currentDate.setDate(currentDate.getDate() + 1);
    }

    if (newEntries.length === 0) {
      alert(`This schedule already exists for all ${selectedDay}s.`);
      return;
    }

    try {
      const updatedTimetable = [...timetable, ...newEntries];
      await axios.post('/api/timetable', { timetable: updatedTimetable });
      setTimetable(updatedTimetable);
      alert(`Added ${newEntries.length} sessions for all ${selectedDay}s in the year.`);
    } catch (error) {
      console.error('Error updating schedule:', error);
      alert('Failed to save schedule.');
    }
  };

  // Filter timetable based on partner and class and selected day
  const filteredTimetableByDay = timetable.filter(
    (entry) =>
      entry.day === dayFilter &&
      entry.partner === partner &&
      entry.class === selectedClass
  );

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
        className="container mt-5"
      >
        <h2 className="text-center fw-bold">Time Table</h2>
        

        <form onSubmit={handleAddSchedule} className="p-4 border rounded shadow bg-white">
          <div className="row g-3">
            <div className="col-md-6">
              <label className="fw-bold"> School</label>
              <select 
                className="form-select"
                value={partner}
                onChange={(e) => setPartner(e.target.value)}
                required
              >
                <option value="">Select School</option>
                {partners.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            <div className="col-md-6">
              <label className="fw-bold"> Grade</label>
              <select
                className="form-select"
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                required
              >
                <option value="">Select Class</option>
                {classes.map((c) => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="col-md-6">
              <label>📅 Select Day of Week</label>
              <select
                className="form-select"
                value={selectedDay}
                onChange={(e) => setSelectedDay(e.target.value)}
                required
              >
                {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(
                  (day) => (
                    <option key={day} value={day}>
                      {day}
                    </option>
                  )
                )}
              </select>
            </div>

            <div className="col-md-6">
              <label>Class Time</label>
              <TimePicker
                onChange={setSelectedTime}
                value={selectedTime}
                className="w-100"
              />
            </div>

            <div className="col-md-6">
              <label>⏳ Duration</label>
              <select
                className="form-select"
                value={duration}
                onChange={(e) => {
                  setDuration(e.target.value);
                  setUseCustomDuration(false); // Reset custom duration toggle
                }}
                required
              >
                <option value="30 Minutes">30 Minutes</option>
                <option value="1 Hour">1 Hour</option>
                <option value="2 Hours">2 Hours</option>
                <option value="Custom">Custom</option>
              </select>

              {/* Custom Duration Input */}
              {duration === "Custom" && (
                <div className="input-group mt-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter custom duration (e.g., 1.5 Hours)"
                    value={customDuration}
                    onChange={(e) => setCustomDuration(e.target.value)}
                    required
                  />
                </div>
              )}
            </div>
          </div>

          <div className="text-center mt-4">
            <button type="submit" className="btn btn-primary px-5">
               Schedule
            </button>
          </div>
        </form>

        {/* Filter by Day */}
        <div className="mt-5">
          <h3>View Schedules by Day</h3>
          <select
            className="form-select mb-3"
            value={dayFilter}
            onChange={(e) => setDayFilter(e.target.value)}
          >
            {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(day => (
              <option key={day} value={day}>{day}</option>
            ))}
          </select>

          {/* Display Schedules */}
          {filteredTimetableByDay.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Duration</th>
                    <th>Class</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTimetableByDay.map((entry, index) => (
                    <tr key={index}>
                      <td>{entry.date}</td>
                      <td>{entry.time}</td>
                      <td>{entry.duration}</td>
                      <td>{entry.class}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>No schedules found for {dayFilter}.</p>
          )}
        </div>
      </motion.div>

      <Footer />
    </>
  );
};

export default Timetable;
