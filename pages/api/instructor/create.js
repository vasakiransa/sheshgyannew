import Instructor from "database/models/instructor";




export default async (req, res) => {
	switch (req.method) {
		case "POST":
			await createInstructor(req, res);
			break;
		default:
			res.status(405).json({ message: "Method Not Allowed" });
			break;
	}
};

const createInstructor = async (req, res) => {
	try {
		const {
			first_name,
			last_name,
			email,
			phone,
			instructor_subject,
			instructor_description,
			partner_id,
		} = req.body;

		if (
			!first_name ||
			!last_name ||
			!email ||
			!phone ||
			!instructor_subject ||
			!instructor_description ||
			!partner_id
		) {
			return res.status(400).json({ message: "Please fill in all fields" });
		}

		const newInstructor = new Instructor({
			first_name,
			last_name,
			email,
			phone,
			instructor_subject,
			instructor_description,
			instructor_request_confirmed: false, // Set default value
			partner_id,
		});

		await newInstructor.save();
		res.status(201).json({ message: "Instructor created successfully!" });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Error creating instructor" });
	}
};
