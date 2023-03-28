var express = require('express');
var router = express.Router();
var usuarios = require('./../modelos/usuarios');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {
    title: "Buscador Proaction"
  });
});
router.post('/', async (req, res, next) => {
  try {
    var usuario = req.body.usuario;
    var password = req.body.password;

    var data = await usuarios.getUsuario(usuario, password);

    if (data != undefined) {
      req.session.nombre = data.usuario;
      res.redirect('/users');
      
    } else {
      res.render('index', {
        error: true
      });
    }
  } catch (error) {
    console.log(error);
  }
})

module.exports = router;
