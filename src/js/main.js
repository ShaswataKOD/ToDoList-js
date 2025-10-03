import "../scss/styles.scss";
import * as bootstrap from "bootstrap";

document.addEventListener("DOMContentLoaded", () => {
  const taskInput = document.getElementById("task-input");
  const addButton = document.getElementById("add-button");
  const workList = document.getElementById("work-list");
  const prioritySelect = document.getElementById("priority-select");
  const searchPriority = document.getElementById("search-priority");

  displayTasks();

  addButton.addEventListener("click", addTask);
  searchPriority.addEventListener("change", filterTasks);

  function addTask() {
    const taskText = taskInput.value.trim();
    const priority = prioritySelect.value;
    if (!taskText) return;

    const timestamp = new Date().toLocaleString();
    const newLi = createTaskElement(taskText, timestamp, priority);

    workList.appendChild(newLi);
    taskInput.value = "";
    prioritySelect.value = "Low";

    showMessage("Task added.");
    saveTasks();
  }

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

  function createTaskElement(text, timestamp, priority) {
    const li = document.createElement("li");
    li.className = `list-group-item d-flex flex-column flex-grow-1 task-item`;
    li.dataset.priority = priority;

    li.innerHTML = `
      <div class="d-flex justify-content-between align-items-center">
        <div class="d-flex flex-column flex-grow-1">
          <span class="task-text">${text}</span>
          <small class="text-muted">${timestamp}</small>
        </div>
        <span class="badge priority-badge ${priority.toLowerCase()}">${priority}</span>
      </div>
      <div class="btn-group btn-group-sm mt-2">
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

  function filterTasks() {
    const filter = searchPriority.value;
    document.querySelectorAll(".task-item").forEach((li) => {
      if (!filter || li.dataset.priority === filter) {
        li.style.display = "flex";
      } else {
        li.style.display = "none";
      }
    });
  }
});
