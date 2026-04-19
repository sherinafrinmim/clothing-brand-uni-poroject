const jwt = require("jsonwebtoken")
const { User } = require("../models")

const generateToken = (id) =>
    jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "7d"
    })

const registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body
        if (!name || !email || !password) {
            return res.status(400).json({ message: "Name, email and password are required" })
        }

        const existingUser = await User.findOne({ where: { email } })
        if (existingUser) {
            return res.status(400).json({ message: "Email already in use" })
        }

        const user = await User.create({ name, email, password, role })
        return res.status(201).json({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user.id)
        })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ where: { email } })
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ message: "Invalid email or password" })
        }

        return res.json({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user.id)
        })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

const getUserProfile = async (req, res) => res.json(req.user)

const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);
        if (user) {
            user.name = req.body.name || user.name;
            if (req.body.password) {
                user.password = req.body.password; // hook will hash it
            }
            const updatedUser = await user.save();
            return res.json({
                id: updatedUser.id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
            });
        }
        throw new Error('User not found');
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const getUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: { exclude: ['password'] }
        })
        return res.json(users)
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

const updateUser = async (req, res) => {
    try {
        const [updated] = await User.update(req.body, { 
            where: { id: req.params.id },
            individualHooks: true 
        });
        if (updated) {
            const updatedUser = await User.findByPk(req.params.id, { attributes: { exclude: ['password'] } });
            return res.json(updatedUser);
        }
        throw new Error('User not found');
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const deleteUser = async (req, res) => {
    try {
        const deleted = await User.destroy({ where: { id: req.params.id } });
        if (deleted) {
            return res.json({ message: "User deleted successfully" });
        }
        throw new Error('User not found');
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

module.exports = { registerUser, loginUser, getUserProfile, updateUserProfile, getUsers, updateUser, deleteUser }
