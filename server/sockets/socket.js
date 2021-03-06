const { io } = require('../server');

const { Usuarios } = require('../classes/usuarios');

const usuarios = new Usuarios();

const { crearMensaje } = require('../utilidades/utilidades')

io.on('connection', (client) => {


    client.on('entrarChat', (data, callback) => {

        if (!data.nombre || !data.sala) {
            return callback({
                error: true,
                mensaje: 'El nombre/sala es requerido '
            });
        }

        client.join(data.sala);

        usuarios.agregarPErsona(client.id, data.nombre, data.sala);

        client.broadcast.to(data.sala).emit('listaPErsona', usuarios.getPersonasPorSala(data.sala));


        callback(usuarios.getPersonasPorSala(data.sala));

    });

    client.on('crearMensaje', (data) => {

        let persona = usuarios.getPersona(client.id);

        let mensaje = crearMensaje(persona.nombre, data.mensaje);
        client.broadcast.to(persona.sala).emit('crearMensaje', mensaje);

    });

    client.on('disconnect', () => {

        let personaBorrada = usuarios.borraPersona(client.id);

        client.broadcast.to(personaBorrada.sala).emit('crearMensaje', crearMensaje('Administrador', `${personaBorrada.nombre } salio`));
        client.broadcast.to(personaBorrada.sala).emit('listaPErsona', usuarios.getPersonasPorSala(personaBorrada.sala));
    });

    //Mensaje privado 

    client.on('mensajePrivado', data => {

        let persona = usuarios.getPersona(client.id);

        client.broadcast.to(data.para).emit('mensajePrivado', crearMensaje(persona.nombre, data.mensaje));

    })


});