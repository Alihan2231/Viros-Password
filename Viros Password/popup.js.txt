// DOM Elements
const passwordDisplay = document.getElementById('password-display');
const copyButton = document.getElementById('copy-button');
const strengthMeter = document.getElementById('strength-meter');
const strengthText = document.getElementById('strength-text');
const lengthSlider = document.getElementById('length-slider');
const lengthValue = document.getElementById('length-value');
const uppercaseCheck = document.getElementById('uppercase');
const lowercaseCheck = document.getElementById('lowercase');
const numbersCheck = document.getElementById('numbers');
const symbolsCheck = document.getElementById('symbols');
const generateButton = document.getElementById('generate-button');
const saveButton = document.getElementById('save-button');
const saveForm = document.getElementById('save-form');
const passwordName = document.getElementById('password-name');
const confirmSaveButton = document.getElementById('confirm-save');
const passwordsList = document.getElementById('passwords-list');
const noPasswordsMessage = document.getElementById('no-passwords');
const passwordCount = document.getElementById('password-count');
const languageSelect = document.getElementById('language-select');
const generatorTab = document.getElementById('generator-tab');
const savedTab = document.getElementById('saved-tab');
const generatorSection = document.getElementById('generator-section');
const savedSection = document.getElementById('saved-section');
const createFirstPasswordButton = document.getElementById('create-first-password');

// State variables
let currentPassword = '';
let copyIconTimeout;

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
  // Load user language preference
  const language = await getCurrentLanguage();
  languageSelect.value = language;
  
  // Set initial language
  await setLanguage(language);
  
  // Generate initial password
  await updatePassword();
  
  // Load saved passwords
  await refreshPasswordsList();
  
  // Setup event listeners
  setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
  // Password generation and actions
  generateButton.addEventListener('click', updatePassword);
  copyButton.addEventListener('click', copyToClipboard);
  lengthSlider.addEventListener('input', updateLengthDisplay);
  
  // Character checkboxes
  [uppercaseCheck, lowercaseCheck, numbersCheck, symbolsCheck].forEach(checkbox => {
    checkbox.addEventListener('change', ensureOneChecked);
  });
  
  // Saving password
  saveButton.addEventListener('click', async () => {
    if (!currentPassword) {
      const message = await getTranslation('createPasswordFirst');
      showToast(message, 'error');
      return;
    }
    saveForm.classList.toggle('hidden');
    passwordName.focus();
  });
  
  confirmSaveButton.addEventListener('click', saveCurrentPassword);
  
  // Enter key on password name input
  passwordName.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
      saveCurrentPassword();
    }
  });
  
  // Tab switching
  generatorTab.addEventListener('click', () => switchTab('generator-section'));
  savedTab.addEventListener('click', () => switchTab('saved-section'));
  
  // Create first password button
  createFirstPasswordButton.addEventListener('click', () => {
    switchTab('generator-section');
    updatePassword();
  });
  
  // Language selector
  languageSelect.addEventListener('change', () => {
    setLanguage(languageSelect.value);
    refreshPasswordsList();
  });
}

// Switch between tabs
function switchTab(tabId) {
  // Hide all tab contents
  document.querySelectorAll('.tab-content').forEach(tab => {
    tab.classList.remove('active');
  });
  
  // Show selected tab content
  document.getElementById(tabId).classList.add('active');
  
  // Update tab button states
  document.querySelectorAll('.tab-button').forEach(button => {
    button.classList.remove('active');
  });
  
  // Activate the clicked tab button
  document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');
}

// Update length display when slider changes
async function updateLengthDisplay() {
  const langCode = await getCurrentLanguage();
  const lang = translations[langCode];
  lengthValue.textContent = `${lengthSlider.value} ${lang.characters}`;
}

// Ensure at least one character type checkbox remains checked
async function ensureOneChecked(e) {
  const checkboxes = [uppercaseCheck, lowercaseCheck, numbersCheck, symbolsCheck];
  const checkedCount = checkboxes.filter(cb => cb.checked).length;
  
  if (checkedCount === 0) {
    e.target.checked = true;
    const message = await getTranslation('minCharType');
    showToast(message, 'warning');
  }
}

