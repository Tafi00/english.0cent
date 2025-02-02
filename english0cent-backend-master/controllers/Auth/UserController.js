const User = require('../../models/User');

// Get user profile
exports.getProfile = async (req, res) => {
    const userId = req.user.id;
    try {
        const user = await User.findById(userId).select('-password');
        if (!user) {
            return res.status(404).json({
                status: "FAILED",
                message: "User not found!"
            });
        }
        res.json({
            status: "SUCCESS",
            user
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            status: "FAILED",
            message: "An error occurred while fetching the profile!"
        });
    }
};

// Update user profile
exports.updateProfile = async (req, res) => {
    const userId = req.user.id;
    const updates = req.body;
    try {
        const user = await User.findByIdAndUpdate(userId, updates, { new: true }).select('-password');
        if (!user) {
            return res.status(404).json({
                status: "FAILED",
                message: "User not found!"
            });
        }
        res.json({
            status: "SUCCESS",
            message: "Profile updated successfully!",
            user
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            status: "FAILED",
            message: "An error occurred while updating the profile!"
        });
    }
};

// Deactivate user account
exports.deactivateAccount = async (req, res) => {
    const userId = req.user.id;
    try {
        const user = await User.findByIdAndUpdate(userId, { active: false }, { new: true });
        if (!user) {
            return res.status(404).json({
                status: "FAILED",
                message: "User not found!"
            });
        }
        res.json({
            status: "SUCCESS",
            message: "Account deactivated successfully!",
            user
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            status: "FAILED",
            message: "An error occurred while deactivating the account!"
        });
    }
};

// Delete user account
exports.deleteAccount = async (req, res) => {
    const userId = req.user.id;
    try {
        const user = await User.findByIdAndDelete(userId);
        if (!user) {
            return res.status(404).json({
                status: "FAILED",
                message: "User not found!"
            });
        }
        res.json({
            status: "SUCCESS",
            message: "Account deleted successfully!"
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            status: "FAILED",
            message: "An error occurred while deleting the account!"
        });
    }
};

// Upgrade user plan
exports.upgradePlan = async (req, res) => {
    const userId = req.user.id;
    const { plan } = req.body;

    if (!['free', 'paid'].includes(plan)) {
        return res.status(400).json({
            status: "FAILED",
            message: "Invalid plan type!"
        });
    }

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                status: "FAILED",
                message: "User not found!"
            });
        }

        user.plan = plan;
        await user.save();

        res.json({
            status: "SUCCESS",
            message: `User plan upgraded to ${plan} successfully!`
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            status: "FAILED",
            message: "An error occurred while upgrading the plan!"
        });
    }
};
