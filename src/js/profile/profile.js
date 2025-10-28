import "../api.js"; // ✅ Import fetch interceptor
import "../../scss/profile/profile.scss";
import { showToast } from "../toast.js";

document.addEventListener("DOMContentLoaded", () => {
  const profileForm = document.getElementById("profileForm");
  const imageUpload = document.getElementById("imageUpload");
  const profilePic = document.getElementById("profilePic");
  const usernameInput = document.getElementById("username");

  const savedUsername = localStorage.getItem("username");
  const savedProfileImage = localStorage.getItem("profileImage");

  if (savedUsername) usernameInput.value = savedUsername;
  if (savedProfileImage) profilePic.src = savedProfileImage;

  let uploadedImageBase64 = savedProfileImage || "";

  // Handle image upload
  imageUpload.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        uploadedImageBase64 = e.target.result;
        profilePic.src = uploadedImageBase64;
      };
      reader.readAsDataURL(file);
    } else {
      showToast("Please upload a valid image file!", "error");
    }
  });

  profileForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = usernameInput.value.trim();
    const token = localStorage.getItem("accessToken");

    if (!username) {
      showToast("Username is required!", "error");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/auth/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ username, profileImage: uploadedImageBase64 }),
      });

      const data = await response.json();

      if (!response.ok)
        throw new Error(data.message || "Failed to update profile");

      localStorage.setItem("username", data.user.username);
      localStorage.setItem("profileImage", data.user.profileImage);

      showToast("Profile updated successfully!", "success");

      setTimeout(() => {
        window.location.href = "pages/login.html";
      }, 1500);
    } catch (error) {
      console.error(error);
      showToast("Error updating profile!", "error");
    }
  });
});
