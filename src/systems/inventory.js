
export const inventory = {
  bottle: 0,
  can: 0,
  wrapper: 0,
  saplings: 0,
  depositedOnce: false
};

export function resetInventory() {
  inventory.bottle = 0;
  inventory.can = 0;
  inventory.wrapper = 0;
  inventory.saplings = 0;
  inventory.depositedOnce = false;
  updateHUD();
}

export function addTrash(type) {
  if (type === 'bottle') inventory.bottle++;
  else if (type === 'can') inventory.can++;
  else inventory.wrapper++;
  updateHUD();
}

export function totalTrash() {
  return inventory.bottle + inventory.can + inventory.wrapper;
}

export function clearTrash() {
  const snap = { bottle: inventory.bottle, can: inventory.can, wrapper: inventory.wrapper };
  inventory.bottle = 0;
  inventory.can = 0;
  inventory.wrapper = 0;
  updateHUD();
  return snap;
}

export function addSaplings(n=2) {
  inventory.saplings += n;
  updateHUD();
}

export function useSapling() {
  if (inventory.saplings <= 0) return false;
  inventory.saplings -= 1;
  updateHUD();
  return true;
}

export function setDepositedOnce() {
  inventory.depositedOnce = true;
}

export function updateHUD() {
  const t = document.getElementById('invTrashTotal'); if (t) t.textContent = String(totalTrash());
  const s = document.getElementById('invSaplings'); if (s) s.textContent = String(inventory.saplings);
}

export function showPrompt(text) {
  const element = document.getElementById('prompt');
  if (element) {
    element.textContent = text;
    element.classList.remove('hidden');
  }
}

export function hidePrompt() {
  const element = document.getElementById('prompt');
  if (element) {
    element.classList.add('hidden');
  }
}