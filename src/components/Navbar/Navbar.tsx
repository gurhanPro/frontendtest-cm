import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import styles from "./Navbar.module.scss";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!user) return null;

  return (
    <nav className={styles.nav}>
      <div className={styles.userInfo}>
        <span>{user.firstName} {user.lastName}</span>
      </div>
      <button onClick={handleLogout} className={styles.logoutBtn}>
        Logout
      </button>
    </nav>
  );
}
