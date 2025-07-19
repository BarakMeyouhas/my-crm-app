const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const { PrismaClient } = require("@prisma/client");
require("dotenv").config();
const { authenticateToken, authorizeRoles } = require("./middleware/auth"); // ✅ שים לב לשורה הזו

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

const clientsRoute = require("./routes/clients");
app.use("/api/clients", clientsRoute);

// Middleware
app.use(cors());
app.use(express.json());

// Register route
app.post("/api/auth/register", async (req, res) => {
  const { email, password } = req.body;

  try {
    // בדוק אם המשתמש כבר קיים
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // הצפן סיסמה
    const hashedPassword = await bcrypt.hash(password, 10);

    // צור משתמש חדש במסד
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    res
      .status(201)
      .json({ message: "User registered successfully", userId: newUser.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

const jwt = require("jsonwebtoken");

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // צור טוקן
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || "defaultsecret", // תקבע ב־.env
      { expiresIn: "1h" }
    );

    res.json({ message: "Login successful", token, role: user.role });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

const authRoutes = require("./routes/auth");
app.use("/api", authRoutes); // ⬅️ כל הראוטים שב-auth.js נגישים דרך /api

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
