import "../../scss/signup/signup.scss";
import { showToast } from "../modal.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("signupForm");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!name || !email || !password) {
      showToast("Please fill in all fields", "error");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        const message = data.message || data.error || "Registration failed";
        showToast(message, "error");
        return;
      }

      showToast(data.message || "Account created successfully!", "success");
      window.location.href = "../pages/verifyUser.html";
    } catch (err) {
      console.error("Signup error:", err);
      showToast(
        "An error occurred while registering. Please try again.",
        "error"
      );
    }
  });
});
