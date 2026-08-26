export default function Row({ task, onDelete }) {
  return (
    <li>
      {task.description}
      <button
        className="delete-button"
        onClick={() => onDelete(task.id)}
      >
        Delete
      </button>
    </li>
  )
}
