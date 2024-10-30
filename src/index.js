const express = require('express');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

const { publishMessage } = require('./pubsub/publisher');
const { listenForMessages } = require('./pubsub/consumer');

const helmet = require('helmet');
app.use(helmet());

// Middleware to parse JSON
app.use(express.json());

// Set up rate limiting
const limiter = rateLimit({
  windowMs: 2 * 60 * 1000, // 15 minutes
  max: 15, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes.',
});

// Apply rate limiter to all requests
app.use(limiter);

// Connect to MongoDB
  mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB:', err));

// Mongoose Todo Model
const todoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  completed: { type: Boolean, default: false },
  duedate: { type: Date, required: true },
});

const Todo = mongoose.model('Todo', todoSchema);

// Create a new todo
app.post('/todos', limiter, async (req, res) => {
  try {
    const { title, completed, duedate } = req.body;
    const newTodo = new Todo({ title, completed, duedate });
    const savedTodo = await newTodo.save();

    // Call the publishMessage function to publish the task data to Pub/Sub
    await publishMessage(title, completed, duedate);

    res.status(201).json(savedTodo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Retrieve all todos
app.get('/todos', limiter, async (req, res) => {
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Retrieve a specific todo by ID
app.get('/todos/:id', async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    res.json(todo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a specific todo by ID
app.put('/todos/:id', limiter, async (req, res) => {
  try {
    const { title, completed, duedate } = req.body;
    var updatedTodo = await Todo.findByIdAndUpdate(
      req.params.id,
      { title, completed, duedate },
      { new: true, runValidators: true }
    );
    if (!updatedTodo) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    res.json(updatedTodo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a specific todo by ID
app.delete('/todos/:id', limiter, async (req, res) => {
  try {
    const deletedTodo = await Todo.findByIdAndDelete(req.params.id);
    if (!deletedTodo) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    res.json(deletedTodo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  // Start listening for messages from Pub/Sub
  listenForMessages();
});