const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const displayName = document.getElementById("display-name");
const displayEmail = document.getElementById("display-email");
const avatarBig = document.getElementById("avatar-big");
const form = document.getElementById("profile-form");
const saveStatus = document.getElementById("save-status");

function updateAvatarInitial() {
  const initial = nameInput.value.trim().charAt(0).toUpperCase() || "?";
  avatarBig.textContent = initial;
}
updateAvatarInitial();

form.addEventListener("submit", (e) => {
  e.preventDefault();
  displayName.textContent = nameInput.value;
  displayEmail.textContent = emailInput.value;
  updateAvatarInitial();

  saveStatus.textContent = "Saved ✓";
  saveStatus.classList.add("show");
  setTimeout(() => saveStatus.classList.remove("show"), 1800);

  // real version: fetch('/api/profile', { method: 'PATCH', body: JSON.stringify({...}) })
});

// demo total, mirrors dashboard's active subs (netflix+prime+jio+yt, hotstar canceled)
const demoTotal = 649 + 1499 + 149 + 299;
const summaryTotal = document.getElementById("summary-total");
if (summaryTotal) summaryTotal.textContent = "₹" + demoTotal.toLocaleString();