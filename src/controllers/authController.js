const Admin = require('../models/Admin');
const Traveler = require('../models/Traveler');
const { generateAdminToken, generateTravelerToken } = require('../services/tokenService');
const { successResponse, errorResponse } = require('../utils/response');

/**
 * Login for both admin and traveler
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Try to find admin first
    let user = await Admin.findByEmail(email);
    let role = 'admin';

    // If not admin, try traveler
    if (!user) {
      user = await Traveler.findByEmail(email);
      role = 'traveler';
    }

    // User not found
    if (!user) {
      return errorResponse(res, 'Invalid email or password', 401);
    }

    // Check if account is active
    if (!user.is_active) {
      return errorResponse(res, 'Account is not active. Please contact administrator.', 403);
    }

    // Verify password
    const isPasswordValid =
      role === 'admin'
        ? await Admin.verifyPassword(password, user.password_hash)
        : await Traveler.verifyPassword(password, user.password_hash);

    if (!isPasswordValid) {
      return errorResponse(res, 'Invalid email or password', 401);
    }

    // Update last login
    if (role === 'admin') {
      await Admin.updateLastLogin(user.admin_id);
    } else {
      await Traveler.updateLastLogin(user.traveler_id);
    }

    // Generate token
    const token = role === 'admin' ? generateAdminToken(user) : generateTravelerToken(user);

    // Remove password from response
    delete user.password_hash;

    return successResponse(
      res,
      {
        token,
        user: {
          ...user,
          role,
        },
      },
      'Login successful'
    );
  } catch (error) {
    console.error('Login error:', error);
    return errorResponse(res, 'Login failed', 500);
  }
};

/**
 * Get current user profile
 */
exports.getMe = async (req, res) => {
  try {
    const { userId, role } = req.user;

    let user;
    if (role === 'admin') {
      user = await Admin.findById(userId);
    } else {
      user = await Traveler.findById(userId);
    }

    if (!user) {
      return errorResponse(res, 'User not found', 404);
    }

    return successResponse(res, {
      ...user,
      role,
    });
  } catch (error) {
    console.error('Get profile error:', error);
    return errorResponse(res, 'Failed to get profile', 500);
  }
};

/**
 * Change password
 */
exports.changePassword = async (req, res) => {
  try {
    const { userId, role } = req.user;
    const { currentPassword, newPassword } = req.body;

    // Get user with password hash
    let user;
    if (role === 'admin') {
      user = await Admin.findByEmail(req.user.email);
    } else {
      user = await Traveler.findByEmail(req.user.email);
    }

    if (!user) {
      return errorResponse(res, 'User not found', 404);
    }

    // Verify current password
    const isPasswordValid =
      role === 'admin'
        ? await Admin.verifyPassword(currentPassword, user.password_hash)
        : await Traveler.verifyPassword(currentPassword, user.password_hash);

    if (!isPasswordValid) {
      return errorResponse(res, 'Current password is incorrect', 400);
    }

    // Update password
    if (role === 'admin') {
      await Admin.updatePassword(userId, newPassword);
    } else {
      await Traveler.updatePassword(userId, newPassword);
    }

    return successResponse(res, null, 'Password changed successfully');
  } catch (error) {
    console.error('Change password error:', error);
    return errorResponse(res, 'Failed to change password', 500);
  }
};

/**
 * Logout (optional - mainly for client-side token removal)
 */
exports.logout = async (req, res) => {
  try {
    return successResponse(res, null, 'Logged out successfully');
  } catch (error) {
    console.error('Logout error:', error);
    return errorResponse(res, 'Logout failed', 500);
  }
};
