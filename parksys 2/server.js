const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the current directory
app.use(express.static(__dirname));

// MongoDB connection setup (Updated: Removed deprecated options)
mongoose.connect('mongodb+srv://lokash:lokash214@cluster0.wib89.mongodb.net/')
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });

// Define a schema for students
const studentSchema = new mongoose.Schema({
    name: String,
    reg_no: Number, // Ensure this matches the type in your MongoDB collection
    dept: String
});

// Create a model for students
const Student = mongoose.model('Student', studentSchema);

// Block details mapping
const blockDetails = {
    '1': { name: 'Block A', description: 'Block A details here' },
    '2': { name: 'Block B', description: 'Block B details here' },
    '3': { name: 'Block C', description: 'Block C details here' },
    '4': { name: 'Block D', description: 'Block D details here' }
};

// Endpoint to check parking access
app.post('/check-access', async (req, res) => {
    const regNumber = parseInt(req.body.regNumber, 10); // Convert to number
    const block = req.body.block;

    try {
        const student = await Student.findOne({ reg_no: regNumber });

        if (student) {
            const blockDepartments = {
                '1': ['BCA', 'MCA', 'BSc', 'MSc'],
                '2': ['BCom', 'BBA', 'MCom', 'MBA'],
                '3': ['BTech', 'MTech', 'BEng', 'MEng'],
                '4': ['ECE', 'Biotech', 'MBBS', 'BARC']
            };

            const accessGranted = blockDepartments[block].includes(student.dept);
            const studentBlock = Object.keys(blockDepartments).find(key => blockDepartments[key].includes(student.dept)) || 'Unknown';

            res.json({
                name: student.name,
                regNumber: regNumber,
                dept: student.dept,
                accessGranted: accessGranted,
                block: studentBlock
            });
        } else {
            res.json({ error: 'No student found with that registration number.' });
        }
    } catch (err) {
        console.error('Database query error:', err);
        res.status(500).json({ error: 'Database query error' });
    }
});

// Start the server on port 3002
app.listen(3002, () => {
    console.log('Server running on port 3002');
});
