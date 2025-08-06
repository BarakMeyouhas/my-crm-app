const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

router.get("/profile", async (req, res) => {
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

router.get("/users", async (req, res) => {
  const users = await prisma.user.findMany({
    select: { id: true, email: true, role: true },
  });
  res.json(users);
});

// Get users by company with service request count
router.get("/users/company/:companyId", async (req, res) => {
  try {
    console.log("🔍 Backend: Fetching users for company ID:", req.params.companyId);
    const companyId = parseInt(req.params.companyId);
    
    if (isNaN(companyId)) {
      console.log("❌ Backend: Invalid company ID:", req.params.companyId);
      return res.status(400).json({ error: "Invalid company ID" });
    }

    console.log("🔍 Backend: Querying database for company ID:", companyId);
    const users = await prisma.user.findMany({
      where: { companyId: companyId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        company: {
          select: {
            id: true,
            name: true
          }
        },
        _count: {
          select: {
            createdServiceRequests: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    console.log("✅ Backend: Found", users.length, "users for company ID:", companyId);
    console.log("📊 Backend: Users data:", users);
    res.json(users);
  } catch (error) {
    console.error("❌ Backend: Error fetching company users:", error);
    res.status(500).json({ error: "Failed to fetch company users" });
  }
});

// Get user by ID
router.get("/users/:id", async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    
    if (isNaN(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        company: {
          select: {
            id: true,
            name: true
          }
        },
        _count: {
          select: {
            createdServiceRequests: true
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

router.delete("/users/:id", async (req, res) => {
  const userId = parseInt(req.params.id);
  try {
    await prisma.user.delete({
      where: { id: userId },
    });
    res.status(204).send(); // מחיקה הצליחה, אין תוכן להחזיר
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Error deleting user" });
  }
});

module.exports = router;
