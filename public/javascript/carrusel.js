$(document).ready(function () {
    configurarArticulo('article-1', obtenerConteoLocal('article-1'));
    configurarArticulo('article-2', obtenerConteoLocal('article-2'));
    configurarArticulo('article-3', obtenerConteoLocal('article-3'));
    configurarArticulo('article-4', obtenerConteoLocal('article-4'));
    configurarArticulo('article-5', obtenerConteoLocal('article-5'));
});

function configurarArticulo(articleId, initialLikeCount) {
    // Configuración inicial
    $(`.like-btn[data-article-id="${articleId}"] .like-count`).text(initialLikeCount);

    // Manejar clics en el botón de "like" para el evento de like Penova
    $(document).on("click", `.like-btn[data-article-id="${articleId}"]`, function (event) {
        event.preventDefault();
        darLike(articleId);
    });
}

function darLike(articleId) {
    const likeCountElement = $(`.like-btn[data-article-id="${articleId}"] .like-count`);
    let currentLikeCount = parseInt(likeCountElement.text(), 10);

    currentLikeCount += 1;
    likeCountElement.text(currentLikeCount);

    // Guardar el conteo localmente. sin saturar nada! no se preocupen :) 
    guardarConteoLocal(articleId, currentLikeCount);

    // Sincronizar el conteo con el servidor/ a espera del señor back
    sincronizarLikesConServidor(articleId, currentLikeCount);
}

function guardarConteoLocal(articleId, likeCount) {
    // Utilizar localStorage para almacenar el conteo
    localStorage.setItem(`likeCount_${articleId}`, likeCount);
}

function obtenerConteoLocal(articleId) {
    // Obtener el conteo localmente desde localStorage l/ ojo es lo mas impornte para que esto sea bueno!
    return parseInt(localStorage.getItem(`likeCount_${articleId}`)) || 0;
}



function buildPriceCard(service) {
    console.log('buildPriceCard called with service:', service);

    var deliveryTime = service.deliverTime ? service.deliverTime + ' días' : 'Tiempo de entrega no especificado';

    var formattedPrice = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(service.price);

    var statusIcon = service.meta.isActive ? '<img class="active_services" src="/public/img/active.webp" alt="Activo">' : '<img src="x.png" alt="Inactivo">';

    var characteristicsList = service.characteristics.map((characteristic) => '<li>' + characteristic + '</li>').join('');

    var priceCard = $('<div class="col-sm-12 col-md-12 col-lg-6 col-xl-4">' +

        '<div class="price-card text-center mb-5 pb-5 ">' +
        '<h3 class="price-card-title">' + statusIcon + service.name + '</h3>' +
        '<img class="img_price" src="' + service.faviconUrl + '" alt="' + service.name + '">' +
        '<div class="price-card-cost">' +
        '<span class="num">' + formattedPrice + '</span><br>' +
        '<span class="date">PESOS.COL</span>' +
        '</div>' +
        '<ul class="list">' +
        '<li class="money">' + service.description + '</li>' +
        '<li class="money_2">Tiempo de entrega: ' + deliveryTime + '</li>' +
        '<li>Características:</li>' +
        '<ul class="caracteristics">' +
        characteristicsList +
        '</ul>' +
        '</ul>' +
        '<a class="btn-rounded" href="https://wa.me/3042142011">&#8203;</a>' +
        '</div>' +
        '</div>');

    console.log('Price card built for service:', service.name);
    return priceCard;
}






function updatePrices(data) {
    console.log('updatePrices called');

    var priceContainer = $('#price-container');
    var existingServices = new Set();


    priceContainer.empty();

    data.forEach(function (service) {
        if (!existingServices.has(service._id)) {
            var priceCard = buildPriceCard(service);
            priceContainer.append(priceCard);
            existingServices.add(service._id);
        }
    });
}





$(document).ready(function () {
    $.ajax({
        url: 'https://api.pnovastudios.xyz/services',
        type: 'GET',
        dataType: 'json',
        followRedirects: true,
        cache: false,

        success: function (data) {
            updatePrices(data);
        },
        error: function (xhr, status, error) {
            console.error('Error al cargar datos desde la API:', error);
            $('#price-container').html('<p>Error al cargar los datos. Por favor, inténtalo de nuevo más tarde.</p>');
        }
    });
});




document.addEventListener("DOMContentLoaded", function () {
    setTimeout(function () {
        document.getElementById("whatsapp-button").style.display = "block";
    }, 4000);

    setTimeout(function () {
        document.getElementById("whatsapp-popup").style.display = "block";
    }, 8000);

    document.getElementById("whatsapp-button").addEventListener("click", function () {
        togglePopup();
    });

    window.addEventListener("keydown", function(event) {
        if (event.key === "Escape") {
            minimizarPopup("whatsapp-popup");
            minimizarPopup("popup");
        }
    });

   
});

function togglePopup() {
    var popup = document.getElementById("whatsapp-popup");
    if (popup.style.display === "block") {
        popup.style.display = "none";
    } else {
        popup.style.display = "block";
    }
}

function minimizarPopup() {
    var popup = document.getElementById("whatsapp-popup");
    popup.style.display = "none";
}







