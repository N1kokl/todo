import { useEffect, useState } from 'react'
import axios from 'axios'
import './App.css'
import Row from './components/Row'
import { useUser } from './context/useUser'

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001'

const getErrorMessage = (error) =>
  error.response?.data?.error?.message ||
  error.response?.data?.message ||
  error.message ||
  String(error)

function App() {
  const [task, setTask] = useState('')
  const [tasks, setTasks] = useState([])
  const { user } = useUser()

  useEffect(() => {
    axios
      .get(`${apiUrl}/tasks`)
      .then((response) => {
        setTasks(response.data)
      })
      .catch((error) => {
        alert(getErrorMessage(error))
      })
  }, [])

  const addTask = (event) => {
    event.preventDefault()

    const description = task.trim()
    if (!description) return

    const headers = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    }

    axios
      .post(
        `${apiUrl}/tasks`,
        { task: { description } },
        headers,
      )
      .then((response) => {
        setTasks((currentTasks) => [
          ...currentTasks,
          response.data,
        ])
        setTask('')
      })
      .catch((error) => {
        alert(getErrorMessage(error))
      })
  }

  const deleteTask = (deletedId) => {
    const headers = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    }

    axios
      .delete(`${apiUrl}/tasks/${deletedId}`, headers)
      .then(() => {
        setTasks((currentTasks) =>
          currentTasks.filter(
            (item) => item.id !== deletedId,
          ),
        )
      })
      .catch((error) => {
        alert(getErrorMessage(error))
      })
  }

  return (
    <div id="container">
      <h3>Todos</h3>

      <form onSubmit={addTask}>
        <input
          placeholder="Add new task"
          value={task}
          onChange={(event) => setTask(event.target.value)}
        />
      </form>

      <ul>
        {tasks.map((item) => (
          <Row
            key={item.id}
            task={item}
            onDelete={deleteTask}
          />
        ))}
      </ul>
    </div>
  )
}

export default App
