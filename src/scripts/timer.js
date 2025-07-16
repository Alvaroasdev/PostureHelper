// State variables
let currentTime = 20 * 60;
let originalTime = 20 * 60;
let isRunning = false;
let interval;
let currentMode = 'Focus';

// Session count by type
let counts = { Focus: 0, Quick: 0, Deep: 0 };

// Focus history
let focusHistory = [];

// Language system
let currentLanguage = 'en';

// Theme system
let currentTheme = 'light';

// Translations
const translations = {
  en: {
    welcome: {
      title: 'Take a moment',
      subtitle: 'Regular reminders for better posture'
    },
    modes: {
      focus: 'Focus (20m)',
      quick: 'Quick (5m)',
      deep: 'Deep (45m)'
    },
    timer: {
      sessions: 'Sessions'
    },
    controls: {
      start: 'Start',
      pause: 'Pause',
      reset: 'Reset'
    },
    sidebar: {
      currentFocus: 'Current focus',
      focusPlaceholder: 'What are you working on?',
      progress: "Today's progress",
      history: 'Focus history'
    },
    stats: {
      focus: 'Focus',
      quick: 'Quick',
      deep: 'Deep',
      total: 'Total'
    },
    notification: {
      title: 'Posture check',
      description: 'Take a deep breath, roll your shoulders back, and adjust your posture. Your body will thank you.',
      continue: 'Continue'
    },
    focusHistory: {
      prefix: 'You focused on: '
    }
  },
  es: {
    welcome: {
      title: 'Tómate un momento',
      subtitle: 'Recordatorios regulares para mejor postura'
    },
    modes: {
      focus: 'Enfoque (20m)',
      quick: 'Rápido (5m)',
      deep: 'Profundo (45m)'
    },
    timer: {
      sessions: 'Sesiones'
    },
    controls: {
      start: 'Iniciar',
      pause: 'Pausar',
      reset: 'Reiniciar'
    },
    sidebar: {
      currentFocus: 'Enfoque actual',
      focusPlaceholder: '¿En qué estás trabajando?',
      progress: 'Progreso de hoy',
      history: 'Historial de enfoque'
    },
    stats: {
      focus: 'Enfoque',
      quick: 'Rápido',
      deep: 'Profundo',
      total: 'Total'
    },
    notification: {
      title: 'Revisa tu postura',
      description: 'Respira profundo, echa los hombros hacia atrás y ajusta tu postura. Tu cuerpo te lo agradecerá.',
      continue: 'Continuar'
    },
    focusHistory: {
      prefix: 'Te enfocaste en: '
    }
  }
};

// DOM element shortcuts
const $ = (id) => document.getElementById(id);
const timeDisplay = $('time-display');
const controlBtn = $('control-btn');
const progressRing = $('progress-ring');
const notification = $('notification');
const sessionCount = $('session-count');
const modeButtons = document.querySelectorAll('.mode-btn');
const focusInput = $('focus-input');
const focusHistoryList = $('focus-history-list');
const notificationSound = new Audio('/sounds/ding.mp3');
const closeBtn = $('closeBtn');

notificationSound.volume = 1.0;

// Preload the audio file to ensure it's ready when needed
notificationSound.load();

// LocalStorage functions
function saveToLocalStorage() {
  const data = {
    counts: counts,
    focusHistory: focusHistory,
    timestamp: Date.now()
  };
  localStorage.setItem('postureHelperData', JSON.stringify(data));
}

function loadFromLocalStorage() {
  const saved = localStorage.getItem('postureHelperData');
  if (saved) {
    try {
      const data = JSON.parse(saved);
      const now = Date.now();
      const oneDay = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
      
      // Check if data is from today (within 24 hours)
      if (data.timestamp && (now - data.timestamp) < oneDay) {
        counts = data.counts || { Focus: 0, Quick: 0, Deep: 0 };
        focusHistory = data.focusHistory || [];
        return true;
      }
    } catch (error) {
      console.log('Error loading from localStorage:', error);
    }
  }
  return false;
}

function clearLocalStorage() {
  localStorage.removeItem('postureHelperData');
}

// Check if this is a page refresh or new session
function isPageRefresh() {
  return sessionStorage.getItem('pageRefreshed') === 'true';
}

function markPageAsRefreshed() {
  sessionStorage.setItem('pageRefreshed', 'true');
}

// Language functions
function getTranslation(key) {
  const keys = key.split('.');
  let value = translations[currentLanguage];
  
  for (const k of keys) {
    if (value && value[k]) {
      value = value[k];
    } else {
      // Fallback to English if translation not found
      value = translations.en;
      for (const fallbackKey of keys) {
        value = value[fallbackKey];
      }
      break;
    }
  }
  
  return value || key;
}

