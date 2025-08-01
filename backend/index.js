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

// Public routes (no authentication required)
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

// Public companies endpoint for registration
app.get("/api/public/companies", async (req, res) => {
  try {
    const companies = await prisma.company.findMany({
      select: { id: true, name: true }
    });
    res.json(companies);
  } catch (err) {
    console.error("Failed to fetch companies:", err);
    res.status(500).json({ message: "Failed to fetch companies" });
  }
});

// Protected routes - require authentication
const clientsRoute = require("./routes/clients");
app.use("/api/clients", authenticateToken, clientsRoute);

const serviceRequestsRouter = require("./routes/serviceRequests");
app.use("/api/service-requests", authenticateToken, serviceRequestsRouter);

const companiesRouter = require("./routes/companies");
app.use("/api/companies", authenticateToken, companiesRouter);

// Profile route - requires authentication but not admin role
app.get("/api/profile", authenticateToken, async (req, res) => {
  console.log("req.user", req.user); // 🟢 צריך להדפיס את ה־user

  const user = await prisma.user.findUnique({
    where: { id: req.user.userId },
    select: {
      id: true,
      email: true,
      role: true,
      firstName: true,
      lastName: true,
      companyId: true, // <-- add this
      company: {
        select: { name: true }
      }
    },
  });
  if (user) {
    res.json({
      id: user.id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      companyId: user.companyId, // <-- add this
      companyName: user.company.name
    });
  } else {
    res.status(404).json({ error: "User not found" });
  }
});

// Admin-only routes
const authRoutes = require("./routes/auth");
app.use("/api/admin", authenticateToken, authorizeRoles('Admin'), authRoutes);

// Start server only if not in test environment
let server;
if (process.env.NODE_ENV !== 'test') {
  server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Export app for testing
module.exports = app;
