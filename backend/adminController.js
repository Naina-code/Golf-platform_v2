import supabase from "../config/db.js";
import { calculateWinners } from "../utils/winnerLogic.js";
import { getPredictedDraw } from "../services/mlservice.js"; // ✅ ML IMPORT

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
      .select("numbers");

    if (scoreError) {
      return res.status(500).json({ error: "Error fetching scores" });
    }

    // 2️⃣ Flatten scores
    let allScores = [];
    scoresData.forEach((s) => {
      if (Array.isArray(s.numbers)) {
        allScores.push(...s.numbers);
      }
    });

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
      const { error: insertError } = await supabase
        .from("winners")
        .insert(winners);

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
