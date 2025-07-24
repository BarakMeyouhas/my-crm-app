const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Get all service requests
router.get("/service-requests", async (req, res) => {
  try {
    const { companyId } = req.query;
    const findManyArgs = {
      include: {
        company: true,
        createdBy: true,
      },
      orderBy: { createdAt: "desc" }
    };
    if (companyId) {
      findManyArgs.where = { companyId: Number(companyId) };
    }
    const serviceRequests = await prisma.serviceRequest.findMany(findManyArgs);
    res.json(serviceRequests);
  } catch (err) {
    console.error("Error fetching service requests:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router; 