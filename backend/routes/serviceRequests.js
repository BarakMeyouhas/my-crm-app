const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Get all service requests
router.get("/", async (req, res) => {
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

// Create a new service request
router.post("/", async (req, res) => {
  try {
    console.log("🔍 Received service request data:", req.body);
    console.log("🔄 Backend version: 1.0.1 - Enhanced logging enabled");
    
    const {
      title,
      description,
      status = "PENDING",
      urgency = "MEDIUM",
      dueDate,
      companyId,
      createdById
    } = req.body;

    console.log("📦 Extracted data:", {
      title,
      description,
      status,
      urgency,
      dueDate,
      companyId,
      createdById
    });

    // Validate required fields
    if (!title || !description || !companyId || !createdById) {
      console.log("❌ Missing required fields");
      return res.status(400).json({ 
        message: "Missing required fields: title, description, companyId, and createdById are required" 
      });
    }

    console.log("📤 Creating service request with data:", {
      title,
      description,
      status,
      urgency,
      dueDate: dueDate ? new Date(dueDate) : null,
      companyId: Number(companyId),
      createdById: Number(createdById)
    });

    const serviceRequest = await prisma.serviceRequest.create({
      data: {
        title,
        description,
        status,
        urgency,
        dueDate: dueDate ? new Date(dueDate) : null,
        companyId: Number(companyId),
        createdById: Number(createdById)
      },
      include: {
        company: true,
        createdBy: true
      }
    });

    console.log("✅ Service request created successfully:", serviceRequest);
    res.status(201).json(serviceRequest);
  } catch (err) {
    console.error("❌ Error creating service request:", err);
    console.error("❌ Error details:", err.message);
    console.error("❌ Error stack:", err.stack);
    res.status(500).json({ 
      message: "Server error", 
      details: err.message 
    });
  }
});

// Update a service request
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      status,
      urgency,
      dueDate,
    } = req.body;

    const serviceRequest = await prisma.serviceRequest.update({
      where: { id: Number(id) },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(status && { status }),
        ...(urgency && { urgency }),
        ...(dueDate && { dueDate: new Date(dueDate) }),
        updatedAt: new Date()
      },
      include: {
        company: true,
        createdBy: true
      }
    });

    res.json(serviceRequest);
  } catch (err) {
    console.error("Error updating service request:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router; 