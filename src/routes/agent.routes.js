const express = require('express');
const router = express.Router();
const agentController = require('../controllers/agentController');
const { createAgentValidation, updateAgentValidation } = require('../validators/agentValidator');
const validate = require('../middleware/validate');
const { verifyToken, isAdmin } = require('../middleware/auth');

// All routes require authentication and admin role
router.use(verifyToken, isAdmin);

/**
 * @route   GET /api/agents
 * @desc    Get all agents
 * @access  Private (Admin)
 */
router.get('/', agentController.getAllAgents);

/**
 * @route   GET /api/agents/:id
 * @desc    Get agent by ID
 * @access  Private (Admin)
 */
router.get('/:id', agentController.getAgentById);

/**
 * @route   GET /api/agents/:id/stats
 * @desc    Get agent with statistics
 * @access  Private (Admin)
 */
router.get('/:id/stats', agentController.getAgentWithStats);

/**
 * @route   POST /api/agents
 * @desc    Create new agent
 * @access  Private (Admin)
 */
router.post('/', createAgentValidation, validate, agentController.createAgent);

/**
 * @route   PUT /api/agents/:id
 * @desc    Update agent
 * @access  Private (Admin)
 */
router.put('/:id', updateAgentValidation, validate, agentController.updateAgent);

/**
 * @route   DELETE /api/agents/:id
 * @desc    Delete agent
 * @access  Private (Admin)
 */
router.delete('/:id', agentController.deleteAgent);

module.exports = router;
