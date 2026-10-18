// Lapster: The before and after Master - App logic
// Trial: 2 days, then $4.99 lifetime (one-time)

const TRIAL_DAYS = 2;
const PRICE = 4.99;

function getTrialStart() {
  return localStorage.getItem('lapster_trial_start');
}

function setTrialStart() {
  localStorage.setItem('lapster_trial_start', Date.now().toString());
}

function hasLifetime() {
  return localStorage.getItem('lapster_lifetime') === 'true';
}

function setLifetime() {
  localStorage.setItem('lapster_lifetime', 'true');
}

function isTrialActive() {
  const start = getTrialStart();
  if (!start) return false;
  const elapsed = Date.now() - parseInt(start, 10);
  return elapsed < TRIAL_DAYS * 24 * 60 * 60 * 1000;
}

function updateStatus() {
  const statusEl = document.getElementById('license-status');
  const startBtn = document.getElementById('start-trial');
  const purchaseBtn = document.getElementById('purchase-lifetime');
  if (!statusEl) return;

  if (hasLifetime()) {
    statusEl.textContent = 'Lifetime access active. Enjoy Lapster: The before and after Master forever!';
    statusEl.style.color = '#059669';
    if (startBtn) startBtn.style.display = 'none';
    if (purchaseBtn) purchaseBtn.style.display = 'none';
  } else if (isTrialActive()) {
    const start = parseInt(getTrialStart(), 10);
    const remaining = Math.max(0, TRIAL_DAYS * 24 * 60 * 60 * 1000 - (Date.now() - start));
    const hours = Math.floor(remaining / (1000 * 60 * 60));
    statusEl.textContent = `2-day free trial active. ${hours} hours remaining. Then $4.99 lifetime if not cancelled.`;
    statusEl.style.color = '#1a73e8';
    if (startBtn) startBtn.style.display = 'none';
    if (purchaseBtn) purchaseBtn.style.display = 'inline-block';
  } else if (getTrialStart()) {
    statusEl.textContent = 'Trial ended. Purchase lifetime access for $4.99 to continue.';
    statusEl.style.color = '#dc2626';
    if (startBtn) startBtn.style.display = 'none';
    if (purchaseBtn) purchaseBtn.style.display = 'inline-block';
  } else {
    statusEl.textContent = 'Start your 2-day free trial. Then $4.99 lifetime — billed once if you don’t cancel.';
    statusEl.style.color = '#374151';
    if (startBtn) startBtn.style.display = 'inline-block';
    if (purchaseBtn) purchaseBtn.style.display = 'none';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // Slider logic
  const container = document.querySelector('.ba-container');
  const afterImg = document.querySelector('.ba-img.after');
  const handle = document.querySelector('.slider-handle');
  if (container && afterImg && handle) {
    let isDragging = false;
    const updateSlider = (x) => {
      const rect = container.getBoundingClientRect();
      let percent = ((x - rect.left) / rect.width) * 100;
      percent = Math.max(0, Math.min(100, percent));
      afterImg.style.clipPath = `inset(0 ${100 - percent}% 0 0)`;
      handle.style.left = percent + '%';
    };
    handle.addEventListener('mousedown', (e) => { isDragging = true; e.preventDefault(); });
    document.addEventListener('mousemove', (e) => { if (isDragging) updateSlider(e.clientX); });
    document.addEventListener('mouseup', () => { isDragging = false; });
    container.addEventListener('click', (e) => updateSlider(e.clientX));
    // Touch support
    handle.addEventListener('touchstart', (e) => { isDragging = true; e.preventDefault(); }, { passive: false });
    document.addEventListener('touchmove', (e) => { if (isDragging) updateSlider(e.touches[0].clientX); }, { passive: false });
    document.addEventListener('touchend', () => { isDragging = false; });
  }

  // Paywall buttons
  const startBtn = document.getElementById('start-trial');
  const purchaseBtn = document.getElementById('purchase-lifetime');
  if (startBtn) {
    startBtn.addEventListener('click', () => {
      if (!getTrialStart() && !hasLifetime()) {
        setTrialStart();
        updateStatus();
        alert('2-day free trial started! You can cancel anytime before the one-time $4.99 charge.');
      }
    });
  }
  if (purchaseBtn) {
    purchaseBtn.addEventListener('click', () => {
      if (!hasLifetime()) {
        setLifetime();
        updateStatus();
        alert('Thank you! Lifetime access for $4.99 unlocked. Enjoy Lapster: The before and after Master forever.');
      }
    });
  }

  updateStatus();
});
