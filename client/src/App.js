import { Routes, Route, Navigate } from "react-router-dom";
import Main from "./components/Main";
import Profile from "./components/Profile";
import CreateEvent from "./components/Events/CreateEvent";
import EditEvent from "./components/Events/EditEvent";
import Signup from "./components/Signup";
import Login from "./components/Login";

function App() {
  const user = localStorage.getItem("token");
  return (
    <Routes>
      {user && <Route path="/" element={<Main />} />}
      {user && <Route path="/profile" element={<Profile />} />}
      {user && <Route path="/createEvent" element={<CreateEvent />} />}
      {user && <Route path="/editEvent/:eventId" element={<EditEvent />} />}
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}

export default App;
