let temp1 = setInterval(miFuncion, 1000)
let divContador = document.getElementById("contador")
let contador = 0

function miFuncion(){
    contador += 1
    divContador.innerHTML = contador;
}

let botonIniciar = document.getElementById("iniciar")
botonIniciar.addEventListener("click", () => {
    temp1 = setInterval(miFuncion, 1000)
})

let botonPausar = document.getElementById("pausar")
botonPausar.addEventListener("click", () => clearInterval(temp1))

let botonReiniciar = document.getElementById("reiniciar")
botonReiniciar.addEventListener("click", () => {
    contador = 0
    divContador.innerHTML = contador;
})