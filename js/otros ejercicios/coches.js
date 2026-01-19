function Coche(marca, color){
    this.marca = marca
    this.color = color
    this.arrancar = function (){
        console.log(`Arrancando un coche de marca ${marca} y de color ${color}`)
    }
}

let coche1 = new Coche("seat", "rojo")
let coche2 = new Coche("ford", "amarillo")
let coche3 = new Coche("ferrari", "rosa")

let arrayCoches = [coche1, coche2, coche3]
localStorage.setItem("coches", JSON.stringify(arrayCoches));

let coches = JSON.parse(localStorage.getItem("coches"))

for(let i = 0; i < coches.length; i++)
{
    let newCoche = new Coche(coches[i].marca, coches[i].color)
    newCoche.arrancar();
}

