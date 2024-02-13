

const API_URL = 'https://api.pnovastudios.xyz';
const LOGIN_URL = `${API_URL}/auth/login`;
const USER_INFO_URL = `${API_URL}/users/account`;

function validarCampos(email, password) {
    return email.trim() !== '' && password.trim() !== '';
}


function cerrarSesion() {
    console.log("Cerrando sesión del usuario...");

    ocultarPopup();

    localStorage.removeItem('token');

    var ultimaSesion = localStorage.getItem('ultimaSesion');
    var unaSemanaEnMilisegundos = 7 * 24 * 60 * 60 * 1000;

    if (ultimaSesion) {
        var tiempoPasado = new Date().getTime() - parseInt(ultimaSesion);

        if (tiempoPasado >= unaSemanaEnMilisegundos) {
            alert("Han pasado más de 7 días desde tu última sesión. Por favor, inicia sesión de nuevo.");
        }
    }
    localStorage.removeItem('profilePicture');

    localStorage.setItem('ultimaSesion', new Date().getTime());
    actualizarEstadoBotonUsuario();

    location.reload();

}


function mostrarInfoUsuario() {

    var token = localStorage.getItem('token');
    var usuarioInfo = localStorage.getItem('usuarioInfo');

    if (token && esTokenValido(token)) {

        obtenerInformacionUsuario(token);
    } else {

        console.log("No se ha podido iniciar sesión. Por favor, vuelva a ingresar sus datos.");
        localStorage.removeItem('token');
        localStorage.removeItem('usuarioInfo');
        limpiarCamposFormulario();
    }

    mostrarPopup();

}
function esTokenValido(token) {
    if (!token || typeof token !== 'string') {
        return false;
    }
    const formatoToken = /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.[A-Za-z0-9-_.+/=]+$/;

    if (!formatoToken.test(token)) {
        return false;
    }
    try {
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        return true;
    } catch (error) {
        return false;
    }
}
function limpiarCamposFormulario() {
    document.getElementById('nombreUsuario').value = '';
    document.getElementById('contrasena').value = '';
}
var storedProfilePicture = localStorage.getItem("profilePicture");
if (storedProfilePicture) {
    document.getElementById("userImage").src = storedProfilePicture;
}


function guardarTokenEnLocalStorage(token) {
    if (esTokenValido(token)) {
        localStorage.setItem('token', token);
    } else {
        console.error("Intento de guardar un token no válido en el localStorage.");
    }
}

function actualizarEstadoBotonUsuario() {
    var userButton = document.getElementById("userButton");
    var token = localStorage.getItem('token');

    if (token) {
        if (userButton) {
            userButton.style.display = "flex";
            alert("Botón mostrado con éxito");
        }
        verificarEstadoSesion();
    } else {
        if (userButton) {
            userButton.style.display = "none";
            alert("Cerrando sesión, Gracias por visitarnos");
        }
    }
}

document.addEventListener("keydown", function(event) {
    if (event.key === "Escape") {
        minimizarPopup();
    }
});

function minimizarPopup(popup) {
    ocultarPopup();
}
function mostrarPopup() {
    var popupContent = document.querySelector(".popup-content");
    if (popupContent) {
        var nombreUsuario = obtenerNombreUsuario();

        popupContent.innerHTML = `
            <div class="popup-content">
                <p>Bienvenido, ${nombreUsuario}!</p>
                
            </div>
        `;

        popupContent.style.display = "block";
    }
}

function ocultarPopup() {
    var popup = document.getElementById("popup");
    if (popup) {
        popup.style.display = "none";
        var popupContent = document.querySelector(".popup-content");
        if (popupContent) {
            popupContent.style.display = "none";
        }
    }
}


function manejarInicioDeSesionExitoso(token) {
    console.log("Inicio de sesión exitoso. Token:", token);

    localStorage.setItem('token', token);
    nombreUsuarioActual = obtenerNombreUsuario();
    urlImagenUsuario = '';

    redirigirAPaginaPrincipal();
    actualizarEstadoBotonUsuario();


}

