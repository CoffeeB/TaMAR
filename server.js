const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose.connect('mongodb+srv://Jesse_Admin:Abafoni-001@cluster.ksa8yg5.mongodb.net/TaMAR', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log(err));

// Define MongoDB schema for tasks
const taskSchema = new mongoose.Schema({
  userId: String,
  text: String,
  day: Date,
  reminder: Boolean
});

// Define MongoDB schema for users
const userSchema = new mongoose.Schema({
  username: String,
  password: String
});

// Create models for tasks and users
const Task = mongoose.model('Task', taskSchema);
const User = mongoose.model('User', userSchema);

// Getting tasks of a user
app.get('/users/:username/tasks', async (req, res) => {
  const { username } = req.params;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const userTasks = await Task.find({ userId: username });
    res.json(userTasks);
  } catch (error) {
    console.error('Error getting user tasks:', error);
    res.status(500).json({ error: 'Error getting user tasks' });
  }
});

// Adding tasks
app.post('/tasks', async (req, res) => {
  const { userId, text, day, reminder } = req.body;
  try {
    const newTask = new Task({ userId, text, day, reminder });
    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (error) {
    console.error('Error adding task:', error);
    res.status(500).json({ error: 'Error adding task' });
  }
});

// Deleting tasks
app.delete('/users/:userId/tasks/:taskId', async (req, res) => {
  const { userId, taskId } = req.params;
  try {
    const task = await Task.findOneAndDelete({ _id: taskId, userId });
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Error deleting task' });
  }
});

// Login user
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username, password });
    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }
    res.json({ ...user.toObject(), loggedIn: true });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Error logging in' });
  }
});

// Update task reminder
app.put('/users/:userId/tasks/:taskId', async (req, res) => {
  const { userId, taskId } = req.params;
  const { reminder } = req.body;
  try {
    const updatedTask = await Task.findOneAndUpdate(
      { _id: taskId, userId },
      { reminder },
      { new: true }
    );
    if (!updatedTask) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json({ message: 'Task updated successfully' });
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'Error updating task' });
  }
});

// Fetching task details by task ID
app.get('/users/:username/tasks/:taskId', async (req, res) => {
const { taskId } = req.params;
try {
    const task = await Task.findById(taskId);
    if (!task) {
    return res.status(404).json({ error: 'Task not found' });
    }
    res.json(task);
} catch (error) {
    console.error('Error fetching task details:', error);
    res.status(500).json({ error: 'Error fetching task details' });
}
});  


// Signup user
app.post('/signup', async (req, res) => {
  const { username, password } = req.body;
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ error: 'Username already exists' });
    }
    const newUser = new User({ username, password });
    const savedUser = await newUser.save();
    res.status(201).json({ message: 'User signed up successfully', user: savedUser.toObject() });
  } catch (error) {
    console.error('Error signing up user:', error);
    res.status(500).json({ error: 'Error signing up user' });
  }
});

app.listen(4000, '0.0.0.0', () => {
  console.log(`Server is listening on port 4000`);
});
