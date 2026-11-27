const URI = "https://servweb.medcom.com.pa/ords/titulares/ciudad-informada/titulares";
var content = document.getElementById('contenido');
var content2 = document.getElementById('contenido2');
var content3 = document.getElementById('contenido3');
var bgVideo = document.getElementById('bg-video');
var titularesCargados = [];

function getLastHeadline() {
  try {
    return localStorage.getItem('lastHeadline');
  } catch (e) {
    return null;
  }
}

function setLastHeadline(value) {
  try {
    localStorage.setItem('lastHeadline', value);
  } catch (e) {
    // Ignore storage errors in restricted environments
  }
}

function showHeadlineLayer() {
  content.style.display = "none";
  content2.style.display = "block";
  content3.style.display = "none";
}

function hideHeadlineLayer() {
  content.style.display = "block";
  content2.style.display = "none";
  content3.style.display = "none";
}

function showRandomHeadline() {
  if (!Array.isArray(titularesCargados) || titularesCargados.length === 0) return;

  const previousTitle = getLastHeadline();
  const availableTitulares = titularesCargados.filter((item) =>
    item.title && item.title !== previousTitle
  );
  const titularesParaRotar = availableTitulares.length > 0
    ? availableTitulares
    : titularesCargados.filter((item) => item.title);

  if (titularesParaRotar.length > 0) {
    const randomIndex = Math.floor(Math.random() * titularesParaRotar.length);
    const dataItem1 = titularesParaRotar[randomIndex].title;

    document.getElementById('title1').textContent = dataItem1;
    setLastHeadline(dataItem1);
  }
}

function syncWithVideo() {
  if (!bgVideo) {
    showHeadlineLayer();
    return;
  }

  let showedInCurrentLoop = false;
  let videoTimeUpdated = false;

  bgVideo.muted = true;
  bgVideo.play().catch(() => {
    showHeadlineLayer();
  });

  bgVideo.addEventListener('timeupdate', () => {
    videoTimeUpdated = true;
    if (bgVideo.currentTime >= 3) {
      if (!showedInCurrentLoop) {
        showedInCurrentLoop = true;
      }
      showHeadlineLayer();
    } else {
      if (showedInCurrentLoop) {
        showedInCurrentLoop = false;
        showRandomHeadline();
      }
      hideHeadlineLayer();
    }
  });

  // Fallback si el video no emite timeupdate o está pausado
  setTimeout(() => {
    if (!videoTimeUpdated || bgVideo.paused) {
      showHeadlineLayer();
    }
  }, 3000);
}

async function preloadFonts() {
  if (document.fonts && document.fonts.load) {
    try {
      await document.fonts.load('1em COCOGOOSE');
      await document.fonts.ready;
    } catch (e) {
      // Ignorar errores de carga de fuente
    }
  }
}

async function init() {
  preloadFonts();
  syncWithVideo();
  await getUser();
}

init();

async function getUser() {
  try {
    const response = await fetch(URI);
    if (!response.ok) {
      throw new Error('HTTP ' + response.status);
    }
    const json = await response.json();
    const titulares = json.data;

    if (Array.isArray(titulares) && titulares.length > 0) {
      titularesCargados = titulares;
      showRandomHeadline();
    }
  } catch (error) {
    console.error('No se pudo cargar el titular:', error);
  }
}
