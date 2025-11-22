import pool from "../db.js";
import generateCode from "../utils/generateCode.js";

export const createLink = async (req, res) => {
  try {
    const { url, customCode } = req.body;
    let code = customCode?.trim();

    // 📌 If no custom code, generate one
    if (!code) {
      code = generateCode();
    }

    // ⚠ Validate URL format (simple check)
    let valid;
    try {
      new URL(url);
      valid = true;
    } catch {
      valid = false;
    }
    if (!valid) return res.status(400).json({ error: "Invalid URL format" });

    // ❌ Check if code already exists
    const exists = await pool.query(
      "SELECT code FROM links WHERE code = $1",
      [code]
    );
    if (exists.rowCount > 0) {
      return res.status(409).json({ error: "Custom code already taken" });
    }

    // 📝 Insert into DB
    await pool.query(
      `INSERT INTO links (code, url) VALUES ($1, $2)`,
      [code, url]
    );

    res.status(201).json({
      message: "Short URL created",
      shortUrl: `${process.env.BASE_URL}/${code}`,
      code,
      url,
    });
  } catch (err) {
    console.error("Create Link Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};
