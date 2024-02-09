window.addEventListener("load", () => {
    const form = document.querySelector("#form");
    const email = document.querySelector("#email");
    const message = document.querySelector("#message");

    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        
        const response = await fetch("https://api.pnovastudios.xyz/auth/activation", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email.value,
            }),
        });

        const json = await response.json()

        console.log(json)

        if(response.status !== 200){
            message.style.display = "block";
            message.style.color = "rgb(122, 14, 14)";
            message.innerHTML = json.message;
            return;
        }

        alert(json.message+'. Seras redirigido a la pagina principal en unos segundos.')
        setTimeout(() => {
            window.location = '/home'
        }, 1000)
        
    });
});



window.addEventListener('load', async (event) => {
    const text = document.querySelector('#text')

    const url = window.location.search;
    const urlParams = new URLSearchParams(url);
    text.innerHTML = "Espera unos segundos, estamos activando tu email..."

    const token = urlParams.get('token')

    localStorage.setItem('activationToken', token);

    const rta = await fetch('https://api.pnovastudios.xyz/auth/activate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({token: token})
    })
    console.log(rta)
    if(!rta.ok){
        text.className = 'error'
        text.innerHTML = `Hemos tenido dificultades en activar tu cuenta. si han pasado mas de 15 minutos vuelve a solicitar un nuevo correo de activacion. </br>
        Lamentamos todos los inconvenientes. </br> <a class="regedittoken" href="/sendEmailValidate">${"Solicita un nuevo email aqui."}</a>`
        return;
    }
    
    text.className = 'ok'
    text.innerHTML = "Tu cuenta ha sido activada con exito, en unos segundos seras redirigido a la pagina principal..."
    setTimeout(() => {
        window.location = 'https://pnovastudios.xyz'
    }, 5000)
})
