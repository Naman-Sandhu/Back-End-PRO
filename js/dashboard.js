// ---- demo subscription data ----
// generic SVG glyphs per service (play/film/tv shapes), NOT real brand logos —
// reproducing actual Netflix/Prime/etc marks would be a trademark/copyright issue
const ICONS = {
  play: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#0B1210" stroke-width="2"><path d="M6 4l14 8-14 8V4z" fill="#0B1210"/></svg>`,
  film: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#0B1210" stroke-width="2"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 4v16M17 4v16M3 9h4M17 9h4M3 15h4M17 15h4"/></svg>`,
  tv: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#0B1210" stroke-width="2"><rect x="3" y="6" width="18" height="13" rx="2"/><path d="M8 21h8M12 19v2M7 3l5 3 5-3"/></svg>`,
  clapper: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#0B1210" stroke-width="2"><path d="M3 8l16-3 1 5-16 3z"/><rect x="3" y="10" width="18" height="10" rx="1"/></svg>`,
  star: `<svg viewBox="0 0 24 24" width="18" height="18" fill="#0B1210" stroke="none"><path d="M12 2l2.9 6.3 6.9.7-5.1 4.7 1.5 6.8L12 17l-6.2 3.5 1.5-6.8L2.2 9l6.9-.7z"/></svg>`,
};

const subscriptions = [
  { id: "netflix", name: "Netflix", plan: "Premium 4K", price: 649, color: "#C0432F", icon: "play", status: "active" },
  { id: "prime", name: "Prime Video", plan: "Annual", price: 1499, color: "#3FA6C9", icon: "clapper", status: "active" },
  { id: "yt", name: "YouTube Premium", plan: "Individual", price: 149, color: "#D64545", icon: "tv", status: "past_due" },
  { id: "jio", name: "Jio Cinema", plan: "Premium", price: 299, color: "#3FA66E", icon: "film", status: "active" },
  { id: "hotstar", name: "Disney+ Hotstar", plan: "Super", price: 899, color: "#7C5FE0", icon: "star", status: "canceled" },
];

const grid = document.getElementById("sub-grid");
const totalEl = document.getElementById("total");
const detailPanel = document.getElementById("detail-panel");

function statusLabel(s) {
  return { active: "Active", past_due: "Past due", canceled: "Canceled" }[s];
}

function renderGrid() {
  grid.innerHTML = "";
  let total = 0;
  subscriptions.forEach((sub) => {
    if (sub.status !== "canceled") total += sub.price;

    const card = document.createElement("div");
    card.className = "sub-card";
    card.dataset.id = sub.id;

    card.innerHTML = `
      <div class="sub-top">
        <div class="sub-icon" style="background:${sub.color}">${ICONS[sub.icon]}</div>
        <div>
          <div class="sub-name">${sub.name}</div>
          <div class="sub-plan">${sub.plan}</div>
        </div>
      </div>
      <div class="sub-bottom">
        <span class="sub-price mono">₹${sub.price}/mo</span>
        <span class="status-pill status-${sub.status}">${statusLabel(sub.status)}</span>
      </div>
      <div class="sub-mini-strip"></div>
    `;

    // mini pulse strip per card — 6 nodes, mostly green, red/amber if not active
    const strip = card.querySelector(".sub-mini-strip");
    for (let i = 0; i < 6; i++) {
      const d = document.createElement("div");
      d.className = "mdot";
      let color = "#3FA66E";
      if (sub.status === "past_due" && i === 5) color = "#E8A33D";
      if (sub.status === "canceled" && i >= 4) color = "#C0432F";
      d.style.background = color;
      strip.appendChild(d);
    }

    card.addEventListener("click", () => selectSub(sub.id));
    grid.appendChild(card);
  });

  totalEl.textContent = "₹" + total.toLocaleString();
  document.getElementById("summary-total") &&
    (document.getElementById("summary-total").textContent = "₹" + total.toLocaleString());
}

function selectSub(id) {
  document.querySelectorAll(".sub-card").forEach((c) => c.classList.remove("selected"));
  document.querySelector(`.sub-card[data-id="${id}"]`).classList.add("selected");

  const sub = subscriptions.find((s) => s.id === id);
  const historyDates = ["Apr", "May", "Jun", "Jul", "Aug", "Sep"];
  const historyColors = historyDates.map((_, i) => {
    if (sub.status === "past_due" && i === 5) return "var(--amber)";
    if (sub.status === "canceled" && i >= 4) return "var(--red)";
    return "var(--green)";
  });

  detailPanel.innerHTML = `
    <div class="detail-head">
      <h3>${sub.name} · ${sub.plan}</h3>
      <div class="detail-actions">
        <button class="btn-small" id="upgrade-btn">Change plan</button>
        <button class="btn-small danger" id="cancel-btn">Cancel</button>
      </div>
    </div>
    <div class="history-strip" id="history-strip"></div>
    <div class="history-labels">${historyDates.map((d) => `<span>${d}</span>`).join("")}</div>
  `;

  const strip = document.getElementById("history-strip");
  historyColors.forEach((color, i) => {
    const seg = document.createElement("div");
    seg.className = "seg";
    const dot = document.createElement("div");
    dot.className = "hdot";
    dot.style.background = color;
    seg.appendChild(dot);
    if (i < historyColors.length - 1) {
      const line = document.createElement("div");
      line.className = "hline";
      seg.appendChild(line);
    }
    strip.appendChild(seg);
  });

  document.getElementById("cancel-btn").addEventListener("click", () => {
    sub.status = "canceled";
    renderGrid();
    selectSub(id);
  });
  document.getElementById("upgrade-btn").addEventListener("click", () => {
    alert("Plan change flow — wire this to your real upgrade/proration endpoint later.");
  });
}

renderGrid();