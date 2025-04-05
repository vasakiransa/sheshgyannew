import React from "react";
import Link from "next/link";

const BannerCourses = ({
	title,
	slug,
	short_desc,
	latest_price,
	before_price,
	lessons,
	image,
	user,
	enrolments,
}) => {
	return (
		<div className="col-md-6">
			<div className="single-courses-box" style={styles.container}>
				<div className="courses-image" style={styles.courseImage}>
					<Link href={`/course/${slug}`}>
						<a className="d-block image">
							<img src={image} alt={title} style={styles.image} />
						</a>
					</Link>

					<>
						{before_price > 0 && (
							<div className="price shadow discount-price" style={styles.discountPrice}>
								<del>${before_price}</del>
							</div>
						)}
						<div className="price shadow" style={styles.price}>${latest_price}</div>
					</>
				</div>

				<div className="courses-content" style={styles.courseContent}>
					<div className="course-author d-flex align-items-center" style={styles.author}>
						<img
							src={
								user.profile_photo
									? user.profile_photo
									: "/images/user6.jpg"
							}
							className="rounded-circle"
							alt="image"
							style={styles.authorImage}
						/>
						<span style={styles.authorName}>{`${user.first_name} ${user.last_name}`}</span>
					</div>

					<h3>
						<Link href={`/course/${slug}`}>
							<a title={title} style={styles.courseTitle}>{title.slice(0, 40)}...</a>
						</Link>
					</h3>

					<p style={styles.shortDesc}>{short_desc.slice(0, 108)}</p>

					<ul className="courses-box-footer d-flex justify-content-between align-items-center" style={styles.footer}>
						<li>
							<i className="flaticon-agenda"></i> {lessons} Lessons
						</li>
						<li>
							<i className="flaticon-people"></i> {enrolments && enrolments.length} Students
						</li>
					</ul>
				</div>

				<div className="student-image" style={styles.studentImageContainer}>
					<img src="/images/student-child.png" alt="Student" style={styles.studentImage} />
				</div>
			</div>
		</div>
	);
};

const styles = {
	container: {
		display: "flex",
		alignItems: "center",
		background: "#ffcc00",
		padding: "20px",
		borderRadius: "10px",
		boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
	},
	courseImage: {
		flex: 1,
	},
	image: {
		width: "100%",
		borderRadius: "10px",
	},
	price: {
		background: "#ff6600",
		padding: "5px 10px",
		borderRadius: "5px",
		color: "white",
		fontWeight: "bold",
	},
	discountPrice: {
		textDecoration: "line-through",
		color: "red",
	},
	courseContent: {
		flex: 2,
		padding: "20px",
	},
	author: {
		display: "flex",
		alignItems: "center",
	},
	authorImage: {
		width: "40px",
		height: "40px",
		borderRadius: "50%",
		marginRight: "10px",
	},
	authorName: {
		fontWeight: "bold",
	},
	courseTitle: {
		fontSize: "20px",
		fontWeight: "bold",
		color: "#333",
	},
	shortDesc: {
		color: "#555",
	},
	footer: {
		marginTop: "10px",
	},
	studentImageContainer: {
		flex: 1,
		textAlign: "right",
	},
	studentImage: {
		width: "150px",
		borderRadius: "10px",
	},
};

export default BannerCourses;