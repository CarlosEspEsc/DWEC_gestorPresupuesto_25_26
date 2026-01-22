import * as gestionPresupuesto from "./gestionPresupuesto.js"
import * as Utils from "./jsUtils.js"

function mostrarDatoEnId(idElemento, valor){
    let elem = document.getElementById(idElemento)
    if( elem != null || elem!= undefined)
    {
        Element.textContent = ""
        elem.textContent = valor
    }
    else

    console.log(`La función mostrarDatoEnId con idElemento + ${idElemento} y valor ${valor} ha fallado`)
}
function mostrarGastoWeb(idElemento, gastos){
    let elem = document.getElementById(idElemento)

    for(let gasto of gastos)
    {
        let divGasto = Utils.divWithClass("gasto")
        elem.append(divGasto)
        let divDes = Utils.divWithClass("gasto-descripcion")
        divDes.textContent = gasto.descripcion;
        divGasto.append(divDes)
        let divFec = Utils.divWithClass("gasto-fecha")
        let fechaFormateada = new Date(gasto.fecha).toLocaleDateString()
        divFec.textContent = fechaFormateada
        divGasto.append(divFec)
        let divVal = Utils.divWithClass("gasto-valor")
        divVal.textContent = gasto.valor
        divGasto.append(divVal)
        let divEti = Utils.divWithClass("gasto-etiquetas")
        divGasto.append(divEti)
        for(let etiqueta of gasto.etiquetas)
        {
            if(gasto.etiquetas[0] == "" && gasto.etiquetas.length == 1)
                continue    
            let objManejadorEtiquetas = new BorrarEtiquetasHandle()
            objManejadorEtiquetas.gasto = gasto;
            let span = Utils.elementWithClass("span", "gasto-etiquetas-etiqueta")
            span.textContent = etiqueta
            objManejadorEtiquetas.etiqueta = etiqueta
            span.addEventListener("click", objManejadorEtiquetas)
            divEti.append(span)
            let br = document.createElement("br")
            divEti.append(br)
        }
        let botonEditarGasto = Utils.buttonWithClass("gasto-editar")
        botonEditarGasto.innerText = "Editar"
        let objManejadorEdicion = new EditarHandle()
        objManejadorEdicion.gasto = gasto
        botonEditarGasto.addEventListener("click", objManejadorEdicion)
        divEti.append(botonEditarGasto)
        let botonBorrarGasto = Utils.buttonWithClass("gasto-borrar")
        botonBorrarGasto.innerText = "Borrar"
        let objManejadorBorrado = new BorrarHandle()
        objManejadorBorrado.gasto = gasto
        botonBorrarGasto.addEventListener("click", objManejadorBorrado)
        divEti.append(botonBorrarGasto)
        let botonBorrarAPI = Utils.buttonWithClass("gasto-borrar-api")
        botonBorrarAPI.setAttribute("type", "click")
        botonBorrarAPI.innerText = "Borrar (API)"
        let objManejadorBorradoAPI = new BorrarAPI()
        objManejadorBorradoAPI.gasto = gasto
        botonBorrarAPI.addEventListener("click", objManejadorBorradoAPI)
        divEti.append(botonBorrarAPI)
        let botonEditarFormulario = Utils.buttonWithClass("gasto-editar-formulario")
        botonEditarFormulario.setAttribute("type", "click")
        botonEditarFormulario.innerText = "Editar (formulario)"
        let objManEdiFor = new EditarHandleFormulario();
        objManEdiFor.gasto = gasto
        objManEdiFor.divGasto = divGasto
        botonEditarFormulario.addEventListener("click", objManEdiFor)
        divGasto.append(botonEditarFormulario)
    }
}
function  mostrarGastosAgrupadosWeb(idElemento, agrup, periodo){
    let elem = document.getElementById(idElemento)
    let divAgrup = Utils.divWithClass("agrupacion")
    elem.append(divAgrup)
    let titulo = document.createElement("h1")
    titulo.textContent = `Gastos agrupados por ${periodo}`
    divAgrup.append(titulo)
    for(const [clave, valor] of Object.entries(agrup))
    {
        let divAgrupGasto = Utils.divWithClass("agrupacion-dato")
        let spanClave = Utils.elementWithClass("span", "agrupacion-dato-clave")
        divAgrupGasto.append(spanClave)
        spanClave.textContent = clave
        let spanValor = Utils.elementWithClass("span", "agrupacion-dato-valor")
        divAgrupGasto.append(spanValor)
        spanValor.textContent = valor
        divAgrup.append(divAgrupGasto)
    }
}
function repintar(){
    mostrarDatoEnId("presupuesto", gestionPresupuesto.mostrarPresupuesto())
    mostrarDatoEnId("gastos-totales", gestionPresupuesto.calcularTotalGastos()) 
    mostrarDatoEnId("balance-total",  gestionPresupuesto.calcularBalance())
    let divFiltrado = document.getElementById("listado-gastos-filtrado-1")
    let divGastosCompletos = document.getElementById("listado-gastos-completo")
    divGastosCompletos.innerHTML = ""
    mostrarGastoWeb("listado-gastos-completo", gestionPresupuesto.listarGastos())
    let titulo = document.createElement("h1")
    titulo.innerText = "Gastos Filtrados"
    divFiltrado.append(titulo)
    let form = document.forms[0]
    if(form != undefined)
        form.remove()
}
function actualizarPresupuestoWeb(){
    let botonPresupuesto = document.getElementById("actualizarpresupuesto")
    let nuevoPresupuesto = {
        handleEvent : function(){
            let respuesta = prompt("ingrese su nuevo presupuesto")
            gestionPresupuesto.actualizarPresupuesto(parseInt(respuesta))
            repintar()
        }
    }
    botonPresupuesto.addEventListener("click", nuevoPresupuesto)
}
function nuevoGastoWeb(){
    let botonAnyadirGasto = document.getElementById("anyadirgasto")
    let gastoNuevo = {
        handleEvent : function(){
            let concepto = prompt("Ingrese un concepto general del gasto")
            let valorTotal = Number(prompt("Ingrese el valor total del gasto"))
            let fechaDelGasto = prompt("Ingrese la fecha del gasto (formato: yyyy-mm-dd)")
            let etiquetasGasto = prompt("Ingrese las referencias que quiere que contenga su gasto")
            let arrayEtiquetas = etiquetasGasto.split(",")
            let nuevoGasto = new gestionPresupuesto.CrearGasto(concepto, valorTotal, fechaDelGasto, arrayEtiquetas)
            gestionPresupuesto.anyadirGasto(nuevoGasto)
            repintar()
        }
    }
    botonAnyadirGasto.addEventListener("click", gastoNuevo)
}
function EditarHandle(){   
    this.handleEvent = function(e){
        let concepto = prompt("Ingrese un concepto general del gasto", `${this.gasto.descripcion}`)
        let valorTotal = Number(prompt("Ingrese el valor total del gasto",  `${this.gasto.valor}`))
        let fechaPrompt = Utils.formatDate(this.gasto.fecha)
        let fechaDelGasto = prompt("Ingrese la fecha del gasto (formato: yyyy-mm-dd)",  `${fechaPrompt}`)
        let etiquetasGasto = prompt("Ingrese las referencias que quiere que contenga su gasto",  `${this.gasto.etiquetas}`)
        let arrayEtiquetas = etiquetasGasto.split(",")
        this.gasto.actualizarDescripcion(concepto)
        this.gasto.actualizarValor(parseFloat(valorTotal))
        this.gasto.actualizarFecha(fechaDelGasto)
        this.gasto.borrarEtiquetas(...this.gasto.etiquetas)
        this.gasto.anyadirEtiquetas(...arrayEtiquetas)
        repintar()
        }
    }
