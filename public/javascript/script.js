// Sección del carrusel
document.addEventListener('DOMContentLoaded', function () {



    const cards = document.querySelectorAll('.section__card');
    const prevButton = document.querySelector('.carousel__control.prev');
    const nextButton = document.querySelector('.carousel__control.next');
    let currentCardIndex = 0;

    const showCard = (index, direction) => {
        cards.forEach(card => card.style.transition = 'none');

        cards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = `translateX(${direction === 'next' ? '-' : ''}100%)`;
            card.classList.remove('show');
            { }
        });

        cards[index].classList.add('show');

        setTimeout(() => {
            cards.forEach(card => card.style.transition = 'opacity 0.5s, transform 0.5s');
            cards[index].style.opacity = '1';
            cards[index].style.transform = 'translateX(0)';
        }, 50);
    };

    const changeCard = (increment, direction) => {
        currentCardIndex = (currentCardIndex + increment + cards.length) % cards.length;
        showCard(currentCardIndex, direction);
    };

    const autoScroll = () => {
        changeCard(-1, 'next');
    };

    prevButton.addEventListener('click', (event) => {
        event.preventDefault();
        changeCard(-1, 'prev');
    });

    nextButton.addEventListener('click', (event) => {
        event.preventDefault();
        changeCard(1, 'next');
    });

    let autoScrollInterval = setInterval(autoScroll, 5000);

    const carouselSection = document.querySelector('.carousel-section');
    carouselSection.addEventListener('mouseenter', () => {
        clearInterval(autoScrollInterval);
    });

    carouselSection.addEventListener('mouseleave', () => {
        autoScrollInterval = setInterval(autoScroll, 5000);
    });

    showCard(currentCardIndex, 'next');
});





// seccion mostrar mensajes de exito y Bienvenida a la pag 

function mostrarMensajeExito() {
    const mensajeExito = "¡Datos enviados con éxito!";
    const mensajeContainer = document.getElementById("mensaje-exito-container");

    if (mensajeContainer) {
        mensajeContainer.innerHTML = mensajeExito;


        const mensajeBienvenida = document.createElement('div');
        mensajeBienvenida.textContent = 'Bienvenido a Pnova Studios, revisa tu correo electrónico para validar el registro';
        mensajeBienvenida.classList.add('mensaje-bienvenida');
        document.body.appendChild(mensajeBienvenida);
    }
}



// Sección del formulario
$(document).ready(function () {
    const showFormBtn = $("#showFormBtn");
    const formContainer = $("#formContainer");
    const closeFormBtn = $(".closeBtn");
    const registroBtn = $("#registroBtn");

    function closeForm() {
        formContainer.css("visibility", "hidden");
        $("body").css("overflow", "");
    }

    function enviarFormulario() {
        const name = $("#name").val();
        const lastName = $("#lastName").val();
        const username = $("#username").val();
        const password = $("#password").val();
        const email = $("#email").val();

        const formData = {
            name,
            lastName,
            username,
            password,
            email
        };

        $.ajax({
            type: "POST",
            url: "https://api.pnovastudios.xyz/users",
            contentType: "application/json",
            data: JSON.stringify(formData),
        })
            .done(function () {
                console.log('Formulario, terminos y condiciones enviados con éxito');
                mostrarMensajeExito();
                alert('Bienvenido a Pnova Studios, revisa tu correo electronico para validar el registro');

                setTimeout(function () {
                    closeForm();
                }, 5000);
            })
            .fail(function (xhr, textStatus, errorThrown) {
                console.error('Error al enviar los datos:', errorThrown);
                console.log('Respuesta del servidor:', xhr.responseText);
                alert('Hubo un error al enviar los datos. Por favor, inténtelo de nuevo.');

                closeForm();
            });
    }

    function validarFormulario() {
        const name = $("#name").val();
        const lastName = $("#lastName").val();
        const username = $("#username").val();
        const password = $("#password").val();
        const email = $("#email").val();
        const agreeCheckbox = $("#agree").prop("checked");


        if (!name || !lastName || !username || !password || !email) {
            alert("Por favor, completa todos los campos del formulario.");
            return false;
        }


        const regex = /^[a-zA-Z\s]*$/;
        if (!regex.test(name) || !regex.test(lastName)) {
            alert("Por favor, ingresa solo letras en los campos de nombres y apellidos.");
            return false;
        }


        if (!agreeCheckbox) {
            alert("Debes aceptar los términos y condiciones para registrarte.");
            return false;
        }

        enviarFormulario();
        return true;
    }

    showFormBtn.on("click", function (event) {
        event.preventDefault();
        if (formContainer.css("visibility") === "visible") {
            closeForm();
        } else {
            formContainer.css("visibility", "visible");
            $("body").css("overflow", "hidden");
        }
    });

    closeFormBtn.on("click", closeForm);

    $(document).on("keydown", function (event) {
        if (event.key === "Escape") {
            closeForm();
        }
    });

    registroBtn.on("click", function (event) {
        event.preventDefault();
        if (validarFormulario()) {
            setTimeout(function () {
                closeForm();
            }, 10000);
        }
    });

});

// section new  Pnova


const readMoreButtons = document.querySelectorAll('.read-more');

readMoreButtons.forEach(button => {
    button.addEventListener('click', function (event) {
        event.preventDefault();

        const blogCard = button.closest('.blog-card');
        const hiddenContent = blogCard.querySelector('.hidden-content');

        if (hiddenContent.style.display === 'none') {
            hiddenContent.style.display = 'block';
            button.textContent = 'Mostrar menos';
        } else {
            hiddenContent.style.display = 'none';
            button.textContent = 'Mostrar más';
        }
    });
});

$(document).ready(function () {
    $(".navbar .nav-link").on('click', function (event) {
        if (this.hash !== "") {
            event.preventDefault();

            var hash = this.hash;

            $('html, body').animate({
                scrollTop: $(hash).offset().top
            }, 700, function () {
                window.location.hash = hash;
            });
        }
    });
});


$(window).on("load", function () {
    var t = $(".portfolio-container");
    t.isotope({
        filter: ".new",
        animationOptions: {
            duration: 750,
            easing: "linear",
            queue: !1
        }
    });

    $(".filters a").click(function () {
        $(".filters .active").removeClass("active");
        $(this).addClass("active");
        var i = $(this).attr("data-filter");
        return t.isotope({
            filter: i,
            animationOptions: {
                duration: 750,
                easing: "linear",
                queue: !1
            }
        }), !1
    });
});




