const User = require('../models/User');
const TrustedContact = require('../models/TrustedContact');
const generateToken = require('../utils/generateToken');

const generateFamilyCode = async (req, res) => {
  try {
    const senior = await User.findById(req.user._id);
    
    if (!senior || senior.role !== 'senior') {
      return res.status(403).json({
        success: false,
        message: 'Only seniors can generate family codes'
      });
    }

    if (!senior.familyCode) {
      const code = 'GK-' + Math.floor(1000 + Math.random() * 9000);
      senior.familyCode = code;
      await senior.save();
    }

    res.json({
      success: true,
      familyCode: senior.familyCode
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const connectViaCode = async (req, res) => {
  try {
    const { familyCode, relationship } = req.body;
    
    if (!familyCode || !relationship) {
      return res.status(400).json({
        success: false,
        message: 'Family code and relationship are required'
      });
    }

    const senior = await User.findOne({ familyCode, role: 'senior' });
    
    if (!senior) {
      return res.status(404).json({
        success: false,
        message: 'Invalid family code'
      });
    }

    const existingConnection = await TrustedContact.findOne({
      senior: senior._id,
      contact: req.user._id
    });

    if (existingConnection) {
      return res.status(200).json({
        success: true,
        message: 'Already connected to this senior',
        senior: {
          id: senior._id,
          name: senior.name,
          city: senior.address?.city
        }
      });
    }

    const connection = await TrustedContact.create({
      senior: senior._id,
      contact: req.user._id,
      relation: 'family',
      priority: 1,
      isApproved: true,
      emergencyAvailable: true
    });

    const populatedSenior = await User.findById(senior._id).select('name phone address city');

    res.status(201).json({
      success: true,
      message: 'Connected to senior successfully',
      senior: populatedSenior,
      relationship
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getMySeniors = async (req, res) => {
  try {
    const connections = await TrustedContact.find({
      contact: req.user._id,
      relation: 'family'
    }).populate('senior', 'name phone address city location isAvailable');

    const seniors = connections.map(conn => ({
      id: conn.senior._id,
      name: conn.senior.name,
      phone: conn.senior.phone,
      city: conn.senior.address?.city,
      relation: conn.relation,
      isApproved: conn.isApproved
    }));

    res.json({
      success: true,
      seniors
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const inviteFamilyMember = async (req, res) => {
  try {
    const { name, phone, relationship } = req.body;
    
    if (!name || !phone || !relationship) {
      return res.status(400).json({
        success: false,
        message: 'Name, phone and relationship are required'
      });
    }

    const existingUser = await User.findOne({ phone });
    
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: 'This person is not registered yet. Ask them to create an account first.'
      });
    }

    const existingConnection = await TrustedContact.findOne({
      senior: req.user._id,
      contact: existingUser._id
    });

    if (existingConnection) {
      return res.status(200).json({
        success: true,
        message: 'Already connected to this person'
      });
    }

    const connection = await TrustedContact.create({
      senior: req.user._id,
      contact: existingUser._id,
      relation: 'family',
      priority: 1,
      isApproved: true,
      emergencyAvailable: true
    });

    res.status(201).json({
      success: true,
      message: 'Family member invited and connected',
      connection
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  generateFamilyCode,
  connectViaCode,
  getMySeniors,
  inviteFamilyMember
};
