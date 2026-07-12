# Online Bookstore API

A REST API for managing an online bookstore. The system allows customers to browse books, manage their shopping cart, place orders, and check their account balance.

---

## Features

- Get all books
- Add books to a customer's cart
- Remove books from the cart
- Checkout customer orders
- View customer balance
- View customer cart
- View customer order history

---

## Installation

Clone the repository:

```bash
git clone https://github.com/avi-rapaport/Online-bookstore.git
cd online-bookstore
```

Install dependencies:

```bash
npm install
```

Create a `.env` file using `.env.example`.

Example:

```env
PORT=3000
```

Start the server:

```bash
node app.js
```

---

## Project Structure

```
online-bookstore/
│
├── db/
│   ├── books.json
│   ├── customers.json
│   └── orders.json
│
├── routes/
│   ├── book_router.js
│   ├── customer_router.js
│   └── orders_router.js
│
├── services/
│   ├── file_service.js
│   └── store_service.js
│
├── .env
├── .env.example
├── .gitignore
├── app.js
├── package.json
├── package-lock.json
├── validations.js
└── README.md
```

---

## Main API Endpoints

### Books

- `GET /books`

### Customers

- `GET /cart`
- `POST /cart/items`
- `DELETE /cart/items/:bookId`
- `GET /account/balance`

### Orders

- `POST /orders/checkout`
- `GET /orders`

---

## Data Storage

The application stores its data inside the `db` folder:

- `books.json` – books available in the store
- `customers.json` – customer information
- `orders.json` – completed orders

---

## Environment Variables

Create a `.env` file before running the project.

Example:

```env
PORT=3000
```
