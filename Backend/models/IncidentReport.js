import mongoose from 'mongoose';

const incidentReportSchema = new mongoose.Schema(
  {
    location: {
      type: String,
      required: [true, 'Please specify incident location'],
      trim: true,
    },
    hazardType: {
      type: String,
      required: [true, 'Please select hazard type'],
      enum: ['Poor Lighting', 'Suspicious Activity', 'Unsafe Road', 'Harassment', 'Other'],
      default: 'Poor Lighting',
    },
    description: {
      type: String,
      trim: true,
    },
    image: {
      url: {
        type: String,
        default: '',
      },
      publicId: {
        type: String,
        default: '',
      },
    },
    votes: {
      type: Number,
      default: 0,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    reporterName: {
      type: String,
      default: 'Anonymous Commuter',
    },
    comments: [
      {
        user: {
          type: String,
          default: 'Anonymous Commuter',
        },
        text: {
          type: String,
          required: true,
          trim: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const IncidentReport = mongoose.model('IncidentReport', incidentReportSchema);
export default IncidentReport;

