import "../scss/login.scss";
import { showToast } from "./modal.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    // Validation
    if (!email || !password) {
      showToast("Please fill in all fields", "error");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.accessToken && data.refreshToken) {
        
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);

        showToast("Login successful!", "success");

        
        setTimeout(() => {
          window.location.href = "../pages/dashboard.html";
        }, 3000);
      } else {
        showToast(data.message || "Login failed", "error");
      }
    } catch (err) {
      console.error("Login error:", err);
      showToast("An error occurred while logging in. Please try again.", "error");
    }
  });
});
