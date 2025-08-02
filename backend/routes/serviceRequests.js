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
    const {
      title,
      description,
      status = "PENDING",
      urgency = "MEDIUM",
      dueDate,
      companyId,
      createdById
    } = req.body;

    // Validate required fields
    if (!title || !description || !companyId || !createdById) {
      return res.status(400).json({ 
        message: "Missing required fields: title, description, companyId, and createdById are required" 
      });
    }

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

    res.status(201).json(serviceRequest);
  } catch (err) {
    console.error("Error creating service request:", err);
    res.status(500).json({ message: "Server error" });
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