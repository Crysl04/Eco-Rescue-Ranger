
let carbon = 100;  // 0-100 (0 = clean / completed)
let points = 0;

function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }

function updateUI() {
  const cv = document.getElementById('carbonValue');
  if (cv) cv.textContent = String(Math.round(carbon));

  const pv = document.getElementById('pointsValue');
  if (pv) pv.textContent = String(points);

  const inner = document.getElementById('carbonBarInner');
  if (inner) {
    inner.style.width = `${clamp(carbon, 0, 100)}%`;
    if (carbon > 66) inner.style.background = 'rgba(255, 80, 80, 0.85)';
    else if (carbon > 33) inner.style.background = 'rgba(255, 200, 80, 0.85)';
    else inner.style.background = 'rgba(80, 255, 140, 0.85)';
  }
}

export function resetCarbon(start=100) {
  carbon = clamp(start, 0, 100);
  updateUI();
}

export function resetPoints() {
  points = 0;
  updateUI();
}

export function addPoints(p) {
  points += p;
  updateUI();
}

export function spendPoints(cost) {
  if (points < cost) return false;
  points -= cost;
  updateUI();
  return true;
}

export function changeCarbon(delta) {
  carbon = clamp(carbon + delta, 0, 100);
  updateUI();
}

export function getCarbon(){ return carbon; }
export function getPoints(){ return points; }

// No carbon creep in this tuned version.
export function carbonCreep(_trashRemaining) {}
