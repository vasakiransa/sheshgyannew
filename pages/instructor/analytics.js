import React, { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";

const AdminStudentsView = () => {
  const [students, setStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [displayedStudents, setDisplayedStudents] = useState([]);
  const [editPasswordId, setEditPasswordId] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [hoveredStudent, setHoveredStudent] = useState(null);

  const fetchStudents = async () => {
    try {
      const response = await axios.get("/api/students");
      setStudents(response.data.students);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handlePasswordChange = async (id) => {
    try {
      await axios.put(`/api/students/${id}?action=password`, {
        oldPassword,
        newPassword,
      });
      console.log("Password updated successfully");
      fetchStudents();
    } catch (error) {
      console.error("Error updating password:", error);
    }

    setEditPasswordId(null);
    setNewPassword("");
    setOldPassword("");
  };

  const handleFetchClassData = () => {
    setDisplayedStudents(students);
  };

  return (
    <div
      style={{
        padding: "30px",
        fontFamily: "Nunito, sans-serif",
        maxWidth: "1300px",
        margin: "auto",
        background: "#f9f7fa",
        borderRadius: "15px",
        boxShadow: "0 8px 20px rgba(0, 0, 0, 0.08)",
      }}
    >
      <Link href="/" passHref>
        <a
          style={{
            textDecoration: "none",
            color: "#fff",
            backgroundColor: "#8e44ad",
            padding: "14px 24px",
            borderRadius: "10px",
            display: "inline-block",
            marginBottom: "30px",
            transition: "background-color 0.3s ease",
            fontWeight: "600",
            ":hover": {
              backgroundColor: "#753a88",
            },
          }}
        >
          ← Back to Dashboard
        </a>
      </Link>
      <h2
        style={{
          textAlign: "center",
          marginBottom: "40px",
          color: "#444",
          fontWeight: "700",
          fontSize: "2.5em",
        }}
      >
        Student Data Management
      </h2>

      <div
        style={{
          marginBottom: "35px",
          display: "flex",
          alignItems: "center",
          gap: "20px",
          justifyContent: "flex-start",
        }}
      >
        <select
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
          style={{
            padding: "14px",
            borderRadius: "10px",
            border: "2px solid #ddd",
            width: "250px",
            fontSize: "18px",
            color: "#555",
            backgroundColor: "#fff",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.06)",
            transition: "border-color 0.3s ease",
            ":focus": {
              borderColor: "#8e44ad",
              outline: "none",
            },
          }}
        >
          <option value="">Select Class</option>
          <option value="3A">Class 3A</option>
          <option value="4B">Class 4B</option>
          <option value="5A">Class 5A</option>
          <option value="6B">Class 6B</option>
        </select>
        <button
          onClick={handleFetchClassData}
          style={{
            padding: "14px 28px",
            backgroundColor: "#8e44ad",
            color: "white",
            border: "none",
            borderRadius: "10px",
            cursor: "pointer",
            fontSize: "18px",
            fontWeight: "600",
            transition: "background-color 0.3s ease",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            ":hover": {
              backgroundColor: "#753a88",
            },
          }}
        >
          Load Student Data
        </button>
      </div>

      {displayedStudents.length > 0 && (
        <div style={{ overflowX: "auto" }}>
          <h3
            style={{
              backgroundColor: "#f2e7fa",
              padding: "14px",
              borderRadius: "10px",
              color: "#555",
              marginBottom: "25px",
              textAlign: "left",
              fontSize: "22px",
              fontWeight: "600",
              borderBottom: "2px solid #ddd",
            }}
          >
            Student List
          </h3>
          <table
            style={{
              width: "100%",
              borderCollapse: "separate",
              borderSpacing: "0 12px",
              boxShadow: "0 6px 12px rgba(0, 0, 0, 0.06)",
              borderRadius: "12px",
              overflow: "hidden",
            }}
          >
            <thead>
              <tr style={{ backgroundColor: "#8e44ad", color: "white" }}>
                <th
                  style={{
                    padding: "18px 20px",
                    textAlign: "left",
                    border: "none",
                    fontWeight: "700",
                    fontSize: "1.1em",
                  }}
                >
                  Name
                </th>
                <th
                  style={{
                    padding: "18px 20px",
                    textAlign: "left",
                    border: "none",
                    fontWeight: "700",
                    fontSize: "1.1em",
                  }}
                >
                  Email
                </th>
                <th
                  style={{
                    padding: "18px 20px",
                    textAlign: "left",
                    border: "none",
                    fontWeight: "700",
                    fontSize: "1.1em",
                  }}
                >
                  Phone
                </th>
                <th
                  style={{
                    padding: "18px 20px",
                    textAlign: "left",
                    border: "none",
                    fontWeight: "700",
                    fontSize: "1.1em",
                  }}
                >
                  Email Confirmed
                </th>
                <th
                  style={{
                    padding: "18px 20px",
                    textAlign: "left",
                    border: "none",
                    fontWeight: "700",
                    fontSize: "1.1em",
                  }}
                >
                  Bio
                </th>
                <th
                  style={{
                    padding: "18px 20px",
                    textAlign: "left",
                    border: "none",
                    fontWeight: "700",
                    fontSize: "1.1em",
                  }}
                >
                  Performance
                </th>
                <th
                  style={{
                    padding: "18px 20px",
                    textAlign: "center",
                    border: "none",
                    fontWeight: "700",
                    fontSize: "1.1em",
                  }}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {displayedStudents.map((student, index) => (
                <tr
                  key={student.id}
                  style={{
                    backgroundColor: index % 2 === 0 ? "#f7f2fa" : "#ffffff",
                    boxShadow: "0 3px 5px rgba(0, 0, 0, 0.04)",
                    borderRadius: "10px",
                    transition: "background-color 0.3s ease, transform 0.2s ease",
                    ":hover": {
                      backgroundColor: "#f2e7fa",
                      transform: "translateY(-2px)",
                    },
                  }}
                  onMouseEnter={() => setHoveredStudent(student.id)}
                  onMouseLeave={() => setHoveredStudent(null)}
                >
                  <td
                    style={{
                      padding: "16px 20px",
                      border: "none",
                      color: "#444",
                      fontSize: "1em",
                      fontWeight: "500",
                    }}
                  >
                    {`${student.first_name} ${student.last_name}`}
                    {hoveredStudent === student.id && (
                      <div
                        style={{
                          position: "absolute",
                          top: "100%",
                          left: 0,
                          zIndex: 10,
                          background: "#fff",
                          padding: "10px",
                          borderRadius: "5px",
                          boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
                          width: "200px",
                        }}
                      >
                        <p>Additional Info:</p>
                        <p>Class: {selectedClass || "N/A"}</p>
                      </div>
                    )}
                  </td>
                  <td
                    style={{
                      padding: "16px 20px",
                      border: "none",
                      color: "#444",
                      fontSize: "1em",
                      fontWeight: "500",
                    }}
                  >
                    {student.email}
                  </td>
                  <td
                    style={{
                      padding: "16px 20px",
                      border: "none",
                      color: "#444",
                      fontSize: "1em",
                      fontWeight: "500",
                    }}
                  >
                    {student.phone || "N/A"}
                  </td>
                  <td
                    style={{
                      padding: "16px 20px",
                      border: "none",
                      color: "#444",
                      fontSize: "1em",
                      fontWeight: "500",
                    }}
                  >
                    {student.email_confirmed ? "Yes" : "No"}
                  </td>
                  <td
                    style={{
                      padding: "16px 20px",
                      border: "none",
                      color: "#444",
                      fontSize: "1em",
                      fontWeight: "500",
                    }}
                  >
                    {student.bio || "N/A"}
                  </td>
                  <td
                    style={{
                      padding: "16px 20px",
                      border: "none",
                      color: "#444",
                      fontSize: "1em",
                      fontWeight: "500",
                    }}
                  >
                    Excellent
                  </td>
                  <td
                    style={{
                      padding: "16px 20px",
                      border: "none",
                      textAlign: "center",
                    }}
                  >
                    {editPasswordId === student.id ? (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "12px",
                        }}
                      >
                        <input
                          type="password"
                          value={oldPassword}
                          onChange={(e) => setOldPassword(e.target.value)}
                          placeholder="Old Password"
                          style={{
                            padding: "12px",
                            borderRadius: "8px",
                            border: "1px solid #ced4da",
                            width: "130px",
                            fontSize: "0.9em",
                          }}
                        />
                        <input
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="New Password"
                          style={{
                            padding: "12px",
                            borderRadius: "8px",
                            border: "1px solid #ced4da",
                            width: "130px",
                            fontSize: "0.9em",
                          }}
                        />
                        <button
                          onClick={() => handlePasswordChange(student.id)}
                          style={{
                            padding: "12px 18px",
                            backgroundColor: "#2ecc71",
                            color: "white",
                            border: "none",
                            cursor: "pointer",
                            borderRadius: "8px",
                            transition: "background-color 0.3s ease",
                            fontSize: "0.9em",
                            ":hover": {
                              backgroundColor: "#27ae60",
                            },
                          }}
                        >
                          Save
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setEditPasswordId(student.id)}
                        style={{
                          padding: "12px 18px",
                          backgroundColor: "#3498db",
                          color: "white",
                          border: "none",
                          cursor: "pointer",
                          borderRadius: "8px",
                          transition: "background-color 0.3s ease",
                          fontSize: "0.9em",
                          ":hover": {
                            backgroundColor: "#2980b9",
                          },
                        }}
                      >
                        Update Password
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminStudentsView;
