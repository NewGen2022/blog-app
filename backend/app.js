require('dotenv').config();
const express = require('express');
const app = express();
const authRouter = require('./routes/auth.js');

const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// ROUTES
app.use('/api/auth', authRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
