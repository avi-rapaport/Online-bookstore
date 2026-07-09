import express from "express";
import "dotenv/config";
import { router as bookRouter } from "./routers/book_router.js";
import { router as customerRouter } from "./routers/customer_router.js";

const app = express();

app.use(express.json());

app.use("/books", bookRouter);
app.use("/customers", customerRouter);

app.get("/", (req, res) => {
  res.send("Wellcome to my Online bookstore");
});

app.get("/health", (req, res) => {
  res.end("server is healthy...");
});

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`server is listening on port ${PORT}...`);
});
