const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");
const todoController = require("../controllers/todo");
const { ensureAuth, ensureGuest } = require("../middleware/auth"); // .. up one level; 

//Main Routes
router.post("/createTodo", todoController.createTodo);
router.delete("/deleteTodo", todoController.deleteTodo)
router.put("/editTodo/:id", todoController.editTodo)
router.get("/edit/:id", todoController.editTodoPage)
router.put("/markComplete", todoController.markComplete)
router.put("/markUncomplete", todoController.markUncomplete)
router.get('/:area', ensureAuth, todoController.getCleaningArea);

module.exports = router;
