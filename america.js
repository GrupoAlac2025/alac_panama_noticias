const URI = "https://servweb.medcom.com.pa/ords/titulares/ciudad-informada/titulares";
var content = document.getElementById('contenido');
var content2 = document.getElementById('contenido2');
var content3 = document.getElementById('contenido3');
var bgVideo = document.getElementById('bg-video');
var titularesCargados = [];

function showRandomHeadline() {
  if (!Array.isArray(titularesCargados) || titularesCargados.length === 0) return;

  const previousTitle = localStorage.getItem('lastHeadline');
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
    localStorage.setItem('lastHeadline', dataItem1);
  }
}

function syncWithVideo() {
  if (!bgVideo) {
    content.style.display = "none";
    content2.style.display = "block";
    content3.style.display = "none";
    return;
  }

  let showedInCurrentLoop = false;

  bgVideo.addEventListener('timeupdate', () => {
    if (bgVideo.currentTime >= 3) {
      if (!showedInCurrentLoop) {
        showedInCurrentLoop = true;
      }
      content.style.display = "none";
      content2.style.display = "block";
      content3.style.display = "none";
    } else {
      if (showedInCurrentLoop) {
        showedInCurrentLoop = false;
        showRandomHeadline();
      }
      content.style.display = "block";
      content2.style.display = "none";
      content3.style.display = "none";
    }
  });
}

async function init() {
  syncWithVideo();
  await getUser();
}

init();

async function getUser() {
  try {
    const resp = await axios.get(URI);
    const titulares = resp.data.data;

    if (Array.isArray(titulares) && titulares.length > 0) {
      titularesCargados = titulares;
      showRandomHeadline();
    }
  } catch (error) {
    console.error('No se pudo cargar el titular:', error);
  }
}
