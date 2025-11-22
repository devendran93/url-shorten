import express from "express";
import pool from "../config/db.js";
import generateCode from "../utils/generateCode.js";

const router = express.Router();

/* ================================
   CREATE SHORT URL  (POST /api/links)
================================ */
router.post("/", async (req, res) => {
  try {
    let { url, code } = req.body;

    if (!url) return res.status(400).json({ message: "Original URL required" });

    // If no custom code, generate one
    if (!code) code = generateCode();

    // Check duplicate short code
    const exists = await pool.query("SELECT * FROM links WHERE code = $1", [code]);
    if (exists.rowCount > 0) {
      return res.status(409).json({ message: "Code already exists, choose another" });
    }

    // Insert new record
    const result = await pool.query(
      "INSERT INTO links (code, url) VALUES ($1, $2) RETURNING *",
      [code, url]
    );

    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error("INSERT ERROR:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

/* ================================
   GET ALL LINKS (GET /api/links)
================================ */
router.get("/codes", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT code, url FROM links ORDER BY code ASC"
    );
    res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error("GET ALL ERROR:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

/* =======================================
   GET STATS FOR ONE LINK (GET /api/links/:code)
========================================= */
router.get("/:code", async (req, res) => {
  try {
    const { code } = req.params;
    const result = await pool.query("SELECT * FROM links WHERE code = $1", [code]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Not found" });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error("STATS ERROR:", err);
    res.status(500).json({ message: "Server Error" });
  }
});


/* ================================
   DELETE LINK (DELETE /api/links/:code)
================================ */
router.delete("/delete/:code", async (req, res) => {
  try {
    const { code } = req.params;

    const deleted = await pool.query("DELETE FROM links WHERE code = $1", [code]);

    if (deleted.rowCount === 0) {
      return res.status(404).json({ message: "Not found" });
    }

    res.json({ success: true, message: "Deleted successfully" });
  } catch (err) {
    console.error("DELETE ERROR:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

// 📌 Stats API (NOT redirect)
router.get("/code/:code", async (req, res) => {
  try {
    const { code } = req.params;

    const result = await pool.query(
      "SELECT code, url, clicks, last_clicked FROM links WHERE code = $1 LIMIT 1",
      [code]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Code not found" });
    }

    res.json(result.rows[0]);

  } catch (err) {
    console.error("STATS ERROR:", err);
    res.status(500).json({ message: "Server Error" });
  }
});


export default router;
