const express = require('express');

const {
    getActionItems,
    getActionItemById,
    updateActionItem
} = require('../controllers/actionItemController');

const router = express.Router();

router.get('/', getActionItems);
router.get('/:id', getActionItemById);
router.patch('/:id', updateActionItem);

module.exports = router;