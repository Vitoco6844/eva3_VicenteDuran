window.onload = function () {
    obtenerInmuebles();
};

async function obtenerInmuebles() {
    try {
        const respuesta = await fetch('http://localhost:3000/inmuebles');
        const inmuebles = await respuesta.json();
        
        console.log(inmuebles);
        new DataTable('#tablaInmuebles',{
            data:inmuebles,
            columns:[
                {
                    data: 'datosUsuario',
                    render: function (datosUsuario) {
                        if (datosUsuario.length > 0) {
                            return datosUsuario[0].nombre;
                        }
                        return 'Sin usuario';
                    }
                },
                {
                    data: 'datosUsuario',
                    render: function (datosUsuario) {
                        if (datosUsuario.length > 0) {
                            return datosUsuario[0].rut;
                        }
                        return 'Sin RUT';
                    }
                },
                {data:'tipo'},
                {data:'direccion'},
                {data:'ciudad'},
                {data:'region'},
                {data:'metrosCuadrados'},
                {data:'habitaciones'},
                {data:'valor'},
                {data:'estado'},
                {data:'uso'}
            ]
        })
    } catch (error) {
        console.log('Error: ', error);
    }
}