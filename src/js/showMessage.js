  export function showMessage(msg, type = "info") {
    const alert = document.createElement("div");
    alert.className = `alert alert-${type} alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3`;
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

  export default showMessage