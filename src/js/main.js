import "../scss/styles.scss";
import { getTasks, addTask, updateTask, deleteTask } from "./api.js";
import handleLogOut from "./logout/logout.js";
import { domSelectors } from "./mainQueryHandler.js";
const {
  taskInput,
  tagsInput,
  addButton,
  workList,
  prioritySelect,
  searchPriority,
  searchTags,
  searchTitle,
  profileBtn,
  profileDropdown,
  resetPasswordBtn,
  logoutBtn,
} = domSelectors;
import showMessage from "./showMessage.js";

document.addEventListener("DOMContentLoaded", () => {
  // const taskInput = document.getElementById("task-input");
  // const tagsInput = document.getElementById("tags-input");
  // const addButton = document.getElementById("add-button");
  // const workList = document.getElementById("work-list");
  // const prioritySelect = document.getElementById("priority-select");
  // const searchPriority = document.getElementById("search-priority");
  // const searchTags = document.getElementById("search-tags");
  // const searchTitle = document.getElementById("search-title");
  // const profileBtn = document.getElementById("profileBtn");
  // const profileDropdown = document.getElementById("profileDropdown");
  // const resetPasswordBtn = document.getElementById("resetPasswordBtn");
  // const logoutBtn = document.getElementById("logoutBtn");

  if (profileBtn && profileDropdown) {
    profileBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      profileDropdown.classList.toggle("show");
    });

    document.addEventListener("click", () => {
      profileDropdown.classList.remove("show");
    });
  }

  if (resetPasswordBtn) {
    resetPasswordBtn.addEventListener("click", () => {
      alert("Redirecting to Reset Password page...");
      window.location.href = "./resetpassword.html";
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", handleLogOut);
  }

  let tasks = [];

  init();

  async function init() {
    await loadTasksFromServer();
    displayAllTasks();
    attachEventListeners();
  }

  function attachEventListeners() {
    addButton?.addEventListener("click", handleAddTask);

    taskInput?.addEventListener("keypress", (e) => {
      if (e.key === "Enter") handleAddTask();
    });

    searchPriority?.addEventListener("change", handleSearch);
    searchTags?.addEventListener("input", debounce(handleSearch, 300));
    searchTitle?.addEventListener("input", debounce(handleSearch, 300));
  }

  async function loadTasksFromServer(filters = {}) {
    try {
      tasks = await getTasks(filters);
      console.log("Tasks loaded:", tasks);
    } catch (error) {
      showMessage("Failed to load tasks from server", "danger");
      console.error("Load error:", error);
      tasks = [];
    }
  }

  async function handleSearch() {
    const priority = searchPriority?.value || "";
    const tagsRaw = searchTags?.value.trim() || "";
    const title = searchTitle?.value.trim() || "";

    const tags = tagsRaw
      ? tagsRaw
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean)
      : [];

    await loadTasksFromServer({ tags, priority, title });

    displayAllTasks();
  }

  function debounce(fn, delay) {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => fn(...args), delay);
    };
  }

  async function handleAddTask() {
    const title = taskInput?.value.trim();
    const priority = prioritySelect?.value || "Low";
    const tagsRaw = tagsInput?.value.trim();

    if (!title) {
      showMessage("Please enter a task.", "warning");
      return;
    }

    const tags = tagsRaw
      ? tagsRaw
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean)
      : [];

    try {
      const newTask = await addTask(title, priority, false, tags);
      tasks.push(newTask);

      if (taskInput) {
        taskInput.value = "";
      }
      if (tagsInput) {
        tagsInput.value = "";
      }
      if (prioritySelect) {
        prioritySelect.value = "Low";
      }

      taskInput?.focus();
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
      tasks = tasks.filter((t) => t._id !== id);

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
      return;
    }

    const newTagsRaw = prompt(
      "Edit tags (comma-separated):",
      task.tags?.join(", ") || ""
    );
    const newTags = newTagsRaw
      ? newTagsRaw
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean)
      : [];

    if (newTitle.trim() === "") {
      showMessage("Task title cannot be empty.", "warning");
      return;
    }

    try {
      const updatedTask = await updateTask(task._id, {
        title: newTitle.trim(),
        priority: task.priority,
        isCompleted: task.isCompleted,
        tags: newTags,
      });

      const index = tasks.findIndex((t) => t._id === task._id);
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
      const updatedTask = await updateTask(task._id, {
        title: task.title,
        priority: task.priority,
        isCompleted: !task.isCompleted,
        tags: task.tags || [],
      });

      const index = tasks.findIndex((t) => t._id === task._id);
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
      task.isCompleted ? "completed" : ""
    }`;
    li.dataset.priority = task.priority;
    li.dataset.id = task._id;

    const priorityClass = task.priority.toLowerCase();
    const tagsHtml = (task.tags || [])
      .map(
        (tag) =>
          `<span class="badge bg-secondary me-1">${escapeHtml(tag)}</span>`
      )
      .join("");

    li.innerHTML = `
      <div class="task-content">
        <div class="task-main">
          <span class="task-text ${
            task.isCompleted ? "text-decoration-line-through" : ""
          }">
            ${escapeHtml(task.title)}
          </span>
          <span class="badge priority-badge bg-${priorityClass}">
            ${task.priority}
          </span>
        </div>
        <div class="task-tags mt-1">${tagsHtml}</div>
        <small class="task-timestamp">${new Date(
          task.updatedAt
        ).toLocaleString()}</small>
      </div>
      <div class="task-actions">
        <button class="btn btn-sm btn-primary edit-task" title="Edit Task">Edit</button>
        <button class="btn btn-sm btn-danger delete-task" title="Delete Task">Delete</button>
      </div>
    `;

    li.querySelector(".delete-task")?.addEventListener("click", (e) => {
      e.stopPropagation();
      handleDeleteTask(task._id);
    });

    li.querySelector(".edit-task")?.addEventListener("click", (e) => {
      e.stopPropagation();
      handleEditTask(task);
    });

    li.querySelector(".task-text")?.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleCompletion(task);
    });

    return li;
  }

  function displayAllTasks() {
    workList.innerHTML = "";

    if (tasks.length === 0) {
      const empty = document.createElement("li");
      empty.className = "list-group-item text-center text-muted";
      empty.textContent =
        "No tasks found. Try adjusting your filters or add a new task.";
      workList.appendChild(empty);
      return;
    }

    tasks.forEach((task) => workList.appendChild(createTaskElement(task)));
  }

  function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }
});
