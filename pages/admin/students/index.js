import React, { useState, useEffect } from 'react';
import Navbar from "@/components/_App/Navbar";
import Link from "next/link";
import Footer from "@/components/_App/Footer";
import AdminSideNav from "@/components/_App/AdminSideNav";
import StudentsRaw from "@/components/Admin/StudentsRaw";
import toast from "react-hot-toast";
import axios from "axios";
import baseUrl from "@/utils/baseUrl";
import GeneralLoader from "@/utils/GeneralLoader";
import { parseCookies } from "nookies";

const Index = ({ user }) => {
    const { elarniv_users_token } = parseCookies();
    const [users, setUsers] = useState([]);
    const [partners, setPartners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [newStudent, setNewStudent] = useState({
        first_name: '',
        last_name: '',
        email: '',
        my_course: 'DefaultCourse',
        password: '',
        phone: '',
        role: 'student',
        class_id: '', // Will store selected grade
        school_id: '', // Will store selected school ID
    });

    const handleInputChange = (e) => {
        setNewStudent({ ...newStudent, [e.target.name]: e.target.value });
    };

    useEffect(() => {
        const fetchPartners = async () => {
            try {
                const response = await axios.get(`${baseUrl}/api/partners`);
                setPartners(response.data.partners);
            } catch (error) {
                console.error("Error fetching schools:", error);
                toast.error("Error fetching schools.");
            }
        };
        fetchPartners();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${baseUrl}/api/students`);
            setUsers(response.data.students);
            setLoading(false);
        } catch (err) {
            let { response: { data: { message } } } = err;
            toast.error(message, {
                style: { border: "1px solid #ff0033", padding: "16px", color: "#ff0033" },
                iconTheme: { primary: "#ff0033", secondary: "#FFFAEE" },
            });
        } finally {
            setLoading(false);
        }
    };

    const handleAdmin = async (userId) => {
        try {
            const payload = { headers: { Authorization: elarniv_users_token } };
            const payloadData = { userId, admin: true };
            const response = await axios.put(`${baseUrl}/api/admin/make-admin`, payloadData, payload);
            toast.success(response.data.message, {
                style: { border: "1px solid #4BB543", padding: "16px", color: "#4BB543" },
                iconTheme: { primary: "#4BB543", secondary: "#FFFAEE" },
            });
            fetchData();
        } catch (err) {
            let { response: { data: { message } } } = err;
            toast.error(message, {
                style: { border: "1px solid #ff0033", padding: "16px", color: "#ff0033" },
                iconTheme: { primary: "#ff0033", secondary: "#FFFAEE" },
            });
        } finally {
            setLoading(false);
            fetchData();
        }
    };

    const handleAddStudent = async (e) => {
        e.preventDefault();
        if (!newStudent.school_id || !newStudent.class_id) {
            return toast.error("Grade and School are required.");
        }
        try {
            const payload = { headers: { Authorization: elarniv_users_token } };
            console.log("Sending newStudent:", newStudent);
            const response = await axios.post(`${baseUrl}/api/students`, newStudent, payload);
            toast.success(response.data.message, {
                style: { border: "1px solid #4BB543", padding: "16px", color: "#4BB543" },
                iconTheme: { primary: "#4BB543", secondary: "#FFFAEE" },
            });
            setNewStudent({
                first_name: '',
                last_name: '',
                email: '',
                my_course: 'DefaultCourse',
                password: '',
                phone: '',
                role: 'student',
                class_id: '',
                school_id: '',
            });
            fetchData();
            setShowForm(false);
        } catch (err) {
            let { response: { data: { message } } } = err;
            toast.error(message, {
                style: { border: "1px solid #ff0033", padding: "16px", color: "#ff0033" },
                iconTheme: { primary: "#ff0033", secondary: "#FFFAEE" },
            });
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <>
            <Navbar user={user} />
            <div className="main-content">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-lg-3 col-md-4">
                            <AdminSideNav user={user} />
                        </div>
                        <div className="col-lg-9 col-md-8">
                            <div className="main-content-box">
                                <ul className="nav-style1">
                                    <li><Link href="/admin/students/"><a className="active">Students</a></Link></li>
                                    <li></li>
                                </ul>
                                {!showForm && (
                                    <button className="btn btn-primary mb-3" onClick={() => setShowForm(true)}>
                                        Add New Student
                                    </button>
                                )}
                                {showForm && (
                                    <div className="add-new-student-form">
                                        <h4>Add New Student</h4>
                                        <form onSubmit={handleAddStudent}>
                                            <div className="mb-3">
                                                <label className="form-label">First Name:</label>
                                                <input type="text" name="first_name" className="form-control" value={newStudent.first_name} onChange={handleInputChange} required />
                                            </div>
                                            <div className="mb-3">
                                                <label className="form-label">Last Name:</label>
                                                <input type="text" name="last_name" className="form-control" value={newStudent.last_name} onChange={handleInputChange} required />
                                            </div>
                                            <div className="mb-3">
                                                <label className="form-label">Email:</label>
                                                <input type="email" name="email" className="form-control" value={newStudent.email} onChange={handleInputChange} required />
                                            </div>
                                            <div className="mb-3">
                                                <label className="form-label">Phone:</label>
                                                <input type="text" name="phone" className="form-control" value={newStudent.phone} onChange={handleInputChange} required />
                                            </div>
                                            <div className="mb-3">
                                                <label className="form-label">Password:</label>
                                                <input type="password" name="password" className="form-control" value={newStudent.password} onChange={handleInputChange} required />
                                            </div>
                                            <div className="mb-3">
                                                <label className="form-label">Grade:</label>
                                                <select name="class_id" className="form-control" value={newStudent.class_id} onChange={handleInputChange} required>
                                                    <option value="">Select Grade</option>
                                                    {[3, 4, 5, 6, 7, 8, 9].map((grade) => (
                                                        <option key={grade} value={grade.toString()}>{grade}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="mb-3">
                                                <label className="form-label">School:</label>
                                                <select name="school_id" className="form-select" value={newStudent.school_id} onChange={handleInputChange} required>
                                                    <option value="">Select a School</option>
                                                    {partners.map((partner) => (
                                                        <option key={partner.id} value={partner.id}>{partner.name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <button type="submit" className="btn btn-primary">Add Student</button>
                                            <button type="button" className="btn btn-secondary ml-2" onClick={() => setShowForm(false)}>Cancel</button>
                                        </form>
                                    </div>
                                )}
                                {loading ? (
                                    <GeneralLoader />
                                ) : (
                                    <div className="table-responsive">
                                        <table className="table align-middle table-hover fs-14">
                                            <thead>
                                                <tr>
                                                    <th scope="col">Name</th>
                                                    <th scope="col">Email</th>
                                                    <th scope="col">Phone</th>
                                                    <th scope="col">Grade</th>
                                                    <th scope="col">School</th>
                                                    <th scope="col"></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {users.length > 0 ? (
                                                    users.map((user) => (
                                                        <StudentsRaw 
                                                            key={user.id} 
                                                            {...user} 
                                                            schoolName={
                                                                partners.find(p => p.id === user.school_id)?.name || 'Unknown'
                                                            }
                                                            onAdmin={() => handleAdmin(user.id)}
                                                        />
                                                    ))
                                                ) : (
                                                    <tr><td colSpan="6" className="text-center py-3">Empty!</td></tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Index;