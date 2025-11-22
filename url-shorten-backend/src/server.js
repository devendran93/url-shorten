import express from "express";
import cors from "cors";
import pool from "./config/db.js";
import linkRoutes from "./routes/linkRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());

// USE the route
app.use("/api/links", linkRoutes);

// Redirect Short URL
app.get("/:code", async (req, res) => {
  try {
    const { code } = req.params;

    // Find link
    const result = await pool.query(
      "SELECT * FROM links WHERE code = $1 LIMIT 1",
      [code]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Invalid Short URL" });
    }

    const url = result.rows[0].url;

    // Update clicks & last_clicked timestamp
    await pool.query(
      "UPDATE links SET clicks = clicks + 1, last_clicked = NOW() WHERE code = $1",
      [code]
    );

    return res.redirect(url); // redirect to original link

  } catch (err) {
    console.error("REDIRECT ERROR:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

// Health Check
app.get("/healthz", (req, res) => {
  res.status(200).json({ ok: true, version: "1.0" });
});

// Root Info
app.get("/", (req, res) => {
  res.send("URL Shortener Backend Running 🚀");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
