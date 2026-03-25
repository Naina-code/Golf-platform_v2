import supabase from "./db.js";

export const getProfile = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("id, name, email, role, created_at")
      .eq("id", req.user.id)
      .single();
    if (error) return res.status(500).json({ error: "Error fetching profile" });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name } = req.body;
    const { error } = await supabase
      .from("users")
      .update({ name })
      .eq("id", req.user.id);
    if (error) return res.status(500).json({ error: "Error updating profile" });
    res.json({ message: "Profile updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getDashboard = async (req, res) => {
  try {
    const { data: scores } = await supabase
      .from("scores")
      .select("*")
      .eq("user_id", req.user.id)
      .order("date", { ascending: false });

    const { data: winners } = await supabase
      .from("winners")
      .select("*")
      .eq("user_id", req.user.id);

    res.json({ scores: scores || [], winners: winners || [] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const selectCharity = async (req, res) => {
  try {
    const { charity_id } = req.body;
    const { error } = await supabase
      .from("users")
      .update({ charity_id })
      .eq("id", req.user.id);
    if (error) return res.status(500).json({ error: "Error selecting charity" });
    res.json({ message: "Charity selected" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getSubscriptionStatus = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", req.user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (error) return res.json({ status: "none" });
    res.json({ status: data.status, plan: data.plan });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
