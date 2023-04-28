var express = require('express');
var router = express.Router();
var consulta = require('./../modelos/consulta');
var trabajo = require('./../modelos/trabajo');
var vehiculos = require('./../modelos/vehiculos');
const qrcode = require('qrcode-terminal');
const { Client } = require('whatsapp-web.js');
const { end } = require('../modelos/bd');




router.get('/logout', function (req, res, next) {
  req.session.destroy();
  res.redirect('/index')
});

router.get('/eliminar/:telefono/:id/:dni', async (req, res, next) => {
  let id = req.params.id;
  let telefono = req.params.telefono;
  let dni = req.params.dni;
  let obj = {}
  obj[telefono] = null;
  await consulta.deletetelefono(obj, id);
  res.redirect(`/users/${dni}`)
});

router.get('/modificar/:id', async (req, res, next) => {
  let id = req.params.id;
  let telefonos = await consulta.getDatosById(id);
  res.render('modificar', {
    telefonos
  })
})

router.get('/generar', async (req, res, next) => {


  const client = new Client()
  client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
  });
  client.on('ready', () => {
    console.log('Cliente listo!!');
  });
  client.on('message', message => {
    if (message.body === '1') {
      client.sendMessage(message.from, `Por favor , indique su numero de dni , solo el numero sin puntos ni espacios`)
      return
    }
    else if (message.body.length === 8) {
      let dni = message.body;
      consulta.consulta(dni).then(val => {
        if (val != undefined) {
          client.sendMessage(message.from, `sus datos personales son Nombre: ${val.nombre} DNI: ${val.dni}`)
          client.sendMessage(`5491126401526@c.us`, `Se Acaba de comunicar una persona por el el DNI ${val.dni} desde el numero ${message.from}`)
          console.log("mensaje enviado")
          }
        else {
          client.sendMessage(message.from, `Disculpe no pudimos identificar su numero de dni intente nuevamente , recuerde solo numeros , sin puntos ni espacios`)
          return
        }
      }
      )
      return
    }
    else if (message.body === '2') {
      client.sendMessage(message.from, 'Muchas gracias por comunicarse con Estudio Angeloni Saludos!!')
      return

    }
          client.sendMessage(message.from, `Bienvenido por favor seleccione alguna de las siguientes opciones
          1. Para obtener mas informacion sobre su deuda
          2. Para Finalizar la conversación`)



  });

  client.initialize();


})

