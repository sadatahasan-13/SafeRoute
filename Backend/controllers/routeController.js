import Route from '../models/Route.js';
import IncidentReport from '../models/IncidentReport.js';
import User from '../models/User.js';

// Default initial Dhaka commuters data to seed if DB is empty
const defaultCommuters = [
  {
    commuterName: 'Tanvir Ahmed',
    routeName: 'Gulshan 2 to Dhanmondi 32 Escort',
    origin: 'Gulshan 2 Circle',
    destination: 'Dhanmondi 32 Bridge',
    securityPreference: 'Well-Lit Corridors',
    score: '92% Safe',
    safetyScoreNum: 92,
    distance: '2.5 km',
    time: '20 min',
    status: 'Active Escort',
    color: '#00b4d8',
    policeGuard: 'Dhanmondi 32 Police Box',
    guardPhone: '999',
    waypoints: [
      { step: 1, title: 'Gulshan 2 Circle', address: 'Road 103, Block CEN - Security Checkpoint', time: '9:42 am (1m)', active: true },
      { step: 2, title: 'Dhanmondi 32 Bridge', address: 'Mirpur Road - Metro Rail Gate 2 Plaza', time: 'est 10:03am', active: false },
      { step: 3, title: 'Uttara Sector 7 Hub', address: 'Rabindra Sarani - West Gate Terminal', time: 'est 10:28am', active: false },
      { step: 4, title: 'Shahbagh Crossing', address: 'Kazi Nazrul Islam Ave - Police Box Gate 3', time: 'est 10:57am', active: false },
      { step: 5, title: 'Mirpur 10 Circle', address: 'Begum Rokeya Sarani - Night Patrol Hub', time: 'est 11:23am', active: false },
    ],
  },
  {
    commuterName: 'Anika Rahman',
    routeName: 'Kemal Ataturk to Banani 11 Corridor',
    origin: 'Kemal Ataturk Ave',
    destination: 'Banani 11 Night Hub',
    securityPreference: 'Metro Corridor',
    score: '98% Safe',
    safetyScoreNum: 98,
    distance: '1.2 km',
    time: '15 min',
    status: 'In Transit',
    color: '#10b981',
    policeGuard: 'Banani Security Post',
    guardPhone: '01713-373333',
    waypoints: [
      { step: 1, title: 'Kemal Ataturk Ave', address: 'Banani Police Box Crossing', time: '10:00 pm (3m)', active: true },
      { step: 2, title: 'Banani Road 11', address: 'Block D - 24/7 Illumination Zone', time: 'est 10:12 pm', active: false },
      { step: 3, title: 'Banani Overpass', address: 'Metro Access Corridor', time: 'est 10:15 pm', active: false },
    ],
  },
  {
    commuterName: 'Samiul Karim',
    routeName: 'Dhanmondi 27 to Farmgate Express',
    origin: 'Dhanmondi 27',
    destination: 'Farmgate Overbridge',
    securityPreference: 'Well-Lit Corridors',
    score: '82% Safe',
    safetyScoreNum: 82,
    distance: '3.4 km',
    time: '28 min',
    status: 'Caution Zone',
    color: '#f59e0b',
    policeGuard: 'Farmgate Police Box',
    guardPhone: '999',
    waypoints: [
      { step: 1, title: 'Dhanmondi 27', address: 'Near Rapa Plaza Checkpost', time: '10:15 pm (2m)', active: true },
      { step: 2, title: 'Manik Mia Ave', address: 'National Parliament South Gate', time: 'est 10:28 pm', active: false },
      { step: 3, title: 'Farmgate Overbridge', address: 'Police Control Room Box', time: 'est 10:43 pm', active: false },
    ],
  },
  {
    commuterName: 'Nusrat Jahan',
    routeName: 'Shahbagh to TSC Campus Corridor',
    origin: 'Shahbagh Crossing',
    destination: 'TSC Dhaka University Hub',
    securityPreference: 'Police Checkpoint Priority',
    score: '95% Safe',
    safetyScoreNum: 95,
    distance: '0.8 km',
    time: '10 min',
    status: 'In Transit',
    color: '#3b82f6',
    policeGuard: 'Shahbagh Police Box',
    guardPhone: '01713-373123',
    waypoints: [
      { step: 1, title: 'Shahbagh Crossing', address: 'BSMMU Gate 1 Police Booth', time: '10:20 pm (1m)', active: true },
      { step: 2, title: 'National Museum Gate', address: 'Illuminated Pedestrian Lane', time: 'est 10:25 pm', active: false },
      { step: 3, title: 'TSC Hub', address: 'University of Dhaka Plaza', time: 'est 10:30 pm', active: false },
    ],
  },
  {
    commuterName: 'Arafat Hossain',
    routeName: 'Mirpur 10 to Kallayanpur Night Commute',
    origin: 'Mirpur 10 Circle',
    destination: 'Kallayanpur Bus Stand',
    securityPreference: 'Quickest Route',
    score: '70% Safe',
    safetyScoreNum: 70,
    distance: '5.1 km',
    time: '42 min',
    status: 'Unlit Alley Alert',
    color: '#f43f5e',
    policeGuard: 'Mirpur Night Patrol Unit',
    guardPhone: '999',
    waypoints: [
      { step: 1, title: 'Mirpur 10 Circle', address: 'Metro Station Gate 3', time: '10:05 pm (5m)', active: true },
      { step: 2, title: 'Mirpur 1 Roundabout', address: 'Water Tank Police Checkpoint', time: 'est 10:22 pm', active: false },
      { step: 3, title: 'Kallayanpur Bus Stand', address: 'Dhaka-Aricha Highway Crossing', time: 'est 10:47 pm', active: false },
    ],
  },
];

