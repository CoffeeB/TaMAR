import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Header from './components/Header';
import Footer from './components/Footer';
import Tasks from './components/Tasks';
import AddTasks from './components/AddTasks';
import About from './components/About';
import TaskDetails from './components/TaskDetails';
import Login from './components/Login';
import Signup from "./components/Signup";

const App = () => {
  const [showAddTask, setShowAddTask] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const storedUsername = sessionStorage.getItem('username');
      const isLoggedIn = sessionStorage.getItem('loggedIn') === 'true';

      if (isLoggedIn && storedUsername) {
        console.log('User logged in');
        setLoggedIn(true);
        await getTasks(storedUsername);
      } else {
        setLoggedIn(false);
        setTasks([]);
      }
    };

    fetchData();
  }, []);

  // Handle login
  const handleLogin = (username) => {
    sessionStorage.setItem('loggedIn', 'true');
    sessionStorage.setItem('username', username);
    console.log('Stored username:', sessionStorage.getItem('username'));
    getTasks(username); // Move this line here
    setLoggedIn(true); // Set loggedIn state after setting sessionStorage
  };

  // Fetch user's tasks
  const getTasks = async (username) => {
    try {
      if (!username) {
        throw new Error('Username is not defined');
      }
      const res = await fetch(`http://localhost:4000/users/${username}/tasks`);
      if (!res.ok) {
        throw new Error('Failed to fetch tasks');
      }
      const data = await res.json();
      console.log(data);
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  // Add user's Task
  const addTask = async (taskData) => {
    try {
      const username = sessionStorage.getItem('username');
      const taskToSend = {
        userId: username, // Add userId
        text: taskData.text, // Add text
        day: taskData.day, // Add day
        reminder: taskData.reminder // Add reminder
      };

      const res = await fetch(`http://localhost:4000/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(taskToSend)
      });
      if (!res.ok) {
        throw new Error('Failed to Add task');
      }
      const data = await res.json();

      // Update the state with the new task
      setTasks((prevTasks) => [...prevTasks, data]);

      // No need to fetch updated task list here
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  // Delete user's Task
  const deleteTask = async (taskId) => {
    try {
      const username = sessionStorage.getItem('username');
      const res = await fetch(`http://localhost:4000/users/${username}/tasks/${taskId}`, {
        method: 'DELETE'
      });
      if (!res.ok) {
        throw new Error('Failed to delete task');
      }
      // Assuming tasks state is updated after successful deletion, no need to explicitly update here
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  // Example of how to call the deleteTask function
  const handleDeleteTask = async (username, taskId) => {
    try {
      await deleteTask(username, taskId);
      // If deletion is successful, update the tasks state to reflect the changes
      // You may need to implement this logic based on your app structure
    } catch (error) {
      console.error('Error handling task deletion:', error);
    }
  };

  // Toggle Reminder for user's task
  const toggleReminder = async (id) => {
    try {
      const username = sessionStorage.getItem('username');
      const task = tasks.find((task) => task.id === id);
      const updTask = { ...task, reminder: !task.reminder };
      const res = await fetch(`http://localhost:4000/tasks/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updTask)
      });
      if (!res.ok) {
        throw new Error('Failed to toggle reminder');
      }
      const data = await res.json();
      setTasks(
        tasks.map((task) => task.id === id ? { ...task, reminder: data.reminder } : task)
      );
    } catch (error) {
      console.error('Error toggling reminder:', error);
    }
  };

  return (
    <Router>
      <div className="container">
        <Header onAdd={() => setShowAddTask(!showAddTask)} showAdd={showAddTask} />
        <Routes>
          <Route path="/" element={
            loggedIn ? (
              <>
                {showAddTask && <AddTasks onAdd={addTask} />}
                {tasks.length > 0 ? <Tasks tasks={tasks} onDelete={deleteTask} onToggle={toggleReminder} /> : 'No Tasks to Show'}
              </>
            ) : (<Navigate to="/login" replace />)
          } />
          <Route path="/about" element={<About />} />
          <Route path="/task/:id" element={<TaskDetails />} />
          <Route path="/login" element={loggedIn ? (<Navigate to={"/"} replace />) : (<Login onLogin={handleLogin} />)} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
