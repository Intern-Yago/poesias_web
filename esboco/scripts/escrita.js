x = 0
function typeWrite(elemento) {
    const textoArray = elemento.innerHTML.split('');
    elemento.innerHTML = '';
    textoArray.forEach((letra, i) => {
      if(letra == "." && x ==0){
        letra = ". <br>" 
        x++
      }
      setTimeout(() => elemento.innerHTML += letra, 75 * i);
    });
  }

const titulo = document.getElementsByClassName("titulo")
typeWrite(...titulo)

