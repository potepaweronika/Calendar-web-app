import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "./Profile.module.css";

const Profile = () => {
  const [profile, setProfile] = useState();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const config = {
            method: "get",
            url: "http://localhost:8080/api/users/profile",
            headers: {
              "Content-Type": "application/json",
              "x-access-token": token,
            },
          };
          const { data: res } = await axios(config);
          setProfile(res.data);
          setFirstName(res.data.firstName);
          setLastName(res.data.lastName);
          setEmail(res.data.email);
        } catch (error) {
          if (
            error.response &&
            error.response.status >= 400 &&
            error.response.status <= 500
          ) {
            localStorage.removeItem("token");
            window.location.reload();
          }
        }
      }
    };

    fetchProfile();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const config = {
          method: "put",
          url: "http://localhost:8080/api/users/profile",
          headers: {
            "Content-Type": "application/json",
            "x-access-token": token,
          },
          data: {
            firstName,
            lastName,
            email,
            password,
          },
        };
        const response = await axios(config);
        console.log(response.data);
        // Update the profile state with the updated data
        setProfile(response.data.data);
        toast.success("Profile updated successfully");
      } catch (error) {
        if (
          error.response &&
          error.response.status >= 400 &&
          error.response.status <= 500
        ) {
          localStorage.removeItem("token");
          window.location.reload();
        }
        toast.error("Failed to update profile");
      }
    }
  };

  const handleDeleteProfile = async (e) => {
    e.preventDefault();
    if (window.confirm("Are you sure you want to delete your profile?")) {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const config = {
            method: "delete",
            url: "http://localhost:8080/api/users/",
            headers: {
              "Content-Type": "application/json",
              "x-access-token": token,
            },
          };
          const response = await axios(config);
          console.log(response.data);
          localStorage.removeItem("token");
          window.location.reload();
        } catch (error) {
          if (
            error.response &&
            error.response.status >= 400 &&
            error.response.status <= 500
          ) {
            localStorage.removeItem("token");
            window.location.reload();
          }
        }
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleCalendar = () => {
    navigate("/");
  };

  if (!profile) {
    return null;
  }

  return (
    <>
      <div className={styles.main_container}>
        <nav className={styles.navbar}>
          <h1>Calendar</h1>
          <div className={styles.button}>
            <button className={styles.white_btn} onClick={handleCalendar}>
              Calendar
            </button>
            <button className={styles.white_btn} onClick={handleLogout}>
              Logout
            </button>
          </div>
        </nav>
        <div className={styles.profile_container}>
          <h3>User Profile</h3>
          <form onSubmit={handleUpdateProfile}>
            <label htmlFor="firstName">First Name:</label>
            <input
              type="text"
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <label htmlFor="lastName">Last Name:</label>
            <input
              type="text"
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit">Update Profile</button>
            <button type="button" onClick={handleDeleteProfile}>
              Delete Profile
            </button>
          </form>
        </div>
        <ToastContainer />
      </div>
    </>
  );
};

export default Profile;
