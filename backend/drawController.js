import supabase from "./db.js";
import { generateDraw } from "./generateDraw.js";

export const runDraw = async (req, res) => {
  const numbers = generateDraw();

  const { data, error } = await supabase
    .from("draws")
    .insert([{ numbers }])
    .select();

  res.json({ numbers });
};
