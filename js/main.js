// CAROUSEL
var slideIndex = 0;
carousel();

function carousel() {
  var i;
  var x = document.getElementsByClassName("mySlides");
  for (i = 0; i < x.length; i++) {
    x[i].style.display = "none";
  }
  slideIndex++;
  if (slideIndex > x.length) {slideIndex = 1}
  x[slideIndex-1].style.display = "block";
  setTimeout(carousel, 3000);
}

// Declaro un array con los shows disponibles en la página
let eventos = [
    {
        id: 1,
        nombre: "DUA LIPA",
        img: './images/img_dua_lipa.png',
        precio: 7000,
        disponibles: 2, 
    },
    {
        id: 2,
        nombre: "IMAGINE DRAGONS",
        img: './images/img_imagine_dragons.webp',
        precio: 5500,
        disponibles: 0, 
    },
    {
        id: 3,
        nombre: "LOLLAPALOOZA",
        img: './images/img_lollapalooza.jfif',
        precio: 13500,
        disponibles: 0, 
    },
    {
        id: 4,
        nombre: "PRIMAVERA SOUND",
        img: './images/img_primavera_sound.png',
        precio: 10300,
        disponibles: 10, 
    },
    {
        id: 5,
        nombre: "COTI",
        img: './images/img_coti.jpg',
        precio: 2200,
        disponibles: 6, 
    },
    {
        id: 6,
        nombre: "HARRY STYLES",
        img: './images/img_harry_styles.png',
        precio: 8800,
        disponibles: 0, 
    },
    {
        id: 7,
        nombre: "VALDES",
        img: './images/img_valdes.jpg',
        precio: 1800,
        disponibles: 7, 
    },
    {
        id: 8,
        nombre: "RAYOS LASER",
        img: './images/img_rayos_laser.jpg',
        precio: 1800,
        disponibles: 5, 
    }
]

// Creo una clase para agregar cada pedido al carrito de compras
class Pedido{
    constructor(id, evento, entradas, precio){
        this.id = id;
        this.evento = evento;
        this.entradas = entradas;
        this.precio = precio;
    }
}

// Declaro el carrito de compras
let carritoDeCompras = [];

// Me fijo si algún show está agotado y muestro un mensaje en el HTML
// También muestro cuántas entradas quedan si solo hay 3 o menos disponibles
eventos.forEach(evento => {
    if(evento.disponibles == 0){
        const avisoSinStock = document.createElement("h4");
        const divEvento = document.getElementById("card" + evento.id);
        avisoSinStock.textContent = "Ya no quedan entradas para este evento.";
        avisoSinStock.classList.add("aviso");
        avisoSinStock.setAttribute("id", "aviso" + evento.id);
        divEvento.appendChild(avisoSinStock);
    }else if(evento.disponibles >= 1 && evento.disponibles <= 3){
        const parrafoUltimasEntradas = document.getElementById("ultimas-entradas" + evento.id);
        parrafoUltimasEntradas.setAttribute("class", "ultimas-entradas");
        parrafoUltimasEntradas.innerText = "¡Últimas " + evento.disponibles + " entradas disponibles!";
    }
});

// Selecciono todos los botones para agregar entradas al carrito para manejar por DOM
const btn_entradas = document.querySelectorAll(".btn-entradas");

for(let boton of btn_entradas){
    boton.addEventListener("click", seleccionarEntradas);
}

// Creo la función para seleccionar la cantidad de entradas del select y el id del evento
function seleccionarEntradas(e){
    e.preventDefault();

    let entradas = parseInt(document.getElementById("entradas" + e.target.id).value);

    document.getElementById("contenedor-pago").classList.add("hidden");

    agregarACarrito(e.target.id, entradas);

    mostrarEnCarrito();
}

// Función para saber si un elemento que se quiere agregar al carrito ya está repetido
function repetido(carrito, id){
    return carrito.some(item => id == item.id);
}

