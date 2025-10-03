import "../scss/styles.scss";
import * as bootstrap from "bootstrap";

/**
 * Professional Todo List Application
 * Features: Add, Edit, Delete, Priority Filter, Complete Tasks
 */

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

  /**
   * Initialize the application
   */
  function init() {
    loadTasks();
    displayAllTasks();
    attachEventListeners();
  }

  /**
   * Attach all event listeners
   */
  function attachEventListeners() {
    addButton.addEventListener("click", addTask);
    taskInput.addEventListener("keypress", handleKeyPress);
    searchPriority.addEventListener("change", filterTasks);
    workList.addEventListener("click", handleTaskActions);
  }

  /**
   * Handle keyboard events for task input
   */
  function handleKeyPress(e) {
    if (e.key === "Enter") {
      addTask();
    }
  }

  /**
   * Add a new task
   */
  function addTask() {
    const taskText = taskInput.value.trim();
    const priority = prioritySelect.value;

    if (!taskText) {
      showMessage("Please enter a task.", "warning");
      return;
    }

    const task = createTask(taskText, priority);
    tasks.push(task);

    // Reset input fields
    taskInput.value = "";
    prioritySelect.value = "Low";
    taskInput.focus();

    showMessage("Task added successfully!", "success");
    saveTasks();
    displayAllTasks();
  }

  /**
   * Create a task object
   */
  function createTask(text, priority) {
    return {
      id: Date.now(),
      text: text,
      timestamp: new Date().toLocaleString(),
      priority: priority,
      completed: false,
    };
  }

  /**
   * Handle all task-related actions (edit, delete, toggle)
   */
  function handleTaskActions(e) {
    const target = e.target.closest("button, .task-text");
    if (!target) return;

    const li = target.closest("li");
    if (!li) return;

    const taskId = parseInt(li.dataset.id);

    if (
      target.classList.contains("delete-task") ||
      target.closest(".delete-task")
    ) {
      deleteTask(taskId);
    } else if (
      target.classList.contains("edit-task") ||
      target.closest(".edit-task")
    ) {
      editTask(taskId);
    } else if (target.classList.contains("task-text")) {
      toggleTaskCompletion(taskId, li);
    }
  }

  /**
   * Delete a task
   */
  function deleteTask(taskId) {
    tasks = tasks.filter((t) => t.id !== taskId);
    showMessage("Task deleted.", "info");
    saveTasks();
    displayAllTasks();
  }

  /**
   * Edit a task
   */
  function editTask(taskId) {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    const newText = prompt("Edit your task:", task.text);
    if (newText !== null && newText.trim() !== "") {
      task.text = newText.trim();
      task.timestamp = new Date().toLocaleString(); // Update timestamp
      showMessage("Task updated successfully!", "success");
      saveTasks();
      displayAllTasks();
    }
  }

  /**
   * Toggle task completion status
   */
  function toggleTaskCompletion(taskId, liElement) {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    task.completed = !task.completed;
    liElement.classList.toggle("completed");
    saveTasks();
  }

  /**
   * Create a task DOM element
   */
  function createTaskElement(task) {
    const li = document.createElement("li");
    li.className = `list-group-item task-item ${
      task.completed ? "completed" : ""
    }`;
    li.dataset.priority = task.priority;
    li.dataset.id = task.id;

    const priorityClass = task.priority.toLowerCase();
    const completedClass = task.completed ? "text-decoration-line-through" : "";

    li.innerHTML = `
      <div class="task-content">
        <div class="task-main">
          <span class="task-text ${completedClass}">${escapeHtml(
      task.text
    )}</span>
          <span class="badge priority-badge bg-${priorityClass}">${
      task.priority
    }</span>
        </div>
        <small class="task-timestamp">${task.timestamp}</small>
      </div>
      <div class="task-actions">
        <button class="btn btn-sm btn-primary edit-task" title="Edit Task" aria-label="Edit task">
          Edit
        </button>
        <button class="btn btn-sm btn-danger delete-task" title="Delete Task" aria-label="Delete task">
          Delete
        </button>
      </div>
    `;

    return li;
  }

  /**
   * Display all tasks based on current filter
   */
  function displayAllTasks() {
    workList.innerHTML = "";
    const filter = searchPriority.value;

    const filteredTasks = filter
      ? tasks.filter((task) => task.priority === filter)
      : tasks;

    if (filteredTasks.length === 0) {
      displayEmptyState(filter);
      return;
    }

    filteredTasks.forEach((task) => {
      const taskElement = createTaskElement(task);
      workList.appendChild(taskElement);
    });
  }

  /**
   * Display empty state message
   */
  function displayEmptyState(filter) {
    const emptyMessage = document.createElement("li");
    emptyMessage.className = "list-group-item text-center text-muted";

    if (filter) {
      emptyMessage.textContent = `No tasks with ${filter} priority`;
    } else {
      emptyMessage.textContent = "No tasks yet. Add one to get started!";
    }

    workList.appendChild(emptyMessage);
  }

  /**
   * Filter tasks based on priority selection
   */
  function filterTasks() {
    displayAllTasks();
  }

  /**
   * Save tasks to storage (using in-memory storage for Claude)
   * In production, replace with localStorage.setItem("tasks", JSON.stringify(tasks))
   */
  function saveTasks() {
    window.tasksData = JSON.stringify(tasks);
  }

  /**
   * Load tasks from storage
   * In production, replace with localStorage.getItem("tasks")
   */
  function loadTasks() {
    const saved = window.tasksData;
    if (saved) {
      try {
        tasks = JSON.parse(saved);
      } catch (e) {
        console.error("Error loading tasks:", e);
        tasks = [];
      }
    }
  }

  /**
   * Show notification message
   */
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

  /**
   * Escape HTML to prevent XSS attacks
   */
  function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }
});
