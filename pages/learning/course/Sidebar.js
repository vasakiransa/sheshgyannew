import React, { useState, useEffect } from "react";

const Sidebar = ({ totalPages, currentPage, onPageChange, visitedPages }) => {
    const [isOpen, setIsOpen] = useState(false);
    // const [prevButtonColor, setPrevButtonColor] = useState('#343a40'); // Initial color

    // useEffect(() => {
    //     // Change color when currentPage is greater than 1 (not on the first page)
    //     if (currentPage > 1) {
    //         setPrevButtonColor('green');
    //     } else {
    //         setPrevButtonColor('#343a40'); // Reset to original color on first page
    //     }
    // }, [currentPage]);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    return (
        <div
            className={`sidebar ${isOpen ? "open" : ""}`}
            style={{
                position: "fixed",
                top: "115px",
                right: 0, // Changed from left: 0
                height: "100%",
                width: isOpen ? "250px" : "90px",
                backgroundColor: "#343a40",
                color: "white",
                transition: "width 0.3s ease-in-out",
                overflowX: "hidden",
                paddingTop: "60px",
                zIndex: 1000,
            }}
        >
            {/* Toggle Button - positioned at the top */}
            <button
  onClick={handleNextPage}
  style={{
    position: "absolute",
    top: "10px",
    left: "50%",
    transform: "translateX(-50%)",
    background: "gold",
    color: "#343a40",
    border: "none",
    padding: "10px",
    cursor: "pointer",
    borderRadius: "5px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center", // Center the arrow horizontally
  }}
>
  <i
    className="bx bx-chevron-right bx-sm" // Right arrow
    style={{ fontSize: "1.5rem" }}
  ></i>
</button>


            {/* Scroll Buttons (Up) */}
            <div
                style={{
                    position: "absolute",
                    top: "50px", // Position below the toggle
                    left: "50%",
                    transform: "translateX(-50%)",
                    display: isOpen ? "none" : "block",
                }}
            >
                <i
                    className="bx bxs-chevron-up"
                    style={{
                        fontSize: "2rem",
                        color: currentPage > 1 ? "green" : "#343a40",
                        cursor: "pointer",
                        transition: 'color 0.3s ease' // Smooth transition
                    }}
                    onClick={handlePrevPage}
                ></i>
            </div>

            {/* Info Button - Increased Size */}
            <div
                style={{
                    position: "absolute",
                    top: "20%",  // Center vertically
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    display: isOpen ? "none" : "block",
                }}
            >
                <div
                    style={{
                        width: "60px",  // Increased width and height
                        height: "60px",
                        borderRadius: "50%",
                        backgroundColor: "Gainsboro",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                    }}
                >
                    <i
                        className="bx bx-info-circle"
                        style={{ fontSize: "2.5rem", color: "DodgerBlue" }} // Increased font size
                    ></i>
                </div>
            </div>

          
                
                   
                    
                   
            
        
        </div>
    );
};

export default Sidebar;
