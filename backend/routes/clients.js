const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/auth");

let clients = []; // לצורך הדגמה, אפשר להחליף ב־PostgreSQL מאוחר יותר
let idCounter = 1;

// Get all clients
router.get("/", authenticateToken, (req, res) => {
  res.json(clients);
});

// Create client
router.post("/", authenticateToken, (req, res) => {
  const newClient = {
    id: idCounter++,
    ...req.body,
    createdAt: new Date().toISOString(),
  };
  clients.push(newClient);
  res.status(201).json(newClient);
});

// Update client
router.put("/:id", authenticateToken, (req, res) => {
  const index = clients.findIndex((c) => c.id === parseInt(req.params.id));
  if (index === -1) return res.sendStatus(404);
  clients[index] = { ...clients[index], ...req.body };
  res.json(clients[index]);
});

// Delete client
router.delete("/:id", authenticateToken, (req, res) => {
  clients = clients.filter((c) => c.id !== parseInt(req.params.id));
  res.sendStatus(204);
});

module.exports = router;
