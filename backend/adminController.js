import supabase from "./db.js";
import { calculateWinners } from "./winnerLogic.js";
import { getPredictedDraw } from "./mlservice.js";

/* ===============================
   📊 ADMIN DASHBOARD
================================ */
export const getAdminDashboard = async (req, res) => {
  try {
    const { data: users, error: userError } = await supabase
      .from("users")
      .select("*");

    const { data: winners, error: winnerError } = await supabase
      .from("winners")
      .select("*");

    if (userError || winnerError) {
      return res.status(500).json({ error: "Error fetching dashboard data" });
    }

    res.json({ users, winners });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ===============================
   🎲 CREATE DRAW (MANUAL)
================================ */
export const createDraw = async (req, res) => {
  try {
    const { numbers } = req.body;

    if (!numbers || numbers.length !== 5) {
      return res.status(400).json({ error: "Provide 5 numbers" });
    }

    const { data, error } = await supabase
      .from("draws")
      .insert([{ numbers, status: "pending" }])
      .select();

    if (error) {
      return res.status(500).json({ error: "Error creating draw" });
    }

    res.json({ message: "Draw created", draw: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ===============================
   🤖 CREATE DRAW USING ML
================================ */
export const generateDrawWithML = async (req, res) => {
  try {
    // 1️⃣ Get past scores
    const { data: scoresData, error: scoreError } = await supabase
      .from("scores")
      .select("score");

    if (scoreError) {
      return res.status(500).json({ error: "Error fetching scores" });
    }

    // 2️⃣ Collect all score values
    const allScores = scoresData
      .filter((s) => s.score !== null)
      .map((s) => s.score);

    // 3️⃣ Call ML API
    const predictedNumbers = await getPredictedDraw(allScores);

    // 4️⃣ Save draw
    const { data, error } = await supabase
      .from("draws")
      .insert([
        {
          numbers: predictedNumbers,
          status: "generated",
        },
      ])
      .select();

    if (error) {
      return res.status(500).json({ error: "Error saving ML draw" });
    }

    res.json({
      message: "Draw generated using ML",
      draw: data,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ===============================
   📜 GET ALL DRAWS
================================ */
export const getAllDraws = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("draws")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return res.status(500).json({ error: "Error fetching draws" });
    }

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ===============================
   🏆 PUBLISH DRAW + WINNERS
================================ */
export const publishDraw = async (req, res) => {
  try {
    const { draw_id } = req.body;

    if (!draw_id) {
      return res.status(400).json({ error: "draw_id required" });
    }

    // 1️⃣ Get draw
    const { data: draw, error: drawError } = await supabase
      .from("draws")
      .select("*")
      .eq("id", draw_id)
      .single();

    if (drawError || !draw) {
      return res.status(404).json({ error: "Draw not found" });
    }

    const drawNumbers = draw.numbers;

    // 2️⃣ Get scores
    const { data: scores, error: scoreError } = await supabase
      .from("scores")
      .select("*");

    if (scoreError) {
      return res.status(500).json({ error: "Error fetching scores" });
    }

    // 3️⃣ Calculate winners
    const winners = calculateWinners(scores, drawNumbers);

    // 4️⃣ Insert winners
    if (winners.length > 0) {
      const winnersWithDraw = winners.map((w) => ({ ...w, draw_id }));
      const { error: insertError } = await supabase
        .from("winners")
        .insert(winnersWithDraw);

      if (insertError) {
        return res.status(500).json({ error: "Error inserting winners" });
      }
    }

    // 5️⃣ Update draw
    await supabase
      .from("draws")
      .update({ status: "published" })
      .eq("id", draw_id);

    res.json({
      message: "Draw published successfully",
      total_winners: winners.length,
      winners,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ===============================
   🏅 GET ALL WINNERS
================================ */
export const getAllWinners = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("winners")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return res.status(500).json({ error: "Error fetching winners" });
    }

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ===============================
   💰 UPDATE WINNER PAYMENT STATUS
================================ */
export const updateWinnerPayment = async (req, res) => {
  try {
    const { winner_id, status } = req.body;

    const { error } = await supabase
      .from("winners")
      .update({ payment_status: status })
      .eq("id", winner_id);

    if (error) {
      return res.status(500).json({ error: "Error updating payment" });
    }

    res.json({ message: "Payment status updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ===============================
   👤 USER MANAGEMENT
================================ */
export const getAllUsers = async (req, res) => {
  try {
    const { data, error } = await supabase.from("users").select("*");
    if (error) return res.status(500).json({ error: "Error fetching users" });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase.from("users").update(req.body).eq("id", id);
    if (error) return res.status(500).json({ error: "Error updating user" });
    res.json({ message: "User updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase.from("users").delete().eq("id", id);
    if (error) return res.status(500).json({ error: "Error deleting user" });
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ===============================
   🎲 RUN RANDOM DRAW (ADMIN)
================================ */
import { generateDraw } from "./generateDraw.js";

export const runDrawAdmin = async (req, res) => {
  try {
    const numbers = generateDraw();
    const { data, error } = await supabase
      .from("draws")
      .insert([{ numbers, status: "pending" }])
      .select();
    if (error) return res.status(500).json({ error: "Error running draw" });
    res.json({ message: "Draw created", draw: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ===============================
   ❤️ CHARITY MANAGEMENT
================================ */
export const getAllCharities = async (req, res) => {
  try {
    const { data, error } = await supabase.from("charities").select("*");
    if (error) return res.status(500).json({ error: "Error fetching charities" });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const addCharity = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("charities")
      .insert([req.body])
      .select();
    if (error) return res.status(500).json({ error: "Error adding charity" });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateCharity = async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase.from("charities").update(req.body).eq("id", id);
    if (error) return res.status(500).json({ error: "Error updating charity" });
    res.json({ message: "Charity updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteCharity = async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase.from("charities").delete().eq("id", id);
    if (error) return res.status(500).json({ error: "Error deleting charity" });
    res.json({ message: "Charity deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ===============================
   🏅 WINNER MANAGEMENT (EXTRA)
================================ */
export const getWinners = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("winners")
      .select("*, users(email)")
      .order("created_at", { ascending: false });
    if (error) return res.status(500).json({ error: "Error fetching winners" });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const verifyWinner = async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase
      .from("winners")
      .update({ status: "verified" })
      .eq("id", id);
    if (error) return res.status(500).json({ error: "Error verifying winner" });
    res.json({ message: "Winner verified" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const markAsPaid = async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase
      .from("winners")
      .update({ payment_status: "paid" })
      .eq("id", id);
    if (error) return res.status(500).json({ error: "Error marking as paid" });
    res.json({ message: "Winner marked as paid" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ===============================
   📈 ANALYTICS
================================ */
export const getAnalytics = async (req, res) => {
  try {
    const [{ count: userCount }, { count: drawCount }, { count: winnerCount }] =
      await Promise.all([
        supabase.from("users").select("*", { count: "exact", head: true }),
        supabase.from("draws").select("*", { count: "exact", head: true }),
        supabase.from("winners").select("*", { count: "exact", head: true }),
      ]);

    res.json({ users: userCount, draws: drawCount, winners: winnerCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
