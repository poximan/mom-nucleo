# Núcleo MOM (middleware-oriented message)
Componente central de una arquitectura mom (message-oriented middleware). Basado en intercambio de mensajes asincronicos con soporte de eventEmitter. No esta ligado a ningún negocio particular.

![](https://github.com/poximan/mom-nucleo/tree/master/imagenes/nucleo.png "Arquitectura")<br/>

## Caso de estudio
Aquí https://github.com/poximan/mama_node hay caso de estudio completo que implementa este modulo.<br/>

## Configuración inicial
En propiedades.json debe especificarse:
* El nombre del broker de mensajería, que debe coincidir con una implementación dentro de ./strategies.js.
Deben implementarse todas sus interfaces.
* La url de conexión al servidor de mensajería usado.<br/>

## Parámetros
param 1 = {entero} indice del que es responsable en reloj vectorial.

param 2 = {string} nombre de la cola MOM que escucha este servidor.

param 3 = {Object mom-bus-comunic} instancia de bus para gestión de eventos. Ver https://www.npmjs.com/package/mom-bus-comunic

param 4 = {String[.String]...} lista de suscriptores del servidor dado. Por ejemplo "server1.server2" para 2 suscriptores, "server3.server4.server5" para 3 suscriptores, o "" para 0 suscriptores.

param 5 = {entero} cantidad de confirmaciones externas para fin corte consistente. Solo útil cuando incluye modulo de corte consistente https://www.npmjs.com/package/mom-corte-consistente.

param 6 = {[Object]} Estado actual del servidor. Es el arreglo de valores en memoria dinámica.

param 7 = {Function} llamada a función de persistencia del negocio.<br/>

## Modo de uso

### Alta middleware
```
var mw = require("mom-nucleo")(
  mi_reloj,
  cola_escucha,
  bus,
  suscriptores,
  corte_resp_esperadas,
  [estado_actual],
  funcionPersistencia
);
```
Se requiere una instancia de modulo middleware para control de una arquitectura MOM. No tiene dependencias con el negocio.

### Publicar a destinatario(s) definidos
```
mw.publicar(suscriptores, evento)
```
param1 = {String[.String]...} lista de suscriptores que recibirán el mensaje en sus cola de escucha. Por ejemplo "server1.server2" para 2 suscriptores, "server3.server4.server5" para 3 suscriptores, o "" para 0 suscriptores.

param2 = carga útil del mensaje. De formato json libre.
Los mensajes entrantes/salientes se construyen pensando en capas. Cada capa tiene su encabezado. El middleware solo lee y escribe su capa, por lo tanto la carga útil (este parámetro) no esta acoplado al middleware, pudiendo ser de formato a medida del negocio.

### Publicar un pedido de corte consistente
```
mw.propagarCorte()
```
publicador similar al anterior, en cuanto que respeta el concepto de capas. Trabaja exclusivamente para el modulo de Corte Consistente (https://www.npmjs.com/package/mom-corte-consistente).
Propaga el corte por todos los canales AMQP abiertos que tenga el servidor dado.

### Terceros: Reloj vectorial -> Incrementar reloj
```
mw.incrementar();
```
Ofrece servicio de incremento de indice a las capas superiores, que es donde se generan estas solicitudes.
La operación es de delegación, el responsable es el modulo de reloj vectorial (ver https://www.npmjs.com/package/mom-reloj-vect)

### Terceros: Reloj vectorial -> Pedir el Reloj
```
mw.vector();
```
Ofrece servicio de estado actual del vector de relojes a las capas superiores.
La operación es de delegación, el responsable es el modulo de reloj vectorial (ver https://www.npmjs.com/package/mom-reloj-vect)

### Terceros: Reloj vectorial -> Pedir indice
```
mw.indice();
```
Ofrece servicio de posición en el vector de relojes, a las capas superiores.
La operación es de delegación, el responsable es el modulo de reloj vectorial (ver https://www.npmjs.com/package/mom-reloj-vect)

### Terceros: Corte Consistente -> socket del monitor
```
mw.sockRespuesta(socket);
```
Ofrece servicio de socket abierto con concentrador/monitor al modulo de corte consistente.
La operación es reactiva, cuando se abre un socket monitor-servidor, se notifica.

### Terceros: Corte Consistente -> Corte en proceso
```
mw.corteEnProceso();
```
Ofrece información sobre si esta ejecutándose (o no) un corte consistente, a las capas superiores. Salva errores como persistir en BD el negocio durante un corte.
La operación es de delegación, la respuesta llega desde  el modulo de corte consistente (ver https://www.npmjs.com/package/mom-corte-consistente)

### Terceros: Corte Consistente -> Solicitud de corte
```
mw.iniciarCorte();
```
Ofrece servicio de iniciar corte consistente, a las capas superiores.
La operación es de delegación, la respuesta llega desde  el modulo de corte consistente (ver https://www.npmjs.com/package/mom-corte-consistente)