// Update password and strength indicator
async function updatePassword() {
  // Generate new password
  currentPassword = generatePassword();
  passwordDisplay.value = currentPassword;
  
  // Update strength indicator
  const strengthResult = await calculatePasswordStrength(currentPassword);
  strengthText.textContent = strengthResult.strength;
  strengthMeter.style.width = `${strengthResult.percentage}%`;
  
  // Reset strength meter classes and add appropriate color class
  strengthMeter.className = '';
  strengthMeter.classList.add(strengthResult.colorClass);
  
  // Hide save form if it was open
  saveForm.classList.add('hidden');
  
  return currentPassword;
}

// Copy password to clipboard
async function copyToClipboard() {
  if (!currentPassword) return;
  
  try {
    await navigator.clipboard.writeText(currentPassword);
    
    // Show check icon
    document.querySelector('.copy-icon').classList.add('hidden');
    document.querySelector('.check-icon').classList.remove('hidden');
    
    // Set timeout to revert back to copy icon
    clearTimeout(copyIconTimeout);
    copyIconTimeout = setTimeout(() => {
      document.querySelector('.copy-icon').classList.remove('hidden');
      document.querySelector('.check-icon').classList.add('hidden');
    }, 1500);
    
    const message = await getTranslation('copiedToast');
    showToast(message, 'success');
  } catch (err) {
    console.error('Could not copy text: ', err);
    const message = await getTranslation('copyFailedToast');
    showToast(message, 'error');
  }
}

// Save current password
async function saveCurrentPassword() {
  if (!currentPassword) return;
  
  const untitledText = await getTranslation('untitledPassword');
  const name = passwordName.value.trim() || untitledText;
  const formattedDate = await formatDate();
  
  const newPassword = {
    id: Date.now(),
    name: name,
    password: currentPassword,
    date: formattedDate
  };
  
  // Get saved passwords
  const savedPasswords = await loadSavedPasswords();
  savedPasswords.push(newPassword);
  
  // Save updated passwords list
  await savePasswords(savedPasswords);
  
  const message = await getTranslation('passwordSaved');
  showToast(message, 'success');
  passwordName.value = '';
  saveForm.classList.add('hidden');
  
  // Refresh the passwords list
  await refreshPasswordsList();
}

// Refresh the saved passwords list
async function refreshPasswordsList() {
  const savedPasswords = await loadSavedPasswords();
  const langCode = await getCurrentLanguage();
  const lang = translations[langCode];
  
  // Update password count
  passwordCount.textContent = `${savedPasswords.length} ${lang.passwordCount}`;
  
  // Clear list
  passwordsList.innerHTML = '';
  
  // Show/hide empty state
  if (savedPasswords.length === 0) {
    noPasswordsMessage.classList.remove('hidden');
  } else {
    noPasswordsMessage.classList.add('hidden');
    
    // Add each password to the list
    for (const password of savedPasswords) {
      const passwordItem = await createPasswordElement(password);
      passwordsList.appendChild(passwordItem);
      
      // Set up event listeners for password item actions
      setupPasswordItemListeners(passwordItem, password);
    }
  }
}

// Set up event listeners for password item actions
async function setupPasswordItemListeners(passwordItem, password) {
  const langCode = await getCurrentLanguage();
  const lang = translations[langCode];
  
  const viewButton = passwordItem.querySelector('.view');
  const copyButton = passwordItem.querySelector('.copy');
  const deleteButton = passwordItem.querySelector('.delete');
  const passwordText = passwordItem.querySelector('.password-text');
  const maskedPassword = '•'.repeat(password.password.length);
  
  // Toggle password visibility
  viewButton.addEventListener('click', () => {
    if (passwordText.textContent === maskedPassword) {
      passwordText.textContent = password.password;
      viewButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>';
    } else {
      passwordText.textContent = maskedPassword;
      viewButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>';
    }
  });
  
  // Copy password to clipboard
  copyButton.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(password.password);
      const message = await getTranslation('copiedToast');
      showToast(message, 'success');
    } catch (err) {
      console.error('Could not copy text: ', err);
      const message = await getTranslation('copyFailedToast');
      showToast(message, 'error');
    }
  });
  
  // Delete password
  deleteButton.addEventListener('click', async () => {
    if (confirm(lang.deleteConfirm)) {
      const savedPasswords = await loadSavedPasswords();
      const updatedPasswords = savedPasswords.filter(pwd => pwd.id !== password.id);
      
      await savePasswords(updatedPasswords);
      
      const message = await getTranslation('passwordDeleted');
      showToast(message, 'success');
      
      // Refresh the list
      await refreshPasswordsList();
    }
  });
}
