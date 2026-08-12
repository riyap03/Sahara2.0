require('dotenv').config();
const connectDB = require('./config/db');

connectDB();
HEAD

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Sahara API is running',
    timestamp: new Date().toISOString()
  });
});

app.use('/api/matching', require('./routes/matching'));
app.use('/api/tasks', require('./routes/tasks'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;

