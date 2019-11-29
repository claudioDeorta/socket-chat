var socket = io();

var params = new URLSearchParams(window.location.search);


// valida que venga el nombre como parametro 
if (!params.has('nombre') || !params.has('sala')) {
    window.location = 'index.html';
    throw new Error('El nombre y sala  son nesesario');

}

//tomo el valor de los parametros y los guardo en objeto nombre
var usuario = {
    nombre: params.get('nombre'),
    sala: params.get('sala')
};


socket.on('connect', function() {
    console.log('Conectado al servidor');
    socket.emit('entrarChat', usuario, function(resp) {
        console.log('Usuarios conectados ', resp);
    });
});

// escuchar
socket.on('disconnect', function() {

    console.log('Perdimos conexión con el servidor');

});


// Enviar información
/*socket.emit('crearMensaje', {
    usuario: 'Fernando',
    mensaje: 'Hola Mundo'
}, function(resp) {
    console.log('respuesta server: ', resp);
});*/

// Escuchar información
socket.on('crearMensaje', function(mensaje) {

    console.log('Servidor:', mensaje);

});

//Escucha cuando un usuario emtra o sale del chat 

socket.on('listaPErsona', function(personas) {

    console.log(personas);

});

// Mensajes privado 

socket.on('mensajePrivado', function(mensaje) {

    console.log('Mensaje privado :', mensaje);

});