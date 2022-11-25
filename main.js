const sonido_correcto = new Audio("audios/sonido_correcto.mp3");
const sonido_incorrecto = new Audio("audios/sonido_incorrecto.mp3");
const sonido_perder = new Audio("audios/sonido_perder.mp3");

const respuesta = document.querySelector(".respuesta");
const caja = document.querySelector(".caja");
const precio = document.querySelector(".precio");
const dinero = document.querySelector(".dinero");
const cambio = document.querySelector(".cambio");
const cajaBilletes = document.querySelector(".cajaBilletes");
const billete = document.querySelector(".billete");
const temporizador = document.querySelector("temporizador");
const puntos = document.querySelector("puntos");

let t = 30;
let tiempoAcabado = false;
let terminoCliente= false;
let cuantosClientes = 0;

let clientes = ["👩", "👨", "👨‍⚕️", "👮‍♂️", "👩‍🎓", "👩‍🔬", "👨‍🍳"];
let productos = [
    "🍕",
    "🍔",
    "🍟",
    "🌭",
    "🍿",
    "🍉",
    "🍓",
    "🍺",
    "🥤",
    "🥾",
    "🧣",
    "🧦",
    "👠",
];

let billetes = [10, 50, 100, 500];
let billetes_cliente = [10, 20, 50, 100, 500, 1000];

caja.addEventListener("submit", atender);

function obtenerAleatorio(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function tiempo() {
    if (t == 0) {
        alert("Ganaste!");
    }
    if (cuantosClientes > 0 && cuantosClientes % 5 == 0) {
        t -= 5;
    }
    temporizador.innerHTML = t;
    const x = setInterval(() => {
        temporizador.innerHTML = parseInt(temporizador.innerHTML) - 1;
        if (parseInt(temporizador.innerHTML) < 1) {
            tiempoAcabado = true;
            clearInterval(x);
            sonido_perder.play();
            respuesta.innerHTML =
                "<persona>😒</persona><texto>Ya fue, compro en otro lado.</texto>";
            cuantosClientes = 0;
            t = 30;
            setTimeout(() => {
                renderLocal();
            }, 5000);
        }
        if (terminoCliente) {
            clearInterval(x);
        }
    }, 1000);
}

function atender(e) {
    if(!tiempoAcabado){
    if (
        parseInt(dinero.value) - parseInt(precio.value) ==
            parseInt(cambio.value) &&
        parseInt(cambio.value) % 100 == 0
    ) {
        sonido_correcto.play();
        respuesta.innerHTML = "<persona>👍</persona><texto>Gracias!</texto>";
        cuantosClientes++;
        terminoCliente = true;
        setTimeout(() => {
            renderLocal();
        }, 1000);
    } else if (
        parseInt(dinero.value) - parseInt(precio.value) ==
            parseInt(cambio.value) &&
        parseInt(cambio.value) % 100 != 0
    ) {
        ayudar();
    } else {
        sonido_incorrecto.play();
        respuesta.innerHTML =
            "<persona>🤔</persona><texto>Espera! me diste mal el cambio.</texto>";
        cambio.value = 0;
    }
    }
    e.preventDefault();
}

function pagar(b) {
    const n = parseInt(cambio.value) ? parseInt(cambio.value) : 0;
    cambio.value = n + b;
}

function ayudar() {
    const r = obtenerAleatorio(0, 1);
    const ayuda = 100 - (parseInt(cambio.value) % 100);
    if (r && parseInt(precio.value) != ayuda) {
        respuesta.innerHTML = `<persona>😎</persona><texto>Te ayudo con el cambio, toma $${ayuda}.</texto>`;
        setTimeout(() => {
            dinero.value = parseInt(dinero.value) + ayuda;
            cambio.value = 0;
        }, 1500);
    } else {
        sonido_correcto.play();
        respuesta.innerHTML = "<persona>👍</persona><texto>Gracias!</texto>";
        cuantosClientes++;
        terminoCliente = true;
        setTimeout(() => {
            renderLocal();
        }, 1000);
    }
}

function renderLocal() {
    // Cliente
    respuesta.innerHTML = `<persona>${
        clientes[obtenerAleatorio(0, clientes.length - 1)]
    }</persona><texto>Hola! me das esto: <persona>${
        productos[obtenerAleatorio(0, productos.length - 1)]
    }</persona></texto>`;
    // Valores
    precio.value = obtenerAleatorio(1, 99) * 10;
    const queBilletes = billetes_cliente.filter((x) => x > precio.value);
    dinero.value = queBilletes[obtenerAleatorio(0, queBilletes.length - 1)];
    cambio.value = 0;
    puntos.innerHTML = cuantosClientes;
    // Billetes
    cajaBilletes.innerHTML = "";
    billetes.forEach((b) => {
        cajaBilletes.innerHTML += `<button class="billete" onclick="pagar(${b})"><c>$${b}</c></button>`;
    });
    // Tiempo
    tiempoAcabado = false;
    terminoCliente = false;
    tiempo();
}

renderLocal();
