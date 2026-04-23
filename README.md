# Online Event Registration System

A complete full-stack web application built with the MERN stack (MongoDB, Express.js, React.js, Node.js) and Tailwind CSS. It digitizes college event registration, allowing students to easily browse events, sign up, and track their participation, while giving college admins a unified dashboard to create and manage registrations.

## Features
- **Student Dashboard:** View upcoming events, register with one click, get downloadable QR Code tickets.
- **Admin Dashboard:** Create and manage events, view visual registration analytics.
- **Authentication:** JWT-based secure authentication with Bcrypt password hashing.
- **Modern UI:** Tailwind CSS powered aesthetics featuring Dark Mode, glassmorphism, and responsive design.

---

## Prerequisites
Before you begin, ensure you have the following installed on your machine:
- **Node.js** (v16.x or higher)
- **MongoDB** (Running locally on default port 27017, or a MongoDB Atlas URI)

---

## Steps to Run Locally

### 1. Clone or Extrat the Repository
Navigate to the root directory (`event/`).

### 2. Setup the Backend
Open a terminal and navigate to the backend directory:
```bash
cd backend
```
Install the backend dependencies:
```bash
npm install
```
Ensure your MongoDB is running locally. The `.env` file is already pre-configured to connect to `mongodb://127.0.0.1:27017/event-registration`.

**(Optional) Seed the Database with Dummy Data:**  
If you want to quickly test the app with pre-filled users and events, run the seed script:
```bash
node utils/seed.js
```

Start the backend server (it will run on `http://localhost:5000`):
```bash
node server.js
```

### 3. Setup the Frontend
Open a **new** terminal and navigate to the frontend directory:
```bash
cd frontend
```
Install the frontend dependencies:
```bash
npm install
```
Start the frontend React development server:
```bash
npm run dev
```

### 4. Open the Application
Navigate to [http://localhost:5173](http://localhost:5173) in your web browser. 

**Test Accounts:**
If you ran the seed script in Step 2, you can use these accounts to log in:
- **Admin Login:**
  - Email: `admin@college.edu`
  - Password: `password123`
- **Student Login:**
  - You can either register a brand new account from the web UI, or use the seeded student:
  - Email: `student@college.edu`
  - Password: `password123`
