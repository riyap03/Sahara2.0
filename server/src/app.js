const express = require('express');
const cors = require('cors');

const app = express();

app.use(
  cors({
    origin: '*'
  })
);

app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Ghar Ka Backup API is running'
  });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Ghar Ka Backup API is healthy',
    database: 'connected'
  });
});

app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/users', require('./routes/user.routes'));
app.use('/api/trusted-circle', require('./routes/trustedCircle.routes'));
app.use('/api/providers', require('./routes/provider.routes'));
app.use('/api/requests', require('./routes/request.routes'));
app.use('/api/tasks', require('./routes/task.routes'));
app.use('/api/emergency', require('./routes/emergency.routes'));
app.use('/api/family', require('./routes/family.routes'));
app.use('/api/notifications', require('./routes/notification.routes'));

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found'
  });
});

module.exports = app;
