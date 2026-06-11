// CONTROLADOR DE BOTONES DE COLOR (SWATCHES)
const swatchButtons = document.querySelectorAll(".swatch-btn");
const productImage = document.querySelector("#productImage");
const addToCart = document.querySelector("#addToCart");
const buyNow = document.querySelector("#buyNow");
const detailStatus = document.querySelector("#detailStatus");
const selectedColorName = document.querySelector("#selectedColorName");

// Estado global del color seleccionado (por defecto Negro Grafito)
let currentSelectedColor = "Negro Grafito";

function selectedColor() {
  return currentSelectedColor;
}

if (swatchButtons.length > 0) {
  swatchButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      // 1. Evitar re-ejecución si ya está activo
      if (btn.classList.contains("active")) return;

      // 2. Intercambiar la clase activa visualmente
      swatchButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      // 3. Extraer los datos del botón pulsado
      currentSelectedColor = btn.getAttribute("data-color");
      const newImageSrc = btn.getAttribute("data-image");

      // 4. Actualizar textos e imágenes en la interfaz
      if (selectedColorName) selectedColorName.textContent = currentSelectedColor;
      
      if (productImage) {
        productImage.src = newImageSrc;
        productImage.alt = `Samsung ScoreFlow Glasses Pro en color ${currentSelectedColor}`;
      }
    });
  });
}

const metronome = {
  audio: null,
  timer: null,
  beat: 0,
  playing: false,
};

addToCart.addEventListener("click", () => {
  alert(`Producto guardado en tu lista de favoritos. Cuando se abran las configuraciones ópticas personalizadas, ¡serás el primero en saberlo!.`);
  detailStatus.textContent = `Se ha añadido con éxito Samsung ScoreFlow Glasses Pro en ${selectedColor()} a tu lista de favoritos. ¡Pronto recibirás más noticias!`;
});

buyNow.addEventListener("click", () => {
  detailStatus.textContent = `Gracias por hacer tu reserva de las Samsung ScoreFlow Glasses Pro en ${selectedColor()}. ¡Pronto recibirás más noticias!.`;
  alert(`¡Gracias por tu interés! Has iniciado el proceso de reserva para las Samsung ScoreFlow Glasses Pro en color ${selectedColor()}. Te enviaremos los detalles de prioridad de fabricación a tu correo.`);
});

function currentBpm() {
  return Number(bpmRange.value);
}

function currentMeter() {
  return Number(meterSelect.value);
}

function updateBpm(value) {
  const bpm = Math.min(220, Math.max(40, Number(value)));
  bpmRange.value = bpm;
  bpmOutput.value = bpm;
  if (metronome.playing) {
    restartMetronome();
  }
}

function renderBeatDots() {
  const meter = currentMeter();
  beatDots.innerHTML = "";
  beatDots.style.gridTemplateColumns = `repeat(${meter}, 1fr)`;
  for (let index = 0; index < meter; index += 1) {
    const dot = document.createElement("span");
    dot.className = index === 0 ? "beat-dot accent" : "beat-dot";
    beatDots.append(dot);
  }
  metronome.beat = 0;
}

function flashBeat(index) {
  const dots = [...beatDots.querySelectorAll(".beat-dot")];
  dots.forEach((dot) => dot.classList.remove("active"));
  dots[index]?.classList.add("active");
}

function getAudioContext() {
  if (!metronome.audio) {
    metronome.audio = new AudioContext();
  }
  return metronome.audio;
}

function playClick(isAccent) {
  const audio = getAudioContext();
  const oscillator = audio.createOscillator();
  const gain = audio.createGain();
  const now = audio.currentTime;
  const volume = Number(volumeRange.value) / 100;

  oscillator.frequency.value = isAccent ? 1120 : 760;
  oscillator.type = "sine";
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(Math.max(0.0001, volume * 0.28), now + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.09);
  oscillator.connect(gain);
  gain.connect(audio.destination);
  oscillator.start(now);
  oscillator.stop(now + 0.1);
}

function tick() {
  const meter = currentMeter();
  const beatIndex = metronome.beat % meter;
  const isAccent = beatIndex === 0;
  playClick(isAccent);
  flashBeat(beatIndex);
  metronomeStatus.textContent = `Pulso ${beatIndex + 1} de ${meter} a ${currentBpm()} BPM.`;
  metronome.beat += 1;
}

function startMetronome() {
  metronome.playing = true;
  toggleMetronome.textContent = "Parar metrónomo";
  tick();
  metronome.timer = window.setInterval(tick, 60000 / currentBpm());
}

function stopMetronome() {
  metronome.playing = false;
  window.clearInterval(metronome.timer);
  metronome.timer = null;
  toggleMetronome.textContent = "Iniciar metrónomo";
  metronomeStatus.textContent = "Metrónomo detenido.";
  beatDots.querySelectorAll(".beat-dot").forEach((dot) => dot.classList.remove("active"));
}

function restartMetronome() {
  stopMetronome();
  startMetronome();
}


bpmRange.addEventListener("input", () => updateBpm(bpmRange.value));
decreaseBpm.addEventListener("click", () => updateBpm(currentBpm() - 1));
increaseBpm.addEventListener("click", () => updateBpm(currentBpm() + 1));
meterSelect.addEventListener("change", () => {
  renderBeatDots();
  if (metronome.playing) {
    restartMetronome();
  }
});
toggleMetronome.addEventListener("click", () => {
  if (metronome.playing) {
    stopMetronome();
    return;
  }
  startMetronome();
});

renderBeatDots();
updateBpm(bpmRange.value);

// ==========================================================================
// LÓGICA DEL RELOJ CUENTA ATRÁS (LANZAMIENTO: 5 DE ENERO DE 2027)
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
  // Establecemos la fecha objetivo exacta
  const targetDate = new Date("January 5, 2027 00:00:00").getTime();

  // Seleccionamos los nodos del DOM
  const daysSpan = document.getElementById("countdown-days");
  const hoursSpan = document.getElementById("countdown-hours");
  const minutesSpan = document.getElementById("countdown-minutes");
  const secondsSpan = document.getElementById("countdown-seconds");
  const countdownTitle = document.querySelector(".countdown-title");

  function updateCountdown() {
    const now = new Date().getTime();
    const difference = targetDate - now;

    // Si la fecha límite ya ha pasado
    if (difference <= 0) {
      clearInterval(countdownInterval);
      if (daysSpan) daysSpan.textContent = "00";
      if (hoursSpan) hoursSpan.textContent = "00";
      if (minutesSpan) minutesSpan.textContent = "00";
      if (secondsSpan) secondsSpan.textContent = "00";
      if (countdownTitle) countdownTitle.textContent = "¡Ya disponible!";
      return;
    }

    // Cálculos de tiempo para Días, Horas, Minutos y Segundos
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    // Inyectamos los valores formateados con dos dígitos
    if (daysSpan) daysSpan.textContent = String(days).padStart(2, "0");
    if (hoursSpan) hoursSpan.textContent = String(hours).padStart(2, "0");
    if (minutesSpan) minutesSpan.textContent = String(minutes).padStart(2, "0");
    if (secondsSpan) secondsSpan.textContent = String(seconds).padStart(2, "0");
  }

  // Refrescamos el reloj de inmediato para evitar el parpadeo de "00" inicial
  updateCountdown();
  // Creamos el intervalo de actualización cada segundo
  const countdownInterval = setInterval(updateCountdown, 1000);
});