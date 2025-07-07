# adaptNxt-assignment

[GitHub Repository](https://github.com/Kalyanpandaga/adaptNxt-assignment)

---

## 🛒 E-Commerce Platform (Full Stack)

A modern, full-stack e-commerce platform built with **Express.js + MongoDB** (backend) and **React + Vite + Tailwind CSS + DaisyUI** (frontend).

---

## 📦 Backend (Express.js + MongoDB)

### **Features**

- **Authentication**: JWT-based login/signup, role-based access (Customer/Admin)
- **Product Management**: CRUD for products, search, pagination, admin-only management
- **Cart Management**: Add, update, remove products in cart (customer only)
- **Order Management**: Place orders from cart, view orders (customer sees own, admin sees all)
- **Input Validation**: Centralized, custom validators for all routes
- **Error Handling**: Centralized error responses
- **Modular Structure**: Controllers, routes, middleware, validations, models

### **How to Run Backend Locally**

1. **Install dependencies:**
   ```bash
   cd backend
   npm install
   ```
2. **Configure environment:**
   - Set up your MongoDB connection string and JWT secret in `src/config/constants.js` or via environment variables.
3. **Start the server:**
   ```bash
   npm start
   ```
   The backend will run on the port specified in your config (default: 5000).

---

## 🎨 Frontend (React + Vite + Tailwind CSS + DaisyUI)

### **Features**

- **Modern UI**: Responsive, mobile-friendly, styled with Tailwind CSS and DaisyUI
- **Authentication**: Login/Signup with JWT, context-based auth, role-based route protection
- **Product Browsing**: Public product grid, search, pagination, add to cart
- **Cart**: View, update, remove items, place order (customer only)
- **Orders**: View orders (customer: own, admin: all)
- **Admin Dashboard**: Add, edit, delete products (admin only)
- **Reusable Components**: Navbar, ProtectedRoute, forms, modals
- **API Integration**: Axios with JWT from cookies, auto-attached to requests
- **Validation & Feedback**: Form validation, loading spinners, error/success messages

### **How to Run Frontend Locally**

1. **Install dependencies:**
   ```bash
   cd frontend
   npm install
   ```
2. **Start the dev server:**
   ```bash
   npm run dev
   ```
   The frontend will run on [http://localhost:5173](http://localhost:5173) by default.
3. **API Proxy:**
   - Ensure your Vite config proxies `/api` requests to your backend server (see `vite.config.js`).

---

## 📝 Folder Structure

```
adaptNxt-assignment/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── models/
│   │   ├── middleware/
│   │   ├── utils/
│   │   └── config/
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
└── README.md
```

---

## 🔗 Useful Links

- **GitHub:** [https://github.com/Kalyanpandaga/adaptNxt-assignment](https://github.com/Kalyanpandaga/adaptNxt-assignment)
- **Tailwind CSS Docs:** [https://tailwindcss.com/docs/installation/using-vite](https://tailwindcss.com/docs/installation/using-vite)
- **DaisyUI Docs:** [https://daisyui.com/](https://daisyui.com/)

---

## 🤝 Contributing

Pull requests and suggestions are welcome!
