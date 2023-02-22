
// Inicio del controlador de eventos en la barra de navegación.
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
// Fin del controlador de eventos de la barra de navegación.

// Seleccionando varios elementos del DOM.
const peliculasContenedor = document.querySelector('.box-peliculas')
const seriesContenedor = document.querySelector('.box-series')
const itemNumero = document.querySelector('.item-number')
const precioTotal = document.querySelector('.precio-total')
const btnConfirmar = document.querySelector('.btn-confirmar');
let itemsContenedor = []

// Inicio donde se pinta las peliculas del json -> peliculas.json
async function obtenerPeliculas() {
    const response = await fetch(`./peliculas.json`)
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
// Fin donde se pinta las peliculas del json -> peliculas.json

// Inicio donde se pinta las series del json -> series.json
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
// Fin donde se pinta las series del json -> series.json

// Delegación del evento para pintar las peliculas.
peliculasContenedor.addEventListener('click', async (e) => {
    if (e.target.classList.contains('btn-pelicula')) {
        const id = e.target.id;
        // console.log(id)
        const peliculas = await obtenerPeliculas()
        const pelicula = peliculas.find((movie) => movie.id == id)
        pintarItemCarrito(pelicula);
    }
})


// Delegación del evento para pintar las series.
seriesContenedor.addEventListener('click', async (e) => {
    if (e.target.classList.contains('btn-serie')) {
        const id = e.target.id;
        // console.log(id)
        const series = await obtenerSeries()
        const serie = series.find((movie) => movie.id == id)
        pintarItemCarrito(serie)
    }
})
// fin de las delegaciones de las peliculas y las series.

// Funcion donde se pinta las series y peliculas.
const pintarItemCarrito = async (item) => {
    const {
        imagen,
        nombre,
        precio,
        cantidad,
        id
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
                <p>Cantidad: <span class="cantidad-${id}">${cantidad}</span> </p>
            </div>
        </div>
    `

    const existe = itemsContenedor.some((item) => item.id == id)

    if (existe) {
        // console.log("pelicula")
        const item = itemsContenedor.find((item) => item.id == id)
        item.cantidad++
        const cantidad = document.querySelector(`.cantidad-${item.id}`)
        cantidad.innerText = item.cantidad
        actualizarTotalItems()

    } else {
        itemsContenedor.push(item)
        contenedorCarrito.appendChild(div)
        actualizarTotalItems()

    }

    // Se incluye la alerta de Toastify.
    Toastify({
        text: "¡Se agregó con éxito!",
        style: {
            background: "linear-gradient(to right, #ff416c, #ff4b2b)",
        },
        className: "alerta",
        duration: 2000,
        offset: {
            x: 110,
            y: 10,
        }
    }).showToast()

    // agrego evento para el botón eliminar.
    const botonEliminar = div.querySelector('.fa-times')
    botonEliminar.addEventListener('click', () => {
        if (item.cantidad == 1) {
            const index = itemsContenedor.indexOf(item)
            if (index > -1) itemsContenedor.splice(index, 1)
            contenedorCarrito.removeChild(div)
            actualizarTotalItems()
        } else {
            item.cantidad--
            const cantidad = document.querySelector(`.cantidad-${item.id}`)
            cantidad.innerText = item.cantidad
            actualizarTotalItems()
        }
    })
}
// Fin de la funcion donde se pinta las series y las peliculas.

// Funcion donde se actializa el precio total con la cantidad de series y pelicculas
function actualizarTotalItems() {
    itemNumero.textContent = itemsContenedor.length
    precioTotal.innerText = itemsContenedor.reduce((acc, item) => acc + item.precio * item.cantidad, 0).toFixed(2)
}

// El evento del boton de Confirmar las peliculas y las series.
btnConfirmar.addEventListener('click', () => {
    if (itemsContenedor.length !== 0) {
        Toastify({
            text: "¡Confirmacion exitosa / Gracias por su compra!",
            style: {
                background: "linear-gradient(to right, #ff416c, #ff4b2b)",
            },
            className: "alerta",
            duration: 4000
        }).showToast()

        vaciarCarrito()

    } else {
        Toastify({
            text: "¡Su carrito esta vacio!",
            style: {
                background: "linear-gradient(to right, #ff416c, #ff4b2b)",
            },
            className: "alerta",
            duration: 2000,
            offset: {
                x: 110,
                y: 10,
            }
        }).showToast()
    }
})
// Fin del evento del boton confirmar.

// Funcion donde se vacia ela carrito al darle click en confirmar.
function vaciarCarrito() {
    itemsContenedor = []
    const contenedorCarrito = document.querySelector('.items-container')
    contenedorCarrito.innerHTML = ''
    actualizarTotalItems()
}

// Inicio de la funcionalidad de la busqueda de las peliculas y las series.
const form = document.getElementById('myForm')
const searchButton = document.getElementById("search-button")
const searchBox = document.getElementById("search-box")
const movieDetails = document.getElementById("movie-details")

// Esta función busca la película/serie y la muestra en la página.
async function buscarPelicula() {
    const searchTerm = searchBox.value.toLowerCase()
    const peliculas = await obtenerPeliculas()
    const series = await obtenerSeries()
    const pelicula = peliculas.find((movie) => movie.nombre.toLowerCase() === searchTerm)
    const serie = series.find((show) => show.nombre.toLowerCase() === searchTerm)

    if (pelicula) {
        movieDetails.innerHTML = `
            <h2>${pelicula.nombre}</h2>
            <img src="${pelicula.imagen}" alt="">
            <p>Precio: $ ${pelicula.precio}</p>
            <p class="descripcion">Felicidades! podra encontrar la pelicula en la seccion <a href="#menu" class="btn btn-serie btn-agregar">Peliculas <span class="fas fa-video-camera"></span></a> </p>
        `

    } else if (serie) {
        movieDetails.innerHTML = `
            <h2>${serie.nombre}</h2>
            <img src="${serie.imagen}" alt="">
            <p>Precio: ${serie.precio}</p>
            <p class="descripcion">Felicidades! podra encontrar la serie en la seccion <a href="#menu-series" class="btn btn-serie btn-agregar">Series <span class="fas fa-tv"></span></a> </p>
        `
    // Muestra un mensaje en la pagina que no se encontro la serie/pelicula.
    } else {
        movieDetails.innerHTML = ""
        const errorMessage = document.createElement("div")
        errorMessage.textContent = "No se encontró ninguna película y serie."
        errorMessage.style.color = "white"
        errorMessage.style.fontSize = "35px"
        errorMessage.style.display = "flex"
        errorMessage.style.alignItems = "center"
        errorMessage.style.minHeight = "45rem"

        // Le puse una imagen donde le doy algunos estilos.
        const img = document.createElement("img")
        img.src = "./imagenes/tristeza-de-intensamente_2560x1440_xtrafondos.com (1).jpg"
        img.style.width = "170px"
        img.style.height = "170px"
        img.style.border = "1px solid black"
        img.style.margin = "10px"

        errorMessage.appendChild(img)
        movieDetails.appendChild(errorMessage)
    }

    // En este codigo hace que la ventana del navegador se desplace hacia la variable movieDetails.
    if (pelicula || movieDetails.firstChild) {
        movieDetails.scrollIntoView({
            behavior: 'smooth'
        })
    }

    // Muestra una alerta que no se encontro pelicula/serie.
    if (!pelicula && !serie) {
        Toastify({
            text: 'No se encontró ninguna película o serie.',
            style:{
                background: "linear-gradient(to right, #ff416c, #ff4b2b)",
            },
            className: 'info',
            duration: 1500,
        }).showToast()
    }
}

// Se llama a buscarPelicula cuando se hace click en el icono de búsqueda.
searchButton.addEventListener("click", (e) => {
    e.preventDefault()
    buscarPelicula()
})

// Se llama a buscarPelicula cuando se envía el formulario (pulsando Enter en el input)
document.getElementById("myForm").addEventListener("submit", (e) => {
    e.preventDefault()
    buscarPelicula()
})