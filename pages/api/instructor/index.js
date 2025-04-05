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

const handleGet = async (req, res) => {
  try {
    const instructors = await User.findAll({
      attributes: [
        "id",
        "first_name",
        "last_name",
        "email",
        "phone",
        "bio",
        "email_confirmed",
        "school_id",
      ],
      order: [["created_at", "DESC"]],
      where: { role: "instructor" },
    });

    res.status(200).json({ instructors });
  } catch (e) {
    res.status(400).json({
      error_code: "get_instructors",
      message: e.message,
    });
  }
};

const handlePost = async (req, res) => {
  try {
    const { first_name, last_name, email, password, phone, bio, school_id } =
      req.body;

    if (!first_name || !last_name || !email || !password || !school_id) {
      return res.status(400).json({
        error_code: "create_instructor",
        message: "Please fill in all required fields.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const instructor = await User.create({
      first_name,
      last_name,
      email,
      password: hashedPassword,
      phone,
      bio,
      role: "instructor",
      school_id,
    });

    res
      .status(201)
      .json({ message: "Instructor created successfully", instructor });
  } catch (e) {
    res.status(400).json({
      error_code: "create_instructor",
      message: e.message,
    });
  }
};

const handlePut = async (req, res) => {
  try {
    const { id } = req.query;
    const { first_name, last_name, email, phone, bio, school_id } = req.body;

    if (!id) {
      return res.status(400).json({
        error_code: "update_instructor",
        message: "Instructor ID is required.",
      });
    }

    const instructor = await User.findByPk(id);

    if (!instructor) {
      return res.status(404).json({
        error_code: "update_instructor",
        message: "Instructor not found.",
      });
    }

    await instructor.update({
      first_name,
      last_name,
      email,
      phone,
      bio,
      school_id,
    });

    res.status(200).json({ message: "Instructor updated successfully" });
  } catch (e) {
    res.status(400).json({
      error_code: "update_instructor",
      message: e.message,
    });
  }
};

const handlePutPassword = async (req, res) => {
  try {
    const { id } = req.query;
    const { oldPassword, newPassword } = req.body;

    if (!id) {
      return res.status(400).json({
        error_code: "update_password",
        message: "Instructor ID is required.",
      });
    }

    const instructor = await User.findByPk(id);

    if (!instructor) {
      return res.status(404).json({
        error_code: "update_password",
        message: "Instructor not found.",
      });
    }

    const isValidPassword = await bcrypt.compare(oldPassword, instructor.password);
    if (!isValidPassword) {
      return res.status(401).json({
        error_code: "invalid_password",
        message: "Invalid old password.",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await instructor.update({ password: hashedPassword });

    res.status(200).json({ message: "Password updated successfully" });
  } catch (e) {
    res.status(400).json({
      error_code: "update_password",
      message: e.message,
    });
  }
};

const handleDelete = async (req, res) => {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({
        error_code: "delete_instructor",
        message: "Instructor ID is required.",
      });
    }

    const instructor = await User.findByPk(id);

    if (!instructor) {
      return res.status(404).json({
        error_code: "delete_instructor",
        message: "Instructor not found.",
      });
    }

    await instructor.destroy();

    res.status(200).json({ message: "Instructor deleted successfully" });
  } catch (e) {
    res.status(400).json({
      error_code: "delete_instructor",
      message: e.message,
    });
  }
};
