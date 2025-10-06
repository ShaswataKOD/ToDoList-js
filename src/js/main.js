import "../scss/styles.scss";
import * as bootstrap from "bootstrap";
import { getTasks, addTask, updateTask, deleteTask } from "./api.js";

document.addEventListener("DOMContentLoaded", () => {
  // DOM Elements
  const taskInput = document.getElementById("task-input");
  const addButton = document.getElementById("add-button");
  const workList = document.getElementById("work-list");
  const prioritySelect = document.getElementById("priority-select");
  const searchPriority = document.getElementById("search-priority");

  // Application State
  let tasks = [];

  // Initialize Application
  init();

  async function init() {
    await loadTasksFromServer();
    displayAllTasks();
    attachEventListeners();
  }

  function attachEventListeners() {
    addButton.addEventListener("click", handleAddTask);
    taskInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") handleAddTask();
    });
    searchPriority.addEventListener("change", displayAllTasks);
  }

  async function loadTasksFromServer() {
    try {
      tasks = await getTasks();
      console.log("Tasks loaded:", tasks);
    } catch (error) {
      showMessage("Failed to load tasks from server", "danger");
      console.error("Load error:", error);
      tasks = [];
    }
  }

  async function handleAddTask() {
    const title = taskInput.value.trim();
    const priority = prioritySelect.value;

    if (!title) {
      showMessage("Please enter a task.", "warning");
      return;
    }

    try {
      const newTask = await addTask(title, priority);
      tasks.push(newTask);
      taskInput.value = "";
      prioritySelect.value = "Low";
      taskInput.focus();
      showMessage("Task added successfully!", "success");
      displayAllTasks();
    } catch (error) {
      showMessage("Failed to add task.", "danger");
      console.error("Add error:", error);
    }
  }

  async function handleDeleteTask(id) {
    if (!confirm("Are you sure you want to delete this task?")) {
      return;
    }

    try {
      await deleteTask(id);
      tasks = tasks.filter((t) => t.id !== id);
      showMessage("Task deleted successfully!", "success");
      displayAllTasks();
    } catch (error) {
      showMessage("Failed to delete task.", "danger");
      console.error("Delete error:", error);
    }
  }

  async function handleEditTask(task) {
    const newTitle = prompt("Edit your task:", task.title);
    
    if (newTitle === null) {
      // User clicked cancel
      return;
    }

    if (newTitle.trim() === "") {
      showMessage("Task title cannot be empty.", "warning");
      return;
    }

    try {
      const updatedTask = await updateTask(task.id, {
        title: newTitle.trim(),
        priority: task.priority,
        completed: task.completed,
      });
      
      const index = tasks.findIndex((t) => t.id === task.id);
      if (index !== -1) {
        tasks[index] = updatedTask;
      }
      
      showMessage("Task updated successfully!", "success");
      displayAllTasks();
    } catch (error) {
      showMessage("Failed to update task.", "danger");
      console.error("Update error:", error);
    }
  }

  async function toggleCompletion(task) {
    try {
      const updatedTask = await updateTask(task.id, {
        title: task.title,
        priority: task.priority,
        completed: !task.completed,
      });
      
      const index = tasks.findIndex((t) => t.id === task.id);
      if (index !== -1) {
        tasks[index] = updatedTask;
      }
      
      displayAllTasks();
    } catch (error) {
      showMessage("Failed to update task.", "danger");
      console.error("Toggle error:", error);
    }
  }

  function createTaskElement(task) {
    const li = document.createElement("li");
    li.className = `list-group-item task-item ${
      task.completed ? "completed" : ""
    }`;
    li.dataset.priority = task.priority;
    li.dataset.id = task.id;

    const priorityClass = task.priority.toLowerCase();

    li.innerHTML = `
      <div class="task-content">
        <div class="task-main">
          <span class="task-text ${
            task.completed ? "text-decoration-line-through" : ""
          }">
            ${escapeHtml(task.title)}
          </span>
          <span class="badge priority-badge bg-${priorityClass}">
            ${task.priority}
          </span>
        </div>
        <small class="task-timestamp">${formatTimestamp(task.timestamp)}</small>
      </div>
      <div class="task-actions">
        <button class="btn btn-sm btn-primary edit-task" title="Edit Task">
          Edit
        </button>
        <button class="btn btn-sm btn-danger delete-task" title="Delete Task">
          Delete
        </button>
      </div>
    `;

    // Attach event listeners
    li.querySelector(".delete-task").addEventListener("click", (e) => {
      e.stopPropagation();
      handleDeleteTask(task.id);
    });

    li.querySelector(".edit-task").addEventListener("click", (e) => {
      e.stopPropagation();
      handleEditTask(task);
    });

    li.querySelector(".task-text").addEventListener("click", (e) => {
      e.stopPropagation();
      toggleCompletion(task);
    });

    return li;
  }

  function displayAllTasks() {
    workList.innerHTML = "";
    const filter = searchPriority.value;

    const filteredTasks = filter
      ? tasks.filter((task) => task.priority === filter)
      : tasks;

    if (filteredTasks.length === 0) {
      const empty = document.createElement("li");
      empty.className = "list-group-item text-center text-muted";
      empty.textContent = filter
        ? `No tasks with ${filter} priority`
        : "No tasks yet. Add one to get started!";
      workList.appendChild(empty);
      return;
    }

    filteredTasks.forEach((task) => {
      workList.appendChild(createTaskElement(task));
    });
  }

  function formatTimestamp(timestamp) {
    try {
      return new Date(timestamp).toLocaleString();
    } catch (error) {
      return timestamp;
    }
  }

  function showMessage(msg, type = "info") {
    const alert = document.createElement("div");
    alert.className = `alert alert-${type} alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3`;
    alert.style.zIndex = "9999";
    alert.style.minWidth = "300px";
    alert.innerHTML = `
      <span>${msg}</span>
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    document.body.appendChild(alert);

    setTimeout(() => {
      alert.classList.remove("show");
      setTimeout(() => alert.remove(), 150);
    }, 2500);
  }

  function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }
});