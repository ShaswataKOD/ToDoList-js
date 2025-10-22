import { showToast } from "../toast";

document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");

  showToast("You have been logged out successfully.", "success");

  setTimeout(() => { // without this the toast is not showing problem here 
    window.location.href = "/pages/login.html";
  }, 1000);
});
