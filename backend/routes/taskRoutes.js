const router = require("express").Router();
const ctrl = require("../controllers/taskController");
const auth = require("../middleware/auth");

// All routes require authentication
router.post("/", auth, ctrl.createTask);
router.get("/", auth, ctrl.getTasks);
router.get("/dashboard", auth, ctrl.getDashboard);
router.get("/users", auth, ctrl.getUsers);
router.get("/:id", auth, ctrl.getTask);
router.put("/:id", auth, ctrl.updateTask);
router.put("/:id/status", auth, ctrl.updateTaskStatus);
router.put("/:id/assign", auth, ctrl.assignTask);
router.delete("/:id", auth, ctrl.deleteTask);

module.exports = router;