// Función para agregar un nuevo objeto pedido o sumar entradas a un objeto en el array de carrito de compras
// Modifico los avisos de stock en HTML
function agregarACarrito(id, entradas) {
    const eventoEncontrado = eventos.find(function(evento) {
        return evento.id == id;
    });

    if(entradas != 0){
        if(entradas <= eventoEncontrado.disponibles){
            if(repetido(carritoDeCompras, id)){
                for(let pedido of carritoDeCompras){
                    if(pedido.id == id){
                        pedido.entradas += entradas;
                        pedido.precio += eventoEncontrado.precio * entradas;
                    }
                }
            }else{
                carritoDeCompras.push(new Pedido(eventoEncontrado.id, eventoEncontrado.nombre, entradas, eventoEncontrado.precio * entradas));
            }
            for(let evento of eventos){
                if(evento.id == id){
                    evento.disponibles -= entradas;
                }
            }
        }           
    }
    
    if(eventoEncontrado.disponibles == 0 && !document.getElementById("aviso" + id)){
        const avisoSinStock = document.createElement("h4");
        const divEvento = document.getElementById("card" + id);
        const parrafoUltimasEntradas = document.getElementById("ultimas-entradas" + id);
        parrafoUltimasEntradas.innerHTML = "";
        avisoSinStock.textContent = "Ya no quedan entradas para este evento.";
        avisoSinStock.classList.add("aviso");
        avisoSinStock.setAttribute("id", "aviso" + id);
        divEvento.appendChild(avisoSinStock);
    }else if(eventoEncontrado.disponibles > 1 && eventoEncontrado.disponibles <= 3){
        const parrafoUltimasEntradas = document.getElementById("ultimas-entradas" + id);
        parrafoUltimasEntradas.setAttribute("class", "ultimas-entradas");
        parrafoUltimasEntradas.innerText = "¡Últimas " + eventoEncontrado.disponibles + " entradas disponibles!";
    }else if(eventoEncontrado.disponibles == 1){
        const parrafoUltimasEntradas = document.getElementById("ultimas-entradas" + id);
        parrafoUltimasEntradas.setAttribute("class", "ultimas-entradas");
        parrafoUltimasEntradas.innerText = "¡Última entrada disponible!";
    }
}

// Selecciono el contenedor donde voy a incluir el carrito
const listaCarrito = document.getElementById("lista-carrito");
const contenedorCarrito = document.getElementById("contenedor-carrito");

// Función para mostrar en el carrito
function mostrarEnCarrito(){
    if(carritoDeCompras.length != 0){
        contenedorCarrito.classList.remove("hidden");
    }

    carritoDeCompras.forEach(function(pedido) {
        if(!document.getElementById("texto-pedido" + pedido.id)){
            const textoPedido = document.createElement("p");
            textoPedido.textContent = pedido.entradas + "x entradas para " + pedido.evento + " por $" + pedido.precio + ".  ";
            textoPedido.setAttribute("id", "texto-pedido" + pedido.id);
            textoPedido.setAttribute("class", "texto-pedido");
            textoPedido.innerHTML += `<button class="btn-eliminar" id="${pedido.id}"><i class="fa fa-times"></i></button>`;   
            listaCarrito.appendChild(textoPedido);
        }else{
            const textoPedido = document.getElementById("texto-pedido" + pedido.id);
            textoPedido.textContent = pedido.entradas + "x entradas para " + pedido.evento + " por $" + pedido.precio + ".  ";
            textoPedido.innerHTML += `<button class="btn-eliminar" id="${pedido.id}"><i class="fa fa-times"></i></button>`;
        }
    });
    const textoTotal = document.getElementById("total-carrito");
    let precioTotal = carritoDeCompras.reduce((acumulador, pedido) => acumulador + pedido.precio, 0);
    textoTotal.textContent = "TOTAL = $" + precioTotal;

    // Selecciono los botones para eliminar del carrito
    const btn_eliminar = document.querySelectorAll(".btn-eliminar");

    for(let boton of btn_eliminar){
        boton.addEventListener("click", eliminarDelCarrito);
    }
}