function BorrarHandle()
{
    this.handleEvent = function(e){
        gestionPresupuesto.borrarGasto(this.gasto.id)
        repintar()
    }
}
function BorrarEtiquetasHandle(){
    this.handleEvent = function(e){
        this.gasto.borrarEtiquetas(this.etiqueta)
        repintar()  
    }
}


function EditarHandleFormulario(){
    this.handleEvent = function(e){
        let clonForm = document.getElementById("formulario-template").content.cloneNode(true);
        let formulario = clonForm.querySelector("form")
        this.divGasto.append(formulario)
        formulario.style="display:flex; flex-direction:column; flex-basis: 100%; "
        let elementosForm = formulario.getElementsByClassName("form-control")
        for(let div of elementosForm)
        {
            div.style="width:75%; align-content:center;"
        }
        let botonForm = this.divGasto.getElementsByClassName("gasto-editar-formulario")
        botonForm[0].setAttribute("disabled", "true")
        let botonEditarCancelar = formulario.getElementsByClassName("cancelar")
        botonEditarCancelar[0].addEventListener("click", (e)=>{
            e.preventDefault()
            let botonForm = this.divGasto.getElementsByClassName("gasto-editar-formulario")
            botonForm[0].removeAttribute("disabled")
            formulario.remove()
        })
        formulario[0].value = this.gasto.descripcion
        formulario[1].value = this.gasto.valor
        formulario[2].value = Utils.formatDate(this.gasto.fecha)
        formulario[3].value = this.gasto.etiquetas
        let botonCancel = this.divGasto.getElementsByClassName("cancelar")
        let objCancelar = new ManejaCancelar
        objCancelar.formulario = formulario
        botonCancel[0].addEventListener("click", objCancelar)
        formulario.addEventListener("submit", (e) => {
            e.preventDefault();
            this.gasto.actualizarDescripcion(formulario[0].value)
            this.gasto.actualizarValor(parseFloat(formulario[1].value))
            this.gasto.actualizarFecha(formulario[2].value)
            this.gasto.etiquetas = formulario[3].value.split(",")
            repintar()
        })
        let botonAñadirAPI = formulario.getElementsByClassName("gasto-enviar-api")
        let objEnviarAPI = new EnviarAPI()
        objEnviarAPI.formulario = formulario
        botonAñadirAPI[0].addEventListener("click", objEnviarAPI)
    }
}



