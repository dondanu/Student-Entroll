const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;
app.use(express.static('public'));

app.use(express.json());
const cors = require('cors');
app.use(cors());



const client = new MongoClient(process.env.MONGODB_URI);
let studentsCollection;

async function connectToDatabase() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    const db = client.db('Mydatabase'); // Replace with your actual database name
    studentsCollection = db.collection('Students'); // Replace with your collection name
  } catch (err) {const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config();
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json()); // Middleware to parse JSON requests
app.use(cors()); // Enable CORS

// MongoDB Connection
const client = new MongoClient(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
let studentsCollection;

async function connectToDatabase() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    const db = client.db('Mydatabase'); // Replace with your actual database name
    studentsCollection = db.collection('Students'); // Replace with your collection name
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
  }
}

// Call the connect function on startup
connectToDatabase();

// Route to get all students
app.post('/students', async (req, res) => {
  console.log('Received data:', req.body); // Debugging
  try {
    const student = await studentsCollection.insertOne(req.body);
    res.status(201).json(student);
  } catch (error) {
    console.error('Error inserting student:', error);
    res.status(500).send('Error saving student');
  }
});

// Route to add a new student
app.post('/students', async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).send('Student name is required');
  }

  try {
    const result = await studentsCollection.insertOne({ name });
    res.status(201).json(result.ops[0]); // Send the inserted student back
  } catch (err) {
    console.error('Error adding student:', err);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

    console.error('Error connecting to MongoDB:', err);
  }
}

connectToDatabase();

app.get('/', (req, res) => {
  res.send('Welcome to the Student API');
});

app.post('/students', async (req, res) => {
  try {
    const student = req.body;
    const result = await studentsCollection.insertOne(student);
    res.status(201).send(result);
  } catch (err) {
    res.status(500).send({ message: 'Error creating student', error: err });
  }
});

app.get('/students', async (req, res) => {
  try {
    const students = await studentsCollection.find().toArray();
    res.json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).send('Error fetching students');
  }
});

app.get('/students/:id', async (req, res) => {
  try {
    const studentId = new ObjectId(req.params.id);
    const student = await studentsCollection.findOne({ _id: studentId });
    if (student) {
      res.status(200).json(student);
    } else {
      res.status(404).send({ message: 'Student not found' });
    }
  } catch (err) {
    res.status(500).send({ message: 'Error retrieving student', error: err });
  }
});

app.put('/students/:id', async (req, res) => {
  try {
    const studentId = new ObjectId(req.params.id);
    const updateData = req.body;
    const result = await studentsCollection.updateOne(
      { _id: studentId },
      { $set: updateData }
    );
    if (result.modifiedCount > 0) {
      res.status(200).send({ message: 'Student updated successfully' });
    } else {
      res.status(404).send({ message: 'Student not found' });
    }
  } catch (err) {
    res.status(500).send({ message: 'Error updating student', error: err });
  }
});

app.delete('/students/:id', async (req, res) => {
  try {
    const studentId = new ObjectId(req.params.id);
    const result = await studentsCollection.deleteOne({ _id: studentId });
    if (result.deletedCount > 0) {
      res.status(200).send({ message: 'Student deleted successfully' });
    } else {
      res.status(404).send({ message: 'Student not found' });
    }
  } catch (err) {
    res.status(500).send({ message: 'Error deleting student', error: err });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

