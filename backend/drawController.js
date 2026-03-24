import supabase from "../config/db.js";
import { generateDraw } from "../utils/generateDraw.js";

export const runDraw = async (req, res) => {
  const numbers = generateDraw();

  const { data, error } = await supabase
    .from("draws")
    .insert([{ numbers }])
    .select();

  res.json({ numbers });
};
