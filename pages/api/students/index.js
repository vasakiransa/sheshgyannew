import User from "database/models/user";
import bcrypt from "bcrypt";

export default async function handler(req, res) {
    switch (req.method) {
        case "GET":
            await handleGet(req, res);
            break;
        case "POST":
            await handlePost(req, res);
            break;
        case "PUT":
            if (req.query.action === "password") {
                await handlePutPassword(req, res);
            } else {
                await handlePut(req, res);
            }
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

// Handle GET: Fetch all students
const handleGet = async (req, res) => {
    try {
        const students = await User.findAll({
            attributes: [
                "id",
                "first_name",
                "last_name",
                "email",
                "phone",
                "bio",
                "email_confirmed",
                "password",
                "class_id",
                "school_id",
            ],
            order: [["created_at", "DESC"]],
            where: { role: "student" },
        });

        res.status(200).json({ students });
    } catch (e) {
        res.status(400).json({
            error_code: "get_students",
            message: e.message,
        });
    }
};

// Handle POST: Create new student
const handlePost = async (req, res) => {
    try {
        const { first_name, last_name, email, password, phone, bio, class_id, school_id, my_course, role } = req.body;

        console.log("Received request body:", JSON.stringify(req.body, null, 2)); // Log the full request body

        // Validate required fields
        if (!first_name || !last_name || !email || !password || !phone || !class_id || !school_id) {
            return res.status(400).json({
                error_code: "create_student",
                message: "All fields (first_name, last_name, email, password, phone, class_id, school_id) are required.",
            });
        }

        // Check if email already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({
                error_code: "email_exists",
                message: "Email already registered.",
            });
        }

        // Hash the password before storing
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert student with all required fields
        const student = await User.create({
            first_name,
            last_name,
            email,
            password: hashedPassword,
            phone,
            bio,
            role: role || "student", // Ensure role is set
            class_id, // Explicitly include class_id
            school_id, // Explicitly include school_id
            my_course: my_course || "DefaultCourse", // Include my_course if provided
        });

        console.log("Created student:", student.toJSON());

        res.status(201).json({ message: "Student created successfully", student });
    } catch (e) {
        console.error("Error creating student:", e);
        res.status(400).json({ error_code: "create_student", message: e.message });
    }
};

// Handle PUT: Update student details
const handlePut = async (req, res) => {
    try {
        const { id } = req.query;
        const { first_name, last_name, email, phone, bio, class_id, school_id } = req.body;

        if (!id) {
            return res.status(400).json({
                error_code: "update_student",
                message: "Student ID is required.",
            });
        }

        const student = await User.findByPk(id);

        if (!student) {
            return res.status(404).json({
                error_code: "update_student",
                message: "Student not found.",
            });
        }

        await student.update({
            first_name: first_name || student.first_name,
            last_name: last_name || student.last_name,
            email: email || student.email,
            phone: phone || student.phone,
            bio: bio || student.bio,
            class_id: class_id || student.class_id,
            school_id: school_id || student.school_id,
        });

        res.status(200).json({ message: "Student updated successfully" });
    } catch (e) {
        res.status(400).json({
            error_code: "update_student",
            message: e.message,
        });
    }
};

// Handle PUT: Update student password
const handlePutPassword = async (req, res) => {
    try {
        const { id } = req.query;
        const { oldPassword, newPassword } = req.body;

        if (!id) {
            return res.status(400).json({
                error_code: "update_password",
                message: "Student ID is required.",
            });
        }

        const student = await User.findByPk(id);

        if (!student) {
            return res.status(404).json({
                error_code: "update_password",
                message: "Student not found.",
            });
        }

        const isValidPassword = await bcrypt.compare(oldPassword, student.password);
        if (!isValidPassword) {
            return res.status(401).json({
                error_code: "invalid_password",
                message: "Invalid old password.",
            });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await student.update({ password: hashedPassword });

        res.status(200).json({ message: "Password updated successfully" });
    } catch (e) {
        res.status(400).json({
            error_code: "update_password",
            message: e.message,
        });
    }
};

// Handle DELETE: Delete student
const handleDelete = async (req, res) => {
    try {
        const { id } = req.query;

        if (!id) {
            return res.status(400).json({
                error_code: "delete_student",
                message: "Student ID is required.",
            });
        }

        const student = await User.findByPk(id);

        if (!student) {
            return res.status(404).json({
                error_code: "delete_student",
                message: "Student not found.",
            });
        }

        await student.destroy();

        res.status(200).json({ message: "Student deleted successfully" });
    } catch (e) {
        res.status(400).json({
            error_code: "delete_student",
            message: e.message,
        });
    }
};