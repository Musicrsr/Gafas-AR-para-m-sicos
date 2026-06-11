// ==========================================================================
// CONTROLADOR INTERACTIVO DEL CARRUSEL (CON DETENCIÓN POR HOVER Y FLECHAS DINÁMICAS)
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
  const carouselContainer = document.querySelector(".carousel-container");
  const slides = document.querySelectorAll(".carousel-item");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  
  let currentSlideIndex = 0;
  let autoPlayTimer = null; 
  let isPaused = false; // Variable de control para saber si el carrusel está pausado
  const timePerSlide = 5000; // 5 segundos

  if (slides.length > 0 && prevBtn && nextBtn && carouselContainer) {
    
    // Función para animar la barra de progreso de la diapositiva activa
    function animateProgressBar() {
      const currentFill = slides[currentSlideIndex].querySelector(".progress-fill");
      if (!currentFill) return;
      
      currentFill.style.animation = 'none';
      currentFill.offsetHeight; // Truco de reflow para reiniciar renderizado
      
      // Si está pausado por el ratón, la barra no debe arrancar la animación
      if (isPaused) {
        currentFill.style.width = '0%';
        return;
      }
      
      currentFill.style.animation = `fillBar ${timePerSlide}ms linear forwards`;
    }

    // Función para congelar visualmente la barra de progreso en su estado actual al pausar
    function freezeProgressBar() {
      const currentFill = slides[currentSlideIndex].querySelector(".progress-fill");
      if (!currentFill) return;
      
      // Obtenemos el ancho actual exacto en píxeles que llevaba acumulado la barra
      const computedWidth = window.getComputedStyle(currentFill).width;
      currentFill.style.animation = 'none';
      currentFill.style.width = computedWidth; // Mantiene la barra fija donde se quedó
    }

    function changeSlide(targetIndex) {
      const currentFill = slides[currentSlideIndex].querySelector(".progress-fill");
      if (currentFill) {
        currentFill.style.animation = 'none';
        currentFill.style.width = '0%';
      }

      slides[currentSlideIndex].classList.remove("active");
      
      if (targetIndex >= slides.length) {
        currentSlideIndex = 0;
      } else if (targetIndex < 0) {
        currentSlideIndex = slides.length - 1;
      } else {
        currentSlideIndex = targetIndex;
      }
      
      slides[currentSlideIndex].classList.add("active");
      animateProgressBar();
    }

    function nextSlideAuto() {
      changeSlide(currentSlideIndex + 1);
    }

    // Arranca el bucle de tiempo
    function startAutoPlay() {
      isPaused = false;
      animateProgressBar();
      // Solo creamos el intervalo si no existe uno previo
      if (!autoPlayTimer) {
        autoPlayTimer = setInterval(nextSlideAuto, timePerSlide);
      }
    }

    // Detiene por completo el bucle de tiempo
    function stopAutoPlay() {
      isPaused = true;
      clearInterval(autoPlayTimer);
      autoPlayTimer = null; // Vaciamos la referencia
      freezeProgressBar();
    }

    // Eventos manuales de los botones (Fuerzan el salto y reinician la espera)
    prevBtn.addEventListener("click", () => {
      changeSlide(currentSlideIndex - 1);
      if (!isPaused) {
        clearInterval(autoPlayTimer);
        autoPlayTimer = setInterval(nextSlideAuto, timePerSlide);
      }
    });
    
    nextBtn.addEventListener("click", () => {
      changeSlide(currentSlideIndex + 1);
      if (!isPaused) {
        clearInterval(autoPlayTimer);
        autoPlayTimer = setInterval(nextSlideAuto, timePerSlide);
      }
    });

    // --- NUEVO: Gestión de parada y reanudación mediante Mouse (Hover) ---
    carouselContainer.addEventListener("mouseenter", () => {
      stopAutoPlay(); // Al meter el ratón, se detiene el avance y la barra se congela
    });

    carouselContainer.addEventListener("mouseleave", () => {
      startAutoPlay(); // Al sacar el ratón, se vuelve a activar y la barra continúa desde cero
    });

    // Encendido inicial de la automatización
    startAutoPlay();
  }
});

// ==========================================================================
// VISOR DE COLORES INTERACTIVO
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
  const colorButtons = document.querySelectorAll(".color-btn");
  const activeColorImg = document.getElementById("activeColorImg");

  if (colorButtons.length > 0 && activeColorImg) {
    colorButtons.forEach(button => {
      button.addEventListener("click", () => {
        // 1. Evitar hacer algo si el botón ya está activo
        if (button.classList.contains("active")) return;

        // 2. Actualizar estado visual de los botones
        colorButtons.forEach(btn => btn.classList.remove("active"));
        button.classList.add("active");

        // 3. Aplicar efecto fade-out a la imagen actual
        activeColorImg.classList.add("fade-out");

        // 4. Cambiar la imagen a la mitad de la transición
        setTimeout(() => {
          const newImageSrc = button.getAttribute("data-image");
          const newColorName = button.getAttribute("data-color");
          
          activeColorImg.src = newImageSrc;
          activeColorImg.alt = `Samsung ScoreFlow Glasses Pro en ${newColorName}`;
          
          // Quitar el fade-out para que aparezca la nueva
          activeColorImg.classList.remove("fade-out");
        }, 200); // 200ms coincide con la mitad del tiempo de la transición CSS
      });
    });
  }
});

// ==========================================================================
// REPRODUCCIÓN INTELIGENTE DE VÍDEO AL HACER SCROLL (INTERSECTION OBSERVER)
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
  const videoElement = document.getElementById("scoreflowVideo");

  if (videoElement) {
    // Configuramos los límites de la observación
    const observerOptions = {
      root: null, // Observa el viewport (pantalla) completo
      rootMargin: "0px",
      threshold: 0.5 // 0.5 significa que se activará cuando al menos el 50% del vídeo sea visible
    };

    const videoObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // El vídeo entra en pantalla -> Reproducir
          videoElement.play().catch(error => {
            console.log("El navegador requiere interacción previa para reproducir vídeo:", error);
          });
        } else {
          // El vídeo sale de la pantalla -> Pausar
          videoElement.pause();
        }
      });
    }, observerOptions);

    // Arrancamos la vigilancia sobre nuestro vídeo
    videoObserver.observe(videoElement);
  }
});