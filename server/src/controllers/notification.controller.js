const { getNotifications, markAsRead } = require('../services/notification.service');

const getMyNotifications = async (req, res) => {
  try {
    const notifications = await getNotifications(req.user._id);

    res.json({
      success: true,
      notifications
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const readNotification = async (req, res) => {
  try {
    const notification = await markAsRead(req.params.id, req.user._id);

    res.json({
      success: true,
      notification
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getMyNotifications,
  readNotification
};
