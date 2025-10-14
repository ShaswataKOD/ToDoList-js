import * as bootstrap from "bootstrap";

/**
 * Show a reusable Bootstrap toast
 * @param {string} message - Message text (can use HTML)
 * @param {string} type - "success", "error", "info" (Bootstrap color)
 * @param {number} delay - How long toast is visible in ms (default 3000)
 */
export function showToast(message, type = "info", delay = 3000) {
  const container = document.getElementById("toastContainer");
  if (!container) return;

  const bgClass =
    type === "success"
      ? "bg-success text-white"
      : type === "error"
      ? "bg-danger text-white"
      : "bg-info text-white";

  const toastEl = document.createElement("div");
  toastEl.className = `toast align-items-center ${bgClass} border-0`;
  toastEl.setAttribute("role", "alert");
  toastEl.setAttribute("aria-live", "assertive");
  toastEl.setAttribute("aria-atomic", "true");

  toastEl.innerHTML = `
    <div class="d-flex">
      <div class="toast-body">${message}</div>
      <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
    </div>
  `;

  container.appendChild(toastEl);

  const toast = new bootstrap.Toast(toastEl, { delay });
  toast.show();

  // Remove toast from DOM after it hides
  toastEl.addEventListener("hidden.bs.toast", () => toastEl.remove());
}
