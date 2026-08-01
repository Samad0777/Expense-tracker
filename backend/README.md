# 💰 Expense Tracker Backend

A clean and beginner-friendly REST API built with **Node.js, Express.js, MongoDB, and JWT Authentication** to power the Expense Tracker frontend.

This backend provides authentication, transaction management, and secure user-specific data access. It is designed to support a React-based SaaS dashboard.

---

## 🚀 Tech Stack

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT Authentication
- HttpOnly Cookies
- bcryptjs
- cookie-parser
- cors
- dotenv
- nodemon

---

## 📂 Project Structure

```text
backend/
│
├── config/
│   ├── db.js
│   └── cookieOptions.js
│
├── controllers/
│   ├── authController.js
│   └── transactionController.js
│
├── middlewares/
│   └── authMiddleware.js
│
├── models/
│   ├── User.js
│   └── Transaction.js
│
├── routes/
│   ├── authRoutes.js
│   └── transactionRoutes.js
│
├── utils/
│   └── generateToken.js
│
├── .env.example
├── package.json
└── server.js
```

---

# ✨ Features

### Authentication

- User Registration
- User Login
- User Logout
- Get Logged-in User
- JWT Authentication
- HttpOnly Cookie Authentication
- Password Hashing using bcryptjs

### Transaction Management

- Create Transaction
- Get All Transactions
- Get Single Transaction
- Update Transaction
- Delete Transaction

### Advanced Features

- Search Transactions
- Filter by Category
- Filter by Type
- Sort (Latest, Oldest, Highest, Lowest)
- Pagination

### Security

- Protected Routes
- User-specific Transactions
- Password Hashing
- JWT Authentication
- HttpOnly Cookies

---

# ⚙️ Installation

Clone the project and install dependencies.

```bash
npm install
```

Create a `.env` file.

```bash
cp .env.example .env
```

Add your environment variables.

```env
PORT=5000

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key

CLIENT_URL=http://localhost:5173

NODE_ENV=development
```

---

# ▶️ Running the Server

Development

```bash
npm run dev
```

Production

```bash
npm start
```

Server

```
http://localhost:5000
```

---

# 📌 API Endpoints

## Authentication

| Method | Endpoint | Description |
|----------|----------------|---------------------------|
| POST | `/api/auth/register` | Register User |
| POST | `/api/auth/login` | Login User |
| POST | `/api/auth/logout` | Logout User |
| GET | `/api/auth/me` | Get Current User |

---

## Transactions

| Method | Endpoint | Description |
|----------|----------------------|-----------------------------|
| GET | `/api/transactions` | Get All Transactions |
| GET | `/api/transactions/:id` | Get Single Transaction |
| POST | `/api/transactions` | Create Transaction |
| PATCH | `/api/transactions/:id` | Update Transaction |
| DELETE | `/api/transactions/:id` | Delete Transaction |

---

# 🔍 Query Parameters

| Parameter | Example | Description |
|------------|---------|-------------|
| search | `?search=food` | Search by Title |
| category | `?category=Food` | Filter by Category |
| type | `?type=Expense` | Filter by Type |
| sort | `?sort=latest` | latest, oldest, high, low |
| page | `?page=1` | Page Number |
| limit | `?limit=10` | Items Per Page |

Example

```http
GET /api/transactions?search=food&type=Expense&sort=latest&page=1&limit=10
```

---

# 📦 Response Format

Success

```json
{
  "success": true,
  "message": "Transaction created successfully",
  "data": {}
}
```

Error

```json
{
  "success": false,
  "message": "Transaction not found"
}
```

---

# 🔒 Security

- Passwords are hashed using **bcryptjs** before storing in the database.
- JWT tokens are stored inside **HttpOnly Cookies**.
- Protected routes require authentication.
- Every transaction belongs to a single authenticated user.
- Users cannot access or modify another user's transactions.

---

# 🎯 Purpose

This backend was built as the API layer for the **Expense Tracker** frontend project.

The primary goal of this project is to practice:

- REST API Development
- Authentication using JWT
- CRUD Operations
- MongoDB & Mongoose
- Backend integration with React
- Industry-style folder structure

---

## 👨‍💻 Author

**Fardeen**