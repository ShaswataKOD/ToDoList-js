import "../api.js"; 
import "../../scss/profile/profile.scss";
import { showToast } from "../toast.js";

document.addEventListener("DOMContentLoaded", async () => {
  const profileForm = document.getElementById("profileForm");
  const imageUpload = document.getElementById("imageUpload");
  const profilePic = document.getElementById("profilePic");
  const usernameInput = document.getElementById("username");

  const token = localStorage.getItem("accessToken");

  if (!token) {
    window.location.href = "pages/login.html";
    return;
  }

  let uploadedImageBase64 = "";

  async function loadUserProfile() {
    try {
      const response = await fetch("http://localhost:5000/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch profile");

      const data = await response.json();
      const user = data.user;

      usernameInput.value = user.username || "";
      profilePic.src = user.profileImage || "default-profile.jpg";

      uploadedImageBase64 = user.profileImage || "";

      
      localStorage.setItem("username", user.username);
      localStorage.setItem("profileImage", user.profileImage);
    } catch (error) {
      console.error("Error fetching profile:", error);
      showToast("Error loading profile", "error");
    }
  }

  await loadUserProfile();

  
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

      if (!response.ok) throw new Error(data.message || "Failed to update profile");

      localStorage.setItem("username", data.user.username);
      localStorage.setItem("profileImage", data.user.profileImage);

      showToast("Profile updated successfully!", "success");
    } catch (error) {
      console.error(error);
      showToast("Error updating profile!", "error");
    }
  });
});
