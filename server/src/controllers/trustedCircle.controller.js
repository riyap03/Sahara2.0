const TrustedContact = require('../models/TrustedContact');
const User = require('../models/User');

const addContact = async (req, res) => {
  try {
    const { contact, relation, priority } = req.body;

    const existing = await TrustedContact.findOne({
      senior: req.user._id,
      contact
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'Contact already exists'
      });
    }

    const trustedContact = await TrustedContact.create({
      senior: req.user._id,
      contact,
      relation,
      priority
    });

    const populated = await TrustedContact.findById(trustedContact._id)
      .populate('contact', 'name phone role city');

    res.status(201).json({
      success: true,
      message: 'Trusted contact added',
      contact: populated
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getContacts = async (req, res) => {
  try {
    const contacts = await TrustedContact.find({
      senior: req.user._id
    }).populate('contact', 'name phone role city location');

    res.json({
      success: true,
      contacts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const updateContact = async (req, res) => {
  try {
    const { relation, priority, emergencyAvailable } = req.body;

    const contact = await TrustedContact.findOneAndUpdate(
      { _id: req.params.id, senior: req.user._id },
      { relation, priority, emergencyAvailable },
      { new: true }
    ).populate('contact', 'name phone role city');

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    res.json({
      success: true,
      message: 'Contact updated',
      contact
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const deleteContact = async (req, res) => {
  try {
    const contact = await TrustedContact.findOneAndDelete({
      _id: req.params.id,
      senior: req.user._id
    });

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    res.json({
      success: true,
      message: 'Contact removed'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  addContact,
  getContacts,
  updateContact,
  deleteContact
};
