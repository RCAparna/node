const express = require('express');
const mongoose = require('mongoose');
const PORT = process.env.PORT || 8080;
//app imports
const authRoutes = require('./routes/authentication-routes');
const dashboardRoutes = require('./routes/dashboard-routes')
const app = express();
const ATLAS_URI = 'mongodb+srv://aparna-node-poc:mongopassword@cluster0.hdtif.mongodb.net/nodeDB'

app.use(express.json());

//app middlewares
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});
app.use('/auth', authRoutes);
app.use('/dashboard', dashboardRoutes);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

mongoose
  .connect(ATLAS_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(result => {
    console.log('CONNECTED')
    app.listen(PORT, () => {
      console.log(`Server is running on port:${PORT}`);
    });
  })
  .catch(err => console.log(err));
