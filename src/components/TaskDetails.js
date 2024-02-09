import { useEffect, useState } from "react"
import { useParams, Navigate, useNavigate } from "react-router-dom"
import Button from "./Button"

function TaskDetails() {
    const [loading, setLoading] = useState(true)
    const [task, setTask] = useState({})
    const [error, setError] = useState(null)

    const params = useParams()
    const navigate = useNavigate()

    const formatDate = (date) => {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return new Date(date).toLocaleDateString(undefined, options);
      };
    
      const formatTime = (time) => {
        const options = { hour: '2-digit', minute: '2-digit' };
        return new Date(time).toLocaleTimeString(undefined, options);
      };

    useEffect(() => {
        const fetchTask = async () => {
            const username = sessionStorage.getItem('username');
            const res = await fetch(`http://localhost:5000/tasks/${username}/${params.id}`)
            const data = await res.json()

            if (res.status === 404) {
                navigate('/')
            }

            setTask(data)
            setLoading(false)
        }

        fetchTask()
    })

    return loading ? ( 
    <h3>Loading...</h3>
    ) : ( 
        <div>
            <h3>{task.text}</h3>
            <p>{formatDate(task.day)} {formatTime(task.day)}</p>
            <Button onClick={() => { navigate(-1)}} text='Go Back' />
        </div>
    )
}

export default TaskDetails