var amqp = require('amqplib/callback_api');
var amqp_url = require("./propiedades.json").amqp.url;

//-----------------------------
/*
driver para suscribirse a una cola AMQP RabbitMQ
paramatros:
- cola = nombre de la cola que debe escucharse
- getMensaje = llamada a funcion radicada en el adapter, en donde
el mensaje entrante es procesado y entregado al mw
*/
module.exports = function(cola, getMensaje) {

  var module = {};

  amqp.connect(amqp_url, function(err, conn) {

    var intervalo = setInterval(function(){

      if(conn !== undefined){

        console.log("SUSCRIPTOR: conexion establecida");
        clearInterval(intervalo);

        conn.createChannel(function(err, ch) {
          ch.checkQueue(cola, function(err, q) {
            ch.consume(q.queue, function(buffer) {
              // msg origianl es {fields, properties, content}
              getMensaje(buffer);
              ch.ack(buffer);
            }, {noAck: false});
          });
        });
      }
      else {
        console.log("SUSCRIPTOR: esperando conexion con broker");
      }
    }, 500);
  });

  return module;
};
