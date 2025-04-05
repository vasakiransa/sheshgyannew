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
      res.status(405).json({ message: `Method ${req.method} not allowed` });
  }
}

const handleGet = async (req, res) => {
  try {
    const schools = await User.findAll({
      attributes: ["id", "first_name", "last_name", "email", "phone", "bio", "email_confirmed"],
      order: [["created_at", "DESC"]],
      where: { role: "school" },
    });
    res.status(200).json({ schools });
  } catch (e) {
    res.status(400).json({ error_code: "get_schools", message: e.message });
  }
};

const handlePost = async (req, res) => {
  try {
    const { first_name, last_name, email, password, phone, bio } = req.body;

    if (!first_name || !last_name || !email || !password) {
      return res.status(400).json({ error_code: "create_school", message: "Please fill in all required fields." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const school = await User.create({
      first_name,
      last_name,
      email,
      password: hashedPassword,
      phone,
      bio,
      role: "school",
    });

    res.status(201).json({ message: "School created successfully", school });
  } catch (e) {
    res.status(400).json({ error_code: "create_school", message: e.message });
  }
};

const handlePut = async (req, res) => {
  try {
    const { id } = req.query;
    const { first_name, last_name, email, phone, bio } = req.body;

    if (!id) {
      return res.status(400).json({ error_code: "update_school", message: "School ID is required." });
    }

    const school = await User.findByPk(id);

    if (!school) {
      return res.status(404).json({ error_code: "update_school", message: "School not found." });
    }

    await school.update({ first_name, last_name, email, phone, bio });
    res.status(200).json({ message: "School updated successfully" });
  } catch (e) {
    res.status(400).json({ error_code: "update_school", message: e.message });
  }
};

const handlePutPassword = async (req, res) => {
  try {
    const { id } = req.query;
    const { oldPassword, newPassword } = req.body;

    if (!id) {
      return res.status(400).json({ error_code: "update_password", message: "School ID is required." });
    }

    const school = await User.findByPk(id);

    if (!school) {
      return res.status(404).json({ error_code: "update_password", message: "School not found." });
    }

    const isValidPassword = await bcrypt.compare(oldPassword, school.password);
    if (!isValidPassword) {
      return res.status(401).json({ error_code: "invalid_password", message: "Invalid old password." });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await school.update({ password: hashedPassword });

    res.status(200).json({ message: "Password updated successfully" });
  } catch (e) {
    res.status(400).json({ error_code: "update_password", message: e.message });
  }
};

const handleDelete = async (req, res) => {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ error_code: "delete_school", message: "School ID is required." });
    }

    const school = await User.findByPk(id);

    if (!school) {
      return res.status(404).json({ error_code: "delete_school", message: "School not found." });
    }

    await school.destroy();

    res.status(200).json({ message: "School deleted successfully" });
  } catch (e) {
    res.status(400).json({ error_code: "delete_school", message: e.message });
  }
};