import mongoose from 'mongoose';

const waypointSchema = new mongoose.Schema({
  step: {
    type: Number,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    default: '5 mins',
  },
  active: {
    type: Boolean,
    default: false,
  },
});

const routeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    commuterName: {
      type: String,
      required: true,
      default: 'Dhaka Night Commuter',
    },
    routeName: {
      type: String,
      required: true,
    },
    origin: {
      type: String,
      required: true,
    },
    destination: {
      type: String,
      required: true,
    },
    securityPreference: {
      type: String,
      enum: ['Well-Lit Corridors', 'Police Checkpoint Priority', 'Metro Corridor', 'Quickest Route'],
      default: 'Well-Lit Corridors',
    },
    score: {
      type: String,
      default: '92% Safe',
    },
    safetyScoreNum: {
      type: Number,
      default: 92,
    },
    distance: {
      type: String,
      default: '3.2 km',
    },
    time: {
      type: String,
      default: '20 min',
    },
    status: {
      type: String,
      enum: ['In Transit', 'Caution Zone', 'Active Escort', 'Completed', 'Unlit Alley Alert'],
      default: 'In Transit',
    },
    color: {
      type: String,
      default: '#00b4d8',
    },
    policeGuard: {
      type: String,
      default: 'Shahbagh Police Box',
    },
    guardPhone: {
      type: String,
      default: '999',
    },
    waypoints: [waypointSchema],
    hazardsAlongRoute: [
      {
        hazardType: String,
        location: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Route', routeSchema);

