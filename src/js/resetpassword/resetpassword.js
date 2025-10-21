import "../../scss/resetpassword/resetpassword.scss";
import { showToast } from "../modal";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("resetPasswordForm");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const oldPassword = document.getElementById("oldPassword").value.trim();
    const newPassword = document.getElementById("newPassword").value.trim();
    const confirmPassword = document
      .getElementById("confirmPassword")
      .value.trim();

    // Basic validation
    if (!email || !oldPassword || !newPassword || !confirmPassword) {
      showToast("Please fill in all fields", "error");
      return;
    }

    if (newPassword !== confirmPassword) {
      showToast("New passwords do not match", "error");
      return;
    }

    if (newPassword === oldPassword) {
      showToast("New password must be different from old password", "error");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/reset-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            oldPassword,
            newPassword,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        showToast("Password reset successfully!", "success");

        window.location.href = "./login.html";
      } else {
        showToast(data.message || "Password reset failed", "error");
      }
    } catch (err) {
      console.error("Reset password error:", err);
      showToast("An error occurred. Please try again later.", "error");
    }
  });
});