function updateLanguage() {
  // Update all elements with data-i18n attribute
  document.querySelectorAll('[data-i18n]').forEach(element => {
    const key = element.getAttribute('data-i18n');
    const translation = getTranslation(key);
    if (translation) {
      element.textContent = translation;
    }
  });
  
  // Update placeholders
  document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
    const key = element.getAttribute('data-i18n-placeholder');
    const translation = getTranslation(key);
    if (translation) {
      element.placeholder = translation;
    }
  });
  
  // Update language button text
  const languageText = document.querySelector('.language-text');
  if (languageText) {
    languageText.textContent = currentLanguage.toUpperCase();
  }
  
  // Reload focus history with new language
  loadFocusHistory();
  
  // Save language preference
  localStorage.setItem('postureHelperLanguage', currentLanguage);
}

function toggleLanguage() {
  currentLanguage = currentLanguage === 'en' ? 'es' : 'en';
  updateLanguage();
}

// Load language preference
function loadLanguagePreference() {
  const savedLanguage = localStorage.getItem('postureHelperLanguage');
  if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'es')) {
    currentLanguage = savedLanguage;
  }
  updateLanguage();
}

// Theme functions
function toggleTheme() {
  currentTheme = currentTheme === 'light' ? 'dark' : 'light';
  updateTheme();
}

function updateTheme() {
  const body = document.body;
  const themeIcon = document.querySelector('.theme-icon');
  
  if (currentTheme === 'dark') {
    body.classList.add('dark-theme');
    themeIcon.textContent = '🌙';
  } else {
    body.classList.remove('dark-theme');
    themeIcon.textContent = '☀️';
  }
  
  // Update progress ring color
  updateDisplay();
  
  // Save theme preference
  localStorage.setItem('postureHelperTheme', currentTheme);
}

function loadThemePreference() {
  const savedTheme = localStorage.getItem('postureHelperTheme');
  if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
    currentTheme = savedTheme;
  }
  updateTheme();
}

// Initialize data on page load
if (isPageRefresh()) {
  // This is a refresh, load data from localStorage
  loadFromLocalStorage();
  loadFocusHistory();
} else {
  // This is a new session, clear localStorage and start fresh
  clearLocalStorage();
  counts = { Focus: 0, Quick: 0, Deep: 0 };
  focusHistory = [];
}

updateSessionSummary();
markPageAsRefreshed(); // Mark for next potential refresh
loadLanguagePreference(); // Load and apply language preference
loadThemePreference(); // Load and apply theme preference

// Assign events to mode buttons
modeButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    if (isRunning) return;

    modeButtons.forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');

    const minutes = parseInt(btn.dataset.time);
    currentTime = originalTime = minutes * 60;
    currentMode = btn.dataset.name;

    updateDisplay();
    updateSessionSummary();
    saveToLocalStorage(); // Save when mode changes
  });
});

// Updates timer display and progress bar
function updateDisplay() {
  const minutes = String(Math.floor(currentTime / 60)).padStart(2, '0');
  const seconds = String(currentTime % 60).padStart(2, '0');

  timeDisplay.textContent = `${minutes}:${seconds}`;

  const progress = ((originalTime - currentTime) / originalTime) * 360;
  const bgColor = currentTheme === 'dark' ? '#404040' : '#f5f2ed';
  const progressColor = currentTheme === 'dark' ? '#3b82f6' : 'rgb(0, 0, 0)';
  progressRing.style.background = `conic-gradient(${progressColor} ${progress}deg, ${bgColor} ${progress}deg)`;
}

// Updates total completed sessions
function updateSessionCount() {
  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  sessionCount.textContent = total;
}

// Updates statistics by session type
function updateStats() {
  $('focus-count').textContent = counts.Focus;
  $('quick-count').textContent = counts.Quick;
  $('deep-count').textContent = counts.Deep;
  $('total-count').textContent = Object.values(counts).reduce(
    (a, b) => a + b,
    0
  );
}

// Refreshes all statistics
function updateSessionSummary() {
  updateSessionCount();
  updateStats();
}

// Toggles between start and pause timer
function toggleTimer() {
  isRunning ? pauseTimer() : startTimer();
}

// Starts the timer
function startTimer() {
  isRunning = true;
  controlBtn.textContent = getTranslation('controls.pause');
  controlBtn.classList.add('pause');

  interval = setInterval(() => {
    currentTime--;
    updateDisplay();
    if (currentTime <= 0) completeSession();
  }, 1000);
}

