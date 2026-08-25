// ---- pulse strip build ----
const pulseStrip = document.getElementById("pulse-strip");
const NODE_COUNT = 10;
const nodeEls = [];

for (let i = 0; i < NODE_COUNT; i++) {
  const seg = document.createElement("div");
  seg.className = "seg";
  const dot = document.createElement("div");
  dot.className = "dot";
  dot.style.background = "#3FA66E";
  seg.appendChild(dot);
  if (i < NODE_COUNT - 1) {
    const line = document.createElement("div");
    line.className = "line";
    seg.appendChild(line);
  }
  pulseStrip.appendChild(seg);
  nodeEls.push(dot);
}
nodeEls[3].style.background = "var(--amber)";

// ---- hero mini-simulation (charge -> fail -> retry -> recovered) ----
const steps = [
  { label: "Invoice created", sub: "$29.00 · Pro plan", color: "var(--slate)" },
  { label: "Charge failed", sub: "card_declined", color: "var(--red)" },
  { label: "Retrying — day 3", sub: "attempt 2 of 4", color: "var(--amber)" },
  { label: "Payment recovered", sub: "subscription active", color: "var(--green)" },
];

let tick = 0;
const simLabel = document.getElementById("sim-label");
const simSub = document.getElementById("sim-sub");
const simDot = document.getElementById("sim-dot");
const activeNode = nodeEls[7];

function runSimStep() {
  const step = steps[tick % steps.length];
  simLabel.textContent = step.label;
  simSub.textContent = step.sub;
  simDot.style.background = step.color;
  activeNode.style.background = step.color;

  activeNode.classList.remove("shatter", "pulse");
  if (tick % steps.length === 1) {
    void activeNode.offsetWidth; // restart animation
    activeNode.classList.add("shatter");
  } else if (tick % steps.length === 2) {
    activeNode.classList.add("pulse");
  }
  tick++;
}
runSimStep();
setInterval(runSimStep, 2600);

// ---- MRR ticker ----
let mrr = 48210;
const mrrEl = document.getElementById("mrr");
setInterval(() => {
  mrr += Math.round(Math.random() * 60 - 10);
  mrrEl.textContent = "$" + mrr.toLocaleString();
}, 2000);

// ---- dunning timeline ----
const timeline = document.getElementById("timeline");
const stages = [
  { day: "Day 0", label: "Charge attempted" },
  { day: "Day 1", label: "Retry #1" },
  { day: "Day 3", label: "Retry #2" },
  { day: "Day 5", label: "Retry #3" },
  { day: "Day 7", label: "Final retry" },
];

stages.forEach((s, i) => {
  const stage = document.createElement("div");
  stage.className = "tl-stage";
  stage.innerHTML = `
    <div class="tl-dot" id="tl-dot-${i}"></div>
    <div class="tl-day">${s.day}</div>
    <div class="tl-label" id="tl-label-${i}">${s.label}</div>
  `;
  timeline.appendChild(stage);
  if (i < stages.length - 1) {
    const line = document.createElement("div");
    line.className = "tl-line";
    line.id = `tl-line-${i}`;
    timeline.appendChild(line);
  }
});

let activeStage = 0;
function renderTimeline() {
  stages.forEach((_, i) => {
    const dot = document.getElementById(`tl-dot-${i}`);
    const label = document.getElementById(`tl-label-${i}`);
    dot.classList.remove("pulse");
    if (i < activeStage) {
      dot.style.background = "var(--green)";
      label.style.color = "#8B948E";
    } else if (i === activeStage) {
      dot.style.background = "var(--amber)";
      dot.classList.add("pulse");
      label.style.color = "var(--paper)";
    } else {
      dot.style.background = "#3A423D";
      label.style.color = "#8B948E";
    }
    if (i < stages.length - 1) {
      document.getElementById(`tl-line-${i}`).style.background =
        i < activeStage ? "var(--green)" : "rgba(240,237,228,0.1)";
    }
  });
}
renderTimeline();
setInterval(() => {
  activeStage = (activeStage + 1) % stages.length;
  renderTimeline();
}, 1800);

// ---- webhook terminal ----
const terminal = document.getElementById("terminal");
const events = [
  { t: "10:42:01", e: "invoice.payment_failed", c: "var(--red)" },
  { t: "10:42:01", e: "subscription.past_due", c: "var(--amber)" },
  { t: "10:42:02", e: "dunning.retry_scheduled", c: "var(--slate)" },
  { t: "13:15:44", e: "invoice.payment_succeeded", c: "var(--green)" },
  { t: "13:15:44", e: "subscription.active", c: "var(--green)" },
];

let shown = 0;
function renderTerminal() {
  terminal.innerHTML = "";
  for (let i = 0; i < shown; i++) {
    const line = document.createElement("div");
    line.className = "line";
    line.innerHTML = `<span>${events[i].t}</span><span style="color:${events[i].c}">${events[i].e}</span>`;
    terminal.appendChild(line);
  }
  const cursor = document.createElement("span");
  cursor.style.color = "var(--green)";
  cursor.textContent = "▍";
  terminal.appendChild(cursor);
}
shown = 1;
renderTerminal();
setInterval(() => {
  shown = shown >= events.length ? 1 : shown + 1;
  renderTerminal();
}, 1100);

// ---- scroll reveal ----
document.querySelectorAll(".features, .dunning, .webhooks-grid, .logos").forEach((el) => {
  el.classList.add("reveal");
});
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("visible");
    });
  },
  { threshold: 0.15 }
);
document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));