// Función para eliminar del carrito
function eliminarDelCarrito(e){
    e.preventDefault();
    e.target.parentNode.parentNode.remove();

    document.getElementById("contenedor-pago").classList.add("hidden");

    let id = parseInt(e.target.parentNode.id);

    const pedidoEncontrado = carritoDeCompras.find(function(pedido) {
        return pedido.id == id;
    });

    eventos.forEach(function(evento){
        if(evento.id == id){
            evento.disponibles += pedidoEncontrado.entradas;
            if(document.getElementById("aviso" + id)){
                document.getElementById("aviso" + id).remove();
            }
            if(document.getElementById("ultimas-entradas" + id)){
                const parrafoUltimasEntradas = document.getElementById("ultimas-entradas" + id);
                parrafoUltimasEntradas.innerHTML = "";
                if(evento.disponibles > 1 && evento.disponibles <= 3){
                    parrafoUltimasEntradas.setAttribute("class", "ultimas-entradas");
                    parrafoUltimasEntradas.innerText = "¡Últimas " + evento.disponibles + " entradas disponibles!";
                }else if(evento.disponibles == 1){
                    parrafoUltimasEntradas.setAttribute("class", "ultimas-entradas");
                    parrafoUltimasEntradas.innerText = "¡Última entrada disponible!";
                }
            }
        }
    });

    carritoDeCompras = carritoDeCompras.filter(pedido => pedido.id != id);

    const textoTotal = document.getElementById("total-carrito");
    let precioTotal = carritoDeCompras.reduce((acumulador, pedido) => acumulador + pedido.precio, 0);
    textoTotal.textContent = "TOTAL = $" + precioTotal;

    if(carritoDeCompras.length == 0){
        contenedorCarrito.classList.add("hidden");
    }
}

// Creo una clase de usuarios
class Usuario{
    constructor(usuario, pass){
        this.usuario = usuario;
        this.pass = pass;
    }
}

// Inicializo el localStorage
const usuarios = [];
const usuarioActivo = JSON.stringify(new Usuario());

if(!localStorage.getItem("usuarios")){
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
}

if(!localStorage.getItem("usuarioActivo")){
    localStorage.setItem("usuarioActivo", JSON.stringify(usuarioActivo));
}

// Me fijo en el localStorage si hay un usuario activo
if(JSON.parse(localStorage.getItem("usuarioActivo")).usuario){
    document.getElementById("formulario-sign-in").classList.add("hidden");
    document.getElementById("sign-in-header").classList.add("hidden");
    document.getElementById("sign-out-header").classList.remove("hidden");
    document.getElementById("contenedor-sign-in").classList.add("hidden");
}

// Cerrar sesión
const botonSignOutHeader = document.getElementById("sign-out-header");

botonSignOutHeader.addEventListener("click", function(e){
    e.preventDefault();
    localStorage.setItem("usuarioActivo", usuarioActivo);
    document.getElementById("formulario-sign-in").classList.remove("hidden");
    document.getElementById("sign-in-header").classList.remove("hidden");
    document.getElementById("sign-out-header").classList.add("hidden");
    document.getElementById("contenedor-pago").classList.add("hidden");
});

// Mostrar formulario para iniciar sesión
const botonSignInHeader = document.getElementById("sign-in-header");

botonSignInHeader.addEventListener("click", function(){
    const contenedorSignIn = document.getElementById("contenedor-sign-in");
    contenedorSignIn.classList.remove("hidden");
});

// Registrarse
const botonRegistro = document.getElementById("btn-registro");

