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

  const resp = await axios.get(URI);
  const xmlData = resp.data.data;
  if (xmlData) {
    // America
    const dataItem1  = xmlData[0].title;
    
    document.getElementById('title1').innerHTML = dataItem1;
  }
}
