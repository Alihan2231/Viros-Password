// Language translations
const translations = {
  // Turkish (Default)
  tr: {
    title: "Güvenli Şifre Oluşturucu",
    generatorTab: "Şifre Oluşturucu",
    savedTab: "Kayıtlı Şifreler",
    length: "Uzunluk:",
    characters: "karakter",
    uppercase: "Büyük harfler (A-Z)",
    lowercase: "Küçük harfler (a-z)",
    numbers: "Sayılar (0-9)",
    symbols: "Semboller (!@#$...)",
    generateBtn: "Şifre Oluştur",
    saveBtn: "Şifreyi Kaydet",
    copyTooltip: "Şifreyi Kopyala",
    nameLabel: "Şifre İçin İsim:",
    namePlaceholder: "Örn: Gmail, Facebook, vb.",
    confirmSave: "Kaydet",
    noPasswords: "Henüz kaydedilmiş şifre yok",
    createFirst: "İlk Şifreyi Oluştur",
    passwordCount: "şifre",
    
    // Strength indicators
    weak: "Zayıf",
    medium: "Orta",
    good: "İyi",
    strong: "Güçlü",
    
    // Toast messages
    copiedToast: "Şifre panoya kopyalandı!",
    copyFailedToast: "Kopyalama başarısız oldu!",
    createPasswordFirst: "Lütfen önce bir şifre oluşturun!",
    passwordSaved: "Şifre başarıyla kaydedildi!",
    passwordDeleted: "Şifre başarıyla silindi!",
    minCharType: "En az bir karakter türü seçili olmalıdır!",
    
    // Confirmation
    deleteConfirm: "Bu şifreyi silmek istediğinize emin misiniz?",
    
    // Untitled password
    untitledPassword: "Adsız Şifre"
  },
  
  // English
  en: {
    title: "Secure Password Generator",
    generatorTab: "Password Generator",
    savedTab: "Saved Passwords",
    length: "Length:",
    characters: "characters",
    uppercase: "Uppercase letters (A-Z)",
    lowercase: "Lowercase letters (a-z)",
    numbers: "Numbers (0-9)",
    symbols: "Symbols (!@#$...)",
    generateBtn: "Generate Password",
    saveBtn: "Save Password",
    copyTooltip: "Copy Password",
    nameLabel: "Password Name:",
    namePlaceholder: "e.g. Gmail, Facebook, etc.",
    confirmSave: "Save",
    noPasswords: "No saved passwords yet",
    createFirst: "Create Your First Password",
    passwordCount: "passwords",
    
    // Strength indicators
    weak: "Weak",
    medium: "Medium",
    good: "Good",
    strong: "Strong",
    
    // Toast messages
    copiedToast: "Password copied to clipboard!",
    copyFailedToast: "Failed to copy!",
    createPasswordFirst: "Please generate a password first!",
    passwordSaved: "Password saved successfully!",
    passwordDeleted: "Password deleted successfully!",
    minCharType: "At least one character type must be selected!",
    
    // Confirmation
    deleteConfirm: "Are you sure you want to delete this password?",
    
    // Untitled password
    untitledPassword: "Untitled Password"
  },
  
  // German
  de: {
    title: "Sicherer Passwortgenerator",
    generatorTab: "Passwortgenerator",
    savedTab: "Gespeicherte Passwörter",
    length: "Länge:",
    characters: "Zeichen",
    uppercase: "Großbuchstaben (A-Z)",
    lowercase: "Kleinbuchstaben (a-z)",
    numbers: "Zahlen (0-9)",
    symbols: "Symbole (!@#$...)",
    generateBtn: "Passwort generieren",
    saveBtn: "Passwort speichern",
    copyTooltip: "Passwort kopieren",
    nameLabel: "Passwortname:",
    namePlaceholder: "z.B. Gmail, Facebook, usw.",
    confirmSave: "Speichern",
    noPasswords: "Noch keine Passwörter gespeichert",
    createFirst: "Erstellen Sie Ihr erstes Passwort",
    passwordCount: "Passwörter",
    
    // Strength indicators
    weak: "Schwach",
    medium: "Mittel",
    good: "Gut",
    strong: "Stark",
    
    // Toast messages
    copiedToast: "Passwort in die Zwischenablage kopiert!",
    copyFailedToast: "Kopieren fehlgeschlagen!",
    createPasswordFirst: "Bitte generieren Sie zuerst ein Passwort!",
    passwordSaved: "Passwort erfolgreich gespeichert!",
    passwordDeleted: "Passwort erfolgreich gelöscht!",
    minCharType: "Mindestens ein Zeichentyp muss ausgewählt sein!",
    
    // Confirmation
    deleteConfirm: "Sind Sie sicher, dass Sie dieses Passwort löschen möchten?",
    
    // Untitled password
    untitledPassword: "Unbenanntes Passwort"
  },
  
  // Spanish
  es: {
    title: "Generador de Contraseñas Seguras",
    generatorTab: "Generador de Contraseñas",
    savedTab: "Contraseñas Guardadas",
    length: "Longitud:",
    characters: "caracteres",
    uppercase: "Letras mayúsculas (A-Z)",
    lowercase: "Letras minúsculas (a-z)",
    numbers: "Números (0-9)",
    symbols: "Símbolos (!@#$...)",
    generateBtn: "Generar Contraseña",
    saveBtn: "Guardar Contraseña",
    copyTooltip: "Copiar Contraseña",
    nameLabel: "Nombre de la Contraseña:",
    namePlaceholder: "ej. Gmail, Facebook, etc.",
    confirmSave: "Guardar",
    noPasswords: "Aún no hay contraseñas guardadas",
    createFirst: "Crea tu primera contraseña",
    passwordCount: "contraseñas",
    
    // Strength indicators
    weak: "Débil",
    medium: "Media",
    good: "Buena",
    strong: "Fuerte",
    
    // Toast messages
    copiedToast: "¡Contraseña copiada al portapapeles!",
    copyFailedToast: "¡Error al copiar!",
    createPasswordFirst: "¡Por favor, genere una contraseña primero!",
    passwordSaved: "¡Contraseña guardada con éxito!",
    passwordDeleted: "¡Contraseña eliminada con éxito!",
    minCharType: "¡Debe seleccionar al menos un tipo de carácter!",
    
    // Confirmation
    deleteConfirm: "¿Está seguro de que desea eliminar esta contraseña?",
    
    // Untitled password
    untitledPassword: "Contraseña sin título"
  }
};

