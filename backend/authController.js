import supabase from "../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  const { email, password } = req.body;

  const hashed = await bcrypt.hash(password, 10);

  const { data, error } = await supabase
    .from("users")
    .insert([{ email, password: hashed }])
    .select();

  if (error) return res.status(400).json(error);

  res.json(data);
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  const { data } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single();

  if (!data) return res.status(400).json({ msg: "User not found" });

  const valid = await bcrypt.compare(password, data.password);

  if (!valid) return res.status(400).json({ msg: "Wrong password" });

  const token = jwt.sign({ id: data.id }, process.env.JWT_SECRET);

  res.json({ token });
};
