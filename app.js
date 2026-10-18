// License logic for Lapster: The before and after Master
// Trial: 2 days free. Lifetime: $4.99 one-time after trial if not cancelled.
// No yearly plan or other prices.

const TRIAL_DAYS = 2;
const LIFETIME_PRICE = 4.99;
const STORAGE_KEY = 'lapster_license';

function getLicense() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || { status: 'none' };
  } catch {
    return { status: 'none' };
  }
}

function setLicense(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function daysSince(dateStr) {
  const start = new Date(dateStr);
  const now = new Date();
  return Math.floor((now - start) / (1000 * 60 * 60 * 24));
}

function updateUI() {
  const license = getLicense();
  const statusEl = document.getElementById('license-status');
  const trialBtn = document.getElementById('start-trial');
  const purchaseBtn = document.getElementById('purchase-lifetime');

  if (!statusEl) return;

  if (license.status === 'lifetime') {
    statusEl.textContent = 'You have Lifetime Access. Enjoy Lapster: The before and after Master!';
    statusEl.style.color = '#059669';
    trialBtn.style.display = 'none';
    purchaseBtn.style.display = 'none';
    return;
  }

  if (license.status === 'trial' && license.startDate) {
    const days = daysSince(license.startDate);
    const remaining = TRIAL_DAYS - days;
    if (remaining > 0) {
      statusEl.textContent = `Free trial active — ${remaining} day${remaining === 1 ? '' : 's'} remaining.`;
      statusEl.style.color = '#1a73e8';
      trialBtn.style.display = 'none';
      purchaseBtn.style.display = 'none';
      return;
    } else {
      statusEl.textContent = 'Trial ended. Purchase Lifetime Access for $4.99 (one-time).';
      statusEl.style.color = '#dc2626';
      trialBtn.style.display = 'none';
      purchaseBtn.style.display = 'inline-block';
      return;
    }
  }

  statusEl.textContent = 'Start your 2-day free trial. Then $4.99 lifetime if you don’t cancel.';
  statusEl.style.color = '#374151';
  trialBtn.style.display = 'inline-block';
  purchaseBtn.style.display = 'none';
}

function startTrial() {
  const license = getLicense();
  if (license.status === 'lifetime' || license.status === 'trial') return;
  setLicense({ status: 'trial', startDate: new Date().toISOString() });
  updateUI();
  alert('2-day free trial started! Explore Lapster: The before and after Master. Cancel anytime before the trial ends to avoid the $4.99 one-time charge.');
}

function purchaseLifetime() {
  // In a real Play Store / billing integration this would trigger Google Play Billing.
  // Here we simulate the one-time $4.99 purchase.
  if (confirm('Purchase Lifetime Access for $4.99 (one-time payment)?')) {
    setLicense({ status: 'lifetime', purchasedAt: new Date().toISOString(), price: LIFETIME_PRICE });
    updateUI();
    alert('Lifetime Access unlocked for $4.99! Welcome to Lapster: The before and after Master.');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  updateUI();
  const trialBtn = document.getElementById('start-trial');
  const purchaseBtn = document.getElementById('purchase-lifetime');
  if (trialBtn) trialBtn.addEventListener('click', startTrial);
  if (purchaseBtn) purchaseBtn.addEventListener('click', purchaseLifetime);

  // Simple before/after slider
  const container = document.querySelector('.ba-container');
  const handle = document.querySelector('.slider-handle');
  const afterImg = document.querySelector('.ba-img.after');
  if (container && handle && afterImg) {
    let dragging = false;
    const move = (clientX) => {
      const rect = container.getBoundingClientRect();
      let pct = ((clientX - rect.left) / rect.width) * 100;
      pct = Math.max(0, Math.min(100, pct));
      handle.style.left = pct + '%';
      afterImg.style.clipPath = `inset(0 ${100 - pct}% 0 0)`;
    };
    handle.addEventListener('mousedown', () => dragging = true);
    window.addEventListener('mouseup', () => dragging = false);
    window.addEventListener('mousemove', (e) => { if (dragging) move(e.clientX); });
    handle.addEventListener('touchstart', (e) => { dragging = true; e.preventDefault(); }, { passive: false });
    window.addEventListener('touchend', () => dragging = false);
    window.addEventListener('touchmove', (e) => { if (dragging) move(e.touches[0].clientX); }, { passive: false });
  }
});