function nuevoGastoWebFormulario(){    
    let botonAñadirForm = document.getElementById("anyadirgasto-formulario")
    botonAñadirForm.addEventListener("click", function(event){    
        let clonForm = document.getElementById("formulario-template").content.cloneNode(true);
        let divBotones = document.getElementById("controlesprincipales")
        let formulario = clonForm.querySelector("form")
        divBotones.append(formulario)
        formulario.addEventListener("submit", manejaSubmit)
        let botonEnviar = document.querySelector(`[type="submit"]`);
        botonEnviar.addEventListener("click", manejaSubmit)
        let botonCancelar = document.forms[0].getElementsByClassName("cancelar")
        let manejadorCancelar = new ManejaCancelar
        manejadorCancelar.formulario = formulario
        botonCancelar[0].addEventListener("click", manejadorCancelar)
        botonAñadirForm.setAttribute("disabled", "true")
        let botonAñadirAPI = formulario.getElementsByClassName("gasto-enviar-api")
        let objEnviarAPI = new EnviarAPI()
        objEnviarAPI.formulario = formulario
        botonAñadirAPI[0].addEventListener("click", objEnviarAPI)
    })
}
function ManejaCancelar(event){
    this.handleEvent=function(e){
        let botonAñadirForm = document.getElementById("anyadirgasto-formulario")
        botonAñadirForm.removeAttribute("disabled")
        if(this.formulario)
        {
            this.formulario.remove()
        }
    }
}
function manejaSubmit(event){
    event.preventDefault();
    let form = document.forms[0]
    let concepto = form[0].value;
    let valorTotal = form[1].value;
    valorTotal = +valorTotal;
    let fechaDelGasto = new Date();
    fechaDelGasto = form[2].value
    let etiquetasGasto = form[3].value;
    let arrayEtiquetas = etiquetasGasto.split(",")
    let nuevoGasto = new gestionPresupuesto.CrearGasto(concepto, valorTotal, fechaDelGasto, ...arrayEtiquetas)
    gestionPresupuesto.anyadirGasto(nuevoGasto)
    let botonAñadirForm = document.getElementById("anyadirgasto-formulario")
    botonAñadirForm.removeAttribute("disabled")
    repintar()
}

