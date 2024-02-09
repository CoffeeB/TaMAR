const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;

const app = express();
const PORT = 4000;

app.use(express.json());
app.use(cors());

// laoding Data from db.json
let data = { users: [] };
fs.readFile('db.json', 'utf8')
    .then((fileData) => {
        data = JSON.parse(fileData);
        startServer(); // Start server after data is loaded
    })
    .catch((err) => {
        console.error('Error reading data file:', err);
    });

function startServer() {
    // Getting tasks of a user
    app.get('/tasks/:username', (req, res) => {
        const { username } = req.params;
        const user = data.users.find((user) => user.username === username);
        console.log('Found user:', user); // Log the user object
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const tasks = user.tasks; // Access tasks from the user object
        if (!tasks || tasks.length === 0) {
            return res.status(404).json({ error: 'No tasks found for this user' });
        }
        res.json(tasks);
    });   

    // Adding tasks to users
    app.post('/tasks/:username', (req, res) => {
        const { username } = req.params;
        const { task } = req.body;
        const user = data.users.find((user) => user.username === username);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        if (!task) {
            return res.status(400).json({ error: 'Task data is missing' });
        }
        user.tasks.push(task);
        fs.writeFile('db.json', JSON.stringify(data, null, 2))
            .then(() => {
                res.status(201).json(task);
            })
            .catch((err) => {
                console.error('Error writing data to file:', err);
                res.status(500).json({ error: 'Error saving task' });
            });
    });

    // deleting tasks
    app.delete('/tasks/:username/:taskId', (req, res) => {
        const { username } = req.params;
        const userIndex = data.users.findIndex((user) => user.username === username);
        if (userIndex === -1) {
            return res.status(404).json({ error: 'User not found' });
        }
        const taskId = parseInt(req.params.taskId, 10); // Convert taskId to integer
        const taskIndex = data.users[userIndex].tasks.findIndex((task) => task.id === taskId);
        if (taskIndex === -1) {
            return res.status(404).json({ error: 'Task not found' });
        }
        data.users[userIndex].tasks.splice(taskIndex, 1);
        fs.writeFile('db.json', JSON.stringify(data, null, 2))
            .then(() => {
                res.status(200).json({ message: 'Task deleted successfully' });
            })
            .catch((err) => {
                console.error('Error writing data to file:', err);
                res.status(500).json({ error: 'Error deleting task' });
            });
    });

    // logging in user
    app.post('/login', (req,res) => {
        const {username,password} = req.body;
        const user = data.users.find(user => user.username === username && user.password === password);
        if (!user) {
            return res.status(401).json({ error: 'Invalid username or password'})
        }
        const loggedInuser = { ...user, loggedIn : true}
        res.json(loggedInuser);
    });

    // toggling reminders
    app.put('/tasks/:username/:taskId', (req, res) => {
        const { username, taskId } = req.params;
        const { reminder } = req.body;
        const userIndex = data.users.findIndex((user) => user.username === username);
        if (userIndex === -1) {
            return res.status(404).json({ error: 'User not found' });
        }
        const taskIndex = data.users[userIndex].tasks.findIndex((task) => task.id === taskId);
        if (taskIndex === -1) {
            return res.status(404).json({ error: 'Task not found' });
        }
        data.users[userIndex].tasks[taskIndex].reminder = reminder;
        fs.writeFile('db.json', JSON.stringify(data, null, 2))
            .then(() => {
                res.status(200).json({ message: 'Task updated successfully' });
            })
            .catch((err) => {
                console.error('Error writing data to file:', err);
                res.status(500).json({ error: 'Error updating task' });
            });
    });

    // signing up user
    app.post('/signup', (req,res) => {
        const {username,password} = req.body;
        if (!username || !password) {
            return res.status(400).json({ error: 'Username and Password are required!'});
        }
        const userExists = data.users.some((user) => user.username === username);
        if (userExists) {
            return res.status(409).json({ error: 'Username already exists'});
        }
        const newUser = { username, password, tasks: [] };
        data.users.push(newUser);
        fs.writeFile('db.json', JSON.stringify(data, null, 2))
            .then(() => {
                res.status(201).json({ message: 'User Signed up Successfully'});
            })
            .catch((err) => {
                console.error('Error writing to data file:', err);
                return res.status(500).json({ error: 'Error saving user'});
            });
    });

    app.listen(PORT, () => {
        console.log(`server is listening on port:- ${PORT}`);
    });
}