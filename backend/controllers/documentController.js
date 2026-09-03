const fs = require('fs');
const path = require('path');
const Document = require('../models/Document');

// Upload document
const uploadDocument = async (req, res) => {
    try {
        const { uploadedBy, documentType } = req.body;
        const actionItemId = req.params.actionItemId;

        if (!req.file) {
            return res.status(400).json({
                message: 'Please upload a document'
            });
        }

        const uploadDir = path.join(__dirname, '../uploads');

        // Create uploads folder if it doesn't exist
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        const fileName = `${Date.now()}-${req.file.originalname}`;
        const filePath = path.join(uploadDir, fileName);

        // Save the file
        fs.writeFileSync(filePath, req.file.buffer);

        // Save document details in MongoDB
        const document = await Document.create({
            actionItemId,
            uploadedBy,
            documentType,
            fileUrl: `/uploads/${fileName}`
        });

        res.status(201).json({
            message: 'Document uploaded successfully',
            document
        });

    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
};


// Get documents for an action item
const getDocuments = async (req, res) => {
    try {
        const documents = await Document.find({
            actionItemId: req.params.actionItemId
        });

        res.status(200).json({
            documents
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


module.exports = {
    uploadDocument,
    getDocuments
};