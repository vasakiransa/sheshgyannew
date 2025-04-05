import React, { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { motion } from "framer-motion";
import styles from "../styles/PaymentForm.module.css";
 // Add your custom CSS here

const PaymentForm = () => {
	const router = useRouter();
	const [formData, setFormData] = useState({
		studentName: "",
		parentName: "",
		phoneNumber: "",
		email: "",
		address: "",
		schoolName: "",
		amount: "5500", // Default amount
	});

	// Handle form input changes
	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	// Handle Form Submission & Redirect to Razorpay
	const handleSubmit = async (e) => {
		e.preventDefault();

		// Basic Validation
		for (let key in formData) {
			if (!formData[key]) {
				alert(`Please enter ${key.replace(/([A-Z])/g, " $1")}`);
				return;
			}
		}

		try {
			// Request to backend to create an order
			const { data } = await axios.post("/api/razorpay", {
				amount: formData.amount,
				currency: "INR",
				studentData: formData,
			});

			// Initialize Razorpay Payment
			const options = {
				key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Razorpay Key
				amount: data.amount,
				currency: data.currency,
				name: "School Payment",
				description: "Student Admission Fee",
				order_id: data.id,
				handler: function (response) {
					alert(`Payment Successful! Payment ID: ${response.razorpay_payment_id}`);
					router.push("/success"); // Redirect to success page
				},
				prefill: {
					name: formData.studentName,
					email: formData.email,
					contact: formData.phoneNumber,
				},
				theme: {
					color: "#28a745",
				},
			};

			const rzp1 = new window.Razorpay(options);
			rzp1.open();
		} catch (error) {
			alert("Payment failed. Please try again.");
		}
	};

	return (
		<div className={styles.paymentContainer}>
			<motion.div 
				initial={{ opacity: 0, y: 50 }} 
				animate={{ opacity: 1, y: 0 }} 
				transition={{ duration: 0.5 }}
				className={styles.paymentCard}
			>
				<h2 className={styles.title}>🎓 Student Payment Form</h2>
				<p className={styles.subtitle}>Fill in the details and proceed with the payment.</p>

				<form onSubmit={handleSubmit} className={styles.paymentForm}>
					<div className="row">
						<div className="col-md-6">
							<label className={styles.label}>👦 Student Name</label>
							<input 
								type="text" 
								className={styles.input} 
								name="studentName" 
								value={formData.studentName} 
								onChange={handleChange} 
								required 
							/>
						</div>
						<div className="col-md-6">
							<label className={styles.label}>👨‍👩‍👦 Parent Name</label>
							<input 
								type="text" 
								className={styles.input} 
								name="parentName" 
								value={formData.parentName} 
								onChange={handleChange} 
								required 
							/>
						</div>
					</div>

					<div className="row">
						<div className="col-md-6">
							<label className={styles.label}>📞 Phone Number</label>
							<input 
								type="tel" 
								className={styles.input} 
								name="phoneNumber" 
								value={formData.phoneNumber} 
								onChange={handleChange} 
								required 
							/>
						</div>
						<div className="col-md-6">
							<label className={styles.label}>📧 Email</label>
							<input 
								type="email" 
								className={styles.input} 
								name="email" 
								value={formData.email} 
								onChange={handleChange} 
								required 
							/>
						</div>
					</div>

					<div className="row">
						<div className="col-md-12">
							<label className={styles.label}>🏠 Address</label>
							<textarea 
								className={styles.textarea} 
								name="address" 
								value={formData.address} 
								onChange={handleChange} 
								required 
							/>
						</div>
					</div>

					<div className="row">
						<div className="col-md-6">
							<label className={styles.label}>🏫 School Name</label>
							<input 
								type="text" 
								className={styles.input} 
								name="schoolName" 
								value={formData.schoolName} 
								onChange={handleChange} 
								required 
							/>
						</div>
						<div className="col-md-6">
							<label className={styles.label}>💰 Amount (INR)</label>
							<input 
								type="number" 
								className={styles.input} 
								name="amount" 
								value={formData.amount} 
								readOnly 
							/>
						</div>
					</div>
                    <li>
					<div className="d-flex justify-content-center">
						
                        <button 
							type="submit" 
							className={styles.submitBtn}
						>
							🚀 Proceed to Payment
						</button>
                        
					</div>
                    </li>
				</form>
			</motion.div>
		</div>
	);
};

export default PaymentForm;
