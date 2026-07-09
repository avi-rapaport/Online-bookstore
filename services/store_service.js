import { readData, saveData } from "./file_service.js";

const DB_BASE_PATH = process.env.DB_BASE_PATH;
const STARTING_BALANCE = process.env.STARTING_BALANCE;

export async function getBooks(inStock, maxPrice, search) {
  let books = await readData(DB_BASE_PATH + "/books.json");
  if (inStock) books = books.filter((book) => book.stock > 0);
  if (maxPrice) books = books.filter((book) => book.price <= maxPrice);
  if (search) books = books.filter((book) => book.name.includes(search));
  return books;
}

export async function getCustomerById(customerId) {
  const customers = await readData(DB_BASE_PATH + "/customers.json");
  const customer = customers.find((c) => c.customerId === customerId);
  return customer;
}

export async function getBookById(bookId) {
  const books = await readData(DB_BASE_PATH + "/books.json");
  const book = books.find((book) => book.id === bookId);
  return book;
}

export async function addBookToCart(customerId, bookId, quantity) {
  const customers = await readData(DB_BASE_PATH + "/customers.json");
  const books = await readData(DB_BASE_PATH + "/books.json");

  let customer = customers.find((c) => c.customerId === customerId);
  if (!customer) {
    customer = {
      customerId: customerId,
      balance: STARTING_BALANCE,
      cart: [],
      createdAt: new Date(),
    };
    customers.push(customer);
  }

  const book = books.find((book) => book.id === bookId);
  if (!book) {
    const error = new Error("book not found!");
    error.status = 404;
    throw error;
  }

  if (book.stock < quantity) {
    const error = new Error("not enough books to buy!");
    error.status = 400;
    throw error;
  }
  if (!customer.cart) {
    customer.cart = [];
  }

  const alreadyInCart = customer.cart.find((book) => book.bookId === bookId);

  if (alreadyInCart) {
    alreadyInCart.quantity += quantity;
  } else {
    customer.cart.push({ bookId, quantity });
  }
  await saveData(DB_BASE_PATH + "/customers.json", customers);

  return customer.cart;
}

export async function removeBookFromCart(customerId, bookId) {
  const customers = await readData(DB_BASE_PATH + "/customers.json");

  const customer = customers.find((c) => c.customerId === customerId);
  if (!customer) {
    const error = new Error("customer not found!");
    error.status = 404;
    throw error;
  }

  const book = customer.cart.find((book) => book.bookId === bookId);
  if (!book) {
    const error = new Error("book was not found in the cart!");
    error.status = 404;
    throw error;
  }

  if (customer.cart.length === 0) {
    const error = new Error("Cart is empty!");
    error.status = 400;
    throw error;
  }

  customer.cart = customer.cart.filter((book) => book.bookId !== bookId);

  await saveData(DB_BASE_PATH + "/customers.json", customers);
}

export async function checkOutAndCreateOrder(customerId) {
  const customers = await readData(DB_BASE_PATH + "/customers.json");
  const customer = customers.find((c) => c.customerId === customerId);
  if (!customer) {
    const error = new Error("customer not found!");
    error.status = 404;
    throw error;
  }

  if (customer.cart.length === 0) {
    const error = new Error("customer cart is empty!");
    error.status = 400;
    throw error;
  }

  let total = 0;
  const items = [];

  for (const book of customer.cart) {
    const bookToBy = await getBookById(book.bookId);
    if (book.quantity > bookToBy.stock) {
      const error = new Error("not enough books in the inventory to buy!");
      error.status = 400;
      throw error;
    }
    total += bookToBy.price * book.quantity;
    items.push({ ...book, price: bookToBy.price });
  }

  if (total > customer.balance) {
    const error = new Error("customer doesn't have enough money!");
    error.status = 400;
    throw error;
  }

  customer.balance -= total;
  customer.cart = [];

  const booksInventory = await readData(DB_BASE_PATH + "/books.json");
  for (const book of customer.cart) {
    const bookToBy = await getBookById(book.bookId);
    bookToBy.stock -= book.quantity;
  }

  const orders = await readData(DB_BASE_PATH + "/orders.json");
  const newOrderId = orders.length > 0 ? orders[orders.length - 1].id + 1 : 1;

  const newOrder = {
    id: newOrderId,
    customerId: customerId,
    items: items,
    total: total,
    createdAt: new Date(),
  };

  orders.push(newOrder);
  await saveData(DB_BASE_PATH + "/customers.json", customers);
  await saveData(DB_BASE_PATH + "/orders.json", orders);
}
