const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
let clients = []; // לצורך הדגמה, אפשר להחליף ב־PostgreSQL מאוחר יותר
let idCounter = 1;

// Get all clients
router.get("/", (req, res) => {
  res.json(clients);
});

// Create client
router.post("/", (req, res) => {
  const newClient = {
    id: idCounter++,
    ...req.body,
    createdAt: new Date().toISOString(),
  };
  clients.push(newClient);
  res.status(201).json(newClient);
});

// Update client
router.put("/:id", (req, res) => {
  const index = clients.findIndex((c) => c.id === parseInt(req.params.id));
  if (index === -1) return res.sendStatus(404);
  clients[index] = { ...clients[index], ...req.body };
  res.json(clients[index]);
});

// Delete client
router.delete("/users/:id", async (req, res) => {
  const userId = parseInt(req.params.id);
  if (isNaN(userId)) {
    return res.status(400).json({ error: "Invalid user ID" });
  }

  try {
    const deletedUser = await prisma.user.delete({
      where: { id: userId },
    });
    res.json({ message: "User deleted", user: deletedUser });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({ error: "Could not delete user" });
  }
});
router.get("/companies", async (req, res) => {
  try {
    const companies = await prisma.company.findMany({
      select: { id: true, name: true },
    });
    res.json(companies);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch companies" });
  }
});

module.exports = router;
