const express = require("express");
const router = express.Router();

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// GET /api/companies - מחזיר רשימת חברות מה-DB
router.get("/companies", async (req, res) => {
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

module.exports = router;
