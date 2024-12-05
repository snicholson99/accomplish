import { useState, useEffect } from "react";
// import { Routes, Route } from "react-router-dom";
import { auth, newTask, editTask } from "./firebase.js";
import { onAuthStateChanged } from "firebase/auth";
import "./App.css";
import Header from "./components/Header";
import SharedTasks from "./pages/SharedTasks";
import TaskModal from "./components/TaskModal";
import ConnectToUserModal from "./components/ConnectToUserModal/index.js";

function App() {
  const [user, setUser] = useState(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isConnectToUserModalOpen, setIsConnectToUserModalOpen] =
    useState(false);
  const [taskModalMode, setTaskModalMode] = useState("new"); // "new" or "edit"
  const [selectedTask, setSelectedTask] = useState(null); // Holds task data for editing

  useEffect(() => {
    // This effect runs only once to set up the onAuthStateChanged listener
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe(); // Clean up the listener on component unmount
  }, []);

  const handleNewTask = (taskData) => {
    newTask(taskData).catch((error) =>
      console.error("Error adding task:", error)
    );
  };

  const handleEditTask = (taskId, taskData) => {
    editTask({ id: taskId, ...taskData }).catch((error) =>
      console.error("Error editing task:", error)
    );
  };

  const openNewTaskModal = () => {
    setSelectedTask(null);
    setTaskModalMode("new");
    setIsTaskModalOpen(true);
  };

  const openEditTaskModal = (task) => {
    setSelectedTask(task);
    setTaskModalMode("edit");
    setIsTaskModalOpen(true);
  };

  return (
    <div className="App">
      <Header user={user} />
      <SharedTasks openEditTaskModal={openEditTaskModal} />
      {/* <Routes>
        <Route path="/shared-tasks" element={<SharedTasks />} />
      </Routes> */}

      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSubmit={
          taskModalMode === "new"
            ? handleNewTask
            : (data) => handleEditTask(selectedTask.id, data)
        }
        task={selectedTask}
      />

      <ConnectToUserModal
        isOpen={isConnectToUserModalOpen}
        onClose={() => setIsConnectToUserModalOpen(false)}
      />

      <button className="floating-button" onClick={openNewTaskModal}>
        +
      </button>
      {/* <button className="floating-button" onClick={setIsConnectToUserModalOpen}>
        Connect
      </button> */}
    </div>
  );
}

export default App;
