import express from "express";
import { analyzeText } from "../controllers/ai.controller.js";

const router = express.Router();

router.post("/analyze", analyzeText);

export default router;
