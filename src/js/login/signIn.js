import "../../scss/login/login.scss";
import { showToast } from "../toast.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

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
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
        console.log(data.accessToken);
        console.log(data.refreshToken);

        showToast("Login successful!", "success");

        window.location.href = "index.html";
      } else {
        showToast(data.message || "Login failed", "error");
      }
    } catch (err) {
      console.error("Login error:", err);
      showToast(
        "An error occurred while logging in. Please try again.",
        "error"
      );
    }
  });
});