// Get current language from storage or default to Turkish
function getCurrentLanguage() {
  return new Promise((resolve) => {
    chrome.storage.local.get(['language'], (result) => {
      resolve(result.language || 'tr');
    });
  });
}

// Set language
async function setLanguage(languageCode) {
  const lang = translations[languageCode] || translations.tr;
  
  // Update all text elements
  document.getElementById('title').textContent = lang.title;
  document.getElementById('generator-tab-text').textContent = lang.generatorTab;
  document.getElementById('saved-tab-text').textContent = lang.savedTab;
  document.getElementById('length-label').textContent = lang.length;
  document.getElementById('length-value').textContent = 
    `${document.getElementById('length-slider').value} ${lang.characters}`;
  document.getElementById('uppercase-label').textContent = lang.uppercase;
  document.getElementById('lowercase-label').textContent = lang.lowercase;
  document.getElementById('numbers-label').textContent = lang.numbers;
  document.getElementById('symbols-label').textContent = lang.symbols;
  document.getElementById('generate-button-text').textContent = lang.generateBtn;
  document.getElementById('save-button-text').textContent = lang.saveBtn;
  document.getElementById('copy-button').title = lang.copyTooltip;
  document.getElementById('password-name-label').textContent = lang.nameLabel;
  document.getElementById('password-name').placeholder = lang.namePlaceholder;
  document.getElementById('confirm-save-text').textContent = lang.confirmSave;
  document.getElementById('no-passwords-text').textContent = lang.noPasswords;
  document.getElementById('create-first-password-text').textContent = lang.createFirst;
  
  // Update count if needed
  const passwordCount = document.getElementById('password-count');
  const count = parseInt(passwordCount.textContent);
  passwordCount.textContent = `${count} ${lang.passwordCount}`;
  
  // Update strength indicator
  updateStrengthText(document.getElementById('strength-text').textContent);
  
  // Save selected language to storage
  chrome.storage.local.set({ language: languageCode });
}

// Update the strength text based on current language
function updateStrengthText(currentText) {
  getCurrentLanguage().then(langCode => {
    const lang = translations[langCode];
    const strengthText = document.getElementById('strength-text');
    
    // Map the current strength to the appropriate translation
    const strengthMap = {
      'Zayıf': lang.weak,
      'Weak': lang.weak,
      'Schwach': lang.weak,
      'Débil': lang.weak,
      
      'Orta': lang.medium,
      'Medium': lang.medium,
      'Mittel': lang.medium,
      'Media': lang.medium,
      
      'İyi': lang.good,
      'Good': lang.good,
      'Gut': lang.good,
      'Buena': lang.good,
      
      'Güçlü': lang.strong,
      'Strong': lang.strong,
      'Stark': lang.strong,
      'Fuerte': lang.strong
    };
    
    // Find matching strength value
    for (const [key, value] of Object.entries(strengthMap)) {
      if (currentText === key) {
        strengthText.textContent = value;
        break;
      }
    }
  });
}

// Get translation for a key
async function getTranslation(key) {
  const langCode = await getCurrentLanguage();
  const lang = translations[langCode];
  return lang[key] || key;
}
