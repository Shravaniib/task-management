import { useEffect, useState } from "react";
import axios from "axios";

import Header from "./components/Header";
import Footer from "./components/Footer";

function App() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/tasks/")
      .then((response) => {
        setTasks(response.data);
      })
      .catch((error) => {
        console.error("API Error:", error);
      });
  }, []);

  return (
    <>
      <Header />

      <div style={{ padding: "20px" }}>
        <h2>Tasks from Django API</h2>

        {tasks.length === 0 ? (
          <p>No tasks found.</p>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              style={{
                border: "1px solid #ccc",
                padding: "10px",
                marginBottom: "10px",
              }}
            >
              <h3>{task.title}</h3>
              <p>{task.description}</p>
              <p>Status: {task.status}</p>
            </div>
          ))
        )}
      </div>

      <Footer />
    </>
  );
}

export default App;