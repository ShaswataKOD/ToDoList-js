import { showToast } from "../toast";

export function handleLogOut() {
  document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    showToast("You have been logged out successfully.", "success");

    window.location.href = "/pages/login.html";
  });
}

export default handleLogOut;
