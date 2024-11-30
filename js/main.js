const databaseURL = 'https://landing-1e79b-default-rtdb.firebaseio.com/celebraciones.json';

const celebracionCount = {
    "Fiesta con otros animales": 0,
    "Sesión de fotos": 0,
    "Comprar un regalo especial": 0,
    "Preparar un pastel para mascotas": 0
};

let sendData = () => {
    const form = document.getElementById('form');
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    data['fechaRegistro'] = new Date().toLocaleString('es-CO', { timeZone: 'America/Guayaquil' });
    data['fechaServicio'] = "";
    data['horaServicio'] = "";
    data['estado'] = "Pendiente";

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
    .then(() => {
        alert('Tu solicitud de registro fué ingresada al sistema con éxito!');
        form.reset();
        updateCelebracionCount(data.celebracion);
        updateUI();
    })
    .catch(error => {
        alert('Ocurrió un error al procesar tu solicitud. Por favor, intenta nuevamente.');
        console.error(error);
    });
};

let updateCelebracionCount = (opcion) => {
    if (celebracionCount[opcion] !== undefined) {
        celebracionCount[opcion]++;
    }
};

let updateUI = () => {
    const resultadosContainer = document.getElementById('resultados');
    resultadosContainer.innerHTML = '';

    Object.entries(celebracionCount).forEach(([opcion, count]) => {
        const card = document.createElement('div');
        card.classList.add('result-card');
        card.innerHTML = `
            <p>${opcion}: <strong>${count}</strong></p>
        `;
        resultadosContainer.appendChild(card);
    });
};

let getData = () => {
    fetch(databaseURL, { method: 'GET' })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error al obtener los datos: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            if (data) {
                Object.values(data).forEach(cita => {
                    if (cita.celebracion && celebracionCount[cita.celebracion] !== undefined) {
                        celebracionCount[cita.celebracion]++;
                    }
                });
            }
            updateUI();
        })
        .catch(error => {
            console.error('Error al cargar datos iniciales:', error);
            alert('Hubo un problema al cargar los datos. Inténtalo más tarde.');
            updateUI();
        });
};

let loaded = () => {
    const form = document.getElementById('form');

    form.addEventListener('submit', function (event) {
        event.preventDefault();
        sendData();
    });

    getData();
};

window.addEventListener('load', loaded);
