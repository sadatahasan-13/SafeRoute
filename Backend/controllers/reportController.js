import IncidentReport from '../models/IncidentReport.js';
import cloudinary from '../config/cloudinary.js';
import { deleteFiles } from '../utils/fileUtils.js';

// @desc    Get all incident reports
// @route   GET /api/reports
// @access  Public
export const getReports = async (req, res, next) => {
  try {
    const reports = await IncidentReport.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: reports.length,
      data: reports,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single incident report
// @route   GET /api/reports/:id
// @access  Public
export const getReportById = async (req, res, next) => {
  try {
    const report = await IncidentReport.findById(req.params.id);
    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Incident report not found.',
      });
    }
    res.status(200).json({
      success: true,
      data: report,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new incident report
// @route   POST /api/reports
// @access  Public or Private
export const createReport = async (req, res, next) => {
  let uploadedImage = { url: '', publicId: '' };

  try {
    const { location, hazardType, description } = req.body;

    if (!location || !hazardType) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both location and hazard type.',
      });
    }

    // If an image was attached via Multer, upload to Cloudinary
    if (req.file) {
      try {
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: 'saferoute_incidents',
          resource_type: 'image',
        });
        uploadedImage = {
          url: result.secure_url,
          publicId: result.public_id,
        };
      } catch (uploadError) {
        console.error('Cloudinary upload error:', uploadError);
        return res.status(500).json({
          success: false,
          message: 'Failed to upload incident photo to cloud storage.',
        });
      }
    }

    const newReport = await IncidentReport.create({
      location,
      hazardType,
      description,
      image: uploadedImage,
      reportedBy: req.user ? req.user._id : undefined,
      reporterName: req.body.reporterName || (req.user ? req.user.name : 'Anonymous Commuter'),
    });

    res.status(201).json({
      success: true,
      message: 'Report submitted successfully.',
      data: newReport,
    });
  } catch (error) {
    next(error);
  } finally {
    // Clean up local temp file from uploads/ folder
    if (req.file) {
      deleteFiles(req.file.path);
    }
  }
};

// @desc    Update an incident report or upvote
// @route   PUT /api/reports/:id
// @access  Public or Private
export const updateReport = async (req, res, next) => {
  try {
    let report = await IncidentReport.findById(req.params.id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Incident report not found.',
      });
    }

    // If upvoting
    if (req.body.upvote) {
      report.votes += 1;
      await report.save();
      return res.status(200).json({
        success: true,
        message: 'Report upvoted.',
        data: report,
      });
    }

    // If adding a comment to discussion
    if (req.body.comment) {
      report.comments.push({
        user: req.body.user || (req.user ? req.user.name : 'Anonymous Commuter'),
        text: req.body.comment,
        createdAt: new Date(),
      });
      await report.save();
      return res.status(200).json({
        success: true,
        message: 'Comment added successfully.',
        data: report,
      });
    }

    report = await IncidentReport.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: report,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete an incident report
// @route   DELETE /api/reports/:id
// @access  Private (Admin or Reporter)
export const deleteReport = async (req, res, next) => {
  try {
    const report = await IncidentReport.findById(req.params.id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Incident report not found.',
      });
    }

    // If report has an image on Cloudinary, delete it
    if (report.image && report.image.publicId) {
      try {
        await cloudinary.uploader.destroy(report.image.publicId);
      } catch (cloudErr) {
        console.error('Failed to remove image from Cloudinary:', cloudErr);
      }
    }

    await report.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Incident report deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

