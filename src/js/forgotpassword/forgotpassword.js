// import "../../scss/forgotpassword.scss";

import { showToast } from "../toast.js";

document.addEventListener("DOMContentLoaded", () => {
  const emailStep = document.getElementById("step1");
  const otpStep = document.getElementById("step2");
  const passwordStep = document.getElementById("step3");
  const emailInput = document.getElementById("email");
  const otpInput = document.getElementById("otp");
  const currentPasswordInput = document.getElementById("currentPassword");
  const newPasswordInput = document.getElementById("newPassword");

  let emailGlobal = "";
  let otpGlobal = "";

  document.getElementById("sendOtpBtn").addEventListener("click", async () => {
    const email = emailInput.value.trim();
    if (!email) {
      return showToast("Enter your email", "error");
    }

    try {
      const res = await fetch("http://localhost:5000/api/auth/forgotpassword", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        emailGlobal = email;

        showToast(data.message, "success");

        emailStep.style.display = "none";

        otpStep.style.display = "block";
      } else {
        showToast(data.message || "Failed to send OTP", "error");
      }
    } catch (err) {
      showToast("Error sending OTP", "error");

      console.error(err);
    }
  });

  document
    .getElementById("verifyOtpBtn")
    .addEventListener("click", async () => {
      const otp = otpInput.value.trim();

      if (!otp) {
        return showToast("Enter the OTP", "error");
      }

      try {
        const res = await fetch(
          "http://localhost:5000/api/auth/forgotpassword",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: emailGlobal, otp }),
          }
        );

        const data = await res.json();

        if (res.ok && data.success) {
          otpGlobal = otp;

          showToast(data.message, "success");

          otpStep.style.display = "none";

          passwordStep.style.display = "block";
        } else {
          showToast(data.message || "Invalid OTP", "error");
        }
      } catch (err) {
        showToast("Error verifying OTP", "error");

        console.error(err);
      }
    });

  document
    .getElementById("resetPasswordBtn")
    .addEventListener("click", async () => {
      const currentPassword = currentPasswordInput.value.trim();
      const newPassword = newPasswordInput.value.trim();

      if (!newPassword) {
        return showToast("Enter a new password", "error");
      }

      try {
        const res = await fetch(
          "http://localhost:5000/api/auth/forgotpassword",
          {
            //fz ths
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: emailGlobal,
              otp: otpGlobal,
              currentPassword,
              newPassword,
            }),
          }
        );

        const data = await res.json();

        if (res.ok && data.success) {
          showToast(data.message, "success");

          passwordStep.style.display = "none";

          window.location.href = "/pages/login.html";
        } else {
          showToast(data.message || "Failed to reset password", "error");
        }
      } catch (err) {
        showToast("Error resetting password", "error");

        console.error(err);
      }
    });
});
