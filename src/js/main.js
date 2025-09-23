// Import our custom CSS
import "../scss/styles.scss";

// Import all of Bootstrap’s JS
import * as bootstrap from "bootstrap";

document.addEventListener("DOMContentLoaded", () => {
  const taskInput = document.getElementById("task-input");
  const addButton = document.getElementById("add-button");
  const workList = document.getElementById("work-list");

  displayTasks();

  // add event listener to add button
  addButton.addEventListener("click", addElement);

  //function to add new list 
  function addElement() {
    const taskText = taskInput.value.trim();

    if (taskText === "") {
      return;
    }


    const newLi = document.createElement("li");
    newLi.className = "list-group-item d-flex align-items-center";
    newLi.innerHTML = `${taskText} <span class="badge bg-secondary ms-auto delete-task">x</span>`;
    workList.appendChild(newLi);
    taskInput.value = "";
    saveTasks();
  }

  // Deleting the list and marking it
  workList.addEventListener("click", (e) => {
    if (e.target.tagName === "LI") {
      e.target.classList.toggle("active");
      saveTasks();
    } else if (e.target.classList.contains("delete-task")) {
      e.target.parentElement.remove();
      saveTasks();
    }
  });


  function saveTasks() {
    const list_tasks = document.getElementById("work-list").innerHTML;
    localStorage.setItem("tasks", list_tasks);
  }
  
  function displayTasks() {
    const savedItems = localStorage.getItem("tasks");
    if (savedItems) {
      document.getElementById("work-list").innerHTML = savedItems;
    }
  }
});
