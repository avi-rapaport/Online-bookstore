import { getBooks } from "../services/store_service.js";
import express from "express";

export const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { inStock, maxPrice, search } = req.query;
    const books = await getBooks(inStock, maxPrice, search);

    res.json({ success: true, data: books });
  } catch (err) {
    console.log(err.message);
    return res
      .status(500)
      .json({ Success: true, Mesage: "Internal Server Error" });
  }
});
