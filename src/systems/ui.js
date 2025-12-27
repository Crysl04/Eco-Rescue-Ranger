// ui.js or add to existing UI system
export function showPrompt(text, duration = 3000) {
  const promptEl = document.getElementById('prompt');
  promptEl.textContent = text;
  promptEl.classList.remove('hidden');
  
  // Auto-hide after duration if provided
  if (duration) {
    clearTimeout(window._promptTimeout);
    window._promptTimeout = setTimeout(hidePrompt, duration);
  }
}

export function hidePrompt() {
  const promptEl = document.getElementById('prompt');
  promptEl.classList.add('hidden');
}