function redirigirAPaginaPrincipal() {
    window.location.href = "/home?reload=true";
}
window.addEventListener('DOMContentLoaded', (event) => {
    const params = new URLSearchParams(window.location.search);

    if (params.has('reload') && params.get('reload') === 'true') {
        history.replaceState({}, document.title, window.location.pathname);

        setTimeout(function () {
            window.location.reload();
        }, 8000);
    }
});





async function iniciarSesion(email, password) {
    try {
        var data = {
            email: email,
            password: password
        };

        var requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        };

        const response = await fetch(LOGIN_URL, requestOptions);

        if (!response.ok) {
            if (response.status === 404 || response.status === 401) {
                alert("Correo no registrado o inválido, o contraseña incorrecta");

                document.getElementById("email").value = "";
                document.getElementById("password").value = "";
            } else if (response.status === 403) {
                console.error("Error al iniciar sesión: 403 - No se ha validado tu cuenta. Revisa el correo, hemos enviado una nueva validación vigente por 15 minutos.");
                alert("No se ha validado tu cuenta. Revisa el correo, hemos enviado una nueva validación vigente por 15 minutos.")

                location.reload();


            } else {
                throw new Error(`Error al realizar la solicitud: ${response.status} - ${response.statusText}`);
            }
        }
        const token = await response.text();

        if (esTokenValido(token)) {
            manejarInicioDeSesionExitoso(token);
        } else {
            console.error("Respuesta del servidor no es un token válido.");
        }

    } catch (error) {
        console.error('Error al iniciar sesión:', error.message);

        if (error.message.includes('403')) {
            console.error("No se ha validado tu cuenta. Revisa el correo, hemos enviado una nueva validación vigente por 15 minutos.");
        }

    }
}

function verificarEstadoSesion() {
    console.log("Verificando estado de sesión...");

    var token = localStorage.getItem('token');

    if (token) {
        
        var cleanedToken = token.trim();
        obtenerInformacionUsuario(cleanedToken);
    } else {
        console.log("No hay token almacenado. El usuario no ha iniciado sesión.");
    }
}

async function obtenerInformacionUsuario(token) {
    try {
        var requestOptions = {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token
            },
        };

        const response = await fetch(USER_INFO_URL, requestOptions);

        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        actualizarContenidoPopup(data);
    } catch (error) {
        console.error('Error al obtener la información del usuario:', error.message);
    }
}

var nombreUsuarioActual;

