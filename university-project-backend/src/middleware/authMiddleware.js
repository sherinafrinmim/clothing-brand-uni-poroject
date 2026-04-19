const jwt = require("jsonwebtoken")
const { User } = require("../models")

const protect = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization || ""
        const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null

        if (!token) {
            return res.status(401).json({ message: "Unauthorized, token missing" })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = await User.findByPk(decoded.id, {
            attributes: { exclude: ['password'] }
        })

        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized, user not found" })
        }

        next()
    } catch (error) {
        res.status(401).json({ message: "Unauthorized, invalid token" })
    }
}

const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === "admin") {
        return next()
    }
    return res.status(403).json({ message: "Forbidden, admin access required" })
}

module.exports = { protect, adminOnly }
