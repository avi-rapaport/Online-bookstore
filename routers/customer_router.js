import express from "express";
import { getCustomerById } from "../services/store_service.js";
import { validateAddToCart } from "../validations.js";
import { addBookToCart } from "../services/store_service.js";
import { removeBookFromCart } from "../services/store_service.js";

export const router = express.Router();

router.get("/cart", async (req, res) => {
  const customerId = req.query.customerId;
  const customer = await getCustomerById(customerId);
  if (!customer) {
    return res
      .status(404)
      .json({ success: false, message: "customer not found!" });
  }

  return res.json({ message: "Success", data: customer.cart });
});

router.post("/cart/items", async (req, res) => {
  try {
    const valid = validateAddToCart(req.body);
    if (!valid.isValid) {
      return res.status(400).json({ success: false, message: valid.errors });
    }
    const { customerId, bookId, quantity } = req.body;

    const updatedCart = await addBookToCart(customerId, bookId, quantity);
    return res.status(201).json({ success: true, data: updatedCart });
  } catch (err) {
    console.log(err.message);
    const statusCode = err.status || 500;
    return res
      .status(statusCode)
      .json({ success: false, message: err.message });
  }
});

router.delete("/cart/items/:bookId", async (req, res) => {
  try {
    const customerId = +req.body.customerId;
    const bookId = +req.params.bookId;

    if (!customerId || isNaN(customerId) || !bookId || isNaN(bookId)) {
      return res
        .status(400)
        .json({ success: false, message: "id must be a number!" });
    }

    await removeBookFromCart(customerId, bookId);
    return res.json({
      success: true,
      message: "book removed successfully from cart",
    });
  } catch (err) {
    console.log(err.message);
    const statusCode = err.status;
    return res.status(statusCode).json(err.message);
  }
});

router.get("/account/balance", async (req, res) => {
  try {
    const customerId = +req.query.customerId;
    if (!customerId || isNaN(customerId)) {
      return res
        .status(400)
        .json({ success: false, message: "id must be a number!" });
    }

    const customer = getCustomerById(customerId);
  } catch (err) {
    console.log(err.message);
    return res.status(404).json("customer not found!");
  }
});
