const express = require("express");
const { registerUser, loginUser, getUserProfile, updateUserProfile, getUsers, updateUser, deleteUser } = require("../controllers/userController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, updateUserProfile);
router.route("/").get(protect, adminOnly, getUsers);
router.route("/:id").put(protect, adminOnly, updateUser).delete(protect, adminOnly, deleteUser);

module.exports = router;
