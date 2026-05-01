import { useState, useEffect, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { projectAPI, taskAPI } from "../services/api";

export default function ProjectDetail() {
  const { id } = useParams();
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    status: "todo",
    priority: "medium",
    dueDate: "",
    assignedTo: "",
  });

  useEffect(() => {
    fetchProject();
    fetchTasks();
    fetchUsers();
  }, [id]);

  const fetchProject = async () => {
    try {
      const res = await projectAPI.getOne(id);
      setProject(res.data);
    } catch (err) {
      console.error(err);
      navigate("/projects");
    }
  };

  const fetchTasks = async () => {
    try {
      const res = await taskAPI.getAll({ project: id });
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
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
      await taskAPI.create({ ...newTask, project: id });
      setNewTask({
        title: "",
        description: "",
        status: "todo",
        priority: "medium",
        dueDate: "",
        assignedTo: "",
      });
      setShowForm(false);
      fetchTasks();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to create task");
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await taskAPI.updateStatus(taskId, newStatus);
      fetchTasks();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to update status");
    }
  };

  const handleAddMember = async (userId) => {
    try {
      await projectAPI.addMember(id, userId);
      fetchProject();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to add member");
    }
  };

  const handleRemoveMember = async (userId) => {
    if (!window.confirm("Remove this member from the project?")) return;
    try {
      await projectAPI.removeMember(id, userId);
      fetchProject();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to remove member");
    }
  };

  const availableMembers = users.filter((u) => !project?.members?.some((m) => m._id === u._id));

  if (loading || !project) {
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
          <Link to="/tasks">Tasks</Link>
          <a href="#" onClick={logout} style={{ marginLeft: 20 }}>Logout</a>
        </div>
      </nav>
      <div className="container">
        <Link to="/projects" style={{ marginBottom: 15, display: "inline-block" }}>&larr; Back to Projects</Link>
        
        <div className="card" style={{ marginBottom: 20 }}>
          <h1>{project.name}</h1>
          <p style={{ color: "#666", marginTop: 10 }}>{project.description}</p>
          <p style={{ fontSize: 14, marginTop: 10 }}>
            <strong>Created by:</strong> {project.createdBy?.name} ({project.createdBy?.email})
          </p>
        </div>

        <div className="grid" style={{ gridTemplateColumns: "1fr 2fr", marginBottom: 20 }}>
          <div className="card">
            <h3>Members</h3>
            {project.members?.length > 0 ? (
              <ul style={{ listStyle: "none", padding: 0 }}>
                {project.members?.map((member) => (
                  <li key={member._id} style={{ padding: "10px 0", borderBottom: "1px solid #eee", display: "flex", justifyContent: "space-between" }}>
                    <span>
                      {member.name} <span style={{ color: "#666", fontSize: 12 }}>({member.role})</span>
                    </span>
                    {user?.role === "admin" && (
                      <button
                        className="btn btn-danger"
                        style={{ fontSize: 10, padding: "3px 8px" }}
                        onClick={() => handleRemoveMember(member._id)}
                      >
                        Remove
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No members in this project.</p>
            )}
            {user?.role === "admin" && availableMembers.length > 0 && (
              <div style={{ marginTop: 15 }}>
                <h4>Add Member</h4>
                <select
                  onChange={(e) => {
                    if (e.target.value) handleAddMember(e.target.value);
                    e.target.value = "";
                  }}
                  style={{ width: "100%" }}
                >
                  <option value="">Select user...</option>
                  {availableMembers.map((u) => (
                    <option key={u._id} value={u._id}>{u.name} ({u.role})</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 15 }}>
              <h3>Tasks ({tasks.length})</h3>
              <button className="btn" onClick={() => setShowForm(!showForm)}>
                {showForm ? "Cancel" : "+ New Task"}
              </button>
            </div>

            {showForm && (
              <div style={{ marginBottom: 20, padding: 15, background: "#f8f9fa", borderRadius: 4 }}>
                <h4>Create New Task</h4>
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
                      value={newTask.assignedTo}
                      onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
                      style={{ width: "auto" }}
                    >
                      <option value="">Assign To</option>
                      {project.members?.map((u) => (
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

            {tasks.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <th>Title</th>
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
                            style={{ fontSize: 10, padding: "3px 8px" }}
                            onClick={async () => {
                              if (window.confirm("Delete this task?")) {
                                await taskAPI.delete(task._id);
                                fetchTasks();
                              }
                            }}
                          >
                            Delete
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p style={{ textAlign: "center", padding: 20 }}>No tasks in this project. Create one!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
