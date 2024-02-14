import { useEffect, useState } from "react";
import Task from "./Task";

const Tasks = ({ onDelete, onToggle }) => { 
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const username = sessionStorage.getItem('username');
                if (!username) {
                    throw new Error('Username not found in session storage');
                }
                const response = await fetch(`http://localhost:4000/users/${username}/tasks`);
                if (!response.ok) {
                    throw new Error('Failed to fetch tasks');
                }
                const data = await response.json();
                setTasks(data);
            } catch (error) {
                console.error('Error fetching tasks: ', error);
            }
        };

        fetchData();
    }, []);

    return (
        <>
            {tasks.map((task) => (
                <Task 
                    key={task._id} 
                    task={task} 
                    onDelete={onDelete} 
                    onToggle={onToggle} 
                />
            ))}
        </>
    );
};

export default Tasks;
