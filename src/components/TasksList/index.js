import "./styles.css";
import { deleteTask } from "../../firebase";

const TasksList = ({ tasks, loading, openEditTaskModal }) => {
  if (loading) return <p>Loading...</p>;

  return (
    <ul>
      {tasks.map((task) => (
        <li id={task.id} key={task.id}>
          <h3>{task.title}</h3>
          <p>{task.description}</p>
          <p>Type: {task.type}</p>
          <button onClick={() => openEditTaskModal(task)}>Edit</button>
          <button onClick={() => deleteTask(task.id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
};

export default TasksList;
