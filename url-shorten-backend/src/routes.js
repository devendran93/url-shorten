import express from "express";
import { createLink } from "./controllers/links.js";

const router = express.Router();

router.post("/api/links", createLink);

export default router;
