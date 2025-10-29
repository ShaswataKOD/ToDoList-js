import handleLogOut from "../logout/logout.js";

export function profileHandlers({
  profileBtn,
  profileDropdown,
  editProfileBtn,
  resetPasswordBtn,
  logoutBtn,
}) {
  if (profileBtn && profileDropdown) {
    profileBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      profileDropdown.classList.toggle("show");
    });

    document.addEventListener("click", () => {
      profileDropdown.classList.remove("show");
    });
  }

  editProfileBtn?.addEventListener("click", () => {
    window.location.href = "/pages/profile.html";
  });

  resetPasswordBtn?.addEventListener("click", () => {
    alert("Redirecting to Reset Password page...");
    window.location.href = "./resetpassword.html";
  });

  logoutBtn?.addEventListener("click", handleLogOut);
}
