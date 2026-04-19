const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.post("/", protect, adminOnly, upload.single("image"), (req, res) => {
  if (!req.file) {
     return res.status(400).send("No image uploaded");
  }
  res.send(`/${req.file.path.replace(/\\/g, "/")}`);
});

module.exports = router;