botonRegistro.addEventListener("click", (e) => {
    e.preventDefault();

    let usuario = e.target.form[0].value;
    let pass = e.target.form[1].value;
    
    let nuevoUsuario = new Usuario(usuario, pass);

    let usuariosLocalStorage = JSON.parse(localStorage.getItem("usuarios"));

    if(usuario.length == 0 || pass.length == 0){
        document.getElementById("mensaje-sign-in").innerHTML = "";
        e.target.form[0].value = "";
        e.target.form[1].value = "";
        const mensajeIncorrecto = document.createElement("p");
        mensajeIncorrecto.setAttribute("class", "mensaje-incorrecto");
        mensajeIncorrecto.innerText = "Tenés que completar todos los campos para registrarte.";
        document.getElementById("mensaje-sign-in").appendChild(mensajeIncorrecto);
    }else{
        if(usuariosLocalStorage.some(item => usuario == item.usuario)){
            document.getElementById("mensaje-sign-in").innerHTML = "";
            e.target.form[0].value = "";
            e.target.form[1].value = "";
            const mensajeIncorrecto = document.createElement("p");
            mensajeIncorrecto.setAttribute("class", "mensaje-incorrecto");
            mensajeIncorrecto.innerText = "Ya existe un usuario registrado con ese nombre.";
            document.getElementById("mensaje-sign-in").appendChild(mensajeIncorrecto);
        }else{
            usuariosLocalStorage.push(nuevoUsuario);
            usuariosLocalStorage = JSON.stringify(usuariosLocalStorage);
            e.target.form[0].value = "";
            e.target.form[1].value = "";
            localStorage.setItem("usuarios", usuariosLocalStorage);
            document.getElementById("mensaje-sign-in").innerHTML = "";
            const mensajeRegistro = document.createElement("p");
            mensajeRegistro.setAttribute("id", "mensaje-registro");
            mensajeRegistro.innerText = "El usuario se registró correctamente.";
            document.getElementById("mensaje-sign-in").appendChild(mensajeRegistro);
        }
    }
});

// Iniciar sesión
const botonSignIn = document.getElementById("btn-sign-in");

botonSignIn.addEventListener("click", (e) => {
    e.preventDefault();

    let usuario = e.target.form[0].value;
    let pass = e.target.form[1].value;

    let usuariosLocalStorage = JSON.parse(localStorage.getItem("usuarios"));

    if(usuariosLocalStorage.some(item => usuario == item.usuario)){
        let usuarioEncontrado = usuariosLocalStorage.find(function(item){
            return item.usuario == usuario;
        });
        if(usuarioEncontrado.pass == pass){
            localStorage.setItem("usuarioActivo", JSON.stringify(usuarioEncontrado));
            e.target.form[0].value = "";
            e.target.form[1].value = "";
            const contenedorSignIn = document.getElementById("contenedor-sign-in");
            const mensajeBienvenida = document.createElement("h3");
            document.getElementById("mensaje-sign-in").innerHTML = "";
            mensajeBienvenida.setAttribute("id", "mensaje-bienvenida");
            mensajeBienvenida.innerText = "Se ha iniciado sesión correctamente.";
            contenedorSignIn.appendChild(mensajeBienvenida);
            document.getElementById("formulario-sign-in").classList.add("hidden");
            document.getElementById("sign-in-header").classList.add("hidden");
            document.getElementById("sign-out-header").classList.remove("hidden");
            setTimeout(() => {
                contenedorSignIn.removeChild(mensajeBienvenida);
                document.getElementById("mensaje-carrito").innerHTML = "";
                document.getElementById("contenedor-sign-in").classList.add("hidden");
            }, 3000);
        }else{
            document.getElementById("mensaje-sign-in").innerHTML = "";
            e.target.form[0].value = "";
            e.target.form[1].value = "";
            const mensajeIncorrecto = document.createElement("p");
            mensajeIncorrecto.setAttribute("class", "mensaje-incorrecto");
            mensajeIncorrecto.innerText = "La contraseña ingresada es incorrecta.";
            document.getElementById("mensaje-sign-in").appendChild(mensajeIncorrecto);
        }
    }else{
        document.getElementById("mensaje-sign-in").innerHTML = "";
        e.target.form[0].value = "";
        e.target.form[1].value = "";
        const mensajeIncorrecto = document.createElement("p");
        mensajeIncorrecto.setAttribute("class", "mensaje-incorrecto");
        mensajeIncorrecto.innerText = "El usuario ingresado no se encuentra registrado.";
        document.getElementById("mensaje-sign-in").appendChild(mensajeIncorrecto);
    }
});

