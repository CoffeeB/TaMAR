import { Link } from "react-router-dom"

const About = () => {
  return (
    <div>
      <h3>Version 1.0.0</h3>
      <h5>This project is a simple task tracker idea to teach programmers how to use react js, it was created by Traversy Media (Youtube) but i have modified it as a way of experimenting react on it.</h5>
      <Link to="/">Go Back</Link>
    </div>
  )
}

export default About
