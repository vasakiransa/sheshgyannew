import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import './Pagination.css'; // Import CSS file

const Pagination = ({ pages, currentPage, onPageChange }) => {
    const handlePrevious = () => {
        if (currentPage > 0) {
            onPageChange(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < pages - 1) {
            onPageChange(currentPage + 1);
        }
    };

    return (
        <nav aria-label="Page Pagination">
            <ul className="pagination-container">
                {/* Previous Button */}
                <li>
                    <button 
                        onClick={handlePrevious} 
                        aria-label="Previous"
                        disabled={currentPage === 0}
                        className="pagination-btn"
                    >
                        <FontAwesomeIcon icon={faChevronLeft} />
                    </button>
                </li>

                {/* Page Numbers */}
                {Array.from({ length: pages }, (_, i) => i).map(page => (
                    <li key={page}>
                        <button
                            onClick={() => onPageChange(page)}
                            className={`pagination-number 
                                ${currentPage === page ? (page === pages - 1 ? "active-last" : "active-diamond") : ""}`}
                        >
                            <span>{page + 1}</span>
                        </button>
                    </li>
                ))}

                {/* Next Button */}
                <li>
                    <button 
                        onClick={handleNext} 
                        aria-label="Next"
                        disabled={currentPage === pages - 1}
                        className="pagination-btn"
                    >
                        <FontAwesomeIcon icon={faChevronRight} />
                    </button>
                </li>
            </ul>
        </nav>
    );
};

export default Pagination;
