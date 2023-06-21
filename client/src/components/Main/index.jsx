import styles from "./styles.module.css";
import { useNavigate } from "react-router-dom";
import Calendar from "../Calendar/index";

const Main = () => {
  const navigate = useNavigate();

  const handleShowProfile = () => {
    navigate("/profile");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  return (
    <>
      <div className={styles.main_container}>
        <nav className={styles.navbar}>
          <h1>Calendar</h1>
          <div className={styles.button}>
            <button className={styles.white_btn} onClick={handleShowProfile}>
              Profile Info
            </button>
            <button className={styles.white_btn} onClick={handleLogout}>
              Logout
            </button>
          </div>
        </nav>
      </div>
      <div>
        <Calendar />
      </div>
    </>
  );
};
export default Main;