router.get('/:dni', async (req, res, next) => {
  let dni = req.params.dni;

  let data = await consulta.consulta(dni);

  let data1 = await trabajo.trabajo(dni);

  let data2 = await vehiculos.vehiculos(dni);
  if (data != undefined && data1 != undefined && data2 != undefined) {
    res.render('users', {
      layout: 'layout',
      persona: req.session.nombre,
      documento: data.dni,
      nombre: data.nombre,
      telefono01: data.telefono01,
      telefono02: data.telefono02,
      telefono03: data.telefono03,
      telefono04: data.telefono04,
      telefono05: data.telefono05,
      id: data.id,
      fijo01: data.fijo01,
      fijo02: data.fijo02,
      fijo03: data.fijo03,
      fijo04: data.fijo04,
      fijo05: data.fijo05,
      mail01: data.mail01,
      mail02: data.mail02,
      mail03: data.mail03,
      empresa: data1.empresa,
      cuit: data1.cuit,
      categoria: data1.categoria,
      vehiculo01: data2.vehiculo01,
      vehiculo02: data2.vehiculo02,
      vehiculo03: data2.vehiculo03,

    });
  }

  else if (data != undefined && data1 != undefined) {
    res.render('users', {
      layout: 'layout',
      persona: req.session.nombre,
      documento: data.dni,
      nombre: data.nombre,
      id: data.id,
      telefono01: data.telefono01,
      telefono02: data.telefono02,
      telefono03: data.telefono03,
      telefono04: data.telefono04,
      telefono05: data.telefono05,
      fijo01: data.fijo01,
      fijo02: data.fijo02,
      fijo03: data.fijo03,
      fijo04: data.fijo04,
      fijo05: data.fijo05,
      mail01: data.mail01,
      mail02: data.mail02,
      mail03: data.mail03,
      empresa: data1.empresa,
      cuit: data1.cuit,
      categoria: data1.categoria,
    });
  }

  else if (data != undefined && data2 != undefined) {
    res.render('users', {
      layout: 'layout',
      persona: req.session.nombre,
      documento: data.dni,
      nombre: data.nombre,
      id: data.id,
      telefono01: data.telefono01,
      telefono02: data.telefono02,
      telefono03: data.telefono03,
      telefono04: data.telefono04,
      telefono05: data.telefono05,
      fijo01: data.fijo01,
      fijo02: data.fijo02,
      fijo03: data.fijo03,
      fijo04: data.fijo04,
      fijo05: data.fijo05,
      mail01: data.mail01,
      mail02: data.mail02,
      mail03: data.mail03,
      vehiculo01: data2.vehiculo01,
      vehiculo02: data2.vehiculo02,
      vehiculo03: data2.vehiculo03,
    });
  }

  else if (data1 != undefined && data2 != undefined) {
    res.render('users', {
      layout: 'layout',
      persona: req.session.nombre,
      vehiculo01: data2.vehiculo01,
      vehiculo02: data2.vehiculo02,
      vehiculo03: data2.vehiculo03,
      empresa: data1.empresa,
      cuit: data1.cuit,
      categoria: data1.categoria,
    });
  }

  else if (data != undefined) {
    res.render('users', {
      layout: 'layout',
      persona: req.session.nombre,
      documento: data.dni,
      nombre: data.nombre,
      id: data.id,
      telefono01: data.telefono01,
      telefono02: data.telefono02,
      telefono03: data.telefono03,
      telefono04: data.telefono04,
      telefono05: data.telefono05,
      fijo01: data.fijo01,
      fijo02: data.fijo02,
      fijo03: data.fijo03,
      fijo04: data.fijo04,
      fijo05: data.fijo05,
      mail01: data.mail01,
      mail02: data.mail02,
      mail03: data.mail03,
    });
  }

  else if (data1 != undefined) {
    console.log(data1.empresa);
    res.render('users', {
      layout: 'layout',
      persona: req.session.nombre,
      empresa: data1.empresa,
      cuit: data1.cuit,
      categoria: data1.categoria,

    });
  }
  else if (data2 != undefined) {
    console.log(data1.empresa);
    res.render('users', {
      layout: 'layout',
      persona: req.session.nombre,
      vehiculo01: data2.vehiculo01,
      vehiculo02: data2.vehiculo02,
      vehiculo03: data2.vehiculo03,

    });
  }

  else {
    res.render('users', {
      persona: req.session.nombre,
      error: true
    });
  }

})

router.post('/modificar', async (req, res, next) => {
  try {
    let obj = {
      telefono01: req.body.celular1,
      telefono02: req.body.celular2,
      telefono03: req.body.celular3,
      telefono04: req.body.celular4,
      telefono05: req.body.celular5,
      fijo01: req.body.fijo1,
      fijo02: req.body.fijo2,
      fijo03: req.body.fijo3,
      fijo04: req.body.fijo4,
      fijo05: req.body.fijo5,
      mail01: req.body.mail1,
      mail02: req.body.mail2,
      mail03: req.body.mail3,
    }
    await consulta.modificarDatosById(obj, req.body.id);

    res.redirect(`/users/${req.body.dni}`)

  } catch (error) {
    console.log(error);

    res.render('modificar', {
      error: true,
      message: 'no se modificaron los datos'
    })
  }
})

