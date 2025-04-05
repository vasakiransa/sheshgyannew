import React, { useEffect, useState } from "react";
import StickyBox from "react-sticky-box";
import Player from "@/components/Learning/Player";
import { useRouter } from "next/router";
import baseUrl from "@/utils/baseUrl";
import axios from "axios";
import { Spinner } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
import Sidebar from "./Sidebar";
import fs from "fs";
import path from "path";
import Link from "next/link";
config.autoAddCss = false;

const Index = ({ user, pageContent, totalPages, course }) => {
    const [selectedVideo, setSelectedVideo] = useState("");
    const [active, setActive] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [visitedPages, setVisitedPages] = useState(new Set([1]));
    const [quizSelections, setQuizSelections] = useState({});
    const [simulatorUrl, setSimulatorUrl] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

    const handleOpenSimulator = (simulatorData) => {
        if (simulatorData.type === "python") {
            setSimulatorUrl("https://iotsheshgyan.vercel.app/");
        } else {
            setSimulatorUrl("https://iotsheshgyan.vercel.app/");
        }
    };

    const handleCloseSimulator = () => {
        setSimulatorUrl(null);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
        setVisitedPages(prev => new Set(prev.add(page)));
        setSimulatorUrl(null);

        const currentContent = pageContent[page - 1];
        if (currentContent?.simulator !== undefined) {
            handleOpenSimulator(currentContent);
        }
    };

    const handleQuizSelection = (page, optionIndex) => {
        setQuizSelections(prev => ({
            ...prev,
            [page]: optionIndex
        }));
    };

    const handleMouseDown = (e) => {
        setIsDragging(true);
        setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    };

    const handleMouseMove = (e) => {
        if (isDragging) {
            setPosition({
                x: e.clientX - dragStart.x,
                y: e.clientY - dragStart.y
            });
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging]);

    const renderQuiz = (quizData) => {
        const userSelection = quizSelections[currentPage];
        const hasSelected = userSelection !== undefined;
        const correctIndex = quizData.options.findIndex(opt => opt.isCorrect);

        return (
            <div style={{
                background: "#f8f9fa",
                padding: "30px",
                borderRadius: "15px",
                width: "100%",
                maxWidth: "900px",
                margin: "0 auto",
                boxShadow: "0 6px 20px rgba(0, 0, 0, 0.08)"
            }}>
                <div style={{
                    background: "#ffffff",
                    padding: "25px",
                    borderRadius: "12px",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)"
                }}>
                    <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        background: "#e9ecef",
                        padding: "12px 20px",
                        borderRadius: "8px",
                        marginBottom: "20px"
                    }}>
                        <span style={{ fontWeight: "600", color: "#495057", fontSize: "1.1rem" }}>{currentPage}/{totalPages}</span>
                        <span style={{ color: "#007bff", fontWeight: "600", fontSize: "1.1rem" }}>Multiple Choice Question</span>
                    </div>
                    <h2 style={{ color: "#212529", marginBottom: "25px", fontSize: "1.75rem", fontWeight: "500" }}>{quizData.question}</h2>
                    <div>
                        {quizData.options.map((option, index) => {
                            const isSelected = userSelection === index;
                            const isCorrect = option.isCorrect;
                            let borderColor = "#ced4da";
                            let backgroundColor = "white";

                            if (hasSelected) {
                                if (isSelected) {
                                    borderColor = isCorrect ? "#28a745" : "#dc3545";
                                    backgroundColor = isCorrect ? "#e6ffe6" : "#ffe6e6";
                                } else if (isCorrect) {
                                    borderColor = "#28a745";
                                    backgroundColor = "#e6ffe6";
                                }
                            }

                            return (
                                <button
                                    key={index}
                                    onClick={() => !hasSelected && handleQuizSelection(currentPage, index)}
                                    disabled={hasSelected}
                                    style={{
                                        display: "flex",
                                        width: "100%",
                                        padding: "15px 20px",
                                        borderRadius: "10px",
                                        border: `2px solid ${borderColor}`,
                                        background: backgroundColor,
                                        margin: "12px 0",
                                        cursor: hasSelected ? "default" : "pointer",
                                        alignItems: "center",
                                        textAlign: "left",
                                        fontSize: "1.1rem",
                                        transition: "all 0.3s"
                                    }}
                                >
                                    <span style={{
                                        width: "35px",
                                        height: "35px",
                                        background: borderColor,
                                        color: "white",
                                        borderRadius: "50%",
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        marginRight: "15px",
                                        flexShrink: 0,
                                        fontSize: "1rem"
                                    }}>{index + 1}</span>
                                    {option.type === "text" ? (
                                        <span style={{ color: "#495057" }}>{option.value}</span>
                                    ) : (
                                        <img src={option.value} alt={`Option ${index + 1}`} style={{ maxWidth: "120px", maxHeight: "120px", marginLeft: "10px" }} />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                    {hasSelected && (
                        <p style={{ marginTop: "20px", color: userSelection === correctIndex ? "#28a745" : "#dc3545", fontWeight: "600", fontSize: "1.1rem" }}>
                            {userSelection === correctIndex ? "Correct! Well done!" : `Incorrect. The correct answer is option ${correctIndex + 1}.`}
                        </p>
                    )}
                </div>
            </div>
        );
    };

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "300px" }}>
                    <Spinner animation="border" role="status" style={{ color: "#007bff" }}>
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                </div>
            );
        }

        if (!pageContent || pageContent.length === 0) {
            return (
                <div className="alert alert-danger" style={{ borderRadius: "10px", padding: "20px", fontSize: "1.1rem" }}>
                    Error: Could not load course data.
                </div>
            );
        }

        const currentContent = pageContent[currentPage - 1];

        if (simulatorUrl) {
            return (
                <div className="simulator-content" style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100vw",
                    height: "100vh",
                    background: "#ffffff",
                    zIndex: 1000,
                    padding: "20px"
                }}>
                    <div style={{ 
                        display: "flex", 
                        justifyContent: "space-between", 
                        alignItems: "center", 
                        marginBottom: "20px",
                        padding: "0 20px"
                    }}>
                        <h2 style={{ color: "#212529", fontSize: "1.75rem", fontWeight: "500" }}>
                            {simulatorUrl.includes("blockly") ? "Blockly Editor" : "Virtual Simulator"}
                        </h2>
                        <button 
                            onClick={handleCloseSimulator}
                            style={{
                                padding: "10px 20px",
                                fontSize: "1rem",
                                backgroundColor: "#dc3545",
                                color: "white",
                                borderRadius: "8px",
                                border: "none",
                                cursor: "pointer"
                            }}
                        >
                            Close
                        </button>
                    </div>
                    <iframe
                        src={simulatorUrl}
                        style={{ 
                            width: "100%", 
                            height: "calc(100vh - 80px)", 
                            border: "none", 
                            borderRadius: "10px",
                            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)"
                        }}
                        title={simulatorUrl.includes("blockly") ? "Blockly Editor" : "Virtual Simulator"}
                    />
                </div>
            );
        }

        if (currentContent.text) {
            return (
                <div className="text-content" style={{
                    padding: "30px",
                    background: "#ffffff",
                    borderRadius: "15px",
                    boxShadow: "0 6px 20px rgba(0, 0, 0, 0.08)",
                    maxWidth: "900px",
                    margin: "0 auto"
                }}>
                    <h2 style={{ color: "#212529", marginBottom: "20px", fontSize: "1.75rem", fontWeight: "500" }}>Text Content</h2>
                    <div dangerouslySetInnerHTML={{ __html: currentContent.text }} style={{ fontSize: "1.15rem", lineHeight: "1.8", color: "#495057" }} />
                </div>
            );
        } else if (currentContent.simulator !== undefined) {
            return (
                <div className="simulator-content" style={{
                    padding: "30px",
                    background: "#ffffff",
                    borderRadius: "15px",
                    boxShadow: "0 6px 20px rgba(0, 0, 0, 0.08)",
                    maxWidth: "900px",
                    margin: "0 auto"
                }}>
                    <h2 style={{ color: "#212529", marginBottom: "20px", fontSize: "1.75rem", fontWeight: "500" }}>Simulator</h2>
                    <button className="btn" onClick={() => handleOpenSimulator(currentContent)} style={{
                        padding: "12px 30px",
                        fontSize: "1.1rem",
                        backgroundColor: "#007bff",
                        color: "white",
                        borderRadius: "8px",
                        border: "none",
                        transition: "background-color 0.3s"
                    }}>
                        Open {currentContent.type === "python" ? "Blockly" : "Virtual"} Simulator
                    </button>
                    {currentContent.simulator && (
                        <pre style={{ marginTop: "20px", background: "#f8f9fa", padding: "15px", borderRadius: "8px", fontSize: "1rem", color: "#495057" }}>{currentContent.simulator}</pre>
                    )}
                </div>
            );
        } else if (currentContent.quiz) {
            return <div className="quiz-content">{renderQuiz(currentContent.quiz)}</div>;
        } else if (currentContent.video) {
            return (
                <div className="video-player-container" style={{
                    padding: "30px",
                    background: "#ffffff",
                    borderRadius: "15px",
                    boxShadow: "0 6px 20px rgba(0, 0, 0, 0.08)",
                    maxWidth: "900px",
                    margin: "0 auto"
                }}>
                    <h2 style={{ color: "#212529", marginBottom: "20px", fontSize: "1.75rem", fontWeight: "500" }}>{currentContent.video}</h2>
                    <Player src={currentContent.url} />
                </div>
            );
        } else if (currentContent.url) {
            return (
                <div className="asset-content" style={{
                    padding: "30px",
                    background: "#ffffff",
                    borderRadius: "15px",
                    boxShadow: "0 6px 20px rgba(0, 0, 0, 0.08)",
                    maxWidth: "900px",
                    margin: "0 auto"
                }}>
                    <h2 style={{ color: "#212529", marginBottom: "20px", fontSize: "1.75rem", fontWeight: "500" }}>Asset</h2>
                    <a href={currentContent.url} target="_blank" rel="noopener noreferrer" className="btn" style={{
                        padding: "12px 30px",
                        fontSize: "1.1rem",
                        backgroundColor: "#007bff",
                        color: "white",
                        borderRadius: "8px",
                        border: "none",
                        transition: "background-color 0.3s"
                    }}>
                        Download Asset
                    </a>
                </div>
            );
        }

        return (
            <p style={{
                padding: "30px",
                background: "#ffffff",
                borderRadius: "15px",
                boxShadow: "0 6px 20px rgba(0, 0, 0, 0.08)",
                maxWidth: "900px",
                margin: "0 auto",
                fontSize: "1.15rem",
                color: "#495057"
            }}>
                No content available for this page.
            </p>
        );
    };

    const renderPagination = () => {
        const isPageVisited = (page) => visitedPages.has(page);
        const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

        return (
            <div style={{
                display: "flex",
                alignItems: "center",
                gap: "8px"
            }}>
                <button 
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    style={{
                        background: "transparent",
                        border: "none",
                        color: "#ffffff",
                        padding: "8px",
                        cursor: currentPage === 1 ? "not-allowed" : "pointer",
                        opacity: currentPage === 1 ? 0.5 : 1
                    }}
                >
                    <FontAwesomeIcon icon={faChevronLeft} />
                </button>
                {pages.map(page => (
                    <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        style={{
                            width: "35px",
                            height: "35px",
                            borderRadius: "50%",
                            border: "none",
                            backgroundColor: isPageVisited(page) ? "#28a745" : (currentPage === page ? "#007bff" : "rgba(255, 255, 255, 0.1)"),
                            color: "white",
                            fontSize: "1rem",
                            fontWeight: "500",
                            cursor: "pointer",
                            transition: "all 0.3s",
                            "&:hover": {
                                backgroundColor: isPageVisited(page) ? "#218838" : (currentPage === page ? "#0056b3" : "rgba(255, 255, 255, 0.2)")
                            }
                        }}
                    >
                        {page}
                    </button>
                ))}
                <button 
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    style={{
                        background: "transparent",
                        border: "none",
                        color: "#ffffff",
                        padding: "8px",
                        cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                        opacity: currentPage === totalPages ? 0.5 : 1
                    }}
                >
                    <FontAwesomeIcon icon={faChevronRight} />
                </button>
            </div>
        );
    };

    return (
        <div className="video-area" style={{ 
            background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)", 
            minHeight: "100vh", 
            padding: "40px 0",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
        }}>
            <div className="container-fluid" style={{ 
                maxWidth: "1400px",
                position: "relative",
                left: position.x,
                top: position.y
            }}>
                {/* Title Bar */}
                <div 
                    style={{
                        background: "#1a1a1a",
                        padding: "15px 25px",
                        borderRadius: "12px 12px 0 0",
                        cursor: "move",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        userSelect: "none",
                        position: "sticky",
                        top: 0,
                        zIndex: 1000,
                        boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
                        width: "100%"
                    }}
                    onMouseDown={handleMouseDown}
                >
                    <Link href="/" passHref>
                        <a style={{
                            textDecoration: "none",
                            color: "#ffffff",
                            background: "linear-gradient(90deg, #ff416c, #ff4b2b)",
                            padding: "8px 20px",
                            borderRadius: "20px",
                            display: "inline-flex",
                            alignItems: "center",
                            fontSize: "1rem",
                            fontWeight: "600",
                            transition: "transform 0.3s, box-shadow 0.3s",
                            boxShadow: "0 4px 15px rgba(255, 75, 43, 0.3)",
                            "&:hover": {
                                transform: "translateY(-2px)",
                                boxShadow: "0 6px 20px rgba(255, 75, 43, 0.4)"
                            }
                        }}>
                            <FontAwesomeIcon icon={faChevronLeft} style={{ marginRight: "8px" }} />
                            Back to Courses
                        </a>
                    </Link>
                    <span style={{ 
                        color: "#ffffff", 
                        fontSize: "1.3rem",
                        fontWeight: "600",
                        letterSpacing: "0.5px",
                        textShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                        flex: 1,
                        textAlign: "center"
                    }}>
                        {course.title || "Course Learning Platform"}
                    </span>
                    {renderPagination()}
                </div>

                {/* Centered Content */}
                <div style={{ 
                    background: "#ffffff", 
                    borderRadius: "0 0 12px 12px", 
                    padding: "30px",
                    boxShadow: "0 8px 25px rgba(0, 0, 0, 0.1)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: "70vh"
                }}>
                    <div className="col-lg-9 col-md-8" style={{ width: "100%" }}>
                        <div className="video-content">
                            {renderContent()}
                        </div>
                    </div>
                    {!simulatorUrl && (
                        <div className="col-lg-3 col-md-4" style={{ width: "25%" }}>
                            <StickyBox offsetTop={20} offsetBottom={20}>
                                <Sidebar
                                    totalPages={totalPages}
                                    currentPage={currentPage}
                                    onPageChange={handlePageChange}
                                    visitedPages={visitedPages}
                                />
                            </StickyBox>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export async function getServerSideProps(context) {
    const { slug } = context.params;
    const basePath = path.join(process.cwd(), "data", "course-content");
    const courseId = "81551162-64ed-44da-8b38-7b40f2145923";

    try {
        const url = `${baseUrl}/api/learnings/videos/${slug}`;
        const response = await axios.get(url);
        const { course } = response.data;

        const coursePath = path.join(basePath, courseId);
        const pageContent = [];
        let pageNum = 1;

        while (true) {
            const infoFilePath = path.join(coursePath, `page-${pageNum}.info.json`);
            const quizFilePath = path.join(coursePath, `page-${pageNum}.quiz.json`);
            let content = {};

            try {
                if (fs.existsSync(infoFilePath)) {
                    content = JSON.parse(fs.readFileSync(infoFilePath, "utf8"));
                } else if (fs.existsSync(quizFilePath)) {
                    content = JSON.parse(fs.readFileSync(quizFilePath, "utf8"));
                } else {
                    break;
                }
                pageContent.push(content);
                pageNum++;
            } catch (err) {
                if (err.code === "ENOENT") break;
                throw err;
            }
        }

        return {
            props: {
                pageContent,
                totalPages: pageContent.length,
                course,
                user: context.req.user || null
            }
        };
    } catch (error) {
        console.error("Error in getServerSideProps:", error);
        return {
            props: {
                pageContent: [],
                totalPages: 0,
                course: {},
                user: context.req.user || null
            }
        };
    }
}

export default Index;