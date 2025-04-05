import React, { useState, useEffect } from "react";
import Navbar from "@/components/_App/Navbar";
import Footer from "@/components/_App/Footer";
import AdminSideNav from "@/components/_App/AdminSideNav";
import Link from "next/link";
import toast from "react-hot-toast";
import axios from "axios";
import baseUrl from "@/utils/baseUrl";
import GeneralLoader from "@/utils/GeneralLoader";

const Index = ({ user }) => {
    const [partners, setPartners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPartner, setSelectedPartner] = useState(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${baseUrl}/api/partners`);
            setPartners(response.data.partners);
            setLoading(false);
        } catch (err) {
            let {
                response: {
                    data: { message },
                },
            } = err;
            toast.error(message, {
                style: {
                    border: "1px solid #ff0033",
                    padding: "16px",
                    color: "#ff0033",
                },
                iconTheme: {
                    primary: "#ff0033",
                    secondary: "#FFFAEE",
                },
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = async (partnerId) => {
        try {
            const payload = {
                params: { partnerId },
            };
            const response = await axios.delete(
                `${baseUrl}/api/partners/create`,
                payload
            );
            toast.success(response.data.message, {
                style: {
                    border: "1px solid #4BB543",
                    padding: "16px",
                    color: "#4BB543",
                },
                iconTheme: {
                    primary: "#4BB543",
                    secondary: "#FFFAEE",
                },
            });
            fetchData();
        } catch (err) {
            let {
                response: {
                    data: { message },
                },
            } = err;
            toast.error(message, {
                style: {
                    border: "1px solid #ff0033",
                    padding: "16px",
                    color: "#ff0033",
                },
                iconTheme: {
                    primary: "#ff0033",
                    secondary: "#FFFAEE",
                },
            });
        } finally {
            fetchData();
        }
    };

    const PartnerDetails = ({ partner }) => (
        <div className="partner-details-modal" style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
            padding: '2.5rem',
            borderRadius: '15px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
            zIndex: 1000,
            width: '85%',
            maxWidth: '900px',
            maxHeight: '85vh',
            overflowY: 'auto',
            border: '1px solid rgba(0,0,0,0.05)'
        }}>
            <button 
                onClick={() => setSelectedPartner(null)}
                style={{
                    position: 'absolute',
                    right: '1.5rem',
                    top: '1.5rem',
                    padding: '0.5rem 1.5rem',
                    background: 'linear-gradient(45deg, #ff0033, #ff3366)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '25px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    transition: 'all 0.3s ease',
                    ':hover': {
                        transform: 'scale(1.05)',
                        boxShadow: '0 5px 15px rgba(255,0,51,0.3)'
                    }
                }}
            >
                Close
            </button>
            
            <h2 style={{
                color: '#2c3e50',
                marginBottom: '2rem',
                borderBottom: '2px solid #3498db',
                paddingBottom: '0.5rem',
                fontWeight: '700'
            }}>
                {partner.name}
            </h2>
            
            <div className="details-section" style={{ marginBottom: '2rem' }}>
                <h3 style={{ color: '#2980b9', marginBottom: '1rem' }}>Contact Information</h3>
                <div style={{ background: 'rgba(52,152,219,0.1)', padding: '1.5rem', borderRadius: '10px' }}>
                    <p><strong>Email:</strong> <span style={{ color: '#7f8c8d' }}>{partner.email}</span></p>
                    <p><strong>Phone 1:</strong> <span style={{ color: '#7f8c8d' }}>{partner.phone_number1}</span></p>
                    <p><strong>Phone 2:</strong> <span style={{ color: '#7f8c8d' }}>{partner.phone_number2}</span></p>
                    <p><strong>Contact:</strong> <span style={{ color: '#7f8c8d' }}>{partner.contact_person}</span></p>
                    <p><strong>Address:</strong> <span style={{ color: '#7f8c8d' }}>{partner.address}</span></p>
                </div>
            </div>

            <div className="details-section" style={{ marginBottom: '2rem' }}>
                <h3 style={{ color: '#2980b9', marginBottom: '1rem' }}>School Details</h3>
                <div style={{ background: 'rgba(46,204,113,0.1)', padding: '1.5rem', borderRadius: '10px' }}>
                    <p><strong>Students:</strong> <span style={{ color: '#7f8c8d' }}>{partner.student_count || 'N/A'}</span></p>
                    <p><strong>Grades:</strong> <span style={{ color: '#7f8c8d' }}>{partner.grade_count || 'N/A'}</span></p>
                    <p><strong>Established:</strong> <span style={{ color: '#7f8c8d' }}>{partner.established_date || 'N/A'}</span></p>
                    <p><strong>Type:</strong> <span style={{ color: '#7f8c8d' }}>{partner.school_type || 'N/A'}</span></p>
                </div>
            </div>

            <div className="details-section">
                <h3 style={{ color: '#2980b9', marginBottom: '1rem' }}>Analytics</h3>
                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                    gap: '1rem' 
                }}>
                    {[
                        { title: 'Student Growth', value: `${partner.student_growth_rate || 'N/A'}%`, color: '#3498db' },
                        { title: 'Attendance', value: `${partner.attendance_rate || 'N/A'}%`, color: '#2ecc71' },
                        { title: 'Staff Count', value: partner.staff_count || 'N/A', color: '#e74c3c' },
                        { title: 'Performance', value: `${partner.performance_score || 'N/A'}/100`, color: '#f1c40f' }
                    ].map((item) => (
                        <div key={item.title} style={{
                            background: 'white',
                            padding: '1rem',
                            borderRadius: '10px',
                            boxShadow: '0 5px 15px rgba(0,0,0,0.05)',
                            borderLeft: `5px solid ${item.color}`,
                            transition: 'all 0.3s ease',
                            ':hover': {
                                transform: 'translateY(-5px)',
                                boxShadow: '0 8px 20px rgba(0,0,0,0.1)'
                            }
                        }}>
                            <h4 style={{ color: item.color, marginBottom: '0.5rem' }}>{item.title}</h4>
                            <p style={{ fontSize: '1.2rem', fontWeight: '600', color: '#2c3e50' }}>{item.value}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

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
                            <div className="main-content-box" style={{
                                background: 'white',
                                borderRadius: '15px',
                                boxShadow: '0 5px 20px rgba(0,0,0,0.05)',
                                padding: '2rem'
                            }}>
                                <ul className="nav-style1">
                                    <li>
                                        <Link href="/admin/partners/">
                                            <a className="active">Partners</a>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/admin/partners/create/">
                                            <a>Create</a>
                                        </Link>
                                    </li>
                                </ul>

                                {loading ? (
                                    <GeneralLoader />
                                ) : (
                                    <div className="table-responsive">
                                        <table className="table align-middle table-hover fs-14" style={{
                                            borderRadius: '10px',
                                            overflow: 'hidden',
                                            background: 'white'
                                        }}>
                                            <thead style={{ background: '#3498db', color: 'white' }}>
                                                <tr>
                                                    <th scope="col">Name</th>
                                                    <th scope="col">Image</th>
                                                    <th scope="col">Phone number1</th>
                                                    <th scope="col">Phone number2</th>
                                                    <th scope="col">Email Address</th>
                                                    <th scope="col">Contact person</th>
                                                    <th scope="col">Address</th>
                                                    <th scope="col">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {partners.length > 0 ? (
                                                    partners.map((partner) => (
                                                        <tr 
                                                            key={partner.id}
                                                            onClick={() => setSelectedPartner(partner)}
                                                            style={{ 
                                                                cursor: 'pointer',
                                                                transition: 'all 0.3s ease',
                                                                ':hover': {
                                                                    background: '#f8f9fa',
                                                                    transform: 'translateY(-2px)'
                                                                }
                                                            }}
                                                        >
                                                            <td style={{ fontWeight: '600', color: '#2c3e50' }}>{partner.name}</td>
                                                            <td>
                                                                <img 
                                                                    src={partner.image || '/default-image.jpg'} 
                                                                    alt={partner.name} 
                                                                    style={{ 
                                                                        width: '50px', 
                                                                        height: '50px', 
                                                                        objectFit: 'cover',
                                                                        borderRadius: '5px',
                                                                        boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                                                                    }}
                                                                />
                                                            </td>
                                                            <td>{partner.phone_number1}</td>
                                                            <td>{partner.phone_number2}</td>
                                                            <td>{partner.email}</td>
                                                            <td>{partner.contact_person}</td>
                                                            <td>{partner.address}</td>
                                                            <td>
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleDelete(partner.id);
                                                                    }}
                                                                    style={{
                                                                        background: 'linear-gradient(45deg, #e74c3c, #c0392b)',
                                                                        border: 'none',
                                                                        padding: '0.5rem 1rem',
                                                                        borderRadius: '25px',
                                                                        color: 'white',
                                                                        transition: 'all 0.3s ease'
                                                                    }}
                                                                >
                                                                    Delete
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan="8" className="text-center py-3">
                                                            Empty!
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

            {selectedPartner && (
                <>
                    <div 
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'rgba(0,0,0,0.6)',
                            zIndex: 999,
                            backdropFilter: 'blur(3px)'
                        }}
                        onClick={() => setSelectedPartner(null)}
                    />
                    <PartnerDetails partner={selectedPartner} />
                </>
            )}

            <Footer />
        </>
    );
};

export default Index;