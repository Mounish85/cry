const Notification = require('../models/Notification');

// Get notifications
const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({
            userId: req.userId
        })
        .populate('actionItemId')
        .sort({ createdAt: -1 });

        res.status(200).json({
            notifications
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


// Mark notification as read
const markNotificationAsRead = async (req, res) => {
    try {
        const notification = await Notification.findOneAndUpdate(
            {
                _id: req.params.id,
                userId: req.userId
            },
            {
                read: true
            },
            {
                new: true
            }
        );

        if (!notification) {
            return res.status(404).json({
                message: 'Notification not found'
            });
        }

        res.status(200).json({
            message: 'Notification marked as read',
            notification
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


module.exports = {
    getNotifications,
    markNotificationAsRead
};