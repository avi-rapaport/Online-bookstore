import express from "express";
import { checkOutAndCreateOrder } from "../services/store_service.js";

export const router = express.Router();

router.post("/checkout", async (req, res) => {
  const customerId = req.body.customerId;

  await checkOutAndCreateOrder(customerId);
  return res
    .status(201)
    .json("Checkout done successfully and order has been saved");
});
