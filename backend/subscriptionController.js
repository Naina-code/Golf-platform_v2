import stripe from "../config/stripe.js";
import supabase from "../config/db.js";

// CREATE SUBSCRIPTION
export const createSubscription = async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      line_items: [
        {
          price: process.env.PRICE_ID,
          quantity: 1,
        },
      ],
      success_url: "http://localhost:3000/dashboard",
      cancel_url: "http://localhost:3000",
    });

    res.json({ url: session.url });
  } catch (err) {
    res.status(500).json(err.message);
  }
};

// STRIPE WEBHOOK (VERY IMPORTANT)
export const stripeWebhook = async (req, res) => {
  const event = req.body;

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    const userId = session.client_reference_id;

    await supabase
      .from("users")
      .update({ subscription_status: "active" })
      .eq("id", userId);
  }

  res.json({ received: true });
};
