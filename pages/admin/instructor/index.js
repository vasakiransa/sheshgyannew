import React, { useState, useEffect } from "react";
import Navbar from "@/components/_App/Navbar";
import Link from "next/link";
import Footer from "@/components/_App/Footer";
import AdminSideNav from "@/components/_App/AdminSideNav";
import InstructorsRow from "@/components/Admin/InstructorRow";
import toast from "react-hot-toast";
import axios from "axios";
import baseUrl from "@/utils/baseUrl";
import GeneralLoader from "@/utils/GeneralLoader";
import { parseCookies } from "nookies";

const Instructors = ({ user }) => {
    const { elarniv_users_token } = parseCookies();
    const [instructors, setInstructors] = useState([]);
    const [partners, setPartners] = useState([]); // State to hold schools (partners)
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [newInstructor, setNewInstructor] = useState({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        phone: "",
        role: "instructor",
        
        school_id: "", // School selection dropdown
    });

    // Fetch schools (partners) for dropdown
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

    // Fetch instructors
    const fetchInstructors = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${baseUrl}/api/instructor`);
            setInstructors(response.data.instructors);
        } catch (err) {
            toast.error(err.response?.data?.message || "Error fetching instructors");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInstructors();
    }, []);

    // Handle input changes for new instructor form
    const handleInputChange = (e) => {
        setNewInstructor({ ...newInstructor, [e.target.name]: e.target.value });
    };

    // Handle form submission for adding a new instructor
    const handleAddInstructor = async (e) => {
        e.preventDefault();
        if (!newInstructor.partner_id) {
            return toast.error("Please select a school");
        }

        try {
            const response = await axios.post(`${baseUrl}/api/instructor`, newInstructor, {
                headers: { Authorization: elarniv_users_token },
            });
            toast.success(response.data.message);
            setNewInstructor({
                first_name: "",
                last_name: "",
                email: "",
                password: "",
                phone: "",
                role: "instructor",
                
                school_id: "",
            });
            fetchInstructors();
            setShowForm(false);
        } catch (err) {
            toast.error(err.response?.data?.message || "Error adding instructor");
        }
    };

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
                                {/* Navigation */}
                                <ul className="nav-style1">
                                    <li>
                                        <Link href="/admin/instructors/">
                                            <a className="active">Instructors</a>
                                        </Link>
                                    </li>
                                </ul>

                                {/* Add New Instructor Form */}
                                {!showForm && (
                                    <button
                                        className="btn btn-primary mb-3"
                                        onClick={() => setShowForm(true)}
                                    >
                                        Add New Instructor
                                    </button>
                                )}
                                {showForm && (
                                    <div className="add-new-instructor-form">
                                        <h4>Add New Instructor</h4>
                                        <form onSubmit={handleAddInstructor}>
                                            {/* First Name */}
                                            <div className="mb-3">
                                                <label className="form-label">First Name:</label>
                                                <input
                                                    type="text"
                                                    name="first_name"
                                                    className="form-control"
                                                    value={newInstructor.first_name}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </div>

                                            {/* Last Name */}
                                            <div className="mb-3">
                                                <label className="form-label">Last Name:</label>
                                                <input
                                                    type="text"
                                                    name="last_name"
                                                    className="form-control"
                                                    value={newInstructor.last_name}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </div>

                                            {/* Email */}
                                            <div className="mb-3">
                                                <label className="form-label">Email:</label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    className="form-control"
                                                    value={newInstructor.email}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </div>

                                            {/* Phone */}
                                            <div className="mb-3">
                                                <label className="form-label">Phone:</label>
                                                <input
                                                    type="text"
                                                    name="phone"
                                                    className="form-control"
                                                    value={newInstructor.phone}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </div>

                                            {/* Password */}
                                            <div className="mb-3">
                                                <label className="form-label">Password:</label>
                                                <input
                                                    type="password"
                                                    name="password"
                                                    className="form-control"
                                                    value={newInstructor.password}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </div>

                                        
                                            {/* School Dropdown */}
                                            <div className="mb-3">
                                                <label className="form-label">School:</label>
                                                <select
                                                    name="school_id"
                                                    className="form-select"
                                                    value={newInstructor.school_id}
                                                    onChange={handleInputChange}
                                                    required
                                                >
                                                    <option value="">Select a School</option>
                                                    {partners.map((partner) => (
                                                        <option key={partner.id} value={partner.id}>
                                                            {partner.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            {/* Buttons */}
                                            <button type="submit" className="btn btn-primary">
                                                Add Instructor
                                            </button>
                                            <button
                                                type="button"
                                                className="btn btn-secondary ml-2"
                                                onClick={() => setShowForm(false)}
                                            >
                                                Cancel
                                            </button>
                                        </form>
                                    </div>
                                )}

                                {/* Instructors Table */}
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
                                                    <th scope="col">Subject</th>
                                                    <th scope="col">School</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {instructors.length > 0 ? (
                                                    instructors.map((instructor) => (
                                                        <InstructorsRow key={instructor.id} {...instructor} />
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan="5" className="text-center py-3">
                                                            No instructors found!
                                                        </td>
                                                    </tr>
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

            {/* Footer */}
            <Footer />
        </>
    );
};

export default Instructors;
