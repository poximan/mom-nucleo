var amqp = require('amqplib/callback_api');
var amqp_url = require("./propiedades.json").amqp.url;

//-----------------------------
/*
driver publicador AMQP RabbitMQ
paramatros:
- ex = nombre del exchange que recibira el mensaje ruteado en amqp_url
*/
module.exports = function(ex) {

  var module = {};
  let opciones = {persistent: true, contentType: 'application/json'};

  module.canal;

  amqp.connect(amqp_url, function(err, conn) {

    var intervalo = setInterval(function(){

      if(conn !== undefined){

        console.log("PUBLICADOR: conexion establecida");
        clearInterval(intervalo);

        conn.createChannel(function(err, ch) {
          module.canal = ch;
        });
      }
      else {
        console.log("PUBLICADOR: esperando conexion con broker");
      }
    }, 500);
  });

  module.publicar = function(reglas_ruteo, buffer){
    module.canal.publish(ex, reglas_ruteo, buffer, opciones);
  }

  return module;
};
