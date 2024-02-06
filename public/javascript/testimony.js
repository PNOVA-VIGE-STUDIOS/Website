let rating = 0;

function generarEstrellas(rate) {
    let estrellasHTML = '';
    for (let i = 1; i <= 5; i++) {
        estrellasHTML += `<span class="star"${i <= rate ? ' style="color: chocolate; height : 100% ;font-size: 1.5em;box-shadow: 5px 5px 10px #eceaea, -5px -5px 10px #f3f2f2;padding: 4px; display: flex;justify-content: center;align-items: center; border-radius: 12px"' : ''}>&#9733;</span>`;
    }
    return estrellasHTML;
}


function setRating(value) {
    rating = value;
    highlightStars(value);
}

function highlightStars(value) {
    for (let i = 1; i <= 5; i++) {
        const star = document.querySelector(`.star:nth-child(${i})`);
        star.style.color = i <= value ? 'chocolate' : '#000';
    }
}

function submitRating() {
    const message = document.getElementById("comment").value;

    const data = {
        "rate": rating,
        "message": message
    };

    const token = localStorage.getItem('token');





    // ...Pnova services rates

    fetch("https://api.pnovastudios.xyz/rates/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(data)
    })
        .then(response => {
            if (response.status === 401) {
                throw new Error("Unauthorized: Debes adquirir un servicio para poder comentarlo");
            } else if (response.status === 500) {
                throw new Error("Internal Server Error: Solo puedes comentar el servicio una única vez; Muchas gracias.");
            }

            return response.json();
        })
        .then(result => {
            console.log(result);

            if (result.error) {
                alert("Hubo un error al enviar la calificación, intenta luego.");
            } else {
                const paginaActual = window.location.pathname;
                agregarTestimonio(result, paginaActual);
                alert("Calificación enviada con éxito");
            }
        })
        .catch(error => {
            console.error("Error al enviar la calificación:", error.message);

            if (error.message.includes("Unauthorized")) {
                alert("Debes adquirir un servicio para poder comentarlo");
            } else if (error.message.includes("Internal Server Error")) {
                alert(" Solo puedes comentar el servicio una única vez, Muchas gracias por tú tiempo.");
            } else {
                alert("Error desconocido. Por favor, inténtalo de nuevo más tarde.");
            }
        });


}



function agregarTestimonio(testimonio, paginaActual) {
    const userId = testimonio.userId._id;
    const urlImagenUsuario = testimonio.userId.profilePicture;

    const testimonioHTML = `
        <div class="testimonial">
            <div class="testimonial-content">
                <div class="testimonial-avatar">
                    <img src="${urlImagenUsuario}" alt="${userId}">
                </div>
                <p class="p_testimonial">${testimonio.message}</p>
                <p class="author">${testimonio.userId.name} ${testimonio.userId.lastName}</p>
                <div class="star-rating" data-rating="${testimonio.rate}">
                    ${generarEstrellas(testimonio.rate)}
                </div>
            </div>
        </div>
    `;

    document.querySelector('#send_data').insertAdjacentHTML('beforeend', testimonioHTML);
}

function cargarTestimonios() {
    console.log('cargarTestimonios called');

    const token = localStorage.getItem('token');

    fetch("https://api.pnovastudios.xyz/rates/", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
    })
        .then(response => response.json())
        .then(testimonios => {
            testimonios.forEach(testimonio => {
                agregarTestimonio(testimonio);
            });
        })
        .catch(error => {
            console.error("Error al cargar los testimonios:", error);
            alert("Hubo un error al cargar los testimonios");
        });
}

document.addEventListener("DOMContentLoaded", cargarTestimonios);

document.addEventListener("DOMContentLoaded", function () {
    const starContainers = document.querySelectorAll(".star-rating");

    starContainers.forEach((container) => {
        const stars = container.querySelectorAll(".star");

        stars.forEach((star) => {
            star.addEventListener("click", () => {
                const value = star.getAttribute("data-value");
                container.setAttribute("data-rating", value);

                stars.forEach((s) => {
                    s.classList.remove("active");
                });

                for (let i = 1; i <= value; i++) {
                    stars[i - 1].classList.add("active");
                }
            });

            star.addEventListener("mouseover", () => {
                const value = star.getAttribute("data-value");

                stars.forEach((s) => {
                    s.classList.remove("active");
                });

                for (let i = 1; i <= value; i++) {
                    stars[i - 1].classList.add("active");
                }
            });

            star.addEventListener("mouseout", () => {
                const rating = container.getAttribute("data-rating");

                stars.forEach((s, index) => {
                    if (index < rating) {
                        s.classList.add("active");
                    } else {
                        s.classList.remove("active");
                    }
                });
            });
        });
    });
});
