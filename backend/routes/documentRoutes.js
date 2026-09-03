const express = require('express');

const {
    uploadDocument,
    getDocuments
} = require('../controllers/documentController');

const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

router.post(
    '/:actionItemId',
    upload.single('document'),
    uploadDocument
);

router.get(
    '/:actionItemId',
    getDocuments
);

module.exports = router;