const databaseURL = 'https://landing-1e79b-default-rtdb.firebaseio.com/collection.json';

let sendData = () => {
    const form = document.getElementById('form');
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    data['fechaRegistro'] = new Date().toLocaleString('es-CO', { timeZone: 'America/Bogota' });

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
    })
    .catch(error => {
        alert('Ocurrió un error al procesar tu solicitud. Por favor, intenta nuevamente.');
        console.error(error);
    });
};

let loaded = () => {
    const form = document.getElementById('form');

    form.addEventListener('submit', function (event) {
        event.preventDefault();

        const emailElement = document.getElementById('inputCorreo');
        const emailText = emailElement.value.trim();
        if (emailText.length === 0) {
            emailElement.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(-5px)' }, { transform: 'translateX(5px)' }, { transform: 'translateX(0)' }], {
                duration: 300,
                iterations: 1
            });
            emailElement.focus();
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
            console.log(data);
            renderData(data);
        })
        .catch(error => {
            console.error('Error:', error); 
        });
};

let renderData = (data) => {
    const container = document.getElementById('dataContainer');
    container.innerHTML = ''; 

    if (data) {
        Object.entries(data).forEach(([key, value]) => {
            const item = document.createElement('div');
            item.className = 'data-item';
            item.innerHTML = `
                <p><strong>Email:</strong> ${value.email}</p>
                <p><strong>Nombre:</strong> ${value.nombre}</p>
                <p><strong>Tipo de Mascota:</strong> ${value.tipoMascota}</p>
                <p><strong>Servicio:</strong> ${value.servicio}</p>
                <p><strong>Fecha Registro:</strong> ${value.fechaRegistro}</p>
                <hr>
            `;
            container.appendChild(item);
        });
    } else {
        container.innerHTML = '<p>No hay datos registrados.</p>';
    }
};

window.addEventListener('load', getData);
window.addEventListener('load', loaded);

