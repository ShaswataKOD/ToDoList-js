import { showToast } from "../toast.js"; 

document.addEventListener("DOMContentLoaded", () => {
  const profileForm = document.getElementById("profileForm");

  profileForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;

    showToast(`Profile updated: ${username}, ${email}`, "success");
  });

  const imageUpload = document.getElementById("imageUpload");

});
