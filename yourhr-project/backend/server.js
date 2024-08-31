const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const User = require('./models/User');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware to handle form data and file uploads
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Multer setup for file storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/yourhr', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

// Signup route
app.post('/signup', upload.single('resume'), async (req, res) => {
    try {
        const { name, email, phone } = req.body;
        const resume = req.file.path;

        const newUser = new User({ name, email, phone, resume });
        await newUser.save();

        res.redirect('/thankyou.html');
    } catch (err) {
        console.log(err);
        res.status(500).send('Server Error');
    }
});

// Serve frontend files
app.use(express.static(path.join(__dirname, '../frontend')));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
