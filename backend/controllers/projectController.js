const Project = require("../models/Project");
const User = require("../models/User");

// Create a new project
exports.createProject = async (req, res) => {
  try {
    const { name, description, members } = req.body;
    const project = await Project.create({
      name,
      description,
      members: members || [],
      createdBy: req.user.id
    });
    res.json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all projects (for admin/manager)
exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find()
      .populate("members", "name email role")
      .populate("createdBy", "name email");
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get single project
exports.getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("members", "name email role")
      .populate("createdBy", "name email");
    res.json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update project
exports.updateProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete project
exports.deleteProject = async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: "Project deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add member to project
exports.addMember = async (req, res) => {
  try {
    const { userId } = req.body;
    const project = await Project.findById(req.params.id);
    if (!project.members.includes(userId)) {
      project.members.push(userId);
      await project.save();
    }
    res.json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Remove member from project
exports.removeMember = async (req, res) => {
  try {
    const { userId } = req.body;
    const project = await Project.findById(req.params.id);
    project.members = project.members.filter(m => m.toString() !== userId);
    await project.save();
    res.json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
