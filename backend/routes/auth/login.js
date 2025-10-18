const express = require("express");
const router = express.Router();
const supabase = require("../../utils/supabase");

router.post("/", async (req, res) => {
  if (!supabase) {
    return res.status(500).json({ error: "Supabase client not configured" });
  }

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Missing required field: email" });
  }

  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .limit(1);

    if (error) {
      console.error("Supabase select error:", error);
      return res.status(500).json({
        success: false,
        error: "Failed to query user",
      });
    }

    if (!data || data.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Account not registered. Please sign up.",
      });
    }

    return res.json({
      success: true,
      message: "User found",
      user: data[0],
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
});

module.exports = router;