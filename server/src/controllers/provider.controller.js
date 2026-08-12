const ServiceProvider = require('../models/ServiceProvider');
const User = require('../models/User');

const createProvider = async (req, res) => {
  try {
    const {
      serviceType,
      experience,
      location,
      emergencyAvailable,
      serviceArea
    } = req.body;

    const existing = await ServiceProvider.findOne({ user: req.user._id });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'Provider profile already exists'
      });
    }

    const provider = await ServiceProvider.create({
      user: req.user._id,
      serviceType,
      experience,
      location,
      emergencyAvailable,
      serviceArea
    });

    await User.findByIdAndUpdate(
      req.user._id,
      { role: 'provider' }
    );

    const populated = await ServiceProvider.findById(provider._id)
      .populate('user', 'name phone email');

    res.status(201).json({
      success: true,
      message: 'Service provider profile created',
      provider: populated
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getProviders = async (req, res) => {
  try {
    const { serviceType, city, verified } = req.query;

    const filter = {};

    if (serviceType) {
      filter.serviceType = serviceType;
    }

    if (city) {
      filter['user.city'] = city;
    }

    if (verified === 'true') {
      filter.isVerified = true;
    }

    const providers = await ServiceProvider.find(filter)
      .populate('user', 'name phone city address location isVerified');

    res.json({
      success: true,
      providers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getProvider = async (req, res) => {
  try {
    const provider = await ServiceProvider.findById(req.params.id)
      .populate('user', 'name phone email address');

    if (!provider) {
      return res.status(404).json({
        success: false,
        message: 'Provider not found'
      });
    }

    res.json({
      success: true,
      provider
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const updateProvider = async (req, res) => {
  try {
    const provider = await ServiceProvider.findOneAndUpdate(
      { user: req.user._id },
      req.body,
      { new: true }
    ).populate('user', 'name phone email');

    res.json({
      success: true,
      message: 'Provider profile updated',
      provider
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const updateAvailability = async (req, res) => {
  try {
    const provider = await ServiceProvider.findOneAndUpdate(
      { user: req.user._id },
      { isAvailable: req.body.isAvailable },
      { new: true }
    );

    res.json({
      success: true,
      provider
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  createProvider,
  getProviders,
  getProvider,
  updateProvider,
  updateAvailability
};
