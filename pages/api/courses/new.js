import jwt from "jsonwebtoken";
import { slugify } from "@/utils/auth";
import Course from "database/models/course";
import User from "database/models/user"; // Import User model

export default async function handler(req, res) {
	if (!("authorization" in req.headers)) {
		return res.status(401).json({ message: "No authorization token" });
	}
	switch (req.method) {
		case "POST":
			await handlePostRequest(req, res);
			break;
		case "DELETE":
			await handleDeleteRequest(req, res);
			break;
		default:
			res.status(405).json({
				message: `Method ${req.method} not allowed`,
			});
	}
}

const handlePostRequest = async (req, res) => {
	const {
		title,
		short_desc,
		overview,
		latest_price,
		before_price,
		lessons,
		duration,
		image,
		access_time,
		requirements,
		what_you_will_learn,
		who_is_this_course_for,
		catId,
		is_class,
		grade, // Ensure grade is passed in the request body
	} = req.body;

	try {
		const { userId } = jwt.verify(
			req.headers.authorization,
			process.env.JWT_SECRET
		);

		let slug = slugify(title);
		const slugExist = await Course.findOne({ where: { slug: slug } });

		if (slugExist) {
			slug = `${slug}-${Math.floor(Math.random() * (999 - 100 + 1) + 100)}`;
		}

		const newCourse = await Course.create({
			title,
			slug,
			short_desc,
			overview,
			latest_price,
			before_price,
			lessons,
			duration,
			image,
			access_time,
			requirements,
			what_you_will_learn,
			who_is_this_course_for,
			userId,
			catId,
			is_class: is_class && true,
			grade,
		});

		// Update my_course for students whose class_id matches the course's grade
		await User.update(
			{ my_course: title },
			{ where: { class_id: grade, role: "student" } }
		);

		res.status(200).json({
			message:
				"Course created successfully. Please wait until approved by an admin.",
			course: newCourse,
		});
	} catch (e) {
		res.status(400).json({
			error_code: "create_course",
			message: e.message,
		});
	}
};