// Helper to seed default routes if none exist
const ensureSeededRoutes = async () => {
  const count = await Route.countDocuments();
  if (count === 0) {
    await Route.insertMany(defaultCommuters);
  }

  // Ensure demo commuter account (Sadat Ahasan) has a personal route seeded
  try {
    const sadatUser = await User.findOne({ email: 'sadat@saferoute.bd' });
    const sadatRouteExists = await Route.findOne({ commuterName: 'Sadat Ahasan' });

    if (!sadatRouteExists) {
      await Route.create({
        user: sadatUser ? sadatUser._id : null,
        commuterName: 'Sadat Ahasan',
        routeName: 'TSC Hub to Mirpur 10 Night Corridor',
        origin: 'TSC Hub, Dhaka University',
        destination: 'Mirpur 10 Circle',
        securityPreference: 'Police Checkpoint Priority',
        score: '96% Safe',
        safetyScoreNum: 96,
        distance: '4.8 km',
        time: '22 min',
        status: 'In Transit',
        color: '#00b4d8',
        policeGuard: 'Shahbagh & Mirpur Mobile Escort',
        guardPhone: '999',
        waypoints: [
          { step: 1, title: 'TSC Hub', address: 'University of Dhaka Plaza', time: '10:00 pm (3m)', active: true },
          { step: 2, title: 'Shahbagh Crossing', address: 'Kazi Nazrul Islam Ave - Police Box Gate 3', time: 'est 10:08 pm', active: false },
          { step: 3, title: 'Farmgate Footover Bridge', address: 'Police Box Entrance & CCTV Surveillance', time: 'est 10:15 pm', active: false },
          { step: 4, title: 'Mirpur 10 Circle', address: 'Begum Rokeya Sarani - Night Patrol Hub', time: 'est 10:22 pm', active: false },
        ],
      });
    } else if (sadatUser && (!sadatRouteExists.user || sadatRouteExists.user.toString() !== sadatUser._id.toString())) {
      sadatRouteExists.user = sadatUser._id;
      await sadatRouteExists.save();
    }
  } catch (err) {
    // Non-blocking fallback
  }
};