function actualizarContenidoPopup(data) {
    var nombre = data.name + ' ' + data.lastName;
    var fechaRegistro = new Date(data.meta.createdDate).toLocaleString();
    var ultimaHoraLogin = new Date(data.lastLoginDate).toLocaleString();
    nombreUsuarioActual = nombre;

    var popupContent = document.querySelector(".popup-content");
    localStorage.setItem('profilePicture', data.profilePicture);
    popupContent.innerHTML = `
    <p class="home_login">Bienvenido A Tú Cuenta PNOVA <br>  <span class="name_user">${nombre}</span> </p>
    <button id="cerrarSesionBtn" onclick="cerrarSesion()">Cerrar Sesión</button>
    <button id="minimizarPopupBtn" onclick="minimizarPopup()">Minimizar</button>
   
    <div class="container_img_login">
    <img id="avatarImage" class="img_services" src="${localStorage.getItem('profilePicture')}" alt="Imagen del Usuario"><br>
    
    <p id="cuenta-info"> ${data.username},</p>
    <p class="paragraf_services">Gracias Por Preferirnos</p>
</div>
<nav class="navbar courser sticky-top navbar-expand-lg navbar-light bg-white" data-spy="affix"
    data-offset-top="510">
    <div class="container">
    
        <button class="navbar-toggler ml-auto" type="button" data-toggle="collapse"
            data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
            
            aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
            
            &nbsp;
        </button>
        <div class="collapse mt-sm-20 navbar-collapse" id="navbarSupportedContent">
       
            <ul class="navbar-nav mr-auto">
                <li class="home nav-item">
                    <a href="/public/html/index.html" class="ti-home">&#8203;</a>
                </li>
                <li class="home nav-item">
                    <a href="https://www.linkedin.com/company/pnovastudios" class="ti-linkedin">&#8203;</a>
                </li>
                <li class="home nav-item">
                    <a href="https://twitter.com/pnovastudios" class="twitter ti-twitter">&#8203;</a>
                </li>
            </ul>
            <ul class="navbar-nav brand">
                <div class="img_login_container">
                    <img class="img_login" src="/public/img/img_pnova_novedades.webp" alt="omg_login">
                </div>
            </ul>
            <ul class="navbar-nav ml-auto">
                <li class="home nav-item">
                <a href="https://discord.gg/uURYVkkG" ><i class="fa-brands fa-discord"></i>&#8203;</a>
                </li>
                <li class="home nav-item">
                    <a href="https://www.youtube.com/@PNOVAVIGESTUDIIOS" class="ti-youtube">&#8203;</a>
                </li>
                <li class="home nav-item ">
                    <a href="#" class="instagram ti-instagram">&#8203;</a>
                </li>
            </ul>
        </div>
    </div>
</nav>
<div class="pruebauno col-md-12 container sin-borde">
<div class="row px-0">

    <div class="col-md-12 px-0">
        <div class="section_container_pop_up">
            <div class="section_login">
                <h3><span class="login_tittle">Acompañamiento</span> y Asesoramiento Profesional</h3>
                <p>En PNOVA STUDIIOS, nos enorgullece ofrecer no solo productos y servicios excepcionales, sino también un compromiso inquebrantable con la satisfacción de nuestros clientes. Creemos que la clave para el éxito va más allá de la entrega de soluciones tecnológicas; implica proporcionar un respaldo constante y un asesoramiento experto para garantizar la excelencia en cada paso.</p>
            </div>
        </div>
    </div>
    <!-- Nueva sección: Historial de Actividades -->
    <div class="col-md-6">
        <div class="section_container">
            <div class="section_login">
                <h3><span class="login_tittle">Historial</span> de Actividades</h3>
                <ul>
                <li><strong>Nombre:</strong> ${data.name}</li>
                <li><strong>Apellido:</strong> ${data.lastName}</li>
                <li><strong>Correo:</strong> ${data.email}</li>
                <li><strong>Usuario:</strong> ${data.username}</li>
                
                
            </ul>
                <ul>
                <p class="home_login"><span class="ti-calendar"></span>Creacion De Tú Cuenta   ${fechaRegistro}<br> <span class="clock ti-timer"></span> Ultimo Inicio De Sesión  ${ultimaHoraLogin}</p>
                </ul>
            </div>
        </div>
    </div>
    <!-- Nueva sección: Preferencias de Cuenta -->
    <div class="col-md-6 col-sm-12">
        <div class=" section_container_pop_up">
            <div class="section_login">
                <h3> Actualizaciones y Mantenimiento Continuo </h3>
                <p>El mundo tecnológico evoluciona rápidamente, y entendemos la importancia de mantener tus soluciones actualizadas. Ofrecemos servicios de actualización y mantenimiento continuo para garantizar que tus productos sigan siendo eficientes y seguros a lo largo del tiempo.</p>
            </div>
        </div>
    </div>
    
    <div class="col-md-6">
        <div class="section_container_pop_up">
            <div class="section_login_ofert">
                <h4>Oferta Especial: CreatividadPlus</h4>
                <p>¡Disfruta de un 10% de descuento en tu actual y próximo proyecto creativo! Esta es una oportunidad única para elevar tus ideas con un ahorro especial.</p>
                <h5>Términos y Condiciones</h5>
                <p>
                    <ul>Esta promoción es válida hasta 01 del mes de marzo del 2024.</ul>
                    <ul>Aplicable a proyectos creativos ya existentes o nuevos.</ul>
                    <ul>No acumulable con otras promociones o descuentos.</ul>
                </p>
                <p>
                    En PNOVA STUDIIOS, estamos comprometidos a hacer que cada proyecto sea aún más extraordinario. Aprovecha esta promoción exclusiva como nuestra manera de agradecerte por elegirnos.
                </p>
            </div>
        </div>
    </div>
    <!-- Nueva sección: Notificaciones -->
    <div class="col-md-6">
        <div class="section_container">
            <div class="section_login">
                
                <img class="img_login_pnova" src="/public/img/login.webp" alt="img_user_pnova">

            </div>
        </div>
    </div>
    <!-- Nueva sección: Enviar Mensajes -->
    <div class="col-md-12">
        <div class="section_container_pop_up">
            <div class="section_login ">
                <h4 class="whatsapp_duda">¿Tienes Alguna Duda? Escribenos <a href="https://wa.me/3042142011"><img src="/public/img/whataspp.webp" alt="img_contact_whatsapp"></a></h4>
                
            </div>
        </div>
    </div>

    <div class="col-md-12">
        <div class="section_container_pop_up">
            <div class="section_login">
                <h3 class="service_calif">Dejanos Tú Testimonio.</h3>
                <label for="comment">Escribe aquí:</label>
                <textarea id="comment"  class="form-control_login" placeholder="Dejanos tu comentario...">&#8203;</textarea>
                

                <div class="section_login">
                    <h3 class="service_calif">Califica Nuestro Servicio</h3>
                    <div id="rating-stars">
                        <span class="star" onclick="setRating(1)">★</span>
                        <span class="star" onclick="setRating(2)">★</span>
                        <span class="star" onclick="setRating(3)">★</span>
                        <span class="star" onclick="setRating(4)">★</span>
                        <span class="star" onclick="setRating(5)">★</span>
                    </div>
                    <button id="submitbtn_login" class="submitbtn_login" onclick="submitRating()">Enviar comentario y
                        Calificación</button>
                </div>
            </div>
        </div>
    </div>
    <div class="col-md-6">
        <div class="section_container">

        </div>
    </div>
</div>
</div>
<p class="button-section-login">
Gracias por confiar en PNOVA STUDIIOS para sus servicios web y desarrollo de software. Estamos emocionados por
ser parte de su proyecto. ¡Bienvenido a la familia PNOVA!
<br> Es un honor para nosotros ser parte de su visión y trabajar juntos para alcanzar sus metas digitales. En
PNOVA, nos comprometemos a ofrecerle soluciones de la más alta calidad, impulsadas por la innovación y la
excelencia.
<br><br>Atentamente, El equipo de PNOVA STUDIIOS
<br>

</div>
<div class="p_one_class"
<p >© 2023 PNOVA \ VIGE STUDIIOS , Todos Los Derechos Reservados.</p>
<p >Page created by <span class="fa-solid fa-user-secret"></span>  CristianDevB.  </p>
</div>
    
`;
}

