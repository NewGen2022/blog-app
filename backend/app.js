require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const authRouter = require('./routes/auth.js');
const postsAdminRouter = require('./routes/postsAdmin.js');

const PORT = process.env.PORT || 3000;

const corsOptions = {
    origin: 'http://localhost:8877',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
};

app.use(cors(corsOptions));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// ROUTES
app.use('/api/auth', authRouter);
app.use('/api/posts', postsAdminRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