router.post('/', async (req, res, next) => {
  try {
    var documento = req.body.documento;

    var data = await consulta.consulta(documento);

    var data1 = await trabajo.trabajo(documento);

    var data2 = await vehiculos.vehiculos(documento);

    if (data != undefined && data1 != undefined && data2 != undefined) {
      res.render('users', {
        layout: 'layout',
        persona: req.session.nombre,
        documento: data.dni,
        nombre: data.nombre,
        telefono01: data.telefono01,
        telefono02: data.telefono02,
        telefono03: data.telefono03,
        telefono04: data.telefono04,
        telefono05: data.telefono05,
        id: data.id,
        fijo01: data.fijo01,
        fijo02: data.fijo02,
        fijo03: data.fijo03,
        fijo04: data.fijo04,
        fijo05: data.fijo05,
        mail01: data.mail01,
        mail02: data.mail02,
        mail03: data.mail03,
        empresa: data1.empresa,
        cuit: data1.cuit,
        categoria: data1.categoria,
        vehiculo01: data2.vehiculo01,
        vehiculo02: data2.vehiculo02,
        vehiculo03: data2.vehiculo03,

      });
    }

    else if (data != undefined && data1 != undefined) {
      res.render('users', {
        layout: 'layout',
        persona: req.session.nombre,
        documento: data.dni,
        nombre: data.nombre,
        id: data.id,
        telefono01: data.telefono01,
        telefono02: data.telefono02,
        telefono03: data.telefono03,
        telefono04: data.telefono04,
        telefono05: data.telefono05,
        fijo01: data.fijo01,
        fijo02: data.fijo02,
        fijo03: data.fijo03,
        fijo04: data.fijo04,
        fijo05: data.fijo05,
        mail01: data.mail01,
        mail02: data.mail02,
        mail03: data.mail03,
        empresa: data1.empresa,
        cuit: data1.cuit,
        categoria: data1.categoria,
      });
    }

    else if (data != undefined && data2 != undefined) {
      res.render('users', {
        layout: 'layout',
        persona: req.session.nombre,
        documento: data.dni,
        nombre: data.nombre,
        id: data.id,
        telefono01: data.telefono01,
        telefono02: data.telefono02,
        telefono03: data.telefono03,
        telefono04: data.telefono04,
        telefono05: data.telefono05,
        fijo01: data.fijo01,
        fijo02: data.fijo02,
        fijo03: data.fijo03,
        fijo04: data.fijo04,
        fijo05: data.fijo05,
        mail01: data.mail01,
        mail02: data.mail02,
        mail03: data.mail03,
        vehiculo01: data2.vehiculo01,
        vehiculo02: data2.vehiculo02,
        vehiculo03: data2.vehiculo03,
      });
    }

    else if (data1 != undefined && data2 != undefined) {
      res.render('users', {
        layout: 'layout',
        persona: req.session.nombre,
        vehiculo01: data2.vehiculo01,
        vehiculo02: data2.vehiculo02,
        vehiculo03: data2.vehiculo03,
        empresa: data1.empresa,
        cuit: data1.cuit,
        categoria: data1.categoria,
      });
    }

    else if (data != undefined) {
      res.render('users', {
        layout: 'layout',
        persona: req.session.nombre,
        documento: data.dni,
        nombre: data.nombre,
        id: data.id,
        telefono01: data.telefono01,
        telefono02: data.telefono02,
        telefono03: data.telefono03,
        telefono04: data.telefono04,
        telefono05: data.telefono05,
        fijo01: data.fijo01,
        fijo02: data.fijo02,
        fijo03: data.fijo03,
        fijo04: data.fijo04,
        fijo05: data.fijo05,
        mail01: data.mail01,
        mail02: data.mail02,
        mail03: data.mail03,
      });
    }

    else if (data1 != undefined) {
      console.log(data1.empresa);
      res.render('users', {
        layout: 'layout',
        persona: req.session.nombre,
        empresa: data1.empresa,
        cuit: data1.cuit,
        categoria: data1.categoria,

      });
    }
    else if (data2 != undefined) {
      console.log(data1.empresa);
      res.render('users', {
        layout: 'layout',
        persona: req.session.nombre,
        vehiculo01: data2.vehiculo01,
        vehiculo02: data2.vehiculo02,
        vehiculo03: data2.vehiculo03,

      });
    }

    else {
      res.render('users', {
        persona: req.session.nombre,
        error: true
      });
    }
  } catch (error) {
    console.log(error);
  }
})

/*router.post('/', async (req, res, next) => {
try {
  var documento = req.body.documento;

  var data = await consulta.consulta(documento);

  if (data != undefined) {
    console.log(data.NOMBRE);

    res.render('users', {
      layout: 'layout',
      persona: req.session.nombre,
      documento: data.DNI,
      nombre: data.NOMBRE,
      mail: data.MAIL,
      telefono: data.TELEFONO1,
    });

  } else {
    res.render('users', {
      persona: req.session.nombre,
      error: true
    });
  }
} catch (error) {
  console.log(error);
}
})

 

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.render('users', {
    layout: 'layout',
    persona: req.session.nombre,

  });
});


module.exports = router;
