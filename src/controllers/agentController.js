const Agent = require('../models/Agent');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/response');
const { buildPagination } = require('../utils/helpers');

/**
 * Get all agents
 */
exports.getAllAgents = async (req, res) => {
  try {
    const { page = 1, limit = 10, is_active, search } = req.query;
    const offset = (page - 1) * limit;

    const filters = {};
    if (is_active !== undefined) filters.is_active = is_active === 'true';
    if (search) filters.search = search;

    const agents = await Agent.findAll({ ...filters, limit: parseInt(limit), offset });
    const total = await Agent.count(filters);

    const pagination = buildPagination(total, parseInt(page), parseInt(limit));

    return paginatedResponse(res, agents, pagination);
  } catch (error) {
    console.error('Get agents error:', error);
    return errorResponse(res, 'Failed to get agents', 500);
  }
};

/**
 * Get agent by ID
 */
exports.getAgentById = async (req, res) => {
  try {
    const { id } = req.params;

    const agent = await Agent.findById(id);
    if (!agent) {
      return errorResponse(res, 'Agent not found', 404);
    }

    return successResponse(res, agent);
  } catch (error) {
    console.error('Get agent error:', error);
    return errorResponse(res, 'Failed to get agent', 500);
  }
};

/**
 * Get agent with statistics
 */
exports.getAgentWithStats = async (req, res) => {
  try {
    const { id } = req.params;

    const agent = await Agent.findByIdWithStats(id);
    if (!agent) {
      return errorResponse(res, 'Agent not found', 404);
    }

    return successResponse(res, agent);
  } catch (error) {
    console.error('Get agent stats error:', error);
    return errorResponse(res, 'Failed to get agent statistics', 500);
  }
};

/**
 * Create new agent
 */
exports.createAgent = async (req, res) => {
  try {
    const { name, contact, email, commission_rate, notes } = req.body;

    // Check if email already exists
    const existingAgent = await Agent.findByEmail(email);
    if (existingAgent) {
      return errorResponse(res, 'Email already exists', 400);
    }

    const agentId = await Agent.create({ name, contact, email, commission_rate, notes });
    const newAgent = await Agent.findById(agentId);

    return successResponse(res, newAgent, 'Agent created successfully', 201);
  } catch (error) {
    console.error('Create agent error:', error);
    return errorResponse(res, 'Failed to create agent', 500);
  }
};

/**
 * Update agent
 */
exports.updateAgent = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const agent = await Agent.findById(id);
    if (!agent) {
      return errorResponse(res, 'Agent not found', 404);
    }

    // Check email uniqueness if being updated
    if (updates.email && updates.email !== agent.email) {
      const existingAgent = await Agent.findByEmail(updates.email);
      if (existingAgent) {
        return errorResponse(res, 'Email already exists', 400);
      }
    }

    await Agent.update(id, updates);
    const updatedAgent = await Agent.findById(id);

    return successResponse(res, updatedAgent, 'Agent updated successfully');
  } catch (error) {
    console.error('Update agent error:', error);
    return errorResponse(res, 'Failed to update agent', 500);
  }
};

/**
 * Delete agent
 */
exports.deleteAgent = async (req, res) => {
  try {
    const { id } = req.params;

    const agent = await Agent.findById(id);
    if (!agent) {
      return errorResponse(res, 'Agent not found', 404);
    }

    await Agent.delete(id);

    return successResponse(res, null, 'Agent deleted successfully');
  } catch (error) {
    console.error('Delete agent error:', error);
    return errorResponse(res, 'Failed to delete agent', 500);
  }
};
