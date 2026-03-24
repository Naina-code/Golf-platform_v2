import supabase from "../config/db.js";

export const addScore = async (req, res) => {
  const userId = req.user.id;
  const { score, date } = req.body;

  const { data: scores } = await supabase
    .from("scores")
    .select("*")
    .eq("user_id", userId)
    .order("date", { ascending: true });

  if (scores.length >= 5) {
    await supabase
      .from("scores")
      .delete()
      .eq("id", scores[0].id);
  }

  const { data, error } = await supabase
    .from("scores")
    .insert([{ user_id: userId, score, date }]);

  if (error) return res.status(400).json(error);

  res.json(data);
};

export const getScores = async (req, res) => {
  const { data } = await supabase
    .from("scores")
    .select("*")
    .eq("user_id", req.user.id)
    .order("date", { ascending: false });

  res.json(data);
};