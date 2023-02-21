/*
    Detalles de el buscador, el carrito y el navbar.
*/
const navbar = document.querySelector('.navbar')

document.querySelector('#menu-btn').onclick = () => {
    navbar.classList.toggle('active')
    searchForm.classList.remove('active')
    cartItem.classList.remove('active')
}

const searchForm = document.querySelector('.search-form')

document.querySelector('#search-btn').onclick = () => {
    searchForm.classList.toggle('active')
    navbar.classList.remove('active')
    cartItem.classList.remove('active')
}

const cartItem = document.querySelector('.cart-items-container')

document.querySelector('#cart-btn').onclick = () => {
    cartItem.classList.toggle('active')
    navbar.classList.remove('active')
    searchForm.classList.remove('active')
}

window.onscroll = () => {
    navbar.classList.remove('active')
    searchForm.classList.remove('active')
    cartItem.classList.remove('active')
}

// fin de los detalles

// inicio...

const peliculasContenedor = document.querySelector('.box-peliculas')
const seriesContenedor = document.querySelector('.box-series')
const itemNumero = document.querySelector('.item-number')
const precioTotal = document.querySelector('.precio-total')
const btnConfirmar = document.querySelector('.btn-confirmar');

let itemsContenedor = []
// console.log(itemsContenedor)

// inicio donde pintamos las series y las peliculas
async function obtenerPeliculas() {
    const response = await fetch(`./movies.json`)
    const data = await response.json()
    return data
}

async function pintarPeliculas() {
    const peliculas = await obtenerPeliculas()
    peliculas.forEach((pelicula) => {
        const informacionPeliculas = document.createElement('div')
        informacionPeliculas.innerHTML = `
            <div class="box">
                <img src="${pelicula.imagen}" alt="imagen pelicula">
                <h3>${pelicula.nombre}</h3>
                <div class="price">$${pelicula.precio}</div>
                <button href="#" class="btn btn-pelicula btn-agregar" id="${pelicula.id}" >agregar <span class="fas fa-video-camera"></span></button>
            </div>
        `
        peliculasContenedor.appendChild(informacionPeliculas)
    })

}

pintarPeliculas()

async function obtenerSeries() {
    const response = await fetch(`./series.json`)
    const data = await response.json()
    return data
}

async function pintarSeries() {
    const data = await obtenerSeries()
    data.forEach((serie) => {
        const informacionSeries = document.createElement('div')
        informacionSeries.innerHTML = `
                <div class="box">
                    <img src="${serie.imagen}" alt="imagen pelicula">
                    <h3>${serie.nombre}</h3>
                    <div class="price">$${serie.precio}</div>
                    <button href="#" class="btn btn-serie btn-agregar" id="${serie.id}" >agregar <span class="fas fa-video-camera"></span></button>
                </div>
            `
        seriesContenedor.appendChild(informacionSeries)
    })
}

pintarSeries()

// fin de pintar las series y las peliculas.

// las delegaciones de pintar las series y las peliclas

// peliculas
peliculasContenedor.addEventListener('click', async (e) => {
    if (e.target.classList.contains('btn-pelicula')) {
        const id = e.target.id;
        console.log(id)
        const peliculas = await obtenerPeliculas()
        const pelicula = peliculas.find((movie) => movie.id == id)
        pintarItemCarrito(pelicula);
        // itemsContenedor.push(pelicula)
    }
})


// series
seriesContenedor.addEventListener('click', async (e) => {
    if (e.target.classList.contains('btn-serie')) {
        const id = e.target.id;
        console.log(id)
        const series = await obtenerSeries()
        const serie = series.find((movie) => movie.id == id)
        pintarItemCarrito(serie)
        // itemsContenedor.push(serie)
    }
});

// fin de las delegaciones

// pintando el contenedor de las series y las peliculas.
const pintarItemCarrito = (item) => {
    console.log(item)
    const {
        imagen,
        nombre,
        precio
    } = item
    const contenedorCarrito = document.querySelector('.items-container');
    const div = document.createElement('div');
    div.innerHTML = `
        <div class="cart-item">
            <span class="fas fa-times"></span>
            <img src="${imagen}" alt="">
            <div class="content">
                <h3>${nombre}</h3>
                <div class="price">$${precio}</div>
            </div>
        </div>
    `;

    itemsContenedor.push(item)
    // console.log(itemsContenedor)
    contenedorCarrito.appendChild(div)
    actualizarTotalItems()

    // colocarl la alerta
    Toastify({
        text: "¡Se agrego con exito!",
        backgroundColor: "linear-gradient(to right, #ff416c, #ff4b2b)",
        className: "alerta",
        duration: 2000,
        offset: {
            x: 110,
            y: 10,
        }
    }).showToast();

    // agregue un evento para el boton eliminar
    const botonEliminar = div.querySelector('.fa-times')
    botonEliminar.addEventListener('click', () => {
        // eliminar item del arreglo y del contenedor
        const index = itemsContenedor.indexOf(item)
        if (index > -1) itemsContenedor.splice(index, 1)
        contenedorCarrito.removeChild(div)
        actualizarTotalItems()
    })

}
//fin de pintar las series y las peliculas.

