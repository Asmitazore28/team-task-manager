import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { taskAPI, projectAPI } from "../services/api";

export default function Tasks() {
  const { user, logout } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState({ status: "", project: "", assignedTo: "" });
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    status: "todo",
    priority: "medium",
    dueDate: "",
    project: "",
    assignedTo: "",
  });

  useEffect(() => {
    fetchData();
  }, [filter]);

  useEffect(() => {
    fetchProjects();
    fetchUsers();
  }, []);

  const fetchData = async () => {
    try {
      const res = await taskAPI.getAll(filter);
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchProjects = async () => {
    try {
      const res = await projectAPI.getAll();
      setProjects(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await taskAPI.getUsers();
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await taskAPI.create(newTask);
      setNewTask({
        title: "",
        description: "",
        status: "todo",
        priority: "medium",
        dueDate: "",
        project: "",
        assignedTo: "",
      });
      setShowForm(false);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to create task");
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await taskAPI.updateStatus(taskId, newStatus);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to update status");
    }
  };

  const handleDeleteTask = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await taskAPI.delete(id);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to delete task");
    }
  };

  const handleFilterChange = (e) => {
    setFilter({ ...filter, [e.target.name]: e.target.value });
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
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/projects">Projects</Link>
          <a href="#" onClick={logout} style={{ marginLeft: 20 }}>Logout</a>
        </div>
      </nav>
      <div className="container">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h1>Tasks</h1>
          <button className="btn" onClick={() => setShowForm(!showForm)}>
            {showForm ? "Cancel" : "+ New Task"}
          </button>
        </div>

        <div className="card" style={{ marginBottom: 20 }}>
          <h3 style={{ marginBottom: 10 }}>Filters</h3>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <select name="status" value={filter.status} onChange={handleFilterChange} style={{ width: "auto" }}>
              <option value="">All Status</option>
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="done">Done</option>
            </select>
            <select name="project" value={filter.project} onChange={handleFilterChange} style={{ width: "auto" }}>
              <option value="">All Projects</option>
              {projects.map((p) => (
                <option key={p._id} value={p._id}>{p.name}</option>
              ))}
            </select>
            <select name="assignedTo" value={filter.assignedTo} onChange={handleFilterChange} style={{ width: "auto" }}>
              <option value="">All Users</option>
              {users.map((u) => (
                <option key={u._id} value={u._id}>{u.name}</option>
              ))}
            </select>
          </div>
        </div>

        {showForm && (
          <div className="card" style={{ marginBottom: 20 }}>
            <h3>Create New Task</h3>
            <form onSubmit={handleCreateTask}>
              <input
                type="text"
                placeholder="Task Title"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                required
              />
              <textarea
                placeholder="Description"
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                style={{ width: "100%", padding: 10, marginBottom: 10, border: "1px solid #ddd", borderRadius: 4 }}
              />
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <select
                  value={newTask.status}
                  onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
                  style={{ width: "auto" }}
                >
                  <option value="todo">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
                <select
                  value={newTask.priority}
                  onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                  style={{ width: "auto" }}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
                <select
                  value={newTask.project}
                  onChange={(e) => setNewTask({ ...newTask, project: e.target.value })}
                  style={{ width: "auto" }}
                >
                  <option value="">Select Project</option>
                  {projects.map((p) => (
                    <option key={p._id} value={p._id}>{p.name}</option>
                  ))}
                </select>
                <select
                  value={newTask.assignedTo}
                  onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
                  style={{ width: "auto" }}
                >
                  <option value="">Assign To</option>
                  {users.map((u) => (
                    <option key={u._id} value={u._id}>{u.name}</option>
                  ))}
                </select>
                <input
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                  style={{ width: "auto" }}
                />
              </div>
              <button type="submit" className="btn" style={{ marginTop: 10 }}>Create Task</button>
            </form>
          </div>
        )}

        <div className="card">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Project</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Assigned To</th>
                <th>Due Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task._id}>
                  <td>{task.title}</td>
                  <td>{task.project?.name || "-"}</td>
                  <td>
                    <select
                      value={task.status}
                      onChange={(e) => handleStatusChange(task._id, e.target.value)}
                      style={{ width: "auto", padding: "5px" }}
                    >
                      <option value="todo">To Do</option>
                      <option value="in-progress">In Progress</option>
                      <option value="done">Done</option>
                    </select>
                  </td>
                  <td>
                    <span className={`badge badge-${task.priority === "high" ? "overdue" : task.priority === "medium" ? "in-progress" : "todo"}`}>
                      {task.priority}
                    </span>
                  </td>
                  <td>{task.assignedTo?.name || "Unassigned"}</td>
                  <td>
                    {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "-"}
                  </td>
                  <td>
                    {user?.role === "admin" && (
                      <button
                        className="btn btn-danger"
                        style={{ fontSize: 12, padding: "5px 10px" }}
                        onClick={() => handleDeleteTask(task._id)}
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {tasks.length === 0 && (
          <div className="card" style={{ textAlign: "center" }}>
            <p>No tasks found. Create one to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
}
