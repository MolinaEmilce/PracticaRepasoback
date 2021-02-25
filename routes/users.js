var express = require('express');
var router = express.Router();

//MIDDLEWARES de ruta
const uploadImages = require('../middlewares/uploadImages'); //se encarga de ejecutar multer: nos permite manipular, guardar un archivo subido x el usuario
//MIDDLEWARES de validaciones 
const registerValidation= require('../validations/registerValidation');
//MIDDLEWARE de session
const checkUser = require('../middlewares/checkUser');


//SISTEMA DE REGISTRACION , metodos del controlador
 const {login,processLogin,register,processRegister,profile, cerrarSesion,eliminar} = require('../controllers/usersController');

router.get('/register', register);
router.post('/register',uploadImages.any(),registerValidation,processRegister);
//upload.any() : any() significa que podemos subir cualquier tipo de archivos */
router.get('/login',login);
router.post('/login',processLogin);

router.get('/profile',checkUser,profile);

router.delete('/delete/:id',eliminar);

router.get('/logout',cerrarSesion);//mata la session
//es decir que al matarla ya no aparece nisiquiera al inspecionarlo en la pagina
module.exports = router;

/*IMPORTANTE: si estamos utilizando en nuestros archivos formularios pero que
tienen una opcion de subida de archivos, hay que configurar multer para la subida de archivos.
y dentro de esa configuracion se detalle la detinacion y nombre del archivo externo. y lo colocamos entre el medio del la rednerizacion y el controlador quien almacena la info
si no se configura esto, al tener un input file y subido no me va a dejar mandar los datos, es decir no lo vaa dejar caputar la iformacion por el body
*/