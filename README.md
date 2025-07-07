# AdaptNxt E-Commerce Assignment

A full-stack e-commerce platform with modern best practices, featuring:

- **Express.js + MongoDB** backend
- **React + Vite + Tailwind CSS + DaisyUI** frontend
- JWT authentication, role-based access, modular structure, and robust validation

---

## 🚀 Live Demo

- **Frontend:** [https://adaptnxt-assignment-react.onrender.com](https://adaptnxt-assignment-react.onrender.com)
- **Backend API Base URL:** [https://adaptnxt-assignment-backend.onrender.com/api](https://adaptnxt-assignment-backend.onrender.com/api)

---

## 🧪 Testing Credentials

### Customer User

- **Email:** `kalyan@gmail.com`
- **Password:** `Kalyan@123`

### Admin User

- **Email:** `admin@shoploom.com`
- **Password:** `Admin@1234`

---

## ✨ Features

- User authentication (JWT, cookies)
- Role-based access (Admin/Customer)
- Product listing, filtering, and search
- Product management (add/edit/delete) for Admin
- Product details page with add-to-cart and admin controls
- Shopping cart with quantity management
- Order placement and paginated order history
- Centralized validation and error handling
- Responsive, modern UI with Tailwind CSS & DaisyUI
- Toast notifications for all major actions
- Modular, clean codebase (controllers, routes, models, middleware, context, components)

---

## 🛠️ How to Use Locally

1. **Clone the repo:**
   ```bash
   git clone [github link](https://github.com/Kalyanpandaga/adaptNxt-assignment)
   cd adaptNxt-assignment
   ```
2. **Install dependencies:**
   - Backend:
     ```bash
     cd backend
     npm install
     ```
   - Frontend:
     ```bash
     cd ../frontend
     npm install
     ```
3. **Set up environment variables**

- backend

  ```
       MONGO_URI=<your mongoDB connection string>
       JWT_PRIVATE_KEY=<your jwt private key>
       PORT=<your port no>
       FRONTEND_URL=<frontend deployed url>
  ```

  frontend

  ```
  VITE_BASE_URL=<your api's base url>

  ```

4. **Seed the database:**
   - Run the product seeding script and create admin as needed.
5. **Run locally:**
   - Backend: `npm start` (default: http://localhost:5000)
   - Frontend: `npm run dev` (default: http://localhost:5173)

---

## 📦 API Reference

- All backend endpoints are prefixed with `/api`.
- See `backend/src/routes/` for available routes and usage.

---

## 🧹 Best Practices & Clean Architecture

- Modular separation of concerns (controllers, routes, models, middleware, utils)
- Centralized validation and error handling
- Modern React with context, hooks, and modular components
- Responsive, accessible UI
- Secure authentication and role-based access

---
