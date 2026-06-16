# GymGear Marketplace — Project Guide

## Tech Stack
- **Frontend**: React + Vite + Tailwind CSS v4 + React Router + Axios + Clerk
- **Backend**: Node.js + Express + Mongoose + Socket.io
- **Database**: MongoDB Atlas
- **Auth**: Clerk
- **Real-time**: Socket.io
- **Images**: MongoDB GridFS

## Project Structure
```
backend/
  config/db.js        — MongoDB connection
  models/             — Mongoose models (User, Product, Cart, Order, Review, Message)
  routes/             — Express API routes (products, cart, orders, reviews, chat, admin)
  middleware/auth.js  — Clerk auth middleware
  server.js           — Entry point
frontend/
  src/
    api/axios.js      — Axios instance with auth interceptor
    components/       — Shared components (Navbar)
    pages/            — Route pages (HomePage, ProductsPage, etc.)
```

## Running the Project
```powershell
# Backend
cd backend; npm run dev    # http://localhost:5000

# Frontend
cd frontend; npm run dev   # http://localhost:5173
```

## Environment Variables
### Backend (.env)
- `PORT` — Backend port (default: 5000)
- `MONGODB_URI` — MongoDB connection string
- `CLERK_SECRET_KEY` — Clerk secret key

### Frontend (.env)
- `VITE_CLERK_PUBLISHABLE_KEY` — Clerk publishable key
- `VITE_API_URL` — Backend API URL

## API Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST   | /api/sync-user | Sync Clerk user to MongoDB |
| GET    | /api/products | List products (with filters) |
| GET    | /api/products/:id | Get product details |
| POST   | /api/products | Create product |
| PUT    | /api/products/:id | Update product |
| DELETE | /api/products/:id | Soft-delete product |
| GET    | /api/cart | Get user cart |
| POST   | /api/cart/add | Add item to cart |
| DELETE | /api/cart/remove | Remove item from cart |
| POST   | /api/orders | Create order |
| GET    | /api/orders | List user orders |
| PUT    | /api/orders/:id/status | Update order status |
| POST   | /api/reviews | Create review |
| GET    | /api/reviews/:productId | Get product reviews |
| GET    | /api/chat | Get messages |
| POST   | /api/chat | Send message |
| GET    | /api/admin/users | List all users |
| DELETE | /api/admin/users/:id | Delete user |
| GET    | /api/admin/reports | Get platform stats |

## MCP Servers
- **MongoDB** — `mongodb-mcp-server` (configured in opencode.json)
