// Character sets for password generation
const CHARSET = {
  LOWERCASE: 'abcdefghijklmnopqrstuvwxyz',
  UPPERCASE: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  NUMBERS: '0123456789',
  SYMBOLS: '!@#$%^&*()_+~`|}{[]:;?><,./-='
};

// Generate a password based on selected options
function generatePassword() {
  let charset = '';
  
  if (uppercaseCheck.checked) charset += CHARSET.UPPERCASE;
  if (lowercaseCheck.checked) charset += CHARSET.LOWERCASE;
  if (numbersCheck.checked) charset += CHARSET.NUMBERS;
  if (symbolsCheck.checked) charset += CHARSET.SYMBOLS;
  
  // Safety check
  if (charset === '') {
    charset = CHARSET.LOWERCASE;
    lowercaseCheck.checked = true;
  }
  
  let password = '';
  const length = parseInt(lengthSlider.value);
  
  // Use crypto API for secure random number generation
  const randomValues = new Uint32Array(length);
  window.crypto.getRandomValues(randomValues);
  
  for (let i = 0; i < length; i++) {
    password += charset.charAt(randomValues[i] % charset.length);
  }
  
  return password;
}

// Calculate password strength
async function calculatePasswordStrength(password) {
  const langCode = await getCurrentLanguage();
  const lang = translations[langCode];
  
  const length = password.length;
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSymbol = /[^A-Za-z0-9]/.test(password);
  
  const varietyCount = [hasLower, hasUpper, hasNumber, hasSymbol].filter(Boolean).length;
  
  let strengthPercentage = 0;
  
  // Length contributes up to 40% of strength
  strengthPercentage += Math.min(length / 32 * 40, 40);
  
  // Character variety contributes up to 60% of strength
  strengthPercentage += (varietyCount / 4) * 60;
  
  // Determine strength category and color
  let strength;
  let colorClass;
  
  if (strengthPercentage < 30) {
    strength = lang.weak;
    colorClass = 'bg-red-500';
  } else if (strengthPercentage < 60) {
    strength = lang.medium;
    colorClass = 'bg-yellow-500';
  } else if (strengthPercentage < 80) {
    strength = lang.good;
    colorClass = 'bg-green-500';
  } else {
    strength = lang.strong;
    colorClass = 'bg-blue-500';
  }
  
  return {
    strength,
    percentage: strengthPercentage,
    colorClass
  };
}

// Show a toast notification
async function showToast(message, type = 'info') {
  const toast = document.getElementById('toast');
  
  // Remove existing classes
  toast.className = 'toast';
  
  // Add appropriate class based on type
  if (type === 'success') {
    toast.classList.add('success');
  } else if (type === 'error') {
    toast.classList.add('error');
  } else if (type === 'warning') {
    toast.classList.add('warning');
  }
  
  toast.textContent = message;
  toast.classList.remove('hidden');
  
  // Auto-hide after 3 seconds
  setTimeout(() => {
    toast.classList.add('hidden');
  }, 3000);
}

// Load saved passwords from Chrome storage
function loadSavedPasswords() {
  return new Promise((resolve) => {
    chrome.storage.local.get(['savedPasswords'], (result) => {
      resolve(result.savedPasswords || []);
    });
  });
}

// Save passwords to Chrome storage
function savePasswords(passwords) {
  return new Promise((resolve) => {
    chrome.storage.local.set({ savedPasswords: passwords }, resolve);
  });
}

// Create DOM element for a saved password
async function createPasswordElement(password) {
  const langCode = await getCurrentLanguage();
  const lang = translations[langCode];
  
  const item = document.createElement('div');
  item.className = 'password-item';
  item.setAttribute('data-id', password.id);
  
  const passwordValue = password.password;
  const maskedPassword = '•'.repeat(passwordValue.length);
  
  item.innerHTML = `
    <div class="password-item-details">
      <div class="password-item-name">${password.name}</div>
      <div class="password-item-password">
        <span class="password-text">${maskedPassword}</span>
      </div>
      <div class="password-item-date">${password.date}</div>
    </div>
    <div class="password-actions">
      <button class="password-action-btn view" title="${lang.copyTooltip}">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
      </button>
      <button class="password-action-btn copy" title="${lang.copyTooltip}">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
      </button>
      <button class="password-action-btn delete" title="${lang.deleteConfirm}">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
      </button>
    </div>
  `;
  
  return item;
}

// Format date to locale string based on current language
async function formatDate() {
  const langCode = await getCurrentLanguage();
  
  const dateFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  };
  
  return new Date().toLocaleDateString(
    langCode === 'tr' ? 'tr-TR' : 
    langCode === 'de' ? 'de-DE' : 
    langCode === 'es' ? 'es-ES' : 
    'en-US', 
    dateFormatOptions
  );
}
