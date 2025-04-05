import Razorpay from "razorpay";

export default async function handler(req, res) {
	if (req.method !== "POST") {
		return res.status(405).json({ message: "Method Not Allowed" });
	}

	const { amount, currency } = req.body;

	try {
		// Initialize Razorpay instance
		const razorpay = new Razorpay({
			key_id: process.env.RAZORPAY_KEY_ID,
			key_secret: process.env.RAZORPAY_KEY_SECRET,
		});

		// Create an order in Razorpay
		const options = {
			amount: amount * 100, // Amount in paise
			currency: currency,
			payment_capture: 1,
		};

		const order = await razorpay.orders.create(options);
		res.status(200).json(order);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
}