// @desc    Get all routes / active commuters
// @route   GET /api/routes
// @access  Public
export const getRoutes = async (req, res, next) => {
  try {
    await ensureSeededRoutes();
    const routes = await Route.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: routes.length,
      data: routes,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get route analytics (completed count, density per day)
// @route   GET /api/routes/analytics
// @access  Public
export const getRouteAnalytics = async (req, res, next) => {
  try {
    await ensureSeededRoutes();
    const totalRoutes = await Route.countDocuments();
    const activeRoutes = await Route.countDocuments({ status: { $in: ['In Transit', 'Active Escort', 'Caution Zone'] } });
    const completedRoutes = await Route.countDocuments({ status: 'Completed' });
    
    // Baseline completed routes count for Dhaka safety project demonstration
    const baselineCompleted = 18;
    const finalCompleted = baselineCompleted + completedRoutes;

    // Density calculation across days of week
    // Distribution for Dhaka commuters (heaviest on Thursday & Friday evenings)
    const baseDensity = [35, 75, 45, 60, 50, 95, 40];
    const densityData = [
      { day: 'SUN', height: baseDensity[0] },
      { day: 'MON', height: baseDensity[1] },
      { day: 'TUE', height: baseDensity[2] },
      { day: 'WED', height: baseDensity[3] },
      { day: 'THU', height: baseDensity[4] },
      { day: 'FRI', height: baseDensity[5] },
      { day: 'SAT', height: baseDensity[6] },
    ];

    res.status(200).json({
      success: true,
      data: {
        completedRoutesCount: finalCompleted,
        totalRoutes,
        activeRoutes,
        commuterDensity: densityData,
        averageSafetyScore: '91%',
        zone: 'Dhaka Metropolitan Night Patrol Grid',
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get consolidated Dashboard data (commuters, waypoints, recent hazards)
// @route   GET /api/routes/dashboard
// @access  Public
export const getDashboardData = async (req, res, next) => {
  try {
    await ensureSeededRoutes();
    const routes = await Route.find().sort({ updatedAt: -1 });
    
    // Fetch live hazard reports from IncidentReport collection to display on dashboard
    const liveHazards = await IncidentReport.find().sort({ createdAt: -1 }).limit(5);

    res.status(200).json({
      success: true,
      commuters: routes.map((r, idx) => ({
        id: r._id,
        name: r.commuterName,
        userId: r.user,
        score: r.score,
        distance: r.distance,
        time: r.time,
        status: r.status,
        color: r.color,
        origin: r.origin,
        destination: r.destination,
        policeGuard: r.policeGuard,
        waypoints: r.waypoints,
      })),
      recentHazards: liveHazards,
      summary: {
        totalActive: routes.length,
        safeCoverage: '94.2%',
        activeGuards: 12,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create / Plan a new safe route
// @route   POST /api/routes
// @access  Public or Private (token optional)
export const createRoute = async (req, res, next) => {
  try {
    const { origin, destination, securityPreference, customStop, commuterName } = req.body;

    if (!origin || !destination) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both origin and destination points in Dhaka.',
      });
    }

    // Determine smart safety score & distance estimation based on route preferences
    let safetyScore = 93;
    let distance = '3.5 km';
    let time = '22 min';
    let color = '#00b4d8';
    let policeGuard = 'Shahbagh Police Box';
    let guardPhone = '999';

    if (securityPreference === 'Police Checkpoint Priority') {
      safetyScore = 97;
      distance = '3.8 km';
      time = '25 min';
      color = '#10b981';
      policeGuard = 'Metro Rail Police Post';
    } else if (securityPreference === 'Metro Corridor') {
      safetyScore = 95;
      distance = '4.1 km';
      time = '20 min';
      color = '#3b82f6';
      policeGuard = 'MRT Line 6 Patrol Unit';
    } else if (securityPreference === 'Quickest Route') {
      safetyScore = 84;
      distance = '2.9 km';
      time = '16 min';
      color = '#f59e0b';
      policeGuard = 'Dhaka Mobile Patrol';
    }

    // Check if there are active incidents in this area in MongoDB
    const nearbyIncidents = await IncidentReport.find({
      $or: [
        { location: { $regex: origin, $options: 'i' } },
        { location: { $regex: destination, $options: 'i' } },
      ],
    });

    if (nearbyIncidents.length > 0) {
      safetyScore = Math.max(70, safetyScore - (nearbyIncidents.length * 5));
    }

    // Generate smart Dhaka checkpoints / waypoints
    const waypoints = [
      {
        step: 1,
        title: origin,
        address: `${origin} - Starting Safe Checkpoint`,
        time: 'Just started (1m)',
        active: true,
      },
    ];

    if (customStop) {
      waypoints.push({
        step: 2,
        title: customStop,
        address: `${customStop} - Mid-route Secure Stopover`,
        time: 'est 10 mins',
        active: false,
      });
    }

    waypoints.push({
      step: customStop ? 3 : 2,
      title: 'Police Box Checkpoint',
      address: `${policeGuard} - Constant Surveillance Corridor`,
      time: 'est 15 mins',
      active: false,
    });

    waypoints.push({
      step: customStop ? 4 : 3,
      title: destination,
      address: `${destination} - Safe Arrival Zone`,
      time: `est ${time}`,
      active: false,
    });

    const routeName = `${origin} to ${destination}`;
    const name = commuterName || (req.user ? req.user.name : 'Commuter ' + Math.floor(100 + Math.random() * 900));

    const newRoute = await Route.create({
      user: req.user ? req.user._id : (req.body.userId || null),
      commuterName: name,
      routeName,
      origin,
      destination,
      securityPreference: securityPreference || 'Well-Lit Corridors',
      score: `${safetyScore}% Safe`,
      safetyScoreNum: safetyScore,
      distance,
      time,
      status: 'In Transit',
      color,
      policeGuard,
      guardPhone,
      waypoints,
      hazardsAlongRoute: nearbyIncidents.map(h => ({ hazardType: h.hazardType, location: h.location })),
    });

    res.status(201).json({
      success: true,
      message: 'Safe route planned and dispatched successfully.',
      data: newRoute,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single route by ID
// @route   GET /api/routes/:id
// @access  Public
export const getRouteById = async (req, res, next) => {
  try {
    const route = await Route.findById(req.params.id);
    if (!route) {
      return res.status(404).json({ success: false, message: 'Route not found' });
    }
    res.status(200).json({ success: true, data: route });
  } catch (error) {
    next(error);
  }
};

// @desc    Update route status (e.g. In Transit -> Completed)
// @route   PUT /api/routes/:id
// @access  Public
export const updateRouteStatus = async (req, res, next) => {
  try {
    const route = await Route.findById(req.params.id);
    if (!route) {
      return res.status(404).json({ success: false, message: 'Route not found' });
    }

    if (req.body.status) {
      route.status = req.body.status;
      if (req.body.status === 'Completed') {
        route.color = '#10b981';
      }
    }

    await route.save();
    res.status(200).json({ success: true, message: 'Route status updated.', data: route });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete route
// @route   DELETE /api/routes/:id
// @access  Public
export const deleteRoute = async (req, res, next) => {
  try {
    const route = await Route.findById(req.params.id);
    if (!route) {
      return res.status(404).json({ success: false, message: 'Route not found' });
    }
    await route.deleteOne();
    res.status(200).json({ success: true, message: 'Route removed successfully.' });
  } catch (error) {
    next(error);
  }
};

