window.onload = function () {
    obtenerUsuarios();
};

function validarFormularioInmueble() {
    let usuario = document.getElementById('selectUsuario');
    let tipo = document.getElementById('selectTipo');
    let direccion = document.getElementById('inputDireccion');
    let ciudad = document.getElementById('inputCiudad');
    let region = document.getElementById('inputRegion');
    let metros = document.getElementById('inputMetros');
    let habitaciones = document.getElementById('inputHabitaciones');
    let valor = document.getElementById('inputValor');
    let estado = document.getElementById('selectEstado');
    let uso = document.getElementById('selectUso');
    let formularioValido = true;

    if (!validarCampo(usuario)) formularioValido = false;
    if (!validarCampo(tipo)) formularioValido = false;
    if (!validarCampo(direccion)) formularioValido = false;
    if (!validarCampo(ciudad)) formularioValido = false;
    if (!validarCampo(region)) formularioValido = false;
    if (!validarCampo(metros)) formularioValido = false;
    if (!validarCampo(habitaciones)) formularioValido = false;
    if (!validarCampo(valor)) formularioValido = false;
    if (!validarCampo(estado)) formularioValido = false;
    if (!validarCampo(uso)) formularioValido = false;

    if (formularioValido) {
        const formulario = document.getElementById('registroInmueble');
        const datosFormulario = new FormData(formulario);
        const data = Object.fromEntries(datosFormulario.entries());

        enviarInmueble(data, formulario);
    } else {
        alert('Complete todos los datos antes de enviar el formulario.');
    }
}

function validarCampo(campo) {
    if (campo.value == '') {
        campo.classList.add('is-invalid', 'alerta');
        return false;
    } else {
        campo.classList.remove('is-invalid', 'alerta');
        campo.classList.add('is-valid');
        return true;
    }
}

async function obtenerUsuarios() {
    try {
        const respuesta = await fetch('http://localhost:3000/usuarios');
        const usuarios = await respuesta.json();

        const selectUsuario = document.getElementById('selectUsuario');

        Object.entries(usuarios).forEach(([key, usuario]) => {
            const opcion = document.createElement('option');
            opcion.value = usuario._id;
            opcion.textContent = usuario.nombre + ' - ' + usuario.rut;
            selectUsuario.appendChild(opcion);
        });
    } catch (error) {
        console.log('Error: ', error);
    }
}

async function enviarInmueble(data, formulario) {
    try {
        const respuesta = await fetch('http://localhost:3000/guardarInmueble', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const info = await respuesta.json();
        console.log('Datos correctamente almacenados: ', info);

        if (respuesta.ok) {
            formulario.reset();
            alert('Inmueble registrado correctamente.');
        }
    } catch (error) {
        console.log('Error al guardar los datos: ', error);
    }
}