// Pauses the timer
function pauseTimer() {
  isRunning = false;
  controlBtn.textContent = getTranslation('controls.start');
  controlBtn.classList.remove('pause');
  clearInterval(interval);
}

// Completes current session
function completeSession() {
  isRunning = false;
  clearInterval(interval);

  counts[currentMode]++;
  updateSessionSummary();
  saveToLocalStorage(); // Save to localStorage
  showNotification();
  resetTimer();
}

// Resets timer according to active mode
function resetTimer() {
  const activeBtn = document.querySelector('.mode-btn.active');
  if (!activeBtn) return;

  const minutes = parseInt(activeBtn.dataset.time);
  currentTime = originalTime = minutes * 60;

  controlBtn.textContent = getTranslation('controls.start');
  controlBtn.classList.remove('pause');

  // Set progress ring color based on theme
  if (currentTheme === 'dark') {
    progressRing.style.background = 'conic-gradient(#3b82f6 0deg, #404040 0deg)';
  } else {
    progressRing.style.background = 'conic-gradient(#d4af8c 0deg, #f5f2ed 0deg)';
  }
  updateDisplay();
}

// Shows visual and audio notification when completing a session
function showNotification() {
  notification.classList.add('show');
  
  // Try to play the notification sound
  notificationSound.play().catch((error) => {
    console.log('Audio playback failed, using fallback:', error);
    // Fallback to Web Audio API beep
    playBeep();
  });
  
  // Also try to request notification permission for browser notifications
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
  }
}

// Manually hides visual notification
function acknowledgeReminder() {
  notification.classList.remove('show');
}

// Resets session counters and statistics
function resetSession() {
  pauseTimer();
  Object.keys(counts).forEach((key) => (counts[key] = 0));
  focusHistory = []; // Clear focus history too
  updateSessionSummary();
  clearLocalStorage(); // Clear localStorage
  resetTimer();
}

// Creates new focus item in history
function addFocusItem(text) {
  const li = document.createElement('li');

  const normalText = document.createTextNode(getTranslation('focusHistory.prefix'));
  const boldText = document.createElement('span');
  boldText.style.fontWeight = 'bold';
  boldText.textContent = text;

  li.appendChild(normalText);
  li.appendChild(boldText);
  focusHistoryList.appendChild(li);
  
  // Add to focus history array and save to localStorage
  focusHistory.push(text);
  saveToLocalStorage();
}

// Load focus history from localStorage
function loadFocusHistory() {
  focusHistoryList.innerHTML = ''; // Clear current list
  focusHistory.forEach(text => {
    const li = document.createElement('li');

    const normalText = document.createTextNode(getTranslation('focusHistory.prefix'));
    const boldText = document.createElement('span');
    boldText.style.fontWeight = 'bold';
    boldText.textContent = text;

    li.appendChild(normalText);
    li.appendChild(boldText);
    focusHistoryList.appendChild(li);
  });
}

// Adds focus to history on Enter key press
focusInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    const value = focusInput.value.trim();
    if (value) {
      addFocusItem(value);
      focusInput.value = '';
    }
  }
});

// Event to start/pause timer
controlBtn.addEventListener('click', () => {
  // Initialize audio context on first user interaction
  if (window.audioContextInitialized !== true) {
    window.audioContextInitialized = true;
    // This ensures audio can play after user interaction
  }
  toggleTimer();
});

// Event to reset statistics
$('reset-btn').addEventListener('click', resetSession);

// Event to toggle language
$('language-toggle').addEventListener('click', toggleLanguage);

// Event to toggle theme
$('theme-toggle').addEventListener('click', toggleTheme);

// Manually closes notification
closeBtn.addEventListener('click', () => {
  notification.classList.remove('show');
});

// Note: localStorage persistence is handled automatically
// Data persists on refresh but resets on new page session

// Emits beep sound with Web Audio API
function playBeep() {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.type = 'sine';
  oscillator.frequency.value = 800;
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  gainNode.gain.setValueAtTime(0.5, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(
    0.01,
    audioContext.currentTime + 0.5
  );

  oscillator.start();
  oscillator.stop(audioContext.currentTime + 0.5);
}

// Shows sound alert, vibration and popup message
function showAlert(message) {
  playBeep();
  if (navigator.vibrate) navigator.vibrate(200);
  alert(message);
}

// Action when timer ends (currently unused)
function onTimerEnd() {
  showAlert("Time's up! 🧘‍♀️\nCheck your posture and take a break.");
}
