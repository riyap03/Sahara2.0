const Notification = require('../models/Notification');

const getNotifications = async (userId) => {
  return await Notification.find({ recipient: userId })
    .sort({ createdAt: -1 })
    .limit(50);
};

const markAsRead = async (notificationId, userId) => {
  return await Notification.findOneAndUpdate(
    { _id: notificationId, recipient: userId },
    { isRead: true },
    { new: true }
  );
};

const createNotification = async (recipientId, type, title, message, relatedRequest, relatedTask) => {
  return await Notification.create({
    recipient: recipientId,
    type,
    title,
    message,
    relatedRequest,
    relatedTask
  });
};

module.exports = {
  getNotifications,
  markAsRead,
  createNotification
};
