import React from "react";

const Sidebar = ({ totalPages, currentPage, onPageChange, visitedPages }) => {
    return (
        <div className="sidebar" style={{
            background: "#fff",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
            marginBottom: "20px"
        }}>
            <h3 style={{ color: "#0078D7", marginBottom: "15px" }}>Course Pages</h3>
            <ul style={{ listStyle: "none", padding: 0 }}>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <li key={page} style={{ marginBottom: "10px" }}>
                        <button
                            onClick={() => onPageChange(page)}
                            style={{
                                width: "100%",
                                textAlign: "left",
                                padding: "10px",
                                borderRadius: "5px",
                                border: "none",
                                background: currentPage === page ? "#0078D7" : visitedPages.has(page) ? "#28a745" : "#f8f9fa",
                                color: currentPage === page ? "white" : "#333",
                                cursor: "pointer",
                                fontSize: "1rem"
                            }}
                        >
                            Page {page}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Sidebar;