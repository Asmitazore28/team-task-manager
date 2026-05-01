const Task = require("../models/Task");
const User = require("../models/User");

// Create a new task
exports.createTask = async (req, res) => {
  try {
    const task = await Task.create({
      ...req.body,
      createdBy: req.user.id
    });
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all tasks (with filtering)
exports.getTasks = async (req, res) => {
  try {
    const { status, project, assignedTo } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (project) filter.project = project;
    if (assignedTo) filter.assignedTo = assignedTo;

    const tasks = await Task.find(filter)
      .populate("assignedTo", "name email role")
      .populate("project", "name")
      .populate("createdBy", "name email");
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get dashboard stats
exports.getDashboard = async (req, res) => {
  try {
    const now = new Date();
    const tasks = await Task.find()
      .populate("assignedTo", "name")
      .populate("project", "name");

    const totalTasks = tasks.length;
    const todo = tasks.filter(t => t.status === "todo").length;
    const inProgress = tasks.filter(t => t.status === "in-progress").length;
    const done = tasks.filter(t => t.status === "done").length;
    const overdue = tasks.filter(t => t.dueDate && new Date(t.dueDate) < now && t.status !== "done").length;

    res.json({
      totalTasks,
      todo,
      inProgress,
      done,
      overdue,
      tasks
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get single task
exports.getTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate("assignedTo", "name email role")
      .populate("project", "name")
      .populate("createdBy", "name email");
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update task status
exports.updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const task = await Task.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update task (full update)
exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete task
exports.deleteTask = async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Assign task to user
exports.assignTask = async (req, res) => {
  try {
    const { assignedTo } = req.body;
    const task = await Task.findByIdAndUpdate(req.params.id, { assignedTo }, { new: true })
      .populate("assignedTo", "name email");
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all users (for assignment)
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select("name email role");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
