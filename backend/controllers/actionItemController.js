const axios = require('axios');
const ActionItem = require('../models/actionItem');
require('../models/User');

const getActionItems = async (req, res) => {
    try {
        const actionItems = await ActionItem.find()
            .populate('projectId')
            .populate('assignedTo');

        const analyzedActionItems = await Promise.all(
            actionItems.map(async (actionItem) => {
                const today = new Date();

                const dueDate = new Date(actionItem.dueDate);

                const difference = dueDate - today;

                const daysRemaining = Math.ceil(
                    difference / (1000 * 60 * 60 * 24)
                );

                console.log("ACTION ITEM DATA:", {
                    id: actionItem._id,
                    dueDate: actionItem.dueDate,
                    status: actionItem.status,
                    daysRemaining
                });

                const mlResponse = await axios.post(
                    'http://localhost:8000/analyze',
                    {
                        actionItemId: actionItem._id,
                        daysRemaining,
                        status: actionItem.status
                    }
                );

                return {
                    ...actionItem.toObject(),
                    attentionScore: mlResponse.data.attentionScore,
                    attentionLevel: mlResponse.data.attentionLevel
                };
            })
        );

        res.status(200).json({
            actionItems: analyzedActionItems
        });

    } catch (error) {
    console.log("ML ERROR:", error.response?.data || error.message);

    res.status(500).json({
        message: error.message,
        mlError: error.response?.data || null
        });
    }
};


const getActionItemById = async (req, res) => {
    try {
        const actionItem = await ActionItem.findById(req.params.id)
            .populate('projectId')
            .populate('assignedTo');

        if (!actionItem) {
            return res.status(404).json({
                message: 'Action item not found'
            });
        }

        const today = new Date();

        const dueDate = new Date(actionItem.dueDate);

        const difference = dueDate - today;

        const daysRemaining = Math.ceil(
            difference / (1000 * 60 * 60 * 24)
        );

        const mlResponse = await axios.post(
            'http://localhost:8000/analyze',
            {
                actionItemId: actionItem._id,
                daysRemaining,
                status: actionItem.status
            }
        );

        res.status(200).json({
            actionItem,
            analysis: {
                attentionScore: mlResponse.data.attentionScore,
                attentionLevel: mlResponse.data.attentionLevel
            }
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


const updateActionItem = async (req, res) => {
    try {
        const actionItem = await ActionItem.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!actionItem) {
            return res.status(404).json({
                message: 'Action item not found'
            });
        }

        res.status(200).json({
            message: 'Action item updated successfully',
            actionItem
        });

    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
};


module.exports = {
    getActionItems,
    getActionItemById,
    updateActionItem
};