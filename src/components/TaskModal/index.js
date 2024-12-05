import "./styles.css";

const TaskModal = ({ isOpen, onClose, onSubmit, task }) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains("modal-overlay")) {
      onClose();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(e.target.isDaily);
    const taskData = {
      title: e.target.title.value,
      description: e.target.description.value,
      type: e.target.type.value,
      isDaily: e.target.isDaily.checked,
    };
    onSubmit(taskData);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <h2>{task ? "Edit Task" : "New Task"}</h2>
        <form onSubmit={handleSubmit}>
          <input
            name="title"
            placeholder="Task Title"
            defaultValue={task?.title || ""}
            required
          />
          <label>
            Is Daily?
            <input
              name="isDaily"
              type="checkbox"
              defaultChecked={task?.isDaily || false}
            />
          </label>
          <textarea
            name="description"
            placeholder="Task Description"
            defaultValue={task?.description || ""}
          />
          <select name="type" defaultValue={task?.type || "private"}>
            <option value="private">Private</option>
            <option value="shared">Shared</option>
          </select>
          <button type="submit">{task ? "Save Changes" : "Add Task"}</button>
        </form>
        <button onClick={onClose} className="close-button">
          ✕
        </button>
      </div>
    </div>
  );
};

export default TaskModal;
