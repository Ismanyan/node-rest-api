const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');


// Import routes
const authRoute = require('./routes/auth');
const postRoute = require('./routes/post');

// Use dotenv
dotenv.config();

// Connect to DB
mongoose.connect(
    process.env.DB_CONNECT,
    { 
        useNewUrlParser: true,
        useUnifiedTopology: true 
    },
    () => console.log('connected to DB')
);

// Middleware   
app.use(express.json());

// Route Middlewares
app.use('/api/user',authRoute); 
app.use('/api/post', postRoute);
 
app.listen(3000, () => console.log('server listening'));
