import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { collection, onSnapshot, query } from "firebase/firestore";
import TasksList from "../../components/TasksList";
import { auth, db } from "../../firebase";

const SharedTasks = ({ openEditTaskModal }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    let unsubscribe;

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Reference to the user's tasks collection
        const tasksRef = collection(db, "users", user.uid, "tasks");
        const tasksQuery = query(tasksRef);

        // Real-time listener for tasks collection
        unsubscribe = onSnapshot(tasksQuery, (snapshot) => {
          const fetchedTasks = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setTasks(fetchedTasks);
          setLoading(false);
        });
      } else {
        setTasks([]);
        setLoading(false);
      }
    });

    // Clean up listeners on unmount
    return () => {
      if (unsubscribe) unsubscribe();
      unsubscribeAuth();
    };
  }, []);

  const filteredTasks = tasks.filter((task) => {
    if (filter === "all") return true;
    return task.type === filter; // Assume tasks have a `type` field: 'shared' or 'private'
  });

  return (
    <div className="page">
      <h2>Your Tasks</h2>

      <label>
        Filter tasks:
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">All</option>
          <option value="shared">Shared</option>
          <option value="private">Private</option>
        </select>
      </label>

      <TasksList
        tasks={filteredTasks}
        loading={loading}
        openEditTaskModal={openEditTaskModal}
      />
    </div>
  );
};

export default SharedTasks;
