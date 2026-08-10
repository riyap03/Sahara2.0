function sendNotificationToHelper(helperId, task) {
  console.log(`[NOTIFICATION] Helper ${helperId} notified about task ${task._id}`);
  return Promise.resolve();
}

module.exports = {
  sendNotificationToHelper
};
