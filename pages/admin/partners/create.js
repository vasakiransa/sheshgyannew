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

const INIT_PARTNER = {
	name: "",
	partner_image: "",
	phone_number_1: "",
	phone_number_2: "",
	email: "",
	contact_person: "",
	address: "",
};

const Create = ({ user }) => {
	const router = useRouter();
	const [partner, setPartner] = useState(INIT_PARTNER);
	const [loading, setLoading] = useState(false);
	const [disabled, setDisabled] = useState(true);
	const [imagePreview, setImagePreview] = useState("");

	useEffect(() => {
		const isPartner = Object.values(partner).every((el) => Boolean(el));
		isPartner ? setDisabled(false) : setDisabled(true);
	}, [partner]);

	const handleChange = (e) => {
		const { name, value, files } = e.target;

		if (name === "partner_image") {
			const partner_image = files[0].size / 1024 / 1024;
			if (partner_image > 2) {
				toast.error(
					"The photo size is greater than 2 MB. Make sure it is less than 2 MB.",
					{
						style: {
							border: "1px solid #ff0033",
							padding: "16px",
							color: "#ff0033",
						},
						iconTheme: {
							primary: "#ff0033",
							secondary: "#FFFAEE",
						},
					}
				);
				e.target.value = null;
				return;
			}
			setPartner((prevState) => ({
				...prevState,
				partner_image: files[0],
			}));
			setImagePreview(window.URL.createObjectURL(files[0]));
		} else {
			setPartner((prevState) => ({ ...prevState, [name]: value }));
		}
	};

	const handleImageUpload = async () => {
		const data = new FormData();
		data.append("file", partner.partner_image);
		data.append("upload_preset", process.env.UPLOAD_PRESETS);
		data.append("cloud_name", process.env.CLOUD_NAME);
		let response;
		if (partner.partner_image) {
			response = await axios.post(process.env.CLOUDINARY_URL, data);
		}
		const imageUrl = response.data.url;

		return imageUrl;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			setLoading(true);
			let photo;
			if (partner.partner_image) {
				photo = await handleImageUpload();
				photo = photo.replace(/^http:\/\//i, "https://");
			}

			const url = `${baseUrl}/api/partners/create`;
			const { name, phone_number_1, phone_number_2, email, contact_person, address } = partner;
			const payload = {
				name,
				partner_image: photo,
				phone_number_1,
				phone_number_2,
				email,
				contact_person,
				address,
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
			router.push("/admin/partners");
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
										<Link href="/admin/partners/">
											<a>Partners</a>
										</Link>
									</li>
									<li>
										<Link href="/admin/partners/create/">
											<a className="active">Create</a>
										</Link>
									</li>
								</ul>

								{/* Form */}
								<form onSubmit={handleSubmit}>
									<div className="row">
										<div className="col-md-12">
											<div className="form-group">
												<label className="form-label fw-semibold">
													Name
												</label>
												<input
													type="text"
													className="form-control"
													name="name"
													value={partner.name}
													onChange={handleChange}
													required={true}
												/>
											</div>
										</div>

										<div className="col-md-12">
											<div className="form-group">
												<label className="form-label fw-semibold">
													Upload Image
												</label>
												<input
													type="file"
													className="form-control file-control"
													name="partner_image"
													onChange={handleChange}
													required={true}
												/>
												<div className="form-text">
													Upload image size 150x60!
												</div>

												<div className="mt-2">
													{imagePreview ? (
														<img
															src={imagePreview}
															alt="image"
															className="img-thumbnail w-100px me-2"
														/>
													) : (
														<img
															src="/images/partner/partner1.png"
															alt="image"
															className="img-thumbnail w-100px me-2"
														/>
													)}
												</div>
											</div>
										</div>

										{/* New Fields */}
										<div className="col-md-6">
											<div className="form-group">
												<label className="form-label fw-semibold">
													Phone Number 1
												</label>
												<input
													type="text"
													className="form-control"
													name="phone_number_1"
													value={partner.phone_number_1}
													onChange={handleChange}
												/>
											</div>
										</div>

										<div className="col-md-6">
											<div className="form-group">
												<label className="form-label fw-semibold">
													Phone Number 2
												</label>
												<input
													type="text"
													className="form-control"
													name="phone_number_2"
													value={partner.phone_number_2}
													onChange={handleChange}
												/>
											</div>
										</div>

										<div className="col-md-12">
											<div className="form-group">
												<label className="form-label fw-semibold">
													Email
												</label>
												<input
													type="email"
													className="form-control"
													name="email"
													value={partner.email}
													onChange={handleChange}
												/>
											</div>
										</div>

										<div className="col-md-12">
											<div className="form-group">
												<label className="form-label fw-semibold">
													Contact Person
												</label>
												<input
													type="text"
													className="form-control"
													name="contact_person"
													value={partner.contact_person}
													onChange={handleChange}
												/>
											</div>
										</div>

										<div className="col-md-12">
											<div className="form-group">
												<label className="form-label fw-semibold">
													Contact Person role
												</label>
												<input
													type="text"
													className="form-control"
													name="contact_person"
													value={partner.contact_person}
													onChange={handleChange}
												/>
											</div>
										</div>

										<div className="col-md-12">
											<div className="form-group">
												<label className="form-label fw-semibold">
													Address
												</label>
												<input
													type="text"
													className="form-control"
													name="address"
													value={partner.address}
													onChange={handleChange}
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
												{loading ? (
													<LoadingSpinner />
												) : (
													""
												)}
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
