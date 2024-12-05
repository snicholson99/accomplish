// import { Link } from "react-router-dom";
import { googleSignInPopup } from "../../firebase.js";
import "./styles.css";

const Header = ({ user }) => (
  <header>
    {/* <Link to="/" className="header-logo">
      Accomplish
    </Link> */}
    <p>Accomplish</p>
    {user && `Welcome back, ${user.displayName.split(" ")[0]}`}
    <div className="Header-links">
      {/* <Link to="/private-tasks">Private Tasks</Link>
      <Link to="/shared-tasks">Shared Tasks</Link> */}
      {user ? (
        <img id="header-user-img" alt="user avatar" src={user.photoURL} />
      ) : (
        <button onClick={googleSignInPopup}>Sign In</button>
      )}

      {/* <a>New Task</a> */}
    </div>
  </header>
);

export default Header;
