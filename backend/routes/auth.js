const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const { authenticateToken, authorizeRoles } = require("../middleware/auth"); // ⬅️ חשוב מאוד

const prisma = new PrismaClient();

router.get("/profile", authenticateToken, async (req, res) => {
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
router.get(
  "/admin/users",
  authenticateToken,
  authorizeRoles("Admin"),
  async (req, res) => {
    const users = await prisma.user.findMany({
      select: { id: true, email: true, role: true },
    });
    res.json(users);
  }
);

router.delete(
  "/admin/users/:id",
  authenticateToken,
  authorizeRoles("admin"),
  async (req, res) => {
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
  }
);

module.exports = router;
