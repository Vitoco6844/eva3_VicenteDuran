// Importamos las librerías instaladas
const express = require('express'); // Express permite generar la aplicación backend
const cors = require('cors'); // Cors permite que el servidor reciba solicitudes externas
const mongoose = require('mongoose'); // ORM que permite trabajar con objetos y DBs
const bcrypt = require('bcrypt');

// Iniciar la aplicación express
const aplicacion = express();
const puerto = 3000;

// Instanciar las clases necesarias en nuestra aplicación
aplicacion.use(cors());
aplicacion.use(express.json());

// Crear la conexión a DB
mongoose.connect('mongodb://localhost:27017/AP_N3_C1')
    .then(() => console.log('Conexión Exitosa!'))
    .catch((excepcion) => console.log('No ha sido posible conectarse por el siguiente error: ', excepcion));

const port = process.env.port || 3000;
aplicacion.listen(puerto, () => console.log(`Corriendo en el puerto ${port}`))

const comuna = new mongoose.Schema({
    codigo: String,
    nombre: String,
    region: String
});
// Crear un OBJETO en base al MODELO comuna
const Comuna = mongoose.model('Comuna', comuna, 'comunas');

const direccion = new mongoose.Schema({
    comuna: String,
    calle: String,
    numero: String,
    departamento: String
});

// Crear el MODELO de datos
const usuario = new mongoose.Schema({
    nombre: String,
    rut: String,
    correo: String,
    telefono: String,
    fechaNacimiento: Date,
    nacionalidad: String,
    genero: String,
    direccion: [direccion],
    contrasena: String,
    fechaRegistro: {
        type: Date,
        default: Date.now
    },
    activo: {
        type: Boolean,
        default: true
    }
});
// Crear un OBJETO en base al MODELO usuario
const Usuario = mongoose.model('Usuario', usuario, 'usuarios');

const inmueble = new mongoose.Schema({
    usuario: mongoose.Schema.Types.ObjectId,    // El campo usuario guardará el _id de un usuario de MongoDB.
    tipo: String,
    direccion: String,
    ciudad: String,
    region: String,
    metrosCuadrados: Number,
    habitaciones: Number,
    valor: Number,
    estado: String,
    uso: String
});

const Inmueble = mongoose.model('Inmueble', inmueble, 'inmuebles');

const pais = new mongoose.Schema({
    nombre: String,     
    iso2: String,
    iso3: String,
    codigoPais: String,
    nacionalidad: String
});
// Crear un OBJETO en base al MODELO usuario
const Pais = mongoose.model('Pais', pais, 'paises');

// Crear el método para CREAR esos objetos en DB
aplicacion.post('/guardarUsuario', async (request, response) => {
    try {
        const { nombre, correo, rut, telefono, contrasena, fechaNacimiento, genero, nacionalidad, direccion } = request.body;

        const saltRounds = 10;
        const contrasenaEncriptada = await bcrypt.hash(contrasena, saltRounds);

        const jsonDireccion = JSON.parse(direccion);

        const nuevoUsuario = new Usuario({ nombre, correo, rut, telefono, contrasena: contrasenaEncriptada, fechaNacimiento, genero, nacionalidad, direccion: jsonDireccion });

        await nuevoUsuario.save();
        response.status(200).json({ mensaje: 'Datos almacenados correctamente.' });
    } catch (excepcion) {
        response.status(500).json({ mensaje: 'No se han podido almacenar los datos: ', excepcion });
    }
});

aplicacion.post('/guardarInmueble', async (request, response) => {
    try {
        const { usuario, tipo, direccion, ciudad, region, metrosCuadrados, habitaciones, valor, estado, uso } = request.body;

        const nuevoInmueble = new Inmueble({
            usuario,
            tipo,
            direccion,
            ciudad,
            region,
            metrosCuadrados,
            habitaciones,
            valor,
            estado,
            uso
        });

        await nuevoInmueble.save();
        response.status(200).json({ mensaje: 'Datos almacenados correctamente.' });
    } catch (excepcion) {
        response.status(500).json({ mensaje: 'No se han podido almacenar los datos: ', excepcion });
    }
});

// Se utiliza aggregate porque permite usar $lookup.
// $lookup relaciona la colección inmuebles con usuarios,
// para mostrar los datos del inmueble junto al usuario asociado.
aplicacion.get('/inmuebles', async (request, response) => {
    try {
        const inmuebles = await Inmueble.aggregate([
            {
                $lookup: {
                    from: 'usuarios',
                    localField: 'usuario',
                    foreignField: '_id',
                    as: 'datosUsuario'
                }
            }
        ]);
        
        if (!inmuebles || inmuebles.length === 0) {
            return response.status(404).json({ mensaje: 'No se encontraron inmuebles registrados.' });
        }

        response.status(200).json(inmuebles);
    } catch (error) {
        response.status(500).json({ mensaje: 'No ha sido posible obtener los inmuebles: ', error })
    }
});

// Crear método para obtener objetos desde la DB
aplicacion.get('/usuarios', async (request, response) => {
    try {
        const usuarios = await Usuario.find().exec();
        if (!usuarios || usuarios.length === 0) {
            return response.status(404).json({ mensaje: 'No se encontraron usuarios registrados.' });
        }

        response.status(200).json(usuarios);
    } catch (error) {
        response.status(500).json({ mensaje: 'No ha sido posible obtener los usuarios: ', error })
    }
});

aplicacion.get('/paises', async (request, response) => {
    try {
        const paises = await Pais.find().exec();
        if (!paises || paises.length === 0) {
            return response.status(404).json({ mensaje: 'No se encontraron países registrados.' });
        }

        response.status(200).json(paises);
    } catch (error) {
        response.status(500).json({ mensaje: 'No ha sido posible obtener los países: ', error })
    }
});

aplicacion.get('/comunas', async (request, response) => {
    try {
        const comunas = await Comuna.find().exec();
        if (!comunas || comunas.length === 0) {
            return response.status(404).json({ mensaje: 'No se encontraron comunas registradas.' });
        }

        response.status(200).json(comunas);
    } catch (error) {
        response.status(500).json({ mensaje: 'No ha sido posible obtener las comunas: ', error })
    }
});