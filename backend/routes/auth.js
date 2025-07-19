const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const { authenticateToken, authorizeRoles } = require("../middleware/auth"); // ⬅️ חשוב מאוד

const prisma = new PrismaClient();

router.get("/profile", authenticateToken, async (req, res) => {
  console.log("req.user", req.user); // 🟢 צריך להדפיס את ה־user

  const user = await prisma.user.findUnique({
    where: { id: req.user.userId },
    select: { id: true, email: true, role: true },
  });
  res.json(user);
});
router.get(
  "/admin/users",
  authenticateToken,
  authorizeRoles("admin"),
  async (req, res) => {
    const users = await prisma.user.findMany({
      select: { id: true, email: true, role: true },
    });
    res.json(users);
  }
);

module.exports = router;
