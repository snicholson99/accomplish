import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

// Set session persistence
setPersistence(auth, browserLocalPersistence).catch((error) => {
  console.error("Error setting persistence:", error);
});

const googleSignInPopup = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    console.log("additionalUserInfo", result.additionalUserInfo);
  } catch (error) {
    console.error("Error with Google Sign-In:", error);
  }
};

const newTask = async (taskData) => {
  const user = auth.currentUser;
  if (user) {
    try {
      const tasksRef = collection(db, "users", user.uid, "tasks");
      const docRef = await addDoc(tasksRef, {
        ...taskData,
        createdAt: serverTimestamp(),
      });

      // Add the generated ID to the task object
      return { id: docRef.id, ...taskData };
    } catch (error) {
      console.error("Error creating task:", error);
    }
  }
};

const editTask = async ({ id, ...taskData }) => {
  console.log("Editing task:", { id, ...taskData });
  const user = auth.currentUser;
  if (user) {
    try {
      const taskDoc = doc(db, "users", user.uid, "tasks", id);
      await setDoc(taskDoc, {
        ...taskData,
        updatedAt: serverTimestamp(),
      });

      return { id, ...taskData };
    } catch (error) {
      console.error("Error editing task:", error);
    }
  }
};

const deleteTask = async (taskId) => {
  const user = auth.currentUser;
  if (user) {
    const taskRef = doc(db, "users", user.uid, "tasks", taskId);
    await deleteDoc(taskRef);
  }
};

const getTasks = async (userId) => {
  const tasks = [];
  const connectionsRef = collection(db, "users", userId, "connections");
  const tasksRef = collection(db, "users", userId, "tasks");

  try {
    // Get connected users
    const connectionsSnapshot = await getDocs(connectionsRef);
    const connections = connectionsSnapshot.docs.map((doc) => doc.id);

    // Fetch tasks of the current user
    const userTasksSnapshot = await getDocs(tasksRef);
    userTasksSnapshot.forEach((doc) =>
      tasks.push({ id: doc.id, ...doc.data() })
    );

    // Fetch tasks from connected users
    for (const connection of connections) {
      const sharedTasksRef = query(
        collection(db, "users", connection, "tasks"),
        where("sharedWith", "array-contains", userId)
      );
      const sharedTasksSnapshot = await getDocs(sharedTasksRef);
      sharedTasksSnapshot.forEach((doc) =>
        tasks.push({ id: doc.id, ...doc.data() })
      );
    }
  } catch (error) {
    console.error("Error fetching tasks:", error);
  }

  return tasks;
};

const ensureUserExists = async (userId) => {
  const userDocRef = doc(db, "users", userId);
  const userSnapshot = await getDoc(userDocRef);

  if (!userSnapshot.exists()) {
    await setDoc(userDocRef, { connections: {} });
    console.log(`User document for ${userId} created.`);
  }
};

const addUserConnection = async (otherUserId) => {
  const currentUser = auth.currentUser;
  try {
    // Ensure both user documents exist
    await ensureUserExists(currentUser.uid);
    await ensureUserExists(otherUserId);

    // Update connections
    const currentUserDocRef = doc(db, "users", currentUser.uid);
    const otherUserDocRef = doc(db, "users", otherUserId);

    await updateDoc(currentUserDocRef, {
      [`connections.${otherUserId}`]: true,
    });

    await updateDoc(otherUserDocRef, {
      [`connections.${currentUser.uid}`]: true,
    });

    console.log(
      `Connection between ${currentUser.uid} and ${otherUserId} created successfully.`
    );
  } catch (error) {
    console.error("Error connecting users:", error);
  }
};

export {
  auth,
  googleSignInPopup,
  newTask,
  editTask,
  deleteTask,
  getTasks,
  addUserConnection,
  db,
};
