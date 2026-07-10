import express from "express";
import { checkOutAndCreateOrder } from "../services/store_service.js";
import { getOrderByCustomerId } from "../services/store_service.js";

export const router = express.Router();

router.post("/checkout", async (req, res) => {
  try {
    const customerId = Number(req.body.customerId);

    if (!req.body.customerId || isNaN(customerId) || customerId <= 0) {
      return res
        .status(400)
        .json({ success: false, message: "Missing or invalid customerId!" });
    }

    await checkOutAndCreateOrder(customerId);
    return res
      .status(201)
      .json("Checkout done successfully and order has been saved");
  } catch (err) {
    console.log(err.message);
    const statusCode = err.status || 500;
    return res
      .status(statusCode)
      .json({ success: false, message: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const customerId = Number(req.query.customerId);

    if (!req.query.customerId || isNaN(customerId) || customerId <= 0) {
      return res
        .status(400)
        .json({ success: false, message: "Missing or invalid customerId!" });
    }

    const customerOrdrs = await getOrderByCustomerId(customerId);
    res.json({ success: true, data: customerOrdrs });
  } catch (err) {
    console.log(err.message);
    const statusCode = err.status || 500;
    return res
      .status(statusCode)
      .json({ success: false, message: err.message });
  }
});
