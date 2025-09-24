// Import our custom CSS
import "../scss/styles.scss";
import * as bootstrap from "bootstrap";

document.addEventListener("DOMContentLoaded", () => {
  const taskInput = document.getElementById("task-input");
  const addButton = document.getElementById("add-button");
  const workList = document.getElementById("work-list");

  displayTasks();

  addButton.addEventListener("click", addTask);

  // Add new task with timestamp
  function addTask() {
    const taskText = taskInput.value.trim();
    if (!taskText) return;

    const timestamp = new Date().toLocaleString();
    const newLi = createTaskElement(taskText, timestamp);

    workList.appendChild(newLi);
    taskInput.value = "";

    showMessage("Task added.");
    saveTasks();
  }

  // Event delegation for delete, edit, complete
  workList.addEventListener("click", (e) => {
    const target = e.target;

    if (target.classList.contains("delete-task")) {
      target.closest("li").remove();
      showMessage("Task deleted.");
      saveTasks();
    }

    if (target.classList.contains("edit-task")) {
      const li = target.closest("li");
      const span = li.querySelector(".task-text");
      const newText = prompt("Edit your task:", span.textContent);
      if (newText !== null && newText.trim() !== "") {
        span.textContent = newText.trim();
        showMessage("Task edited.");
        saveTasks();
      }
    }

    if (target.classList.contains("task-text")) {
      target.closest("li").classList.toggle("active");
      saveTasks();
    }
  });

  function createTaskElement(text, timestamp) {
    const li = document.createElement("li");
    li.className = "list-group-item d-flex align-items-center justify-content-between";

    li.innerHTML = `
      <div class="d-flex flex-column flex-grow-1">
        <span class="task-text">${text}</span>
        <small class="text-muted">${timestamp}</small>
      </div>
      <div class="btn-group btn-group-sm">
        <button class="btn btn-outline-secondary edit-task">✏️</button>
        <button class="btn btn-outline-danger delete-task">❌</button>
      </div>
    `;
    return li;
  }

  function saveTasks() {
    localStorage.setItem("tasks", workList.innerHTML);
  }

  function displayTasks() {
    const saved = localStorage.getItem("tasks");
    if (saved) workList.innerHTML = saved;
  }

  function showMessage(msg) {
    const alert = document.createElement("div");
    alert.className = "alert alert-info mt-3";
    alert.textContent = msg;
    document.querySelector(".Todo-container").appendChild(alert);
    setTimeout(() => alert.remove(), 2000);
  }
});
