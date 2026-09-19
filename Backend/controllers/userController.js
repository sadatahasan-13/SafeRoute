import User from '../models/User.js';
import EmergencyContact from '../models/EmergencyContact.js';

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = async (req, res, next) => {
  try {
    const { name, phone } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (name) user.name = name;
    if (phone) user.phone = phone;

    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        role: updatedUser.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all emergency contacts for logged-in user
// @route   GET /api/users/contacts
// @access  Private
export const getContacts = async (req, res, next) => {
  try {
    const contacts = await EmergencyContact.find({ user: req.user._id });
    res.status(200).json({
      success: true,
      count: contacts.length,
      data: contacts,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add emergency contact
// @route   POST /api/users/contacts
// @access  Private
export const addContact = async (req, res, next) => {
  try {
    const { name, phone, relation } = req.body;

    if (!name || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both contact name and phone number.',
      });
    }

    const contact = await EmergencyContact.create({
      user: req.user._id,
      name,
      phone,
      relation: relation || 'Family/Guardian',
    });

    res.status(201).json({
      success: true,
      message: 'Emergency contact added successfully.',
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete emergency contact
// @route   DELETE /api/users/contacts/:id
// @access  Private
export const deleteContact = async (req, res, next) => {
  try {
    const contact = await EmergencyContact.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Emergency contact not found.',
      });
    }

    await contact.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Emergency contact removed.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update emergency contact
// @route   PUT /api/users/contacts/:id
// @access  Private
export const updateContact = async (req, res, next) => {
  try {
    const { name, phone, relation, isActive } = req.body;

    const contact = await EmergencyContact.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Emergency contact not found.',
      });
    }

    if (name) contact.name = name;
    if (phone) contact.phone = phone;
    if (relation) contact.relation = relation;
    if (typeof isActive === 'boolean') contact.isActive = isActive;

    await contact.save();

    res.status(200).json({
      success: true,
      message: 'Emergency contact updated successfully.',
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};


