const databaseURL = "https://landing-d867a-default-rtdb.firebaseio.com/coleccion.json";

let sendData = () => {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    data["saved"] = new Date().toLocaleDateString("es-CO", {timeZone: "America/Guayaquil"})

    fetch(databaseURL, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.statusText}`);
        }
        return response.json(); // Procesa la respuesta como JSON
    })
    .then(result => {
        alert('Agradeciendo tu preferencia, nos mantenemos actualizados y enfocados en atenderte como mereces'); // Maneja la respuesta con un mensaje
        form.reset();

        //Recupeacion de datos
        getData();
    })
    .catch(error => {
        alert('Hemos experimentado un error. ¡Vuelve pronto!'); // Maneja el error con un mensaje
    });
}

let getData = async () => {
    try{
        // Realiza la petición fetch a la URL de la base de datos
        const response = await fetch(databaseURL, {
            method: 'GET'
        });
        
         // Verifica si la respuesta es exitosa
         if(!response.ok){
            alert("Hemos experimentado un error. ¡Vuelva pronto!");
         }

         const data = await response.json();

         if(data != null){
            //Cuente el número de suscriptores registrados por fecha a partir del objeto data

            let countSuscribers = new Map()

            if(Object.keys(data).length > 0){
                for(let key in data){

                    let { email, saved } = data[key];

                    let date = saved.split(",")[0];

                    let count = countSuscribers.get(date) || 0;
                    countSuscribers.set(date, count + 1);
                }
            }
         	// END

             // Genere y agregue filas de una tabla HTML para mostrar fechas y cantidades de suscriptores almacenadas 
            if (countSuscribers.size > 0){
                subscribers.innerHTML = ""

                let index = 1;
                for(let [date, count] of countSuscribers){
                    let rowTemplate = `
                        <tr>
                            <th>${index}</th>
                            <td>${date}</td>
                            <td>${count}</td>
                        </tr>`
                subscribers.innerHTML += rowTemplate;
                index++;
                }
            }

             // END

         }

    } catch(error){
        
        alert('Hemos experimentado un error. ¡Vuelve pronto!'); 
    }
}

let ready = () => {
    console.log("DOM está listo");

    //Recuperacion de datos
    getData();
}

let loaded = (eventLoaded) => {
    let myform = document.getElementById("form")
    myform.addEventListener("submit", (eventSubmit) => {
        eventSubmit.preventDefault()
        const emailElement  = document.querySelector(".form-control-lg");
        const emailText = emailElement.value;

        if (emailText.length === 0) {
            emailElement.animate(
                [
                    { transform: "translateX(0)" },
                    { transform: "translateX(50px)" },
                    { transform: "translateX(-50px)" },
                    { transform: "translateX(0)" }
                ],
                {
                    duration: 400,
                    easing: "linear",
                }
            )
            emailElement.focus()

            return;
            
        }

        sendData();
    })

   
}


window.addEventListener("DOMContentLoaded", ready)
window.addEventListener("load", loaded)

