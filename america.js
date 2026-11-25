const URI = "https://servweb.medcom.com.pa/ords/titulares/ciudad-informada/titulares";
var content = document.getElementById('contenido');
var content2 = document.getElementById('contenido2');
var content3 = document.getElementById('contenido3');

async function init() {
  await getUser();
  setTimeout(() => {
    content.style.display = "block";
    content2.style.display = "none";
    content3.style.display = "none";
  }, 0);
  setTimeout(() => {
    content.style.display = "none";
    content2.style.display = "block";
    content3.style.display = "none";
  }, 3000);
  setTimeout(() => {
    content.style.display = "none";
    content3.style.display = "block";
    content2.style.display = "none";
  }, 7500);
}

init();
async function getUser(){
  try {
    const resp = await axios.get(URI);
    const titulares = resp.data.data;

    if (Array.isArray(titulares) && titulares.length > 0) {
      const previousTitle = localStorage.getItem('lastHeadline');
      const availableTitulares = titulares.filter((item) =>
        item.title && item.title !== previousTitle
      );
      const titularesParaRotar = availableTitulares.length > 0
        ? availableTitulares
        : titulares.filter((item) => item.title);

      if (titularesParaRotar.length > 0) {
        const randomIndex = Math.floor(Math.random() * titularesParaRotar.length);
        const dataItem1 = titularesParaRotar[randomIndex].title;

        document.getElementById('title1').textContent = dataItem1;
        localStorage.setItem('lastHeadline', dataItem1);
      }
    }
  } catch (error) {
    console.error('No se pudo cargar el titular:', error);
  }
}
