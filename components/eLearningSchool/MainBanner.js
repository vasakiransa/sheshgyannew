import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import BannerCourses from "./BannerCourses";

const MainBanner = ({ user, courses }) => {
	return (
		<>
			<div className="main-banner" style={styles.bannerContainer}>
				<div className="container-fluid">
					<div className="row align-items-center">
						{/* Left Content */}
						<div className="col-lg-6 col-md-12" style={styles.contentContainer}>
							<h1 style={styles.title}>Empower Your Learning Journey with SheshGyan</h1>
							<p style={styles.description}>
								Unlock endless learning possibilities with flexible, engaging, and interactive courses. Elevate your skills and embrace the future of education.
							</p>

							<motion.div whileTap={{ scale: 1.1 }}>
								{user ? (
									<Link href="/courses">
									<a className="default-btn" style={styles.button}>
										<i className="flaticon-user" style={{ marginRight: '8px' }}></i> {/* Add margin here */}
										Explore Courses <span></span>
									</a>
								</Link>
								
								) : (
									<Link href="/authentication">
										<a className="default-btn" style={styles.button}>
											<i className="flaticon-user"></i> Get Started <span></span>
										</a>
									</Link>
								)}
							</motion.div>
						</div>

						{/* Right Section with Student Image and Courses */}
						<div className="col-lg-6 col-md-12" style={styles.rightContainer}>
							<div className="student-image" style={styles.studentImageContainer}>
								<img src="/images/student-child.jpg" alt="Student" style={styles.studentImage} />
							</div>
							<div className="main-banner-courses-list" style={styles.coursesContainer}>
								<div className="row">
									{courses && courses.map((course) => (
										<BannerCourses key={course.id} {...course} />
									))}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

const styles = {
	bannerContainer: {
		background: "linear-gradient(135deg, #ffcc00, #ff8800)",
		padding: "100px 20px",
		borderRadius: "25px",
		boxShadow: "0px 15px 40px rgba(0, 0, 0, 0.2)",
	},
	contentContainer: {
		color: "black",
		padding: "40px",
	},
	title: {
		fontSize: "48px",
		fontWeight: "bold",
		lineHeight: "1.2",
		color: "#333",
		textShadow: "2px 2px 12px rgba(0, 0, 0, 0.2)",
	},
	description: {
		fontSize: "22px",
		color: "#444",
		marginTop: "15px",
		lineHeight: "1.6",
	},
	button: {
		background: "#ff5500",
		padding: "14px 28px",
		borderRadius: "10px",
		color: "white",
		fontWeight: "bold",
		fontSize: "18px",
		transition: "all 0.3s ease",
		boxShadow: "0px 6px 18px rgba(0, 0, 0, 0.3)",
	},
	rightContainer: {
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		padding: "30px",
	},
	studentImageContainer: {
		textAlign: "center",
		marginBottom: "20px",
	},
	studentImage: {
		width: "320px",
		borderRadius: "20px",
		boxShadow: "0px 12px 35px rgba(0, 0, 0, 0.3)",
	},
	coursesContainer: {
		width: "100%",
		padding: "25px",
		borderRadius: "20px",
		background: "white",
		boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.15)",
	},
};

export default MainBanner;