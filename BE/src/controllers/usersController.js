const usersModel = require('../models/usersModel');

// Get all users (admin view)
const getAllUsersAdmin = async (req, res) => {
    try {
        const rows = await usersModel.getAllUsers();
        res.json({ success: true, data: rows });
    } catch (error) {
        console.error('Get all users error:', error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// Get single user by id
const getUserByIdAdmin = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await usersModel.getUserById(id);
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });
        res.json({ success: true, data: user });
    } catch (error) {
        console.error(`Get user ${id} error:`, error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// Update user (admin) - partial updates supported (status, name, profile_picture)
const updateUserAdmin = async (req, res) => {
    const { id } = req.params;
    const { status, name, profile_picture } = req.body;
    try {
        const fields = {};
        if (status !== undefined) fields.status = status;
        if (name !== undefined) fields.name = name;
        if (profile_picture !== undefined) fields.profile_picture = profile_picture;

        if (Object.keys(fields).length === 0) {
            return res.status(400).json({ success: false, message: 'No fields to update' });
        }

        const updated = await usersModel.updateUser(id, fields);
        if (!updated) return res.status(404).json({ success: false, message: 'User not found' });
        res.json({ success: true, data: updated });
    } catch (error) {
        console.error(`Update user ${id} error:`, error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

module.exports = {
    getAllUsersAdmin,
    getUserByIdAdmin,
    updateUserAdmin,
};