// Confirmar carrito
const botonConfirmarCarrito = document.getElementById("btn-confirmar-carrito");

botonConfirmarCarrito.addEventListener("click", function(e){
    e.preventDefault();
    if(!JSON.parse(localStorage.getItem("usuarioActivo")).usuario){
        document.getElementById("mensaje-carrito").innerHTML = "";
        const mensajeCarrito = document.createElement("p");
        mensajeCarrito.setAttribute("class", "mensaje-incorrecto")
        mensajeCarrito.innerText = "Tenés que iniciar sesión para confirmar el carrito de compras.";
        document.getElementById("mensaje-carrito").appendChild(mensajeCarrito);
    }else{
        document.getElementById("mensaje-carrito").innerHTML = "";
        document.getElementById("contenedor-pago").classList.remove("hidden");
    }
});

// Confirmar compra
const botonConfirmarCompra = document.getElementById("btn-confirmar-compra");

botonConfirmarCompra.addEventListener("click", function(e){
    e.preventDefault();

    const modoDePago = document.querySelector('input[name="modo-de-pago"]:checked').value;
    const proveedorDeTarjeta = document.querySelector('input[name="tarjeta_prov"]:checked').value;
    const numeroTarjeta = document.getElementById("tarjeta_num").value;
    const nombreTarjeta = document.getElementById("tarjeta_nomb").value;
    const cvvTarjeta = document.getElementById("tarjeta_cvv").value;

    let datosDePago = [];
    datosDePago.push(modoDePago);
    datosDePago.push(proveedorDeTarjeta);
    datosDePago.push(numeroTarjeta);
    datosDePago.push(nombreTarjeta);
    datosDePago.push(cvvTarjeta);

    if(datosDePago.some(item => 0 == item.length)){
        document.getElementById("mensaje-pago").innerHTML = "";
        const mensajePago = document.createElement("p");
        mensajePago.setAttribute("class", "mensaje-incorrecto")
        mensajePago.innerText = "Tenés que completar todos los campos para confirmar la compra.";
        document.getElementById("mensaje-pago").appendChild(mensajePago);
    }else{
        document.getElementById("mensaje-pago").innerHTML = "";
        const contenedorPago = document.getElementById("contenedor-pago");
        const mensajeConfirmacionCompra = document.createElement("h3");
        mensajeConfirmacionCompra.setAttribute("id", "mensaje-confirmacion-compra");
        mensajeConfirmacionCompra.innerText = "La compra se ha realizado correctamente.";
        contenedorPago.appendChild(mensajeConfirmacionCompra);
        document.getElementById("formulario-pago").classList.add("hidden");
        setTimeout(() => {
            contenedorPago.removeChild(mensajeConfirmacionCompra);
            document.getElementById("contenedor-pago").classList.add("hidden");
            document.getElementById("formulario-pago").classList.remove("hidden");
            carritoDeCompras = [];
            document.getElementById("lista-carrito").innerHTML = "";
            document.getElementById("tarjeta_num").value = "";
            document.getElementById("tarjeta_nomb").value = "";
            document.getElementById("tarjeta_cvv").value = "";
            document.getElementById("contenedor-carrito").classList.add("hidden");
        }, 3000);
    }
});

// Añado un buscador
document.addEventListener("keyup", (e) => {
    if(e.target.matches("#filtro")){
        document.querySelectorAll(".titulo-evento").forEach(evento => {
            evento.textContent.toLowerCase().includes(e.target.value.toLowerCase())?
            evento.parentNode.classList.remove("hidden") : evento.parentNode.classList.add("hidden");
            if(document.getElementById("mensaje-filtro")){
                document.getElementById("mensaje-filtro").remove();
            }
        });
    }
});