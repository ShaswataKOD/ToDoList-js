import "../scss/verify.scss";
import { showToast } from "./modal.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("verifyForm");
  const sendOtpBtn = document.getElementById("sendOtpBtn");
  const skipBtn = document.getElementById("skipBtn");

  // Send OTP when button clicked
  sendOtpBtn.addEventListener("click", async () => {
    const email = document.getElementById("email").value.trim();
    if (!email) {
      showToast("Please enter your email", "error");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (data.success) {
        showToast("OTP sent to your email", "success");
      } else {
        showToast(data.message || "Failed to send OTP", "error");
      }
    } catch (err) {
      console.error("Send OTP error:", err);
      showToast("Error sending OTP. Please try again.", "error");
    }
  });

  // Verify user with OTP
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const otp = document.getElementById("otp").value.trim();

    if (!email || !otp) {
      showToast("Please fill in both fields", "error");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const data = await response.json();

      if (data.success) {
        showToast("User verified successfully!", "success", 2000);
        setTimeout(() => {
          window.location.href = "./login.html"; // redirect to signin page
        }, 2000);
      } else {
        showToast(data.message || "Verification failed", "error");
      }
    } catch (err) {
      console.error("Verify error:", err);
      showToast("Error verifying user. Please try again.", "error");
    }
  });

  // Skip button click
  skipBtn.addEventListener("click", () => {
    showToast("Verification skipped", "info", 1500);
    setTimeout(() => {
      window.location.href = "./login.html"; // redirect to signin page
    }, 1500);
  });
});
