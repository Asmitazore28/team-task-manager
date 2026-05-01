import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { projectAPI, taskAPI } from "../services/api";

export default function Projects() {
  const { user, logout } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newProject, setNewProject] = useState({ name: "", description: "" });
  const [selectedMembers, setSelectedMembers] = useState([]);

  useEffect(() => {
    fetchProjects();
    fetchUsers();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await projectAPI.getAll();
      setProjects(res.data);
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

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      await projectAPI.create({ ...newProject, members: selectedMembers });
      setNewProject({ name: "", description: "" });
      setSelectedMembers([]);
      setShowForm(false);
      fetchProjects();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to create project");
    }
  };

  const handleDeleteProject = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await projectAPI.delete(id);
      fetchProjects();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to delete project");
    }
  };

  const toggleMember = (userId) => {
    setSelectedMembers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
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
          <Link to="/tasks">Tasks</Link>
          <a href="#" onClick={logout} style={{ marginLeft: 20 }}>Logout</a>
        </div>
      </nav>
      <div className="container">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h1>Projects</h1>
          {user?.role === "admin" && (
            <button className="btn" onClick={() => setShowForm(!showForm)}>
              {showForm ? "Cancel" : "+ New Project"}
            </button>
          )}
        </div>

        {showForm && (
          <div className="card" style={{ marginBottom: 20 }}>
            <h3>Create New Project</h3>
            <form onSubmit={handleCreateProject}>
              <input
                type="text"
                placeholder="Project Name"
                value={newProject.name}
                onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                required
              />
              <textarea
                placeholder="Description"
                value={newProject.description}
                onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                style={{ width: "100%", padding: 10, marginBottom: 10, border: "1px solid #ddd", borderRadius: 4 }}
              />
              <div style={{ marginBottom: 10 }}>
                <strong>Add Members:</strong>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 10 }}>
                  {users.map((u) => (
                    <label key={u._id} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      <input
                        type="checkbox"
                        checked={selectedMembers.includes(u._id)}
                        onChange={() => toggleMember(u._id)}
                      />
                      {u.name} ({u.role})
                    </label>
                  ))}
                </div>
              </div>
              <button type="submit" className="btn">Create Project</button>
            </form>
          </div>
        )}

        <div className="grid">
          {projects.map((project) => (
            <div key={project._id} className="card">
              <h3>{project.name}</h3>
              <p style={{ color: "#666", marginBottom: 10 }}>{project.description}</p>
              <p style={{ fontSize: 14, marginBottom: 5 }}>
                <strong>Created by:</strong> {project.createdBy?.name}
              </p>
              <p style={{ fontSize: 14, marginBottom: 10 }}>
                <strong>Members:</strong> {project.members?.map((m) => m.name).join(", ") || "None"}
              </p>
              <div style={{ display: "flex", gap: 10 }}>
                <Link to={`/projects/${project._id}`} className="btn" style={{ fontSize: 12, padding: "5px 10px" }}>
                  View
                </Link>
                {user?.role === "admin" && (
                  <button
                    className="btn btn-danger"
                    style={{ fontSize: 12, padding: "5px 10px" }}
                    onClick={() => handleDeleteProject(project._id)}
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {projects.length === 0 && (
          <div className="card" style={{ textAlign: "center" }}>
            <p>No projects yet. Create one to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
}
