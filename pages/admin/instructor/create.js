import React, { useState, useEffect } from "react";
import Navbar from "@/components/_App/Navbar";
import Footer from "@/components/_App/Footer";
import AdminSideNav from "@/components/_App/AdminSideNav";
import Link from "next/link";
import axios from "axios";
import baseUrl from "@/utils/baseUrl";
import LoadingSpinner from "@/utils/LoadingSpinner";
import toast from "react-hot-toast";
import { useRouter } from "next/router";

const INIT_INSTRUCTOR = {
	first_name: "",
	last_name: "",
	email: "",
	phone: "",
	instructor_subject: "",
	instructor_description: "",
	partner_id: "", // added partner_id
};

const Create = ({ user }) => {
	const router = useRouter();
	const [instructor, setInstructor] = useState(INIT_INSTRUCTOR);
	const [loading, setLoading] = useState(false);
	const [disabled, setDisabled] = useState(true);
	const [partners, setPartners] = useState([]); // State to hold partners for dropdown

	useEffect(() => {
		const isInstructor = Object.values(instructor).every((el) => Boolean(el));
		isInstructor ? setDisabled(false) : setDisabled(true);
	}, [instructor]);

	useEffect(() => {
		// Fetch partners for the dropdown
		const fetchPartners = async () => {
			try {
				const response = await axios.get(`${baseUrl}/api/partners`);
				setPartners(response.data.partners);
			} catch (error) {
				console.error("Error fetching partners:", error);
				toast.error("Error fetching partners.");
			}
		};

		fetchPartners();
	}, []);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setInstructor((prevState) => ({ ...prevState, [name]: value }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			setLoading(true);

			const url = `${baseUrl}/api/instructor/create`;
			const {
				first_name,
				last_name,
				email,
				phone,
				instructor_subject,
				instructor_description,
				partner_id,
			} = instructor;
			const payload = {
				first_name,
				last_name,
				email,
				phone,
				instructor_subject,
				instructor_description,
				partner_id,
			};

			const response = await axios.post(url, payload);
			setLoading(false);

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
			router.push("/admin/instructor");
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
								{/* Nav */}
								<ul className="nav-style1">
									<li>
										<Link href="/admin/instructor/">
											<a>Instructors</a>
										</Link>
									</li>
									<li>
										<Link href="/admin/instructor/create/">
											<a className="active">Create</a>
										</Link>
									</li>
								</ul>

								{/* Form */}
								<form onSubmit={handleSubmit}>
									<div className="row">
										<div className="col-md-6">
											<div className="form-group">
												<label className="form-label fw-semibold">
													First Name
												</label>
												<input
													type="text"
													className="form-control"
													name="first_name"
													value={instructor.first_name}
													onChange={handleChange}
													required={true}
												/>
											</div>
										</div>
										<div className="col-md-6">
											<div className="form-group">
												<label className="form-label fw-semibold">
													Last Name
												</label>
												<input
													type="text"
													className="form-control"
													name="last_name"
													value={instructor.last_name}
													onChange={handleChange}
													required={true}
												/>
											</div>
										</div>

										<div className="col-md-6">
											<div className="form-group">
												<label className="form-label fw-semibold">
													Email
												</label>
												<input
													type="email"
													className="form-control"
													name="email"
													value={instructor.email}
													onChange={handleChange}
													required={true}
												/>
											</div>
										</div>

										<div className="col-md-6">
											<div className="form-group">
												<label className="form-label fw-semibold">
													Phone Number
												</label>
												<input
													type="text"
													className="form-control"
													name="phone"
													value={instructor.phone}
													onChange={handleChange}
													required={true}
												/>
											</div>
										</div>

										<div className="col-md-6">
											<div className="form-group">
												<label className="form-label fw-semibold">
													Subject
												</label>
												<input
													type="text"
													className="form-control"
													name="instructor_subject"
													value={instructor.instructor_subject}
													onChange={handleChange}
													required={true}
												/>
											</div>
										</div>

										<div className="col-md-6">
											<div className="form-group">
												<label className="form-label fw-semibold">
													Partner School
												</label>
												<select
													className="form-select"
													name="partner_id"
													value={instructor.partner_id}
													onChange={handleChange}
													required={true}
												>
													<option value="">
														Select a Partner School
													</option>
													{partners.map((partner) => (
														<option
															key={partner.id}
															value={partner.id}
														>
															{partner.name}
														</option>
													))}
												</select>
											</div>
										</div>

										<div className="col-md-12">
											<div className="form-group">
												<label className="form-label fw-semibold">
													Description
												</label>
												<textarea
													className="form-control"
													name="instructor_description"
													value={instructor.instructor_description}
													onChange={handleChange}
													required={true}
												/>
											</div>
										</div>

										<div className="col-12">
											<button
												className="btn default-btn"
												type="submit"
												disabled={disabled}
											>
												<i className="flaticon-right-arrow"></i>
												Save <span></span>
												{loading ? <LoadingSpinner /> : ""}
												<span></span>
											</button>
										</div>
									</div>
								</form>
							</div>
						</div>
					</div>
				</div>
			</div>

			<Footer />
		</>
	);
};

export default Create;
