const qrcode = require('qrcode-terminal');
const {Client} = require('whatsapp-web.js');
var consulta = require('./../modelos/consulta');



const client = new Client()

client.on('qr' , qr => {
  qrcode.generate(qr,{small:true});
});
client.on('ready', () =>{
  console.log('Cliente listo!!');
});
client.on('message', message => {
  if(message.body != ''){
    client.sendMessage( message.from ,'Buenos dias se comunico con Proaction para mas informacion marque 1 , para finalizar marque 2')
  }
  if(message.body != ''){
    let dni = message.body;
    let data = consulta.consulta(dni); 
    client.sendMessage( message.from ,`sus datos personales son ${data.nombre}`)
    console.log(data);
  };
  if(message.body === '2'){
    client.sendMessage( message.from ,'ok andate a cagar')
  }
})  ;

client.initialize();