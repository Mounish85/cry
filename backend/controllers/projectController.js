const Project = require('../models/Project');

// Create a project
const createProject = async (req, res) => {
    try {
        const { name, ngoId, frontlinerId, cycle, startDate, endDate } = req.body;

        const project = await Project.create({
            name,
            ngoId,
            frontlinerId,
            cycle,
            startDate,
            endDate
        });

        res.status(201).json({
            message: 'Project created successfully',
            project
        });

    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
};


// Get all projects
const getProjects = async (req, res) => {
    try {
        const projects = await Project.find()
            .populate('ngoId')
            .populate('frontlinerId');

        res.status(200).json({
            projects
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


// Get a single project
const getProjectById = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id)
            .populate('ngoId')
            .populate('frontlinerId');

        if (!project) {
            return res.status(404).json({
                message: 'Project not found'
            });
        }

        res.status(200).json({
            project
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


module.exports = {
    createProject,
    getProjects,
    getProjectById
};