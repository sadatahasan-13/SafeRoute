import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Helper function to generate JWT Token
const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'saferoute_super_secret_jwt_key_2026_dhaka_secure',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// Helper function to set cookie and return user response
const sendTokenResponse = (user, statusCode, res, message = 'Success') => {
  const token = generateToken(user._id);

  const cookieOptions = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  };

  res
    .status(statusCode)
    .cookie('token', token, cookieOptions)
    .json({
      success: true,
      message,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res, next) => {
  try {
    const { name, email, phone, password } = req.body;

    // Validate inputs
    if (!name || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both a name and a password.',
      });
    }

    if (!email && !phone) {
      return res.status(400).json({
        success: false,
        message: 'Please provide either an email address or a phone number.',
      });
    }

    // Check if user already exists by email or phone
    const existingUser = await User.findOne({
      $or: [
        ...(email ? [{ email: email.toLowerCase() }] : []),
        ...(phone ? [{ phone }] : []),
      ],
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with that email or phone number already exists.',
      });
    }

    // Create new user (password is automatically hashed by Mongoose pre-save hook)
    const user = await User.create({
      name,
      email: email ? email.toLowerCase() : undefined,
      phone: phone || undefined,
      password,
    });

    sendTokenResponse(user, 201, res, 'User registered successfully.');
  } catch (error) {
    next(error);
  }
};

// @desc    Login user with email or phone
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res, next) => {
  try {
    const { email, phone, identifier, password } = req.body;

    if (!password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide your password.',
      });
    }

    // Determine lookup parameter: email, phone, or generic identifier
    let query = {};
    if (email) {
      query = { email: email.toLowerCase() };
    } else if (phone) {
      query = { phone };
    } else if (identifier) {
      // Identifier could be email or phone
      if (identifier.includes('@')) {
        query = { email: identifier.toLowerCase() };
      } else {
        query = { phone: identifier };
      }
    } else {
      return res.status(400).json({
        success: false,
        message: 'Please provide an email or phone number to sign in.',
      });
    }

    // Explicitly include password because select: false was configured on schema
    const user = await User.findOne(query).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. User not found.',
      });
    }

    // Check password match using bcrypt
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Incorrect password.',
      });
    }

    sendTokenResponse(user, 200, res, 'Signed in successfully.');
  } catch (error) {
    next(error);
  }
};

// @desc    Log out user and clear cookie
// @route   POST /api/auth/logout
// @access  Public
export const logoutUser = async (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({
    success: true,
    message: 'User logged out successfully.',
  });
};

// @desc    Get currently authenticated user profile
// @route   GET /api/auth/me
// @access  Private (Protected via protect middleware)
export const getMe = async (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
};

