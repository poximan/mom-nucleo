# Nucleo MOM (middleware-oriented message)
Componente central de una arquitectura mom (message-oriented middleware). Basado en intercambio de mensajes asincronicos con soporte de eventEmitter. No esta ligado a ningun negocio particular.

![alt text](https://github.com/poximan/mom-nucleo/imagenes/nucleo.png "Arquitectura")

## Parametros
param 1 = {entero} indice del que es responsable en reloj vectorial.

param 2 = {string} nombre de la cola MOM que escucha este servidor.

param 3 = {Object mom-bus-comunic} instancia de bus para gestion de eventos. Ver https://www.npmjs.com/package/mom-bus-comunic

param 4 = {String[.String]...} lista de suscriptores del servidor dado. Por ejemplo "server1.server2" para 2 suscriptores, "server3.server4.server5" para 3 suscriptores, o "" para 0 suscriptores.

param 5 = {entero} cantidad de confirmaciones externas para fin corte consistente. Solo util cuando incluye modulo de corte consistente https://www.npmjs.com/package/mom-corte-consistente.

param 6 = {[Object]} Estado actual del servidor. Es el arreglo de valores en memoria dinamica.

param 7 = {Function} llamada a funcion de persistencia del negocio.
<br/>

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
param1 = {String[.String]...} lista de suscriptores que recibiran el mensaje en sus cola de escucha. Por ejemplo "server1.server2" para 2 suscriptores, "server3.server4.server5" para 3 suscriptores, o "" para 0 suscriptores.

param2 = carga util del mensaje. De formato json libre.
Los mensajes entrantes/salientes se construyen pensando en capas. Cada capa tiene su encabezado. El middleware solo lee y escribe su capa, por lo tanto la carga util (este parametro) no esta acoplado al middleware, pudiendo ser de formato a medida del negocio.

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
La operacion es de delegacion, el responsable es el modulo de reloj vectorial (ver https://www.npmjs.com/package/mom-reloj-vect)

### Terceros: Reloj vectorial -> Pedir el Reloj
```
mw.vector();
```
Ofrece servicio de estado actual del vector de relojes a las capas superiores.
La operacion es de delegacion, el responsable es el modulo de reloj vectorial (ver https://www.npmjs.com/package/mom-reloj-vect)

### Terceros: Reloj vectorial -> Pedir indice
```
mw.indice();
```
Ofrece servicio de posicion en el vector de relojes, a las capas superiores.
La operacion es de delegacion, el responsable es el modulo de reloj vectorial (ver https://www.npmjs.com/package/mom-reloj-vect)

### Terceros: Corte Consistente -> socket del monitor
```
mw.sockRespuesta(socket);
```
Ofrece servicio de socket abierto con concentrador/monitor al modulo de corte consistente.
La operacion es reactiva, cuando se abre un socket monitor-servidor, se notifica.

### Terceros: Corte Consistente -> Corte el proceso
```
mw.corteEnProceso();
```
Ofrece informacion sobre si esta ejecutandose (o no) un corte consistente, a las capas superiores. Salva errores como persistir en BD el negocio durante un corte.
La operacion es de delegacion, la respuesta llega desde  el modulo de corte consistente (ver https://www.npmjs.com/package/mom-corte-consistente)

### Terceros: Corte Consistente -> Solicitud de corte
```
mw.iniciarCorte();
```
Ofrece servicio de iniciar corte consistente, a las capas superiores.
La operacion es de delegacion, la respuesta llega desde  el modulo de corte consistente (ver https://www.npmjs.com/package/mom-corte-consistente)
