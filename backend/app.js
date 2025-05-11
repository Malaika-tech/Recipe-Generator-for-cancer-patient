const userRoutes = require('./routes/userRoutes');
const nutritionistRoutes = require('./routes/nutritionistRoutes');
const authRoutes = require('./routes/auth');

// Routes
app.use('/api/users', userRoutes);
app.use('/api/nutritionists', nutritionistRoutes);
app.use('/api/auth', authRoutes); 