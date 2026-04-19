const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const { Order, OrderItem, Product } = require("../models");

const createCheckoutSession = async (req, res) => {
    try {
        const { orderId } = req.body;

        if (!orderId) {
            return res.status(400).json({ message: "Order ID is required" });
        }

        const order = await Order.findByPk(orderId, {
            include: [{
                model: OrderItem,
                as: 'items',
                include: [{ model: Product }]
            }]
        });

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        if (order.status !== 'pending') {
            return res.status(400).json({ message: "Order is already processed" });
        }

        const lineItems = order.items.map((item) => ({
            price_data: {
                currency: "usd",
                product_data: {
                    name: item.Product.name,
                },
                unit_amount: Math.round(item.price * 100), // Stripe expects cents
            },
            quantity: item.quantity,
        }));

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: lineItems,
            mode: "payment",
            success_url: `http://localhost:3000/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: "http://localhost:3000/cart",
            client_reference_id: order.id.toString(), // Store order ID safely
        });

        res.json({ id: session.id, url: session.url });
    } catch (error) {
        console.error("Stripe error:", error);
        res.status(500).json({ message: error.message });
    }
};

const fulfillCheckout = async (req, res) => {
    try {
        const { session_id } = req.body;

        if (!session_id) {
            return res.status(400).json({ message: "Session ID is required" });
        }

        const session = await stripe.checkout.sessions.retrieve(session_id);

        if (session.payment_status === "paid") {
            const orderId = session.client_reference_id;
            
            // Check current status for idempotency (avoid error on refresh)
            const order = await Order.findByPk(orderId);
            if (!order) {
                return res.status(404).json({ message: "Order not found" });
            }

            // If already processed, return success immediately
            if (['processing', 'shipped', 'delivered'].includes(order.status)) {
                return res.json({ message: "Order already fulfilled successfully", orderId });
            }

            const [updatedRows] = await Order.update(
                { status: "processing" },
                { where: { id: orderId, status: "pending" } }
            );

            if (updatedRows > 0) {
                return res.json({ message: "Order fulfilled successfully", orderId });
            } else {
                return res.status(400).json({ message: "Order could not be processed" });
            }
        }

        res.status(400).json({ message: "Payment not completed" });
    } catch (error) {
        console.error("Stripe fulfillment error:", error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createCheckoutSession, fulfillCheckout };
