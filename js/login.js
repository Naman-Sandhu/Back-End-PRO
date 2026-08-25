// ---- ambient pulse bg build ----
const pulseBg = document.getElementById("pulse-bg");
const NODE_COUNT = 14;
for (let i = 0; i < NODE_COUNT; i++) {
  const seg = document.createElement("div");
  seg.className = "seg";
  const dot = document.createElement("div");
  dot.className = "dot";
  const isRetry = Math.random() > 0.85;
  dot.style.background = isRetry ? "var(--amber)" : "var(--green)";
  if (isRetry) dot.classList.add("breathe");
  seg.appendChild(dot);
  if (i < NODE_COUNT - 1) {
    const line = document.createElement("div");
    line.className = "line";
    seg.appendChild(line);
  }
  pulseBg.appendChild(seg);
}

// ---- MRR ticker ----
let mrr = 48210;
const mrrTicker = document.getElementById("mrr-ticker");
setInterval(() => {
  mrr += Math.round(Math.random() * 40 - 8);
  mrrTicker.textContent = "MRR $" + mrr.toLocaleString();
}, 1800);

// ---- password show/hide ----
const pwInput = document.getElementById("password");
const pwToggle = document.getElementById("pw-toggle");
pwToggle.addEventListener("click", () => {
  const isPw = pwInput.type === "password";
  pwInput.type = isPw ? "text" : "password";
  pwToggle.textContent = isPw ? "Hide" : "Show";
});

// ---- fake auth submit ----
const form = document.getElementById("login-form");
const submitBtn = document.getElementById("submit-btn");

form.addEventListener("submit", (e) => {
  e.preventDefault(); // stop real page reload — handle it ourselves

  const email = document.getElementById("email").value;
  const password = pwInput.value;
  if (!email || !password) return;

  submitBtn.disabled = true;
  submitBtn.classList.remove("failed");
  submitBtn.innerHTML = `<span class="spinner"></span> Verifying`;

  setTimeout(() => {
    const success = Math.random() > 0.15;
    if (success) {
      submitBtn.innerHTML = "✓ Welcome back";
      setTimeout(() => {
        window.location.href = "dashboard.html";
      }, 600);
    } else {
      submitBtn.classList.add("failed");
      submitBtn.innerHTML = "Couldn't sign in — check your details";
      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.classList.remove("failed");
        submitBtn.innerHTML = "Sign in →";
      }, 1800);
    }
  }, 1400);
});