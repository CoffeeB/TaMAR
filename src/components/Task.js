import { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa'
import { Link } from 'react-router-dom'

const Task = ({ task, onDelete, onToggle }) => {
  const [isTime, setIsTime] = useState(false);
  const [countDownMessage, setCountDownMessage] = useState('');
  const [shownReminderTimes, setShownReminderTimes] = useState([]);

  useEffect(() => {
    const checkTime = setInterval(() => {
      const currentTime = new Date().getTime();
      const taskTime = new Date(task.day).getTime();
      const timeDifference = taskTime - currentTime;
      const reminderTimes = [60000, 30000, 10000];
  
      reminderTimes.forEach((reminderTime) => {
        if (!shownReminderTimes.includes(reminderTime) && timeDifference <= reminderTime && timeDifference > 0) {
          const secondsRemaining = Math.floor(reminderTime / 1000);
          setCountDownMessage(`It's ${secondsRemaining} seconds away`);
          if (task.reminder) {
            showNotification(`Task Reminder: ${task.text}`, `is ${secondsRemaining} seconds away`);
          }
          setShownReminderTimes([...shownReminderTimes, reminderTime]);
          setTimeout(() => {
            setCountDownMessage('');
          }, reminderTime - 5000);
        }
      });
  
      if (timeDifference <= 0 && timeDifference >= -30000) {
        setIsTime(true);
      } else if (timeDifference <= -30000) {
        setIsTime(false);
        clearInterval(checkTime);
      }
    }, 1000);
  
    return () => clearInterval(checkTime);
  }, [task, shownReminderTimes]);

  const formatDate = (date) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(date).toLocaleDateString(undefined, options);
  };

  const formatTime = (time) => {
    const options = { hour: '2-digit', minute: '2-digit' };
    return new Date(time).toLocaleTimeString(undefined, options);
  };

  const showNotification = (title, message) => {
    if (!("Notification" in window)) {
      alert("This browser does not support notifications!");
    } else if (Notification.permission === "granted") {
      new Notification(title, {body: message});
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          new Notification(title, {body: message});
        }
      });
    }
  }


  return (
    <div className={`task ${task.reminder ? 'reminder': ''}`} onDoubleClick={() => onToggle(task._id)} >
      <h3>{task.text} <FaTimes style={{color: 'red', cursor: 'pointer'}} onClick={() => onDelete(task._id)}  /></h3>
      <p>{formatDate(task.day)} {formatTime(task.day)}</p> 
      {countDownMessage && <p>{countDownMessage}</p>}
      {isTime && <p>It's Time</p>}
      <p><Link to={`/task/${task._id}`}>View Details</Link></p>
    </div>
  )
}

export default Task