document.addEventListener("DOMContentLoaded", function () {

    var userButton = document.getElementById("userButton");
    var loginButton = document.getElementById("loginButton");
    var token = localStorage.getItem('token');

    if (token) {
        if (userButton) {
            userButton.style.display = "flex";
        }
        if (loginButton) {
            loginButton.style.display = "none";
        }
        if (userButton) {
            userButton.addEventListener("click", mostrarInfoUsuario);
            console.log("Evento de clic registrado en userButton");
        }
        verificarEstadoSesion();
    } else {
        if (userButton) {
            userButton.style.display = "none";
        }
        if (loginButton) {
            loginButton.style.display = "block";
        }
    }

    if (userButton) {
        userButton.addEventListener("click", mostrarInfoUsuario);
        console.log("Evento de clic registrado en userButton");
    }

    var loginForm = document.querySelector(".form_form");
    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();

        var email = document.getElementById("email").value;
        var password = document.getElementById("password").value;

        if (validarCampos(email, password)) {
            iniciarSesion(email, password);
        } else {
            console.error("Por favor, completa todos los campos");
        }
    });
    var storedProfilePicture = localStorage.getItem("profilePicture");
    if (storedProfilePicture) {
        document.getElementById("userImage").src = storedProfilePicture;
    }


    verificarEstadoSesion();
});


function obtenerNombreUsuario() {
    return nombreUsuarioActual || "NombreDeUsuarioPorDefecto";
}








