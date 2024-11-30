const databaseURL = 'https://landing-1e79b-default-rtdb.firebaseio.com/collection.json';

let sendData = () => {
    const form = document.getElementById('form');
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    data['fechaRegistro'] = new Date().toLocaleString('es-CO', { timeZone: 'America/Guayaquil' });

    fetch(databaseURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.statusText}`);
        }
        return response.json();
    })
    .then(result => {
        alert('Tu cita fue registrada con éxito. Pronto recibirás un correo con más información.');
        form.reset();
        getData();
    })
    .catch(error => {
        alert('Ocurrió un error al procesar tu solicitud. Por favor, intenta nuevamente.');
        console.error(error);
    });
};


const emailRegex = /^[a-z]([a-z]|[0-9]|\.|_)*@[a-z]+\.[a-z]{2,3}(\.[a-z]{2,3})?$/;

let loaded = () => {
    const form = document.getElementById('form');

    form.addEventListener('submit', function (event) {
        event.preventDefault();

        const emailElement = document.getElementById('inputCorreo');
        const emailText = emailElement.value.trim();

        if (!emailRegex.test(emailText)) {
            emailElement.animate(
                [
                    { transform: 'translateX(0)' },
                    { transform: 'translateX(-5px)' },
                    { transform: 'translateX(5px)' },
                    { transform: 'translateX(0)' }
                ],
                {
                    duration: 300,
                    iterations: 1
                }
            );
            emailElement.focus();
            alert('Por favor, introduce un correo electrónico válido.');
            return;
        }

        sendData();
    });
};


let getData = () => {
    fetch(databaseURL, {
        method: 'GET',
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error al obtener los datos: ${response.statusText}`);
            }
            return response.json(); 
        })
        .then(data => {
            const citasContainer = document.getElementById('citas');
            const listaCitas = document.getElementById('listaCitas');
            citasContainer.innerHTML = '';

            if (data && Object.keys(data).length > 0) {
                Object.entries(data).forEach(([key, cita]) => {
                    const citaDiv = document.createElement('div');
                    citaDiv.classList.add('cita-card');
                    citaDiv.innerHTML = `
                        <p><strong>Correo:</strong> ${cita.email || 'Sin especificar'}</p>
                        <p><strong>Nombre:</strong> ${cita.nombre || 'Sin especificar'}</p>
                        <p><strong>Tipo de Mascota:</strong> ${cita.tipoMascota || 'Sin especificar'}</p>
                        <p><strong>Servicio:</strong> ${cita.servicio || 'Sin especificar'}</p>
                        <p><strong>Fecha de Registro:</strong> ${cita.fechaRegistro || 'Sin especificar'}</p>
                    `;
                    citasContainer.appendChild(citaDiv);
                });
            } else {
                citasContainer.innerHTML = `
                    <div class="no-data-message">
                        <p style="color: rgba(255,255,255,1);">No hay citas registradas en este momento.</p>
                    </div>
                `;
            }

            listaCitas.classList.remove('d-none');
        })
        .catch(error => {
            console.error('Error:', error); 
        });
};


window.addEventListener('load', getData);
window.addEventListener('load', loaded);

