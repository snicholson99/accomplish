import { useState } from "react";
import { addUserConnection } from "../../firebase.js";

const ConnectToUserModal = ({ isOpen, onClose }) => {
  const [targetUserId, setTargetUserId] = useState("");
  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains("modal-overlay")) {
      onClose();
    }
  };

  const handleConnect = () => {
    if (!targetUserId) {
      alert("Please enter a valid user ID");
      return;
    }
    addUserConnection(targetUserId).then(() => {
      alert(`Connected to user ${targetUserId}`);
      setTargetUserId("");
      onClose();
    });
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <h3>Connect to a User</h3>
        <input
          type="text"
          placeholder="Enter User ID"
          value={targetUserId}
          onChange={(e) => setTargetUserId(e.target.value)}
        />
        <button onClick={handleConnect}>Connect</button>
        <button onClick={onClose} className="close-button">
          ✕
        </button>
      </div>
    </div>
  );
};

export default ConnectToUserModal;
