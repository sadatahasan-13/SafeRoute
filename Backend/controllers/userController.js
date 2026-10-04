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

// @desc    Get all emergency contacts (Admin sees all users' contacts; Commuter sees only their own)
// @route   GET /api/users/contacts
// @access  Private
export const getContacts = async (req, res, next) => {
  try {
    const isAdmin = req.user && (req.user.role === 'admin' || req.user.email === 'admin@saferoute.bd');

    let contacts;
    if (isAdmin) {
      // Admin sees ALL contacts registered across all commuters in Dhaka
      contacts = await EmergencyContact.find({})
        .populate('user', 'name email phone')
        .sort({ createdAt: -1 });
    } else {
      // Commuter sees strictly their own emergency contacts
      contacts = await EmergencyContact.find({ user: req.user._id })
        .populate('user', 'name email phone')
        .sort({ createdAt: -1 });
    }

    res.status(200).json({
      success: true,
      count: contacts.length,
      isAdmin: !!isAdmin,
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

// @desc    Delete emergency contact (Admin can delete any; Commuter can delete only their own)
// @route   DELETE /api/users/contacts/:id
// @access  Private
export const deleteContact = async (req, res, next) => {
  try {
    const isAdmin = req.user && (req.user.role === 'admin' || req.user.email === 'admin@saferoute.bd');

    const contact = await EmergencyContact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Emergency contact not found.',
      });
    }

    if (!isAdmin && contact.user && contact.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this contact.',
      });
    }

    await EmergencyContact.findByIdAndDelete(req.params.id);

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
    const isAdmin = req.user && (req.user.role === 'admin' || req.user.email === 'admin@saferoute.bd');

    const contact = await EmergencyContact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Emergency contact not found.',
      });
    }

    if (!isAdmin && contact.user && contact.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this contact.',
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

