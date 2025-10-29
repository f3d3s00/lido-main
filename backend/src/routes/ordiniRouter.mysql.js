
import express from "express";
import { createOrder, getAllOrders } from "../controllers/ordineController.js";
const router = express.Router();

// GET /api/ordini - tutti gli ordini con prodotti e metodoPagamento
router.get("/", getAllOrders);

// POST /api/ordini - crea nuovo ordine
router.post("/", createOrder);

export default router;