function filtrarGastosWeb(){
    let formulario = document.getElementById("formulario-filtrado")
    formulario.addEventListener("submit", function(e){
        e.preventDefault();
        let filtro = {}
        if(formulario[3].value != "")
            filtro.fechaDesde = new Date(formulario[3].value)
        if(formulario[4].value != "")
            filtro.fechaHasta = new Date(formulario[4].value)
        if(formulario[1].value != "")
            filtro.valorMinimo = Number(formulario[1].value)
        if(formulario[2].value != "")
            filtro.valorMaximo = Number(formulario[2].value)
        if(formulario[0].value != "")
            filtro.descripcionContiene = formulario[0].value
        if(formulario[5].value != "")
            filtro.etiquetasTiene = gestionPresupuesto.transformarListadoEtiquetas(formulario[5].value)
        if(filtro == {})
            return
        let gastosFiltrados = gestionPresupuesto.filtrarGastos(filtro)
        let divGastosCompletos = document.getElementById("listado-gastos-completo")
        divGastosCompletos.innerHTML = ""
        mostrarGastoWeb("listado-gastos-completo", gastosFiltrados)
    })
    
}
function guardarGastosWeb(){
    let botonGuardarGastos = document.getElementById("guardar-gastos");
    let gastos = gestionPresupuesto.listarGastos();
    botonGuardarGastos.addEventListener("click", ()=>{
        localStorage.setItem(`GestorGastosDWEC`, JSON.stringify(gastos))
    });
}
function cargarGastosWeb(){
    let botonCargarGastos = document.getElementById("cargar-gastos")
    botonCargarGastos.addEventListener("click", () =>{
        let gastos = localStorage.getItem("GestorGastosDWEC")
        if(gastos != null)
        {
            gestionPresupuesto.cargarGastos(JSON.parse(gastos))
            repintar()
        }
        else{
            gestionPresupuesto.cargarGastos([])
            repintar()
        }
    })
}
function cargarGastosApi(){
    let botonCargarGastosApi = document.getElementById("cargar-gastos-api")
    botonCargarGastosApi.addEventListener("click", cargarGastos)
}

async function cargarGastos()
{
        let nombreUsuario = document.getElementById("nombre_usuario").value
        if(nombreUsuario == "")
            return
        let promise = await fetch(`https://gestion-presupuesto-api.onrender.com/api/${nombreUsuario}`)
        let json = await promise.json();
        gestionPresupuesto.cargarGastos(json)
        repintar()
}

function BorrarAPI(){
    this.handleEvent = async function(e){
        let nombreUsuario = document.getElementById("nombre_usuario").value
        let promise = await fetch(`https://gestion-presupuesto-api.onrender.com/api/${nombreUsuario}/${this.gasto.gastoId}`,
            {
                method: "DELETE"
            })
        console.log(await promise.text())
        cargarGastos();
    }
}
function EnviarAPI(){
    this.handleEvent = async function(e){
        let nombreUsuario = document.getElementById("nombre_usuario").value
        let descripcion = this.formulario[0].value
        let valor = this.formulario[1].value 
        let fecha = new Date
        fecha = this.formulario[2].value 
        let etiquetas = this.formulario[3].value 
        etiquetas = etiquetas.split(",")
        console.log(etiquetas)
        let gasto = new gestionPresupuesto.CrearGasto(descripcion,valor,fecha, ...etiquetas)
        let promise = await fetch(`https://gestion-presupuesto-api.onrender.com/api/${nombreUsuario}`,
        {
            method: "POST",
            headers: {"Content-Type":"application/json"},
            body: JSON.stringify(gasto)
        })
        cargarGastos();
    }
}
function ModificarAPI(){
    this.handleEvent = async function(e){
        let nombreUsuario = document.getElementById("nombre_usuario").value
        let descripcion = this.formulario[0].value
        let valor = this.formulario[1].value 
        let fecha = new Date
        fecha = this.formulario[2].value 
        let etiquetas = this.formulario[3].value 
        etiquetas = etiquetas.split(",")
        console.log(etiquetas)
        let gasto = new gestionPresupuesto.CrearGasto(descripcion,valor,fecha, ...etiquetas)
        let promise = await fetch(`https://gestion-presupuesto-api.onrender.com/api/${nombreUsuario}`,
        {
            method: "POST",
            headers: {"Content-Type":"application/json"},
            body: JSON.stringify(gasto)
        })
        cargarGastos();
    }
}


export{
    mostrarDatoEnId,
    mostrarGastoWeb,
    mostrarGastosAgrupadosWeb,
    repintar,
    actualizarPresupuestoWeb,
    nuevoGastoWeb,
    nuevoGastoWebFormulario,
    filtrarGastosWeb,
    guardarGastosWeb,
    cargarGastosWeb,
    cargarGastosApi
}