// aumentando la cantidad en el itemsContenedor.

function actualizarTotalItems() {
    itemNumero.textContent = itemsContenedor.length
    precioTotal.innerText = itemsContenedor.reduce((acc, item) => acc + item.precio, 0).toFixed(2);
}

// boton de confirmar
btnConfirmar.addEventListener('click', () => {
    if (itemsContenedor.length !== 0) {
        Toastify({
            text: "¡Confirmacion con exito / Peliculas y Series!",
            backgroundColor: "linear-gradient(to right, #ff416c, #ff4b2b)",
            className: "alerta",
            duration: 5000
        }).showToast();

        vaciarCarrito();

    } else {
        Toastify({
            text: "¡Su carrito esta vacio!",
            backgroundColor: "linear-gradient(to right, #ff416c, #ff4b2b)",
            className: "alerta",
            duration: 5000,
            offset: {
                x: 110,
                y: 10,
            }
        }).showToast();
    }

    // la otra alerta
});

// vaciar el carrito al darle al boton de confirmar.
function vaciarCarrito() {
    itemsContenedor = [];
    const contenedorCarrito = document.querySelector('.items-container');
    contenedorCarrito.innerHTML = '';
    actualizarTotalItems();
}

// fin del boton confirmar

// busqueda el input de la busqueda si no se pone nada saldra la alerta de toastify.

const form = document.getElementById('myForm'); // obtenemos el elemento del formulario

// prueba nuemero 03 si funiona pintar la busqueda de peliuclas !1!

const searchButton = document.getElementById("search-button");
const searchBox = document.getElementById("search-box");
const movieDetails = document.getElementById("movie-details");

// Esta función busca la película en la lista y la muestra en la página
async function buscarPelicula() {
    const searchTerm = searchBox.value.toLowerCase();
    const peliculas = await obtenerPeliculas();
    const series = await obtenerSeries();
    const pelicula = peliculas.find((movie) => movie.nombre.toLowerCase() === searchTerm);
    const serie = series.find((show) => show.nombre.toLowerCase() === searchTerm);

    if (pelicula) {
        movieDetails.innerHTML = `
      <h2>${pelicula.nombre}</h2>
      <img src="${pelicula.imagen}" alt="">
      <p>Precio: $ ${pelicula.precio}</p>
      <p class="descripcion">Felicidades! podra encontrar la pelicula en la seccion <a href="#menu" class="btn btn-serie btn-agregar">Peliculas <span class="fas fa-video-camera"></span></a> </p>
    `;

        // punto de partida

    } else if (serie) {

        movieDetails.innerHTML = `
            <h2>${serie.nombre}</h2>
            <img src="${serie.imagen}" alt="">
            <p>Precio: ${serie.precio}</p>
            <p class="descripcion">Felicidades! podra encontrar la serie en la seccion <a href="#menu-series" class="btn btn-serie btn-agregar">Series <span class="fas fa-tv"></span></a> </p>
        `;

    } else {
        movieDetails.innerHTML = ""; // Borra todo el contenido previo de movieDetails
        const errorMessage = document.createElement("div"); // Crea un div para el mensaje de error
        errorMessage.textContent = "No se encontró ninguna película y serie.";
        errorMessage.style.color = "white";
        errorMessage.style.fontSize = "35px";
        errorMessage.style.display = "flex";
        errorMessage.style.alignItems = "center";
        errorMessage.style.minHeight = "45rem";

        const img = document.createElement("img"); // Crea un elemento de imagen
        img.src = "./imagenes/tristeza-de-intensamente_2560x1440_xtrafondos.com (1).jpg"; // Establece la URL de la imagen que deseas mostrar
        img.style.width = "170px"; // Establece el ancho de la imagen a 200 píxeles
        img.style.height = "170px";
        img.style.border = "1px solid black"; // Establece un borde negro de 1 píxel alrededor de la imagen
        img.style.margin = "10px";

        errorMessage.appendChild(img); // Agrega la imagen al div
        movieDetails.appendChild(errorMessage); // Agrega el div al elemento "movieDetails"
    }

    if (pelicula || movieDetails.firstChild) {
        movieDetails.scrollIntoView({
            behavior: 'smooth'
        });
    }

    if (!pelicula && !serie) {
        Toastify({
            text: 'No se encontró ninguna película o serie.',
            backgroundColor: "linear-gradient(to right, #ff416c, #ff4b2b)",
            className: 'info',
            duration: 1500,
        }).showToast(); // muestra una notificación Toastify si no se encontró ninguna película
    }
}

// -> intendo de poner las series ahora 


// Se llama a buscarPelicula cuando se hace clic en el icono de búsqueda
searchButton.addEventListener("click", (e) => {
    e.preventDefault(); // Previene la recarga de la página por defecto del formulario
    buscarPelicula();
});

// Se llama a buscarPelicula cuando se envía el formulario (pulsando Enter en el input)
document.getElementById("myForm").addEventListener("submit", (e) => {
    e.preventDefault(); // Previene la recarga de la página por defecto del formulario
    buscarPelicula();
});