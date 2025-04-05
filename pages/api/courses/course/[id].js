import Course from "database/models/course";
import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
    if (!("authorization" in req.headers)) {
        return res.status(401).json({ message: "No authorization token" });
    }
    switch (req.method) {
        case "GET":
            await handleGet(req, res);
            break;
        case "PUT":
            await handlePut(req, res);
            break;
        case "POST":  // Add new POST handler
            await handlePost(req, res);
            break;
        case "DELETE":
            await handleDelete(req, res);
            break;
        default:
            res.status(405).json({
                message: `Method ${req.method} not allowed`,
            });
    }
}

// Add this new handler function
const handlePost = async (req, res) => {
    const { id } = req.query;
    const { pageNumber, contentType } = req.body;

    try {
        const filePath = path.join(process.cwd(), 'info.json');
        let infoData = {};

        // Read existing file if it exists
        if (fs.existsSync(filePath)) {
            const fileContents = fs.readFileSync(filePath, 'utf8');
            infoData = JSON.parse(fileContents);
        }

        // Update data structure
        if (!infoData[id]) {
            infoData[id] = { pages: {} };
        }

        infoData[id].pages[pageNumber] = contentType;

        // Write updated data back to file
        fs.writeFileSync(filePath, JSON.stringify(infoData, null, 2));

        res.status(200).json({ message: 'Content saved successfully' });
    } catch (e) {
        res.status(500).json({
            error_code: "save_content",
            message: e.message,
        });
    }
};

// ... keep existing handleGet, handlePut, handleDelete functions unchanged ...


const handleGet = async (req, res) => {
	const { id } = req.query;
	try {
		const course = await Course.findOne({
			where: { id: id },
		});

		res.status(200).json({ course });
	} catch (e) {
		res.status(400).json({
			error_code: "update_course",
			message: e.message,
		});
	}
};

const handlePut = async (req, res) => {
	const { id } = req.query;
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
	} = req.body;
	try {
		const course = await Course.update(
			{
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
			},
			{
				where: { id: id },
			}
		);

		res.status(200).json({ message: "Course updated successfully" });
	} catch (e) {
		res.status(400).json({
			error_code: "update_course",
			message: e.message,
		});
	}
};

const handleDelete = async (req, res) => {
	const { id } = req.query;
	try {
		const course = await Course.findOne({
			where: { id: id },
		});

		course.destroy();

		res.status(200).json({ message: "Course deleted successfully" });
	} catch (e) {
		res.status(400).json({
			error_code: "delete_course",
			message: e.message,
		});
	}
};
