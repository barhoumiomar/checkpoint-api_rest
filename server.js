require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const app = express();
// MongoDB connection
mongoose.connect('mongodb://localhost:27017/newDbUsers', {
})
.then(() => {
    console.log(`Connected to MongoDB succesfully ...`);
}).catch(err => {
    console.error(`Error connecting to MongoDB: ${err} `);
});
console.log("your server link is : mongodb://localhost:27017/newDbUsers");
// Define port from environment variables or default to 3000
const port = process.env.port || 3000;
// Start the server
app.listen(port, () => {
    console.log(`this Server is running on port ${port}...`);
});
app.use(express.json());
// Import the User model
const User = require('./models/User');
// GET
app.get('/users', async (req , res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving users', error: err });
    }
});
// POST
app.post('/users', async (req, res) => {
    const { name, email, age } = req.body;

    const newUser = new User({ name, email, age });

    try {
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (err) {
        res.status(400).json({ message: 'Error adding user', error: err });
    }
});


// PUT
app.put('/users/:id', async (req, res) => {
    const { id } = req.params;
    const { name, email, age } = req.body;

    try {
        const updatedUser = await User.findByIdAndUpdate(id, { name, email, age }, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(updatedUser);
    } catch (err) {
        res.status(400).json({ message: 'Error updating user', error: err });
    }
});

// DELETE
app.delete('/users/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const deletedUser = await User.findByIdAndDelete(id);
        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted', user: deletedUser });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting user', error: err });
    }
});
