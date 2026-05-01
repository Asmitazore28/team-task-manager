import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { taskAPI } from "../services/api";

export default function Dashboard() {
  const { user, logout } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await taskAPI.getDashboard();
      setStats(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="container">Loading...</div>;
  }

  return (
    <div>
      <nav className="nav">
        <div>
          <Link to="/dashboard" style={{ fontWeight: "bold", fontSize: 18 }}>Team Task Manager</Link>
        </div>
        <div>
          <span style={{ marginRight: 20 }}>Welcome, {user?.name} ({user?.role})</span>
          <Link to="/projects">Projects</Link>
          <Link to="/tasks">Tasks</Link>
          <a href="#" onClick={logout} style={{ marginLeft: 20 }}>Logout</a>
        </div>
      </nav>
      <div className="container">
        <h1 style={{ marginBottom: 20 }}>Dashboard</h1>
        <div className="grid">
          <div className="card stat-card">
            <div className="stat-number">{stats?.totalTasks || 0}</div>
            <div>Total Tasks</div>
          </div>
          <div className="card stat-card">
            <div className="stat-number" style={{ color: "#ffc107" }}>{stats?.todo || 0}</div>
            <div>To Do</div>
          </div>
          <div className="card stat-card">
            <div className="stat-number" style={{ color: "#17a2b8" }}>{stats?.inProgress || 0}</div>
            <div>In Progress</div>
          </div>
          <div className="card stat-card">
            <div className="stat-number" style={{ color: "#28a745" }}>{stats?.done || 0}</div>
            <div>Done</div>
          </div>
          <div className="card stat-card">
            <div className="stat-number" style={{ color: "#dc3545" }}>{stats?.overdue || 0}</div>
            <div>Overdue</div>
          </div>
        </div>
        <h2 style={{ marginTop: 30, marginBottom: 15 }}>Recent Tasks</h2>
        <div className="card">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Project</th>
                <th>Status</th>
                <th>Assigned To</th>
                <th>Due Date</th>
              </tr>
            </thead>
            <tbody>
              {stats?.tasks?.slice(0, 10).map((task) => (
                <tr key={task._id}>
                  <td>{task.title}</td>
                  <td>{task.project?.name}</td>
                  <td>
                    <span className={`badge badge-${task.status}`}>
                      {task.status}
                    </span>
                  </td>
                  <td>{task.assignedTo?.name || "Unassigned"}</td>
                  <td>
                    {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
