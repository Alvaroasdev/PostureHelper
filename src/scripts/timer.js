// Variables de estado
let currentTime = 20 * 60;
let originalTime = 20 * 60;
let isRunning = false;
let interval;
let currentMode = 'Focus';

// Conteo de sesiones por tipo
const counts = { Focus: 0, Quick: 0, Deep: 0 };

// Atajos para elementos del DOM
const $ = (id) => document.getElementById(id);
const timeDisplay = $('time-display');
const controlBtn = $('control-btn');
const progressRing = $('progress-ring');
const notification = $('notification');
const sessionCount = $('session-count');
const modeButtons = document.querySelectorAll('.mode-btn');
const focusInput = $('focus-input');
const focusHistoryList = $('focus-history-list');
const notificationSound = new Audio('/src/assets/sounds/ding.mp3');
const closeBtn = $('closeBtn');

notificationSound.volume = 1.0;

// Asignar eventos a botones de modo
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
  });
});

// Actualiza la visualización del temporizador y la barra de progreso
function updateDisplay() {
  const minutes = String(Math.floor(currentTime / 60)).padStart(2, '0');
  const seconds = String(currentTime % 60).padStart(2, '0');

  timeDisplay.textContent = `${minutes}:${seconds}`;

  const progress = ((originalTime - currentTime) / originalTime) * 360;
  progressRing.style.background = `conic-gradient(rgb(0, 0, 0) ${progress}deg, #f0f0f0 ${progress}deg)`;
}

// Actualiza el total de sesiones realizadas
function updateSessionCount() {
  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  sessionCount.textContent = total;
}

// Actualiza las estadísticas por tipo de sesión
function updateStats() {
  $('focus-count').textContent = counts.Focus;
  $('quick-count').textContent = counts.Quick;
  $('deep-count').textContent = counts.Deep;
  $('total-count').textContent = Object.values(counts).reduce(
    (a, b) => a + b,
    0
  );
}

// Refresca todas las estadísticas
function updateSessionSummary() {
  updateSessionCount();
  updateStats();
}

// Cambia entre iniciar y pausar el temporizador
function toggleTimer() {
  isRunning ? pauseTimer() : startTimer();
}

// Inicia el temporizador
function startTimer() {
  isRunning = true;
  controlBtn.textContent = 'Pause';
  controlBtn.classList.add('pause');

  interval = setInterval(() => {
    currentTime--;
    updateDisplay();
    if (currentTime <= 0) completeSession();
  }, 1000);
}

// Pausa el temporizador
function pauseTimer() {
  isRunning = false;
  controlBtn.textContent = 'Start';
  controlBtn.classList.remove('pause');
  clearInterval(interval);
}

// Finaliza la sesión actual
function completeSession() {
  isRunning = false;
  clearInterval(interval);

  counts[currentMode]++;
  updateSessionSummary();
  showNotification();
  resetTimer();
}

// Resetea el temporizador según el modo activo
function resetTimer() {
  const activeBtn = document.querySelector('.mode-btn.active');
  if (!activeBtn) return;

  const minutes = parseInt(activeBtn.dataset.time);
  currentTime = originalTime = minutes * 60;

  controlBtn.textContent = 'Start';
  controlBtn.classList.remove('pause');

  progressRing.style.background =
    'conic-gradient(#d4af8c 0deg, rgb(0, 0, 0) 0deg)';
  updateDisplay();
}

// Muestra notificación visual y sonora al completar una sesión
function showNotification() {
  notification.classList.add('show');
  notificationSound.play().catch(() => {});
}

// Oculta manualmente la notificación visual
function acknowledgeReminder() {
  notification.classList.remove('show');
}

// Reinicia los contadores de sesiones y estadísticas
function resetSession() {
  pauseTimer();
  Object.keys(counts).forEach((key) => (counts[key] = 0));
  updateSessionSummary();
  resetTimer();
}

// Crea un nuevo elemento en el historial de focos
function addFocusItem(text) {
  const li = document.createElement('li');

  const normalText = document.createTextNode('Has enfocado en: ');
  const boldText = document.createElement('span');
  boldText.style.fontWeight = 'bold';
  boldText.textContent = text;

  li.appendChild(normalText);
  li.appendChild(boldText);
  focusHistoryList.appendChild(li);
}

// Añade foco al historial al pulsar Enter
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

// Evento para iniciar/pausar temporizador
controlBtn.addEventListener('click', toggleTimer);

// Evento para resetear estadísticas
$('reset-btn').addEventListener('click', resetSession);

// Cierra manualmente la notificación
closeBtn.addEventListener('click', () => {
  notification.classList.remove('show');
});

// Emite un sonido beep con Web Audio API
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

// Muestra alerta sonora, vibración y mensaje emergente
function showAlert(message) {
  playBeep();
  if (navigator.vibrate) navigator.vibrate(200);
  alert(message);
}

// Acción al finalizar temporizador (sin uso actualmente)
function onTimerEnd() {
  showAlert('¡Tiempo terminado! 🧘‍♀️\nRevisa tu postura y toma un descanso.');
}
