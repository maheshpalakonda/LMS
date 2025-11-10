import express from "express";
import { chat, search } from "../controllers/aiController.js";
import { techChat } from "../controllers/techchatController.js";

const router = express.Router();

router.post("/chat", chat);
router.post("/search", search);
router.post("/techchat", techChat);

export default router;
