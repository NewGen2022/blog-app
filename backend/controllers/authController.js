const { registerUser } = require('../db/queries');

const register = async (req, res) => {
    try {
        const user = await registerUser(req.body.username, req.body.password);
        res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: user.id,
                username: user.username,
                role: user.role,
            },
        });
    } catch (err) {
        console.error('Registration error:', err);

        if (err.message.includes('Username already exists.')) {
            return res.status(409).json({ error: err.message });
        }
        res.status(500).json({
            error: 'Internal server error. Please try again.',
        });
    }
};

module.exports = { register };
