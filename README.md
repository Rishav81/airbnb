# 🏡 Airbnb Clone / StayFinder

> A full-stack Airbnb-inspired web application built using Node.js, Express, MongoDB, and EJS following MVC architecture.

This project demonstrates real-world backend architecture, secure authentication, role-based authorization, and booking system implementation.

---

## 🚀 Tech Stack

![Node.js](https://img.shields.io/badge/Node.js-Backend-green)
![Express](https://img.shields.io/badge/Express.js-Framework-black)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-green)
![Mongoose](https://img.shields.io/badge/Mongoose-ODM-red)
![EJS](https://img.shields.io/badge/EJS-Templating-blue)
![Tailwind](https://img.shields.io/badge/TailwindCSS-UI-blue)
![MVC](https://img.shields.io/badge/Architecture-MVC-orange)

---

## ✨ Features

### 🔐 Authentication & Authorization
- User Signup & Login
- Secure password hashing (bcrypt – 12 salt rounds)
- Session-based authentication
- Session regeneration for security
- Role-based access (User / Host)
- Logout with session destruction
- Server-side validation using express-validator

---

### 🏠 Property Management (Host)
- Add new property
- Edit property
- Delete property
- Manage only own listings
- Location-based filtering

---

### 📅 Booking System (User)
- Book properties
- View booking history
- Cancel bookings
- MongoDB relationship between User ↔ Property ↔ Booking

---

### 👤 Profile Management
- View profile
- Update profile details
- Session data updated after profile change

---

## 🏗 Architecture

This project follows **MVC Architecture**:




project-root/
│
├── controllers/ → Business logic
├── models/ → MongoDB schemas
├── routes/ → Route handling
├── middlewares/ → Custom middleware
├── views/ → EJS templates
├── public/ → Static files
├── config/ → DB configuration
└── app.js





### 🔹 Design Principles
- Separation of concerns
- Scalable folder structure
- Clean route-controller separation
- Reusable validation logic

---

## 🔐 Security Implementation

- Password hashing using bcrypt
- Unique email enforcement
- Server-side validation
- Role-based route protection
- Session regeneration on login
- Sensitive data excluded from session

---

## 🌐 HTTP Routes

### Authentication

| Method | Route | Access |
|--------|-------|--------|
| GET | /login | Public |
| POST | /login | Public |
| GET | /signup | Public |
| POST | /signup | Public |
| POST | /logout | Private |

---

### Profile

| Method | Route | Access |
|--------|-------|--------|
| GET | /profile-detail | Private |
| POST | /profile-detail | Private |

---

### Properties

| Method | Route | Access |
|--------|-------|--------|
| GET | / | Public |
| GET | /homes/:homeId | Public |
| GET | /add-home | Host |
| POST | /add-home | Host |
| GET | /edit-home/:homeId | Host |
| POST | /edit-home/:homeId | Host |
| POST | /delete-home/:homeId | Host |

---

### Bookings

| Method | Route | Access |
|--------|-------|--------|
| POST | /book/:homeId | User |
| GET | /bookings | User |
| POST | /cancel-booking/:bookingId | User |

---

## ⚙️ Installation

### 1️⃣ Clone Repository

```bash
git clone https://github.com/yourusername/airbnb-clone.git
cd airbnb-clone
