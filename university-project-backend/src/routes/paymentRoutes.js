const express = require("express");
const { createCheckoutSession, fulfillCheckout } = require("../controllers/paymentController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/create-checkout-session", protect, createCheckoutSession);
router.post("/fulfill", protect, fulfillCheckout);

module.exports = router;
