const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const { PrismaClient } = require("@prisma/client");
require("dotenv").config();
const { authenticateToken, authorizeRoles } = require("./middleware/auth"); // ✅ שים לב לשורה הזו

const app = express();
app.use(cors()); // <--- Move this here, before any routes!
app.use(express.json());

const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

const clientsRoute = require("./routes/clients");
app.use("/api/clients", clientsRoute);

const serviceRequestsRouter = require("./routes/serviceRequests");
app.use("/api", serviceRequestsRouter);



// Register route
app.post("/api/auth/register", async (req, res) => {
  const { company, user } = req.body;

  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: user.email },
    });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Find company by ID
    const companyId = parseInt(company.companyId, 10);
    console.log('Register: companyId from request:', companyId);
    const existingCompany = await prisma.company.findUnique({
      where: { id: companyId },
    });
    console.log('Register: existingCompany found:', existingCompany);

    if (!existingCompany) {
      return res.status(400).json({ message: "Company not found", companyId });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(user.password, 10);

    // Create the new user
    const newUser = await prisma.user.create({
      data: {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        passwordHash: hashedPassword,
        role: user.role || "Admin",
        companyId: existingCompany.id,
      },
    });

    res.status(201).json({
      message: "User registered successfully",
      userId: newUser.id,
      companyId: existingCompany.id,
    });
  } catch (err) {
    console.error("Registration error:", err);
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
    console.log('Login: user found:', user);

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Compare with user.passwordHash, not user.password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
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
    console.error('Login error:', err);
    res.status(500).json({ message: "Server error" });
  }
});

const authRoutes = require("./routes/auth");
app.use("/api", authRoutes); // ⬅️ כל הראוטים שב-auth.js נגישים דרך /api

const companiesRouter = require("./routes/companies");
app.use("/api", companiesRouter);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Export app for testing
module.exports = app;
